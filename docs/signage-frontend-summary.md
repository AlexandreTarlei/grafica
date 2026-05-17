# Resumo técnico — Painel Signage (frontend)

## Novas páginas

| Rota | Página |
|------|--------|
| `/admin/dashboard` | Secção operacional signage (condicional) |
| `/admin/signage/produtos` | Lista de produtos personalizados |
| `/admin/signage/produtos/novo` | Cadastro |
| `/admin/signage/produtos/:productId` | Edição / detalhe |
| `/admin/signage/categorias` | Categorias |
| `/admin/signage/orcamentos` | Lista de orçamentos |
| `/admin/signage/orcamentos/novo` | Novo orçamento |
| `/admin/signage/orcamentos/:quoteId` | Detalhe (PDF, WhatsApp, assinatura) |
| `/admin/signage/producao` | Kanban de produção |
| `/admin/signage/instalacoes` | Agenda |
| `/admin/signage/instalacoes/:installationId` | Detalhe instalação |
| `/admin/signage/clientes` | Clientes corporativos |
| `/admin/crm` | Mesmo conteúdo (ClientsPage) |
| `/admin/signage/revenda` | White label / revenda |

## Novos componentes

- `src/components/metrics/MetricCard.tsx`
- `src/modules/signage/shared/components/` — PageShell, DataTable, StatusBadge, FileDropzone, ArtworkPreview, Timeline
- `src/modules/signage/products/components/ProductForm.tsx`
- `src/modules/signage/dashboard/widgets/SignageOperationalSection.tsx`

## Serviços e flags

| Serviço | Mock default | Flag env |
|---------|--------------|----------|
| Dashboard operacional | sim | `VITE_USE_SIGNAGE_DASHBOARD_MOCK` |
| Produtos / categorias | sim | `VITE_USE_SIGNAGE_PRODUCTS_MOCK` |
| Orçamentos | sim | `VITE_USE_SIGNAGE_QUOTES_MOCK` |
| Produção | sim | `VITE_USE_SIGNAGE_PRODUCTION_MOCK` |
| Instalação | sim | `VITE_USE_SIGNAGE_INSTALLATION_MOCK` |
| Clientes | sim | `VITE_USE_SIGNAGE_CUSTOMERS_MOCK` |
| Revenda | sim | `VITE_USE_SIGNAGE_RESALE_MOCK` |

Helper: `companyApiPath(companyId, segment)` → `/companies/{id}/{segment}`

## Integrações backend

| Domínio | Frontend | Backend atual |
|---------|----------|---------------|
| Produtos | Integração real quando mock off | `GET/POST/PATCH /companies/{id}/products` |
| Categorias | Integração real quando mock off | `GET/POST /companies/{id}/categories` |
| Pedidos admin | Adapter quando `VITE_USE_ORDER_MOCK=false` | `/companies/{id}/orders` |
| KPIs financeiros | Adapter dashboard quando mock off | `/companies/{id}/financial/dashboard` |
| Signage (dashboard, quotes, production, installation, customers, resale) | Mock contratual | **A implementar** |

Metadados signage em produtos: serializados em `description` com prefixo `__signage__:` até campo dedicado no backend.

## Permissões (UI)

`catalog.read/write`, `quotes.read/write`, `production.read/write`, `installation.read/write`, `partners.read/write` — adicionadas em `PERMISSIONS`; fallback dev no login/cadastro.

## Módulo tenant

`ModuleId: signage` — ativo por default e em `VITE_COMMERCIAL_VERTICAL=signage`.

## Impactos

- Dependências: `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`
- Rotas admin lazy-loaded via `signage.routes.tsx`
- Auth **não** alterada (sem refresh token)
- Bundle: páginas signage em chunks separados

## Testes

- `npm run test` — Vitest
- `src/modules/signage/shared/utils/pricing.test.ts`

## Compatibilidade

Para compatibilidade total, o backend deve expor os endpoints documentados nos ficheiros `*.api.ts` do módulo `signage` e aceitar `metadata` estruturado em produtos.
