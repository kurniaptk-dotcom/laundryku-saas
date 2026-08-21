/**
 * Supabase Auto-Seeder Engine
 * Automatically pushes default mock tenants, orders, and services into Supabase Cloud Database.
 */

import { supabase, isSupabaseConfigured } from './supabaseClient';
import { DEFAULT_TENANTS } from './saasHelper';

export const seedSupabaseData = async () => {
  if (!isSupabaseConfigured()) {
    console.log('ℹ️ Supabase credentials standing by.');
    return { success: false, message: 'Supabase credentials standing by.' };
  }

  try {
    console.log('🌱 [Supabase Seeder] Uploading initial data to Supabase Cloud...');

    // 1. Seed Tenants
    const tenantInserts = DEFAULT_TENANTS.map(t => ({
      id: t.id,
      business_name: t.businessName,
      owner_name: t.ownerName,
      owner_phone: t.ownerPhone,
      city: t.city || 'Indonesia',
      plan_id: t.planId,
      plan_name: t.planName,
      monthly_fee: t.monthlyFee,
      status: t.status,
      join_date: t.joinDate,
      expiry_date: t.expiryDate,
      branches_count: t.branchesCount,
      total_orders_processed: t.totalOrdersProcessed,
      total_revenue_processed: t.totalRevenueProcessed,
      whatsapp_quota_used: t.whatsappQuotaUsed,
      branding: t.branding
    }));

    const { error: tenantErr } = await supabase.from('tenants').upsert(tenantInserts);
    if (tenantErr) {
      console.warn('⚠️ Supabase Tenants Seed Warning:', tenantErr.message);
      return { success: false, message: tenantErr.message };
    }

    console.log('✅ [Supabase Seeder] Successfully seeded Tenants data to Supabase!');
    return { success: true, message: 'Supabase Data Synchronized Successfully!' };
  } catch (err) {
    console.error('❌ Supabase Seeder Exception:', err);
    return { success: false, message: err.message };
  }
};
