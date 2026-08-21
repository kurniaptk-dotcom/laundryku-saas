import React, { useState } from 'react';
import { 
  Crown, DollarSign, TrendingUp, Package, Users, Play, 
  Truck, ArrowUpRight, CheckCircle2, AlertTriangle, Plus, 
  Wallet, RefreshCw, LogOut, Sun, Moon, X, Landmark
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function OwnerDashboard({ onLogout, onSwitchToPos }) {
  const { 
    orders, machines, inventory, staff, couriers, 
    activeTenant, restockInventory 
  } = useApp();

  const [activeTab, setActiveTab] = useState('financials'); // 'financials' | 'inventory' | 'staff' | 'machines'
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('500000');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Financial calculations
  const totalRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);
  
  const estimatedCost = Math.round(totalRevenue * 0.35);
  const netProfit = totalRevenue - estimatedCost;
  const cashPortion = Math.round(totalRevenue * 0.45);
  const digitalPortion = totalRevenue - cashPortion;

  const lowStockItems = inventory.filter(i => i.stock <= i.minStock);

  const handleWithdraw = () => {
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased select-none p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header Card */}
        <header className="bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-soft">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 flex items-center justify-center text-white text-2xl shadow-clay-sm">
              👑
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black text-white">{activeTenant?.branding?.laundryName || 'LaundryKu Pro'}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Owner Executive ERP
                </span>
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">Pemilik: {activeTenant?.ownerName} • {activeTenant?.city}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {onSwitchToPos && (
              <button
                onClick={onSwitchToPos}
                className="px-4 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-xs font-black rounded-xl border border-slate-600 transition-all"
              >
                💻 Buka Kasir POS
              </button>
            )}

            <button
              onClick={() => setShowWithdrawModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white text-xs font-black rounded-xl shadow-clay-sm transition-all"
            >
              💰 Tarik Kas Outlet
            </button>

            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-all"
                title="Keluar Akun Owner"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex bg-slate-800 p-1.5 rounded-2xl border border-slate-700 max-w-lg">
          {[
            { id: 'financials', label: '📊 Omzet & Laba' },
            { id: 'inventory', label: '📦 Stok Bahan', badge: lowStockItems.length },
            { id: 'staff', label: '👥 Absensi & Tim' },
            { id: 'machines', label: '🌀 Status IoT' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === tab.id ? 'bg-primary text-white shadow-clay-sm' : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>{tab.label}</span>
              {tab.badge > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-rose-500 text-white text-[9px] font-black">
                  {tab.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ================= TAB 1: FINANCIALS ================= */}
        {activeTab === 'financials' && (
          <div className="space-y-6">
            
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-800 border border-slate-700 rounded-3xl space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Total Omzet Bersih:</span>
                <h3 className="text-3xl font-black text-white">Rp {totalRevenue.toLocaleString('id-ID')}</h3>
                <p className="text-xs text-emerald-400 font-semibold">● 100% Tercatat Otomatis</p>
              </div>

              <div className="p-6 bg-slate-800 border border-slate-700 rounded-3xl space-y-2">
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Estimasi Biaya Pokok (35%):</span>
                <h3 className="text-3xl font-black text-amber-400">Rp {estimatedCost.toLocaleString('id-ID')}</h3>
                <p className="text-xs text-slate-400 font-semibold">Deterjen, Parfum, Listrik & Gas</p>
              </div>

              <div className="p-6 bg-gradient-to-br from-emerald-900/60 via-slate-800 to-slate-800 border border-emerald-500/40 rounded-3xl space-y-2">
                <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Laba Bersih Outlet (Net Profit):</span>
                <h3 className="text-3xl font-black text-emerald-400">Rp {netProfit.toLocaleString('id-ID')}</h3>
                <p className="text-xs text-emerald-300 font-semibold">Margin Laba Sehat (65%)</p>
              </div>
            </div>

            {/* Split Cash vs Digital */}
            <div className="p-6 bg-slate-800 border border-slate-700 rounded-3xl space-y-4">
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Metode Pembayaran Masuk</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Tunai / COD Kasir:</span>
                  <strong className="text-lg font-black text-white block">Rp {cashPortion.toLocaleString('id-ID')}</strong>
                </div>
                <div className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700 space-y-1">
                  <span className="text-xs text-slate-400 font-semibold">Laundry Wallet / QRIS:</span>
                  <strong className="text-lg font-black text-sky-400 block">Rp {digitalPortion.toLocaleString('id-ID')}</strong>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ================= TAB 2: INVENTORY ================= */}
        {activeTab === 'inventory' && (
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Inventori & Bahan Baku Laundry</h3>
            <div className="space-y-3">
              {inventory.map(item => (
                <div key={item.id} className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-white">{item.name}</h4>
                    <p className="text-[10px] text-slate-400">Min. Stok: {item.minStock} {item.unit}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs font-black px-3 py-1 rounded-full ${
                      item.stock <= item.minStock ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' : 'bg-slate-800 text-slate-300'
                    }`}>
                      Stok: {item.stock} {item.unit}
                    </span>
                    <button
                      onClick={() => restockInventory(item.id, 10)}
                      className="px-3 py-1.5 bg-primary hover:bg-primary-dark text-white font-black text-xs rounded-xl shadow-clay-sm cursor-pointer"
                    >
                      + Tambah 10
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: STAFF ================= */}
        {activeTab === 'staff' && (
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Daftar Staf & Shift Gerai</h3>
            <div className="space-y-3">
              {staff.map(s => (
                <div key={s.id} className="p-4 bg-slate-900/60 rounded-2xl border border-slate-700 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-white">{s.name}</h4>
                    <p className="text-[10px] text-slate-400">{s.role} • {s.shift}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-300">Gaji: Rp {s.salary.toLocaleString('id-ID')}</span>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                      s.status === 'Hadir' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-700 text-slate-400'
                    }`}>
                      {s.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: MACHINES ================= */}
        {activeTab === 'machines' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {machines.map(m => (
              <div key={m.id} className="p-6 bg-slate-800 border border-slate-700 rounded-3xl space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-black text-white">{m.name}</h4>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    m.status === 'running' ? 'bg-sky-500/20 text-sky-300 animate-pulse' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {m.status === 'running' ? '● Aktif' : '○ Standby'}
                  </span>
                </div>
                <p className="text-xs text-slate-400">Kapasitas: {m.loadCapacity}</p>
                <p className="text-xs font-bold text-slate-200">
                  {m.currentOrder ? `Sedang memproses ${m.currentOrder}` : 'Mesin kosong'}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* ================= CASH WITHDRAWAL MODAL ================= */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-800 border border-slate-700 rounded-3xl p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-white">Tarik Kas Outlet</h3>
              <button onClick={() => setShowWithdrawModal(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="text-center py-6 space-y-2">
                <span className="text-4xl">✓</span>
                <p className="text-xs font-black text-emerald-400">Permintaan penarikan dana berhasil diproses!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Jumlah Penarikan (Rp):</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={e => setWithdrawAmount(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-2xl p-3 text-lg font-black text-emerald-400 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="p-3 bg-slate-900/60 rounded-xl text-xs text-slate-400 space-y-1">
                  <p>Rekening Tujuan: <strong>BCA 8820-1928-11</strong></p>
                  <p>Atas Nama: <strong>{activeTenant?.ownerName}</strong></p>
                </div>

                <button
                  onClick={handleWithdraw}
                  className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs rounded-2xl shadow-clay-sm cursor-pointer"
                >
                  Tarik Kas Sekarang ✓
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
