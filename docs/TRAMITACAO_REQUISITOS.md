# Página de tramitação — o que falta no banco e na API

Levantamento feito ao construir `/proposicoes/[id]`, conferindo o schema do
agregador (`VotoVivoDataAggregator/popular/schema.sql`), o `schema.prisma` e os
controllers do `VotoVivoBackEnd`.

A página já funciona sem nenhuma das mudanças abaixo: cada bloco sem dado mostra
um estado explícito de ausência, nunca um vazio silencioso. Os itens estão
ordenados por custo — os primeiros são só expor o que já está gravado.

---

## 1. Já está no banco, falta expor na API

### 1.1 Histórico de tramitação — **é o coração da página**

A tabela `tramitacao` existe e está mapeada no Prisma (`Proposition.tramitacao`),
com `sequencia`, `dataHora`, `descricaoTramitacao`, `descricaoSituacao` e
`despacho`. Nenhuma rota devolve esses dados.

**Rota esperada pelo frontend:**

```
GET /proposicoes/:id/tramitacoes  ->  { data: Etapa[], meta: {...} }
```

```jsonc
{
  "id": 1,
  "sequencia": 3,
  "dataHora": "2026-04-02T10:30:00",
  "descricaoTramitacao": "Recebimento pela CCTCI",
  "descricaoSituacao": "Aguardando designação de relator",
  "despacho": "...",
  "regime": "Prioridade",                    // tipoTramitacao.regime
  "orgao": { "id": 12, "sigla": "CCTCI", "nome": "...", "tipoOrgao": "Comissão Permanente", "casa": "Camara" }
}
```

A página também aceita a tramitação embutida em `GET /proposicoes/:id`, como
array `tramitacao` ou `tramitacoes` — o que for mais conveniente para o backend.

**Bloqueio no Prisma.** `tramitacao.idTipoTramitacao` e `tramitacao.idOrgao` são
`Int?` soltos, sem `@relation`. Sem elas não dá para fazer `include` do órgão nem
do regime, que são justamente o que dá sentido à etapa. É preciso declarar:

```prisma
model tramitacao {
  // ...
  tipoTramitacao tipoTramitacao? @relation(fields: [idTipoTramitacao], references: [idTipoTramitacao])
  orgao          orgao?          @relation(fields: [idOrgao], references: [idOrgao])
}
```

No banco, `tramitacao.idOrgao` também não tem FK nem índice — vale adicionar os
dois (o índice importa: a consulta filtra por proposição e junta órgão).

Ordenar por `sequencia` quando houver, caindo para `dataHora`. A página reordena
de qualquer jeito, mas ordenado na origem evita surpresa.

### 1.2 Autoria no payload da proposição

`autoriaProposicao` / `PropositionAuthor` já está mapeado e não é devolvido.
Basta incluir em `GET /proposicoes/:id`:

```jsonc
"autores": [
  { "id": 1, "nomeParlamentar": "...", "siglaPartido": "PT", "uf": "SP", "urlFoto": "..." }
]
```

### 1.3 `apiId` da proposição

`proposicao.idApi` existe, mas `getPropositionById` não o devolve. Com ele a
página monta o link para a ficha oficial (Câmara e Senado têm URL determinística
a partir desse id). Sem ele, o botão "ver na fonte oficial" não aparece.

### 1.4 Órgão da votação

`Voting` **já tem** a relação `orgao` no Prisma — falta só o `include` e o campo
no payload de `/votacoes/:id` e no bloco `votacoes` da proposição. Saber que a
votação foi na CCJC e não no Plenário muda a leitura do placar.

### 1.5 Placar agregado da votação

Hoje o único jeito de montar o placar é `GET /votacoes/:id`, que devolve a lista
inteira de votos — até 513 objetos por votação. A página limita o detalhamento às
8 primeiras votações por isso, e avisa na interface quando não detalhou.

**Pedido:** um agregado calculado em SQL, no mesmo payload:

```jsonc
"placar": { "SIM": 312, "NAO": 121, "ABSTENCAO": 9, "OBSTRUCAO": 24,
            "AUSENCIA JUSTIFICADA": 7, "AUSENTE": 40, "NAO REGISTRADO": 0 }
```

A página já prefere esse campo quando ele existe e só cai na contagem manual se
ele faltar. Com ele, dá para detalhar todas as votações sem custo.

Enquanto isso, `votos` deveria ser paginado — é a última listagem sem `take`.

---

## 2. Não existe no banco

### 2.1 Documentos da proposição — **a lacuna mais visível**

Não há tabela de documentos de proposição. `emendaDocumento` cobre só emendas
orçamentárias, e `proposicao` não tem campo de inteiro teor. Ou seja: hoje o
cidadão não consegue ler o texto do projeto pelo Voto Vivo.

Sugestão mínima:

```sql
CREATE TABLE documentoProposicao (
    idDocumento     INT AUTO_INCREMENT PRIMARY KEY,
    idApi           VARCHAR(50),
    idProposicao    INT NOT NULL,
    tipo            VARCHAR(100),        -- Inteiro teor, Parecer, Relatório, Redação final
    titulo          VARCHAR(500),
    dataPublicacao  DATETIME NULL,
    urlInteiroTeor  VARCHAR(1000),
    FOREIGN KEY (idProposicao) REFERENCES proposicao(idProposicao) ON DELETE CASCADE,
    UNIQUE KEY unique_documento_proposicao (idApi, idProposicao)
);
```

Rota: `GET /proposicoes/:id/documentos`. A página já consome esse formato
(`titulo`, `tipo`, `data`, `url`) e mostra o aviso de ausência enquanto não existir.

### 2.2 Relatoria

Não há registro de relator — nem coluna em `tramitacao`, nem tabela própria.
"Quem é o relator" é uma das primeiras perguntas de quem acompanha um projeto.

```sql
CREATE TABLE relatoriaProposicao (
    idRelatoria     INT AUTO_INCREMENT PRIMARY KEY,
    idProposicao    INT NOT NULL,
    idOrgao         INT NULL,
    idParlamentar   INT NULL,
    dataDesignacao  DATETIME NULL,
    dataDestituicao DATETIME NULL,
    ...
);
```

### 2.3 Autoria não-parlamentar

`autoriaProposicao` só liga proposição a `parlamentar`. Projeto do Executivo, do
Judiciário, de comissão ou de iniciativa popular fica **sem autor nenhum** — e a
página não tem como distinguir "não tem autor" de "o autor não é parlamentar".

Sugestão: `autoriaProposicao.tipoAutor` (`PARLAMENTAR`, `ORGAO`, `EXECUTIVO`,
`JUDICIARIO`, `POPULAR`) e `nomeAutorExterno` para os casos sem `idParlamentar`.

Vale junto: ordem/qualificação da autoria (autor principal × coautor), hoje
inexistente — o `PRIMARY KEY (idParlamentar, idProposicao)` não guarda ordem.

### 2.4 Campos menores da proposição

- **Justificativa e palavras-chave**: só existe `ementa`. A justificativa é o que
  explica o projeto em linguagem de gente.
- **Data da situação atual**: `statusAtual` é texto solto sem data. Hoje a página
  deduz a data pela última etapa da tramitação — só funciona com o item 1.1.
- **Urgência / regime atual**: existe por etapa (`tipoTramitacao.regime`), não
  como estado corrente da proposição.

---

## 3. Fora do escopo desta página, mas apareceu no caminho

`notFound()` renderiza a página 404 corretamente, mas a resposta sai com status
HTTP 200 — inclusive nas rotas que já existiam (`/parlamentares/abc`). Buscadores
indexam página de erro como se fosse conteúdo. Merece uma correção própria.
