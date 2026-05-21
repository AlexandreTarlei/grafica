# Arquitetura do frontend

SPA React 19 + Vite 8, organizada por domínios em `src/modules/`.

## Camadas

| Pasta | Responsabilidade |
|-------|------------------|
| `src/modules/store` | Loja pública e área cliente (`/conta`) |
| `src/modules/ecommerce` | Carrinho e checkout |
| `src/modules/signage` | Backoffice gráfica (orçamentos, produção, produtos) |
| `src/modules/admin` | Pedidos admin e fiscal |
| `src/modules/financial` | Financeiro |
| `src/modules/dashboard` | Painel admin |
| `src/components` | Design system (ui, forms, data-table, layout) |
| `src/routes` | Manifestos de rotas e guards |
| `src/core` | Env, permissões, providers, query client |
| `src/services/http` | Cliente Axios (JWT, tenant) |

## Convenções

- **Páginas:** preferir `modules/<domínio>/pages/`; exceções em `src/pages/` (login, 404, dashboard).
- **API:** um ficheiro `*.api.ts` por módulo; contratos documentados no topo do ficheiro.
- **Imports:** alias `@/` → `src/`.
- **Upload:** usar `@/components/forms` (`UploadField` reexporta a implementação em `store`).
- **Tabelas:** `@/components/data-table` — `layout="responsive"` (default) para cards em mobile.
- **Títulos admin:** H1 na página (`PageShell` / `PageHeader`); navbar só breadcrumb (`Admin` / segmento).

## Rotas legadas (compatibilidade)

Definidas em `src/routes/router.tsx`:

| Antiga | Nova |
|--------|------|
| `/dashboard` | `/conta` |
| `/planos` | `/orcamento` |
| `/onboarding` | `/conta` |
| `/conta/faturacao` | `/conta/faturas` |

Remover apenas após confirmar zero tráfego.

## Mocks (desenvolvimento)

Ver `.env.example`. Em produção, definir `VITE_USE_*_MOCK=false` para API real.

## Design tokens (CSS)

- Tokens globais: `src/index.css` (OKLCH, shadcn).
- Utilitários: `.page-title`, `.section-title`, `.surface-card`, `.store-card-hover`, `.transition-base`.

## Stack

React, Vite, Tailwind 4, shadcn/ui (Base UI), TanStack Query/Table, Framer Motion (uso pontual), Sonner.
