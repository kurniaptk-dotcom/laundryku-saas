import React, { useState } from 'react';
import { 
  Truck, MapPin, Phone, MessageCircle, Navigation, Clock, 
  CheckCircle2, ShieldCheck, Zap, Sparkles, ArrowRight, 
  ChevronRight, Camera, DollarSign, User, AlertCircle, 
  Search, Filter, Check, Power, RefreshCw, Smartphone,
  Sun, Moon
} from 'lucide-react';
import { getWhatsAppChatUrl } from '../../utils/whatsappHelper';

export default function SmartCourierApp({
  activeOrders = [],
  orderHistory = [],
  couriers = [],
  onUpdateOrderStatus,
  branding = {},
  onSwitchRole,
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

  const [isOnline, setIsOnline] = useState(true);
  const [selectedCourierId, setSelectedCourierId] = useState(couriers[0]?.id || 'CR-001');
  const [taskFilter, setTaskFilter] = useState('all'); // 'all' | 'pickup' | 'delivery' | 'done'
  const [selectedOrderForHandover, setSelectedOrderForHandover] = useState(null);
  const [handoverPhoto, setHandoverPhoto] = useState(null);
  const [handoverNote, setHandoverNote] = useState('');
  const [successToast, setSuccessToast] = useState('');

  const currentCourier = couriers.find(c => c.id === selectedCourierId) || couriers[0] || {
    id: 'CR-001',
    name: 'Doni Pratama',
    phone: '0812-9988-7711',
    vehicle: 'Honda Vario B 4821 TZX',
    rating: '4.9'
  };

  const courierTasks = activeOrders.filter(order => {
    const isPickup = order.status === 'menunggu_penjemputan' || order.status === 'kurir_menuju_lokasi';
    const isDelivery = order.status === 'siap_diambil' || order.status === 'sedang_diantar';
    return isPickup || isDelivery || (order.courierName === currentCourier.name);
  });

  const completedTodayTasks = orderHistory.filter(o => o.courierName === currentCourier.name || o.fulfillmentType === 'delivery');

  const filteredTasks = courierTasks.filter(task => {
    if (taskFilter === 'pickup') {
      return task.status === 'menunggu_penjemputan' || task.status === 'kurir_menuju_lokasi';
    }
    if (taskFilter === 'delivery') {
      return task.status === 'siap_diambil' || task.status === 'sedang_diantar';
    }
    if (taskFilter === 'done') {
      return false;
    }
    return true;
  });

  const displayList = taskFilter === 'done' ? completedTodayTasks : filteredTasks;

  const completedCount = completedTodayTasks.length;
  const estimatedEarnings = completedCount * 5000;

  const handleStartTrip = (orderId, currentStatus) => {
    const nextStatus = currentStatus === 'menunggu_penjemputan' ? 'kurir_menuju_lokasi' : 'sedang_diantar';
    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(orderId, nextStatus);
    }
    setSuccessToast(`Status diperbarui: Kurir sedang menuju lokasi!`);
    setTimeout(() => setSuccessToast(''), 3000);
  };

  const handleCompleteHandover = () => {
    if (!selectedOrderForHandover) return;
    
    const isPickup = selectedOrderForHandover.status === 'menunggu_penjemputan' || selectedOrderForHandover.status === 'kurir_menuju_lokasi';
    const nextStatus = isPickup ? 'dicuci' : 'selesai';

    if (onUpdateOrderStatus) {
      onUpdateOrderStatus(selectedOrderForHandover.id, nextStatus);
    }

    setSuccessToast(isPickup ? 'Cucian berhasil dijemput & tiba di outlet!' : 'Cucian berhasil diserahkan ke pelanggan!');
    setTimeout(() => setSuccessToast(''), 3500);
    setSelectedOrderForHandover(null);
    setHandoverPhoto(null);
    setHandoverNote('');
  };

  return (
    <div className={`max-w-md mx-auto min-h-screen flex flex-col font-sans relative shadow-2xl overflow-hidden border transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100 border-slate-800' : 'bg-[#F1F5F9] text-slate-900 border-slate-200'
    }`}>
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-60 w-11/12 max-w-sm bg-emerald-600 text-white p-3.5 rounded-2xl shadow-xl font-bold text-xs flex items-center gap-2.5 animate-scale-up">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successToast}</span>
        </div>
      )}

      {/* 1. Header Kurir & Profile */}
      <header className={`border-b p-4 sticky top-0 z-40 space-y-3 transition-colors ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-600 flex items-center justify-center text-white text-lg font-black shadow-md">
              🛵
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  {branding.laundryName || 'SmartKurir Pro'}
                </h1>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-black border ${
                  isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-800 border-amber-200'
                }`}>
                  DRIVER APP
                </span>
              </div>
              <p className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Armada Logistik Antar-Jemput
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleMode}
              className={`p-1.5 rounded-xl border text-xs font-black transition-colors ${
                isDark ? 'bg-slate-800 text-amber-300 border-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200'
              }`}
              title={isDark ? 'Mode Terang' : 'Mode Gelap'}
            >
              {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
            </button>

            {/* Online/Offline Toggle */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black transition-all ${
                isOnline 
                  ? 'bg-emerald-500/15 text-emerald-700 border border-emerald-300 shadow-xs' 
                  : isDark ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
              <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
            </button>
          </div>
        </div>

        {/* Driver Profile Bar */}
        <div className={`flex items-center justify-between p-3 rounded-2xl border ${
          isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 flex items-center justify-center text-white font-black text-xs shadow">
              {currentCourier.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{currentCourier.name}</span>
                <span className="text-[10px] font-bold text-amber-500 flex items-center gap-0.5">
                  ⭐ {currentCourier.rating || '4.9'}
                </span>
              </div>
              <p className={`text-[10px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                🛵 {currentCourier.vehicle || 'Honda Vario B 4821 TZX'}
              </p>
            </div>
          </div>

          {/* Switch Driver */}
          {couriers.length > 1 && (
            <select
              value={selectedCourierId}
              onChange={(e) => setSelectedCourierId(e.target.value)}
              className={`text-[10px] font-black px-2 py-1 rounded-lg border focus:outline-none ${
                isDark ? 'bg-slate-800 text-slate-300 border-slate-700' : 'bg-white text-slate-700 border-slate-200 shadow-xs'
              }`}
            >
              {couriers.map(c => (
                <option key={c.id} value={c.id}>Ganti: {c.name.split(' ')[0]}</option>
              ))}
            </select>
          )}
        </div>

        {/* Daily Stats Summary */}
        <div className="grid grid-cols-3 gap-2 pt-1">
          <div className={`p-2.5 rounded-xl border text-center ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <p className={`text-[9px] font-black uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Tugas Aktif</p>
            <p className="text-sm font-black text-primary mt-0.5">{courierTasks.length}</p>
          </div>
          <div className={`p-2.5 rounded-xl border text-center ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <p className={`text-[9px] font-black uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Selesai Hari Ini</p>
            <p className="text-sm font-black text-emerald-600 mt-0.5">{completedCount} Trip</p>
          </div>
          <div className={`p-2.5 rounded-xl border text-center ${
            isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
          }`}>
            <p className={`text-[9px] font-black uppercase ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Komisi Trip</p>
            <p className="text-sm font-black text-amber-600 mt-0.5">Rp {(estimatedEarnings/1000).toLocaleString('id-ID')}k</p>
          </div>
        </div>
      </header>

      {/* 2. Task Filter Tabs */}
      <div className={`px-4 pt-3 pb-1 ${isDark ? 'bg-slate-950' : 'bg-[#F1F5F9]'}`}>
        <div className={`flex p-1 rounded-xl border gap-1 ${
          isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
        }`}>
          {[
            { id: 'all', label: 'Semua Tugas', count: courierTasks.length },
            { id: 'pickup', label: 'Jemput', count: courierTasks.filter(t => t.status === 'menunggu_penjemputan' || t.status === 'kurir_menuju_lokasi').length },
            { id: 'delivery', label: 'Antar', count: courierTasks.filter(t => t.status === 'siap_diambil' || t.status === 'sedang_diantar').length },
            { id: 'done', label: 'Riwayat', count: completedCount },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setTaskFilter(tab.id)}
              className={`flex-1 py-1.5 text-[11px] font-black rounded-lg transition-all flex items-center justify-center gap-1 ${
                taskFilter === tab.id
                  ? 'bg-primary text-white shadow-sm'
                  : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                  taskFilter === tab.id ? 'bg-white/20 text-white' : isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Task List */}
      <main className="flex-1 p-4 space-y-3.5 overflow-y-auto">
        {!isOnline ? (
          <div className={`p-8 text-center space-y-3 rounded-3xl border my-8 ${
            isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
          }`}>
            <div className={`w-14 h-14 mx-auto rounded-full flex items-center justify-center text-2xl ${
              isDark ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
            }`}>
              💤
            </div>
            <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Status Anda Sedang Offline</h3>
            <p className={`text-xs max-w-xs mx-auto ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Aktifkan tombol toggle di atas untuk mulai menerima notifikasi penjemputan dan pengantaran cucian.
            </p>
            <button
              onClick={() => setIsOnline(true)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md transition-all"
            >
              Nyalakan Status Online
            </button>
          </div>
        ) : displayList.length === 0 ? (
          <div className={`p-8 text-center space-y-2.5 rounded-3xl border my-8 ${
            isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
          }`}>
            <div className="w-12 h-12 mx-auto rounded-2xl bg-sky-50 text-primary flex items-center justify-center text-2xl border border-sky-200">
              ✨
            </div>
            <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Tidak Ada Tugas Saat Ini</h3>
            <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Semua tugas penjemputan dan pengantaran telah selesai diselesaikan.
            </p>
          </div>
        ) : (
          displayList.map(order => {
            const isPickup = order.status === 'menunggu_penjemputan' || order.status === 'kurir_menuju_lokasi';
            const isDelivering = order.status === 'sedang_diantar' || order.status === 'kurir_menuju_lokasi';
            const customerPhone = order.customerPhone || '0812-3456-7890';
            const customerAddress = order.customerAddress || 'Jl. Cempaka Putih Raya No. 42A, Jakarta Pusat';
            
            const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(customerAddress)}`;
            
            const waGreeting = isPickup
              ? `Halo Kak ${order.customerName}, saya ${currentCourier.name} kurir dari ${branding.laundryName || 'LaundryKu'}. Saya sedang menuju lokasi Kakak untuk jemput cucian (No. Order: #${order.id}). Mohon ditunggu ya Kak 🙏`
              : `Halo Kak ${order.customerName}, cucian Kakak (No. Order: #${order.id}) sudah selesai dan bersih rapi! Saya ${currentCourier.name} sedang dalam perjalanan mengantar ke rumah Kakak 🛵`;
            
            const waUrl = getWhatsAppChatUrl(customerPhone, waGreeting);

            return (
              <div
                key={order.id}
                className={`p-4 rounded-2xl border transition-all space-y-3.5 shadow-xs ${
                  isDark ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-sky-300'
                }`}
              >
                {/* Task Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        isPickup 
                          ? 'bg-amber-50 text-amber-800 border border-amber-200' 
                          : 'bg-sky-50 text-primary border border-sky-200'
                      }`}>
                        {isPickup ? '📦 Penjemputan (Pickup)' : '🚚 Pengantaran (Delivery)'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">#{order.id}</span>
                    </div>
                    <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{order.customerName}</h3>
                  </div>

                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                    order.paymentStatus === 'paid' || order.paid
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200 animate-pulse'
                  }`}>
                    {order.paymentStatus === 'paid' || order.paid ? 'LUNAS (QRIS)' : `COD: Rp ${(order.totalPrice || order.total || 0).toLocaleString('id-ID')}`}
                  </span>
                </div>

                {/* Address & Items */}
                <div className={`space-y-2 text-xs p-3 rounded-xl border ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <p className={`leading-snug font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>{customerAddress}</p>
                  </div>
                  <div className={`flex items-center justify-between text-[11px] pt-1 border-t font-semibold ${
                    isDark ? 'border-slate-800 text-slate-400' : 'border-slate-200 text-slate-500'
                  }`}>
                    <span>🧺 {order.serviceName || order.serviceType || 'Cuci Kering Lipat'} ({order.weight || order.weightKg || '3'} kg)</span>
                    <span className="text-primary font-bold">Rp {(order.totalPrice || order.total || 0).toLocaleString('id-ID')}</span>
                  </div>
                </div>

                {/* Communication & Maps Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={`py-2 px-3 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-colors border ${
                      isDark 
                        ? 'bg-slate-800 hover:bg-slate-700 text-sky-400 border-slate-700' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                    }`}
                  >
                    <Navigation className="w-3.5 h-3.5 text-primary" />
                    <span>Buka Maps</span>
                  </a>

                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-colors border border-emerald-200"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Chat WA</span>
                  </a>
                </div>

                {/* Primary Action Button based on status */}
                {order.status !== 'selesai' && (
                  <div className="pt-1">
                    {!isDelivering ? (
                      <button
                        onClick={() => handleStartTrip(order.id, order.status)}
                        className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-600 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-clay-sm flex items-center justify-center gap-2 transition-all"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Mulai Jalan Menuju Lokasi →</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => setSelectedOrderForHandover(order)}
                        className="w-full py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-clay-sm flex items-center justify-center gap-2 transition-all"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Selesaikan & Foto Bukti Serah Terima ✓</span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </main>

      {/* 4. Modal Handover / Foto Serah Terima */}
      {selectedOrderForHandover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-5 space-y-4 shadow-2xl border animate-scale-up ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-start pb-2 border-b border-slate-200/60">
              <div>
                <h3 className="text-sm font-black">Bukti Serah Terima Pakaian</h3>
                <p className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Order #{selectedOrderForHandover.id} · {selectedOrderForHandover.customerName}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrderForHandover(null)}
                className="p-1 text-slate-400 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            {/* Simulated Photo Capture */}
            <div className="space-y-2">
              <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Foto Bukti Barang / Penerima:
              </label>
              <div 
                onClick={() => setHandoverPhoto('https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=600&auto=format&fit=crop&q=80')}
                className={`h-36 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-colors overflow-hidden relative group ${
                  isDark ? 'border-slate-700 bg-slate-950 hover:border-primary' : 'border-slate-300 bg-slate-50 hover:border-primary'
                }`}
              >
                {handoverPhoto ? (
                  <img src={handoverPhoto} alt="Bukti Serah Terima" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center space-y-1.5 text-slate-400 group-hover:text-primary">
                    <Camera className="w-7 h-7 mx-auto stroke-[1.8]" />
                    <p className="text-[11px] font-bold">Tap untuk Ambil Foto Kamera</p>
                    <p className="text-[9px] text-slate-400">(Simulasi Upload Bukti Serah Terima)</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                Catatan Kurir (Opsional):
              </label>
              <input
                type="text"
                value={handoverNote}
                onChange={(e) => setHandoverNote(e.target.value)}
                placeholder="Contoh: Diterima oleh Kakak / Ditaruh di rak teras"
                className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setSelectedOrderForHandover(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs"
              >
                Batal
              </button>
              <button
                onClick={handleCompleteHandover}
                className="flex-1 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white rounded-xl font-black text-xs shadow-clay-sm"
              >
                Konfirmasi Selesai ✓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
