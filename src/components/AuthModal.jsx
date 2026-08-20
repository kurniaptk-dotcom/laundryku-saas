import React, { useState, useEffect, useRef } from 'react';
import { 
  Smartphone, MessageSquare, ArrowRight, ShieldCheck, 
  Sparkles, Check, User, MapPin, RefreshCw, KeyRound, 
  ChevronLeft, Award, HelpCircle
} from 'lucide-react';
import { calculateTier } from '../utils/tierHelper';

export default function AuthModal({
  customers = [],
  onLoginSuccess,
  onRegisterNewUser
}) {
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'
  const [step, setStep] = useState(1); // 1: Input Phone/Data, 2: OTP Verification, 3: Success
  const [phone, setPhone] = useState('0812-3456-7890');
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  
  // OTP state
  const [otp, setOtp] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(45);
  const [isVerifying, setIsVerifying] = useState(false);
  const [targetCustomer, setTargetCustomer] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const otpInputsRef = useRef([]);

  // Countdown timer for resend OTP
  useEffect(() => {
    let interval = null;
    if (step === 2 && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, otpTimer]);

  const cleanPhone = (p) => (p || '').replace(/[^\d]/g, '');

  const handleSendOtp = (e) => {
    e?.preventDefault();
    setErrorMessage('');
    const cleaned = cleanPhone(phone);
    if (!cleaned || cleaned.length < 9) {
      setErrorMessage('Masukkan nomor WhatsApp yang valid (min. 10 digit).');
      return;
    }

    if (authMode === 'login') {
      // Find existing customer by phone or default to first match
      const found = customers.find(c => cleanPhone(c.phone) === cleaned || cleanPhone(c.phone).includes(cleaned.slice(-8)));
      if (found) {
        setTargetCustomer(found);
      } else {
        // Offer auto-registration if phone not found
        setTargetCustomer({
          id: `CUST-${Date.now().toString().slice(-4)}`,
          name: 'Pelanggan Baru',
          phone: phone,
          address: 'Jakarta',
          balance: 25000,
          points: 100,
          totalSpent: 0,
          tier: 'Member Bronze',
          lastOrderDate: 'Hari ini',
          preferences: 'Standar'
        });
      }
    } else {
      // Register mode
      if (!name.trim()) {
        setErrorMessage('Silakan isi nama lengkap Anda.');
        return;
      }
      setTargetCustomer({
        id: `CUST-${Date.now().toString().slice(-4)}`,
        name: name.trim(),
        phone: phone,
        address: address.trim() || 'Jakarta',
        balance: 25000,
        points: 100, // Welcome bonus points!
        totalSpent: 0,
        tier: 'Member Bronze',
        lastOrderDate: 'Hari ini',
        preferences: 'Standar'
      });
    }

    setStep(2);
    setOtp(['', '', '', '']);
    setOtpTimer(45);
    setTimeout(() => {
      otpInputsRef.current[0]?.focus();
    }, 200);
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 3) {
      otpInputsRef.current[index + 1]?.focus();
    }

    // If 4 digits entered, verify
    if (newOtp.every(digit => digit !== '')) {
      handleVerifyOtp(newOtp.join(''));
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = (enteredCode) => {
    setIsVerifying(true);
    setErrorMessage('');

    setTimeout(() => {
      setIsVerifying(false);
      // Demo acceptance: '1234' or any 4 digit code
      if (enteredCode === '1234' || enteredCode.length === 4) {
        setStep(3);
        setTimeout(() => {
          if (authMode === 'register' && targetCustomer) {
            onRegisterNewUser(targetCustomer);
          } else if (targetCustomer) {
            onLoginSuccess(targetCustomer.id);
          }
        }, 1200);
      } else {
        setErrorMessage('Kode OTP salah. Masukkan 1234 untuk demo.');
      }
    }, 600);
  };

  const handleAutoFillDemoOtp = () => {
    const demoCode = ['1', '2', '3', '4'];
    setOtp(demoCode);
    handleVerifyOtp('1234');
  };

  const handleQuickDemoLogin = (cust) => {
    setTargetCustomer(cust);
    setPhone(cust.phone);
    setStep(3);
    setTimeout(() => {
      onLoginSuccess(cust.id);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto no-scrollbar relative">
      {/* Top Header Decor */}
      <div className="bg-gradient-to-b from-sky-600 via-primary to-indigo-700 pt-10 pb-16 px-6 text-white text-center relative overflow-hidden flex-shrink-0">
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-white/10 rounded-full blur-2xl"></div>
        <div className="absolute -left-8 -bottom-8 w-44 h-44 bg-sky-400/20 rounded-full blur-2xl"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-3xl shadow-clay-sm mb-3 animate-float">
            🧼
          </div>
          <h1 className="text-2xl font-black tracking-tight">LaundryKu Pro</h1>
          <p className="text-xs text-sky-100 font-semibold mt-1">Layanan Cuci & Setrika Pintar Berbasis WhatsApp</p>
        </div>
      </div>

      {/* Main Form Body Container */}
      <div className="flex-1 px-5 sm:px-6 -mt-8 pb-10 max-w-lg mx-auto w-full z-20">
        <div className="bg-white rounded-3xl border border-slate-150/90 shadow-soft-lg p-6 sm:p-7 space-y-6">
          
          {/* STEP 1: PHONE INPUT & REGISTRATION */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              {/* Auth Mode Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-2xl">
                <button
                  type="button"
                  onClick={() => { setAuthMode('login'); setErrorMessage(''); }}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                    authMode === 'login' ? 'bg-white text-slate-850 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Masuk via WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode('register'); setErrorMessage(''); }}
                  className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all ${
                    authMode === 'register' ? 'bg-white text-slate-850 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Daftar Member Baru
                </button>
              </div>

              <div>
                <h3 className="text-base font-black text-slate-850">
                  {authMode === 'login' ? 'Masuk ke Akun Anda' : 'Buat Akun Member LaundryKu'}
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {authMode === 'login' 
                    ? 'Kami akan mengirimkan 4-digit kode OTP ke nomor WhatsApp Anda.' 
                    : 'Daftar sekarang dan dapatkan bonus 100 Poin Loyalitas & Saldo awal!'}
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-xs font-bold flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSendOtp} className="space-y-4">
                {authMode === 'register' && (
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-500">Nama Lengkap *</label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Contoh: Rian Pratama"
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Nomor WhatsApp *</label>
                  <div className="relative">
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-black text-slate-700 pr-2 border-r border-slate-200">
                      <span>🇮🇩</span>
                      <span>+62</span>
                    </div>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="812-xxxx-xxxx"
                      className="w-full pl-20 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary transition-all"
                    />
                  </div>
                </div>

                {authMode === 'register' && (
                  <div className="space-y-1">
                    <label className="text-xs font-black text-slate-500">Alamat Antar-Jemput</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Jl. Cempaka Putih No. 12, Jakarta Pusat"
                        className="w-full pl-10 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold focus:bg-white focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-clay-sm flex items-center justify-center gap-2 transition-all clay-button active:scale-98"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Kirim Kode OTP WhatsApp</span>
                </button>
              </form>

              {/* Quick Demo Login Profiles */}
              <div className="pt-5 border-t border-slate-150 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">Atau Masuk Cepat (Demo Akun):</span>
                  <span className="text-[10px] font-bold text-primary bg-sky-50 px-2 py-0.5 rounded-md">1-Klik Login</span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {customers.map((c) => {
                    const tier = calculateTier(c.totalSpent || 0);
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleQuickDemoLogin(c)}
                        className="p-3 bg-slate-50 hover:bg-sky-50 border border-slate-200/80 hover:border-primary/50 rounded-2xl text-left transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-black text-slate-850 group-hover:text-primary transition-colors truncate">
                              {c.name.split(' ')[0]}
                            </span>
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-slate-900 text-amber-300">
                              {tier.badge.split(' ')[0]}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 font-semibold mt-0.5">{c.phone}</p>
                        </div>
                        <span className="text-[10px] text-primary font-black mt-2 inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Pilih Akun →
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: OTP VERIFICATION */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Ganti Nomor HP</span>
              </button>

              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center shadow-xs">
                  <KeyRound className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-850">Verifikasi Kode OTP</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Kode 4-digit telah dikirim ke WhatsApp <strong className="text-slate-800">{phone}</strong>
                </p>
              </div>

              {errorMessage && (
                <div className="p-3 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl text-xs font-bold text-center">
                  {errorMessage}
                </div>
              )}

              {/* 4-Box OTP Input */}
              <div className="flex justify-center gap-3">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(idx, e)}
                    className="w-13 h-14 text-center text-xl font-black bg-slate-50 border-2 border-slate-200 rounded-2xl focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                  />
                ))}
              </div>

              {/* Demo Helper & Auto Fill */}
              <div className="p-4 bg-amber-50/80 rounded-2xl border border-amber-200/80 space-y-2 text-center">
                <p className="text-xs font-bold text-amber-900">
                  💡 <span className="font-black">Mode Demo:</span> Masukkan kode <strong className="font-black text-amber-800 underline">1234</strong> atau klik tombol di bawah:
                </p>
                <button
                  type="button"
                  onClick={handleAutoFillDemoOtp}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-xl shadow-xs transition-all active:scale-95"
                >
                  ⚡ Isi Otomatis OTP (1234) & Masuk
                </button>
              </div>

              {/* Resend OTP Timer */}
              <div className="text-center text-xs font-bold">
                {otpTimer > 0 ? (
                  <span className="text-slate-400">
                    Kirim ulang kode dalam <span className="text-primary font-black">00:{otpTimer < 10 ? `0${otpTimer}` : otpTimer}</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => { setOtpTimer(45); setErrorMessage(''); }}
                    className="text-primary font-black hover:underline"
                  >
                    Kirim Ulang Kode OTP Sekarang
                  </button>
                )}
              </div>
            </div>
          )}

          {/* STEP 3: LOGIN SUCCESS CELEBRATION */}
          {step === 3 && (
            <div className="text-center py-8 space-y-4 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center text-3xl shadow-clay-sm animate-bounce">
                🎉
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-850">
                  Selamat Datang, {targetCustomer?.name || 'Pelanggan Setia'}!
                </h3>
                <p className="text-xs text-slate-400 font-semibold mt-1">
                  Status Akun: <span className="text-primary font-black">{targetCustomer?.tier || 'Member Bronze'}</span>
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 bg-emerald-50 py-2.5 px-4 rounded-2xl w-fit mx-auto border border-emerald-200">
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Autentikasi WhatsApp Berhasil!</span>
              </div>
            </div>
          )}

        </div>

        {/* Security Badge Footer */}
        <div className="mt-6 text-center flex items-center justify-center gap-2 text-[11px] text-slate-400 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Privasi & Data Pelanggan Terenkripsi 256-bit</span>
        </div>
      </div>
    </div>
  );
}
