# Panorama de emendas — o agregado que falta

Levantamento feito ao construir os dois dashboards de emendas do perfil
(finalidade e destino do gasto), conferindo o que
`GET /parlamentares/:id/emendas` e `GET /parlamentares/:id/emendas/resumo`
devolvem hoje.

**Resposta curta à pergunta "seria possível?": sim — o dado já existe, o
agregado não.** Cada emenda já traz `funcao`, `subfuncao` e
`localidadeDoGasto`. O que não existe é uma rota que some isso por
parlamentar. Sem ela, o frontend só poderia somar as emendas da página
carregada — um total que *parece* certo e não é, justamente o tipo de número
que não pode aparecer numa ferramenta de fiscalização.

Por isso os dois painéis já estão no ar e se declaram indisponíveis enquanto o
agregado não vier: a lista de emendas continua mostrando finalidade e
localidade caso a caso, e o painel explica por que o resumo somado depende do
servidor. Assim que a rota responder com os campos abaixo, os gráficos
aparecem sem nenhuma outra mudança no frontend.

---

## 1. Dois recortes em `GET /parlamentares/:id/emendas/resumo`

**O que a rota devolve hoje.** Só os totais globais:

```jsonc
{ "totalEmendas": 87,
  "totalEmpenhado": "48250000.00",
  "totalLiquidado": "31000000.00",
  "totalPago": "22400000.00",
  "totalRestoInscrito": "4100000.00" }
```

**Pedido.** Dois arrays a mais na mesma resposta — nenhuma rota nova, nenhum
parâmetro novo:

```jsonc
{ "totalEmendas": 87,
  "totalEmpenhado": "48250000.00",
  "totalLiquidado": "31000000.00",
  "totalPago": "22400000.00",
  "totalRestoInscrito": "4100000.00",

  "porFuncao": [
    { "funcao": "Saúde",     "quantidade": 31, "empenhado": "21400000.00", "pago": "11200000.00" },
    { "funcao": "Educação",  "quantidade": 18, "empenhado": "9800000.00",  "pago": "6100000.00"  }
  ],

  "porLocalidade": [
    { "localidade": "SÃO PAULO - SP", "quantidade": 14, "empenhado": "12800000.00", "pago": "7300000.00" },
    { "localidade": "CAMPINAS - SP",  "quantidade": 8,  "empenhado": "6400000.00",  "pago": "3100000.00"  }
  ],

  "metadata": { "semFuncao": 3, "semLocalidade": 7 }
}
```

São dois `GROUP BY` sobre as emendas já vinculadas ao parlamentar — a mesma
população que alimenta `totalEmendas`.

### Detalhes que importam

**Agrupar por `funcao`, não por `subfuncao`.** A função responde "em que área
este parlamentar atua" com um punhado de categorias legíveis. A subfunção
esmigalha demais e cada barra vira um caso isolado. A subfunção continua útil
onde já está: no detalhe de cada emenda.

**`localidade` é o texto do Portal, sem normalizar.** `localidadeDoGasto` vem
como `"SÃO PAULO - SP"`. Se houver variação de grafia na fonte para o mesmo
município, agrupar como a fonte manda e não tentar unificar — dois municípios
homônimos em estados diferentes são destinos diferentes, e uma unificação
errada esconde para onde o dinheiro foi de verdade. Se der para deduplicar com
código de município (IBGE/SIAFI), melhor ainda; se não, o texto serve.

**`empenhado` e `pago`, não só contagem.** Uma emenda de R$ 5 milhões e uma de
R$ 50 mil contam igual numa contagem, e é o dinheiro que diz onde o
parlamentar de fato atua. A barra dos dois painéis mede o **empenhado**; o
pago aparece no tooltip, porque é ele que saiu do caixa. A quantidade fica ao
lado das duas, para distinguir muitas emendas pequenas de poucas grandes.

**Valores como string decimal.** Mesmo formato dos totais que a rota já
devolve (`"21400000.00"`) — o frontend já converte. Evita perda de precisão em
float para valores na casa dos milhões.

**`metadata.semFuncao` / `semLocalidade`.** Emendas sem o campo preenchido na
fonte **ficam fora dos arrays** e são contadas aqui. O painel diz na tela
quantas ficaram de fora e por quê. Sem isso, a soma das barras não bate com
`totalEmpenhado` e o usuário não tem como saber se é bug ou lacuna da fonte.
Jogar as sem-dado num balde `"Não informado"` seria pior: vira uma barra
grande competindo com áreas reais.

**Sem limite de itens.** São poucas dezenas de linhas por parlamentar no pior
caso. O frontend já mostra as 8 maiores e esconde a cauda atrás de um botão —
mas a cauda precisa chegar. Se por algum motivo houver corte no servidor, ele
precisa vir declarado no `metadata` para o painel poder avisar.

**Ordenação livre.** O frontend reordena por valor empenhado de qualquer
forma.

---

## 2. O que o frontend já faz sem depender disto

Não é bloqueio para nada que está no ar:

- A lista de emendas do perfil mostra função, subfunção e localidade de cada
  emenda, com paginação servida pelo backend.
- O detalhe de cada emenda mostra os documentos por fase, e agora explica cada
  fase (empenho, liquidação, pagamento) num "?" ao lado do nome — a distinção
  entre "reservado" e "efetivamente pago" é a que mais confunde quem lê emenda
  pela primeira vez.
- Os dois painéis de panorama existem e se declaram indisponíveis, sem
  inventar número nenhum.

## 3. Como o frontend vai reagir

`getPanoramaEmendas()` aceita `porFuncao` **ou** `porArea` como nome do
primeiro array, e trata a ausência dos dois como "indisponível". Ou seja: a
resposta atual continua funcionando, e a resposta nova liga os gráficos
sozinha — não há ordem de deploy a coordenar.
