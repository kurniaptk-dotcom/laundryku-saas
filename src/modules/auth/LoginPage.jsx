import React, { useState } from 'react';
import { 
  Sparkles, ArrowLeft, Phone, Mail, Lock, Eye, EyeOff, 
  HelpCircle, ShieldCheck, CheckCircle2, Crown, Monitor, Truck, Smartphone
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LoginPage({ role = 'owner', onBackToLanding, onSuccessLogin }) {
  const { handleLogin } = useApp();
  const [authMethod, setAuthMethod] = useState('wa'); // 'wa' | 'email'
  const [identifier, setIdentifier] = useState(
    role === 'owner' ? '089650846031' :
    role === 'pos' ? '089650846031' :
    role === 'courier' ? '0813-9988-1122' :
    role === 'customer' ? '0812-3456-7890' : 'admin@laundryku.id'
  );
  const [pin, setPin] = useState('1234');
  const [showPin, setShowPin] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const roleConfig = {
    owner: {
      title: 'Smart Owner ERP',
      subtitle: 'Pantau omzet cabang, kontrol mesin IoT, dan kelola absensi kasir secara real-time.',
      icon: Crown,
      tag: 'Executive Owner',
      badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    },
    pos: {
      title: 'SmartKasir POS',
      subtitle: 'Timbang pakaian kotor, terbitkan nota digital WhatsApp, dan proses pembayaran kasir.',
      icon: Monitor,
      tag: 'Kasir Frontdesk',
      badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
    },
    courier: {
      title: 'SmartKurir Driver',
      subtitle: 'Radar tugas antar-jemput cucian, peta rute GPS, dan bukti serah terima foto.',
      icon: Truck,
      tag: 'Armada Logistik',
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    customer: {
      title: 'LaundryKu Consumer',
      subtitle: 'Lacak tahapan cucian, pesan jemput tanpa timbang, dan bayar fleksibel via dompet digital.',
      icon: Smartphone,
      tag: 'Portal Pelanggan',
      badgeColor: 'bg-primary/20 text-primary border-primary/30'
    },
    admin: {
      title: 'SaaS Super Admin',
      subtitle: 'Master control panel seluruh tenant gerai laundry dan pemantauan sistem cloud.',
      icon: Crown,
      tag: 'Master Admin',
      badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    }
  }[role] || {
    title: 'Portal Masuk',
    subtitle: 'Masuk ke sistem manajemen laundry terintegrasi.',
    icon: Sparkles,
    tag: 'Portal Resmi',
    badgeColor: 'bg-sky-500/20 text-sky-300 border-sky-500/30'
  };

  const RoleIcon = roleConfig.icon;

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsSubmitting(true);

    setTimeout(() => {
      const res = handleLogin(role, identifier, pin);
      setIsSubmitting(false);
      if (res.success) {
        if (onSuccessLogin) onSuccessLogin();
      } else {
        setErrorMessage('Nomor HP/Email atau PIN yang Anda masukkan tidak sesuai.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl bg-white rounded-3xl sm:rounded-[36px] shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* ================= LEFT MARKETING BANNER (BLUE) ================= */}
        <div className="lg:col-span-5 bg-gradient-to-br from-sky-600 via-primary to-indigo-700 p-6 sm:p-8 text-white flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none"></div>

          <div className="space-y-6 z-10">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </button>

            <div className="space-y-2">
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${roleConfig.badgeColor}`}>
                <RoleIcon className="w-3.5 h-3.5" />
                <span>{roleConfig.tag}</span>
              </span>
              <h2 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight">
                {roleConfig.title}
              </h2>
              <p className="text-xs text-sky-100 font-medium leading-relaxed">
                {roleConfig.subtitle}
              </p>
            </div>

            {/* Feature Badges */}
            <div className="space-y-2 pt-2">
              {[
                '💬 WhatsApp Autosender Nota',
                '🌀 Kontrol Mesin Cuci IoT',
                '📊 Analitik Omzet Transparan',
                '📲 QRIS & Laundry Wallet'
              ].map((feat, idx) => (
                <div key={idx} className="px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs font-bold text-sky-50 flex items-center gap-2">
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-white/15 text-[11px] text-sky-200 z-10">
            <p>LaundryKu SaaS v2.0 • Standar Smartlink Indonesia</p>
          </div>
        </div>

        {/* ================= RIGHT FORM (CLEAN WHITE) ================= */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-10 flex flex-col justify-between space-y-6">
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-black text-slate-850 tracking-tight">Masuk ke Portal</h3>
              <p className="text-xs text-slate-450 font-semibold mt-0.5">Silakan masukkan kredensial akun terdaftar Anda.</p>
            </div>

            {/* Method Tabs */}
            <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
              <button
                type="button"
                onClick={() => setAuthMethod('wa')}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                  authMethod === 'wa' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>💬 Nomor WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setAuthMethod('email')}
                className={`flex-1 py-2.5 rounded-xl font-black text-xs transition-all flex items-center justify-center gap-2 ${
                  authMethod === 'email' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <span>✉️ Email / Username</span>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 rounded-xl text-xs font-bold animate-shake">
                  ⚠️ {errorMessage}
                </div>
              )}

              {/* Identifier Input */}
              <div>
                <label className="text-[11px] font-black text-slate-700 block mb-1.5">
                  {authMethod === 'wa' ? 'Nomor WhatsApp' : 'Email / Username'}:
                </label>
                <div className="relative flex items-center">
                  {authMethod === 'wa' ? (
                    <div className="absolute left-3.5 flex items-center gap-1 text-xs font-black text-slate-600 border-r border-slate-200 pr-2">
                      <span>🇮🇩</span>
                      <span>+62</span>
                    </div>
                  ) : (
                    <Mail className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  )}
                  <input
                    type={authMethod === 'wa' ? 'tel' : 'text'}
                    required
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    placeholder={authMethod === 'wa' ? '81234567890' : 'nama@outlet.id'}
                    className={`w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 text-xs font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all ${
                      authMethod === 'wa' ? 'pl-20 pr-4' : 'pl-10 pr-4'
                    }`}
                  />
                </div>
              </div>

              {/* PIN / Password Input */}
              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label className="text-[11px] font-black text-slate-700">PIN / Kata Sandi:</label>
                  <span className="text-[10px] font-black text-emerald-600">Demo PIN: 1234</span>
                </div>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-slate-400" />
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    value={pin}
                    onChange={e => setPin(e.target.value)}
                    placeholder="Masukkan PIN 4 digit"
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-10 pr-12 text-xs font-black tracking-widest text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-primary focus:bg-white transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3.5 text-slate-400 hover:text-slate-700 p-1"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm transition-all transform hover:scale-[1.01] active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Memverifikasi Kredensial...</span>
                  ) : (
                    <span>Masuk ke {roleConfig.title} →</span>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Help Desk Footer */}
          <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[11px] text-slate-400 font-semibold">
            <span className="flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" /> Bantuan CS:
            </span>
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="text-primary font-black hover:underline">
              (0341) 5082494 / WhatsApp
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
