# VotoVivo Frontend

Frontend em Next.js para consulta e visualização de dados públicos do Legislativo brasileiro, com foco em perfis parlamentares, emendas, proposições, votações e despesas.

A aplicação apresenta informações de forma organizada, responsiva e consumindo dados da API do VotoVivo para apoiar a navegação por indicadores e registros relacionados à atuação parlamentar.

## Funcionalidades
* Página inicial com busca e destaques
* Consulta de parlamentares (Câmara e Senado)
* Perfil detalhado de parlamentar
* Visualização de:
  * Emendas parlamentares
  * Proposições
  * Votações
  * Despesas
* Integração com API própria

## Tecnologias utilizadas

- [Next.js 15](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ESLint](https://eslint.org/)
- [Docker](https://www.docker.com/) (para produção)

## Requisitos

* Node.js 20.9+ recomendado
* Backend do VotoVivo rodando em `http://localhost:3001`

## Configuração

Crie um arquivo `.env.local` na raiz com:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Também existe um `.env.example` pronto como referência.

## Rodando o frontend

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Build de produção

```bash
npm run build
npm start
```

## Integração com o backend

O frontend consome a API REST do VotoVivo para carregar dados de parlamentares, perfis, emendas, proposições, votações, presença e despesas.

A URL base da API é definida pela variável:

```env
NEXT_PUBLIC_API_URL
```

## Estrutura principal

```bash
.
├── app
├── components
├── public
├── services
├── types
├── package.json
└── README.md
```


## 📂 O que vai em cada pasta

### `app/`

Define as rotas e páginas da aplicação usando o **App Router** do Next.js.

- `page.tsx`: página de uma rota
- `layout.tsx`: layout compartilhado
- `globals.css`: estilos globais

Exemplos:

| Rota                              | Caminho no arquivo                      |
|-----------------------------------|-----------------------------------------|
| Home                              | `app/page.tsx`                          |
| Listagem de parlamentares         | `app/parlamentares/page.tsx`            |
| Perfil de um parlamentar           | `app/parlamentares/[id]/page.tsx`       |
| Detalhe de emenda                 | `app/parlamentares/[id]/emendas/[idEmenda]/page.tsx` |
| Página de educação                | `app/educacao/page.tsx`                 |
| Página do projeto                 | `app/projeto/page.tsx`                  |

### `components/`

Guarda componentes reutilizáveis da interface.

#### `components/home/`

Componentes usados na página inicial:

- `HeroSearch.tsx`: seção principal de busca
- `Destaques.tsx`: bloco de destaques
- `ParlamentarCard.tsx`: card para exibir parlamentares em listas
- `BrasilHeroMap.tsx`: mapa interativo da home

#### `components/layout/`

Componentes estruturais compartilhados:

- `HeaderLayout.tsx`: cabeçalho reutilizável
- `FooterLayout.tsx`: rodapé da aplicação
- `BrowserLoadingTitle.tsx`: título durante carregamento

#### `components/parlamentares/`

Componentes relacionados ao domínio de parlamentares.

##### `components/parlamentares/emendas/`

- `EmendaDetailPage.tsx`: detalhe visual de emenda

##### `components/parlamentares/profile/`

Composição visual da página de perfil:

- `ParlamentarProfilePage.tsx`: estrutura principal
- `ParlamentarHero.tsx`: seção de topo
- `ParlamentarIndicators.tsx`: indicadores resumidos
- `ParlamentarPanels.tsx`: controlador dos painéis

##### `components/parlamentares/profile/panels/`

Painéis/abas do perfil:

- `VisaoGeralPanel.tsx`: visão geral
- `ProposicoesPanel.tsx`: proposições e matérias
- `EmendasPanel.tsx`: emendas parlamentares
- `VotacoesPanel.tsx`: votações e posicionamentos
- `DespesasPanel.tsx`: registros de despesas

##### `components/parlamentares/profile/shared/`

Componentes e utilitários compartilhados:

- `MicroInfoCard.tsx`: card pequeno de informação
- `PanelButton.tsx`: botão para alternar painéis
- `SectionShell.tsx`: estrutura visual padrão
- `formatters.ts`: formatação de moeda e data

#### `components/projeto/`

- `ProjetoSection.tsx`: seção relacionada ao projeto

### `services/`

Centraliza chamadas à API:

- `api.ts`: configuração base do cliente HTTP
- `parlamentares.ts`: funções para consulta de parlamentares e dados associados

### `types/`

Interfaces e tipos TypeScript:

- `Parlamentar`
- `ParlamentarPerfil`
- `EmendaDetalhe`
- `Despesa`

### `public/`

Imagens e arquivos estáticos:

- Imagens do sistema eleitoral (`icone-eleitoral-majoritatio.png`, `icone-eleitoral-proporcional.png`)
- Ícone de informação (`info-sistema-eleitoral.png`)

