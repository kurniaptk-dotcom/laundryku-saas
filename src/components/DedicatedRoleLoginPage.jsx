import React, { useState } from 'react';
import { 
  Lock, Mail, ArrowRight, ShieldCheck, Eye, EyeOff, Sparkles, 
  Crown, Monitor, Truck, Smartphone, ChevronLeft, CheckCircle2,
  Phone, MessageSquare, HelpCircle, ArrowLeft
} from 'lucide-react';
import { DEFAULT_TENANTS } from '../utils/saasHelper';

export default function DedicatedRoleLoginPage({ 
  roleKey = 'owner_mobile', 
  tenants = DEFAULT_TENANTS, 
  customers = [],
  onLoginSuccess, 
  onBackToLanding,
  isDark = false 
}) {
  // Navigation mode inside auth screen: 'onboarding' | 'login' | 'register'
  const [authMode, setAuthMode] = useState('login'); 
  
  // Login Tab: 'wa' (Nomor WA) | 'email' (Email/Username)
  const [loginTab, setLoginTab] = useState('email');

  // Form states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regOwnerName, setRegOwnerName] = useState('');
  const [regStep, setRegStep] = useState(1);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Role Metadata Config
  const roleConfigs = {
    super_admin: {
      appName: 'Super Admin',
      brandLogo: 'smartadmin',
      subLogo: 'by laundryku',
      bannerTagline: 'Selamat Datang di Pusat Kendali',
      bannerTitle: 'Master SaaS',
      bannerDesc: 'Atur seluruh lisensi mitra, pantau MRR finansial, dan broadcast pengumuman sistem nasional.',
      roleBadge: 'SUPER ADMIN MASTER CONTROL',
      themeBlue: 'from-blue-600 to-indigo-700',
      pillColor: 'bg-blue-50 text-blue-600 border-blue-200',
      defaultEmail: 'admin@laundryku.id',
      defaultWa: '081234567890',
      defaultPin: '1234',
      icon: '⚙️'
    },
    owner_mobile: {
      appName: 'Smart Owner',
      brandLogo: 'smartowner',
      subLogo: 'by laundryku',
      bannerTagline: 'Selamat Datang di Aplikasi Laundry',
      bannerTitle: 'Smart Owner',
      bannerDesc: 'Atur, kelola & pantau usaha laundry Anda kapanpun dan dimanapun dengan mudah.',
      roleBadge: 'SMARTOWNER ERP SUITE',
      themeBlue: 'from-blue-500 to-indigo-600',
      pillColor: 'bg-blue-50 text-blue-600 border-blue-200',
      defaultEmail: 'kurnia@laundryku.id',
      defaultWa: '089650846031',
      defaultPin: '1234',
      icon: '👑'
    },
    web: {
      appName: 'Smart Kasir',
      brandLogo: 'smartkasir',
      subLogo: 'by laundryku',
      bannerTagline: 'Selamat Datang di Terminal Kasir POS',
      bannerTitle: 'Smart Kasir',
      bannerDesc: 'Transaksi kasir cepat, timbang pakaian akurat, cetak struk thermal & label anti-air.',
      roleBadge: 'SMARTKASIR POS TERMINAL',
      themeBlue: 'from-sky-500 to-blue-600',
      pillColor: 'bg-sky-50 text-sky-600 border-sky-200',
      defaultEmail: 'kasir@berkahclean.com',
      defaultWa: '089650846031',
      defaultPin: '1234',
      icon: '💻'
    },
    courier_app: {
      appName: 'Smart Kurir',
      brandLogo: 'smartkurir',
      subLogo: 'by laundryku',
      bannerTagline: 'Selamat Datang di Radar Logistik',
      bannerTitle: 'Smart Kurir',
      bannerDesc: 'Jemput dan antar cucian dengan navigasi rute GPS real-time & foto audit pakaian.',
      roleBadge: 'SMARTKURIR RADAR DRIVER',
      themeBlue: 'from-blue-600 to-sky-600',
      pillColor: 'bg-blue-50 text-blue-600 border-blue-200',
      defaultEmail: 'kurir@laundryku.id',
      defaultWa: '081399881122',
      defaultPin: '1234',
      icon: '🛵'
    },
    mobile: {
      appName: 'LaundryKu Konsumen',
      brandLogo: 'smartcustomer',
      subLogo: 'by laundryku',
      bannerTagline: 'Selamat Datang di Pelacak Cucian',
      bannerTitle: 'Customer App',
      bannerDesc: 'Lacak proses cuci pakaian secara transparan, cek saldo wallet & nikmati promo menarik.',
      roleBadge: 'PORTAL PELANGGAN RESMI',
      themeBlue: 'from-teal-500 to-blue-600',
      pillColor: 'bg-teal-50 text-teal-600 border-teal-200',
      defaultEmail: 'aisyah@gmail.com',
      defaultWa: '0812-3456-7890',
      defaultPin: '1234',
      icon: '📱'
    }
  };

  const currentRole = roleConfigs[roleKey] || roleConfigs.owner_mobile;

  // Handle Strict Submit Form
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    const inputVal = loginTab === 'wa' ? phoneNumber.trim() : emailOrUsername.trim();
    if (!inputVal) {
      setErrorMsg(loginTab === 'wa' ? 'Silakan masukkan nomor WhatsApp Anda.' : 'Silakan masukkan Email atau Username.');
      return;
    }

    if (!password) {
      setErrorMsg('Silakan masukkan kata sandi / PIN Anda.');
      return;
    }

    setIsLoading(true);

    const inputClean = inputVal.toLowerCase().replace(/[^a-z0-9]/g, '');
    const passwordClean = password.trim();

    // 1. STRICT SUPER ADMIN VALIDATION
    if (roleKey === 'super_admin') {
      const validAdminIdentifiers = ['admin@laundryku.id', '081234567890', 'admin', 'superadmin'];
      const isValidAdminUser = validAdminIdentifiers.some(id => inputClean === id.replace(/[^a-z0-9]/g, ''));
      const isValidAdminPass = ['1234', 'admin123', 'laundryku2026'].includes(passwordClean);

      setTimeout(() => {
        setIsLoading(false);
        if (isValidAdminUser && isValidAdminPass) {
          onLoginSuccess('super_admin', 'TNT-001');
        } else {
          setErrorMsg('Kredensial Super Admin salah! Gunakan Email: admin@laundryku.id dan PIN: 1234');
        }
      }, 500);
      return;
    }

    // 2. STRICT CUSTOMER VALIDATION
    if (roleKey === 'mobile') {
      const matchedCustomer = (customers || []).find(c => {
        const phoneClean = (c.phone || '').replace(/[^0-9]/g, '');
        const emailClean = (c.email || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        return (phoneClean && inputClean === phoneClean) || (emailClean && inputClean === emailClean);
      });

      const isValidCustomerPass = ['1234', 'customer123', 'aisyah123'].includes(passwordClean);

      setTimeout(() => {
        setIsLoading(false);
        if (matchedCustomer && isValidCustomerPass) {
          onLoginSuccess('mobile', 'TNT-001', matchedCustomer.id);
        } else if (!matchedCustomer) {
          setErrorMsg(`Nomor WhatsApp/Email "${inputVal}" belum terdaftar sebagai pelanggan. Silakan daftar terlebih dahulu.`);
        } else {
          setErrorMsg('Kata sandi / PIN yang Anda masukkan salah. (PIN Demo: 1234)');
        }
      }, 500);
      return;
    }

    // 3. STRICT COURIER VALIDATION
    if (roleKey === 'courier_app') {
      const validCourierPhones = ['081399881122', '081277665544', '081399882233'];
      const isMatchedCourier = validCourierPhones.some(p => p.replace(/[^0-9]/g, '') === inputClean) ||
                               inputClean.includes('kurir') || inputClean.includes('driver');
      const isValidCourierPass = ['1234', 'kurir123'].includes(passwordClean);

      setTimeout(() => {
        setIsLoading(false);
        if (isMatchedCourier && isValidCourierPass) {
          onLoginSuccess('courier_app', 'TNT-001');
        } else if (!isMatchedCourier) {
          setErrorMsg(`Nomor Kurir "${inputVal}" tidak ditemukan dalam sistem. Gunakan No. WA Kurir Demo: 0813-9988-1122`);
        } else {
          setErrorMsg('Kata sandi / PIN Kurir salah. (PIN Demo: 1234)');
        }
      }, 500);
      return;
    }

    // 4. STRICT OWNER & KASIR POS VALIDATION
    const matchedTenant = (tenants || []).find(t => {
      const phoneClean = (t.ownerPhone || '').replace(/[^0-9]/g, '');
      const nameClean = (t.ownerName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const businessClean = (t.businessName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
      const idClean = (t.id || '').toLowerCase().replace(/[^a-z0-9]/g, '');

      return (
        (phoneClean && (inputClean === phoneClean || inputClean.endsWith(phoneClean) || phoneClean.endsWith(inputClean))) ||
        (nameClean && inputClean === nameClean) ||
        (businessClean && inputClean === businessClean) ||
        (idClean && inputClean === idClean)
      );
    });

    const isValidTenantPass = ['1234', 'owner123', 'kasir123', 'admin123'].includes(passwordClean);

    setTimeout(() => {
      setIsLoading(false);
      if (matchedTenant && isValidTenantPass) {
        onLoginSuccess(roleKey, matchedTenant.id);
      } else if (!matchedTenant) {
        setErrorMsg(`Akun Mitra "${inputVal}" tidak terdaftar. Silakan daftar trial 14 hari atau gunakan No. WA Demo: 089650846031`);
      } else {
        setErrorMsg('Kata sandi / PIN yang Anda masukkan salah. (PIN Demo: 1234)');
      }
    }, 500);
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (regStep === 1) {
      if (!phoneNumber.trim()) {
        setErrorMsg('Silakan masukkan nomor WhatsApp yang aktif.');
        return;
      }
      setErrorMsg('');
      setRegStep(2);
    } else {
      if (!regOwnerName.trim() || !regBusinessName.trim()) {
        setErrorMsg('Mohon lengkapi nama pemilik dan nama gerai laundry.');
        return;
      }
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(roleKey, 'TNT-001');
      }, 700);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-900/10 flex items-center justify-center p-0 sm:p-4 md:p-6 lg:p-8 font-sans antialiased relative overflow-hidden select-none">
      
      {/* Background Soft Ambiance Image Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-sky-200/40 via-blue-50/60 to-slate-200/50 -z-20"></div>
      <div className="absolute top-0 right-0 bottom-0 left-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-25 -z-10"></div>

      {/* Main Container Card (Smartlink Split Two-Column Style) */}
      <div className="w-full max-w-5xl min-h-[640px] bg-white rounded-none sm:rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 border border-slate-100 z-10">
        
        {/* ================= LEFT COLUMN: HERO MARKETING BANNER ================= */}
        <div className={`hidden lg:flex flex-col justify-between p-10 xl:p-12 text-white bg-gradient-to-br ${currentRole.themeBlue} relative overflow-hidden`}>
          
          {/* Subtle Background Watermark Elements */}
          <div className="absolute -right-16 -top-16 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-sky-300/15 rounded-full blur-3xl pointer-events-none"></div>

          {/* Top Back to Home Button & Tagline */}
          <div className="space-y-4 z-10">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 border border-white/20 text-white text-xs font-bold backdrop-blur-md transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Beranda</span>
            </button>

            <div className="pt-4">
              <p className="text-sm font-semibold text-sky-100 tracking-wide">
                {currentRole.bannerTagline}
              </p>
              <h1 className="text-4xl xl:text-5xl font-black tracking-tight mt-1 text-white leading-tight">
                {currentRole.bannerTitle}
              </h1>
            </div>
          </div>

          {/* Center Visual Feature Graphics (Circular Badges with Icons) */}
          <div className="relative my-auto py-8 flex items-center justify-center">
            {/* Ambient Illustration Graphics */}
            <div className="relative w-full max-w-sm flex items-center justify-center">
              
              {/* Feature Bubble 1: Autosender */}
              <div className="absolute -top-6 left-2 bg-white/90 text-blue-700 px-3.5 py-1.5 rounded-2xl shadow-lg border border-white flex items-center gap-2 backdrop-blur-md animate-pulse">
                <span className="text-base">💬</span>
                <span className="text-[11px] font-black tracking-tight">WhatsApp Autosender</span>
              </div>

              {/* Feature Bubble 2: IoT Machine */}
              <div className="absolute top-12 -left-4 bg-white/90 text-sky-700 p-3 rounded-2xl shadow-lg border border-white flex items-center justify-center text-xl backdrop-blur-md">
                <span>🌀</span>
              </div>

              {/* Feature Bubble 3: Analytics */}
              <div className="absolute top-6 right-2 bg-white/90 text-indigo-700 p-3 rounded-2xl shadow-lg border border-white flex items-center justify-center text-xl backdrop-blur-md">
                <span>📊</span>
              </div>

              {/* Feature Bubble 4: QRIS Instant */}
              <div className="absolute -bottom-4 right-6 bg-white/90 text-emerald-700 px-3.5 py-1.5 rounded-2xl shadow-lg border border-white flex items-center gap-2 backdrop-blur-md">
                <span className="text-base">📲</span>
                <span className="text-[11px] font-black">QRIS Payment</span>
              </div>

              {/* Main Mascot / Graphic Representation */}
              <div className="w-56 h-56 rounded-full bg-white/10 border-4 border-white/20 p-3 flex items-center justify-center shadow-inner">
                <div className="w-full h-full rounded-full bg-gradient-to-tr from-white/20 to-sky-200/30 flex flex-col items-center justify-center text-center p-4 backdrop-blur-sm">
                  <span className="text-6xl drop-shadow-md mb-2">{currentRole.icon}</span>
                  <span className="text-xs font-black uppercase tracking-widest text-sky-100">{currentRole.appName}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Banner Footer Info */}
          <div className="z-10 pt-2">
            <p className="text-xs text-sky-100/90 font-medium leading-relaxed max-w-sm">
              {currentRole.bannerDesc}
            </p>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: CLEAN SMARTLINK AUTH FORM ================= */}
        <div className="flex flex-col justify-between p-6 sm:p-10 md:p-12 bg-white relative">
          
          {/* Mobile-only Back Header */}
          <div className="lg:hidden flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
            <button
              onClick={onBackToLanding}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Beranda</span>
            </button>
            <span className="text-xs font-black text-blue-600">{currentRole.appName}</span>
          </div>

          {/* Top Brand Logo & Header */}
          <div className="space-y-6">
            
            {/* Smartlink Brand Signature */}
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black tracking-tight text-slate-900">
                {currentRole.brandLogo}
              </span>
              <span className="text-xs font-bold text-slate-400 italic">
                {currentRole.subLogo}
              </span>
            </div>

            {/* View Title & Navigation Arrow */}
            <div className="flex items-center gap-3">
              {authMode !== 'onboarding' && (
                <button
                  type="button"
                  onClick={() => {
                    if (authMode === 'register' && regStep === 2) {
                      setRegStep(1);
                    } else {
                      setAuthMode('login');
                    }
                  }}
                  className="p-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
                </button>
              )}
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {authMode === 'login' ? 'Login' : authMode === 'register' ? 'Daftar' : 'Selamat Datang'}
              </h2>
            </div>

            {/* ================= 1. ONBOARDING WELCOME SCREEN ================= */}
            {authMode === 'onboarding' && (
              <div className="space-y-6 pt-4 animate-fade-in">
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  {currentRole.bannerDesc}
                </p>

                <div className="space-y-3 pt-4">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setRegStep(1); }}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                  >
                    Daftar
                  </button>

                  <button
                    type="button"
                    onClick={() => setAuthMode('login')}
                    className="w-full py-3.5 bg-white hover:bg-slate-50 text-blue-600 border border-blue-600 rounded-xl font-bold text-sm transition-all cursor-pointer"
                  >
                    Login
                  </button>
                </div>
              </div>
            )}

            {/* ================= 2. LOGIN FORM WITH SMARTLINK TABS ================= */}
            {authMode === 'login' && (
              <div className="space-y-5 animate-fade-in">
                
                {/* Clean Top Tabs: Nomor WA | Email/Username */}
                <div className="flex border-b border-slate-200 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => { setLoginTab('wa'); setErrorMsg(''); }}
                    className={`flex-1 pb-3 text-center transition-all relative cursor-pointer ${
                      loginTab === 'wa' 
                        ? 'text-blue-600 font-extrabold' 
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <span>Nomor Wa</span>
                    {loginTab === 'wa' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => { setLoginTab('email'); setErrorMsg(''); }}
                    className={`flex-1 pb-3 text-center transition-all relative cursor-pointer ${
                      loginTab === 'email' 
                        ? 'text-blue-600 font-extrabold' 
                        : 'text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <span>Email/Username</span>
                    {loginTab === 'email' && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
                    )}
                  </button>
                </div>

                {/* Subtitle Instruction */}
                <p className="text-xs text-slate-600 font-medium leading-relaxed">
                  {loginTab === 'wa' ? (
                    <>Silahkan masukkan <strong>Nomor Whatsapp</strong> dan kata sandi Anda untuk login.</>
                  ) : (
                    <>Silahkan masukkan <strong>Email/Username</strong> dan <strong>kata sandi</strong> Anda untuk login.</>
                  )}
                </p>

                {/* Form Inputs */}
                <form onSubmit={handleLoginSubmit} className="space-y-4 pt-1">
                  
                  {loginTab === 'wa' ? (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Nomor Whatsapp <span className="text-rose-500">*</span>
                      </label>
                      <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/10">
                        <div className="px-3 bg-slate-50 border-r border-slate-200 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                          <span>🇮🇩</span>
                          <span className="text-slate-400">▾</span>
                        </div>
                        <input
                          type="tel"
                          required
                          value={phoneNumber}
                          onChange={(e) => { setPhoneNumber(e.target.value); setErrorMsg(''); }}
                          placeholder="856864327294"
                          className="flex-1 px-3.5 py-3 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none bg-white"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">
                        Email/Username <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={emailOrUsername}
                        onChange={(e) => { setEmailOrUsername(e.target.value); setErrorMsg(''); }}
                        placeholder="contoh@email.com"
                        className="w-full px-3.5 py-3 text-xs font-bold rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 bg-white"
                      />
                    </div>
                  )}

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">
                      Kata sandi <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrorMsg(''); }}
                        placeholder="kata sandi"
                        className="w-full px-3.5 py-3 pr-10 text-xs font-bold rounded-xl border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/10 bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 focus:outline-none cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Forgot Password Link */}
                  <div className="text-left">
                    <button
                      type="button"
                      onClick={() => alert('Fitur reset password via OTP WhatsApp sedang disiapkan.')}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      Lupa Kata Sandi?
                    </button>
                  </div>

                  {/* Error Notification */}
                  {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 text-center animate-shake">
                      {errorMsg}
                    </div>
                  )}

                  {/* Main Blue Login Button */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50 mt-2"
                  >
                    {isLoading ? 'Memverifikasi Akun...' : 'Login'}
                  </button>
                </form>

                {/* Switch to Register */}
                <div className="pt-2 text-center text-xs font-semibold text-slate-600">
                  <span>Belum punya akun? </span>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('register'); setRegStep(1); setErrorMsg(''); }}
                    className="font-extrabold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Daftar {currentRole.appName}
                  </button>
                </div>
              </div>
            )}

            {/* ================= 3. REGISTRATION FORM (3 STEPS) ================= */}
            {authMode === 'register' && (
              <div className="space-y-4 animate-fade-in">
                
                {/* Step indicator */}
                <div className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-black">
                  Langkah {regStep} / 2
                </div>

                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  {regStep === 1 ? (
                    <>
                      <p className="text-xs text-slate-600 font-medium">
                        Silahkan masukkan <strong>nomor Whatsapp</strong> Anda, kami akan mengirim kode OTP untuk verifikasi.
                      </p>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Nomor Whatsapp <span className="text-rose-500">*</span>
                        </label>
                        <div className="flex rounded-xl border border-slate-300 overflow-hidden focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-500/10">
                          <div className="px-3 bg-slate-50 border-r border-slate-200 flex items-center gap-1.5 text-xs font-bold text-slate-700">
                            <span>🇮🇩</span>
                            <span className="text-slate-400">▾</span>
                          </div>
                          <input
                            type="tel"
                            required
                            value={phoneNumber}
                            onChange={(e) => { setPhoneNumber(e.target.value); setErrorMsg(''); }}
                            placeholder="81234567890"
                            className="flex-1 px-3.5 py-3 text-xs font-bold text-slate-900 placeholder-slate-400 focus:outline-none bg-white"
                          />
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <p className="text-xs text-slate-600 font-medium">
                        Lengkapi profil bisnis laundry Anda untuk mengaktifkan lisensi trial 14 hari:
                      </p>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Nama Pemilik <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={regOwnerName}
                          onChange={(e) => setRegOwnerName(e.target.value)}
                          placeholder="Nama lengkap Anda"
                          className="w-full px-3.5 py-3 text-xs font-bold rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">
                          Nama Gerai Laundry <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={regBusinessName}
                          onChange={(e) => setRegBusinessName(e.target.value)}
                          placeholder="Contoh: Berkah Laundry Express"
                          className="w-full px-3.5 py-3 text-xs font-bold rounded-xl border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 bg-white"
                        />
                      </div>
                    </>
                  )}

                  {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-600 text-center animate-shake">
                      {errorMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-extrabold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? 'Mengaktifkan Akun...' : regStep === 1 ? 'Berikutnya' : 'Selesaikan Pendaftaran'}
                  </button>
                </form>

                <div className="pt-2 text-center text-xs font-semibold text-slate-600">
                  <span>Sudah punya akun? </span>
                  <button
                    type="button"
                    onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
                    className="font-extrabold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
                  >
                    Login {currentRole.appName}
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* ================= BOTTOM CS & SUPPORT FOOTER ================= */}
          <div className="pt-6 border-t border-slate-100 text-center sm:text-left space-y-1 text-xs text-slate-500">
            <p className="font-semibold text-slate-400">Atau mengalami kesulitan?</p>
            <p className="font-bold">
              <a 
                href="https://wa.me/6289650846031" 
                target="_blank" 
                rel="noreferrer"
                className="text-blue-600 hover:underline font-extrabold"
              >
                Hubungi CS Kami
              </a>
              <span className="text-slate-400"> atau Telp ke (0341) 5082494</span>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
