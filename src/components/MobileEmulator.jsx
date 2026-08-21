import React, { useState } from 'react';
import { 
  Home as HomeIcon, ClipboardList, Plus, Percent, User, Wifi, 
  BatteryMedium, MessageSquare, ArrowLeft, LogOut, Sparkles, 
  ShieldCheck, Smartphone, CheckCircle2, ChevronRight, Bell
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
            <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-850">Daftar Pesanan</h2>
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
                    className="px-5 py-2.5 bg-primary text-white font-extrabold text-xs rounded-xl shadow-clay-sm"
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
            <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-850">Promo & Voucher</h2>
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
            <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-850">Akun Profil</h2>
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
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Informasi Kontak</h4>
                <div className="text-xs space-y-2 text-slate-700 font-semibold">
                  <div className="flex justify-between py-1.5 border-b border-slate-50">
                    <span className="text-slate-400">WhatsApp:</span>
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
                  className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-2xl font-black text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Keluar Akun (Logout)</span>
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
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100/60 via-slate-50 to-blue-50/50 flex items-center justify-center p-0 lg:p-6 select-none font-sans">
      
      {/* Container Grid: Left Information Panel on Desktop | Right Centered Phone */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12 py-4">
        
        {/* ================= DESKTOP LEFT MARKETING PANEL ================= */}
        <div className="hidden lg:flex flex-col justify-between max-w-md space-y-6 text-left">
          
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-sky-200 text-primary shadow-xs text-xs font-black">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              <span>Portal Konsumen & Tracking</span>
            </div>

            <h1 className="text-3xl xl:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Lacak Cucian & Cek Saldo <span className="bg-gradient-to-r from-sky-500 to-indigo-600 bg-clip-text text-transparent">Real-Time</span>
            </h1>

            <p className="text-xs font-medium text-slate-500 leading-relaxed">
              Pantau tahapan cuci pakaian Anda dari penjemputan, penimbangan, proses mesin, hingga diantar kembali oleh kurir dengan notifikasi WhatsApp otomatis.
            </p>
          </div>

          {/* User Profile Summary Card */}
          <div className="p-4 bg-white/80 backdrop-blur-xl border border-white rounded-3xl shadow-soft space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center text-lg font-black shadow-clay-sm">
                {currentCustomer.name ? currentCustomer.name.slice(0, 2).toUpperCase() : 'AS'}
              </div>
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-black uppercase text-slate-400">Akun Pelanggan Aktif:</span>
                <h3 className="text-sm font-black text-slate-900 truncate">{currentCustomer.name}</h3>
                <p className="text-xs text-slate-500 font-semibold">{currentCustomer.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-xs">
              <div className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100">
                <span className="text-[10px] text-slate-400 font-bold block">Saldo Wallet:</span>
                <strong className="text-primary font-black">Rp {walletBalance.toLocaleString('id-ID')}</strong>
              </div>
              <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100">
                <span className="text-[10px] text-slate-400 font-bold block">Poin Reward:</span>
                <strong className="text-amber-600 font-black">1.250 Pts</strong>
              </div>
            </div>
          </div>

          {/* Feature Bullets */}
          <div className="space-y-2 text-xs font-bold text-slate-700">
            {[
              '✓ Pemesanan jemput laundry tanpa timbang sendiri',
              '✓ Notifikasi nota & invoice transparan via WhatsApp',
              '✓ Pembayaran fleksibel via Laundry Wallet atau COD',
              '✓ Pelacakan posisi kurir & estimasi waktu pengerjaan'
            ].map((feat, i) => (
              <p key={i} className="flex items-center gap-2 text-slate-600 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                <span>{feat}</span>
              </p>
            ))}
          </div>

          {/* Logout Action */}
          {onLogout && (
            <div className="pt-2">
              <button
                onClick={onLogout}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-rose-50 text-slate-600 hover:text-rose-600 border border-slate-200 hover:border-rose-200 rounded-2xl font-bold text-xs shadow-xs transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Keluar Akun Konsumen</span>
              </button>
            </div>
          )}
        </div>

        {/* ================= RIGHT COLUMN: SLEEK PHONE SIMULATOR ================= */}
        <div className="flex flex-col items-center justify-center w-full lg:w-auto">
          
          {/* Smartphone Frame */}
          <div className="relative w-full sm:w-[375px] h-screen sm:h-[780px] bg-slate-900 rounded-none sm:rounded-[48px] p-0 sm:p-3 shadow-2xl border-0 sm:border-[5px] border-slate-800 ring-0 sm:ring-[6px] ring-slate-950/20 flex flex-col overflow-hidden">
            
            {/* Notch (Desktop Only) */}
            <div className="hidden sm:flex absolute top-3.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-950 rounded-b-2xl z-50 items-center justify-center">
              <div className="w-8 h-1 bg-slate-800 rounded-full mb-0.5"></div>
              <div className="w-2.5 h-2.5 bg-indigo-950/80 rounded-full ml-2 mb-0.5 border border-slate-900"></div>
            </div>

            {/* WhatsApp Notification Toast */}
            {whatsappToast && (
              <div className="absolute top-11 left-4 right-4 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-3 shadow-xl flex gap-2.5 items-start z-55 animate-slide-down">
                <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-base shadow-sm flex-shrink-0">
                  💬
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-black text-slate-800 uppercase">WhatsApp • LaundryKu</span>
                    <span className="text-[8px] text-slate-400 font-bold">Baru</span>
                  </div>
                  <p className="text-[10px] text-slate-600 font-semibold leading-tight mt-0.5 break-words">
                    {whatsappToast}
                  </p>
                </div>
              </div>
            )}

            {/* Top Mobile Status Bar */}
            <div className="h-9 bg-white px-6 pt-3 flex justify-between items-center text-[10px] font-black text-slate-800 select-none z-45 flex-shrink-0">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5 stroke-[3]" />
                <span className="text-[9px]">4G</span>
                <BatteryMedium className="w-4 h-4 stroke-[2]" />
              </div>
            </div>

            {/* Inner Screen Container */}
            <div className="flex-1 bg-slate-50 rounded-none sm:rounded-[36px] overflow-hidden flex flex-col relative">
              <div className="flex-1 h-full overflow-hidden">
                {renderScreen()}
              </div>

              {/* Floating Bottom Navigation Bar */}
              {currentScreen !== 'create_order' && currentScreen !== 'order_detail' && (
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-2 z-40">
                  <button 
                    onClick={() => onNavigate('home')}
                    className={`flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer ${currentScreen === 'home' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <HomeIcon className="w-5 h-5 stroke-[2.2]" />
                    <span className="text-[9px] font-extrabold tracking-tight">Beranda</span>
                  </button>

                  <button 
                    onClick={() => onNavigate('orders_list')}
                    className={`flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer ${currentScreen === 'orders_list' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <ClipboardList className="w-5 h-5 stroke-[2.2]" />
                    <span className="text-[9px] font-extrabold tracking-tight">Pesanan</span>
                  </button>

                  {/* Floating Action Button */}
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
                    className={`flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer ${currentScreen === 'promos' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <Percent className="w-5 h-5 stroke-[2.2]" />
                    <span className="text-[9px] font-extrabold tracking-tight">Promo</span>
                  </button>

                  <button 
                    onClick={() => onNavigate('profile')}
                    className={`flex flex-col items-center gap-1 flex-1 py-2 cursor-pointer ${currentScreen === 'profile' ? 'text-primary' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    <User className="w-5 h-5 stroke-[2.2]" />
                    <span className="text-[9px] font-extrabold tracking-tight">Akun</span>
                  </button>
                </div>
              )}

              {/* iOS Bottom Home Indicator Bar */}
              <div className="hidden sm:block absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900 rounded-full z-45"></div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
