# VotoVivo Frontend

Frontend em Next.js para acompanhamento de parlamentares, com perfil detalhado e integração híbrida:
- dados reais do backend para listagem, detalhe e gastos
- mocks para proposições e votações enquanto esses endpoints não existem
- fallback visual para quando a API estiver vazia ou indisponível

## Requisitos

- Node.js 20.9+ (recomendado para Next 16)
- Backend do VotoVivo rodando em `http://localhost:3001`

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

## Endpoints do backend consumidos

- `GET /parlamentar`
- `GET /parlamentares/:id`
- `GET /parlamentares/:id/gastos/resumo`
- `GET /parlamentares/:id/gastos`


# Estrutura principal

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

- `page.tsx`: página de uma rota.
- `layout.tsx`: layout compartilhado.
- `globals.css`: estilos globais.
- Exemplo:
  - `app/page.tsx` → home
  - `app/parlamentares/page.tsx` → listagem de parlamentares
  - `app/parlamentares/[id]/page.tsx` → perfil de um parlamentar
  - `app/parlamentares/[id]/emendas/[codigoEmenda]/page.tsx` → detalhe de emenda

## `components/`
Guarda componentes reutilizáveis da interface.

### `components/home/`
Contém componentes usados na página inicial.

- `HeroSearch.tsx`: seção principal de busca da home.
- `Destaques.tsx`: bloco de destaques da página inicial.
- `ParlamentarCard.tsx`: card usado para exibir parlamentares em listas.

### `components/layout/`
Contém componentes estruturais compartilhados.

- `HeaderLayout.tsx`: cabeçalho reutilizável para navegação ou identidade visual da aplicação.

## `components/parlamentares/`
Agrupa todos os componentes relacionados ao domínio de parlamentares.

### `components/parlamentares/emendas/`
- `EmendaDetailPage.tsx`: componente visual da tela de detalhe de emenda.

### `components/parlamentares/profile/`
Contém a composição visual da página de perfil do parlamentar.

- `ParlamentarProfilePage.tsx`: estrutura principal da tela de perfil.
- `ParlamentarHero.tsx`: seção de topo do perfil.
- `ParlamentarIndicators.tsx`: indicadores resumidos do perfil.
- `ParlamentarPanels.tsx`: controlador dos painéis visíveis na área principal.

### `components/parlamentares/profile/panels/`
Cada arquivo representa uma aba ou painel do perfil.

- `VisaoGeralPanel.tsx`: visão geral da atuação parlamentar.
- `ProposicoesPanel.tsx`: proposições e matérias destacadas.
- `EmendasPanel.tsx`: resumo das emendas parlamentares e links para detalhes.
- `VotacoesPanel.tsx`: votações, posicionamentos e resultados.
- `DespesasPanel.tsx`: resumo e itens recentes de despesas.

### `components/parlamentares/profile/shared/`
Componentes e utilitários compartilhados entre os painéis.

- `MicroInfoCard.tsx`: card pequeno de informação resumida.
- `PanelButton.tsx`: botão para alternar entre painéis.
- `SectionShell.tsx`: casca visual padrão para seções.
- `formatters.ts`: funções de formatação de dados, como moeda e data.

## `services/`
Centraliza chamadas à API e montagem de dados.

- `api.ts`: configuração base do cliente HTTP.
- `parlamentares.ts`: funções para buscar lista, perfil, despesas e emendas.

## `types/`
Centraliza interfaces e tipos TypeScript usados no projeto.

- Exemplo: `Parlamentar`, `ParlamentarPerfil`, `EmendaDetalhe`, `Despesa`.

## `public/`
Arquivos estáticos como imagens, SVGs e ícones.

## Fluxo básico

1. A rota é definida em `app/`.
2. A página chama funções de `services/`.
3. Os dados usam tipos de `types/`.
4. A interface é montada com componentes de `components/`.

## Regra prática

- Página/rota: `app/`
- Bloco visual reutilizável: `components/`
- API e lógica de busca: `services/`
- Tipos compartilhados: `types/`
- Imagens e arquivos estáticos: `public/`
