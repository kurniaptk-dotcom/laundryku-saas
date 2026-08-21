import React, { useState } from 'react';
import { 
  Home as HomeIcon, ClipboardList, Plus, Percent, User, 
  MessageSquare, ArrowLeft, LogOut, Sparkles, ShieldCheck, 
  CheckCircle2, Bell, Tag, ChevronRight, Phone
} from 'lucide-react';
import Home from './screens/Home';
import CreateOrder from './screens/CreateOrder';
import OrderDetail from './screens/OrderDetail';

export default function MobileEmulator({
  walletBalance = 125000,
  activeOrders = [],
  orderHistory = [],
  currentScreen = 'home',
  currentOrderViewId = 'INV-240515-001',
  onNavigate,
  onTopUpClick,
  setSelectedOrderId,
  onAddOrder,
  onPayOrder,
  whatsappToast,
  currentCustomer = { name: 'Aisyah Salsabila', phone: '0812-3456-7890', email: 'aisyah@gmail.com', points: 1250 },
  onLogout
}) {
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <Home
            walletBalance={walletBalance}
            activeOrders={activeOrders}
            orderHistory={orderHistory}
            onNavigate={onNavigate}
            onTopUpClick={onTopUpClick}
            setSelectedOrderId={setSelectedOrderId}
          />
        );
      case 'create_order':
        return (
          <CreateOrder
            walletBalance={walletBalance}
            onAddOrder={onAddOrder}
            onNavigate={onNavigate}
            onTopUpClick={onTopUpClick}
          />
        );
      case 'order_detail':
        return (
          <OrderDetail
            orderId={currentOrderViewId}
            activeOrders={activeOrders}
            orderHistory={orderHistory}
            onNavigate={onNavigate}
            onPayOrder={onPayOrder}
            walletBalance={walletBalance}
          />
        );
      case 'orders_list':
        return (
          <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar pb-24">
            <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100 flex items-center justify-between sticky top-0 z-30">
              <h2 className="text-base font-black text-slate-850">Daftar Pesanan</h2>
              <span className="text-[10px] font-black px-2.5 py-1 bg-sky-50 text-primary rounded-full border border-sky-100">
                {activeOrders.length} Aktif
              </span>
            </div>
            <div className="p-4 space-y-3">
              {activeOrders.length === 0 && orderHistory.length === 0 ? (
                <div className="text-center py-16 space-y-3">
                  <span className="text-5xl">🧺</span>
                  <p className="text-slate-500 font-bold text-sm">Belum ada pesanan aktif</p>
                  <button
                    onClick={() => onNavigate('create_order')}
                    className="px-5 py-2.5 bg-primary text-white font-extrabold text-xs rounded-xl shadow-clay-sm cursor-pointer"
                  >
                    Buat Pesanan Baru
                  </button>
                </div>
              ) : (
                <>
                  {activeOrders.map(o => (
                    <div 
                      key={o.id}
                      onClick={() => { setSelectedOrderId(o.id); onNavigate('order_detail'); }}
                      className="p-4 bg-white border border-slate-100 rounded-2xl shadow-soft cursor-pointer hover:border-primary transition-all flex justify-between items-center group"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-slate-800">{o.id}</h4>
                          <span className="text-[9px] font-bold px-2 py-0.5 bg-amber-50 text-amber-600 rounded-full border border-amber-200">
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

                  {orderHistory.length > 0 && (
                    <div className="pt-3">
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider mb-2 px-1">Riwayat Selesai</p>
                      {orderHistory.map(o => (
                        <div 
                          key={o.id}
                          className="p-3.5 bg-white border border-slate-100 rounded-2xl shadow-soft flex justify-between items-center opacity-80 mb-2"
                        >
                          <div>
                            <h4 className="text-xs font-bold text-slate-700">{o.id}</h4>
                            <p className="text-[10px] font-semibold text-slate-400 mt-0.5">{o.serviceName} · {o.amount} {o.unit}</p>
                          </div>
                          <span className="px-2.5 py-1 text-[9px] font-extrabold rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {o.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        );
      case 'promos':
        return (
          <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar pb-24">
            <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-30">
              <h2 className="text-base font-black text-slate-850">Promo & Voucher</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-5 rounded-3xl text-white shadow-soft relative overflow-hidden">
                <span className="px-2.5 py-1 bg-white/20 text-[9px] font-bold rounded-lg uppercase tracking-wider">Spesial Hari Ini</span>
                <h3 className="text-base font-black mt-2">Diskon Kilat 30% Cuci Sepatu</h3>
                <p className="text-xs text-sky-100 mt-1 font-medium">Gunakan kode voucher saat penjemputan cucian</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-mono text-xs font-black bg-white/15 px-3 py-1.5 rounded-xl border border-white/20">CLEAN30</span>
                  <button 
                    onClick={() => alert('Voucher CLEAN30 berhasil disalin!')}
                    className="px-4 py-1.5 bg-white text-primary font-black text-xs rounded-xl hover:bg-sky-50 transition-all cursor-pointer"
                  >
                    Salin
                  </button>
                </div>
              </div>

              <div className="bg-gradient-to-r from-teal-500 to-emerald-600 p-5 rounded-3xl text-white shadow-soft relative overflow-hidden">
                <span className="px-2.5 py-1 bg-white/20 text-[9px] font-bold rounded-lg uppercase tracking-wider">Member Baru</span>
                <h3 className="text-base font-black mt-2">Gratis Antar Jemput</h3>
                <p className="text-xs text-teal-100 mt-1 font-medium">Khusus pelanggan baru LaundryKu Pro</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-mono text-xs font-black bg-white/15 px-3 py-1.5 rounded-xl border border-white/20">FREEONGKIR</span>
                  <button 
                    onClick={() => alert('Voucher FREEONGKIR berhasil disalin!')}
                    className="px-4 py-1.5 bg-white text-teal-700 font-black text-xs rounded-xl hover:bg-teal-50 transition-all cursor-pointer"
                  >
                    Salin
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar pb-24">
            <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-30">
              <h2 className="text-base font-black text-slate-850">Akun Profil</h2>
            </div>
            <div className="p-5 space-y-5">
              <div className="flex items-center gap-4 bg-white p-4 border border-slate-100 rounded-3xl shadow-soft">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center text-xl font-black shadow-clay-sm">
                  {currentCustomer.name ? currentCustomer.name.slice(0, 2).toUpperCase() : 'AS'}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-black text-slate-800 truncate">{currentCustomer.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">{currentCustomer.phone}</p>
                  <span className="inline-block mt-1 px-2 py-0.5 bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-black rounded-md">
                    ⭐ Gold Member (1.250 Pts)
                  </span>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-4 border border-slate-100 shadow-soft space-y-3">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Informasi Akun</h4>
                <div className="text-xs space-y-2.5 text-slate-700 font-semibold">
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400">Nomor WhatsApp:</span>
                    <strong className="text-slate-900">{currentCustomer.phone}</strong>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400">Email:</span>
                    <strong className="text-slate-900">{currentCustomer.email || 'aisyah@gmail.com'}</strong>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-slate-400">Saldo Laundry Wallet:</span>
                    <strong className="text-primary font-black">Rp {walletBalance.toLocaleString('id-ID')}</strong>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              {onLogout && (
                <button
                  onClick={onLogout}
                  className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun Konsumen (Logout)</span>
                </button>
              )}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full min-h-screen py-0 sm:py-6 flex justify-center items-start bg-slate-100 dark:bg-slate-950 font-sans antialiased select-none">
      
      {/* Clean Standalone Mobile App Container (Identical to Smart Owner & Smart Kurir) */}
      <div className="w-full max-w-md min-h-screen sm:min-h-[780px] bg-slate-50 rounded-none sm:rounded-[36px] shadow-2xl border border-slate-200/80 overflow-hidden flex flex-col relative">
        
        {/* Simulated Floating WhatsApp Notification Toast */}
        {whatsappToast && (
          <div className="absolute top-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3.5 shadow-xl flex gap-2.5 items-start z-55 animate-slide-down">
            <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-base shadow-sm flex-shrink-0">
              💬
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-800 uppercase tracking-wide">WhatsApp • LaundryKu</span>
                <span className="text-[8px] text-slate-400 font-bold">Baru</span>
              </div>
              <p className="text-[10px] text-slate-600 font-semibold leading-tight mt-0.5 break-words">
                {whatsappToast}
              </p>
            </div>
          </div>
        )}

        {/* Screen Content View */}
        <div className="flex-1 h-full overflow-hidden flex flex-col">
          {renderScreen()}
        </div>

        {/* Bottom Navigation Bar */}
        {currentScreen !== 'create_order' && currentScreen !== 'order_detail' && (
          <div className="sticky bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-2 z-40">
            <button 
              onClick={() => onNavigate('home')}
              className={`flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer transition-colors ${currentScreen === 'home' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <HomeIcon className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[9px] font-extrabold tracking-tight">Beranda</span>
            </button>

            <button 
              onClick={() => onNavigate('orders_list')}
              className={`flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer transition-colors ${currentScreen === 'orders_list' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <ClipboardList className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[9px] font-extrabold tracking-tight">Pesanan</span>
            </button>

            {/* Center Floating Action Button (Buat Pesanan) */}
            <div className="relative -top-3 flex flex-col items-center z-50">
              <button 
                onClick={() => onNavigate('create_order')}
                className="w-13 h-13 rounded-full text-white shadow-clay-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 clay-button cursor-pointer"
                style={{ width: '52px', height: '52px' }}
              >
                <Plus className="w-7 h-7 stroke-[3]" />
              </button>
              <span className="text-[9px] font-black text-primary mt-1 select-none">Buat Pesanan</span>
            </div>

            <button 
              onClick={() => onNavigate('promos')}
              className={`flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer transition-colors ${currentScreen === 'promos' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <Percent className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[9px] font-extrabold tracking-tight">Promo</span>
            </button>

            <button 
              onClick={() => onNavigate('profile')}
              className={`flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer transition-colors ${currentScreen === 'profile' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
            >
              <User className="w-5 h-5 stroke-[2.2]" />
              <span className="text-[9px] font-extrabold tracking-tight">Akun</span>
            </button>
          </div>
        )}

      </div>

    </div>
  );
}
