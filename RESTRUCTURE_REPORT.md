# Relatório de reestruturação — frontend e-commerce

Data: 2026-05-16

## Resumo

O frontend foi consolidado como **loja de comunicação visual** (B2C + conta cliente + admin operacional), com integração API reforçada, limpeza de código SaaS morto e ambiente Docker de produção.

## Ficheiros / pastas removidos

- `dist/` (build antigo; regenerado com `npm run build`)
- `src/layouts/MarketingLayout.tsx`, `StoreLayout.tsx`
- `src/modules/commercial/landing`, `pricing`, `onboarding`, `billing`, `demo`, `services`, `hooks`, `types.ts`, `README.md`
- Componentes comerciais órfãos: `PricingCard`, `PlanComparisonTable`, `MarketingHeader/Footer`, `CtaSection`
- Módulos admin não operacionais: `automations`, `analytics`, `reports`, `rentals`, `contracts`, `support`

## Dependências

- `msw` removido do `package.json` (não era usado em `src/`)
- Mantido `recharts` (módulo financeiro admin)

## Configuração restaurada

- `package.json`, `vite.config.ts`, `vitest.config.ts`, `tsconfig*.json`, `index.html`, `.gitignore`, `.env.example`, `eslint.config.js`

## Páginas

| Rota | Estado |
|------|--------|
| `/` … `/contato` | Reutilizadas + conteúdo signage |
| `/carrinho`, `/checkout` | Checkout com passo **Frete** + upload na revisão |
| `/conta/perfil`, `/conta/notificacoes` | **Criadas** |
| `/conta/pedidos`, `/producao`, `/arte` | Ligadas à API store |
| `/admin/*` | Enxugado (pedidos, financeiro, fiscal, signage, CRM) |

## Componentes novos

- `UploadField` — dropzone + `POST /uploads`
- Serviços: `orders.api.ts`, `production.api.ts`, `uploads.api.ts`

## Melhorias aplicadas

- **Refresh token**: `POST /auth/refresh` com retry único em 401
- **Permissões demo**: apenas em `import.meta.env.DEV`
- **Pedidos conta**: `GET /orders` (antes usava API admin)
- **Docker**: `Dockerfile`, `nginx.conf`, `.dockerignore` com proxy `/api/` e upload 26 MB

## Status integrações

| Área | Status |
|------|--------|
| API base (`VITE_API_URL`) | Configurado em `.env.example` |
| Auth JWT + refresh | Implementado |
| Carrinho / checkout | Mantido (mocks desligáveis) |
| Uploads | Implementado (`UploadField`) |
| Produção cliente | `GET /production/jobs` |
| Docker compose `full` | Dockerfile presente; validar com `docker compose --profile full up` |

## Build e testes

- `npm run build` — OK
- `npm run test` — ver saída local (teste `refresh-auth.test.ts` + existentes)

## Riscos / impactos

- Rotas admin removidas (`/admin/automacoes`, `/admin/analytics`, etc.) deixam de existir; bookmarks antigos devolvem 404.
- Módulos físicos apagados — restaurar via git se necessário.
- Checkout frete é UI; backend `CheckoutRequest` usa `shipping_total` — alinhar contrato na próxima iteração.
- Perfil usa `POST /store/me/customer` (ensure customer); PATCH dedicado pode ser adicionado no backend.

## Documentação

- Matriz API: [`docs/API_MATRIX.md`](docs/API_MATRIX.md)
