/**
 * LaundryKu Production Route & Subdomain Resolver
 * Determines which isolated app module to render based on Subdomain or Pathname.
 */

export const ROUTE_MODULES = {
  SAAS_LANDING: 'saas_landing',
  KASIR_POS: 'web',
  SUPER_ADMIN: 'super_admin',
  OWNER_ERP: 'owner_mobile',
  COURIER_APP: 'courier_app',
  CONSUMER_APP: 'mobile'
};

export const resolveCurrentRoute = () => {
  if (typeof window === 'undefined') return ROUTE_MODULES.SAAS_LANDING;

  const hostname = window.location.hostname.toLowerCase();
  const pathname = window.location.pathname.toLowerCase();
  const params = new URLSearchParams(window.location.search);

  // 1. Check URL Query Parameters Override (Highest Priority for explicit testing & links)
  if (params.get('admin') === 'true' || params.get('view') === 'super_admin' || params.get('view') === 'admin') {
    return ROUTE_MODULES.SUPER_ADMIN;
  }
  if (params.get('view') === 'pos' || params.get('view') === 'kasir' || params.get('view') === 'web') {
    return ROUTE_MODULES.KASIR_POS;
  }
  if (params.get('view') === 'owner' || params.get('view') === 'erp') {
    return ROUTE_MODULES.OWNER_ERP;
  }
  if (params.get('view') === 'kurir' || params.get('view') === 'driver') {
    return ROUTE_MODULES.COURIER_APP;
  }
  if (params.get('view') === 'mobile' || params.get('view') === 'customer' || params.get('view') === 'track') {
    return ROUTE_MODULES.CONSUMER_APP;
  }

  // 2. Check Production Subdomain (e.g. admin.laundryku.id, pos.laundryku.id)
  if (hostname.startsWith('admin.')) {
    return ROUTE_MODULES.SUPER_ADMIN;
  }
  if (hostname.startsWith('pos.') || hostname.startsWith('app.') || hostname.startsWith('kasir.')) {
    return ROUTE_MODULES.KASIR_POS;
  }
  if (hostname.startsWith('owner.') || hostname.startsWith('erp.')) {
    return ROUTE_MODULES.OWNER_ERP;
  }
  if (hostname.startsWith('kurir.') || hostname.startsWith('driver.')) {
    return ROUTE_MODULES.COURIER_APP;
  }
  if (hostname.startsWith('my.') || hostname.startsWith('customer.')) {
    return ROUTE_MODULES.CONSUMER_APP;
  }

  // 3. Check Clean URL Pathname (e.g. /admin, /pos, /owner, /kurir)
  if (pathname.startsWith('/admin') || pathname.startsWith('/super-admin')) {
    return ROUTE_MODULES.SUPER_ADMIN;
  }
  if (pathname.startsWith('/pos') || pathname.startsWith('/kasir') || pathname.startsWith('/app')) {
    return ROUTE_MODULES.KASIR_POS;
  }
  if (pathname.startsWith('/owner') || pathname.startsWith('/erp')) {
    return ROUTE_MODULES.OWNER_ERP;
  }
  if (pathname.startsWith('/kurir') || pathname.startsWith('/driver')) {
    return ROUTE_MODULES.COURIER_APP;
  }
  if (pathname.startsWith('/customer') || pathname.startsWith('/track')) {
    return ROUTE_MODULES.CONSUMER_APP;
  }

  // Default: Public SaaS Landing Page
  return ROUTE_MODULES.SAAS_LANDING;
};

export const navigateToModule = (moduleKey) => {
  if (typeof window === 'undefined') return;

  const pathMap = {
    [ROUTE_MODULES.SAAS_LANDING]: '/',
    [ROUTE_MODULES.KASIR_POS]: '/pos',
    [ROUTE_MODULES.SUPER_ADMIN]: '/admin',
    [ROUTE_MODULES.OWNER_ERP]: '/owner',
    [ROUTE_MODULES.COURIER_APP]: '/kurir',
    [ROUTE_MODULES.CONSUMER_APP]: '/customer'
  };

  const targetPath = pathMap[moduleKey] || '/';
  const newUrl = `${window.location.origin}${targetPath}`;
  window.history.pushState({}, '', newUrl);
};
