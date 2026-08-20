# Página de tramitação — o que falta no banco e na API

Levantamento feito ao construir `/proposicoes/[id]`, conferindo o schema do
agregador (`VotoVivoDataAggregator/popular/schema.sql`), o `schema.prisma` e os
controllers do `VotoVivoBackEnd`.

A página funciona com ou sem cada um destes dados: todo bloco sem informação
mostra um estado explícito de ausência, nunca um vazio silencioso.

> **Estado em agosto/2026.** O backend implementou quase tudo o que este
> documento pedia. O que continua pendente está na seção 2 (dados que não
> existem no banco) e no item 1.5. O frontend já consome tudo o que foi
> entregue.

## 0. Já resolvido pelo backend

`GET /proposicoes` passou a aceitar `tipo`, `ano`, `casa`, `situacao`, `tema` e
`busca`, e `GET /proposicoes/filtros` devolve os domínios de cada um com
contadores. A busca de proposições do frontend (`/proposicoes`) foi construída
em cima disso — filtro e paginação acontecem no servidor, sobre o universo
completo, e não sobre a página que o navegador por acaso baixou.

**Entregue também:** o filtro `autor` em `GET /proposicoes`, que cruza autoria
com tipo, ano, casa, situação, tema e busca no banco. O painel de proposições do
perfil passou a usá-lo: mostra todas as proposições do parlamentar, paginadas e
filtradas no servidor, sem o recorte em memória e sem truncar.

Além disso, agora estão disponíveis e em uso:

- `GET /proposicoes/:id/tramitacoes` — paginado, com órgão e regime resolvidos.
  O frontend segue as páginas até um teto de 10.
- `apiId`, `autores` e o bloco `autoria` em `GET /proposicoes/:id`.
- `placar` agregado e `orgao` em cada votação da proposição. Isso eliminou uma
  requisição por votação: só a orientação das bancadas ainda exige ida a
  `/votacoes/:id`, e apenas nas primeiras votações.

**Uma observação de uso:** `/proposicoes/filtros` devolve domínios globais, não
facetados por autor. No painel do perfil isso significa que o usuário pode
escolher uma situação que aquele parlamentar não tem, e receber lista vazia. É
um efeito aceitável — a alternativa custaria uma query por dimensão a cada
requisição —, mas se incomodar, o caminho é aceitar `autor` também em
`/proposicoes/filtros`.

---

## 1. Estava no banco e foi exposto — histórico

Todos os itens desta seção foram entregues e já são consumidos pelo frontend.
Ficam registrados porque explicam decisões que continuam valendo.

| Item | Como ficou |
|------|-----------|
| Histórico de tramitação | `GET /proposicoes/:id/tramitacoes`, paginado, ordenado por `sequencia` com `dataHora` de desempate. |
| Órgão e regime de cada etapa | Resolvidos por consulta separada, e não por `@relation`: `tramitacao.idOrgao` e `idTipoTramitacao` não têm FK no banco, e declarar a relação no Prisma faria o schema divergir de produção. A correção de raiz continua sendo adicionar FK e índice no agregador. |
| Autoria e `apiId` da proposição | No payload de `GET /proposicoes/:id`. O `apiId` é o que permite montar o link para a ficha oficial. |
| Órgão da votação | No bloco `votacoes`. Saber que foi na CCJC e não no Plenário muda a leitura do placar. |
| Placar agregado | Um `groupBy` por proposição, com as sete chaves sempre presentes. Antes exigia baixar até 513 objetos de voto por votação. |

**O que restou deste bloco:** `votos` em `GET /votacoes/:id` ainda vem sem
paginação — é a última listagem sem `take`. O frontend só a consulta para pegar
a orientação das bancadas, e apenas nas primeiras votações de cada proposição.

Um detalhe de contrato: o placar usa as chaves do enum do Prisma
(`AUSENCIA_JUSTIFICADA`, `NAO_REGISTRADO`, com underscore), enquanto o banco
grava com espaço. O frontend normaliza as duas grafias, então qualquer uma serve.

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
O backend passou a devolver um bloco `autoria.observacao` avisando disso, e a
página o exibe — mas é um remendo: o dado em si continua faltando.

Sugestão: `autoriaProposicao.tipoAutor` (`PARLAMENTAR`, `ORGAO`, `EXECUTIVO`,
`JUDICIARIO`, `POPULAR`) e `nomeAutorExterno` para os casos sem `idParlamentar`.

Vale junto: ordem/qualificação da autoria (autor principal × coautor), hoje
inexistente — o `PRIMARY KEY (idParlamentar, idProposicao)` não guarda ordem.

### 2.4 Campos menores da proposição

- **Justificativa e palavras-chave**: só existe `ementa`. A justificativa é o que
  explica o projeto em linguagem de gente.
- **Data da situação atual**: `statusAtual` é texto solto sem data. Hoje a página
  deduz a data pela última etapa da tramitação.
- **Urgência / regime atual**: existe por etapa (`tipoTramitacao.regime`), não
  como estado corrente da proposição.

---

## 3. Fora do escopo desta página, mas apareceu no caminho

`notFound()` renderiza a página 404 corretamente, mas a resposta sai com status
HTTP 200 — inclusive nas rotas que já existiam (`/parlamentares/abc`). Buscadores
indexam página de erro como se fosse conteúdo. Merece uma correção própria.
