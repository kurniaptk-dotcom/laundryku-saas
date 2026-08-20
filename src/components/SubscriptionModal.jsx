import React, { useState } from 'react';
import { Sparkles, Check, X, ShieldCheck, Zap, Calendar, Package, ArrowRight, Wallet } from 'lucide-react';
import { SUBSCRIPTION_PLANS } from '../utils/subscriptionHelper';

export default function SubscriptionModal({
  isOpen,
  onClose,
  walletBalance = 0,
  onPurchasePlan
}) {
  const [selectedPlanId, setSelectedPlanId] = useState(SUBSCRIPTION_PLANS[0].id);
  const [paymentMethod, setPaymentMethod] = useState('wallet'); // 'wallet' | 'qris'

  if (!isOpen) return null;

  const selectedPlan = SUBSCRIPTION_PLANS.find(p => p.id === selectedPlanId) || SUBSCRIPTION_PLANS[0];
  const canAfford = paymentMethod !== 'wallet' || walletBalance >= selectedPlan.price;

  const handleBuy = () => {
    if (!canAfford) {
      alert('Saldo Wallet Anda kurang. Silakan Top Up terlebih dahulu atau pilih metode QRIS.');
      return;
    }
    onPurchasePlan(selectedPlan.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-sky-600 via-primary to-indigo-700 text-white flex justify-between items-center relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="relative z-10">
            <span className="px-2.5 py-0.5 bg-white/20 text-white text-[10px] font-black rounded-lg uppercase tracking-wider">
              Hemat Hingga 50%
            </span>
            <h3 className="text-lg sm:text-xl font-black mt-1">Paket Berlangganan Kuota Kiloan</h3>
            <p className="text-xs text-sky-100 font-semibold mt-0.5">Beli kuota kg di awal, cuci bebas kapan saja tanpa repot bayar harian</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-white/80 hover:text-white relative z-10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Plan Cards */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isSelected = selectedPlanId === plan.id;
              return (
                <div
                  key={plan.id}
                  onClick={() => setSelectedPlanId(plan.id)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between relative ${
                    isSelected 
                      ? 'border-primary bg-sky-50/50 ring-2 ring-primary/20 shadow-soft' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase ${plan.badgeColor}`}>
                        {plan.tag}
                      </span>
                      {isSelected && <Check className="w-4 h-4 text-primary stroke-[3]" />}
                    </div>

                    <h4 className="font-black text-sm text-slate-850">{plan.name}</h4>
                    
                    <div className="pt-1">
                      <p className="text-xl font-black text-slate-900">
                        Rp {(plan.price / 1000).toLocaleString('id-ID')}k
                      </p>
                      <p className="text-[10px] text-emerald-600 font-bold">
                        Rp {plan.pricePerKg.toLocaleString('id-ID')} / Kg
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600 font-medium">
                      <div className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="font-bold">{plan.quotaKg} Kg Cuci & Setrika</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>Masa aktif {plan.validityDays} Hari</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Plan Details & Features */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <h5 className="text-xs font-black text-slate-850 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Keuntungan {selectedPlan.name}:</span>
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-600 font-semibold">
              {selectedPlan.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 stroke-[3]" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-wider">Metode Pembayaran</label>
            <div className="grid grid-cols-2 gap-3">
              <div 
                onClick={() => setPaymentMethod('wallet')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'wallet' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Wallet className="w-4 h-4 text-primary" />
                  <div>
                    <p className="text-xs font-black text-slate-850">Laundry Wallet</p>
                    <p className="text-[10px] text-slate-400 font-semibold">Saldo: Rp {walletBalance.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                {paymentMethod === 'wallet' && <Check className="w-4 h-4 text-primary stroke-[3]" />}
              </div>

              <div 
                onClick={() => setPaymentMethod('qris')}
                className={`p-3.5 rounded-2xl border-2 cursor-pointer flex items-center justify-between ${
                  paymentMethod === 'qris' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-base">📱</span>
                  <div>
                    <p className="text-xs font-black text-slate-850">QRIS / Instant</p>
                    <p className="text-[10px] text-slate-400 font-semibold">BCA, GoPay, OVO, Dana</p>
                  </div>
                </div>
                {paymentMethod === 'qris' && <Check className="w-4 h-4 text-primary stroke-[3]" />}
              </div>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase">Total Tagihan Paket:</p>
            <p className="text-lg font-black text-primary">Rp {selectedPlan.price.toLocaleString('id-ID')}</p>
          </div>

          <button
            onClick={handleBuy}
            className="px-6 py-3.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-clay-sm flex items-center gap-2 transition-all active:scale-98"
          >
            <span>Aktifkan Paket Kuota Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
