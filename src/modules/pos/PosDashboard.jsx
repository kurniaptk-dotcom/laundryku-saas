import React, { useState } from 'react';
import { 
  Monitor, Scale, ShoppingBag, DollarSign, Users, Sparkles, 
  Search, Plus, CheckCircle2, Phone, MessageSquare, Printer, 
  RotateCcw, Trash2, ArrowRight, Play, Square, LogOut, ChevronRight, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateWhatsAppInvoiceUrl } from '../../utils/whatsapp';

export default function PosDashboard({ onLogout }) {
  const { 
    orders, services, machines, weighAndIssueInvoice, 
    updateOrderStatus, toggleMachine, activeTenant 
  } = useApp();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'weigh' | 'machines'
  const [searchQuery, setSearchQuery] = useState('');
  
  // Weighing Scale Modal State
  const [selectedOrderToWeigh, setSelectedOrderToWeigh] = useState(null);
  const [scaleWeight, setScaleWeight] = useState('4.5');
  const [scaleNotes, setScaleNotes] = useState('');

  // Orders segmentation
  const pendingWeighOrders = orders.filter(o => o.status === 'pending_pickup');
  const inProgressOrders = orders.filter(o => ['received', 'washing', 'drying', 'ironing', 'ready'].includes(o.status));
  const completedOrders = orders.filter(o => o.status === 'completed');

  // Stats
  const todayRevenue = orders
    .filter(o => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const handleConfirmWeighing = () => {
    if (!selectedOrderToWeigh) return;
    weighAndIssueInvoice(selectedOrderToWeigh.id, scaleWeight, scaleNotes);
    
    // Automatically open WhatsApp invoice in new tab
    const url = generateWhatsAppInvoiceUrl({
      ...selectedOrderToWeigh,
      amount: scaleWeight,
      totalPrice: Math.round(scaleWeight * selectedOrderToWeigh.pricePerUnit)
    }, activeTenant?.branding?.laundryName);
    
    window.open(url, '_blank');
    setSelectedOrderToWeigh(null);
    setScaleNotes('');
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 font-sans antialiased select-none overflow-hidden">
      
      {/* 1. Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col justify-between p-5 border-r border-slate-800 flex-shrink-0">
        <div className="space-y-6">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 flex items-center justify-center text-white text-xl shadow-clay-sm">
              💻
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-tight">
                {activeTenant?.branding?.laundryName || 'SmartKasir POS'}
              </h2>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">
                Frontdesk Terminal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            {[
              { id: 'orders', label: '📦 Antrean Produksi', icon: ShoppingBag },
              { id: 'weigh', label: '⚖️ Timbang & Nota WA', icon: Scale, badge: pendingWeighOrders.length },
              { id: 'machines', label: '🌀 Kontrol Mesin IoT', icon: Play },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-clay-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                  {tab.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 text-[10px] font-black">
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="text-xs text-slate-400 space-y-0.5">
            <p className="font-bold text-slate-200">Kasir: Siti Rahmawati</p>
            <p className="text-[10px]">Timbangan: <span className="text-emerald-400 font-bold">● Terhubung</span></p>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-2 px-3 py-2.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-black transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar Kasir POS</span>
            </button>
          )}
        </div>
      </aside>

      {/* 2. Main Workspace */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        {/* Top Header Bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 py-4 flex justify-between items-center shadow-xs">
          <div>
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {activeTab === 'orders' ? 'Workspace Kasir & Produksi' : activeTab === 'weigh' ? 'Meja Timbang & Penerbitan Nota' : 'Pusat Kontrol Mesin IoT'}
            </h1>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Kelola penimbangan digital, terbitkan nota WhatsApp, dan pantau mesin cuci secara terpadu.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] font-black uppercase text-slate-400 block">Total Omzet Kasir:</span>
              <strong className="text-base font-black text-emerald-600">Rp {todayRevenue.toLocaleString('id-ID')}</strong>
            </div>
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6">
          
          {/* ================= TAB 1: ORDERS KANBAN & PIPELINE ================= */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              {/* Kanban Columns */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                
                {/* 1. Menunggu Timbang */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                      🛵 Jemputan Masuk
                    </h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                      {pendingWeighOrders.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {pendingWeighOrders.map(order => (
                      <div key={order.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700 space-y-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">{order.id}</h4>
                            <p className="text-[11px] font-semibold text-slate-500">{order.customerName}</p>
                          </div>
                          <span className="text-xs">🧺</span>
                        </div>
                        <p className="text-[10px] text-slate-400 truncate">{order.pickupAddress}</p>
                        
                        <button
                          onClick={() => {
                            setSelectedOrderToWeigh(order);
                            setActiveTab('weigh');
                          }}
                          className="w-full py-2 bg-primary hover:bg-primary-dark text-white font-black text-[11px] rounded-xl shadow-clay-sm cursor-pointer"
                        >
                          Timbang & Buat Nota ⚖️
                        </button>
                      </div>
                    ))}
                    {pendingWeighOrders.length === 0 && (
                      <p className="text-xs text-slate-400 text-center py-6">Tidak ada antrean jemputan</p>
                    )}
                  </div>
                </div>

                {/* 2. Sedang Dicuci & Dikeringkan */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                      🌀 Cuci & Kering
                    </h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-sky-50 text-primary border border-sky-200">
                      {orders.filter(o => ['received', 'washing', 'drying'].includes(o.status)).length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {orders.filter(o => ['received', 'washing', 'drying'].includes(o.status)).map(order => (
                      <div key={order.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700 space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">{order.id}</h4>
                            <p className="text-[11px] font-bold text-primary">{order.amount} {order.unit} · {order.serviceName}</p>
                          </div>
                          <span className="text-[9px] font-black px-2 py-0.5 bg-sky-100 text-primary rounded-md">
                            {order.status}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pt-1">
                          <button
                            onClick={() => updateOrderStatus(order.id, 'ironing')}
                            className="py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] rounded-lg cursor-pointer"
                          >
                            Ke Setrika ➔
                          </button>
                          <a
                            href={generateWhatsAppInvoiceUrl(order, activeTenant?.branding?.laundryName)}
                            target="_blank"
                            rel="noreferrer"
                            className="py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[10px] rounded-lg text-center"
                          >
                            Kirim WA 💬
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Setrika & Siap Antar */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                      🔌 Setrika & Siap Antar
                    </h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {orders.filter(o => ['ironing', 'ready'].includes(o.status)).length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {orders.filter(o => ['ironing', 'ready'].includes(o.status)).map(order => (
                      <div key={order.id} className="p-3.5 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/60 dark:border-slate-700 space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-black text-slate-900 dark:text-white">{order.id}</h4>
                            <p className="text-[11px] font-semibold text-slate-500">{order.customerName}</p>
                          </div>
                          <span className="text-xs font-black text-emerald-600">Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                        </div>

                        <button
                          onClick={() => updateOrderStatus(order.id, 'completed')}
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[11px] rounded-xl shadow-clay-sm cursor-pointer"
                        >
                          Selesaikan Order ✓
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Riwayat Selesai */}
                <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-xs font-black text-slate-800 dark:text-white uppercase tracking-wider">
                      ✅ Selesai Hari Ini
                    </h3>
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                      {completedOrders.length}
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {completedOrders.map(order => (
                      <div key={order.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-700/50 flex justify-between items-center opacity-80">
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">{order.id}</h4>
                          <p className="text-[10px] text-slate-400">{order.customerName} · {order.amount} {order.unit}</p>
                        </div>
                        <span className="text-xs font-black text-emerald-600">Lunas ✓</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ================= TAB 2: WEIGH & ISSUE NOTA WA ================= */}
          {activeTab === 'weigh' && (
            <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">Meja Timbang & Nota Digital</h3>
                  <p className="text-xs text-slate-400 font-medium">Input timbangan riil untuk menerbitkan nota resmi via WhatsApp.</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-black">
                  Timbangan IoT Siap
                </span>
              </div>

              {selectedOrderToWeigh ? (
                <div className="space-y-5">
                  <div className="p-4 bg-sky-50 dark:bg-sky-950/40 rounded-2xl border border-sky-100 dark:border-sky-800 space-y-1">
                    <span className="text-[10px] font-black uppercase text-primary">Pesanan Terpilih:</span>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">{selectedOrderToWeigh.id} • {selectedOrderToWeigh.customerName}</h4>
                    <p className="text-xs text-slate-500 font-semibold">Layanan: {selectedOrderToWeigh.serviceName} (Tarif: Rp {selectedOrderToWeigh.pricePerUnit.toLocaleString('id-ID')}/{selectedOrderToWeigh.unit})</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">Berat Riil Timbangan (Kg):</label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.1"
                          value={scaleWeight}
                          onChange={e => setScaleWeight(e.target.value)}
                          className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 text-2xl font-black text-primary focus:outline-none focus:border-primary"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400">Kg</span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">Total Tagihan Otomatis:</label>
                      <div className="w-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-4 flex items-center justify-between">
                        <span className="text-2xl font-black text-emerald-600">
                          Rp {Math.round((parseFloat(scaleWeight) || 0) * selectedOrderToWeigh.pricePerUnit).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-black text-slate-700 dark:text-slate-300 block mb-1">Catatan Tambahan Kasir:</label>
                    <textarea 
                      rows={2}
                      value={scaleNotes}
                      onChange={e => setScaleNotes(e.target.value)}
                      placeholder="Contoh: Ada kancing lepas di kemeja biru, sudah dikonfirmasi ke pelanggan."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs font-semibold text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setSelectedOrderToWeigh(null)}
                      className="px-5 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold text-xs rounded-2xl cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      onClick={handleConfirmWeighing}
                      className="flex-1 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm cursor-pointer flex items-center justify-center gap-2"
                    >
                      <span>Terbitkan Nota & Buka WhatsApp Konsumen ✓</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Pilih Pesanan Masuk untuk Ditimbang:</p>
                  <div className="space-y-3">
                    {pendingWeighOrders.map(order => (
                      <div 
                        key={order.id}
                        onClick={() => setSelectedOrderToWeigh(order)}
                        className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-primary cursor-pointer transition-all flex justify-between items-center"
                      >
                        <div>
                          <h4 className="text-xs font-black text-slate-900 dark:text-white">{order.id} • {order.customerName}</h4>
                          <p className="text-[11px] text-slate-500">{order.serviceName} · Alamat: {order.pickupAddress}</p>
                        </div>
                        <span className="px-3 py-1.5 bg-primary text-white font-black text-xs rounded-xl shadow-clay-sm">
                          Pilih & Timbang ➔
                        </span>
                      </div>
                    ))}
                    {pendingWeighOrders.length === 0 && (
                      <div className="text-center py-12 space-y-2">
                        <span className="text-4xl">⚖️</span>
                        <p className="text-xs font-bold text-slate-400">Tidak ada antrean timbangan yang tertunda.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ================= TAB 3: MACHINES IOT CONTROLS ================= */}
          {activeTab === 'machines' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {machines.map(m => (
                  <div key={m.id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-soft space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[10px] font-black uppercase text-slate-400">{m.type}</span>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white">{m.name}</h4>
                      </div>
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${
                        m.status === 'running' ? 'bg-sky-50 text-primary border border-sky-200 animate-pulse' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {m.status === 'running' ? '● Berjalan' : '○ Standby'}
                      </span>
                    </div>

                    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl space-y-1">
                      <span className="text-[10px] text-slate-400">Status Beban:</span>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        {m.currentOrder ? `Order: ${m.currentOrder} (${m.timeLeft} mnt lagi)` : 'Siap digunakan'}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleMachine(m.id, m.status === 'running' ? 'idle' : 'running')}
                      className={`w-full py-2.5 rounded-xl font-black text-xs transition-all cursor-pointer ${
                        m.status === 'running'
                          ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200'
                          : 'bg-primary hover:bg-primary-dark text-white shadow-clay-sm'
                      }`}
                    >
                      {m.status === 'running' ? 'Hentikan Mesin ⏹' : 'Jalankan Mesin (Start) ▶'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>

    </div>
  );
}
