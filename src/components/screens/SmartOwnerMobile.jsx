import React, { useState } from 'react';
import { 
  TrendingUp, Users, DollarSign, Package, RefreshCw, 
  Sparkles, AlertTriangle, CheckCircle, Clock, ChevronRight, 
  ArrowUpRight, ArrowDownRight, Zap, Shield, Smartphone, 
  Store, Building2, Bell, MessageCircle, BarChart3, 
  PieChart, Star, Flame, Droplets, Wind, Sun, Moon
} from 'lucide-react';
import { getWhatsAppChatUrl } from '../../utils/whatsappHelper';

export default function SmartOwnerMobile({
  activeOrders = [],
  orderHistory = [],
  inventory = [],
  machines = [],
  staffList = [],
  reviews = [],
  branding = {},
  onSwitchToFullWeb,
  onOpenBrandingSettings,
  onLogout,
  theme = 'light',
  onToggleTheme
}) {
  const [internalTheme, setInternalTheme] = useState(theme);
  const activeTheme = onToggleTheme ? theme : internalTheme;
  const isDark = activeTheme === 'dark';

  const toggleMode = () => {
    if (onToggleTheme) {
      onToggleTheme();
    } else {
      setInternalTheme(prev => prev === 'light' ? 'dark' : 'light');
    }
  };

  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'fleet' | 'inventory' | 'team'
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('500000');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  // Financial calculations
  const allOrders = [...activeOrders, ...orderHistory];
  const todayRevenue = allOrders.reduce((sum, o) => sum + (o.totalPrice || o.total || 0), 0);
  const completedOrdersCount = orderHistory.length;
  const activeOrdersCount = activeOrders.length;
  
  const estimatedCost = Math.round(todayRevenue * 0.35);
  const netProfit = todayRevenue - estimatedCost;

  const cashPortion = Math.round(todayRevenue * 0.4);
  const qrisPortion = todayRevenue - cashPortion;

  // Urgent alerts
  const lowStockItems = inventory.filter(i => (i.stock || i.quantity || 0) <= (i.minStock || 10));
  const pendingReviews = reviews.filter(r => r.rating <= 3 || r.status === 'pending_compensation');

  // Machines running
  const runningMachines = machines.filter(m => m.status === 'running');
  const idleMachines = machines.filter(m => m.status === 'idle');

  const handleWithdraw = () => {
    setWithdrawSuccess(true);
    setTimeout(() => {
      setWithdrawSuccess(false);
      setShowWithdrawModal(false);
    }, 2000);
  };

  return (
    <div className={`w-full max-w-lg rounded-none sm:rounded-[40px] shadow-2xl border overflow-hidden transition-colors ${
      isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
    }`}>
      
      {/* 1. Header Bar */}
      <header className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-indigo-600 flex items-center justify-center text-white text-xl shadow-clay-sm">
              👑
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {branding.laundryName || 'LaundryKu Pro'}
                </h1>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${
                  isDark ? 'bg-sky-500/20 text-sky-300 border-sky-500/30' : 'bg-sky-50 text-primary border-sky-200'
                }`}>
                  SMART OWNER
                </span>
              </div>
              <p className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Executive Mobile ERP & POS Control
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleMode}
              className={`p-2 rounded-xl border text-xs font-black transition-colors ${
                isDark ? 'bg-slate-800 text-amber-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {onOpenBrandingSettings && (
              <button
                onClick={onOpenBrandingSettings}
                className={`p-2 rounded-xl border text-xs font-black ${
                  isDark ? 'bg-slate-800 text-sky-400 border-slate-700' : 'bg-slate-100 text-primary border-slate-200'
                }`}
                title="Atur Branding Toko"
              >
                ⚙️
              </button>
            )}
            {onSwitchToFullWeb && (
              <button
                onClick={onSwitchToFullWeb}
                className="px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl text-[10px] font-black transition-colors"
                title="Buka Versi Desktop Lengkap"
              >
                💻 Web ERP
              </button>
            )}
            {onLogout && (
              <button
                onClick={onLogout}
                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl text-xs font-black transition-colors cursor-pointer"
                title="Keluar Akun Owner"
              >
                🚪
              </button>
            )}
          </div>
        </div>

        {/* Owner Greeting & Outlet Info */}
        <div className={`flex items-center justify-between p-3 rounded-2xl border ${
          isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-white font-black text-xs shadow">
              AD
            </div>
            <div>
              <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Ahmad Faisal (Owner)</p>
              <p className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Gerai Pusat Aktif · 2 Cabang</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowWithdrawModal(true)}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black shadow-xs transition-all flex items-center gap-1"
          >
            <span>💰</span>
            <span>Tarik Kas</span>
          </button>
        </div>
      </header>

      {/* 2. Executive KPI Cards */}
      <div className="p-4 space-y-4">
        {/* Main Revenue Card (Clean & Vivid) */}
        <div className={`p-5 rounded-3xl border shadow-lg space-y-4 relative overflow-hidden ${
          isDark 
            ? 'bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30 text-white' 
            : 'bg-gradient-to-br from-indigo-900 via-slate-900 to-sky-950 border-indigo-800 text-white'
        }`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black text-sky-300 uppercase tracking-wider">Omzet Toko Hari Ini</span>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Rp {todayRevenue.toLocaleString('id-ID')}
              </h2>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/30 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              <span>+18.4%</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
            <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-xs">
              <p className="text-[9px] font-bold text-slate-300 uppercase">Est. Laba Bersih</p>
              <p className="text-xs font-black text-emerald-300 mt-0.5">Rp {netProfit.toLocaleString('id-ID')}</p>
            </div>
            <div className="bg-white/10 p-2.5 rounded-2xl backdrop-blur-xs">
              <p className="text-[9px] font-bold text-slate-300 uppercase">Total Pesanan</p>
              <p className="text-xs font-black text-sky-200 mt-0.5">{allOrders.length} Nota ({activeOrdersCount} Diproses)</p>
            </div>
          </div>

          {/* Cash vs QRIS */}
          <div className="flex items-center justify-between text-[11px] text-slate-300 font-semibold px-1">
            <span>💵 Kas Tunai: <strong className="text-white">Rp {cashPortion.toLocaleString('id-ID')}</strong></span>
            <span>📱 QRIS / Bank: <strong className="text-white">Rp {qrisPortion.toLocaleString('id-ID')}</strong></span>
          </div>
        </div>

        {/* 3. Urgent Smart Alerts */}
        {(lowStockItems.length > 0 || pendingReviews.length > 0) && (
          <div className="space-y-2">
            <p className={`text-[10px] font-black uppercase tracking-widest px-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Peringatan Kritis
            </p>
            
            {lowStockItems.length > 0 && (
              <div className={`p-3 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <div>
                    <p className={`text-xs font-black ${isDark ? 'text-amber-300' : 'text-amber-900'}`}>Stok Bahan Baku Menipis</p>
                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-amber-700'}`}>
                      {lowStockItems.map(i => `${i.name} (sisa ${i.stock} ${i.unit})`).join(', ')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('inventory')}
                  className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-[10px] font-black"
                >
                  Restock
                </button>
              </div>
            )}

            {pendingReviews.length > 0 && (
              <div className={`p-3 rounded-2xl border flex items-center justify-between ${
                isDark ? 'bg-rose-500/10 border-rose-500/30' : 'bg-rose-50 border-rose-200'
              }`}>
                <div className="flex items-center gap-2.5">
                  <Star className="w-4 h-4 text-rose-500 flex-shrink-0" />
                  <div>
                    <p className={`text-xs font-black ${isDark ? 'text-rose-300' : 'text-rose-900'}`}>{pendingReviews.length} Komplain Pelanggan Belum Selesai</p>
                    <p className={`text-[10px] ${isDark ? 'text-slate-400' : 'text-rose-700'}`}>Segera kirim voucher kompensasi via WhatsApp</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 bg-rose-600 text-white rounded-md text-[9px] font-black">
                  Prioritas
                </span>
              </div>
            )}
          </div>
        )}

        {/* 4. Tab Navigation */}
        <div className={`flex p-1 rounded-2xl border gap-1 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {[
            { id: 'overview', label: 'Ringkasan' },
            { id: 'fleet', label: `Mesin IoT (${runningMachines.length})` },
            { id: 'inventory', label: `Stok Kimia (${inventory.length})` },
            { id: 'team', label: `Tim (${staffList.length})` },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 text-[11px] font-black rounded-xl transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 5. Tab Contents */}
        <div className="space-y-3 pb-8">
          {/* TAB 1: OVERVIEW & ACTIVE ORDERS */}
          {activeTab === 'overview' && (
            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <p className={`text-[11px] font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                  Antrean Cucian Sedang Diproses
                </p>
                <span className="text-[10px] text-primary font-bold">{activeOrders.length} Pesanan</span>
              </div>

              {activeOrders.slice(0, 5).map(order => (
                <div key={order.id} className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{order.customerName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">#{order.id}</span>
                    </div>
                    <p className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      🧺 {order.serviceName || order.serviceType} ({order.weight || order.weightKg || '3'} kg)
                    </p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-primary/10 text-primary border border-primary/20">
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <p className={`text-[10px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Rp {(order.totalPrice || order.total || 0).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: IOT FLEET MESIN */}
          {activeTab === 'fleet' && (
            <div className="space-y-3">
              <div className={`p-3 rounded-2xl border flex justify-between items-center text-xs ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
              }`}>
                <span>Total Mesin: <strong className={isDark ? 'text-white' : 'text-slate-900'}>{machines.length} Unit</strong></span>
                <span className="text-emerald-600 font-bold">⚡ {runningMachines.length} Berputar</span>
                <span className="text-slate-400 font-bold">💤 {idleMachines.length} Standby</span>
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {machines.map(m => {
                  const isRunning = m.status === 'running';
                  return (
                    <div
                      key={m.id}
                      className={`p-3.5 rounded-2xl border transition-all space-y-2 ${
                        isRunning 
                          ? isDark ? 'bg-slate-900 border-sky-500/40 ring-2 ring-sky-500/10' : 'bg-sky-50/50 border-sky-300 ring-2 ring-sky-100'
                          : isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-xl">{m.type === 'dryer' ? '🔥' : '🧼'}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-black ${
                          isRunning ? 'bg-emerald-500/20 text-emerald-600' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {isRunning ? 'RUNNING' : 'IDLE'}
                        </span>
                      </div>

                      <div>
                        <h4 className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{m.name}</h4>
                        <p className="text-[9px] text-slate-400 font-semibold">{m.brand || 'Maytag'} · {m.capacityKg || 10}kg</p>
                      </div>

                      {isRunning && (
                        <div className="space-y-1 pt-1 border-t border-slate-200/60">
                          <div className="flex justify-between text-[9px] font-bold text-slate-500">
                            <span>Sisa Waktu:</span>
                            <span className="text-primary">{m.remainingMinutes || 18} Menit</span>
                          </div>
                          <div className="w-full h-1 bg-slate-200 rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-pulse" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 3: STOK KIMIA */}
          {activeTab === 'inventory' && (
            <div className="space-y-2.5">
              {inventory.map(item => {
                const isLow = (item.stock || item.quantity || 0) <= (item.minStock || 10);
                return (
                  <div key={item.id} className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon || '🧼'}</span>
                      <div>
                        <h4 className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{item.name}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">Min. Stok: {item.minStock || 10} {item.unit}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        isLow ? 'bg-rose-500/20 text-rose-500 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {item.stock} {item.unit}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 4: TIM KARYAWAN */}
          {activeTab === 'team' && (
            <div className="space-y-2.5">
              {staffList.map(st => (
                <div key={st.id} className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                }`}>
                  <div className="flex items-center gap-2.5">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black text-xs ${
                      isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {st.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                    </div>
                    <div>
                      <h4 className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{st.name}</h4>
                      <p className="text-[10px] text-slate-400 font-semibold">{st.role}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-[9px] font-black rounded-full border border-emerald-200">
                    Hadir Aktif
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 6. Modal Tarik Kas Toko */}
      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl border animate-scale-up ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-start pb-2 border-b border-slate-200/60">
              <div>
                <h3 className="text-sm font-black">Tarik Saldo Kas Laundry</h3>
                <p className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Transfer kas harian ke rekening pribadi Owner
                </p>
              </div>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {withdrawSuccess ? (
              <div className="p-6 text-center space-y-2 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto" />
                <h4 className="text-sm font-black text-emerald-800">Penarikan Kas Berhasil!</h4>
                <p className="text-xs text-emerald-700">Dana sebesar Rp {parseInt(withdrawAmount || 0).toLocaleString('id-ID')} telah ditransfer ke Rekening BCA Owner.</p>
              </div>
            ) : (
              <>
                <div className={`p-3 rounded-2xl border text-xs space-y-1 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex justify-between text-slate-500">
                    <span>Kas Tersedia Hari Ini:</span>
                    <span className="font-bold text-emerald-600">Rp {todayRevenue.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Rekening Tujuan:</span>
                    <span className="font-bold text-slate-800">BCA - 8820-192-881 (Ahmad Faisal)</span>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-700">Jumlah Penarikan (Rp):</label>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className={`w-full border rounded-xl px-3 py-2 text-sm font-black focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => setShowWithdrawModal(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleWithdraw}
                    className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white rounded-xl font-black text-xs shadow-clay-sm"
                  >
                    Tarik Dana Sekarang ✓
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
