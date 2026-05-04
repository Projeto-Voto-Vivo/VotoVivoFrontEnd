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

## O que continua mockado

- proposições
- votações
- alguns textos editoriais do perfil
- fallback de listagem/detalhe quando a API vier vazia
