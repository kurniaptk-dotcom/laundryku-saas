import React, { useState } from 'react';
import { 
  Home as HomeIcon, ClipboardList, Plus, Percent, User, 
  Wallet, Sparkles, Bell, ArrowLeft, ArrowUpRight, CheckCircle2, 
  Calendar, Truck, Phone, LogOut, ChevronRight, Gift, Tag, X, FileText, Check
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateWhatsAppInvoiceUrl } from '../../utils/whatsapp';

export default function CustomerApp({ onLogout }) {
  const { 
    activeCustomer, customers, orders, services, vouchers, 
    createPickupOrder, payOrder, topUpWallet, activeTenant
  } = useApp();

  const [currentTab, setCurrentTab] = useState('home'); // 'home' | 'orders' | 'create_order' | 'promos' | 'profile' | 'detail'
  const [selectedOrderId, setSelectedOrderId] = useState('INV-240821-001');
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('50000');

  // Customer specific orders
  const customerOrders = orders.filter(o => o.customerPhone === activeCustomer.phone || o.customerName === activeCustomer.name);
  const activeOrders = customerOrders.filter(o => o.status !== 'completed');
  const completedOrders = customerOrders.filter(o => o.status === 'completed');
  const selectedOrder = orders.find(o => o.id === selectedOrderId) || activeOrders[0] || orders[0];

  // ================= SUB SCREEN: CREATE ORDER ================= //
  const [orderStep, setOrderStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || 'svc_1');
  const [bagCount, setBagCount] = useState(1);
  const [orderNotes, setOrderNotes] = useState('');
  const [pickupDate, setPickupDate] = useState('Hari ini');
  const [pickupTime, setPickupTime] = useState('10:00 - 12:00');

  const selectedService = services.find(s => s.id === selectedServiceId) || services[0];

  const handleFinishCreateOrder = () => {
    createPickupOrder({
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      unit: selectedService.unit,
      pricePerUnit: selectedService.price,
      bagCount,
      notes: orderNotes,
      address: activeCustomer.address
    });
    setOrderStep(1);
    setCurrentTab('orders');
  };

  return (
    <div className="w-full min-h-screen py-0 sm:py-6 flex justify-center items-start bg-slate-100 dark:bg-slate-950 font-sans antialiased select-none">
      
      {/* App Container */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[800px] bg-slate-50 rounded-none sm:rounded-[36px] shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col relative">
        
        {/* ================= 1. TAB: HOME ================= */}
        {currentTab === 'home' && (
          <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
            
            {/* Sticky Header */}
            <div className="flex items-center justify-between px-5 pt-5 pb-4 bg-white/95 backdrop-blur-md border-b border-slate-100 sticky top-0 z-20 shadow-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-clay-sm">
                  {activeCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h1 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1">
                    <span>Halo, {activeCustomer.name.split(' ')[0]}</span>
                    <span className="text-xs">👋</span>
                  </h1>
                  <p className="text-[11px] font-bold text-sky-600">
                    🧼 {activeTenant?.branding?.laundryName || 'LaundryKu Pro'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="px-2.5 py-1.5 bg-amber-50 border border-amber-200/80 rounded-xl text-xs font-black text-amber-800 flex items-center gap-1">
                  <span>⭐</span>
                  <span>{activeCustomer.loyaltyPoints} Pts</span>
                </div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              
              {/* Hero Banner */}
              <div className="bg-gradient-to-r from-sky-500 via-primary to-indigo-600 p-5 rounded-3xl text-white shadow-soft relative overflow-hidden space-y-3">
                <div className="flex justify-between items-start z-10 relative">
                  <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-wider">
                    ✨ Promo Spesial
                  </span>
                  <span className="text-xs font-mono bg-white/15 px-2.5 py-0.5 rounded-lg border border-white/20 font-bold">
                    HEMAT30
                  </span>
                </div>

                <div className="z-10 relative space-y-1">
                  <h2 className="text-xl font-black leading-tight">Cuci Bersih, Hidup Praktis</h2>
                  <p className="text-xs text-sky-100 font-medium">Pesan penjemputan sekarang, kurir langsung meluncur ke rumah Anda.</p>
                </div>

                <button 
                  onClick={() => setCurrentTab('create_order')}
                  className="z-10 relative px-4 py-2 bg-white text-primary font-black text-xs rounded-xl shadow-soft hover:bg-sky-50 active:scale-95 transition-all inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Pesan Penjemputan</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[3]" />
                </button>
              </div>

              {/* Wallet Card */}
              <div className="bg-white rounded-3xl border border-slate-150 p-4 shadow-soft space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 to-primary text-white flex items-center justify-center shadow-clay-sm">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Laundry Wallet</span>
                      <h3 className="text-xl font-black text-slate-850">Rp {activeCustomer.walletBalance.toLocaleString('id-ID')}</h3>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowTopUpModal(true)}
                    className="px-4 py-2 bg-primary hover:bg-primary-dark text-white font-black text-xs rounded-xl shadow-clay-sm cursor-pointer"
                  >
                    + Top Up
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                    ⭐ {activeCustomer.tier}
                  </span>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    1.250 Poin = Rp 12.500
                  </span>
                </div>
              </div>

              {/* Catalog Grid */}
              <div className="space-y-2.5">
                <div className="flex justify-between items-center px-1">
                  <h3 className="text-sm font-black text-slate-800">Katalog Layanan</h3>
                  <button 
                    onClick={() => setCurrentTab('create_order')}
                    className="text-xs font-bold text-primary hover:underline flex items-center"
                  >
                    Order <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-4 gap-2.5">
                  {services.map((svc) => (
                    <button
                      key={svc.id}
                      onClick={() => {
                        setSelectedServiceId(svc.id);
                        setCurrentTab('create_order');
                      }}
                      className="p-2.5 bg-white border border-slate-100 rounded-2xl shadow-soft hover:border-primary transition-all flex flex-col items-center text-center group cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-lg shadow-xs group-hover:scale-110 transition-transform">
                        {svc.icon}
                      </div>
                      <span className="text-[10px] font-black text-slate-800 group-hover:text-primary mt-1.5 leading-tight line-clamp-2">
                        {svc.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Orders Live Tracking Card */}
              {activeOrders.length > 0 && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex justify-between items-center px-1">
                    <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Pesanan Berjalan</span>
                    </h3>
                    <span className="text-[10px] font-black text-primary bg-sky-50 px-2 py-0.5 rounded-full border border-sky-100">
                      {activeOrders.length} Aktif
                    </span>
                  </div>

                  {activeOrders.map((order) => (
                    <div
                      key={order.id}
                      onClick={() => {
                        setSelectedOrderId(order.id);
                        setCurrentTab('detail');
                      }}
                      className="p-4 bg-white border-2 border-sky-100 rounded-3xl shadow-soft hover:border-primary transition-all cursor-pointer space-y-3"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs font-black text-slate-900">{order.id}</h4>
                            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-sky-50 text-primary border border-sky-200">
                              {order.status === 'pending_pickup' ? '🛵 Menunggu Kurir' : order.status === 'washing' ? '🌀 Sedang Dicuci' : order.status === 'drying' ? '💨 Pengeringan' : order.status === 'ironing' ? '🔌 Disetrika' : '✨ Siap Antar'}
                            </span>
                          </div>
                          <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                            {order.serviceName} {order.amount > 0 ? `· ${order.amount} ${order.unit}` : '(Menunggu timbangan)'}
                          </p>
                        </div>
                        <span className="text-xl">🧺</span>
                      </div>

                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-1 border-t border-slate-50">
                        <span>Kurir: <strong className="text-slate-700">{order.courierName}</strong></span>
                        <span className="text-primary font-black">Lacak Detail →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        )}

        {/* ================= 2. TAB: CREATE ORDER WIZARD ================= */}
        {currentTab === 'create_order' && (
          <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
            <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100 flex items-center gap-3 sticky top-0 z-30">
              <button 
                onClick={() => orderStep > 1 ? setOrderStep(orderStep - 1) : setCurrentTab('home')}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <h2 className="text-base font-black text-slate-850">Buat Pesanan Laundry</h2>
            </div>

            {/* Steps Progress */}
            <div className="px-6 py-3 bg-white border-b border-slate-100 flex justify-between text-[10px] font-black text-slate-400">
              <span className={orderStep >= 1 ? 'text-primary font-black' : ''}>1. Layanan</span>
              <span className={orderStep >= 2 ? 'text-primary font-black' : ''}>2. Detail</span>
              <span className={orderStep >= 3 ? 'text-primary font-black' : ''}>3. Jadwal</span>
              <span className={orderStep >= 4 ? 'text-primary font-black' : ''}>4. Konfirmasi</span>
            </div>

            <div className="p-5 space-y-5">
              
              {/* Step 1: Layanan */}
              {orderStep === 1 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Pilih Layanan Utama</h3>
                  <div className="space-y-2.5">
                    {services.map((svc) => (
                      <div
                        key={svc.id}
                        onClick={() => setSelectedServiceId(svc.id)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                          selectedServiceId === svc.id ? 'border-primary bg-sky-50/50 shadow-soft' : 'border-slate-100 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{svc.icon}</span>
                          <div>
                            <h4 className="text-xs font-black text-slate-850">{svc.name}</h4>
                            <p className="text-[10px] font-semibold text-slate-400">Estimasi: {svc.duration}</p>
                          </div>
                        </div>
                        <span className="text-xs font-black text-primary">
                          Rp {svc.price.toLocaleString('id-ID')}/{svc.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 2: Detail Kantong & Catatan */}
              {orderStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Perkiraan Jumlah Kantong</h3>
                  <div className="p-4 bg-white border border-slate-100 rounded-3xl shadow-soft flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-slate-800">Jumlah Tas / Kantong</h4>
                      <p className="text-[10px] text-slate-400">Kasir akan menimbang ulang di gerai</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setBagCount(Math.max(1, bagCount - 1))}
                        className="w-8 h-8 rounded-xl bg-slate-100 text-slate-800 font-black flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-sm font-black">{bagCount}</span>
                      <button 
                        onClick={() => setBagCount(bagCount + 1)}
                        className="w-8 h-8 rounded-xl bg-primary text-white font-black flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-black text-slate-700 block mb-1">Catatan Khusus Cuci:</label>
                    <textarea 
                      rows={3}
                      value={orderNotes}
                      onChange={e => setOrderNotes(e.target.value)}
                      placeholder="Contoh: Kemeja putih tolong pisahkan, parfum wangi sakura"
                      className="w-full bg-white border border-slate-200 rounded-2xl p-3 text-xs font-semibold text-slate-800 focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Jadwal Penjemputan */}
              {orderStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Pilih Waktu Jemput</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {['Hari ini', 'Besok', 'Lusa'].map(d => (
                      <button
                        key={d}
                        onClick={() => setPickupDate(d)}
                        className={`py-3 rounded-2xl border-2 font-black text-xs transition-all ${
                          pickupDate === d ? 'border-primary bg-sky-50 text-primary' : 'border-slate-100 bg-white text-slate-600'
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 pt-2">
                    {['08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '16:00 - 18:00'].map(t => (
                      <div
                        key={t}
                        onClick={() => setPickupTime(t)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                          pickupTime === t ? 'border-primary bg-sky-50 text-primary font-black' : 'border-slate-100 bg-white text-slate-700 font-semibold'
                        }`}
                      >
                        <span className="text-xs">🕒 {t}</span>
                        {pickupTime === t && <Check className="w-4 h-4 text-primary" />}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Konfirmasi */}
              {orderStep === 4 && (
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Konfirmasi Penjemputan</h3>
                  <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-soft space-y-3 text-xs">
                    <div className="flex justify-between pb-2 border-b border-slate-50">
                      <span className="text-slate-400">Layanan:</span>
                      <strong className="text-slate-800">{selectedService.name}</strong>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-50">
                      <span className="text-slate-400">Perkiraan:</span>
                      <strong className="text-slate-800">{bagCount} Kantong</strong>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-50">
                      <span className="text-slate-400">Jadwal Jemput:</span>
                      <strong className="text-slate-800">{pickupDate}, {pickupTime}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Alamat:</span>
                      <strong className="text-slate-800 text-right max-w-[200px] truncate">{activeCustomer.address}</strong>
                    </div>
                  </div>

                  <div className="p-4 bg-sky-50 border border-sky-100 rounded-2xl text-[11px] text-slate-600 leading-relaxed font-semibold">
                    ℹ️ <strong>Nota Digital Transparan:</strong> Kurir akan mengambil laundry Anda dan kasir akan menimbang secara presisi di gerai. Nota tagihan otomatis dikirim ke WhatsApp Anda.
                  </div>
                </div>
              )}

              {/* Step CTA */}
              <div className="pt-3">
                <button
                  onClick={() => orderStep < 4 ? setOrderStep(orderStep + 1) : handleFinishCreateOrder()}
                  className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm cursor-pointer"
                >
                  {orderStep === 4 ? 'Kirim Kurir Jemput Sekarang ✓' : 'Lanjutkan →'}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* ================= 3. TAB: ORDERS LIST ================= */}
        {currentTab === 'orders' && (
          <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
            <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-30 flex justify-between items-center">
              <h2 className="text-base font-black text-slate-850">Daftar Pesanan Saya</h2>
              <span className="text-[10px] font-black px-2.5 py-1 bg-sky-50 text-primary rounded-full border border-sky-100">
                {activeOrders.length} Aktif
              </span>
            </div>

            <div className="p-4 space-y-3">
              {customerOrders.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <span className="text-5xl">🧺</span>
                  <p className="text-slate-500 font-bold text-sm">Belum ada pesanan aktif</p>
                  <button 
                    onClick={() => setCurrentTab('create_order')}
                    className="px-5 py-2.5 bg-primary text-white font-black text-xs rounded-xl shadow-clay-sm cursor-pointer"
                  >
                    Buat Pesanan Baru
                  </button>
                </div>
              ) : (
                <>
                  {activeOrders.map(o => (
                    <div 
                      key={o.id}
                      onClick={() => { setSelectedOrderId(o.id); setCurrentTab('detail'); }}
                      className="p-4 bg-white border border-slate-100 rounded-3xl shadow-soft cursor-pointer hover:border-primary transition-all flex justify-between items-center group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-slate-800">{o.id}</h4>
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-50 text-amber-700 rounded-full border border-amber-200">
                            {o.status === 'pending_pickup' ? '🛵 Menunggu Kurir' : o.status === 'washing' ? '🌀 Sedang Dicuci' : o.status === 'drying' ? '💨 Pengeringan' : o.status === 'ironing' ? '🔌 Disetrika' : '✨ Siap Antar'}
                          </span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500">
                          {o.serviceName} {o.amount > 0 ? `· ${o.amount} ${o.unit}` : '(Menunggu timbangan)'}
                        </p>
                      </div>
                      <span className="text-xs text-primary font-black group-hover:translate-x-1 transition-transform">
                        Lacak →
                      </span>
                    </div>
                  ))}

                  {completedOrders.length > 0 && (
                    <div className="pt-3">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 px-1">Riwayat Selesai</p>
                      {completedOrders.map(o => (
                        <div key={o.id} className="p-3.5 bg-white border border-slate-100 rounded-2xl shadow-soft flex justify-between items-center opacity-80 mb-2">
                          <div>
                            <h4 className="text-xs font-bold text-slate-700">{o.id}</h4>
                            <p className="text-[10px] text-slate-400">{o.serviceName} · {o.amount} {o.unit}</p>
                          </div>
                          <span className="px-2 py-0.5 text-[9px] font-black rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                            Selesai ✓
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* ================= 4. TAB: ORDER DETAIL ================= */}
        {currentTab === 'detail' && selectedOrder && (
          <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
            <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-30 flex items-center gap-3">
              <button 
                onClick={() => setCurrentTab('orders')}
                className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </button>
              <h2 className="text-base font-black text-slate-850">Detail Pelacakan</h2>
            </div>

            <div className="p-5 space-y-4">
              
              {/* Invoice Header */}
              <div className="p-5 bg-gradient-to-br from-primary to-indigo-700 rounded-3xl text-white shadow-soft space-y-2">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-bold text-sky-200 uppercase tracking-wider">No. Invoice</span>
                    <h3 className="text-lg font-black">{selectedOrder.id}</h3>
                  </div>
                  <span className="px-2.5 py-1 bg-white/20 rounded-full text-[9px] font-black uppercase">
                    {selectedOrder.status}
                  </span>
                </div>
                <p className="text-xs text-sky-100 font-semibold">{selectedOrder.serviceName}</p>
              </div>

              {/* Progress Milestones */}
              <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-soft space-y-4">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Status Pengerjaan</h3>
                <div className="space-y-4">
                  {(selectedOrder.history || []).map((h, hi) => (
                    <div key={hi} className="flex gap-3 items-start">
                      <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center text-xs font-black flex-shrink-0 mt-0.5">
                        ✓
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-slate-850">{h.title}</h4>
                          <span className="text-[10px] text-slate-400">{h.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">{h.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Billing Card */}
              <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-soft space-y-3 text-xs">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Rincian Pembayaran</h3>
                <div className="flex justify-between pb-2 border-b border-slate-50">
                  <span className="text-slate-400">Berat Timbangan:</span>
                  <strong className="text-slate-800">{selectedOrder.amount} {selectedOrder.unit}</strong>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-50">
                  <span className="text-slate-400">Total Tagihan:</span>
                  <strong className="text-primary font-black text-sm">Rp {selectedOrder.totalPrice.toLocaleString('id-ID')}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Status Pembayaran:</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black ${
                    selectedOrder.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-rose-50 text-rose-600 border border-rose-200'
                  }`}>
                    {selectedOrder.paymentStatus === 'Paid' ? 'Lunas ✓' : 'Belum Lunas'}
                  </span>
                </div>

                {/* Pay Action If Unpaid */}
                {selectedOrder.paymentStatus !== 'Paid' && selectedOrder.totalPrice > 0 && (
                  <div className="pt-2 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => payOrder(selectedOrder.id, 'Wallet')}
                      className="py-2.5 bg-primary hover:bg-primary-dark text-white font-black text-xs rounded-xl shadow-clay-sm cursor-pointer"
                    >
                      Bayar via Saldo
                    </button>
                    <button
                      onClick={() => payOrder(selectedOrder.id, 'COD')}
                      className="py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs rounded-xl cursor-pointer"
                    >
                      Bayar COD Tunai
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* ================= 5. TAB: PROMOS ================= */}
        {currentTab === 'promos' && (
          <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
            <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-30">
              <h2 className="text-base font-black text-slate-850">Promo & Voucher</h2>
            </div>
            <div className="p-5 space-y-4">
              {vouchers.map(v => (
                <div key={v.code} className={`bg-gradient-to-r ${v.color} p-5 rounded-3xl text-white shadow-soft space-y-3`}>
                  <span className="px-2.5 py-1 bg-white/20 text-[9px] font-black rounded-lg uppercase tracking-wider">Voucher</span>
                  <h3 className="text-base font-black">{v.title}</h3>
                  <div className="flex justify-between items-center pt-2">
                    <span className="font-mono text-xs font-black bg-white/15 px-3 py-1.5 rounded-xl border border-white/20">{v.code}</span>
                    <button 
                      onClick={() => alert(`Kode voucher ${v.code} disalin!`)}
                      className="px-4 py-1.5 bg-white text-slate-900 font-black text-xs rounded-xl cursor-pointer"
                    >
                      Salin
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= 6. TAB: PROFILE ================= */}
        {currentTab === 'profile' && (
          <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
            <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-30">
              <h2 className="text-base font-black text-slate-850">Akun Saya</h2>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-4 bg-white p-4 border border-slate-100 rounded-3xl shadow-soft">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-clay-sm">
                  {activeCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-850">{activeCustomer.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold">{activeCustomer.phone}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-black rounded-md">
                    ⭐ {activeCustomer.tier}
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft space-y-3 text-xs font-semibold">
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400">WhatsApp:</span>
                  <strong className="text-slate-900">{activeCustomer.phone}</strong>
                </div>
                <div className="flex justify-between py-1.5 border-b border-slate-50">
                  <span className="text-slate-400">Email:</span>
                  <strong className="text-slate-900">{activeCustomer.email}</strong>
                </div>
                <div className="flex justify-between py-1.5">
                  <span className="text-slate-400">Saldo Wallet:</span>
                  <strong className="text-primary font-black">Rp {activeCustomer.walletBalance.toLocaleString('id-ID')}</strong>
                </div>
              </div>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun (Logout)</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ================= FLOATING BOTTOM NAVIGATION DOCK ================= */}
        {currentTab !== 'create_order' && currentTab !== 'detail' && (
          <div className="sticky bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-2 z-40">
            <button 
              onClick={() => setCurrentTab('home')}
              className={`flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer transition-colors ${currentTab === 'home' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <HomeIcon className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[9px] font-extrabold">Beranda</span>
            </button>

            <button 
              onClick={() => setCurrentTab('orders')}
              className={`flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer transition-colors ${currentTab === 'orders' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ClipboardList className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[9px] font-extrabold">Pesanan</span>
            </button>

            {/* Central Floating Action Button */}
            <div className="relative -top-3 flex flex-col items-center z-50">
              <button 
                onClick={() => setCurrentTab('create_order')}
                className="w-13 h-13 rounded-full text-white shadow-clay-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 clay-button cursor-pointer"
                style={{ width: '52px', height: '52px' }}
              >
                <Plus className="w-7 h-7 stroke-[3]" />
              </button>
              <span className="text-[9px] font-black text-primary mt-1">Buat Pesanan</span>
            </div>

            <button 
              onClick={() => setCurrentTab('promos')}
              className={`flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer transition-colors ${currentTab === 'promos' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Percent className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[9px] font-extrabold">Promo</span>
            </button>

            <button 
              onClick={() => setCurrentTab('profile')}
              className={`flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer transition-colors ${currentTab === 'profile' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <User className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[9px] font-extrabold">Akun</span>
            </button>
          </div>
        )}

      </div>

      {/* ================= TOP UP MODAL ================= */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-60 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="flex justify-between items-center">
              <h3 className="text-base font-black text-slate-850">Top Up Saldo Wallet</h3>
              <button onClick={() => setShowTopUpModal(false)} className="p-1 text-slate-400 hover:text-slate-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {['20000', '50000', '100000', '200000'].map(nominal => (
                <button
                  key={nominal}
                  onClick={() => setTopUpAmount(nominal)}
                  className={`py-3 rounded-2xl border-2 font-black text-xs ${
                    topUpAmount === nominal ? 'border-primary bg-sky-50 text-primary' : 'border-slate-100 bg-white text-slate-700'
                  }`}
                >
                  Rp {parseInt(nominal).toLocaleString('id-ID')}
                </button>
              ))}
            </div>

            <button
              onClick={() => {
                topUpWallet(topUpAmount);
                setShowTopUpModal(false);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-xs rounded-2xl shadow-clay-sm cursor-pointer"
            >
              Konfirmasi Top Up Sekarang ✓
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
