import { createClient } from '@supabase/supabase-js';

// Environment variables or direct configuration fallback
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client instance if credentials are valid
export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

export const isSupabaseConfigured = () => {
  return !!supabase;
};

// Helper for Realtime Syncing Orders
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
