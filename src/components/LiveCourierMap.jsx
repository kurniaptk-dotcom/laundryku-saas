import React, { useState, useEffect } from 'react';
import { Truck, MapPin, Phone, MessageCircle, Navigation, Clock, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { getWhatsAppChatUrl } from '../utils/whatsappHelper';

export default function LiveCourierMap({
  order,
  courier = { name: 'Doni Pratama', phone: '0812-9988-7711', vehicle: 'Honda Vario B 4821 TZX', rating: '4.9' }
}) {
  const [courierProgress, setCourierProgress] = useState(35); // 0 to 100%
  const [etaMinutes, setEtaMinutes] = useState(12);

  // Simulated GPS Courier movement
  useEffect(() => {
    const interval = setInterval(() => {
      setCourierProgress(prev => {
        if (prev >= 88) return 20; // Loop simulation
        return prev + 2;
      });
      setEtaMinutes(prev => Math.max(3, prev > 3 ? prev - 1 : 12));
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  const courierName = order?.courierName || courier?.name || 'Doni Pratama';
  const courierPhone = order?.courierPhone || courier?.phone || '0812-9988-7711';
  const customerAddress = order?.customerAddress || 'Jalan Cempaka Putih Raya No. 42A, Jakarta Pusat';

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-soft overflow-hidden space-y-4">
      {/* Map Header Status */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
          <div>
            <span className="text-[10px] font-black text-emerald-400 uppercase tracking-wider">GPS Live Tracking</span>
            <h4 className="text-xs sm:text-sm font-black">Kurir Sedang Menuju Lokasi Anda</h4>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold text-slate-300">Estimasi Tiba:</span>
          <p className="text-sm font-black text-amber-300">~{etaMinutes} Menit</p>
        </div>
      </div>

      {/* Simulated Visual Vector Map */}
      <div className="relative h-56 bg-slate-100 overflow-hidden mx-4 rounded-2xl border border-slate-200 shadow-inner">
        {/* Map Grid Roads */}
        <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#94a3b8_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Simulated Road Paths */}
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 40 160 Q 140 180 180 110 T 320 60"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="M 40 160 Q 140 180 180 110 T 320 60"
            fill="none"
            stroke="#0284c7"
            strokeWidth="4"
            strokeDasharray="6 6"
            className="animate-pulse"
          />
        </svg>

        {/* 1. Point A: Laundry Outlet Hub */}
        <div className="absolute left-6 bottom-6 flex flex-col items-center">
          <div className="w-9 h-9 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-base shadow-lg ring-4 ring-white">
            🧼
          </div>
          <span className="mt-1 px-2 py-0.5 bg-white text-[9px] font-black text-slate-800 rounded-md shadow-xs border border-slate-200">
            Gerai LaundryKu
          </span>
        </div>

        {/* 2. Point B: Customer Destination */}
        <div className="absolute right-6 top-5 flex flex-col items-center">
          <div className="w-9 h-9 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-lg ring-4 ring-white animate-bounce">
            <MapPin className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="mt-1 px-2 py-0.5 bg-white text-[9px] font-black text-slate-800 rounded-md shadow-xs border border-slate-200">
            Rumah Anda
          </span>
        </div>

        {/* 3. Moving Courier Marker */}
        <div 
          className="absolute transition-all duration-1000 ease-linear flex flex-col items-center z-10"
          style={{ 
            left: `${Math.min(78, Math.max(16, courierProgress))}%`,
            top: `${Math.min(70, Math.max(25, 80 - courierProgress * 0.7))}%` 
          }}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center shadow-xl ring-4 ring-sky-300 animate-pulse">
            <Truck className="w-5 h-5 stroke-[2.5]" />
          </div>
          <span className="mt-0.5 px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded-full shadow-md whitespace-nowrap">
            🏍️ {courierName.split(' ')[0]} (28 Km/h)
          </span>
        </div>

        {/* Radar Floating Info Badge */}
        <div className="absolute left-3 top-3 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 text-[10px] font-bold text-slate-700">
          <Navigation className="w-3 h-3 text-primary animate-spin" />
          <span>Jarak: <strong>1.8 Km</strong></span>
        </div>
      </div>

      {/* Courier Profile & 1-Click Contacts */}
      <div className="p-4 pt-0">
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-clay-sm">
              {courierName.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h5 className="text-xs sm:text-sm font-black text-slate-850">{courierName}</h5>
                <span className="text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                  ⭐ 4.9
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-semibold">{courier?.vehicle || 'Honda Vario B 4821 TZX'}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`tel:${courierPhone.replace(/[^\d]/g, '')}`}
              className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-all shadow-xs"
              title="Telepon Kurir"
            >
              <Phone className="w-4 h-4 text-primary" />
            </a>
            <a
              href={getWhatsAppChatUrl(courierPhone, `Halo Mas ${courierName}, saya ingin menanyakan terkait penjemputan/pengantaran laundry untuk order #${order?.id || ''}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs shadow-xs flex items-center gap-1.5 transition-all"
              title="Chat WhatsApp Kurir"
            >
              <MessageCircle className="w-4 h-4 fill-current" />
              <span className="hidden sm:inline">Chat WA</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
