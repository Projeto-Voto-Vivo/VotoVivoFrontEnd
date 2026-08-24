# Panorama de emendas — o agregado que falta

Levantamento feito ao construir os dois dashboards de emendas do perfil
(finalidade e destino do gasto), conferindo o que
`GET /parlamentares/:id/emendas` e `GET /parlamentares/:id/emendas/resumo`
devolvem hoje.

> **Estado em agosto/2026 — atendido.** O backend entregou os dois recortes,
> mais os valores empenhados fora deles, que o pedido não tinha previsto e
> fazem a conta fechar. O corpo do documento fica como registro do raciocínio;
> a seção final diz o que mudou e onde este texto errou.

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

**O que a rota devolvia.** Só os totais globais, como **número**, e sem
`totalRestoInscrito` — a primeira versão deste documento errou nos dois pontos:

```jsonc
{ "totalEmendas": 23,
  "totalEmpenhado": 73328694.97,
  "totalLiquidado": 31000000.55,
  "totalPago": 22400000.10 }
```

**Pedido.** Dois arrays a mais na mesma resposta — nenhuma rota nova, nenhum
parâmetro novo:

```jsonc
{ "totalEmendas": 23,
  "totalEmpenhado": 73328694.97,   // os totais seguem número
  "totalLiquidado": 31000000.55,
  "totalPago": 22400000.10,
  "totalRestoInscrito": 4100000.00,

  "porFuncao": [
    { "funcao": "Saúde",     "quantidade": 31, "empenhado": "21400000.00", "pago": "11200000.00" },
    { "funcao": "Educação",  "quantidade": 18, "empenhado": "9800000.00",  "pago": "6100000.00"  }
  ],

  "porLocalidade": [
    { "localidade": "SÃO PAULO - SP", "quantidade": 14, "empenhado": "12800000.00", "pago": "7300000.00" },
    { "localidade": "CAMPINAS - SP",  "quantidade": 8,  "empenhado": "6400000.00",  "pago": "3100000.00"  }
  ],

  "metadata": { "semFuncao": 3, "empenhadoSemFuncao": "1280000.00",
                "semLocalidade": 7, "empenhadoSemLocalidade": "4210000.00" }
}
```

São dois `GROUP BY` sobre as emendas já vinculadas ao parlamentar — a mesma
população que alimenta `totalEmendas`.

### Detalhes que importam

**Agrupar por `funcao`, não por `subfuncao`.** A função responde "em que área
este parlamentar atua" com um punhado de categorias legíveis. A subfunção
esmigalha demais e cada barra vira um caso isolado. A subfunção continua útil
onde já está: no detalhe de cada emenda.

**`localidade` é o texto do Portal, sem normalização feita à mão.**
`localidadeDoGasto` vem como `"SÃO PAULO - SP"`. O que não pode acontecer é
unificar por semelhança: dois municípios homônimos em estados diferentes são
destinos diferentes, e juntá-los esconde para onde o dinheiro foi.

Na prática o `GROUP BY` já resolve o caso bom sozinho — a collation
`utf8mb4_unicode_ci` faz `sao paulo - sp` e `SÃO PAULO - SP` caírem no mesmo
balde, e mantém `BOM JESUS - RS` separado de `BOM JESUS - PI`. É exatamente o
comportamento desejado, e não precisa de código.

**`empenhado` e `pago`, não só contagem.** Uma emenda de R$ 5 milhões e uma de
R$ 50 mil contam igual numa contagem, e é o dinheiro que diz onde o
parlamentar de fato atua. A barra dos dois painéis mede o **empenhado**; o
pago aparece no tooltip, porque é ele que saiu do caixa. A quantidade fica ao
lado das duas, para distinguir muitas emendas pequenas de poucas grandes.

**Valores como string decimal nos arrays; os totais ficam como estão.** String
evita perda de precisão em float para valores na casa dos milhões. Os totais
já saem como número e mudá-los seria breaking change para quem os consome hoje
— não é o que este pedido quer. O frontend converte os dois formatos, então a
resposta pode ser mista sem problema.

**`metadata`: quantas ficaram de fora e quanto elas somam.** Emendas sem o
campo preenchido na fonte **ficam fora dos arrays**. Jogá-las num balde
`"Não informado"` seria pior: vira uma barra grande competindo com áreas
reais.

A contagem sozinha não fecha a conta, e é a conta que o painel precisa poder
explicar: 3 emendas de fora podem ser R$ 3 mil ou R$ 30 milhões, e nos dois
casos a soma das barras não bate com `totalEmpenhado`. Daí
`empenhadoSemFuncao` e `empenhadoSemLocalidade` ao lado das contagens —
com eles, `totalEmpenhado − empenhadoSemFuncao` é exatamente a soma de
`porFuncao`, e o painel diz na tela quanto ficou de fora em vez de deixar o
leitor achar que é bug.

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

---

## 4. O que foi entregue (agosto/2026)

Os dois recortes estão no ar, e os gráficos ligaram sem mudança de contrato do
lado do frontend. Três diferenças em relação ao que este documento pedia, todas
para melhor:

1. **Os totais continuam número; só os arrays vêm como string.** O pedido
   original dizia "mesmo formato dos totais que a rota já devolve" achando que
   eles eram string — não eram. Mudá-los seria breaking change fora do escopo.
   `parseMoney` já aceitava os dois formatos, então a resposta mista funciona.
2. **`totalRestoInscrito` foi adicionado** (número, como os irmãos). Este
   documento o listava como existente; a coluna estava lá, o campo não.
3. **`empenhadoSemFuncao` / `empenhadoSemLocalidade` vieram além das
   contagens** — não estavam no pedido e são o que faz a conta fechar na tela.
   O painel agora diz "fora das barras: 4 emendas sem finalidade na fonte,
   R$ 12,8 mi empenhados", em vez de só a contagem.

Nada ficou pendente.
