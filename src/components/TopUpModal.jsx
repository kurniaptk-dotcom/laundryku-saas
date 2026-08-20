import React, { useState } from 'react';
import { X, Check, Landmark, Wallet, QrCode, CreditCard } from 'lucide-react';

export default function TopUpModal({ isOpen, onClose, onTopUp }) {
  const [amount, setAmount] = useState('50000');
  const [customAmount, setCustomAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const presets = ['20000', '50000', '100000', '200000'];

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalAmount = customAmount ? parseInt(customAmount) : parseInt(amount);
    if (isNaN(finalAmount) || finalAmount <= 0) return;
    
    setIsSuccess(true);
    setTimeout(() => {
      onTopUp(finalAmount);
      setIsSuccess(false);
      setCustomAmount('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md overflow-hidden bg-white clay-card rounded-3xl shadow-soft-lg animate-scale-up">
        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-12 text-center">
            <div className="flex items-center justify-center w-20 h-20 mb-6 bg-emerald-100 rounded-full text-emerald-500 animate-bounce">
              <Check className="w-10 h-10 stroke-[3]" />
            </div>
            <h3 className="text-xl font-bold text-slate-850">Top Up Berhasil!</h3>
            <p className="mt-2 text-slate-500">
              Saldo sebesar <span className="font-semibold text-slate-800">Rp {(customAmount ? parseInt(customAmount) : parseInt(amount)).toLocaleString('id-ID')}</span> telah ditambahkan ke wallet Anda.
            </p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900">Top Up Saldo</h3>
              <button 
                onClick={onClose} 
                className="p-2 text-slate-400 hover:text-slate-650 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Presets */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-500">Pilih Nominal Cepat</label>
                <div className="grid grid-cols-2 gap-3">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setAmount(preset);
                        setCustomAmount('');
                      }}
                      className={`py-3 px-4 rounded-2xl font-bold text-sm border-2 transition-all duration-200 ${
                        amount === preset && !customAmount
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-slate-100 hover:border-slate-200 text-slate-600 bg-slate-50'
                      }`}
                    >
                      Rp {parseInt(preset).toLocaleString('id-ID')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Amount */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-500">Nominal Lainnya (Rp)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rp</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => {
                      setCustomAmount(e.target.value);
                      setAmount('');
                    }}
                    placeholder="Masukkan jumlah top up"
                    min="10000"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border-2 border-slate-100 rounded-2xl font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-500">Metode Pembayaran</label>
                <div className="space-y-2">
                  {/* QRIS */}
                  <label className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === 'qris' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${paymentMethod === 'qris' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">QRIS / e-Wallet</p>
                        <p className="text-xs text-slate-500">GoPay, OVO, Dana, LinkAja</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="qris"
                      checked={paymentMethod === 'qris'}
                      onChange={() => setPaymentMethod('qris')}
                      className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                    />
                  </label>

                  {/* VA Bank */}
                  <label className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                    paymentMethod === 'va' 
                      ? 'border-primary bg-primary/5' 
                      : 'border-slate-100 hover:border-slate-200 bg-slate-50'
                  }`}>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${paymentMethod === 'va' ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'}`}>
                        <Landmark className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">Virtual Account</p>
                        <p className="text-xs text-slate-500">BCA, Mandiri, BNI, BRI</p>
                      </div>
                    </div>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="va"
                      checked={paymentMethod === 'va'}
                      onChange={() => setPaymentMethod('va')}
                      className="w-4 h-4 text-primary focus:ring-primary border-slate-300"
                    />
                  </label>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 text-white font-bold rounded-2xl clay-button hover:opacity-95 transform transition-all active:scale-95 text-center block"
              >
                Top Up Sekarang
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
