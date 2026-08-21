import React, { useState } from 'react';
import MobileEmulator from './components/MobileEmulator';
import WebDashboard from './components/WebDashboard';
import TopUpModal from './components/TopUpModal';
import { Smartphone, Monitor, Info, Sparkles, Check } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState('mobile');
  const [walletBalance, setWalletBalance] = useState(125000);
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [currentMobileScreen, setCurrentMobileScreen] = useState('home');
  const [currentOrderViewId, setCurrentOrderViewId] = useState('INV-240515-001');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [justCreatedOrderId, setJustCreatedOrderId] = useState('');
  
  // WhatsApp Notification Toast State
  const [whatsappToast, setWhatsappToast] = useState(null);

  // Initial active orders list matching the real-world states
  const [activeOrders, setActiveOrders] = useState([
    {
      id: 'INV-240515-001',
      serviceName: 'Cuci & Setrika',
      type: 'kg',
      amount: 5,
      unit: 'Kg',
      status: 'washing',
      orderTime: '15 Mei 2024, 10:30',
      statusTime: '15 Mei 2024, 11:00',
      eta: '16 Mei 2024, 15:00',
      notes: 'Tidak ada',
      totalPrice: 53000,
      paymentStatus: 'Paid',
      paymentMethod: 'Wallet'
    }
  ]);

  // Initial order history list
  const [orderHistory, setOrderHistory] = useState([
    { id: 'INV-240512-003', serviceName: 'Cuci Kering', amount: 3, unit: 'Kg', status: 'Selesai', price: 'Rp 75.000', date: '12 Mei 2024' },
    { id: 'INV-240509-002', serviceName: 'Cuci & Setrika', amount: 7, unit: 'Kg', status: 'Selesai', price: 'Rp 98.000', date: '09 Mei 2024' },
    { id: 'INV-240506-001', serviceName: 'Cuci & Setrika', amount: 4, unit: 'Kg', status: 'Diambil', price: 'Rp 60.000', date: '06 Mei 2024' }
  ]);

  const triggerWhatsappToast = (message) => {
    setWhatsappToast(message);
    setTimeout(() => {
      setWhatsappToast(null);
    }, 4500);
  };

  const handleTopUp = (amount) => {
    setWalletBalance(prev => prev + amount);
  };

  // Step 1: Customer submits pickup request
  const handleAddOrder = (newOrder) => {
    setActiveOrders(prev => [newOrder, ...prev]);
    setCurrentOrderViewId(newOrder.id);
    setJustCreatedOrderId(newOrder.id);
    setShowOrderSuccess(true);

    // Simulate Courier assignment notification
    setTimeout(() => {
      triggerWhatsappToast(`Kurir ditugaskan untuk mengambil pakaian Anda untuk pesanan ${newOrder.id}. Estimasi tiba 15 menit.`);
    }, 2000);
  };

  // Step 2: Cashier inputs weights and publishes invoice
  const handleInputWeight = (orderId, weight, extraBedcover, extraSepatu) => {
    const today = new Date();
    const formattedStatusTime = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(today);
    const formattedEta = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(today.getTime() + 24 * 60 * 60 * 1000)) + ', 15:00';

    setActiveOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        // Recalculate price: base + extras + delivery - 20% first order promo discount
        let baseRate = 12000;
        if (order.serviceName.includes('Kering')) baseRate = 18000;
        if (order.serviceName.includes('Setrika Saja')) baseRate = 6000;

        const baseCost = baseRate * weight;
        const bedcoverCost = extraBedcover * 25000;
        const shoeCost = extraSepatu * 20000;
        const subtotal = baseCost + bedcoverCost + shoeCost;
        const deliveryFee = 5000;
        const discount = 0.2 * subtotal; // 20% discount
        const total = subtotal + deliveryFee - discount;

        // Trigger WhatsApp Notification
        triggerWhatsappToast(`Nota Baru Diterbitkan! Cucian ${orderId} telah ditimbang: ${weight} Kg. Total Tagihan: Rp ${total.toLocaleString('id-ID')}. Silakan bayar.`);

        return {
          ...order,
          amount: weight,
          status: 'received', // Transition from pending_pickup to received & weighed
          statusTime: formattedStatusTime,
          totalPrice: total,
          eta: formattedEta,
          notes: `${order.notes}${extraBedcover ? ` (+Bedcover ${extraBedcover}pc)` : ''}${extraSepatu ? ` (+Sepatu ${extraSepatu}ps)` : ''}`
        };
      }
      return order;
    }));
  };

  // Step 3: Customer pays via Mobile
  const handlePayOrder = (orderId, method) => {
    let orderToPay = activeOrders.find(o => o.id === orderId);
    if (!orderToPay) return;

    if (method === 'Wallet') {
      if (walletBalance < orderToPay.totalPrice) return;
      setWalletBalance(prev => prev - orderToPay.totalPrice);
      
      setActiveOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return { ...o, paymentStatus: 'Paid', paymentMethod: 'Wallet' };
        }
        return o;
      }));
      triggerWhatsappToast(`Pembayaran Rp ${orderToPay.totalPrice.toLocaleString('id-ID')} berhasil didebit dari Wallet Anda.`);
    } else {
      // Cash/COD Selected
      setActiveOrders(prev => prev.map(o => {
        if (o.id === orderId) {
          return { ...o, paymentStatus: 'Unpaid', paymentMethod: 'Cash' };
        }
        return o;
      }));
      triggerWhatsappToast(`Metode Tunai dipilih. Tagihan Rp ${orderToPay.totalPrice.toLocaleString('id-ID')} akan dibayarkan saat cucian diantar.`);
    }
  };

  // Step 4: Admin updates order production stage
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updatedStatusTime = new Intl.DateTimeFormat('id-ID', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }).format(new Date());

    setActiveOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        if (newStatus === 'ready') {
          triggerWhatsappToast(`Cucian ${orderId} siap! Kurir sedang mempersiapkan pengantaran ke rumah Anda.`);
        }
        return {
          ...order,
          status: newStatus,
          statusTime: updatedStatusTime
        };
      }
      return order;
    }));
  };

  // Step 5: Admin completes and delivers order (Handovers to customer)
  const handleCompleteOrder = (orderId) => {
    const orderToClose = activeOrders.find(o => o.id === orderId);
    if (!orderToClose) return;

    // Move to history
    const completedHistory = {
      id: orderToClose.id,
      serviceName: orderToClose.serviceName,
      amount: orderToClose.amount,
      unit: orderToClose.unit,
      status: orderToClose.paymentMethod === 'Cash' ? 'Selesai (COD)' : 'Selesai',
      price: `Rp ${orderToClose.totalPrice.toLocaleString('id-ID')}`,
      date: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date())
    };

    setOrderHistory(prev => [completedHistory, ...prev]);
    setActiveOrders(prev => prev.filter(o => o.id !== orderId));
    triggerWhatsappToast(`Cucian ${orderId} telah selesai diserahkan ke pelanggan.`);

    // If currently viewing the closed order in the tracker, send back to home
    if (currentOrderViewId === orderId) {
      setCurrentMobileScreen('home');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none">
      {/* Top Navigation Preview Bar */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-soft z-50 flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-float">🧼</span>
          <div>
            <h1 className="text-base font-extrabold text-slate-800 tracking-tight">Smartlink Laundry Sandbox</h1>
            <p className="text-[10px] text-slate-450 font-bold uppercase tracking-wider">Simulasi Alur Timbangan Kasir & Pembayaran Terintegrasi</p>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2.5xl border border-slate-200">
          <button
            onClick={() => setActiveView('mobile')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 ${
              activeView === 'mobile'
                ? 'bg-primary text-white shadow-clay-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>📱 Mobile App (Pelanggan)</span>
          </button>
          <button
            onClick={() => setActiveView('web')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-extrabold transition-all duration-300 ${
              activeView === 'web'
                ? 'bg-primary text-white shadow-clay-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            <Monitor className="w-4 h-4" />
            <span>💻 Web Dashboard (Kasir/Admin)</span>
          </button>
        </div>

        {/* Global Wallet Display Badge */}
        <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 px-4 py-2 rounded-2xl">
          <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse"></span>
          <span className="text-xs font-black text-slate-700">
            Laundry Wallet: <span className="text-primary font-black">Rp {walletBalance.toLocaleString('id-ID')}</span>
          </span>
        </div>
      </header>

      {/* Main Workspace Frame */}
      <div className="flex-1 overflow-hidden relative">
        {activeView === 'mobile' ? (
          <div className="w-full h-full flex items-center justify-center p-8 bg-gradient-to-tr from-slate-100 to-sky-50 overflow-y-auto">
            {/* Quick Sandbox Help Guide */}
            <div className="hidden lg:block absolute left-8 top-12 max-w-xs space-y-4">
              <div className="bg-white p-5 border border-slate-200/60 rounded-3xl shadow-soft space-y-3.5">
                <div className="flex items-center gap-2.5 text-primary">
                  <Sparkles className="w-5 h-5" />
                  <h3 className="text-xs font-extrabold uppercase tracking-wide">Panduan Alur Smartlink</h3>
                </div>
                <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                  Ikuti langkah berikut untuk menguji alur kerja laundry kasir modern:
                </p>
                <div className="space-y-3 text-[11px] text-slate-650 font-semibold leading-relaxed">
                  <div className="flex items-start gap-2">
                    <span className="bg-sky-100 text-primary w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">1</span>
                    <span>Buat Pesanan di Hp (tahap penjemputan awal, tanpa masukkan berat).</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-sky-100 text-primary w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">2</span>
                    <span>Pindah ke <strong>Web Dashboard</strong> dan cari antrean penjemputan.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-sky-100 text-primary w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">3</span>
                    <span>Klik <strong>Timbang & Buat Nota</strong> untuk menginput berat riil & satuan.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="bg-sky-100 text-primary w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold">4</span>
                    <span>Kembali ke Hp, periksa notifikasi WhatsApp dan bayar via Wallet / COD.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Emulator */}
            <MobileEmulator
              walletBalance={walletBalance}
              activeOrders={activeOrders}
              orderHistory={orderHistory}
              currentScreen={currentMobileScreen}
              currentOrderViewId={currentOrderViewId}
              onNavigate={setCurrentMobileScreen}
              onTopUpClick={() => setIsTopUpOpen(true)}
              setSelectedOrderId={setCurrentOrderViewId}
              onAddOrder={handleAddOrder}
              onPayOrder={handlePayOrder}
              whatsappToast={whatsappToast}
            />
          </div>
        ) : (
          <WebDashboard
            activeOrders={activeOrders}
            orderHistory={orderHistory}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            walletBalance={walletBalance}
            onInputWeight={handleInputWeight}
            onCompleteOrder={handleCompleteOrder}
          />
        )}
      </div>

      {/* Global Wallet Top Up Modal */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onTopUp={handleTopUp}
      />

      {/* Order Created Success Dialog */}
      {showOrderSuccess && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white clay-card w-full max-w-sm p-6 text-center rounded-3xl shadow-soft-lg animate-scale-up space-y-4">
            <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-800">Kurir Segera Meluncur!</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Permintaan jemput pesanan <strong className="text-slate-800">{justCreatedOrderId}</strong> berhasil dikirim. Berat pakaian akan ditimbang oleh kurir/kasir saat tiba di outlet.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowOrderSuccess(false);
                  setCurrentMobileScreen('order_detail');
                }}
                className="w-full py-3.5 text-white font-extrabold text-xs rounded-2xl shadow-clay-sm clay-button text-center block"
              >
                Lacak Penjemputan
              </button>
              <button
                onClick={() => setShowOrderSuccess(false)}
                className="w-full mt-2 py-2 text-slate-500 hover:text-slate-700 font-bold text-xs hover:bg-slate-50 rounded-xl transition-all"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
