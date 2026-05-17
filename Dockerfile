# syntax=docker/dockerfile:1

# Bookworm (glibc) — Vite 8 / rolldown precisa do binding nativo correto (musl no Alpine falha no CI/Docker)
FROM node:22-bookworm-slim AS build
WORKDIR /app

ARG VITE_API_URL=/api/v1
ARG VITE_APP_NAME=Gráfica Online
ARG VITE_COMPANY_ID=1
ARG VITE_DEFAULT_TENANT_ID=1
ARG VITE_COMMERCIAL_VERTICAL=signage
ARG VITE_BUSINESS_SEGMENT=services
ARG VITE_WHATSAPP_PHONE=351912345678
ARG VITE_USE_CART_MOCK=false
ARG VITE_USE_CHECKOUT_MOCK=false
ARG VITE_USE_ORDER_MOCK=false
ARG VITE_USE_SIGNAGE_PRODUCTS_MOCK=false
ARG VITE_USE_TENANT_BOOTSTRAP_MOCK=false
ARG VITE_USE_FISCAL_MOCK=false
ARG VITE_USE_FINANCIAL_MOCK=false
ARG VITE_USE_COMMERCIAL_MOCK=false
ARG VITE_REALTIME_ENABLED=true

ENV VITE_API_URL=$VITE_API_URL \
    VITE_APP_NAME=$VITE_APP_NAME \
    VITE_COMPANY_ID=$VITE_COMPANY_ID \
    VITE_DEFAULT_TENANT_ID=$VITE_DEFAULT_TENANT_ID \
    VITE_COMMERCIAL_VERTICAL=$VITE_COMMERCIAL_VERTICAL \
    VITE_BUSINESS_SEGMENT=$VITE_BUSINESS_SEGMENT \
    VITE_WHATSAPP_PHONE=$VITE_WHATSAPP_PHONE \
    VITE_USE_CART_MOCK=$VITE_USE_CART_MOCK \
    VITE_USE_CHECKOUT_MOCK=$VITE_USE_CHECKOUT_MOCK \
    VITE_USE_ORDER_MOCK=$VITE_USE_ORDER_MOCK \
    VITE_USE_SIGNAGE_PRODUCTS_MOCK=$VITE_USE_SIGNAGE_PRODUCTS_MOCK \
    VITE_USE_TENANT_BOOTSTRAP_MOCK=$VITE_USE_TENANT_BOOTSTRAP_MOCK \
    VITE_USE_FISCAL_MOCK=$VITE_USE_FISCAL_MOCK \
    VITE_USE_FINANCIAL_MOCK=$VITE_USE_FINANCIAL_MOCK \
    VITE_USE_COMMERCIAL_MOCK=$VITE_USE_COMMERCIAL_MOCK \
    VITE_REALTIME_ENABLED=$VITE_REALTIME_ENABLED

COPY package.json package-lock.json* ./
RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm ci --include=optional \
    && npm install \
      @rolldown/binding-linux-x64-gnu@1.0.0 \
      lightningcss-linux-x64-gnu \
      @tailwindcss/oxide-linux-x64-gnu \
      --no-save
COPY index.html vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json components.json ./
COPY public ./public
COPY src ./src

RUN npm run build

FROM nginx:1.27-alpine AS runtime
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
