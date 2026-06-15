# VotoVivo Frontend

Frontend em Next.js para consulta e visualização de dados públicos do Legislativo brasileiro, com foco em perfis parlamentares, emendas, proposições, votações e despesas.

A aplicação apresenta informações de forma organizada, responsiva e consumindo dados da API do VotoVivo para apoiar a navegação por indicadores e registros relacionados à atuação parlamentar.

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

## O que vai em cada pasta

### `app/`

Define as rotas e páginas da aplicação.

* `page.tsx`: página de uma rota.
* `layout.tsx`: layout compartilhado.
* `globals.css`: estilos globais.
* Exemplo:

  * `app/page.tsx` → home
  * `app/parlamentares/page.tsx` → listagem de parlamentares
  * `app/parlamentares/[id]/page.tsx` → perfil de um parlamentar
  * `app/parlamentares/[id]/emendas/[codigoEmenda]/page.tsx` → detalhe de emenda

## `components/`

Guarda componentes reutilizáveis da interface.

### `components/home/`

Contém componentes usados na página inicial.

* `HeroSearch.tsx`: seção principal de busca da home.
* `Destaques.tsx`: bloco de destaques da página inicial.
* `ParlamentarCard.tsx`: card usado para exibir parlamentares em listas.

### `components/layout/`

Contém componentes estruturais compartilhados.

* `HeaderLayout.tsx`: cabeçalho reutilizável para navegação e identidade visual da aplicação.

## `components/parlamentares/`

Agrupa os componentes relacionados ao domínio de parlamentares.

### `components/parlamentares/emendas/`

* `EmendaDetailPage.tsx`: componente visual da tela de detalhe de emenda.

### `components/parlamentares/profile/`

Contém a composição visual da página de perfil do parlamentar.

* `ParlamentarProfilePage.tsx`: estrutura principal da tela de perfil.
* `ParlamentarHero.tsx`: seção de topo do perfil.
* `ParlamentarIndicators.tsx`: indicadores resumidos do perfil.
* `ParlamentarPanels.tsx`: controlador dos painéis visíveis na área principal.

### `components/parlamentares/profile/panels/`

Cada arquivo representa uma aba ou painel do perfil.

* `VisaoGeralPanel.tsx`: visão geral da atuação parlamentar.
* `ProposicoesPanel.tsx`: proposições e matérias relacionadas.
* `EmendasPanel.tsx`: emendas parlamentares e links para detalhes.
* `VotacoesPanel.tsx`: votações, posicionamentos e resultados.
* `DespesasPanel.tsx`: resumo e registros de despesas.

### `components/parlamentares/profile/shared/`

Componentes e utilitários compartilhados entre os painéis.

* `MicroInfoCard.tsx`: card pequeno de informação resumida.
* `PanelButton.tsx`: botão para alternar entre painéis.
* `SectionShell.tsx`: estrutura visual padrão para seções.
* `formatters.ts`: funções de formatação de dados, como moeda e data.

## `services/`

Centraliza chamadas à API e montagem de dados consumidos pela interface.

* `api.ts`: configuração base do cliente HTTP.
* `parlamentares.ts`: funções relacionadas à consulta de parlamentares e seus dados associados.

## `types/`

Centraliza interfaces e tipos TypeScript usados no projeto.

* Exemplo: `Parlamentar`, `ParlamentarPerfil`, `EmendaDetalhe`, `Despesa`.

## Objetivo

O VotoVivo busca tornar dados legislativos mais compreensíveis para o cidadão, reunindo informações públicas em uma interface simples, moderna e de fácil navegação.
