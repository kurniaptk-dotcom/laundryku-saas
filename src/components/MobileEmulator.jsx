import React from 'react';
import { Home as HomeIcon, ClipboardList, Plus, Percent, User, Wifi, BatteryMedium, MessageSquare } from 'lucide-react';
import Home from './screens/Home';
import CreateOrder from './screens/CreateOrder';
import OrderDetail from './screens/OrderDetail';

export default function MobileEmulator({
  walletBalance,
  activeOrders,
  orderHistory,
  currentScreen,
  currentOrderViewId,
  onNavigate,
  onTopUpClick,
  setSelectedOrderId,
  onAddOrder,
  onPayOrder,
  whatsappToast
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
            <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-800">Daftar Pesanan</h2>
            </div>
            <div className="p-5 space-y-4">
              {activeOrders.length === 0 && orderHistory.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-5xl">🧺</span>
                  <p className="text-slate-500 font-semibold mt-3 text-sm">Belum ada pesanan</p>
                </div>
              ) : (
                <>
                  {activeOrders.map(o => (
                    <div 
                      key={o.id}
                      onClick={() => { setSelectedOrderId(o.id); onNavigate('order_detail'); }}
                      className="p-4 bg-white border border-slate-100 rounded-2.5xl shadow-soft cursor-pointer hover:border-primary transition-colors flex justify-between items-center"
                    >
                      <div>
                        <h4 className="text-xs font-black text-slate-800">{o.id}</h4>
                        <p className="text-[10px] font-semibold text-slate-405 mt-1">
                          {o.serviceName} {o.amount > 0 ? `· ${o.amount} ${o.unit}` : '(Menunggu timbangan)'}
                        </p>
                      </div>
                      <span className={`px-2.5 py-1 text-[9px] font-extrabold rounded-full ${
                        o.status === 'pending_pickup' ? 'bg-amber-50 text-amber-600' : 'bg-sky-50 text-primary'
                      }`}>
                        {o.status === 'pending_pickup' ? 'Jemput' : o.status === 'washing' ? 'Dicuci' : o.status === 'drying' ? 'Kering' : o.status === 'ironing' ? 'Setrika' : o.status === 'ready' ? 'Siap Antar' : 'Diterima'}
                      </span>
                    </div>
                  ))}
                  {orderHistory.map(o => (
                    <div 
                      key={o.id}
                      className="p-4 bg-white border border-slate-100 rounded-2.5xl shadow-soft flex justify-between items-center opacity-85"
                    >
                      <div>
                        <h4 className="text-xs font-black text-slate-700">{o.id}</h4>
                        <p className="text-[10px] font-semibold text-slate-450 mt-1">{o.serviceName} · {o.amount} {o.unit}</p>
                      </div>
                      <span className={`px-2.5 py-1 text-[9px] font-extrabold rounded-full ${o.status.includes('Selesai') ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                        {o.status}
                      </span>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        );
      case 'promos':
        return (
          <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar pb-24">
            <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-800">Promo Menarik</h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="bg-gradient-to-r from-sky-500 to-indigo-500 p-5 rounded-3xl text-white shadow-soft relative overflow-hidden">
                <span className="px-2.5 py-1 bg-white/20 text-[9px] font-bold rounded-lg uppercase tracking-wider">Terbatas</span>
                <h3 className="text-base font-black mt-2">Diskon Kilat 30% Weekend</h3>
                <p className="text-xs text-sky-100 mt-1 font-medium">Khusus pemesanan hari Sabtu & Minggu</p>
                <div className="mt-4 flex justify-between items-center">
                  <span className="font-mono text-sm font-bold bg-white/10 px-3 py-1.5 rounded-lg border border-white/20">WNDCLEAN30</span>
                  <button className="px-4 py-1.5 bg-white text-primary font-extrabold text-xs rounded-xl hover:bg-sky-50 transition-all">Salin</button>
                </div>
              </div>
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar pb-24">
            <div className="px-5 pt-6 pb-4 bg-white border-b border-slate-100">
              <h2 className="text-base font-extrabold text-slate-800">Akun Saya</h2>
            </div>
            <div className="p-5 space-y-6">
              <div className="flex items-center gap-4 bg-white p-4 border border-slate-100 rounded-3xl shadow-soft">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-primary to-indigo-500 text-white flex items-center justify-center text-2xl font-black shadow-clay-sm">
                  AS
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-800">Aisyah Salsabila</h3>
                  <p className="text-xs text-slate-450 font-semibold mt-0.5">aisyah@laundrymail.com</p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center relative">
      {/* Device Frame */}
      <div className="relative w-[365px] h-[780px] bg-slate-900 rounded-[50px] p-3 shadow-phone border-[5px] border-slate-800 ring-[8px] ring-slate-950 flex flex-col overflow-hidden">
        
        {/* Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-800 rounded-full mb-1"></div>
          <div className="w-2.5 h-2.5 bg-indigo-950/80 rounded-full ml-2 mb-1 border border-slate-900"></div>
        </div>

        {/* WhatsApp Notification Toast (Floating overlay inside the phone frame) */}
        {whatsappToast && (
          <div className="absolute top-11 left-6 right-6 bg-white/95 backdrop-blur-md border border-slate-100 rounded-2.5xl p-3.5 shadow-soft-lg flex gap-3 items-start z-55 animate-slide-down transform duration-300">
            <div className="w-9 h-9 bg-emerald-500 rounded-xl flex items-center justify-center text-white text-base shadow-clay-sm flex-shrink-0">
              💬
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-800 tracking-wide uppercase">WhatsApp • Smartlink</span>
                <span className="text-[8px] text-slate-450 font-bold">Baru</span>
              </div>
              <p className="text-[10px] text-slate-650 font-semibold leading-normal mt-0.5 break-words">
                {whatsappToast}
              </p>
            </div>
          </div>
        )}

        {/* Status Bar */}
        <div className="h-9 bg-white px-6 pt-3 flex justify-between items-center text-[10px] font-extrabold text-slate-800 select-none z-45 flex-shrink-0">
          <span>9:41</span>
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 stroke-[3]" />
            <span className="text-[9px]">4G</span>
            <BatteryMedium className="w-4 h-4 stroke-[2]" />
          </div>
        </div>

        {/* Inner Screen Container */}
        <div className="flex-1 bg-slate-50 rounded-[38px] overflow-hidden flex flex-col relative">
          <div className="flex-1 h-full overflow-hidden">
            {renderScreen()}
          </div>

          {/* Floating Bottom Navigation Bar */}
          {currentScreen !== 'create_order' && currentScreen !== 'order_detail' && (
            <div className="absolute bottom-0 left-0 right-0 h-20 bg-white/95 backdrop-blur-md border-t border-slate-100 flex items-center justify-around px-2 z-40">
              <button 
                onClick={() => onNavigate('home')}
                className={`flex flex-col items-center gap-1 flex-1 py-2 ${currentScreen === 'home' ? 'text-primary' : 'text-slate-400 hover:text-slate-650'}`}
              >
                <HomeIcon className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[9px] font-extrabold tracking-tight">Beranda</span>
              </button>

              <button 
                onClick={() => onNavigate('orders_list')}
                className={`flex flex-col items-center gap-1 flex-1 py-2 ${currentScreen === 'orders_list' ? 'text-primary' : 'text-slate-400 hover:text-slate-650'}`}
              >
                <ClipboardList className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[9px] font-extrabold tracking-tight">Pesanan</span>
              </button>

              {/* Floating Action Button */}
              <div className="relative -top-3 flex flex-col items-center z-50">
                <button 
                  onClick={() => onNavigate('create_order')}
                  className="w-13 h-13 rounded-full text-white shadow-clay-lg flex items-center justify-center transition-transform hover:scale-105 active:scale-95 clay-button"
                  style={{ width: '52px', height: '52px' }}
                >
                  <Plus className="w-7 h-7 stroke-[3]" />
                </button>
                <span className="text-[9px] font-black text-primary mt-1 select-none">Buat Pesanan</span>
              </div>

              <button 
                onClick={() => onNavigate('promos')}
                className={`flex flex-col items-center gap-1 flex-1 py-2 ${currentScreen === 'promos' ? 'text-primary' : 'text-slate-400 hover:text-slate-650'}`}
              >
                <Percent className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[9px] font-extrabold tracking-tight">Promo</span>
              </button>

              <button 
                onClick={() => onNavigate('profile')}
                className={`flex flex-col items-center gap-1 flex-1 py-2 ${currentScreen === 'profile' ? 'text-primary' : 'text-slate-400 hover:text-slate-650'}`}
              >
                <User className="w-5 h-5 stroke-[2.2]" />
                <span className="text-[9px] font-extrabold tracking-tight">Akun</span>
              </button>
            </div>
          )}

          {/* iOS Bottom Home Bar */}
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-900 rounded-full z-45"></div>
        </div>
      </div>
    </div>
  );
}
