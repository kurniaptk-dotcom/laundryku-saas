import React, { useState } from 'react';
import { ArrowLeft, Check, Info, FileText } from 'lucide-react';

export default function CreateOrder({ 
  walletBalance, 
  onAddOrder, 
  onNavigate, 
  onTopUpClick 
}) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState('cuci_setrika');
  const [bagCount, setBagCount] = useState(1);
  const [notes, setNotes] = useState('');
  
  // Date and Time selectors
  const [selectedDate, setSelectedDate] = useState('Hari ini');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 - 12:00');
  
  const services = [
    { id: 'cuci_setrika', name: 'Cuci & Setrika', price: 12000, unit: 'Kg', icon: '🧼' },
    { id: 'cuci_kering', name: 'Cuci Kering', price: 18000, unit: 'Kg', icon: '👕' },
    { id: 'setrika_saja', name: 'Setrika Saja', price: 6000, unit: 'Kg', icon: '🔌' },
    { id: 'bed_cover', name: 'Bed Cover', price: 25000, unit: 'Pc', icon: '🛏️' },
    { id: 'sepatu', name: 'Sepatu', price: 20000, unit: 'Pasang', icon: '👟' }
  ];

  const serviceMap = services.reduce((acc, s) => ({ ...acc, [s.id]: s }), {});
  const currentService = serviceMap[selectedService];

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      // Create order request object (unweighed)
      const today = new Date();
      const invoiceId = `INV-${today.getFullYear().toString().slice(-2)}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
      const orderTimeStr = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(today);

      const newOrder = {
        id: invoiceId,
        serviceName: currentService.name,
        type: currentService.unit.toLowerCase(),
        amount: 0, // 0 means pending cashier weight input!
        unit: currentService.unit,
        status: 'pending_pickup', // Starts as pending pickup!
        orderTime: orderTimeStr,
        statusTime: orderTimeStr,
        eta: 'Menunggu timbangan',
        notes: notes || 'Tidak ada',
        totalPrice: 0, // Calculated after weighing
        paymentStatus: 'Unpaid',
        paymentMethod: null,
        bagCount: bagCount
      };

      onAddOrder(newOrder);
      onNavigate('home');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      onNavigate('home');
    }
  };

  const dates = ['Hari ini', 'Besok', 'Lusa'];
  const times = ['08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '16:00 - 18:00'];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Top Header */}
      <div className="flex items-center px-4 pt-6 pb-4 bg-white border-b border-slate-100">
        <button 
          onClick={handleBack}
          className="p-2 text-slate-700 hover:bg-slate-100 rounded-full transition-colors mr-2"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>
        <h2 className="text-base font-extrabold text-slate-850">Buat Pesanan</h2>
      </div>

      {/* Progress Indicator */}
      <div className="bg-white px-5 py-4 border-b border-slate-100 shadow-soft">
        <div className="flex justify-between items-center max-w-sm mx-auto relative">
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-100 -z-10">
            <div 
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>

          {[
            { label: 'Layanan', stepNo: 1 },
            { label: 'Detail', stepNo: 2 },
            { label: 'Jadwal', stepNo: 3 },
            { label: 'Konfirmasi', stepNo: 4 }
          ].map((item) => (
            <div key={item.stepNo} className="flex flex-col items-center z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                step >= item.stepNo 
                  ? 'border-primary bg-primary text-white' 
                  : 'border-slate-200 bg-white text-slate-400'
              }`}>
                {step > item.stepNo ? <Check className="w-4 h-4 stroke-[3]" /> : item.stepNo}
              </div>
              <span className={`text-[10px] font-black mt-1 ${
                step >= item.stepNo ? 'text-primary' : 'text-slate-400'
              }`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5 pb-24 space-y-4">
        {step === 1 && (
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">Pilih Layanan Utama</h3>
            <div className="space-y-3">
              {services.map((service) => (
                <label 
                  key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={`flex items-center justify-between p-4 bg-white border-2 rounded-2.5xl cursor-pointer transition-all ${
                    selectedService === service.id 
                      ? 'border-primary ring-2 ring-primary/5 shadow-soft' 
                      : 'border-slate-100 hover:border-slate-200 shadow-soft'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 text-2xl flex items-center justify-center shadow-clay-sm">
                      {service.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800">{service.name}</h4>
                      <p className="text-xs font-semibold text-slate-400 mt-0.5">Penimbangan oleh Kasir</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-slate-500">
                      Rp {service.price.toLocaleString('id-ID')} / {service.unit}
                    </span>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      selectedService === service.id ? 'border-primary bg-primary text-white' : 'border-slate-350'
                    }`}>
                      {selectedService === service.id && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-white p-5 border border-slate-150/70 rounded-3xl shadow-soft space-y-4">
              <div className="text-center space-y-1.5">
                <span className="text-4xl">📦</span>
                <h4 className="text-sm font-extrabold text-slate-800">Estimasi Jumlah Tas / Kantong</h4>
                <p className="text-xs text-slate-400 font-semibold">Berapa kantong pakaian yang ingin diserahkan ke kurir?</p>
              </div>

              {/* Bag Counter Widget */}
              <div className="flex items-center justify-center gap-6 py-2">
                <button 
                  onClick={() => setBagCount(Math.max(1, bagCount - 1))}
                  className="w-11 h-11 bg-slate-50 border border-slate-100 hover:bg-slate-100 active:scale-95 text-slate-750 font-black rounded-2xl flex items-center justify-center transition-all shadow-clay-sm"
                >
                  -
                </button>
                <div className="flex items-baseline gap-1 text-slate-800">
                  <span className="text-3xl font-black">{bagCount}</span>
                  <span className="text-xs font-extrabold text-slate-450">Kantong</span>
                </div>
                <button 
                  onClick={() => setBagCount(bagCount + 1)}
                  className="w-11 h-11 bg-slate-50 border border-slate-100 hover:bg-slate-100 active:scale-95 text-slate-750 font-black rounded-2xl flex items-center justify-center transition-all shadow-clay-sm"
                >
                  +
                </button>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 tracking-wider uppercase">Catatan Khusus untuk Kasir</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Tulis instruksi pencucian (misal: pisahkan baju putih, cuci kering jas hitam, setrika lipat saja)."
                rows="3"
                className="w-full p-4 bg-white border-2 border-slate-100 focus:border-primary focus:outline-none rounded-2.5xl font-semibold text-slate-750 shadow-soft placeholder-slate-350"
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5">
            {/* Pick up date */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 tracking-wider uppercase">Hari Penjemputan Kurir</label>
              <div className="grid grid-cols-3 gap-3">
                {dates.map((date) => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`py-3 px-4 rounded-2.5xl font-bold text-sm border-2 transition-all shadow-soft ${
                      selectedDate === date
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-100 bg-white text-slate-600'
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 tracking-wider uppercase">Slot Waktu Jemput</label>
              <div className="grid grid-cols-2 gap-3">
                {times.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTimeSlot(time)}
                    className={`py-3.5 px-4 rounded-2.5xl font-bold text-xs border-2 transition-all shadow-soft ${
                      selectedTimeSlot === time
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-slate-100 bg-white text-slate-650'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Address Banner */}
            <div className="p-4 bg-sky-50 rounded-2.5xl border border-sky-100/50 flex items-start gap-3">
              <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h5 className="text-[11px] font-extrabold text-slate-800 uppercase">Alamat Penjemputan</h5>
                <p className="text-xs text-slate-500 font-semibold mt-0.5 leading-relaxed">Jalan Cempaka Putih Raya No. 42A, Jakarta Pusat (Rumah Pagar Hitam)</p>
              </div>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">Konfirmasi Penjemputan</h3>
            
            {/* Spec Card */}
            <div className="bg-white p-5 border border-slate-100 rounded-3xl shadow-soft space-y-4">
              <div className="flex items-center gap-3.5 pb-4 border-b border-slate-50">
                <span className="text-3xl">{currentService.icon}</span>
                <div>
                  <h4 className="text-sm font-extrabold text-slate-850">{currentService.name}</h4>
                  <p className="text-xs font-semibold text-slate-450 mt-0.5">Estimasi: {bagCount} Kantong Pakaian</p>
                </div>
              </div>

              {/* Schedule and Notes */}
              <div className="space-y-2.5 text-xs text-slate-600 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-450">Jadwal Jemput</span>
                  <span className="text-slate-750 font-bold">{selectedDate}, {selectedTimeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-450">Catatan Kasir</span>
                  <span className="text-slate-750 text-right max-w-[170px] leading-relaxed break-words">{notes || 'Tidak ada'}</span>
                </div>
              </div>
            </div>

            {/* Smartlink Info Banner */}
            <div className="p-4 bg-sky-50 border border-sky-100 rounded-3xl flex gap-3">
              <FileText className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h5 className="text-[11px] font-black text-slate-800 uppercase tracking-wide">Alur Nota Digital Smartlink</h5>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">
                  Setelah kurir mengambil laundry dan membawanya ke outlet, kasir akan melakukan penimbangan yang akurat. Nota tagihan digital akan langsung dikirimkan ke WhatsApp Anda.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Footer CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 shadow-soft-lg z-30">
        <button
          onClick={handleNext}
          className="w-full py-4 text-white font-extrabold text-sm rounded-2xl text-center shadow-clay-sm transition-all clay-button hover:opacity-95 text-center block"
        >
          {step === 4 ? 'Kirim Kurir Sekarang' : 'Lanjutkan'}
        </button>
      </div>
    </div>
  );
}
