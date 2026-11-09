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
VotoVivoFrontEnd/
├── app/
├── components/
├── docs/
├── public/
├── services/
├── types/
├── Dockerfile
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```
