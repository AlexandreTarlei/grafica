# Auditoria frontend — resumo

Documento de referência da auditoria “e-commerce gráfica premium”. Para convenções de código, ver [ARCHITECTURE.md](./ARCHITECTURE.md).

## Estado da stack

A stack alvo (React, Vite, Tailwind, shadcn, Framer Motion) **já está em uso**. Não é necessária migração de framework.

## Problemas tratados nesta fase

- Remoção de reexport órfão `signage/shared/DataTable`
- Exports mortos no barrel `data-table` e função deprecated em `segments.ts`
- Imports `UploadField` unificados via `@/components/forms`
- Token `.surface-card` e simplificação `.store-card-hover`
- Gradientes da home alinhados a tokens de tema
- Navbar admin com breadcrumb (H1 na página)
- `DataTable` com layout responsivo (cards em mobile)
- `ThemeToggle` no menu mobile da loja
- Documentação de arquitetura e redirects

## Fora de escopo (fases futuras)

- Novas funcionalidades (guest cart, PSP, wishlist)
- Alterações de contrato API
- Renomeação em massa de pastas `modules/`
- Remoção de redirects legados sem analytics

## Direção visual alvo

Loja: clareza tipo Shopify, previews tipo Canva, confiança gráfica tipo VistaPrint — minimalista, whitespace, `primary` do tenant.

Admin: sidebar mantida; reduzir densidade ERP (`dense` só onde necessário).
