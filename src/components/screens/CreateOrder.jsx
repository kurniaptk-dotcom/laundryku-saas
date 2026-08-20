import React, { useState } from 'react';
import { 
  ArrowLeft, ChevronRight, Check, Minus, Plus, Info, 
  Clock, Calendar, MapPin, Wallet, Calculator, Sparkles, X,
  CreditCard, QrCode, Banknote, ShieldCheck, Award, Package
} from 'lucide-react';
import ServiceIcon from '../ServiceIcon';
import { calculateTier, calculateTierDiscount } from '../../utils/tierHelper';
import { isSubscriptionActive } from '../../utils/subscriptionHelper';

export default function CreateOrder({ 
  currentCustomer = { id: 'CUST-001', name: 'Aisyah Salsabila', phone: '0812-3456-7890', address: 'Jalan Cempaka Putih Raya No. 42A, Jakarta Pusat', totalSpent: 1450000 },
  walletBalance = 125000, 
  onAddOrder, 
  onNavigate, 
  onTopUpClick,
  services = []
}) {
  const defaultServices = [
    { id: 'cuci_setrika', name: 'Cuci & Setrika', price: 12000, unit: 'Kg', desc: 'Cuci bersih higienis, plus setrika licin dan wangi', icon: '🧼' },
    { id: 'cuci_kering', name: 'Cuci Kering', price: 18000, unit: 'Kg', desc: 'Cuci higienis tanpa setrika, siap langsung pakai', icon: '👕' },
    { id: 'setrika_saja', name: 'Setrika Saja', price: 6000, unit: 'Kg', desc: 'Hanya setrika licin rapi & parfum ekstra tahan lama', icon: '🔌' },
    { id: 'bed_cover', name: 'Bed Cover / Selimut', price: 25000, unit: 'Pc', desc: 'Pencucian khusus bahan tebal dan lembut berbulu', icon: '🛏️' },
    { id: 'sepatu', name: 'Deep Clean Sepatu', price: 20000, unit: 'Pasang', desc: 'Pembersihan mendalam sol, upper, dan anti-jamur', icon: '👟' }
  ];

  const activeServiceList = services.length > 0 ? services : defaultServices;
  const [step, setStep] = useState(1);
  const [fulfillmentType, setFulfillmentType] = useState('delivery'); // 'delivery' (Kurir Jemput) | 'dropoff' (Antar ke Toko)
  const [selectedService, setSelectedService] = useState(activeServiceList[0]?.id || 'cuci_setrika');
  const [quantity, setQuantity] = useState(5);
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Wallet'); // Wallet, QRIS, COD
  
  // Date and Time selectors
  const [selectedDate, setSelectedDate] = useState('Hari ini');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('10:00 - 12:00');

  // Weight Estimator Tool State
  const [showEstimator, setShowEstimator] = useState(false);
  const [estimatorItems, setEstimatorItems] = useState({
    kaos: 5,        // 0.2 kg
    jeans: 2,       // 0.6 kg
    kemeja: 2,      // 0.25 kg
    handuk: 2,      // 0.5 kg
    sprei: 1,       // 1.2 kg
    jaket: 1        // 0.8 kg
  });

  const calculateEstimatedWeight = () => {
    const total = 
      (estimatorItems.kaos * 0.2) +
      (estimatorItems.jeans * 0.6) +
      (estimatorItems.kemeja * 0.25) +
      (estimatorItems.handuk * 0.5) +
      (estimatorItems.sprei * 1.2) +
      (estimatorItems.jaket * 0.8);
    return Math.max(1, Math.round(total));
  };

  const applyEstimatedWeight = () => {
    setQuantity(calculateEstimatedWeight());
    setShowEstimator(false);
  };

  const currentService = activeServiceList.find(s => s.id === selectedService) || activeServiceList[0];

  // Subscription & Tier-based Pricing calculations
  const sub = currentCustomer?.subscription;
  const hasActiveSub = isSubscriptionActive(sub) && currentService?.unit === 'Kg' && (sub?.remainingKg || 0) >= quantity;

  const currentTier = calculateTier(currentCustomer?.totalSpent || 0);
  const subtotal = (currentService?.price || 12000) * quantity;
  const isDeliveryFree = fulfillmentType === 'dropoff' || currentTier.id === 'gold' || currentTier.id === 'platinum' || paymentMethod === 'Subscription';
  const deliveryFee = fulfillmentType === 'dropoff' ? 0 : isDeliveryFree ? 0 : 5000;
  const tierDiscountInfo = calculateTierDiscount(subtotal, currentCustomer?.totalSpent || 0);
  const tierDiscount = paymentMethod === 'Subscription' ? subtotal : tierDiscountInfo.discountAmount;
  const total = paymentMethod === 'Subscription' ? 0 : Math.max(0, subtotal + deliveryFee - tierDiscount);
  const pointsReward = paymentMethod === 'Subscription' ? 50 : Math.floor((total / 1000) * (currentTier.pointMultiplier || 1));

  const canProceedPayment = 
    paymentMethod === 'Subscription' 
      ? hasActiveSub 
      : paymentMethod !== 'Wallet' || walletBalance >= total;

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      if (!canProceedPayment) {
        alert('Saldo Wallet Anda tidak mencukupi. Silakan Top Up atau pilih metode bayar QRIS / Tunai.');
        return;
      }

      // Create order object
      const today = new Date();
      const invoiceId = `INV-${today.getFullYear().toString().slice(-2)}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
      
      const newOrder = {
        id: invoiceId,
        customerId: currentCustomer?.id || 'CUST-001',
        customerName: currentCustomer?.name || 'Aisyah Salsabila',
        customerPhone: currentCustomer?.phone || '0812-3456-7890',
        customerAddress: currentCustomer?.address || 'Jalan Cempaka Putih Raya No. 42A, Jakarta Pusat',
        serviceName: currentService.name,
        type: currentService.unit.toLowerCase(),
        amount: quantity,
        unit: currentService.unit,
        status: 'received',
        fulfillmentType: fulfillmentType, // 'delivery' | 'dropoff'
        courierName: fulfillmentType === 'dropoff' ? 'Drop-Off di Gerai' : 'Doni Pratama (Kurir)',
        paymentMethod: paymentMethod,
        orderTime: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(today),
        statusTime: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(today),
        eta: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(today.getTime() + 24 * 60 * 60 * 1000)) + ', 15:00',
        notes: notes || (fulfillmentType === 'dropoff' ? 'Drop-Off langsung di Gerai' : 'Jemput di rumah'),
        totalPrice: total
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

  const [serviceCategory, setServiceCategory] = useState('all'); // all, kiloan, satuan, special
  const [serviceSearch, setServiceSearch] = useState('');

  // Filter services by category & search
  const filteredServices = activeServiceList.filter(s => {
    let matchCat = true;
    if (serviceCategory === 'kiloan') matchCat = s.unit === 'Kg' && s.id !== 'setrika_saja';
    else if (serviceCategory === 'satuan') matchCat = s.id === 'setrika_saja' || s.unit === 'Pcs';
    else if (serviceCategory === 'special') matchCat = s.unit === 'Pc' || s.unit === 'Pasang' || s.id === 'bed_cover' || s.id === 'sepatu';
    
    const matchSearch = s.name.toLowerCase().includes(serviceSearch.toLowerCase()) || s.desc.toLowerCase().includes(serviceSearch.toLowerCase());
    return matchCat && matchSearch;
  });

  const getServiceBadge = (id) => {
    switch (id) {
      case 'cuci_setrika': return { label: '🔥 Terfavorit', time: '⏱️ 24 Jam', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'cuci_kering': return { label: '⚡ Cepat Kering', time: '⏱️ 12 Jam', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'setrika_saja': return { label: '🔌 Setrika Uap', time: '⏱️ 6 Jam', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
      case 'bed_cover': return { label: '🛏️ Anti Tungau', time: '⏱️ 2 Hari', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'sepatu': return { label: '👟 Deep Clean Sol', time: '⏱️ 2 Hari', color: 'bg-teal-50 text-teal-700 border-teal-200' };
      default: return { label: '✨ Higienis', time: '⏱️ 1-2 Hari', color: 'bg-sky-50 text-sky-700 border-sky-200' };
    }
  };

  const dates = ['Hari ini', 'Besok', 'Lusa'];
  const times = ['08:00 - 10:00', '10:00 - 12:00', '13:00 - 15:00', '16:00 - 18:00'];
  const quickWeightPresets = [3, 5, 7, 10];

  return (
    <div className="flex flex-col h-full bg-slate-50 relative overflow-hidden">
      {/* Top Header App Bar */}
      <div className="flex items-center justify-between px-5 sm:px-6 pt-5 pb-4 bg-white border-b border-slate-100 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <button 
            onClick={handleBack}
            className="p-2.5 text-slate-700 hover:bg-slate-100 rounded-2xl transition-colors focus:outline-none border border-slate-200"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div>
            <h2 className="text-base sm:text-lg font-black text-slate-850">Buat Pesanan Laundry</h2>
            <p className="text-xs text-slate-400 font-semibold">
              Langkah {step} dari 4: {step === 1 ? 'Pilih Layanan' : step === 2 ? 'Kuantitas & Catatan' : step === 3 ? 'Waktu Penjemputan' : 'Konfirmasi & Bayar'}
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-sky-50 text-primary rounded-xl font-bold text-xs border border-sky-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Antar Jemput Gratis</span>
        </span>
      </div>

      {/* Progress Stepper Indicator */}
      <div className="bg-white px-6 py-4 border-b border-slate-150 shadow-soft">
        <div className="flex justify-between items-center max-w-xl mx-auto relative">
          {/* Connector Line */}
          <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 -z-10 rounded-full">
            <div 
              className="h-full bg-gradient-to-r from-primary to-indigo-600 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            ></div>
          </div>

          {[
            { label: 'Layanan', stepNo: 1 },
            { label: 'Detail', stepNo: 2 },
            { label: 'Jadwal', stepNo: 3 },
            { label: 'Bayar', stepNo: 4 }
          ].map((item) => (
            <div key={item.stepNo} className="flex flex-col items-center z-10">
              <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-xs border-2 transition-all ${
                step >= item.stepNo 
                  ? 'border-primary bg-gradient-to-tr from-primary to-indigo-600 text-white shadow-clay-sm scale-105' 
                  : 'border-slate-200 bg-white text-slate-400'
              }`}>
                {step > item.stepNo ? <Check className="w-4 h-4 stroke-[3]" /> : item.stepNo}
              </div>
              <span className={`text-[11px] font-black mt-1.5 ${
                step >= item.stepNo ? 'text-primary' : 'text-slate-400'
              }`}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4 sm:p-6 md:p-8 pb-36 space-y-5 max-w-2xl mx-auto w-full">
        {/* STEP 1: PILIH METODE PENYERAHAN & LAYANAN */}
        {step === 1 && (
          <div className="space-y-4">
            {/* Fulfillment Selector (Kurir Jemput vs Drop-off Gerai) */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 tracking-wider uppercase">Metode Penyerahan Cucian</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFulfillmentType('delivery')}
                  className={`p-3.5 sm:p-4 rounded-3xl border-2 transition-all flex flex-col items-center sm:items-start text-center sm:text-left gap-2 ${
                    fulfillmentType === 'delivery'
                      ? 'border-primary bg-sky-50/70 ring-4 ring-primary/10 shadow-clay-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl text-base ${fulfillmentType === 'delivery' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}>
                      🚚
                    </div>
                    <span className="text-xs font-black text-slate-900">Kurir Jemput</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Dijemput langsung ke alamat rumah Anda
                  </p>
                  <span className="text-[9px] font-bold text-primary bg-sky-100/60 px-2 py-0.5 rounded-full mt-0.5">
                    {isDeliveryFree ? '✓ Gratis Ongkir' : 'Ongkir Rp 5.000'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setFulfillmentType('dropoff')}
                  className={`p-3.5 sm:p-4 rounded-3xl border-2 transition-all flex flex-col items-center sm:items-start text-center sm:text-left gap-2 ${
                    fulfillmentType === 'dropoff'
                      ? 'border-primary bg-sky-50/70 ring-4 ring-primary/10 shadow-clay-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-xl text-base ${fulfillmentType === 'dropoff' ? 'bg-primary text-white' : 'bg-slate-100 text-slate-700'}`}>
                      🏬
                    </div>
                    <span className="text-xs font-black text-slate-900">Drop-Off di Gerai</span>
                  </div>
                  <p className="text-[10px] text-slate-500 font-semibold">
                    Bawa cucian mandiri ke toko laundry
                  </p>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full mt-0.5">
                    ✓ Hemat 100% (Rp 0)
                  </span>
                </button>
              </div>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex bg-slate-200/80 p-1.5 rounded-2.5xl gap-1 overflow-x-auto no-scrollbar">
              {[
                { id: 'all', label: '✨ Semua' },
                { id: 'kiloan', label: '🧺 Kiloan Harian' },
                { id: 'satuan', label: '🔌 Setrika Saja' },
                { id: 'special', label: '🛏️ Bed Cover & Sepatu' },
              ].map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setServiceCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex-1 text-center ${
                    serviceCategory === cat.id
                      ? 'bg-white text-primary shadow-soft'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">Pilih Layanan Laundry</h3>
              <span className="text-xs text-primary font-bold">Tarif Resmi & Higienis</span>
            </div>

            {/* Service Cards List */}
            <div className="space-y-3">
              {filteredServices.map((service) => {
                const isSelected = selectedService === service.id;
                const badge = getServiceBadge(service.id);
                return (
                  <div 
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`p-4 sm:p-5 bg-white border-2 rounded-3xl cursor-pointer transition-all duration-200 flex flex-col gap-3 group ${
                      isSelected 
                        ? 'border-primary ring-4 ring-primary/10 shadow-clay-sm bg-gradient-to-r from-sky-50/50 to-white' 
                        : 'border-slate-200/80 hover:border-slate-300 shadow-soft hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3.5">
                        <ServiceIcon
                          serviceId={service.id}
                          name={service.name}
                          fallbackIcon={service.icon}
                          size="md"
                        />
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-sm sm:text-base font-black text-slate-850">{service.name}</h4>
                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-black border ${badge.color}`}>
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-xs font-medium text-slate-400 mt-0.5 leading-relaxed">{service.desc}</p>
                        </div>
                      </div>

                      {/* Radio Selector */}
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                        isSelected ? 'border-primary bg-primary text-white shadow-xs' : 'border-slate-300 bg-slate-50'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </div>

                    {/* Card Footer: Price & SLA */}
                    <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[11px] font-bold text-slate-400">
                        {badge.time}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm sm:text-base font-black text-primary whitespace-nowrap">
                          Rp {service.price.toLocaleString('id-ID')}
                        </span>
                        <span className="text-[11px] font-bold text-slate-400">/{service.unit}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2: DETAIL BERAT & KUANTITAS */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="bg-white p-6 sm:p-8 border border-slate-150/70 rounded-3xl shadow-soft space-y-5 text-center">
              <div className="space-y-3 flex flex-col items-center">
                <ServiceIcon
                  serviceId={currentService?.id}
                  name={currentService?.name}
                  fallbackIcon={currentService?.icon}
                  size="lg"
                  className="mx-auto"
                />
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-slate-850">{currentService?.name}</h4>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Tentukan estimasi jumlah cucian Anda</p>
                </div>
              </div>

              {/* Counter Widget */}
              <div className="flex items-center justify-center gap-6 sm:gap-8 py-2">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-13 h-13 sm:w-14 sm:h-14 bg-slate-50 border border-slate-200 hover:bg-slate-100 active:scale-95 text-slate-750 font-black rounded-2xl flex items-center justify-center transition-all shadow-clay-sm text-lg"
                >
                  <Minus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                </button>
                <div className="flex items-baseline gap-1 text-slate-900">
                  <span className="text-4xl sm:text-5xl font-black tracking-tight">{quantity}</span>
                  <span className="text-sm sm:text-base font-extrabold text-slate-450">{currentService?.unit}</span>
                </div>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-13 h-13 sm:w-14 sm:h-14 bg-slate-50 border border-slate-200 hover:bg-slate-100 active:scale-95 text-slate-750 font-black rounded-2xl flex items-center justify-center transition-all shadow-clay-sm text-lg"
                >
                  <Plus className="w-5 h-5 sm:w-6 sm:h-6 stroke-[3]" />
                </button>
              </div>

              {/* Quick Preset Buttons */}
              <div className="flex justify-center gap-2 pt-1 flex-wrap">
                {quickWeightPresets.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setQuantity(val)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      quantity === val ? 'bg-primary text-white shadow-clay-sm' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {val} {currentService?.unit}
                  </button>
                ))}
              </div>

              {/* Weight Estimator Tool Button */}
              {currentService?.unit === 'Kg' && (
                <div className="pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowEstimator(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-primary font-black text-xs rounded-2xl border border-sky-100 transition-all active:scale-95"
                  >
                    <Calculator className="w-4 h-4 text-primary" />
                    <span>Bingung Berapa Kg? Buka Kalkulator Estimasi Pakaian</span>
                  </button>
                </div>
              )}

              <div className="p-3 bg-sky-50/70 rounded-2xl border border-sky-100 text-xs text-primary font-bold">
                Estimasi Subtotal: <strong>Rp {subtotal.toLocaleString('id-ID')}</strong>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 tracking-wider uppercase">Catatan Khusus Pencucian</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: Pisahkan pakaian putih, gunakan pewangi lavender extra, setrika licin rapi..."
                rows="3"
                className="w-full p-4 bg-white border-2 border-slate-150 focus:border-primary focus:outline-none rounded-3xl font-semibold text-xs sm:text-sm text-slate-750 shadow-soft placeholder-slate-400 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* STEP 3: JADWAL & ALAMAT / GERAI */}
        {step === 3 && (
          <div className="space-y-5">
            {/* Pick up / Drop off date */}
            <div className="space-y-2.5">
              <label className="text-xs font-black text-slate-400 tracking-wider uppercase">
                {fulfillmentType === 'delivery' ? 'Pilih Hari Penjemputan Kurir' : 'Pilih Hari Drop-Off ke Gerai'}
              </label>
              <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                {dates.map((date) => (
                  <button
                    key={date}
                    type="button"
                    onClick={() => setSelectedDate(date)}
                    className={`py-3.5 px-3 rounded-2.5xl font-extrabold text-xs sm:text-sm border-2 transition-all shadow-soft ${
                      selectedDate === date
                        ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/10 font-black'
                        : 'border-slate-150 bg-white text-slate-650 hover:border-slate-300'
                    }`}
                  >
                    {date}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="space-y-2.5">
              <label className="text-xs font-black text-slate-400 tracking-wider uppercase">
                {fulfillmentType === 'delivery' ? 'Slot Jam Kurir Datang ke Rumah' : 'Estimasi Jam Datang ke Toko'}
              </label>
              <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                {times.map((time) => (
                  <button
                    key={time}
                    type="button"
                    onClick={() => setSelectedTimeSlot(time)}
                    className={`py-3.5 px-3 rounded-2.5xl font-bold text-xs sm:text-sm border-2 transition-all shadow-soft ${
                      selectedTimeSlot === time
                        ? 'border-primary bg-primary/5 text-primary ring-2 ring-primary/10 font-black'
                        : 'border-slate-150 bg-white text-slate-650 hover:border-slate-300'
                    }`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Location Banner (Customer Home or Outlet Hub) */}
            {fulfillmentType === 'delivery' ? (
              <div className="p-4 sm:p-5 bg-sky-50 rounded-3xl border border-sky-100 flex items-start gap-3.5 shadow-soft">
                <div className="p-3 bg-white text-primary rounded-2xl shadow-clay-sm flex-shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h5 className="text-xs font-black text-slate-850 uppercase tracking-wider">Alamat Penjemputan Pakaian</h5>
                  <p className="text-xs text-slate-600 font-semibold mt-1 leading-relaxed">
                    {currentCustomer?.address || 'Jalan Cempaka Putih Raya No. 42A, Jakarta Pusat'}
                  </p>
                  <span className="inline-block mt-1.5 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    📍 Kurir Menuju Alamat Anda
                  </span>
                </div>
              </div>
            ) : (
              <div className="p-4 sm:p-5 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-start gap-3.5 shadow-soft">
                <div className="p-3 bg-white text-emerald-600 rounded-2xl shadow-clay-sm flex-shrink-0 text-xl">
                  🏬
                </div>
                <div className="flex-1">
                  <h5 className="text-xs font-black text-slate-850 uppercase tracking-wider">Lokasi Gerai Drop-Off Laundry</h5>
                  <p className="text-xs text-slate-700 font-bold mt-1">
                    LaundryKu Hub Cempaka Putih Utama
                  </p>
                  <p className="text-[11px] text-slate-500 font-semibold mt-0.5 leading-relaxed">
                    Jl. Cempaka Putih Tengah No. 18, Jakarta Pusat (Samping Alfamidi)
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-black text-emerald-700 bg-white px-2 py-0.5 rounded-md border border-emerald-200">
                      ⏰ Buka: 07:00 - 22:00 WIB
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      Bisa drop langsung ke kasir
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: KONFIRMASI & PEMBAYARAN */}
        {step === 4 && (
          <div className="space-y-5">
            <h3 className="text-xs font-black text-slate-400 tracking-wider uppercase">Ringkasan Pesanan</h3>
            
            {/* Spec Card */}
            <div className="bg-white p-5 sm:p-6 border border-slate-150/70 rounded-3xl shadow-soft space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3.5">
                  <span className="text-3xl">{currentService?.icon}</span>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-slate-850">{currentService?.name}</h4>
                    <p className="text-xs font-semibold text-slate-400">{quantity} {currentService?.unit} @ Rp {currentService?.price.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-black text-slate-850">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 font-semibold">
                <div className="flex justify-between">
                  <span className="text-slate-400">Jadwal Pick Up</span>
                  <span className="text-slate-800 font-bold">{selectedDate}, {selectedTimeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Pemesan</span>
                  <span className="text-slate-800 font-bold">{currentCustomer.name}</span>
                </div>
              </div>
            </div>

            {/* Receipt Summary */}
            <div className="bg-white p-5 sm:p-6 border border-slate-150/70 rounded-3xl shadow-soft space-y-2.5">
              <div className="flex justify-between text-xs text-slate-600 font-semibold">
                <span>Subtotal Layanan ({quantity} {currentService?.unit})</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-600">Biaya Antar Jemput Kurir</span>
                {isDeliveryFree ? (
                  <span className="text-emerald-600 font-black">Gratis (VIP Perk)</span>
                ) : (
                  <span className="text-slate-800">Rp {deliveryFee.toLocaleString('id-ID')}</span>
                )}
              </div>

              {tierDiscount > 0 && (
                <div className="flex justify-between text-xs text-rose-500 font-black">
                  <span className="flex items-center gap-1">
                    <Award className="w-3.5 h-3.5" />
                    <span>Diskon {currentTier.name} (-{currentTier.discountPct}%)</span>
                  </span>
                  <span>-Rp {tierDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div className="h-px bg-slate-100 my-2"></div>

              <div className="flex justify-between items-baseline text-sm sm:text-base font-black text-slate-850">
                <span>Total Tagihan</span>
                <span className="text-primary text-lg sm:text-xl">Rp {total.toLocaleString('id-ID')}</span>
              </div>

              <div className="pt-2 border-t border-dashed border-slate-200 flex items-center justify-between text-[11px] font-bold text-amber-700 bg-amber-50/80 p-2.5 rounded-xl">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Bonus Poin ({currentTier.pointMultiplier}x Poin {currentTier.badge})</span>
                </span>
                <span className="font-black text-amber-800">+{pointsReward} Poin</span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="bg-white p-5 sm:p-6 border border-slate-150/70 rounded-3xl shadow-soft space-y-3">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Pilih Metode Pembayaran</h4>
              
              <div className="space-y-2">
                {/* Subscription Quota Option (If active & eligible) */}
                {isSubscriptionActive(sub) && currentService?.unit === 'Kg' && (
                  <div
                    onClick={() => setPaymentMethod('Subscription')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                      paymentMethod === 'Subscription'
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
                        <Package className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h5 className="text-xs font-black text-slate-850">Potong Kuota Langganan</h5>
                          <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-md">HEMAT 100%</span>
                        </div>
                        <p className="text-[11px] font-semibold text-slate-500">
                          Sisa Kuota: <strong className="text-indigo-700">{sub.remainingKg} Kg</strong> ({sub.planName})
                        </p>
                      </div>
                    </div>
                    {paymentMethod === 'Subscription' && <Check className="w-5 h-5 text-indigo-600 stroke-[3]" />}
                  </div>
                )}

                {[
                  { id: 'Wallet', label: 'Laundry Wallet', desc: `Sisa Saldo: Rp ${walletBalance.toLocaleString('id-ID')}`, icon: Wallet },
                  { id: 'QRIS', label: 'QRIS / E-Wallet Instant', desc: 'GoPay, OVO, Dana, ShopeePay, BCA', icon: QrCode },
                  { id: 'Tunai', label: 'Tunai saat Penjemputan', desc: 'Bayar langsung ke kurir saat jemput', icon: Banknote },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = paymentMethod === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setPaymentMethod(item.id)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        isSelected ? 'border-primary bg-primary/5 ring-2 ring-primary/10' : 'border-slate-150 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${isSelected ? 'bg-primary text-white' : 'bg-slate-100 text-slate-600'}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-850">{item.label}</p>
                          <p className="text-[10px] text-slate-400 font-semibold">{item.desc}</p>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                    </div>
                  );
                })}
              </div>

              {paymentMethod === 'Wallet' && walletBalance < total && (
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-2xl border border-amber-200 text-xs">
                  <span className="text-amber-800 font-bold">⚠️ Saldo Wallet kurang Rp {(total - walletBalance).toLocaleString('id-ID')}</span>
                  <button 
                    onClick={onTopUpClick}
                    className="text-xs font-black text-primary underline"
                  >
                    + Top Up Sekarang
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Footer CTA with Live Summary */}
      <div className="sticky bottom-0 left-0 right-0 p-4 sm:p-5 bg-white border-t border-slate-200/80 shadow-soft-lg z-30 space-y-3">
        {/* Step Summary Bar */}
        <div className="max-w-2xl mx-auto w-full flex items-center justify-between text-xs px-1">
          <div className="flex items-center gap-1.5 text-slate-500 font-semibold truncate">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
            {step === 1 && (
              <span>Layanan: <strong className="text-slate-900">{currentService.name}</strong></span>
            )}
            {step === 2 && (
              <span>Kuantitas: <strong className="text-slate-900">{quantity} {currentService.unit}</strong></span>
            )}
            {step === 3 && (
              <span>Jadwal: <strong className="text-slate-900">{selectedDate} ({selectedTimeSlot})</strong></span>
            )}
            {step === 4 && (
              <span>Metode: <strong className="text-slate-900">{paymentMethod}</strong></span>
            )}
          </div>

          <div className="text-right flex-shrink-0">
            {step === 1 ? (
              <span className="font-black text-primary text-sm">
                Rp {currentService.price.toLocaleString('id-ID')}/{currentService.unit}
              </span>
            ) : (
              <span className="font-black text-primary text-sm">
                {paymentMethod === 'Subscription' ? 'Rp 0 (Kuota)' : `Rp ${total.toLocaleString('id-ID')}`}
              </span>
            )}
          </div>
        </div>

        <div className="max-w-2xl mx-auto w-full flex items-center justify-between gap-3">
          {step > 1 && (
            <button
              onClick={handleBack}
              className="px-5 py-3.5 border-2 border-slate-200 text-slate-700 font-black text-xs sm:text-sm rounded-2xl hover:bg-slate-50 transition-all"
            >
              Kembali
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={step === 4 && !canProceedPayment}
            className={`flex-1 py-3.5 sm:py-4 text-white font-black text-xs sm:text-sm rounded-2xl shadow-clay-sm transition-all text-center block ${
              step === 4 && !canProceedPayment
                ? 'bg-slate-300 shadow-none cursor-not-allowed opacity-50' 
                : 'clay-button hover:opacity-95 active:scale-98'
            }`}
          >
            {step === 1 && 'Lanjut ke Detail Cucian →'}
            {step === 2 && 'Lanjut ke Jadwal Jemput →'}
            {step === 3 && 'Lanjut ke Pembayaran →'}
            {step === 4 && 'Konfirmasi & Pesan Sekarang 🚀'}
          </button>
        </div>
      </div>

      {/* MODAL: WEIGHT ESTIMATOR TOOL */}
      {showEstimator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-5 sm:p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-primary">
                <Calculator className="w-5 h-5" />
                <h3 className="text-base font-black text-slate-900">Kalkulator Estimasi Pakaian</h3>
              </div>
              <button onClick={() => setShowEstimator(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {[
                { key: 'kaos', label: 'Kaos / T-Shirt (~0.2 Kg)', icon: '👕' },
                { key: 'jeans', label: 'Celana Jeans (~0.6 Kg)', icon: '👖' },
                { key: 'kemeja', label: 'Kemeja Formal (~0.25 Kg)', icon: '👔' },
                { key: 'handuk', label: 'Handuk Mandi (~0.5 Kg)', icon: '🛁' },
                { key: 'sprei', label: 'Sprei Kasur (~1.2 Kg)', icon: '🛏️' },
                { key: 'jaket', label: 'Jaket / Hoodie (~0.8 Kg)', icon: '🧥' }
              ].map(item => (
                <div key={item.key} className="flex justify-between items-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{item.icon}</span>
                    <span className="text-xs font-bold text-slate-750">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setEstimatorItems(prev => ({ ...prev, [item.key]: Math.max(0, prev[item.key] - 1) }))}
                      className="w-7 h-7 bg-white rounded-lg border border-slate-200 font-black text-xs flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-black text-slate-900">{estimatorItems[item.key]}</span>
                    <button
                      type="button"
                      onClick={() => setEstimatorItems(prev => ({ ...prev, [item.key]: prev[item.key] + 1 }))}
                      className="w-7 h-7 bg-white rounded-lg border border-slate-200 font-black text-xs flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 flex justify-between items-center">
              <span className="text-xs font-bold text-slate-600">Estimasi Total Berat:</span>
              <span className="text-lg font-black text-primary">{calculateEstimatedWeight()} Kg</span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowEstimator(false)}
                className="flex-1 py-3 text-slate-600 font-bold text-xs bg-slate-100 hover:bg-slate-200 rounded-xl"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={applyEstimatedWeight}
                className="flex-1 py-3 bg-primary text-white font-black text-xs rounded-xl shadow-clay-sm hover:opacity-95"
              >
                Gunakan Estimasi Ini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
