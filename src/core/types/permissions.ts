/**
 * Permissões usadas na UI (espelho do backend).
 * Validação real de acesso permanece no servidor; aqui é apenas para UX e rotas.
 */
export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  ORDERS_ADMIN_VIEW: 'orders.admin.view',
  ORDERS_ADMIN_EDIT_STATUS: 'orders.admin.edit_status',
  FINANCIAL_ADMIN_VIEW: 'financial.admin.view',
  FINANCIAL_ADMIN_REPORTS: 'financial.admin.reports',
  /** Espelho do backend: `fiscal.read` / `fiscal.write` (módulo NF-e). */
  FISCAL_VIEW: 'fiscal.read',
  FISCAL_WRITE: 'fiscal.write',
  /** Espelho do backend: `automations.read` / `automations.write` */
  AUTOMATIONS_READ: 'automations.read',
  AUTOMATIONS_WRITE: 'automations.write',
  REPORTS_READ: 'reports.read',
  REPORTS_EXPORT: 'reports.export',
  ANALYTICS_READ: 'analytics.read',
  CATALOG_READ: 'catalog.read',
  CATALOG_WRITE: 'catalog.write',
  QUOTES_READ: 'quotes.read',
  QUOTES_WRITE: 'quotes.write',
  PRODUCTION_READ: 'production.read',
  PRODUCTION_WRITE: 'production.write',
  INSTALLATION_READ: 'installation.read',
  INSTALLATION_WRITE: 'installation.write',
  PARTNERS_READ: 'partners.read',
  PARTNERS_WRITE: 'partners.write',
} as const

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS]
