import React, { useState } from 'react';
import { ArrowLeft, Check, Phone, Info, CreditCard, Landmark, Wallet } from 'lucide-react';

export default function OrderDetail({ 
  orderId, 
  activeOrders, 
  orderHistory, 
  onNavigate,
  onPayOrder,
  walletBalance
}) {
  const [paymentChoice, setPaymentChoice] = useState('Wallet');

  // Find order in activeOrders or orderHistory
  const order = activeOrders.find(o => o.id === orderId) || orderHistory.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center p-6 text-center">
        <span className="text-5xl mb-4">🔍</span>
        <h3 className="text-base font-bold text-slate-800">Pesanan Tidak Ditemukan</h3>
        <button 
          onClick={() => onNavigate('home')}
          className="mt-4 px-6 py-2 bg-primary text-white font-extrabold text-sm rounded-xl"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  const isCompletedHistory = orderHistory.some(o => o.id === orderId);

  // Map status values to timeline indices (0-based)
  const getStatusIndex = (status) => {
    switch (status) {
      case 'pending_pickup': return 0;
      case 'received': return 1;
      case 'washing': return 2;
      case 'drying': return 3;
      case 'ironing': return 4;
      case 'ready': return 5;
      case 'Selesai': return 5;
      case 'Selesai (COD)': return 5;
      case 'Diambil': return 5;
      default: return 1;
    }
  };

  const currentStepIdx = getStatusIndex(order.status);

  const timelineSteps = [
    { label: 'Penjemputan Pakaian', desc: 'Kurir dalam perjalanan menuju tempat Anda untuk menjemput pakaian.', defaultTime: '15 Mei 2024, 10:30' },
    { label: 'Diterima & Ditimbang', desc: 'Pakaian telah diterima di outlet dan berhasil ditimbang oleh kasir.', defaultTime: '15 Mei 2024, 11:00' },
    { label: 'Sedang Dicuci', desc: 'Pakaian Anda sedang dicuci menggunakan detergen khusus ramah serat kain.', defaultTime: '15 Mei 2024, 11:30' },
    { label: 'Proses Pengeringan', desc: 'Pakaian sedang dikeringkan menggunakan mesin pengering higienis.', defaultTime: 'Menunggu' },
    { label: 'Proses Setrika', desc: 'Pakaian disetrika rapi dan disemprot pewangi tahan lama.', defaultTime: 'Menunggu' },
    { label: 'Siap Diambil / Diantar', desc: 'Cucian bersih Anda selesai diproses dan siap diantarkan kurir.', defaultTime: 'Menunggu' }
  ];

  const subtotal = order.totalPrice ? (order.totalPrice - 5000) / 0.8 : 0; // estimate
  const discount = order.totalPrice ? subtotal * 0.2 : 0;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center px-4 pt-6 pb-4 bg-white border-b border-slate-100">
        <button 
          onClick={() => onNavigate('home')}
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors mr-2"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h2 className="text-base font-extrabold text-slate-850">Detail Pelacakan</h2>
      </div>

      {/* Content scrollable */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24 space-y-5">
        {/* Info Banner */}
        <div className="p-5 bg-gradient-to-br from-primary to-primary-dark rounded-3xl text-white shadow-soft relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-24 h-24 bg-white/10 rounded-full blur-xl translate-x-4 translate-y-4"></div>
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <span className="text-[10px] font-bold text-sky-100 uppercase tracking-wider">Invoice ID</span>
              <h3 className="text-lg font-black mt-0.5">{order.id}</h3>
              <p className="text-[10px] text-sky-100/90 font-medium mt-1">Dipesan pada {order.orderTime || '15 Mei 2024, 10:30'}</p>
            </div>
            <span className="px-3 py-1 bg-white/20 text-[9px] font-extrabold rounded-full uppercase tracking-wide">
              {isCompletedHistory ? 'Selesai' : order.status === 'pending_pickup' ? 'Penjemputan' : order.status === 'ready' ? 'Siap Antar' : 'Diproses'}
            </span>
          </div>
        </div>

        {/* Timeline Tracking */}
        <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-soft space-y-6">
          <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Progres Laundry</h3>
          
          <div className="space-y-5 relative pl-8">
            {/* Thread line */}
            <div className="absolute top-2.5 bottom-2.5 left-3 w-0.5 bg-slate-100">
              <div 
                className="w-full bg-primary transition-all duration-500"
                style={{ height: `${(currentStepIdx / 5) * 100}%` }}
              ></div>
            </div>

            {timelineSteps.map((step, idx) => {
              const isCompleted = idx < currentStepIdx;
              const isActive = idx === currentStepIdx;

              return (
                <div key={idx} className="relative space-y-1">
                  {/* Circle Indicator */}
                  <div className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center -translate-x-[1px] transition-all z-10 ${
                    isCompleted 
                      ? 'border-emerald-500 bg-emerald-500 text-white' 
                      : isActive 
                        ? 'border-primary bg-white text-primary ring-4 ring-primary/10' 
                        : 'border-slate-200 bg-white text-slate-350'
                  }`}
                  style={{ width: '20px', height: '20px' }}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex justify-between items-start">
                    <h4 className={`text-[11px] font-extrabold ${
                      isActive ? 'text-primary' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </h4>
                    <span className="text-[9px] font-semibold text-slate-450">
                      {isActive && order.statusTime ? order.statusTime : isCompleted ? step.defaultTime : 'Menunggu'}
                    </span>
                  </div>

                  {/* Active Description with animation */}
                  {isActive && !isCompletedHistory && (
                    <div className="bg-sky-50/50 border border-sky-100 rounded-2xl p-3 mt-1.5 flex gap-3 items-center">
                      <div className="flex-1 space-y-0.5">
                        <p className="text-[10px] text-slate-600 font-medium leading-normal">
                          {step.desc}
                        </p>
                      </div>

                      {/* Active Spinning Elements */}
                      {idx === 0 && ( // Pickup pulse
                        <div className="w-8 h-8 rounded-full border border-sky-200 bg-white flex items-center justify-center relative shadow-clay-sm flex-shrink-0 animate-pulse-subtle">
                          <span className="text-xs">🚚</span>
                        </div>
                      )}
                      {idx === 2 && ( // Washing animation
                        <div className="w-8 h-8 rounded-full border border-sky-200 bg-white flex items-center justify-center relative overflow-hidden shadow-clay-sm flex-shrink-0">
                          <div className="w-6 h-6 rounded-full border border-dashed border-primary animate-wash-spin"></div>
                          <span className="absolute text-xs">🧼</span>
                        </div>
                      )}
                      {idx === 3 && ( // Drying animation
                        <div className="w-8 h-8 rounded-full border border-sky-200 bg-white flex items-center justify-center relative overflow-hidden shadow-clay-sm flex-shrink-0">
                          <div className="w-6 h-6 rounded-full border border-dashed border-amber-500 animate-spin-slow"></div>
                          <span className="absolute text-xs">☀️</span>
                        </div>
                      )}
                      {idx === 4 && ( // Ironing animation
                        <div className="w-8 h-8 rounded-full border border-sky-200 bg-white flex items-center justify-center relative overflow-hidden shadow-clay-sm flex-shrink-0">
                          <span className="text-xs animate-bounce-slow">🔌</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Invoice & Payment Section */}
        {order.status === 'pending_pickup' ? (
          <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-soft space-y-2 text-center py-6">
            <span className="text-3xl block">⚖️</span>
            <h4 className="text-xs font-black text-slate-700">Menunggu Timbangan Kasir</h4>
            <p className="text-[10px] text-slate-450 font-semibold leading-relaxed max-w-[220px] mx-auto">
              Kurir akan segera mengambil pakaian Anda. Rincian nota akan muncul setelah kasir menimbang cucian Anda.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Price specification details */}
            <div className="bg-white p-4 border border-slate-100 rounded-3xl shadow-soft space-y-3">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Spesifikasi Tagihan</h3>
              <div className="space-y-2 text-xs text-slate-650 font-semibold">
                <div className="flex justify-between pb-2 border-b border-slate-50">
                  <span className="text-slate-450">Layanan</span>
                  <span className="text-slate-800 font-extrabold">{order.serviceName}</span>
                </div>
                <div className="flex justify-between pb-2 border-b border-slate-50">
                  <span className="text-slate-450">Berat Timbangan</span>
                  <span className="text-slate-800 font-extrabold">{order.amount} Kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">Estimasi Selesai (ETA)</span>
                  <span className="text-slate-800 font-extrabold">{order.eta}</span>
                </div>
              </div>
            </div>

            {/* Billing Pay Desk */}
            {!isCompletedHistory && (
              <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-soft space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Status Pembayaran</h3>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    order.paymentStatus === 'Paid' 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' 
                      : 'bg-rose-50 text-rose-500 border border-rose-100'
                  }`}>
                    {order.paymentStatus === 'Paid' ? 'Lunas' : 'Belum Lunas'}
                  </span>
                </div>

                {order.paymentStatus === 'Paid' ? (
                  <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-100 flex items-center gap-2.5">
                    <Check className="w-4.5 h-4.5 text-emerald-600 stroke-[3]" />
                    <p className="text-[10px] text-slate-650 font-semibold">
                      Dibayar via <strong className="text-slate-800">{order.paymentMethod === 'Wallet' ? 'Laundry Wallet' : 'Tunai / COD'}</strong> sebesar <strong className="text-primary">Rp {order.totalPrice.toLocaleString('id-ID')}</strong>
                    </p>
                  </div>
                ) : order.paymentMethod === 'Cash' ? (
                  <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-2.5">
                    <span className="text-base">💵</span>
                    <div>
                      <h5 className="text-[10px] font-black text-slate-850">Metode COD Terpilih</h5>
                      <p className="text-[9px] text-slate-500 font-semibold mt-0.5 leading-relaxed">
                        Harap siapkan uang tunai sebesar <strong>Rp {order.totalPrice.toLocaleString('id-ID')}</strong> untuk dibayarkan ke kurir saat pakaian diantarkan ke rumah Anda.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Bill Breakdown */}
                    <div className="bg-slate-50 p-3.5 rounded-2.5xl space-y-2 border border-slate-100">
                      <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                        <span>Biaya Cucian (Setelah Diskon 20%)</span>
                        <span>Rp {(order.totalPrice - 5000).toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-500 font-bold">
                        <span>Ongkos Kirim Kurir</span>
                        <span>Rp 5.000</span>
                      </div>
                      <div className="h-px bg-slate-200 my-1"></div>
                      <div className="flex justify-between text-xs font-black text-slate-800">
                        <span>Total Pembayaran</span>
                        <span className="text-primary font-black">Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                      </div>
                    </div>

                    {/* Pay choice toggler */}
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setPaymentChoice('Wallet')}
                        className={`py-2.5 px-3 rounded-2xl border-2 font-bold text-[10px] flex items-center justify-center gap-1.5 transition-all ${
                          paymentChoice === 'Wallet'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-slate-100 bg-slate-50 text-slate-600'
                        }`}
                      >
                        <Wallet className="w-3.5 h-3.5" />
                        <span>Laundry Wallet</span>
                      </button>
                      <button
                        onClick={() => setPaymentChoice('Cash')}
                        className={`py-2.5 px-3 rounded-2xl border-2 font-bold text-[10px] flex items-center justify-center gap-1.5 transition-all ${
                          paymentChoice === 'Cash'
                            ? 'border-primary bg-primary/5 text-primary'
                            : 'border-slate-100 bg-slate-50 text-slate-600'
                        }`}
                      >
                        <span>💵 Bayar COD</span>
                      </button>
                    </div>

                    {/* Pay Button Action */}
                    {paymentChoice === 'Wallet' ? (
                      <div>
                        {walletBalance < order.totalPrice ? (
                          <div className="space-y-2">
                            <p className="text-[9px] text-rose-500 font-semibold leading-relaxed">
                              ⚠️ Saldo wallet Anda (Rp {walletBalance.toLocaleString('id-ID')}) tidak mencukupi.
                            </p>
                            <button
                              onClick={() => onNavigate('home')} // direct back to home where wallet is topped up or can trigger topup modal
                              className="w-full py-3 bg-rose-50 hover:bg-rose-100 text-rose-500 font-bold text-xs rounded-xl text-center"
                            >
                              Top Up Saldo di Beranda
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => onPayOrder(order.id, 'Wallet')}
                            className="w-full py-3.5 text-white font-extrabold text-xs rounded-2xl shadow-clay-sm clay-button text-center block"
                          >
                            Bayar Sekarang (Potong Saldo)
                          </button>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => onPayOrder(order.id, 'Cash')}
                        className="w-full py-3.5 border-2 border-slate-200 hover:bg-slate-50 active:scale-95 text-slate-700 font-extrabold text-xs rounded-2xl text-center block"
                      >
                        Konfirmasi Pembayaran COD (Tunai)
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Sticky Bottom Actions */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-soft-lg flex gap-3 z-30">
        <a 
          href="https://wa.me/6281234567890" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex-1 py-3.5 border-2 border-slate-150 hover:bg-slate-50 active:scale-95 text-slate-700 font-extrabold text-xs rounded-2xl flex items-center justify-center gap-1.5 transition-all text-center"
        >
          <Phone className="w-3.5 h-3.5 text-slate-450" />
          Hubungi CS
        </a>
      </div>
    </div>
  );
}
