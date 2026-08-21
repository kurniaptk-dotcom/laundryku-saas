import { createClient } from '@supabase/supabase-js';

// Environment variables with fallback to user's configured Supabase project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://rgjpfwlyfuzwzowgdkgu.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnanBmd2x5ZnV6d3pvd2dka2d1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcyNTE4NDIsImV4cCI6MjEwMjgyNzg0Mn0.O3fOsBBVGh9rt516EhmOxROIixClRgDMAsVmrn5RwXs';

// Create active Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured = () => {
  return !!supabase;
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
