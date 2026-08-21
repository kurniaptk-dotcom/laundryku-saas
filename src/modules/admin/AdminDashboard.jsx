import React, { useState } from 'react';
import { 
  Crown, Users, DollarSign, Server, CheckCircle2, AlertTriangle, 
  Search, Plus, ShieldCheck, ArrowUpRight, LogOut, RefreshCw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function AdminDashboard({ onLogout, onSwitchToTenant }) {
  const { tenants, activeTenant, setActiveTenantId } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTenants = tenants.filter(t => 
    t.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.city.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased select-none p-6 lg:p-10 space-y-8">
      
      {/* Top Navbar */}
      <div className="flex justify-between items-center pb-6 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 via-indigo-500 to-sky-500 flex items-center justify-center text-white text-2xl shadow-clay-sm">
            ⚙️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">LaundryKu SaaS Super Admin</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30">
                Master Control
              </span>
            </div>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Pusat Manajemen Seluruh Mitra Laundry & Database Cloud</p>
          </div>
        </div>

        {onLogout && (
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-black transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Super Admin</span>
          </button>
        )}
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Mitra Aktif:</span>
          <h3 className="text-3xl font-black text-white">{tenants.length} Outlet</h3>
          <p className="text-xs text-emerald-400 font-semibold">● 100% Online Cloud</p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Estimasi MRR SaaS:</span>
          <h3 className="text-3xl font-black text-sky-400">Rp {(tenants.length * 199000).toLocaleString('id-ID')}</h3>
          <p className="text-xs text-slate-400 font-semibold">Monthly Recurring Revenue</p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Paket Pro Business:</span>
          <h3 className="text-3xl font-black text-purple-400">{tenants.filter(t => t.planId === 'pro').length} Mitra</h3>
          <p className="text-xs text-slate-400 font-semibold">Langganan Aktif</p>
        </div>

        <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-2">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Uptime Server Supabase:</span>
          <h3 className="text-3xl font-black text-emerald-400">99.98%</h3>
          <p className="text-xs text-emerald-300 font-semibold">APIs & Webhooks Normal</p>
        </div>
      </div>

      {/* Tenants Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-base font-black text-white">Daftar Mitra Gerai (Tenants)</h3>
            <p className="text-xs text-slate-400">Pantau masa aktif langganan dan buka console outlet.</p>
          </div>

          <div className="w-full sm:w-64">
            <input
              type="text"
              placeholder="Cari nama gerai / kota..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-black uppercase text-[10px]">
                <th className="pb-3">Tenant ID</th>
                <th className="pb-3">Nama Usaha & Owner</th>
                <th className="pb-3">Paket Langganan</th>
                <th className="pb-3">Masa Berlaku</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-semibold text-slate-300">
              {filteredTenants.map(tenant => (
                <tr key={tenant.id} className="hover:bg-slate-800/30">
                  <td className="py-4 font-mono font-black text-purple-400">{tenant.id}</td>
                  <td className="py-4">
                    <p className="font-black text-white">{tenant.businessName}</p>
                    <p className="text-[11px] text-slate-400">{tenant.ownerName} ({tenant.ownerPhone}) • {tenant.city}</p>
                  </td>
                  <td className="py-4">
                    <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold">
                      {tenant.planName}
                    </span>
                  </td>
                  <td className="py-4 text-slate-400">{tenant.expiryDate}</td>
                  <td className="py-4">
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-black">
                      Aktif ✓
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => {
                        setActiveTenantId(tenant.id);
                        if (onSwitchToTenant) onSwitchToTenant(tenant);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 border border-slate-700 rounded-xl font-black text-[11px] transition-colors cursor-pointer"
                    >
                      Buka Outlet ➔
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
