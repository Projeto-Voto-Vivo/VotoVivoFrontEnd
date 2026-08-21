# Orientação de votação — o que falta para exibi-la com precisão

Levantamento feito ao construir o painel de votações do perfil e o painel
temático, conferindo `src/services/alignment.service.ts`,
`src/services/theme-profile.service.ts`, `src/services/parliamentarian.service.ts`
e o schema do agregador (`popular/schema.sql`).

Nada aqui bloqueia o que está no ar. Os três painéis funcionam hoje e declaram
as próprias limitações na interface. O que estes pedidos mudam é o **teto de
precisão**: com eles, dá para afirmar coisas que hoje precisam de ressalva.

Ordenados por custo. O item 3 é o único que exige dado novo.

---

## 1. Orientação por votação em `GET /parlamentares/:id/votacoes`

**O que falta.** A rota devolve o voto do parlamentar, mas não contra o quê ele
foi dado:

```jsonc
{ "id": 10, "casa": "Camara", "data": "2026-06-18", "titulo": "...",
  "resumo": "...", "voto": "SIM", "resultado": "Aprovada", "tipo": "NOMINAL",
  "proposicao": { ... } }
```

Sem orientação na linha, cada card mostra o voto isolado. A taxa agregada de
aderência existe (via `/perfil`), mas ela responde "87%" sem deixar ver **quais**
votações divergiram — que é justamente o que interessa a quem fiscaliza.

**Pedido.** Três campos por item:

```jsonc
{ "orientacaoPartido": "NAO",
  "siglaPartidoNaData": "PT",
  "seguiuOrientacao": false }
```

`seguiuOrientacao` deve ser `null`, e não `false`, quando não há o que comparar:
bancada liberada, "Artigo 17", voto de ausência. `false` significa divergência
de fato; `null` significa que a pergunta não se aplica. Colapsar os dois faz o
front contar liberação como deslealdade.

**Por que é barato.** `alignment.service` já faz exatamente esta comparação, com
as duas armadilhas resolvidas: partido **na data da votação** (via
`filiacaoPartidaria`, não `partidoAtual`) e exclusão das liberadas. É expor por
linha o que já se calcula em agregado, não regra nova.

O frontend já tem os campos mapeados (`VotacaoPerfil.orientacaoPartido`,
`siglaPartidoNaData`, `seguiuOrientacao`) e o card já sabe renderizá-los —
ficaram inertes desde que descobrimos que a rota não os envia. Assim que
chegarem, aparecem sem mudança no front.

---

## 2. Todas as bancadas, não só o partido

**O que existe.** `orientacaoVotacao` tem uma linha por bancada
(`UNIQUE (idVotacao, siglaBancada)`), e `GET /votacoes/:id` já devolve todas —
a página de tramitação da proposição usa esse bloco.

**O que falta.** Esse mesmo bloco no item de `/parlamentares/:id/votacoes`, ou
ao menos as bancadas transversais:

```jsonc
{ "orientacoes": [
    { "bancada": "PT", "orientacao": "SIM" },
    { "bancada": "Governo", "orientacao": "SIM" },
    { "bancada": "Minoria", "orientacao": "NAO" }
] }
```

**Por que importa.** "Seguiu o partido" e "seguiu o governo" são perguntas
diferentes, e a resposta interessante costuma estar onde elas divergem. Com uma
orientação só, um voto contra o próprio partido mas alinhado ao governo aparece
como simples divergência — quando é informação política.

Se o custo por linha preocupar, um campo `orientacoes` apenas no detalhe de uma
votação já resolve: o front pode buscar sob demanda ao expandir o card.

---

## 3. Classificar o objeto da votação

Este é o que resolve a ambiguidade de raiz, e o único que precisa de dado novo.

**O problema.** `votacao.resumoMateria` é texto livre, e as colunas de `votacao`
são `idApi, casa, idProposicao, idOrgao, idEvento, dataHora, resumoMateria,
resultadoFinal, tipoVotacao`. Não há nada que diga **sobre o que** se votou.

Isso faz SIM e NÃO perderem significado estável. A mesma votação pode ser sobre:

- o texto principal — SIM aprova a matéria;
- um destaque supressivo — **NÃO** é que preserva o texto;
- um requerimento de urgência — o voto é sobre o rito, não sobre o mérito;
- a redação final — voto quase sempre unânime, ruído em qualquer estatística.

Por isso o painel temático rotula "mais votos SIM", e não "mais apoia": chamar
de apoio seria afirmar algo que o dado não sustenta. A ressalva está na tela, mas
ressalva é remendo — o certo é ter o campo.

**Pedido.** Uma classificação derivada, no mesmo padrão de
`classificarNatureza` em `src/domain/presence.ts`: lista explícita, comparação
por igualdade normalizada, e um valor de falha segura.

```ts
type ObjetoVotacao =
  | 'TEXTO_BASE'
  | 'DESTAQUE'
  | 'EMENDA'
  | 'REQUERIMENTO'      // urgência, retirada de pauta, adiamento
  | 'REDACAO_FINAL'
  | 'INDEFINIDO';       // fora das listas ou resumo nulo — nunca chuta
```

Exposta em `GET /parlamentares/:id/votacoes`, em `/votacoes/:id` e, sobretudo,
como filtro em `GET /parlamentares/:id/temas`:

```
GET /parlamentares/:id/temas?objeto=TEXTO_BASE
```

**O que isso destrava no front.** O painel temático passa a poder restringir a
análise às votações de mérito, onde SIM significa apoio — e aí "os temas em que
mais vota a favor" vira uma afirmação defensável, não um rótulo com nota de
rodapé. `INDEFINIDO` sai da conta e é declarado, como já se faz com os eventos
sem classificação na presença.

**Antes de escrever o classificador, vale conferir a fonte.** A API da Câmara
publica mais campos por votação do que o `resumoMateria` que o agregador guarda
— se houver descrição ou objeto estruturado, guardar essa coluna torna a
classificação muito mais confiável do que regex sobre texto de resumo. Se não
houver, o classificador por lista explícita continua valendo: é o que já
funcionou para a natureza dos eventos de presença.

---

## Fora destes três

`GET /parlamentares/:id/alinhamento` como rota própria. Hoje a taxa de aderência
só existe dentro de `GET /parlamentares/:id/perfil`, que roda todas as consultas
do parlamentar. O front paga uma requisição cara para preencher um card, e por
isso só a dispara quando o painel de votações abre. O `alignment.service` já é
chamado isoladamente lá dentro — falta só uma rota.

Ver também [`TRAMITACAO_REQUISITOS.md`](./TRAMITACAO_REQUISITOS.md), que cobre o
que falta para a página de tramitação da proposição.
