import React, { useState } from 'react';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, 
  Settings, BarChart3, LogOut, CheckCircle2,
  Scale, ClipboardEdit, PlusCircle, Check, Play, UserCheck
} from 'lucide-react';

export default function WebDashboard({
  activeOrders,
  orderHistory,
  onUpdateOrderStatus,
  walletBalance,
  onInputWeight,
  onCompleteOrder
}) {
  const [selectedDashboardTab, setSelectedDashboardTab] = useState('overview');

  // Cashier Weighing Modal / Inline Form State
  const [weighingOrderId, setWeighingOrderId] = useState(null);
  const [weighWeight, setWeighWeight] = useState(5.0);
  const [weighBedcover, setWeighBedcover] = useState(0);
  const [weighSepatu, setWeighSepatu] = useState(0);

  // Compute metrics
  const totalCompletedOrders = orderHistory.filter(o => o.status.includes('Selesai') || o.status === 'Diambil').length;
  const activeOrdersCount = activeOrders.length;
  
  // Calculate total earnings
  const calculatedEarnings = orderHistory.reduce((acc, order) => {
    const val = parseInt(order.price.replace(/[^\d]/g, ''));
    return acc + (isNaN(val) ? 0 : val);
  }, 0) + activeOrders.reduce((acc, order) => {
    return acc + (order.totalPrice || 0);
  }, 0);

  const statuses = [
    { value: 'received', label: 'Diterima', color: 'bg-slate-100 text-slate-700' },
    { value: 'washing', label: 'Cuci', color: 'bg-sky-50 text-sky-700' },
    { value: 'drying', label: 'Pengeringan', color: 'bg-blue-50 text-blue-750' },
    { value: 'ironing', label: 'Setrika', color: 'bg-indigo-50 text-indigo-750' },
    { value: 'ready', label: 'Siap Diantar', color: 'bg-emerald-50 text-emerald-700' }
  ];

  // Group active orders
  const pickupRequests = activeOrders.filter(o => o.status === 'pending_pickup');
  const productionQueue = activeOrders.filter(o => o.status !== 'pending_pickup');

  const handleOpenWeighing = (order) => {
    setWeighingOrderId(order.id);
    setWeighWeight(5.0);
    setWeighBedcover(0);
    setWeighSepatu(0);
  };

  const handleSaveWeighing = () => {
    onInputWeight(weighingOrderId, parseFloat(weighWeight), weighBedcover, weighSepatu);
    setWeighingOrderId(null);
  };

  return (
    <div className="flex h-screen bg-slate-50 w-full overflow-hidden text-slate-800">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-6 z-10">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-xl font-bold shadow-clay-sm text-white">
              🧼
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">Smartlink Portal</h2>
              <p className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Kasir & Produksi</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Ringkasan', icon: BarChart3 },
              { id: 'orders', label: 'Antrean Cucian', icon: ShoppingBag },
              { id: 'customers', label: 'Manajemen Member', icon: Users },
              { id: 'settings', label: 'Tarif Layanan', icon: Settings },
            ].map((menu) => {
              const Icon = menu.icon;
              return (
                <button
                  key={menu.id}
                  onClick={() => setSelectedDashboardTab(menu.id)}
                  className={`w-full flex items-center gap-3.5 px-4.5 py-3.5 rounded-2xl text-xs font-bold transition-all ${
                    selectedDashboardTab === menu.id
                      ? 'bg-primary text-white shadow-clay-sm'
                      : 'hover:bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{menu.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-slate-300">
              K1
            </div>
            <div>
              <p className="text-xs font-bold text-slate-200">Kasir Outlet 1</p>
              <p className="text-[10px] text-slate-500">Cempaka Putih Outlet</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-3 py-2 text-[11px] font-bold text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
          >
            <LogOut className="w-4 h-4 text-rose-500" />
            <span>Keluar Kasir (Logout)</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 overflow-y-auto p-8 space-y-8 h-full">
        {/* Header */}
        <header className="flex justify-between items-center pb-2 border-b border-slate-200/50">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Workspace Kasir Smartlink</h1>
            <p className="text-xs text-slate-450 font-medium mt-1">Timbang cucian masuk, terbitkan nota digital, dan kendalikan status produksi outlet.</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full text-emerald-700 text-[10px] font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Timbangan Terhubung (IoT)
              </span>
              <p className="text-[9px] text-slate-400 mt-1 font-semibold">Smartlink Snapbridge Aktif</p>
            </div>
          </div>
        </header>

        {selectedDashboardTab === 'overview' && (
          <div className="space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-4 gap-6">
              {[
                { title: 'Permintaan Jemput', val: `${pickupRequests.length} Order`, desc: 'Butuh kurir menjemput bag', icon: Scale, color: 'text-amber-500 bg-amber-50' },
                { title: 'Antrean Produksi', val: `${productionQueue.length} Order`, desc: 'Cucian sedang diproses', icon: ShoppingBag, color: 'text-primary bg-sky-50' },
                { title: 'Total Pendapatan', val: `Rp ${calculatedEarnings.toLocaleString('id-ID')}`, desc: 'Tunai & Saldo terbayar', icon: DollarSign, color: 'text-emerald-500 bg-emerald-50' },
                { title: 'Saldo Wallet Aisyah', val: `Rp ${walletBalance.toLocaleString('id-ID')}`, desc: 'Sinkronisasi e-Wallet mobile', icon: Users, color: 'text-purple-500 bg-purple-50' },
              ].map((stat, idx) => {
                const Icon = stat.icon;
                return (
                  <div key={idx} className="bg-white p-6 border border-slate-200/60 rounded-3xl shadow-soft space-y-4">
                    <div className="flex justify-between items-center">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                      <div className={`p-3 rounded-2xl shadow-clay-sm ${stat.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-extrabold text-slate-850">{stat.val}</h3>
                      <p className="text-[10px] font-semibold text-slate-450">{stat.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Split layout */}
            <div className="grid grid-cols-3 gap-8">
              
              {/* Pickup Requests Column */}
              <div className="col-span-1 bg-white p-6 border border-slate-200/60 rounded-3xl shadow-soft space-y-5">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-850">Permintaan Jemput Kurir</h3>
                  <p className="text-[11px] text-slate-450 mt-0.5">Cucian terkumpul dari pesanan mobile pelanggan</p>
                </div>

                <div className="space-y-4">
                  {pickupRequests.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-150 rounded-2.5xl p-6 text-center text-slate-400 space-y-2">
                      <span className="text-3xl block">🚚</span>
                      <p className="text-[11px] font-bold">Tidak ada penjemputan baru</p>
                    </div>
                  ) : (
                    pickupRequests.map((req) => (
                      <div key={req.id} className="p-4 border border-slate-150 rounded-2xl bg-slate-50/50 space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="text-xs font-black text-slate-800">{req.id}</h4>
                            <p className="text-[10px] text-slate-450 font-semibold mt-0.5">Estimasi: {req.bagCount} Kantong</p>
                          </div>
                          <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-black rounded-md">Jemput</span>
                        </div>

                        {weighingOrderId === req.id ? (
                          <div className="pt-2 border-t border-slate-200/50 space-y-3">
                            <h5 className="text-[10px] font-black text-slate-700">Timbangan & Item Kasir:</h5>
                            
                            {/* Weight Kg Counter */}
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-bold">Berat Cucian (Kg):</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setWeighWeight(Math.max(0.5, weighWeight - 0.5))}
                                  className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-xs"
                                >
                                  -
                                </button>
                                <span className="text-xs font-black w-10 text-center">{weighWeight.toFixed(1)}</span>
                                <button 
                                  onClick={() => setWeighWeight(weighWeight + 0.5)}
                                  className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Extra Bedcover */}
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-bold">Tambah Bedcover (Pc):</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setWeighBedcover(Math.max(0, weighBedcover - 1))}
                                  className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-xs"
                                >
                                  -
                                </button>
                                <span className="text-xs font-black w-6 text-center">{weighBedcover}</span>
                                <button 
                                  onClick={() => setWeighBedcover(weighBedcover + 1)}
                                  className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            {/* Extra Sepatu */}
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] text-slate-500 font-bold">Tambah Sepatu (Pasang):</span>
                              <div className="flex items-center gap-2">
                                <button 
                                  onClick={() => setWeighSepatu(Math.max(0, weighSepatu - 1))}
                                  className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-xs"
                                >
                                  -
                                </button>
                                <span className="text-xs font-black w-6 text-center">{weighSepatu}</span>
                                <button 
                                  onClick={() => setWeighSepatu(weighSepatu + 1)}
                                  className="w-7 h-7 bg-white border border-slate-200 rounded-lg flex items-center justify-center font-bold text-xs"
                                >
                                  +
                                </button>
                              </div>
                            </div>

                            <div className="flex gap-2 pt-2">
                              <button
                                onClick={handleSaveWeighing}
                                className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-[10px] rounded-xl flex items-center justify-center gap-1"
                              >
                                <Check className="w-3.5 h-3.5" />
                                Terbitkan Nota
                              </button>
                              <button
                                onClick={() => setWeighingOrderId(null)}
                                className="px-3 py-2 bg-slate-200 text-slate-600 font-bold text-[10px] rounded-xl"
                              >
                                Batal
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleOpenWeighing(req)}
                            className="w-full py-2 border border-slate-200 hover:bg-white text-slate-700 font-extrabold text-[10px] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Scale className="w-3.5 h-3.5 text-primary" />
                            Timbang & Input Kasir
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Active Production Queue Control Center */}
              <div className="col-span-2 bg-white p-6 border border-slate-200/60 rounded-3xl shadow-soft space-y-5">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-850">Kendalikan Progres Produksi Cucian</h3>
                  <p className="text-[11px] text-slate-450 mt-0.5">Ubah status mesin cuci/setrika untuk di-sinkronisasikan ke pelacak mobile pelanggan.</p>
                </div>

                <div className="space-y-4">
                  {productionQueue.length === 0 ? (
                    <div className="border-2 border-dashed border-slate-150 rounded-2.5xl p-8 text-center text-slate-400 space-y-2">
                      <span className="text-4xl block">🧺</span>
                      <p className="text-xs font-bold">Antrean Produksi Kosong</p>
                      <p className="text-[10px] text-slate-450">Timbang cucian masuk pada kolom penjemputan untuk memulai produksi.</p>
                    </div>
                  ) : (
                    productionQueue.map((order) => (
                      <div 
                        key={order.id}
                        className="p-5 border border-slate-150 rounded-2.5xl bg-slate-50/50 hover:bg-slate-50 transition-colors space-y-4"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="inline-block px-2.5 py-0.5 bg-sky-100 border border-sky-200 text-primary text-[9px] font-black rounded-lg">
                              {order.serviceName}
                            </span>
                            <h4 className="text-sm font-extrabold text-slate-800 mt-2">{order.id}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                              Timbangan: {order.amount} Kg · Tagihan: <strong className="text-slate-700">Rp {order.totalPrice.toLocaleString('id-ID')}</strong>
                            </p>
                            <div className="flex gap-2 items-center mt-2">
                              <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                                order.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'
                              }`}>
                                {order.paymentStatus === 'Paid' ? 'Lunas' : 'Belum Lunas'}
                              </span>
                              {order.paymentMethod && (
                                <span className="text-[9px] text-slate-450 font-semibold">
                                  via {order.paymentMethod === 'Wallet' ? 'Wallet' : 'Tunai / COD'}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-400 uppercase">Tahap Sekarang</p>
                            <span className="inline-block mt-1 px-3 py-1 bg-white border border-slate-150 text-slate-750 font-extrabold text-xs rounded-full">
                              {statuses.find(s => s.value === order.status)?.label || 'Diterima'}
                            </span>
                          </div>
                        </div>

                        {/* Interactive Status Changer Row */}
                        <div className="space-y-3">
                          <p className="text-[10px] font-bold text-slate-450 uppercase tracking-wide">Pindahkan Status Produksi:</p>
                          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-150/60 pt-3">
                            <div className="flex flex-wrap gap-1.5">
                              {statuses.map((st) => {
                                const isCurrent = order.status === st.value;
                                return (
                                  <button
                                    key={st.value}
                                    onClick={() => onUpdateOrderStatus(order.id, st.value)}
                                    className={`px-3 py-1.5 text-[9px] font-black rounded-lg border transition-all flex items-center gap-1 ${
                                      isCurrent
                                        ? 'border-primary bg-primary text-white'
                                        : 'border-slate-200 bg-white hover:border-slate-350 text-slate-600'
                                    }`}
                                  >
                                    {isCurrent && <Check className="w-3 h-3 text-white" />}
                                    <span>{st.label}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Handover deliver button once ready */}
                            {order.status === 'ready' && (
                              <button
                                onClick={() => onCompleteOrder(order.id)}
                                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 active:scale-95 text-white font-extrabold text-[10px] rounded-xl flex items-center gap-1 transition-all shadow-clay-sm animate-pulse-subtle"
                              >
                                <UserCheck className="w-3.5 h-3.5" />
                                Serahkan ke Pelanggan
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Antrean Tab Content */}
        {selectedDashboardTab === 'orders' && (
          <div className="bg-white p-6 border border-slate-200/60 rounded-3xl shadow-soft space-y-4">
            <h3 className="text-base font-extrabold text-slate-850">Daftar Antrean Nota Semua Cucian</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-150 text-slate-450 uppercase font-black tracking-wider">
                    <th className="py-4 px-4">Order ID</th>
                    <th className="py-4 px-4">Pelanggan</th>
                    <th className="py-4 px-4">Layanan</th>
                    <th className="py-4 px-4">Timbangan</th>
                    <th className="py-4 px-4">Biaya</th>
                    <th className="py-4 px-4">Status Produksi</th>
                    <th className="py-4 px-4">Status Nota</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {activeOrders.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/50">
                      <td className="py-4 px-4 font-extrabold text-slate-850">{o.id}</td>
                      <td className="py-4 px-4 font-bold text-slate-700">Aisyah</td>
                      <td className="py-4 px-4 font-semibold text-slate-650">{o.serviceName}</td>
                      <td className="py-4 px-4 font-semibold text-slate-650">{o.amount > 0 ? `${o.amount} Kg` : 'Belum Ditimbang'}</td>
                      <td className="py-4 px-4 font-bold text-slate-800">Rp {o.totalPrice.toLocaleString('id-ID')}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-sky-50 text-primary rounded-full font-black border border-sky-100">
                          {statuses.find(s => s.value === o.status)?.label || 'Penjemputan'}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                          o.paymentStatus === 'Paid' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                        }`}>
                          {o.paymentStatus === 'Paid' ? 'Lunas' : 'Belum Bayar'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {orderHistory.map(o => (
                    <tr key={o.id} className="hover:bg-slate-50/50 opacity-80">
                      <td className="py-4 px-4 font-extrabold text-slate-600">{o.id}</td>
                      <td className="py-4 px-4 font-bold text-slate-550">Aisyah</td>
                      <td className="py-4 px-4 font-semibold text-slate-500">{o.serviceName}</td>
                      <td className="py-4 px-4 font-semibold text-slate-550">{o.amount} Kg</td>
                      <td className="py-4 px-4 font-bold text-slate-600">{o.price}</td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-black">
                          Selesai
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[9px] font-bold">
                          Lunas
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Member Management Tab Content */}
        {selectedDashboardTab === 'customers' && (
          <div className="bg-white p-6 border border-slate-200/60 rounded-3xl shadow-soft space-y-4">
            <h3 className="text-base font-extrabold text-slate-850">Database Member Outlet</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center justify-between p-4 border border-slate-150 rounded-2.5xl bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-clay-sm">
                    AS
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-800">Aisyah Salsabila</h4>
                    <p className="text-xs text-slate-450 font-semibold mt-0.5">aisyah@laundrymail.com</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-primary bg-sky-50 px-3 py-1 rounded-lg">Premium Member</span>
                  <p className="text-[10px] text-slate-400 font-bold mt-1.5">Wallet: Rp {walletBalance.toLocaleString('id-ID')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settings Tab Content */}
        {selectedDashboardTab === 'settings' && (
          <div className="bg-white p-6 border border-slate-200/60 rounded-3xl shadow-soft space-y-4">
            <h3 className="text-base font-extrabold text-slate-850">Pengaturan Biaya Jasa Laundry</h3>
            <p className="text-xs text-slate-450 font-semibold">Tentukan tarif harga per unit untuk masing-masing layanan laundry</p>
            
            <div className="space-y-3 pt-3">
              {[
                { name: 'Cuci & Setrika', price: 'Rp 12.000 / Kg' },
                { name: 'Cuci Kering', price: 'Rp 18.000 / Kg' },
                { name: 'Setrika Saja', price: 'Rp 6.000 / Kg' },
                { name: 'Bed Cover', price: 'Rp 25.000 / Pc' },
                { name: 'Sepatu', price: 'Rp 20.000 / Pasang' }
              ].map((serv, idx) => (
                <div key={idx} className="flex justify-between items-center p-4 border border-slate-100 rounded-2.5xl hover:bg-slate-50 transition-colors">
                  <span className="text-xs font-extrabold text-slate-700">{serv.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-800 bg-slate-100 px-3 py-1.5 rounded-xl">{serv.price}</span>
                    <button className="text-xs font-bold text-primary hover:underline">Edit Tarif</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
