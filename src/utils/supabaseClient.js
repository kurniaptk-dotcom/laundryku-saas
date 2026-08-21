import { createClient } from '@supabase/supabase-js';

// Cloud persistence is intentionally opt-in. Never silently connect a deployed
// build to a shared project through hard-coded credentials.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a client only when the deployment explicitly supplies its credentials.
export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => {
  return Boolean(supabase);
};

// Helper for Realtime Syncing Orders across POS, Owner, Courier & Consumer
export const subscribeToOrders = (tenantId, onOrderUpdate) => {
  if (!supabase) return null;

  const channel = supabase
    .channel(`realtime:orders:${tenantId || 'all'}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'orders',
        filter: tenantId ? `tenant_id=eq.${tenantId}` : undefined
      },
      (payload) => {
        if (onOrderUpdate) onOrderUpdate(payload);
      }
    )
    .subscribe();

  return channel;
};

// Helper for fetching Tenants from Supabase
export const fetchTenantsFromSupabase = async () => {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase.from('tenants').select('*').order('created_at', { ascending: false });
    if (error) {
      console.warn('Supabase fetch error, fallback to local state:', error);
      return null;
    }
    return data;
  } catch (err) {
    console.error('Supabase fetch exception:', err);
    return null;
  }
};
