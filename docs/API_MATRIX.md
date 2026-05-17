# Matriz API — loja vs frontend

| Funcionalidade | Endpoint store | Serviço frontend |
|----------------|----------------|------------------|
| Login | `POST /auth/login` | `modules/auth/api.ts` |
| Refresh | `POST /auth/refresh` | `modules/auth/api.ts` + interceptor |
| Carrinho | `GET/POST/PATCH/DELETE /cart` | `modules/ecommerce/cart/services/cart.api.ts` |
| Checkout | `POST /checkout` | `modules/ecommerce/checkout/services/checkout.api.ts` |
| Pedidos cliente | `GET /orders` | `modules/store/services/orders.api.ts` |
| Produção | `GET /production/jobs` | `modules/store/services/production.api.ts` |
| Upload arte | `POST /uploads` | `modules/store/services/uploads.api.ts` |
| Catálogo admin | `GET /companies/{id}/products` | `modules/signage/products/services/products.api.ts` |
| Perfil cliente | `POST /store/me/customer` | `AccountProfilePage` |
