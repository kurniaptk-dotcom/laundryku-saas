import React, { useState } from 'react';
import { 
  Home as HomeIcon, ClipboardList, Plus, Percent, User, 
  Sparkles, Check, Copy, ArrowRight, ShieldCheck, MapPin, 
  HelpCircle, ChevronRight, Phone, Clock, Calendar, Gift, 
  Bell, X, Star, Award, Tag, Truck, Users, RefreshCw, LogOut, Package, Monitor
} from 'lucide-react';
import Home from './screens/Home';
import CreateOrder from './screens/CreateOrder';
import OrderDetail from './screens/OrderDetail';
import AuthModal from './AuthModal';
import SubscriptionModal from './SubscriptionModal';
import { getTierProgression } from '../utils/tierHelper';

export default function MobileEmulator({
  isLoggedIn = true,
  onLogin,
  onLogout,
  onRegister,
  currentCustomer = { id: 'CUST-001', name: 'Aisyah Salsabila', phone: '0812-3456-7890', address: 'Jalan Cempaka Putih Raya No. 42A, Jakarta Pusat', tier: 'Member VIP Premium', email: 'aisyah@laundrymail.com' },
  customers = [],
  onChangeCustomer,
  walletBalance = 125000,
  loyaltyPoints = 1250,
  activeOrders = [],
  orderHistory = [],
  currentScreen,
  currentOrderViewId,
  onNavigate,
  onTopUpClick,
  setSelectedOrderId,
  onAddOrder,
  onPurchaseSubscription,
  services = [],
  promos = [],
  couriers = [],
  notifications = [],
  onRedeemReward,
  onSubmitReview,
  onSwitchToAdmin,
  branding = {}
}) {
  const [copiedPromo, setCopiedPromo] = useState('');
  const [orderFilter, setOrderFilter] = useState('all'); // all, active, completed
  const [showRewardsModal, setShowRewardsModal] = useState(false);
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [showSwitchUserModal, setShowSwitchUserModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const handleCopyCode = (code) => {
    navigator.clipboard?.writeText(code);
    setCopiedPromo(code);
    setTimeout(() => setCopiedPromo(''), 2500);
  };

  const loyaltyRewardList = [
    { id: 'rw_1', title: 'Voucher Diskon Cuci 20%', desc: 'Potongan 20% untuk semua layanan', cost: 300, code: 'POIN20OFF', type: 'coupon', discountPct: 20, icon: '🎟️' },
    { id: 'rw_2', title: 'Gratis Ongkir Antar Jemput', desc: 'Bebas ongkir kurir tanpa syarat', cost: 400, code: 'POINBEBASONGKIR', type: 'coupon', discountPct: 100, icon: '🚚' },
    { id: 'rw_3', title: 'Voucher Cuci Hemat 35%', desc: 'Potongan 35% khusus Cuci & Setrika', cost: 600, code: 'POIN35HEMAT', type: 'coupon', discountPct: 35, icon: '⚡' },
    { id: 'rw_4', title: 'Botol Parfum Laundry 250ml', desc: 'Parfum konsentrat lavender wangi mewah', cost: 1000, type: 'gift', icon: '🧴' },
  ];

  const unreadNotifCount = notifications.filter(n => !n.read).length;

  // STRICT MULTI-USER FILTERING: ONLY SHOW ORDERS BELONGING TO currentCustomer
  const userActiveOrders = activeOrders.filter(o => 
    (o.customerId && o.customerId === currentCustomer.id) ||
    (!o.customerId && o.customerName === currentCustomer.name)
  );

  const userOrderHistory = orderHistory.filter(o => 
    (o.customerId && o.customerId === currentCustomer.id) ||
    (!o.customerId && o.customerName === currentCustomer.name)
  );

  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <Home
            currentCustomer={currentCustomer}
            customers={customers}
            onChangeCustomer={onChangeCustomer}
            walletBalance={walletBalance}
            loyaltyPoints={loyaltyPoints}
            activeOrders={userActiveOrders}
            orderHistory={userOrderHistory}
            onNavigate={onNavigate}
            onTopUpClick={onTopUpClick}
            onOpenSubscription={() => setShowSubscriptionModal(true)}
            setSelectedOrderId={setSelectedOrderId}
            services={services}
            couriers={couriers}
            onOpenRewards={() => setShowRewardsModal(true)}
            onOpenNotifs={() => setShowNotifModal(true)}
            unreadNotifCount={unreadNotifCount}
            onSwitchToAdmin={onSwitchToAdmin}
            branding={branding}
          />
        );
      case 'create_order':
        return (
          <CreateOrder
            currentCustomer={currentCustomer}
            walletBalance={walletBalance}
            onAddOrder={onAddOrder}
            onNavigate={onNavigate}
            onTopUpClick={onTopUpClick}
            services={services}
          />
        );
      case 'order_detail':
        return (
          <OrderDetail
            orderId={currentOrderViewId}
            activeOrders={activeOrders}
            orderHistory={orderHistory}
            onNavigate={onNavigate}
            onSubmitReview={onSubmitReview}
          />
        );
      case 'orders_list': {
        const ongoingOrders = userActiveOrders.filter(o => o.status !== 'Selesai' && o.status !== 'Diambil' && o.status !== 'selesai');
        const completedOrders = [
          ...userActiveOrders.filter(o => o.status === 'Selesai' || o.status === 'Diambil' || o.status === 'selesai'),
          ...userOrderHistory
        ];

        const filteredActive = orderFilter === 'completed' ? [] : ongoingOrders;
        const filteredHistory = orderFilter === 'active' ? [] : completedOrders;
        const totalCount = filteredActive.length + filteredHistory.length;

        const getStatusTag = (status) => {
          switch (status) {
            case 'received': return { label: '📥 Diterima', cls: 'bg-slate-100 text-slate-700 border-slate-200' };
            case 'washing': return { label: '🧼 Sedang Dicuci', cls: 'bg-sky-50 text-sky-700 border-sky-200' };
            case 'drying': return { label: '💨 Pengeringan', cls: 'bg-amber-50 text-amber-700 border-amber-200' };
            case 'ironing': return { label: '🔌 Setrika & Packing', cls: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
            case 'ready': return { label: '🚚 Siap Diantar', cls: 'bg-teal-50 text-teal-700 border-teal-200' };
            case 'Selesai':
            case 'Diambil':
            case 'selesai': return { label: '✅ Selesai', cls: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-black' };
            default: return { label: status, cls: 'bg-sky-50 text-primary border-sky-100' };
          }
        };

        return (
          <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar pb-28">
            {/* Header */}
            <div className="px-6 pt-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-20 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-slate-850 tracking-tight">Daftar Pesanan ({currentCustomer.name.split(' ')[0]})</h2>
                  <p className="text-xs font-semibold text-slate-400 mt-0.5">Kelola dan pantau transaksi laundry akun Anda</p>
                </div>
                <button
                  onClick={() => onNavigate('create_order')}
                  className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-clay-sm transition-all"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>Order Baru</span>
                </button>
              </div>

              {/* Filter Tabs */}
              <div className="flex gap-2 mt-4">
                {[
                  { id: 'all', label: `Semua (${ongoingOrders.length + completedOrders.length})` },
                  { id: 'active', label: `Aktif (${ongoingOrders.length})` },
                  { id: 'completed', label: `Selesai (${completedOrders.length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setOrderFilter(tab.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      orderFilter === tab.id
                        ? 'bg-primary text-white shadow-clay-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            <div className="p-5 md:p-6 space-y-4 max-w-4xl mx-auto w-full">
              {totalCount === 0 ? (
                <div className="text-center py-16 bg-white rounded-3xl border border-slate-100 shadow-soft">
                  <span className="text-5xl">🧺</span>
                  <h3 className="text-base font-extrabold text-slate-800 mt-4">Belum Ada Pesanan untuk {currentCustomer.name}</h3>
                  <p className="text-slate-400 font-semibold text-xs mt-1 max-w-xs mx-auto">
                    Mulai pesan layanan cuci, setrika, atau sepatu sekarang juga dengan mudah.
                  </p>
                  <button
                    onClick={() => onNavigate('create_order')}
                    className="mt-5 px-6 py-2.5 bg-primary text-white font-extrabold text-xs rounded-xl shadow-clay-sm hover:opacity-95"
                  >
                    Pesan Laundry Sekarang
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Active Ongoing Orders */}
                  {filteredActive.map(o => {
                    const tag = getStatusTag(o.status);
                    return (
                      <div 
                        key={o.id}
                        onClick={() => { setSelectedOrderId(o.id); onNavigate('order_detail'); }}
                        className="p-5 bg-white border-2 border-sky-100 hover:border-primary rounded-3xl shadow-soft cursor-pointer transition-all duration-200 hover:shadow-soft-lg group relative overflow-hidden space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></span>
                              <h4 className="text-sm font-black text-slate-850">{o.id}</h4>
                            </div>
                            <p className="text-xs font-semibold text-slate-500 mt-1">{o.serviceName} · {o.amount} {o.unit}</p>
                          </div>
                          <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wide border ${tag.cls}`}>
                            {tag.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                          <Truck className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                          <span className="truncate">Kurir: {o.courierName || 'Doni Pratama (Honda Vario)'}</span>
                        </div>

                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                          <span className="text-slate-400 font-medium">Estimasi: <strong className="text-slate-700">{o.eta}</strong></span>
                          <span className="text-primary font-black group-hover:translate-x-1 transition-transform flex items-center gap-1">
                            Lacak <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Completed History Orders */}
                  {filteredHistory.map(o => (
                    <div 
                      key={o.id}
                      onClick={() => { setSelectedOrderId(o.id); onNavigate('order_detail'); }}
                      className="p-5 bg-white border border-slate-150/70 rounded-3xl shadow-soft flex justify-between items-center transition-all hover:border-primary/50 cursor-pointer"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-base">🧺</span>
                          <h4 className="text-sm font-bold text-slate-800">{o.id}</h4>
                        </div>
                        <p className="text-xs font-semibold text-slate-400 mt-1">{o.serviceName} · {o.amount} {o.unit} · {o.date || o.orderTime || 'Mei 2024'}</p>
                      </div>
                      <div className="text-right space-y-1">
                        <span className={`inline-block px-3 py-1 text-[10px] font-black rounded-full ${
                          o.status === 'Selesai' || o.status === 'selesai' || o.status === 'Diambil' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-amber-50 text-amber-600 border border-amber-100'
                        }`}>
                          {o.status || 'Selesai'}
                        </span>
                        <p className="text-xs font-black text-slate-750">{o.price || `Rp ${o.totalPrice?.toLocaleString('id-ID')}`}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      }
      case 'promos':
        return (
          <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar pb-28">
            <div className="px-6 pt-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-20 shadow-xs flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-slate-850 tracking-tight">Promo & Voucher</h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Gunakan kode voucher untuk mendapatkan diskon hemat</p>
              </div>
              <button
                onClick={() => setShowRewardsModal(true)}
                className="px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-clay-sm flex items-center gap-1.5"
              >
                <Gift className="w-3.5 h-3.5" />
                <span>Tukar Poin</span>
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-4 max-w-4xl mx-auto w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {promos.map((p) => (
                  <div key={p.id} className={`bg-gradient-to-br ${p.color || 'from-sky-500 to-indigo-600'} p-6 rounded-3xl text-white shadow-soft relative overflow-hidden flex flex-col justify-between`}>
                    <div className="absolute right-0 bottom-0 w-36 h-36 bg-white/10 rounded-full blur-2xl"></div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-white/20 text-[10px] font-black rounded-lg uppercase tracking-wider">{p.tag || 'Spesial'}</span>
                        <span className="text-xs">⚡</span>
                      </div>
                      <h3 className="text-lg font-black mt-3">{p.title}</h3>
                      <p className="text-xs text-sky-100 mt-1 font-medium leading-relaxed">{p.desc}</p>
                    </div>
                    
                    <div className="mt-6 pt-4 border-t border-white/15 flex justify-between items-center">
                      <span className="font-mono text-sm font-black bg-black/20 px-3.5 py-1.5 rounded-xl border border-white/20 tracking-wider">
                        {p.code}
                      </span>
                      <button 
                        onClick={() => handleCopyCode(p.code)}
                        className="px-4 py-2 bg-white text-primary font-extrabold text-xs rounded-xl hover:bg-sky-50 transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        {copiedPromo === p.code ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPromo === p.code ? 'Tersalin!' : 'Salin Kode'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'profile': {
        const tierInfo = getTierProgression(currentCustomer?.totalSpent || 0);
        return (
          <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar pb-28">
            <div className="px-6 pt-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-20 shadow-xs flex justify-between items-center">
              <div>
                <h2 className="text-xl font-extrabold text-slate-850 tracking-tight">Akun Pengguna</h2>
                <p className="text-xs font-semibold text-slate-400 mt-0.5">Informasi profil, saldo, dan pengaturan akun</p>
              </div>
              <button
                onClick={() => setShowSwitchUserModal(true)}
                className="px-3.5 py-2 bg-sky-50 hover:bg-sky-100 text-primary border border-sky-200 rounded-xl font-black text-xs flex items-center gap-1.5 shadow-xs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Ganti Akun</span>
              </button>
            </div>

            <div className="p-5 md:p-6 space-y-6 max-w-4xl mx-auto w-full">
              {/* User Bio Card */}
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 bg-white p-6 border border-slate-100 rounded-3xl shadow-soft">
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center text-3xl font-black shadow-clay-sm flex-shrink-0">
                  {currentCustomer.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="text-center sm:text-left flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-black text-slate-850">{currentCustomer.name}</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">{currentCustomer.email || 'customer@laundrymail.com'} · {currentCustomer.phone}</p>
                    </div>
                    <span className="self-center sm:self-auto px-3.5 py-1 bg-slate-900 text-xs font-black text-amber-300 rounded-full border border-slate-700 shadow-xs">
                      {tierInfo.currentTier.badge}
                    </span>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-600 font-medium">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{currentCustomer.address || 'Jakarta'}</span>
                  </div>
                </div>
              </div>

              {/* Exclusive Membership Level & Perks Card */}
              <div className={`${tierInfo.currentTier.cardBg} p-6 rounded-3xl text-white shadow-soft-lg space-y-4 border ${tierInfo.currentTier.borderColor} relative overflow-hidden`}>
                <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
                
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/70">Loyalty Program</span>
                    <h3 className="text-xl font-black flex items-center gap-2 mt-0.5">
                      <span>{tierInfo.currentTier.name}</span>
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </h3>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-white/70 block">Total Belanja</span>
                    <span className="text-sm font-black text-white">
                      Rp {(currentCustomer.totalSpent || 0).toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Progress Bar to Next Tier */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between text-xs font-bold text-white/90">
                    <span>Progres Level</span>
                    <span>
                      {tierInfo.nextTier 
                        ? `Butuh Rp ${tierInfo.spendNeeded.toLocaleString('id-ID')} lagi menuju ${tierInfo.nextTier.badge}`
                        : '⭐ Level Tertinggi (Sultan)'}
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-black/30 rounded-full overflow-hidden border border-white/20">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-300 to-yellow-400 rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${tierInfo.progressPct}%` }}
                    ></div>
                  </div>
                </div>

                {/* Active Perks List */}
                <div className="pt-3 border-t border-white/15 space-y-1.5">
                  <p className="text-[11px] font-black uppercase tracking-wider text-white/80">Keuntungan Member Aktif:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-white/90">
                    {tierInfo.currentTier.perks.map((perk, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-300 flex-shrink-0 stroke-[3]" />
                        <span className="font-semibold text-[11px]">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Stats Card Grid */}
              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-soft text-center space-y-1">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Pesanan Akun Ini</p>
                  <p className="text-xl sm:text-2xl font-black text-slate-850">{userActiveOrders.length + userOrderHistory.length}</p>
                </div>
                <div 
                  onClick={() => setShowRewardsModal(true)}
                  className="bg-amber-50/60 p-5 border border-amber-200/80 rounded-3xl shadow-soft text-center space-y-1 cursor-pointer hover:bg-amber-50 transition-colors group"
                >
                  <p className="text-[10px] sm:text-xs font-black text-amber-700 uppercase tracking-wider flex items-center justify-center gap-1">
                    <span>Reward Pts</span>
                    <Gift className="w-3 h-3" />
                  </p>
                  <p className="text-xl sm:text-2xl font-black text-amber-800">{loyaltyPoints.toLocaleString('id-ID')}</p>
                  <span className="text-[9px] font-black text-amber-700 group-hover:underline block">Tukar Hadiah →</span>
                </div>
                <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-soft text-center space-y-1">
                  <p className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider">Voucher Aktif</p>
                  <p className="text-xl sm:text-2xl font-black text-primary">{promos.length} Kupon</p>
                </div>
              </div>

              {/* Menu List */}
              <div className="bg-white border border-slate-100 rounded-3xl shadow-soft divide-y divide-slate-100 overflow-hidden">
                {[
                  { title: '💻 Masuk ke Portal Admin & Kasir POS', desc: 'Akses dashboard ERP, antrean mesin, manajemen stok & payroll', icon: Monitor, isFeatured: true, action: () => onSwitchToAdmin?.() },
                  { title: 'Paket Langganan Kuota Kiloan', desc: 'Beli paket cuci 25-100 Kg hemat hingga 50%', icon: Package, action: () => setShowSubscriptionModal(true) },
                  { title: 'Ganti Akun Pengguna / Member', desc: 'Beralih antara profil Aisyah, Budi Pratama, atau Citra Dewi', icon: Users, action: () => setShowSwitchUserModal(true) },
                  { title: 'Toko Tukar Poin Hadiah', desc: 'Tukarkan poin dengan voucher cuci dan merchandise', icon: Gift, action: () => setShowRewardsModal(true) },
                  { title: 'Pemberitahuan & Notifikasi', desc: 'Lihat seluruh update pengerjaan laundry Anda', icon: Bell, action: () => setShowNotifModal(true) },
                  { title: 'Pusat Bantuan & WhatsApp CS', desc: 'Konsultasi keluhan dan pertanyaan 24/7', icon: HelpCircle },
                  { title: 'Keluar Akun (Logout)', desc: 'Keluar dari profil ini dan kembali ke layar login WhatsApp', icon: LogOut, isDanger: true, action: () => onLogout?.() },
                ].map((menu, index) => {
                  const Icon = menu.icon;
                  return (
                    <button 
                      key={index} 
                      onClick={menu.action || undefined}
                      className={`w-full p-4 flex items-center justify-between hover:bg-slate-50 transition-colors text-left group ${
                        menu.isFeatured ? 'bg-sky-50/50 hover:bg-sky-50' : ''
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`p-2.5 rounded-2xl transition-colors ${
                          menu.isDanger 
                            ? 'bg-rose-50 text-rose-600 group-hover:bg-rose-100' 
                            : 'bg-slate-50 text-slate-600 group-hover:text-primary group-hover:bg-sky-50'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className={`text-xs sm:text-sm font-black transition-colors ${
                            menu.isDanger ? 'text-rose-600' : 'text-slate-850 group-hover:text-primary'
                          }`}>
                            {menu.title}
                          </h4>
                          <p className="text-[11px] text-slate-400 font-semibold">{menu.desc}</p>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 transition-all ${
                        menu.isDanger ? 'text-rose-300 group-hover:translate-x-0.5' : 'text-slate-300 group-hover:text-primary group-hover:translate-x-0.5'
                      }`} />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        );
      }
      default:
        return null;
    }
  };

  // If not logged in, render full AuthModal screen
  if (!isLoggedIn) {
    return (
      <div className="w-full h-full relative bg-slate-50 font-sans">
        <AuthModal
          customers={customers}
          onLoginSuccess={(custId) => {
            onLogin?.(custId);
            onNavigate('home');
          }}
          onRegisterNewUser={(newCust) => {
            onRegister?.(newCust);
            onNavigate('home');
          }}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between relative bg-slate-50 font-sans">
      {/* Dynamic Screen Viewport */}
      <div className="flex-1 overflow-hidden relative">
        {renderScreen()}
      </div>

      {/* Floating Bottom Nav Bar (Hidden during full-screen checkout & order detail) */}
      {currentScreen !== 'create_order' && currentScreen !== 'order_detail' && (
        <nav className="fixed bottom-0 left-0 right-0 max-w-full bg-white/90 backdrop-blur-xl border-t border-slate-200/80 px-6 py-3 flex justify-around items-center z-40 shadow-soft-lg">
          {[
            { id: 'home', label: 'Beranda', icon: HomeIcon },
            { id: 'orders_list', label: 'Pesanan', icon: ClipboardList, badge: userActiveOrders.length },
            { id: 'create_order', label: 'Pesan', icon: Plus, isCta: true },
            { id: 'promos', label: 'Promo', icon: Percent },
            { id: 'profile', label: 'Akun', icon: User },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = currentScreen === tab.id;

            if (tab.isCta) {
              return (
                <button
                  key={tab.id}
                  onClick={() => onNavigate(tab.id)}
                  className="relative -top-5 flex flex-col items-center group focus:outline-none"
                >
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-sky-400 via-primary to-indigo-600 text-white flex items-center justify-center shadow-clay-lg group-hover:scale-105 group-active:scale-95 transition-all border-4 border-white">
                    <Plus className="w-7 h-7 stroke-[3]" />
                  </div>
                  <span className="text-[10px] font-black text-slate-800 tracking-tight mt-1">Pesan</span>
                </button>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center space-y-1 transition-all group ${
                  isActive ? 'text-primary font-black scale-105' : 'text-slate-400 hover:text-slate-600 font-bold'
                }`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5]' : 'stroke-[2]'}`} />
                  {tab.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 bg-rose-500 text-white rounded-full text-[9px] font-black animate-pulse shadow-sm">
                      {tab.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] tracking-tight">{tab.label}</span>
              </button>
            );
          })}
        </nav>
      )}

      {/* MODAL: GANTI AKUN PENGGUNA (SWITCH CUSTOMER) */}
      {showSwitchUserModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-soft-lg p-6 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-primary">
                <Users className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900">Pilih Akun Pelanggan</h3>
              </div>
              <button onClick={() => setShowSwitchUserModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 font-semibold">
              Pilih profil pengguna untuk melihat pesanan, saldo dompet, dan riwayat khusus akun tersebut:
            </p>

            <div className="space-y-2">
              {customers.map(c => {
                const isSelected = c.id === currentCustomer.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      if (onChangeCustomer) onChangeCustomer(c.id);
                      setShowSwitchUserModal(false);
                    }}
                    className={`p-4 rounded-2.5xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      isSelected ? 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-sm' : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-clay-sm">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{c.name}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">{c.tier} · Saldo: Rp {c.balance.toLocaleString('id-ID')}</p>
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: TOKO TUKAR POIN */}
      {showRewardsModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-6 sm:p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-amber-600">
                <Gift className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900">Toko Hadiah Poin</h3>
              </div>
              <button onClick={() => setShowRewardsModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-200">
              <div>
                <p className="text-[10px] font-bold text-amber-700 uppercase">Poin Anda ({currentCustomer.name.split(' ')[0]})</p>
                <p className="text-xl font-black text-amber-900">{loyaltyPoints.toLocaleString('id-ID')} Pts</p>
              </div>
              <span className="text-xs font-bold text-amber-700">Tukar kapan saja</span>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {loyaltyRewardList.map((reward) => {
                const canAfford = loyaltyPoints >= reward.cost;
                return (
                  <div key={reward.id} className="p-4 border border-slate-200 rounded-2.5xl flex items-center justify-between bg-slate-50/60 hover:bg-white transition-all">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{reward.icon}</span>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">{reward.title}</h4>
                        <p className="text-[10px] text-slate-400 font-semibold">{reward.desc}</p>
                        <span className="inline-block mt-1 text-[10px] font-black text-amber-700 bg-amber-100/60 px-2 py-0.5 rounded">
                          {reward.cost} Poin
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onRedeemReward(reward);
                        setShowRewardsModal(false);
                      }}
                      disabled={!canAfford}
                      className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                        canAfford ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-clay-sm' : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Tukar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: NOTIFICATION CENTER */}
      {showNotifModal && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-6 sm:p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-primary">
                <Bell className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900">Pusat Pemberitahuan</h3>
              </div>
              <button onClick={() => setShowNotifModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {notifications.map((n) => (
                <div key={n.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2.5xl space-y-1">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-black text-slate-900">{n.title}</h4>
                    <span className="text-[10px] font-bold text-slate-400">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 font-medium leading-relaxed">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: PAKET BERLANGGANAN KUOTA KILOAN */}
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        walletBalance={walletBalance}
        onPurchasePlan={onPurchaseSubscription}
      />
    </div>
  );
}

