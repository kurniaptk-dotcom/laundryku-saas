import React, { useState } from 'react';
import { ArrowLeft, Check, Phone, Info, Calendar, Clock, MapPin, Truck, ShieldCheck, MessageCircle, Share2, Copy, Camera, Star, Sparkles } from 'lucide-react';
import { getWhatsAppShareUrl, getWhatsAppChatUrl } from '../../utils/whatsappHelper';
import LiveCourierMap from '../LiveCourierMap';
import GarmentPhotoModal from '../GarmentPhotoModal';
import RatingModal from '../RatingModal';

export default function OrderDetail({ 
  orderId, 
  activeOrders = [], 
  orderHistory = [], 
  onNavigate,
  onSubmitReview
}) {
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  // Find order in activeOrders or orderHistory
  const order = activeOrders.find(o => o.id === orderId) || orderHistory.find(o => o.id === orderId);

  if (!order) {
    return (
      <div className="flex flex-col h-full bg-slate-50 items-center justify-center p-8 text-center min-h-[400px]">
        <span className="text-6xl mb-4">🔍</span>
        <h3 className="text-lg font-black text-slate-850">Pesanan Tidak Ditemukan</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-xs">ID pesanan {orderId} tidak ditemukan dalam riwayat aktif Anda.</p>
        <button 
          onClick={() => onNavigate('home')}
          className="mt-6 px-6 py-3 bg-primary text-white font-extrabold text-xs rounded-2xl shadow-clay-sm hover:opacity-95"
        >
          Kembali ke Beranda
        </button>
      </div>
    );
  }

  // Map status values to timeline indices (6 steps synced with Admin Kanban)
  const getStatusIndex = (status) => {
    switch (status) {
      case 'received': return 0;
      case 'washing': return 1;
      case 'drying': return 2;
      case 'ironing': return 3;
      case 'ready': return 4;
      case 'Selesai':
      case 'Diambil':
      case 'selesai': return 5;
      default: return 0;
    }
  };

  const currentStepIdx = getStatusIndex(order.status);
  const isOrderFinished = order.status === 'Selesai' || order.status === 'Diambil' || order.status === 'selesai';

  const timelineSteps = [
    { label: '📥 Pesanan Diterima', desc: 'Pesanan telah tercatat di sistem dan kurir siap menjemput pakaian.', defaultTime: order.orderTime || '15 Mei 2024, 10:30' },
    { label: '🧼 Sedang Dicuci', desc: 'Pakaian sedang dicuci bersih dengan detergen premium ramah serat.', defaultTime: order.statusTime || '15 Mei 2024, 11:00' },
    { label: '💨 Proses Pengeringan', desc: 'Pakaian sedang dikeringkan menggunakan mesin pengering berteknologi khusus.', defaultTime: 'Tahap 3' },
    { label: '🔌 Setrika & Packing Rapi', desc: 'Pakaian sedang disetrika licin dan disemprot pewangi khusus tahan lama.', defaultTime: 'Tahap 4' },
    { label: '🚚 Siap Diantar Kurir', desc: 'Pakaian bersih, rapi, dan harum siap diantar langsung ke rumah Anda.', defaultTime: 'Tahap 5' },
    { label: '✅ Pesanan Selesai / Diterima', desc: 'Pakaian telah sampai dengan aman dan transaksi selesai sempurna.', defaultTime: 'Selesai' }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'received': return '📥 Diterima';
      case 'washing': return '🧼 Sedang Dicuci';
      case 'drying': return '💨 Pengeringan';
      case 'ironing': return '🔌 Setrika & Packing';
      case 'ready': return '🚚 Siap Diantar';
      case 'Selesai':
      case 'Diambil':
      case 'selesai': return '✅ Selesai / Diterima';
      default: return 'Sedang Diproses';
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Top Header App Bar */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 bg-white border-b border-slate-100 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('home')}
            className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h2 className="text-lg font-black text-slate-850">Pelacakan Pesanan</h2>
            <p className="text-xs text-slate-400 font-semibold">{order.id}</p>
          </div>
        </div>
      </div>

      {/* Content scrollable */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-6 md:p-8 pb-28 space-y-6 max-w-2xl mx-auto w-full">
        {/* Info Banner */}
        <div className={`p-6 rounded-3xl text-white shadow-soft relative overflow-hidden ${
          isOrderFinished 
            ? 'bg-gradient-to-br from-emerald-600 to-teal-700' 
            : 'bg-gradient-to-br from-primary to-indigo-600'
        }`}>
          <div className="absolute right-0 bottom-0 w-36 h-36 bg-white/10 rounded-full blur-2xl"></div>
          <div className="flex justify-between items-start z-10 relative">
            <div>
              <span className="text-[10px] font-black text-sky-200 uppercase tracking-wider">No. Resi Transaksi</span>
              <h3 className="text-2xl font-black mt-0.5">{order.id}</h3>
              <p className="text-xs text-sky-100 font-medium mt-1">Dipesan pada {order.orderTime || '15 Mei 2024, 10:30'}</p>
            </div>
            <span className="px-3.5 py-1.5 bg-white/20 text-xs font-black rounded-full uppercase tracking-wider backdrop-blur-sm">
              {getStatusBadge(order.status)}
            </span>
          </div>
        </div>

        {/* Courier Dispatch Card (Feature #5) */}
        <div className="p-5 bg-white border border-slate-200/90 rounded-3xl shadow-soft space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-primary font-black text-xs">
              <Truck className="w-4 h-4" />
              <span>Kurir Penjemput & Pengantar</span>
            </div>
            <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black border border-emerald-100">
              Driver Siaga
            </span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-black text-sm flex items-center justify-center shadow-clay-sm flex-shrink-0">
                DP
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-900">{order.courierName || 'Doni Pratama (Honda Vario B 4821 KLO)'}</h4>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Rating Kurir: 4.95 ⭐ · Standar Antar Cepat</p>
              </div>
            </div>

            <a
              href="https://wa.me/6281299887711"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-2xl border border-emerald-200 transition-all shadow-xs flex items-center gap-1.5 text-xs font-black"
              title="Chat Kurir"
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Hubungi</span>
            </a>
          </div>
        </div>

        {/* 1. Live Courier GPS Tracking Map (for delivery) or Gerai Drop-Off Info (for dropoff) */}
        {order.fulfillmentType === 'dropoff' ? (
          <div className="p-5 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl shadow-soft space-y-3.5 border border-teal-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl shadow-xs border border-emerald-400/30">
                  🏬
                </div>
                <div>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">Metode Penyerahan</span>
                  <h4 className="text-sm font-black">Drop-Off & Ambil di Gerai Toko</h4>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 text-[10px] font-black rounded-lg border border-emerald-400/30">
                ✓ Bebas Ongkir (Rp 0)
              </span>
            </div>

            <div className="p-3.5 bg-white/10 rounded-2xl text-xs space-y-1.5 backdrop-blur-md border border-white/10">
              <p className="font-bold text-slate-100 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>LaundryKu Hub Cempaka Putih Utama</span>
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                Jl. Cempaka Putih Tengah No. 18, Jakarta Pusat (Samping Alfamidi)
              </p>
              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                <span>⏰ Buka Setiap Hari: <strong>07:00 - 22:00 WIB</strong></span>
                <span className="text-emerald-300 font-bold">Tunjukkan ID #{order.id} ke kasir</span>
              </div>
            </div>
          </div>
        ) : (
          <LiveCourierMap
            order={order}
            courier={{
              name: order.courierName || 'Doni Pratama',
              phone: order.courierPhone || '0812-9988-7711',
              vehicle: 'Honda Vario B 4821 TZX'
            }}
          />
        )}

        {/* 1.5. Quick Action Bars: Garment Photo Audit & Rating */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => setShowPhotoModal(true)}
            className="p-3.5 bg-white hover:bg-slate-50 rounded-2.5xl border border-slate-200 shadow-soft flex items-center justify-between group transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-primary flex items-center justify-center group-hover:scale-105 transition-transform">
                <Camera className="w-5 h-5" />
              </div>
              <div className="text-left">
                <h4 className="text-xs font-black text-slate-850">Foto Audit Pakaian</h4>
                <p className="text-[10px] text-slate-400 font-semibold">Sebelum & Sesudah Cuci</p>
              </div>
            </div>
            <span className="px-2 py-1 bg-sky-100/60 text-primary text-[10px] font-black rounded-lg">
              Lihat Foto →
            </span>
          </button>

          {isOrderFinished ? (
            <button
              onClick={() => setShowRatingModal(true)}
              className="p-3.5 bg-gradient-to-r from-amber-500 to-primary text-white rounded-2.5xl shadow-soft flex items-center justify-between hover:opacity-95 transition-all active:scale-98"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-lg">
                  ⭐
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black">Beri Rating Pesanan</h4>
                  <p className="text-[10px] text-amber-100 font-semibold">Dapatkan +50 Reward Poin</p>
                </div>
              </div>
              <span className="px-2.5 py-1 bg-white text-amber-800 text-[10px] font-black rounded-lg">
                Nilai Sekarang
              </span>
            </button>
          ) : (
            <div className="p-3.5 bg-emerald-50/70 rounded-2.5xl border border-emerald-200/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-emerald-850">Garansi Pakaian Higienis</h4>
                <p className="text-[10px] text-emerald-600 font-semibold">Proses cuci steril bebas kuman 99.9%</p>
              </div>
            </div>
          )}
        </div>

        {/* Courier Info Card */}
        <div className="bg-white p-6 sm:p-8 border border-slate-150/70 rounded-3xl shadow-soft space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Status & Progres Pengerjaan</h3>
            <span className="text-xs font-black text-primary bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              Live Real-Time
            </span>
          </div>
          
          <div className="space-y-6 relative pl-8">
            {/* Thread line */}
            <div className="absolute top-3 bottom-3 left-3 w-1 bg-slate-100 rounded-full">
              <div 
                className={`w-full rounded-full transition-all duration-500 ${isOrderFinished ? 'bg-emerald-500' : 'bg-primary'}`}
                style={{ height: `${Math.min(100, (currentStepIdx / 5) * 100)}%` }}
              ></div>
            </div>

            {timelineSteps.map((step, idx) => {
              const isCompleted = isOrderFinished ? idx <= currentStepIdx : idx < currentStepIdx;
              const isActive = isOrderFinished ? false : idx === currentStepIdx;

              return (
                <div key={idx} className="relative space-y-1.5">
                  {/* Circle Indicator */}
                  <div className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center -translate-x-[2px] transition-all z-10 ${
                    isCompleted 
                      ? 'border-emerald-500 bg-emerald-500 text-white shadow-sm' 
                      : isActive 
                        ? 'border-primary bg-white text-primary ring-4 ring-primary/15 shadow-sm' 
                        : 'border-slate-250 bg-white text-slate-300'
                  }`}
                  >
                    {isCompleted ? (
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    ) : (
                      <span className="w-2 h-2 rounded-full bg-current"></span>
                    )}
                  </div>

                  {/* Text Details */}
                  <div className="flex justify-between items-start">
                    <h4 className={`text-sm font-extrabold ${
                      isActive ? 'text-primary' : isCompleted ? 'text-slate-800' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </h4>
                    <span className="text-[11px] font-bold text-slate-400">
                      {isActive && order.statusTime ? order.statusTime : isCompleted ? step.defaultTime : 'Menunggu'}
                    </span>
                  </div>

                  {/* Active Description with animation */}
                  {isActive && (
                    <div className="bg-sky-50/60 border border-sky-100 rounded-2.5xl p-4 mt-2 flex gap-4 items-center">
                      <div className="flex-1 space-y-1">
                        <p className="text-xs text-slate-650 font-semibold leading-relaxed">
                          {step.desc}
                        </p>
                        <p className="text-[11px] text-primary font-black">Pakaian Anda dirawat dengan standar kebersihan terbaik ✨</p>
                      </div>

                      {/* Active Spinning Element */}
                      {idx === 1 && ( // Washing animation
                        <div className="w-12 h-12 rounded-full border border-sky-200 bg-white flex items-center justify-center relative overflow-hidden shadow-clay-sm flex-shrink-0">
                          <div className="w-10 h-10 rounded-full border-2 border-dashed border-primary animate-wash-spin"></div>
                          <span className="absolute text-sm">🧼</span>
                        </div>
                      )}
                      {idx === 2 && ( // Drying animation
                        <div className="w-12 h-12 rounded-full border border-sky-200 bg-white flex items-center justify-center relative overflow-hidden shadow-clay-sm flex-shrink-0">
                          <div className="w-10 h-10 rounded-full border-2 border-dashed border-amber-500 animate-spin-slow"></div>
                          <span className="absolute text-sm">☀️</span>
                        </div>
                      )}
                      {idx === 3 && ( // Ironing animation
                        <div className="w-12 h-12 rounded-full border border-sky-200 bg-white flex items-center justify-center relative overflow-hidden shadow-clay-sm flex-shrink-0">
                          <div className="w-10 h-10 rounded-full border-2 border-dashed border-indigo-500 animate-bounce-slow"></div>
                          <span className="absolute text-sm">🔌</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details Specification */}
        <div className="bg-white p-6 sm:p-8 border border-slate-150/70 rounded-3xl shadow-soft space-y-4">
          <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Rincian Paket & Biaya</h3>
          
          <div className="space-y-3.5 text-xs sm:text-sm text-slate-600 font-semibold divide-y divide-slate-100">
            <div className="flex justify-between items-center pb-2">
              <span className="text-slate-400">Layanan</span>
              <span className="text-slate-850 font-black">{order.serviceName}</span>
            </div>
            <div className="flex justify-between items-center pt-3 pb-2">
              <span className="text-slate-400">Beban / Jumlah</span>
              <span className="text-slate-850 font-black">{order.amount} {order.unit}</span>
            </div>
            <div className="flex justify-between items-center pt-3 pb-2">
              <span className="text-slate-400">Metode Pembayaran</span>
              <span className="text-slate-850 font-black">{order.paymentMethod || 'Wallet'}</span>
            </div>
            <div className="flex justify-between items-center pt-3 pb-2">
              <span className="text-slate-400">Estimasi Selesai (ETA)</span>
              <span className="text-primary font-black">{order.eta}</span>
            </div>
            <div className="flex justify-between items-start pt-3">
              <span className="text-slate-400">Catatan Khusus</span>
              <span className="text-slate-850 text-right max-w-[220px] font-bold leading-relaxed">{order.notes || 'Tidak ada'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Actions */}
      <div className="sticky bottom-0 left-0 right-0 p-4 sm:p-5 bg-white border-t border-slate-200/80 shadow-soft-lg z-30 space-y-2">
        <div className="max-w-2xl mx-auto w-full flex flex-col sm:flex-row gap-2.5">
          <a 
            href={getWhatsAppShareUrl(order)} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all text-center shadow-clay-sm"
          >
            <MessageCircle className="w-4 h-4 text-white fill-current" />
            <span>Bagikan Nota ke WhatsApp</span>
          </a>
          
          <div className="flex gap-2">
            <a 
              href={getWhatsAppChatUrl('081234567890', `Halo CS LaundryKu, saya ingin tanya pesanan saya dengan No. Invoice: ${order.id}`)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 sm:flex-none px-5 py-3.5 bg-sky-50 text-sky-700 hover:bg-sky-100 font-black text-xs sm:text-sm rounded-2xl flex items-center justify-center gap-2 transition-all border border-sky-200"
            >
              <Phone className="w-4 h-4 text-sky-600" />
              <span>Chat CS</span>
            </a>
            <button
              onClick={() => onNavigate('home')}
              className="px-5 py-3.5 border border-slate-200 text-slate-700 font-black text-xs sm:text-sm rounded-2xl hover:bg-slate-50 transition-all"
            >
              Beranda
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: GARMENT PHOTO AUDIT */}
      <GarmentPhotoModal
        order={order}
        isOpen={showPhotoModal}
        onClose={() => setShowPhotoModal(false)}
      />

      {/* MODAL: RATING PESANAN */}
      <RatingModal
        order={order}
        isOpen={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        onSubmitReview={(rev) => {
          onSubmitReview?.(rev);
        }}
      />
    </div>
  );
}
