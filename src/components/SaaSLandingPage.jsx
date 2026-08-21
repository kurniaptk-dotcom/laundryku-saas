import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Check, ArrowRight, ShieldCheck, Star, 
  Smartphone, Monitor, Printer, Truck, Camera, 
  BarChart3, Users, Clock, Award, HelpCircle, 
  Zap, ChevronRight, Phone, MessageCircle, MessageSquare, DollarSign,
  TrendingUp, Layers, CheckCircle2, Play, Building2, Package,
  Sun, Moon, MapPin, QrCode, Tag, Heart, ThumbsUp, Shield,
  ArrowUpRight, Crown, ChevronDown, RefreshCw, Send, Radio, Navigation
} from 'lucide-react';
import { SAAS_PLANS } from '../utils/saasHelper';
import { playPrinterSound, playWhatsAppPing, playWasherChime, playClickSound } from '../utils/soundEffects';

export default function SaaSLandingPage({
  onTryDemoPos,
  onOpenSuperAdmin,
  onOpenOwnerMobile,
  onOpenCourierApp,
  onOpenConsumerApp,
  onRegisterTenant,
  theme = 'light',
  onToggleTheme
}) {
  const [internalTheme, setInternalTheme] = useState(theme);
  const activeTheme = onToggleTheme ? theme : internalTheme;
  const isDark = activeTheme === 'dark';
  const [showDemoDropdown, setShowDemoDropdown] = useState(false);

  const toggleMode = () => {
    if (onToggleTheme) {
      onToggleTheme();
    } else {
      setInternalTheme(prev => prev === 'light' ? 'dark' : 'light');
    }
  };

  const [billingCycle, setBillingCycle] = useState('monthly'); // monthly, annual
  const [kgPerDay, setKgPerDay] = useState(120);
  const [pricePerKg, setPricePerKg] = useState(10000);
  const [selectedPlanForTrial, setSelectedPlanForTrial] = useState(null);
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [activeEcosystemTab, setActiveEcosystemTab] = useState('kasir'); // 'kasir' | 'konsumen' | 'kurir' | 'owner'

  // Interactive Live Playground State
  const [playgroundTab, setPlaygroundTab] = useState('receipt'); // 'receipt' | 'whatsapp' | 'iot' | 'courier'
  
  // 1. Receipt simulator state
  const [simCustomer, setSimCustomer] = useState('Aisyah Salsabila');
  const [simService, setSimService] = useState('Cuci Kering Lipat Express');
  const [simWeight, setSimWeight] = useState(4.5);
  const [simRate, setSimRate] = useState(10000);
  const [simScent, setSimScent] = useState('Sakura Blossom');
  const [simRack, setSimRack] = useState('A-14');
  const [simReceiptCopied, setSimReceiptCopied] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const [printKey, setPrintKey] = useState(1);
  const [paperFormat, setPaperFormat] = useState('receipt'); // 'receipt' | 'tag'
  const [paperTorn, setPaperTorn] = useState(false);

  // 2. WhatsApp simulator state
  const [simWaName, setSimWaName] = useState('Budi Pratama');
  const [simWaPhone, setSimWaPhone] = useState('0812-3456-7890');
  const [simWaStatus, setSimWaStatus] = useState('siap_diambil');
  const [simWaSent, setSimWaSent] = useState(false);

  // 3. IoT Simulator State
  const [iotRunning, setIotRunning] = useState(true);
  const [iotMachineName, setIotMachineName] = useState('Maytag Commercial Washer #02');
  const [iotTimeRemaining, setIotTimeRemaining] = useState(24);
  const [iotCycle, setIotCycle] = useState('Wash & Spin 35m');
  const [iotRpm, setIotRpm] = useState(1200);
  const [iotTemp, setIotTemp] = useState(45);
  const [iotDetergentFoam, setIotDetergentFoam] = useState(false);
  const [iotReverseSpin, setIotReverseSpin] = useState(false);

  // 4. Courier Radar Simulator
  const [courierProgress, setCourierProgress] = useState(45);
  const [courierMoving, setCourierMoving] = useState(true);
  const [courierTripType, setCourierTripType] = useState('delivery'); // 'delivery' | 'pickup'
  const [courierSpeed, setCourierSpeed] = useState(1); // 1 | 2 | 4

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState(null);
  const [phoneScreen, setPhoneScreen] = useState(0); // 0=Kasir, 1=Kurir, 2=Owner
  const [activeWorkflowStep, setActiveWorkflowStep] = useState(0); // 0=Book App, 1=Wash Cycle, 2=Steam Iron, 3=Fresh Folded

  // Auto-cycle phone screen every 3 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setPhoneScreen(prev => (prev + 1) % 3);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Auto-cycle workflow step every 4 seconds
  useEffect(() => {
    const wTimer = setInterval(() => {
      setActiveWorkflowStep(prev => (prev + 1) % 4);
    }, 4000);
    return () => clearInterval(wTimer);
  }, []);

  // Form & Registration Lifecycle State
  const [formName, setFormName] = useState('');
  const [formBusiness, setFormBusiness] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formCity, setFormCity] = useState('');
  const [formPaymentMethod, setFormPaymentMethod] = useState('trial'); // 'trial' | 'qris' | 'va'
  const [selectedVaBank, setSelectedVaBank] = useState('bca'); // 'bca' | 'mandiri' | 'bri' | 'bni'

  // Realistic Onboarding Steps: 'form' | 'provisioning' | 'success_ticket'
  const [trialStep, setTrialStep] = useState('form');
  const [provisioningProgress, setProvisioningProgress] = useState(0);
  const [provisioningText, setProvisioningText] = useState('Memvalidasi Data Usaha...');
  const [createdTenantData, setCreatedTenantData] = useState(null);

  // Auto tick IoT timer for lively feel
  useEffect(() => {
    let interval;
    if (iotRunning) {
      interval = setInterval(() => {
        setIotTimeRemaining(prev => (prev > 1 ? prev - 1 : 30));
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [iotRunning]);

  // Dedicated Courier Progress Timer
  useEffect(() => {
    let interval;
    if (courierMoving) {
      interval = setInterval(() => {
        setCourierProgress(prev => (prev >= 100 ? 0 : Math.min(100, prev + 2 * courierSpeed)));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [courierMoving, courierSpeed]);

  // ROI Calculator Math
  const monthlyRevenue = kgPerDay * pricePerKg * 30;
  const estimatedSavings = Math.round(monthlyRevenue * 0.08);
  const potentialGrowth = Math.round(monthlyRevenue * 0.25);

  const handleOpenTrial = (plan) => {
    setSelectedPlanForTrial(plan);
    setTrialStep('form');
    setProvisioningProgress(0);
    setShowTrialModal(true);
  };

  const handleTrialSubmit = (e) => {
    e.preventDefault();
    if (!formName || !formBusiness || !formPhone) {
      alert('Mohon lengkapi nama pemilik, nama usaha laundry, dan nomor WhatsApp!');
      return;
    }

    const newTenant = {
      id: `TNT-${Math.floor(100 + Math.random() * 900)}`,
      businessName: formBusiness,
      ownerName: formName,
      ownerPhone: formPhone,
      city: formCity || 'Indonesia',
      planId: selectedPlanForTrial?.id || 'pro_unlimited',
      planName: selectedPlanForTrial?.name || 'Pro Unlimited',
      monthlyFee: selectedPlanForTrial?.priceMonthly || 250000,
      status: 'trial',
      joinDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysRemaining: 14,
      branchesCount: 1,
      totalOrdersProcessed: 0,
      totalRevenueProcessed: 0,
      whatsappQuotaUsed: 0,
      branding: {
        laundryName: formBusiness,
        tagline: 'Layanan Laundry Profesional & Higienis',
        address: `${formCity || 'Indonesia'}`,
        phone: formPhone,
        receiptFooter: 'Terima kasih atas kunjungan Anda!'
      }
    };

    setCreatedTenantData(newTenant);
    setTrialStep('provisioning');
    setProvisioningProgress(15);
    setProvisioningText('⚡ Memvalidasi Identitas & Nomor WhatsApp Mitra...');

    setTimeout(() => {
      setProvisioningProgress(55);
      setProvisioningText('☁️ Mengalokasikan Database Supabase Cloud Multi-Tenant...');
    }, 600);

    setTimeout(() => {
      setProvisioningProgress(90);
      setProvisioningText('🔑 Mengaktifkan Lisensi 14 Hari & Kredensial ERP...');
    }, 1200);

    setTimeout(() => {
      setProvisioningProgress(100);
      setTrialStep('success_ticket');
    }, 1800);
  };

  const handleLaunchPartnerPortal = (targetView) => {
    if (onRegisterTenant && createdTenantData) {
      onRegisterTenant(createdTenantData, targetView);
    }
    setShowTrialModal(false);
  };

  const handleCopyReceipt = () => {
    setSimReceiptCopied(true);
    setTimeout(() => setSimReceiptCopied(false), 2000);
  };

  return (
    <div className={`min-h-screen font-sans selection:bg-sky-500 selection:text-white antialiased overflow-x-hidden transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      {/* 1. SaaS Top Bar */}
      <nav className={`sticky top-0 z-50 backdrop-blur-xl border-b px-4 sm:px-8 py-3.5 flex justify-between items-center transition-colors ${
        isDark ? 'bg-slate-950/80 border-slate-800/80' : 'bg-white/85 border-slate-200/80 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-primary to-indigo-600 flex items-center justify-center text-white text-xl shadow-clay-sm">
            🧼
          </div>
          <div>
            <span className={`text-base sm:text-lg font-black tracking-tight flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
              <span>LaundryKu SaaS</span>
              <span className={`px-2 py-0.5 text-[10px] font-black rounded-full border ${
                isDark ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' : 'bg-sky-50 text-primary border-sky-200'
              }`}>
                B2B Platform
              </span>
            </span>
            <p className={`text-[10px] font-bold hidden sm:block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Software Kasir & ERP Laundry Terlengkap No. 1 di Indonesia
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 relative">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleMode}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title={isDark ? 'Beralih ke Mode Terang (Clean Light)' : 'Beralih ke Mode Gelap'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
            <span className="hidden md:inline">{isDark ? 'Mode Terang' : 'Mode Gelap'}</span>
          </button>

          {/* Masuk Portal Mitra Button */}
          <button
            onClick={onTryDemoPos}
            className={`px-3.5 sm:px-4 py-2 text-xs font-black rounded-xl border transition-all flex items-center gap-1.5 ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700' 
                : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs'
            }`}
          >
            <span>🔐 Masuk Portal Mitra</span>
          </button>

          <button
            onClick={() => handleOpenTrial(SAAS_PLANS[0])}
            className="px-4 sm:px-5 py-2 bg-gradient-to-r from-sky-400 via-primary to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-black shadow-clay-sm transition-all"
          >
            Daftar Trial 14 Hari →
          </button>
        </div>
      </nav>

      {/* 2. Hero Section — Interactive 2-Column */}
      <section className="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-8 max-w-7xl mx-auto">
        {/* Glow backdrop */}
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full blur-3xl -z-10 pointer-events-none ${
          isDark ? 'bg-primary/15' : 'bg-sky-200/50'
        }`}></div>

        {/* === 2-COLUMN GRID: Left=Text/CTA | Right=Interactive Animation === */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT: Tagline + Heading + CTA */}
          <div className="space-y-6 text-left">
            {/* Top Badge */}
            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black border ${
              isDark ? 'bg-slate-900/90 border-sky-500/30 text-sky-400' : 'bg-white border-sky-200 text-primary shadow-xs'
            }`}>
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-sky-500" />
              <span>Ekosistem 4-in-1 Terlengkap di Indonesia</span>
            </div>

            <h1 className={`text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Revolusi Bisnis Laundry Jadi{' '}
              <span className="bg-gradient-to-r from-sky-500 via-primary to-indigo-600 bg-clip-text text-transparent">
                Otomatis & Modern
              </span>
            </h1>

            <p className={`text-sm sm:text-base font-medium leading-relaxed max-w-lg ${
              isDark ? 'text-slate-300' : 'text-slate-600'
            }`}>
              Kasir POS pintar, tag pakaian anti-air, GPS kurir real-time, nota WhatsApp otomatis, hingga IoT mesin cuci — semua dalam <strong>satu platform</strong>.
            </p>

            {/* Feature Pills */}
            <div className="flex flex-wrap gap-2">
              {['🖨️ Cetak Tag Anti-Air', '💬 WA Otomatis', '🛵 GPS Kurir', '🌀 IoT Mesin', '📊 Owner Analytics'].map((feat, i) => (
                <span key={i} className={`px-3 py-1.5 rounded-full text-xs font-bold border ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700 shadow-xs'
                }`}>{feat}</span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                onClick={() => handleOpenTrial(SAAS_PLANS[0])}
                className="px-7 py-3.5 bg-gradient-to-r from-sky-400 via-primary to-indigo-600 hover:scale-105 active:scale-98 text-white rounded-2xl font-black text-sm shadow-clay-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Mulai Trial Gratis 14 Hari</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('pricing-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                  else handleOpenTrial(SAAS_PLANS[0]);
                }}
                className={`px-6 py-3.5 rounded-2xl font-black text-sm border transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  isDark ? 'bg-slate-900 hover:bg-slate-800 text-slate-200 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-soft'
                }`}
              >
                <span>Lihat Paket & Harga</span>
                <ChevronDown className="w-4 h-4 text-primary" />
              </button>
            </div>

            {/* Social Proof Mini */}
            <div className="flex items-center gap-4 pt-2">
              <div className="flex -space-x-2">
                {['🧑‍💼','👩‍💼','🧑‍🔧','👨‍💼'].map((e,i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 border-2 border-white flex items-center justify-center text-sm shadow-sm">{e}</div>
                ))}
              </div>
              <div>
                <p className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>500+ Mitra Aktif</p>
                <p className="text-[11px] text-amber-500 font-bold">⭐ 4.9 rating dari 200+ ulasan</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Ultra-Premium Glassmorphic Product Showcase */}
          <div className="relative w-full">
            {/* Ambient Backlight Glow */}
            <div className="absolute -inset-2 bg-gradient-to-r from-sky-500/20 via-primary/25 to-indigo-600/20 rounded-[40px] blur-2xl -z-10 animate-pulse"></div>

            {/* Floating Glass Toast 1: Live WA (Top Left) */}
            <div className="absolute -top-5 -left-4 sm:-left-6 z-30 hidden sm:flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-emerald-200 dark:border-emerald-800/80 shadow-xl shadow-emerald-500/10 backdrop-blur-xl animate-float">
              <div className="w-8 h-8 rounded-xl bg-emerald-500 text-white flex items-center justify-center text-sm font-black shadow-sm">
                💬
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Nota WhatsApp</span>
                </div>
                <p className="text-xs font-black text-slate-900 dark:text-white">Terkirim ke 0812-3456-7890 ✓</p>
              </div>
            </div>

            {/* Floating Glass Toast 2: Live IoT (Top Right) */}
            <div className="absolute -top-4 -right-4 sm:-right-6 z-30 hidden sm:flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-sky-200 dark:border-sky-800/80 shadow-xl shadow-sky-500/10 backdrop-blur-xl animate-float-delayed">
              <div className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center text-sm font-black shadow-sm">
                🌀
              </div>
              <div className="text-left">
                <span className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-wider">IoT Washer #02</span>
                <p className="text-xs font-black text-slate-900 dark:text-white">Spin 1200 RPM (Sisa 12m)</p>
              </div>
            </div>

            {/* Floating Glass Toast 3: GPS Courier (Bottom Left) */}
            <div className="absolute -bottom-5 -left-4 sm:-left-6 z-30 hidden sm:flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-amber-200 dark:border-amber-800/80 shadow-xl shadow-amber-500/10 backdrop-blur-xl animate-float-reverse">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center text-sm font-black shadow-sm">
                🛵
              </div>
              <div className="text-left">
                <span className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Live GPS Kurir</span>
                <p className="text-xs font-black text-slate-900 dark:text-white">Doni Pratama · 350m (ETA 4m)</p>
              </div>
            </div>

            {/* Floating Glass Toast 4: Tag Rak Anti-Air (Bottom Right) */}
            <div className="absolute -bottom-4 -right-4 sm:-right-6 z-30 hidden sm:flex items-center gap-3 px-3.5 py-2.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 border border-indigo-200 dark:border-indigo-800/80 shadow-xl shadow-indigo-500/10 backdrop-blur-xl animate-float">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center text-sm font-black shadow-sm">
                🏷️
              </div>
              <div className="text-left">
                <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">Tag Anti-Air</span>
                <p className="text-xs font-black text-slate-900 dark:text-white">Rak A-14 · No. #INV-982</p>
              </div>
            </div>

            {/* MAIN GLASS WINDOW CONTAINER */}
            <div className={`rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-300 ${
              isDark 
                ? 'bg-slate-900/90 border-slate-800 shadow-sky-500/10 text-white' 
                : 'bg-white/95 border-slate-200/90 shadow-slate-300/50 text-slate-900'
            }`}>

              {/* Window Titlebar */}
              <div className={`px-4 py-3 border-b flex items-center justify-between transition-colors ${
                isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50/90 border-slate-200/80'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-500/90"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-500/90"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-500/90"></div>
                  <span className={`text-xs font-black ml-2 flex items-center gap-2 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    <span>LaundryKu Pro Command Suite</span>
                    <span className="px-2 py-0.5 text-[9px] font-bold rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                      🟢 Live Sync
                    </span>
                  </span>
                </div>

                {/* Interactive Mode Tabs inside Window */}
                <div className="flex items-center gap-1 bg-slate-200/60 dark:bg-slate-800/60 p-1 rounded-xl">
                  {[
                    { id: 0, label: '📱 POS Kasir' },
                    { id: 1, label: '🛵 GPS Kurir' },
                    { id: 2, label: '📊 ERP Owner' }
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setPhoneScreen(tab.id)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black transition-all ${
                        phoneScreen === tab.id
                          ? 'bg-white dark:bg-slate-900 text-primary shadow-xs'
                          : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Window Body: High-Fidelity Multi-Device UI Layout */}
              <div className="p-4 sm:p-6 grid md:grid-cols-12 gap-4 items-stretch min-h-[360px]">

                {/* LEFT INNER PANEL: Interactive Suite UI (7 Cols) */}
                <div className="md:col-span-7 space-y-4 flex flex-col justify-between">
                  
                  {/* Active Screen Title Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary">
                        {phoneScreen === 0 ? 'Modul Kasir & Cetak Tag' : phoneScreen === 1 ? 'Modul Radar Antar-Jemput' : 'Modul ERP Analytics'}
                      </span>
                      <h3 className="text-base sm:text-lg font-black tracking-tight">
                        {phoneScreen === 0 ? 'Kasir POS & Struk Thermal Auto-Print' : phoneScreen === 1 ? 'Live GPS Tracking Kurir Real-Time' : 'Executive Sales & Profit Overview'}
                      </h3>
                    </div>
                    <span className="text-xl">
                      {phoneScreen === 0 ? '🧾' : phoneScreen === 1 ? '📍' : '📈'}
                    </span>
                  </div>

                  {/* SCREEN 0: KASIR POS SHOWCASE */}
                  {phoneScreen === 0 && (
                    <div className="space-y-3 animate-fade-in">
                      {/* Active Order Card */}
                      <div className={`p-3.5 rounded-2xl border ${
                        isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-sky-50/50 border-sky-100'
                      }`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400">Order #INV-2026-982</span>
                            <p className="text-xs font-black text-slate-900 dark:text-white">Aisyah Salsabila · 0812-3456-xxxx</p>
                          </div>
                          <span className="px-2 py-0.5 text-[10px] font-black rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                            Lunas · QRIS
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="mt-2.5 space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-600 dark:text-slate-300">🧺 Cuci Kering Lipat Express (4.5 Kg)</span>
                            <span className="text-primary font-black">Rp 45.000</span>
                          </div>
                          <div className="flex justify-between text-xs font-bold">
                            <span className="text-slate-600 dark:text-slate-300">✨ Parfum Sakura Premium & Anti-Bakteri</span>
                            <span className="text-emerald-600 font-black">GRATIS</span>
                          </div>
                        </div>

                        {/* Tag Rak Info */}
                        <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-slate-500">Nomor Rak Simpan:</span>
                          <span className="font-black px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20">
                            🏷️ RAK A-14 (Siap Diambil)
                          </span>
                        </div>
                      </div>

                      {/* Action Status Pills */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 flex items-center gap-2">
                          <span className="text-base">💬</span>
                          <div>
                            <p className="text-[10px] font-black text-emerald-700 dark:text-emerald-400">Nota WA Otomatis</p>
                            <p className="text-[9px] text-slate-500 font-bold">Terkirim instan saat bayar</p>
                          </div>
                        </div>
                        <div className="p-2.5 rounded-xl border border-sky-200 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-950/20 flex items-center gap-2">
                          <span className="text-base">🖨️</span>
                          <div>
                            <p className="text-[10px] font-black text-sky-700 dark:text-sky-400">Tag Struk Thermal</p>
                            <p className="text-[9px] text-slate-500 font-bold">Anti-air & tidak luntur</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 1: GPS KURIR SHOWCASE */}
                  {phoneScreen === 1 && (
                    <div className="space-y-3 animate-fade-in">
                      {/* Radar Map Frame */}
                      <div className="relative h-32 rounded-2xl border border-emerald-200 dark:border-emerald-900/60 overflow-hidden bg-emerald-950/10">
                        <div className="absolute inset-0 opacity-15" style={{backgroundImage:'linear-gradient(#0284c7 1px,transparent 1px),linear-gradient(90deg,#0284c7 1px,transparent 1px)',backgroundSize:'16px 16px'}}></div>
                        
                        {/* Animated Route Line */}
                        <svg className="absolute inset-0 w-full h-full">
                          <path d="M 30 90 Q 120 110 180 50 T 280 30" fill="none" stroke="#10b981" strokeWidth="3" strokeDasharray="6 4" className="animate-route-flow"/>
                        </svg>

                        {/* Outlet Location Marker */}
                        <div className="absolute left-6 bottom-4 flex items-center gap-1 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl shadow-md border text-[10px] font-black">
                          <span>🧼</span>
                          <span>Outlet Laundry</span>
                        </div>

                        {/* Customer Marker */}
                        <div className="absolute right-6 top-3 flex items-center gap-1 bg-rose-500 text-white px-2 py-1 rounded-xl shadow-md text-[10px] font-black animate-pulse">
                          <span>📍</span>
                          <span>Rumah Konsumen</span>
                        </div>

                        {/* Scooter Marker */}
                        <div className="absolute animate-scooter" style={{bottom:'40px', left:'30px'}}>
                          <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm shadow-xl ring-4 ring-emerald-300/40">
                            🛵
                          </div>
                        </div>
                      </div>

                      {/* Courier Info */}
                      <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-black text-xs shadow-sm">
                            DP
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-900 dark:text-white">Doni Pratama (Kurir)</p>
                            <p className="text-[10px] text-slate-500 font-semibold">Honda Vario · B 4981 TZX · Rating 4.95 ⭐</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          Menuju Lokasi
                        </span>
                      </div>
                    </div>
                  )}

                  {/* SCREEN 2: OWNER ERP SHOWCASE */}
                  {phoneScreen === 2 && (
                    <div className="space-y-3 animate-fade-in">
                      {/* Metric Tiles */}
                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Omzet Hari Ini</span>
                          <p className="text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5">Rp 1.480.000</p>
                          <span className="text-[9px] font-bold text-emerald-500">▲ +18.4% dari kemarin</span>
                        </div>
                        <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Total Cucian</span>
                          <p className="text-base font-black text-primary mt-0.5">142.5 Kg</p>
                          <span className="text-[9px] font-bold text-sky-500">38 Nota Selesai</span>
                        </div>
                      </div>

                      {/* Weekly Trend Bar Chart */}
                      <div className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-[10px] font-black text-slate-700 dark:text-slate-300">Grafik Omzet 7 Hari Terakhir</span>
                          <span className="text-[9px] font-bold text-primary">Target 100% Tercapai</span>
                        </div>
                        <div className="flex items-end gap-1.5 h-14 pt-1">
                          {[45, 60, 50, 85, 70, 92, 100].map((h, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                              <div 
                                className="w-full rounded-t-md bg-gradient-to-t from-primary to-sky-400 group-hover:brightness-110 transition-all animate-chart-grow"
                                style={{ height: `${h}%`, animationDelay: `${i * 0.08}s` }}
                              ></div>
                              <span className="text-[8px] font-bold text-slate-400">{['Sen','Sel','Rab','Kam','Jum','Sab','Ming'][i]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Control Bar Footer inside Left Panel */}
                  <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-[11px]">
                    <span className="font-bold text-slate-400">Status Sistem:</span>
                    <span className="font-black text-primary flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Semua Modul Terhubung Real-Time
                    </span>
                  </div>
                </div>

                {/* RIGHT INNER PANEL: Sleek Smartphone Device Mockup (5 Cols) */}
                <div className="md:col-span-5 flex flex-col items-center justify-center pt-2 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-4">
                  
                  {/* Smartphone Frame */}
                  <div className={`relative w-[185px] sm:w-[200px] rounded-[38px] border-[6px] shadow-2xl overflow-hidden transition-all duration-300 ${
                    isDark ? 'border-slate-800 bg-slate-950' : 'border-slate-900 bg-slate-900'
                  }`} style={{ aspectRatio: '9/19' }}>
                    
                    {/* Status Bar */}
                    <div className="bg-slate-900 px-3.5 py-1.5 flex justify-between items-center text-white">
                      <span className="text-[9px] font-black">9:41</span>
                      <div className="w-12 h-3.5 bg-slate-950 rounded-full mx-auto"></div>
                      <span className="text-[8px] font-bold">100%</span>
                    </div>

                    {/* Dynamic Smartphone Screen */}
                    <div className="bg-white text-slate-900 h-full flex flex-col justify-between overflow-hidden">
                      
                      {phoneScreen === 0 && (
                        <div className="p-3 space-y-2 animate-phone-in">
                          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-2.5 rounded-2xl text-white">
                            <span className="text-[8px] font-bold opacity-80 uppercase">Kasir Mobile</span>
                            <p className="text-xs font-black">Bayar via QRIS</p>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-[9px]">
                            <div className="flex justify-between font-bold"><span>Laundry Lipat</span><span>4.5 kg</span></div>
                            <div className="flex justify-between font-black text-primary"><span>Total</span><span>Rp 45.000</span></div>
                          </div>
                          <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-[9px] font-bold text-emerald-700 flex items-center gap-1">
                            <span>✓</span> Nota WA Terkirim ke Konsumen
                          </div>
                        </div>
                      )}

                      {phoneScreen === 1 && (
                        <div className="p-3 space-y-2 animate-phone-in">
                          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-2.5 rounded-2xl text-white">
                            <span className="text-[8px] font-bold opacity-80 uppercase">Kurir Radar</span>
                            <p className="text-xs font-black">Penjemputan Aktif</p>
                          </div>
                          <div className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-[9px] font-bold space-y-1">
                            <p className="text-slate-800">Aisyah Salsabila</p>
                            <p className="text-slate-400">Jl. Melati No. 42 (350m)</p>
                            <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-1">
                              <div className="bg-emerald-500 h-full w-[70%]"></div>
                            </div>
                          </div>
                        </div>
                      )}

                      {phoneScreen === 2 && (
                        <div className="p-3 space-y-2 animate-phone-in">
                          <div className="bg-gradient-to-r from-violet-600 to-purple-700 p-2.5 rounded-2xl text-white">
                            <span className="text-[8px] font-bold opacity-80 uppercase">Owner App</span>
                            <p className="text-xs font-black">Laporan Hari Ini</p>
                          </div>
                          <div className="grid grid-cols-2 gap-1 text-[9px]">
                            <div className="p-1.5 bg-slate-50 rounded-lg border">
                              <span className="text-[7px] text-slate-400">Omzet</span>
                              <p className="font-black text-emerald-600">Rp 1.48M</p>
                            </div>
                            <div className="p-1.5 bg-slate-50 rounded-lg border">
                              <span className="text-[7px] text-slate-400">Order</span>
                              <p className="font-black text-primary">38 Nota</p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Bottom Phone Bar */}
                      <div className="p-2 text-center border-t border-slate-100">
                        <span className="text-[9px] font-black text-slate-500">
                          App Pelanggan & Kurir
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Dots indicator */}
                  <div className="flex items-center gap-1.5 mt-3">
                    {[0, 1, 2].map(i => (
                      <button
                        key={i}
                        onClick={() => setPhoneScreen(i)}
                        className={`h-2 rounded-full transition-all ${
                          phoneScreen === i ? 'w-6 bg-primary' : 'w-2 bg-slate-300 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

        {/* Social Proof Stats — full width below */}
        <div className="pt-10 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { value: '500+', label: 'Mitra Laundry Aktif', sub: 'Di 45+ Kota Indonesia' },
            { value: '99.9%', label: 'Uptime Cloud Server', sub: 'Aman 24 Jam Nonstop' },
            { value: '1.2 Juta', label: 'Struk WA Terkirim', sub: 'Rp 0 Biaya Kertas' },
            { value: '4.9 ⭐', label: 'Kepuasan Pengusaha', sub: 'Rating Ulasan Mitra' },
          ].map((item, idx) => (
            <div key={idx} className={`p-4 sm:p-5 rounded-2xl border transition-all text-left ${
              isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-xs hover:shadow-md'
            }`}>
              <p className="text-xl sm:text-2xl font-black text-primary">{item.value}</p>
              <p className={`text-xs font-black mt-0.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{item.label}</p>
              <p className={`text-[10px] font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{item.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. 🎮 🌟 LIVE INTERACTIVE PLAYGROUND / SIMULATOR WIDGET */}
      <section className={`py-16 px-4 sm:px-8 border-t transition-colors ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-sky-50/60 border-sky-200'
      }`}>
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-primary uppercase tracking-widest flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span>Interactive Feature Simulator</span>
            </span>
            <h2 className={`text-2xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Coba Langsung Fitur Unggulan Tanpa Perlu Daftar
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Pilih tab di bawah untuk melihat bagaimana struk thermal tercetak, nota WA terkirim otomatis, dan mesin IoT berputar.
            </p>

            {/* Playground Selector Tabs */}
            <div className={`inline-flex p-1.5 rounded-2xl border gap-1 mt-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
            }`}>
              {[
                { id: 'receipt', label: '🖨️ Struk & Tag Anti-Air' },
                { id: 'whatsapp', label: '💬 Notifikasi WA Otomatis' },
                { id: 'iot', label: '🌀 Mesin Cuci IoT' },
                { id: 'courier', label: '🛵 Live GPS Kurir' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setPlaygroundTab(tab.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                    playgroundTab === tab.id
                      ? 'bg-primary text-white shadow-clay-sm'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* PLAYGROUND TAB 1: STRUK THERMAL & TAG RAK (SMOOTH & PURE WHITE) */}
          {playgroundTab === 'receipt' && (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {/* Left Controls */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20">
                    BLUETOOTH THERMAL PRINTER 58MM & TAG ANTI-AIR
                  </span>
                  <h3 className={`text-lg font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Simulasi Cetak Struk & Label Tag Baju:
                  </h3>
                  <p className={`text-xs font-semibold mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Pilih format cetak, ubah data order, atau tekan tombol cetak untuk melihat animasi kertas putih thermal keluar dari printer Bluetooth!
                  </p>
                </div>

                {/* Print Format Toggle (Struk vs Tag Anti-Air) */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Pilih Format Cetak:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPaperFormat('receipt');
                        setPaperTorn(false);
                        setPrintKey(prev => prev + 1);
                        setIsPrinting(true);
                        setTimeout(() => setIsPrinting(false), 1800);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 ${
                        paperFormat === 'receipt'
                          ? 'bg-primary text-white border-primary shadow-clay-sm'
                          : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Printer className="w-4 h-4" />
                      <span>Struk Kasir 58mm</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPaperFormat('tag');
                        setPaperTorn(false);
                        setPrintKey(prev => prev + 1);
                        setIsPrinting(true);
                        setTimeout(() => setIsPrinting(false), 1800);
                      }}
                      className={`p-2.5 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 ${
                        paperFormat === 'tag'
                          ? 'bg-primary text-white border-primary shadow-clay-sm'
                          : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Tag className="w-4 h-4" />
                      <span>Tag Baju Anti-Air</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nama Pelanggan:</label>
                    <input
                      type="text"
                      value={simCustomer}
                      onChange={(e) => {
                        setSimCustomer(e.target.value);
                        setPaperTorn(false);
                        setPrintKey(prev => prev + 1);
                        setIsPrinting(true);
                        setTimeout(() => setIsPrinting(false), 1800);
                      }}
                      className={`w-full p-2.5 text-xs font-bold rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        isDark 
                          ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' 
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-xs'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Pilihan Layanan:</label>
                    <select
                      value={simService}
                      onChange={(e) => {
                        setSimService(e.target.value);
                        setPaperTorn(false);
                        setPrintKey(prev => prev + 1);
                        setIsPrinting(true);
                        setTimeout(() => setIsPrinting(false), 1800);
                      }}
                      className={`w-full p-2.5 text-xs font-bold rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer ${
                        isDark 
                          ? 'bg-slate-950 border-slate-800 text-white' 
                          : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                      }`}
                    >
                      <option value="Cuci Kering Lipat Express">Cuci Kering Lipat Express (Rp 10.000/kg)</option>
                      <option value="Cuci Setrika Reguler">Cuci Setrika Reguler (Rp 8.000/kg)</option>
                      <option value="Dry Clean Bedcover King">Dry Clean Bedcover King (Rp 35.000/pcs)</option>
                      <option value="Cuci Sepatu Sneaker Premium">Cuci Sepatu Sneaker Premium (Rp 30.000/psg)</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div className="flex justify-between text-[11px] font-bold text-slate-500">
                        <span>Berat / Jumlah:</span>
                        <span className="text-primary font-black">{simWeight} kg</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="15"
                        step="0.5"
                        value={simWeight}
                        onChange={(e) => {
                          setSimWeight(Number(e.target.value));
                          setPaperTorn(false);
                          setPrintKey(prev => prev + 1);
                          setIsPrinting(true);
                          setTimeout(() => setIsPrinting(false), 1800);
                        }}
                        className="w-full accent-primary mt-1 cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nomor Rak:</label>
                      <input
                        type="text"
                        value={simRack}
                        onChange={(e) => {
                          setSimRack(e.target.value);
                          setPaperTorn(false);
                          setPrintKey(prev => prev + 1);
                          setIsPrinting(true);
                          setTimeout(() => setIsPrinting(false), 1800);
                        }}
                        className={`w-full p-2 text-xs font-bold rounded-xl border text-center font-mono transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          isDark 
                            ? 'bg-slate-950 border-slate-800 text-white' 
                            : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      playPrinterSound();
                      setPaperTorn(false);
                      setIsPrinting(true);
                      setPrintKey(prev => prev + 1);
                      setSimReceiptCopied(true);
                      setTimeout(() => {
                        setIsPrinting(false);
                        setSimReceiptCopied(false);
                      }, 2000);
                    }}
                    className="flex-1 min-w-[180px] py-3 bg-gradient-to-r from-sky-400 via-primary to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-black shadow-clay-sm flex items-center justify-center gap-2 transition-all"
                  >
                    <Printer className="w-4 h-4 animate-bounce" />
                    <span>{isPrinting ? 'Mencetak Struk Halus... 🖨️' : 'Simulasi Cetak Struk Bluetooth'}</span>
                  </button>

                  <button
                    onClick={() => {
                      playPrinterSound();
                      window.print();
                    }}
                    className={`py-3 px-3 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-800 border-slate-200'
                    }`}
                    title="Cetak via dialog printer browser asli / Simpan PDF"
                  >
                    <span>📄</span>
                    <span>Cetak PDF Asli</span>
                  </button>

                  <button
                    onClick={() => {
                      playClickSound();
                      setPaperTorn(!paperTorn);
                    }}
                    className={`py-3 px-3.5 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 ${
                      paperTorn
                        ? 'bg-amber-500 text-white border-amber-600'
                        : isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                    title="Potong kertas dari cutter printer"
                  >
                    <span>✂️</span>
                    <span>{paperTorn ? 'Kertas Terpotong' : 'Potong Kertas'}</span>
                  </button>
                </div>

                {/* Info Badges */}
                <div className={`p-3 rounded-2xl border text-xs space-y-1.5 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                }`}>
                  <p className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Format Kertas Putih Bersih (Crisp Thermal Paper)</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-[11px] font-bold text-sky-600">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Mendukung cetak QRIS, Barcode, & Tag Anti-Air Nomor Rak</span>
                  </p>
                </div>
              </div>

              {/* Right: 3D Thermal Printer Housing & Smooth Pure White Paper Feed */}
              <div className="lg:col-span-6 flex flex-col items-center">
                
                {/* 1. THERMAL PRINTER CASING (TOP HEAD) */}
                <div className={`w-80 rounded-t-3xl p-4 border-2 shadow-2xl space-y-2 relative overflow-hidden transition-all ${
                  isDark 
                    ? 'bg-gradient-to-b from-slate-800 via-slate-900 to-black border-slate-700 text-white' 
                    : 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-slate-700 text-white shadow-xl'
                }`}>
                  {/* Top Status Bar with LEDs */}
                  <div className="flex justify-between items-center text-[10px] font-mono">
                    <div className="flex items-center gap-1.5">
                      <span className="font-black text-slate-200">EPSON POS-58BT</span>
                      <span className="text-[8px] px-1.5 py-0.2 bg-slate-700 text-slate-300 rounded font-bold">58MM</span>
                    </div>

                    {/* Status LEDs */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]"></span>
                        <span className="text-[8px] text-slate-400">PWR</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`w-2 h-2 rounded-full ${isPrinting ? 'bg-sky-400 animate-ping shadow-[0_0_8px_#38bdf8]' : 'bg-sky-500'}`}></span>
                        <span className="text-[8px] text-slate-400">BT</span>
                      </div>
                      {isPrinting && (
                        <div className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                          <span className="text-[8px] text-amber-300 font-bold">PRINT</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Printer Mouth / Exit Slit with serrated metallic cutter */}
                  <div className="relative pt-1">
                    <div className={`h-2.5 bg-black rounded-sm border-y border-slate-600 relative overflow-hidden flex items-center justify-center ${
                      isPrinting ? 'animate-printer-glow' : ''
                    }`}>
                      {/* Active Blue Optical Print Scan Beam */}
                      {isPrinting && (
                        <div className="absolute inset-y-0 w-24 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-print-beam opacity-90 blur-xs"></div>
                      )}
                      <div className="w-3/4 h-0.5 bg-slate-800"></div>
                    </div>
                    {/* Serrated metallic cutter teeth */}
                    <div className="flex justify-between px-1 text-[7px] text-slate-500 font-mono select-none tracking-tighter">
                      <span>▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲</span>
                    </div>
                  </div>
                </div>

                {/* 2. ANIMATED PAPER FEED ROLLING OUT (PURE CRISP WHITE) */}
                <div 
                  key={printKey} 
                  className={`w-72 bg-white text-slate-900 rounded-b-2xl border border-slate-200 font-mono text-[11px] space-y-3 p-5 animate-print-smooth relative transform -mt-1 origin-top transition-all ${
                    paperTorn ? 'animate-paper-tear shadow-2xl mt-3' : 'shadow-xl'
                  }`}
                  style={{
                    boxShadow: '0 20px 35px -8px rgba(0,0,0,0.12), 0 0 1px rgba(0,0,0,0.15)'
                  }}
                >
                  {/* Jagged Top Paper Edge */}
                  <div className="absolute -top-1.5 inset-x-0 h-1.5 bg-white [mask-image:radial-gradient(circle_at_bottom,transparent_3px,#ffffff_3px)] [mask-size:8px_5px]"></div>

                  {/* FORMAT 1: STRUK KASIR 58MM */}
                  {paperFormat === 'receipt' ? (
                    <>
                      {/* Receipt Header */}
                      <div className="text-center space-y-0.5 border-b border-dashed border-slate-300 pb-2.5">
                        <p className="font-black text-sm tracking-tight text-slate-900">BERKAH CLEAN LAUNDRY</p>
                        <p className="text-[9px] text-slate-500">Jl. Raya Darmo No. 45, Surabaya</p>
                        <p className="text-[9px] text-slate-500">WA: 0812-3456-7890 · Kasir POS 01</p>
                      </div>

                      <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between">
                          <span className="text-slate-500">NO. NOTA:</span>
                          <strong className="text-primary font-black">#INV-2405</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">TGL/WAKTU:</span>
                          <span className="font-bold text-slate-800">{new Date().toISOString().split('T')[0]} 14:05</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">PELANGGAN:</span>
                          <strong className="text-slate-900">{simCustomer}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">PARFUM:</span>
                          <strong className="text-slate-800">{simScent}</strong>
                        </div>
                        <div className="flex justify-between items-center pt-0.5">
                          <span className="text-slate-500">NOMOR RAK:</span>
                          <span className="px-2 py-0.5 bg-slate-950 text-white rounded font-black text-[10px]">
                            RAK {simRack}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-dashed border-slate-300 pt-2 space-y-1 text-[10px]">
                        <div className="flex justify-between text-slate-800">
                          <span className="truncate max-w-[150px] font-bold">{simService}</span>
                          <span className="font-mono">{simWeight} kg</span>
                        </div>
                        <div className="flex justify-between font-black text-xs pt-1.5 border-t border-slate-200 text-slate-900">
                          <span>TOTAL BAYAR:</span>
                          <span className="text-primary font-black">Rp {(simWeight * simRate).toLocaleString('id-ID')}</span>
                        </div>
                        <p className="text-[9px] text-emerald-600 font-black text-center pt-1">
                          [ LUNAS VIA QRIS / DANA ]
                        </p>
                      </div>

                      {/* QRIS & Barcode Scan */}
                      <div className="border-t border-dashed border-slate-300 pt-2 text-center space-y-1.5">
                        <p className="text-[9px] text-slate-500 font-bold">Scan QRIS / Lacak Progres Cucian:</p>
                        
                        {/* Simulated QR Code Box */}
                        <div className="w-16 h-16 mx-auto bg-slate-950 text-white flex flex-col items-center justify-center rounded-lg p-1 shadow-xs">
                          <QrCode className="w-10 h-10 text-white" />
                          <span className="text-[7px] font-mono mt-0.5">QRIS-2405</span>
                        </div>

                        {/* Barcode Simulation */}
                        <div className="pt-1 flex justify-center items-center gap-0.5 h-6">
                          {[3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 1, 2].map((w, i) => (
                            <span key={i} className="bg-slate-900 h-full" style={{ width: `${w * 1.5}px` }}></span>
                          ))}
                        </div>

                        <p className="text-[8px] text-slate-400 pt-0.5">
                          *** Terima kasih atas kunjungan Anda ***
                        </p>
                      </div>
                    </>
                  ) : (
                    /* FORMAT 2: TAG LABEL PAKAIAN ANTI-AIR */
                    <div className="space-y-3 text-center">
                      <div className="flex items-center justify-between border-b border-dashed border-slate-300 pb-2">
                        <span className="text-lg">📌</span>
                        <div className="text-right">
                          <span className="px-2 py-0.5 bg-sky-100 text-sky-700 text-[9px] font-black rounded-full border border-sky-200">
                            WATERPROOF TAG
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 font-bold uppercase">Nomor Rak & Nota:</p>
                        <div className="p-3 bg-slate-950 text-white rounded-2xl font-black text-2xl tracking-wider font-mono">
                          RAK {simRack}
                        </div>
                        <p className="text-xs font-black text-primary">#INV-2405</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-left text-[10px] space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Pelanggan:</span>
                          <strong className="text-slate-900">{simCustomer}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Layanan:</span>
                          <strong className="text-slate-800">{simService} ({simWeight}kg)</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Parfum:</span>
                          <strong className="text-slate-800">{simScent}</strong>
                        </div>
                      </div>

                      {/* Barcode */}
                      <div className="pt-1 flex justify-center items-center gap-0.5 h-8">
                        {[4, 2, 1, 3, 2, 4, 1, 3, 1, 4, 2, 3, 1, 4, 2, 1, 3, 2, 4].map((w, i) => (
                          <span key={i} className="bg-slate-950 h-full" style={{ width: `${w * 1.5}px` }}></span>
                        ))}
                      </div>
                      <p className="text-[8px] text-slate-400 font-bold">
                        TAHAN AIR 90°C · TAHAN STEAM · DRY CLEAN
                      </p>
                    </div>
                  )}

                  {/* Interactive Paper Action Buttons */}
                  <div className="pt-3 border-t border-slate-200 flex justify-center gap-1.5">
                    <button
                      onClick={() => setPaperTorn(!paperTorn)}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-[9px] font-black text-slate-700 flex items-center gap-1 transition-all"
                    >
                      <span>✂️</span>
                      <span>{paperTorn ? 'Pasang Kembali' : 'Sobek Kertas'}</span>
                    </button>

                    <button
                      onClick={handleCopyReceipt}
                      className="px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-[9px] font-black text-primary flex items-center gap-1 transition-all"
                    >
                      <Check className="w-3 h-3" />
                      <span>{simReceiptCopied ? 'Tersalin!' : 'Salin'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PLAYGROUND TAB 2: WHATSAPP NOTIFIKASI OTOMATIS */}
          {playgroundTab === 'whatsapp' && (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              <div className="lg:col-span-6 space-y-4 text-left">
                <h3 className={`text-lg font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Ubah Status & Kirim Notifikasi WA:
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nama Pelanggan:</label>
                    <input
                      type="text"
                      value={simWaName}
                      onChange={(e) => setSimWaName(e.target.value)}
                      className={`w-full p-2.5 text-xs font-bold rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        isDark 
                          ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' 
                          : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 shadow-xs'
                      }`}
                    />
                  </div>

                  <div>
                    <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Pilih Status Cucian Saat Ini:</label>
                    <select
                      value={simWaStatus}
                      onChange={(e) => setSimWaStatus(e.target.value)}
                      className={`w-full p-2.5 text-xs font-bold rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer ${
                        isDark 
                          ? 'bg-slate-950 border-slate-800 text-white' 
                          : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                      }`}
                    >
                      <option value="diterima">1. Order Diterima di Gerai Kasir</option>
                      <option value="dicuci">2. Sedang Dicuci & Dikeringkan</option>
                      <option value="siap_diambil">3. Selesai & Siap Diambil / Diantar</option>
                      <option value="sedang_diantar">4. Kurir Sedang Menuju Rumah</option>
                    </select>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSimWaSent(true);
                      setTimeout(() => setSimWaSent(false), 2500);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-clay-sm flex items-center gap-1.5 transition-all"
                  >
                    <Send className="w-4 h-4" />
                    <span>{simWaSent ? 'Notifikasi Terkirim ke WhatsApp ✓' : 'Simulasikan Kirim Pesan WA'}</span>
                  </button>
                </div>
              </div>

              {/* Realistic WhatsApp Chat Bubble */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-80 bg-[#075E54] text-white p-3.5 rounded-3xl shadow-2xl space-y-3">
                  {/* WA Header */}
                  <div className="flex items-center gap-2.5 pb-2 border-b border-emerald-700/50">
                    <div className="w-9 h-9 rounded-full bg-white text-slate-900 flex items-center justify-center font-black text-xs">
                      🧺
                    </div>
                    <div>
                      <p className="text-xs font-black flex items-center gap-1">
                        <span>Berkah Clean Laundry</span>
                        <span className="w-3.5 h-3.5 bg-emerald-500 rounded-full text-[9px] flex items-center justify-center">✓</span>
                      </p>
                      <p className="text-[10px] text-emerald-200">Official Business Account</p>
                    </div>
                  </div>

                  {/* WA Bubble */}
                  <div className="bg-[#DCF8C6] text-slate-900 p-3 rounded-2xl rounded-tl-none shadow text-[11px] space-y-1.5 font-sans leading-relaxed">
                    <p className="font-bold">
                      Halo Kak <strong>{simWaName}</strong>! 👋
                    </p>
                    <p>
                      {simWaStatus === 'diterima' && `Pesanan laundry Kakak (#INV-2405) seberat 4.5kg telah kami terima di gerai.`}
                      {simWaStatus === 'dicuci' && `Cucian Kakak (#INV-2405) sedang dalam proses pencucian & pengeringan dengan deterjen higienis.`}
                      {simWaStatus === 'siap_diambil' && `Kabar gembira! Cucian Kakak (#INV-2405) sudah SELESAI, wangi, dan rapi di Rak A-14. Silakan diambil ya Kak! ✨`}
                      {simWaStatus === 'sedang_diantar' && `Kurir kami Doni Pratama sedang dalam perjalanan mengantar cucian Kakak ke alamat tujuan 🛵`}
                    </p>
                    <div className="p-2 bg-white/80 rounded-xl space-y-0.5 border border-emerald-200 text-[10px]">
                      <p>🧺 <strong>Layanan:</strong> Cuci Kering Lipat (4.5 kg)</p>
                      <p>💰 <strong>Total:</strong> Rp 45.000 [LUNAS QRIS]</p>
                      <p className="text-primary font-bold">🔗 Lacak Live: laundryku.id/track/2405</p>
                    </div>
                    <div className="flex justify-end text-[9px] text-slate-500 font-semibold gap-1">
                      <span>14:05</span>
                      <span className="text-sky-500">✓✓</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PLAYGROUND TAB 3: IOT MESIN CUCI REALISTIS & INTERAKTIF */}
          {playgroundTab === 'iot' && (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {/* Left Controls & Telemetry */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20">
                    SMART IoT SENSOR TELEMETRY
                  </span>
                  <h3 className={`text-lg font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Simulasi Mesin Cuci Commercial & Sensor IoT:
                  </h3>
                  <p className={`text-xs font-semibold mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Coba ganti kecepatan putaran (RPM), suntik deterjen, atau ubah siklus untuk melihat drum, pakaian, dan gelombang air berputar secara real-time!
                  </p>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Pilih Unit Mesin:</label>
                    <select
                      value={iotMachineName}
                      onChange={(e) => setIotMachineName(e.target.value)}
                      className={`w-full p-2.5 text-xs font-bold rounded-xl border transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer ${
                        isDark 
                          ? 'bg-slate-950 border-slate-800 text-white' 
                          : 'bg-white border-slate-300 text-slate-900 shadow-xs'
                      }`}
                    >
                      <option value="Maytag Commercial Washer #02">Maytag Commercial Washer #02 (10 kg)</option>
                      <option value="LG Giant C Pro Washer #01">LG Giant C Pro Washer #01 (15 kg)</option>
                      <option value="SpeedQueen Heavy Washer #03">SpeedQueen Heavy Washer #03 (16 kg)</option>
                    </select>
                  </div>

                  {/* RPM Speed Selector */}
                  <div>
                    <div className="flex justify-between items-center">
                      <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Kecepatan Putaran Drum (RPM):</label>
                      <span className="text-xs font-black text-primary">{iotRpm} RPM</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1.5 mt-1.5">
                      {[
                        { rpm: 600, label: '600 (Delicate)' },
                        { rpm: 900, label: '900 (Normal)' },
                        { rpm: 1200, label: '1200 (Turbo)' },
                        { rpm: 1400, label: '1400 (Max)' },
                      ].map(item => (
                        <button
                          key={item.rpm}
                          type="button"
                          onClick={() => setIotRpm(item.rpm)}
                          className={`py-1.5 px-1 rounded-xl text-[10px] font-black transition-all border ${
                            iotRpm === item.rpm
                              ? 'bg-primary text-white border-primary shadow-clay-sm'
                              : isDark 
                                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' 
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Temperature Selector */}
                  <div>
                    <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Suhu Air & Program:</label>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      {[
                        { temp: 30, label: '❄️ Dingin (30°C)', cycle: 'Eco Rinse 20m' },
                        { temp: 45, label: '♨️ Hangat (45°C)', cycle: 'Wash & Spin 35m' },
                        { temp: 60, label: '🔥 Steam (60°C)', cycle: 'Heavy Steam Bedcover' },
                      ].map(item => (
                        <button
                          key={item.temp}
                          type="button"
                          onClick={() => {
                            setIotTemp(item.temp);
                            setIotCycle(item.cycle);
                          }}
                          className={`p-2.5 rounded-xl text-left transition-all border ${
                            iotTemp === item.temp
                              ? isDark
                                ? 'bg-sky-950/80 border-primary text-sky-300 font-black ring-1 ring-primary'
                                : 'bg-sky-50 border-primary text-primary font-black ring-1 ring-primary shadow-xs'
                              : isDark 
                                ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white' 
                                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <p className={`text-[11px] font-black ${
                            iotTemp === item.temp
                              ? isDark ? 'text-sky-300' : 'text-primary'
                              : isDark ? 'text-slate-300' : 'text-slate-800'
                          }`}>
                            {item.label}
                          </p>
                          <p className={`text-[9px] truncate font-medium ${
                            iotTemp === item.temp
                              ? isDark ? 'text-sky-400' : 'text-primary/80'
                              : 'text-slate-500'
                          }`}>
                            {item.cycle}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Interactive Action Buttons */}
                <div className="pt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setIotRunning(!iotRunning)}
                    className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-black shadow-clay-sm flex items-center justify-center gap-1.5 transition-all ${
                      iotRunning
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Zap className="w-4 h-4" />
                    <span>{iotRunning ? 'Pause Putaran Mesin' : 'Nyalakan Putaran Mesin'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIotDetergentFoam(true);
                      setTimeout(() => setIotDetergentFoam(false), 4000);
                    }}
                    className={`py-2.5 px-3.5 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 ${
                      iotDetergentFoam
                        ? 'bg-sky-500 text-white border-sky-400 animate-bounce'
                        : isDark ? 'bg-slate-800 hover:bg-slate-700 text-sky-300 border-slate-700' : 'bg-sky-50 hover:bg-sky-100 text-primary border-sky-200'
                    }`}
                    title="Injeksi deterjen otomatis & perbanyak busa sabun"
                  >
                    <span>🧴</span>
                    <span>{iotDetergentFoam ? 'Busa Sabun Disuntik! ✨' : '+ Suntik Deterjen'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIotReverseSpin(!iotReverseSpin)}
                    className={`p-2.5 rounded-xl text-xs font-black border transition-all ${
                      isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                    title="Putar Balik Arah Putaran Drum (Reverse Cycle)"
                  >
                    <RefreshCw className={`w-4 h-4 ${iotReverseSpin ? 'rotate-180 text-primary' : ''} transition-transform`} />
                  </button>
                </div>

                {/* IoT Live Sensor Telemetry Badge Bar */}
                <div className={`p-3 rounded-2xl border grid grid-cols-4 gap-2 text-center text-xs ${
                  isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Daya Listrik</p>
                    <p className="text-xs font-black text-amber-500 font-mono">{iotRunning ? Math.round(iotRpm * 0.55 + 180) : 15} W</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Getaran</p>
                    <p className="text-xs font-black text-emerald-500 font-mono">{iotRunning ? (iotRpm > 1200 ? '0.48 G' : '0.24 G') : '0.00 G'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Debit Air</p>
                    <p className="text-xs font-black text-sky-500 font-mono">{iotRunning ? '14.2 L/m' : '0.0 L/m'}</p>
                  </div>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">Suhu Air</p>
                    <p className="text-xs font-black text-rose-500 font-mono">{iotTemp}°C</p>
                  </div>
                </div>
              </div>

              {/* Right: Hyper-Realistic 3D Front-Loading Commercial Washing Machine */}
              <div className="lg:col-span-6 flex justify-center">
                <div className={`w-80 sm:w-88 rounded-3xl p-5 border-2 shadow-2xl space-y-3.5 relative overflow-hidden transition-all ${
                  isDark 
                    ? 'bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 border-slate-700 text-white' 
                    : 'bg-gradient-to-b from-slate-100 via-white to-slate-100 border-slate-300 text-slate-900 shadow-xl'
                } ${iotRunning && iotRpm >= 1200 ? 'animate-washer-vibrate' : ''}`}>
                  
                  {/* Top Metallic Panel with Detergent Drawer & LED Screen */}
                  <div className="flex justify-between items-center gap-2 pb-2 border-b border-slate-300 dark:border-slate-800">
                    {/* Detergent Drawer */}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[10px] font-black ${
                      isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-200 border-slate-300 text-slate-800'
                    }`}>
                      <span>🧴</span>
                      <span className="truncate max-w-[80px]">Auto Dosing</span>
                    </div>

                    {/* Machine Brand Title */}
                    <div className="text-center flex-1">
                      <p className={`text-xs font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>{iotMachineName.split(' ')[0]} PRO</p>
                      <p className="text-[8px] font-bold text-slate-500">COMMERCIAL INVERTER</p>
                    </div>

                    {/* Digital LED Status */}
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                      iotRunning ? 'bg-emerald-500 text-white animate-pulse' : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}>
                      {iotRunning ? 'RUNNING' : 'STANDBY'}
                    </span>
                  </div>

                  {/* Digital LCD Time & Telemetry Display */}
                  <div className="p-2.5 rounded-2xl bg-slate-950 text-cyan-400 border border-cyan-500/30 shadow-inner flex justify-between items-center font-mono">
                    <div className="space-y-0.5 text-left">
                      <div className="flex items-center gap-1.5 text-[9px] font-black text-cyan-300">
                        <span className={`w-1.5 h-1.5 rounded-full ${iotRunning ? 'bg-emerald-400 animate-ping' : 'bg-slate-500'}`}></span>
                        <span>{iotRunning ? `CYCLE: WASH (${iotRpm} RPM)` : 'CYCLE: PAUSED'}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-300">{iotCycle}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-black text-cyan-300 leading-none">{iotTimeRemaining}:00</p>
                      <p className="text-[8px] text-cyan-500 font-bold mt-0.5">{iotRunning ? '🔒 DOOR LOCKED' : '🔓 UNLOCKED'}</p>
                    </div>
                  </div>

                  {/* PORTHOLE GLASS DOOR & 3D ROTATING DRUM */}
                  <div className="relative mx-auto w-52 h-52 rounded-full p-3 bg-gradient-to-tr from-slate-400 via-slate-200 to-slate-400 dark:from-slate-700 dark:via-slate-600 dark:to-slate-800 shadow-2xl border-4 border-slate-300 dark:border-slate-600 flex items-center justify-center">
                    
                    {/* Chrome Door Bezel Ring */}
                    <div className="w-full h-full rounded-full p-2 bg-gradient-to-br from-slate-800 via-slate-900 to-black relative overflow-hidden flex items-center justify-center shadow-inner">
                      
                      {/* Stainless Steel Drum Background with perforated dot pattern */}
                      <div className={`absolute inset-1 rounded-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 opacity-90 ${
                        iotRunning ? (iotRpm >= 1200 ? 'animate-wash-spin-turbo' : iotRpm >= 900 ? 'animate-wash-spin-fast' : 'animate-wash-spin') : ''
                      }`} style={{ animationDirection: iotReverseSpin ? 'reverse' : 'normal' }}>
                        {/* Drum Ribs / Baffles */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-10 bg-slate-500 rounded-b-md shadow"></div>
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-10 bg-slate-500 rounded-t-md shadow"></div>
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-3 bg-slate-500 rounded-r-md shadow"></div>
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-3 bg-slate-500 rounded-l-md shadow"></div>
                      </div>

                      {/* Dynamic Sloshing Water Layer */}
                      {iotRunning && (
                        <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-sky-500/60 via-sky-400/40 to-transparent rounded-b-full overflow-hidden pointer-events-none animate-water-slosh">
                          <div className="w-full h-full bg-[radial-gradient(ellipse_at_bottom,#38bdf8_0%,transparent_70%)] opacity-80"></div>
                        </div>
                      )}

                      {/* Soap Foam & Bubbles */}
                      {(iotRunning || iotDetergentFoam) && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden">
                          <span className="absolute bottom-6 left-12 w-4 h-4 rounded-full bg-white/70 backdrop-blur-xs animate-bubble-1"></span>
                          <span className="absolute bottom-8 right-14 w-5 h-5 rounded-full bg-white/60 backdrop-blur-xs animate-bubble-2"></span>
                          <span className="absolute bottom-4 left-20 w-3 h-3 rounded-full bg-white/80 backdrop-blur-xs animate-bubble-3"></span>
                          {iotDetergentFoam && (
                            <>
                              <span className="absolute bottom-10 left-10 w-6 h-6 rounded-full bg-white/90 animate-bubble-1"></span>
                              <span className="absolute bottom-12 right-10 w-5 h-5 rounded-full bg-white/90 animate-bubble-2"></span>
                              <span className="absolute bottom-14 left-16 w-7 h-7 rounded-full bg-white/90 animate-bubble-3"></span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Steam Drift for 60°C Cycle */}
                      {iotRunning && iotTemp === 60 && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="w-24 h-24 bg-white/30 rounded-full blur-xl animate-steam"></div>
                        </div>
                      )}

                      {/* REALISTIC TUMBLING CLOTHES INSIDE DRUM */}
                      <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
                        {/* Red Shirt */}
                        <div className={`absolute text-2xl ${
                          iotRunning 
                            ? (iotRpm >= 1200 ? 'animate-clothes-tumble-fast' : 'animate-clothes-tumble') 
                            : 'transform translate-y-6 rotate-12'
                        }`}>
                          👕
                        </div>

                        {/* Blue Denim Jeans */}
                        <div className={`absolute text-2xl ${
                          iotRunning 
                            ? 'animate-clothes-tumble-alt' 
                            : 'transform translate-y-8 -rotate-45'
                        }`}>
                          👖
                        </div>

                        {/* White Socks & Towel */}
                        <div className={`absolute text-xl ${
                          iotRunning 
                            ? (iotRpm >= 1200 ? 'animate-clothes-tumble-fast' : 'animate-clothes-tumble') 
                            : 'transform translate-y-5 -translate-x-6'
                        }`} style={{ animationDelay: '0.4s' }}>
                          🧦
                        </div>

                        <div className={`absolute text-xl ${
                          iotRunning 
                            ? 'animate-clothes-tumble-alt' 
                            : 'transform translate-y-7 translate-x-6'
                        }`} style={{ animationDelay: '0.8s' }}>
                          🧺
                        </div>
                      </div>

                      {/* Glass Glare Reflection Highlight */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none"></div>
                      <div className="absolute top-2 left-4 w-20 h-10 rounded-full bg-white/20 blur-xs -rotate-45 pointer-events-none"></div>

                      {/* Chrome Center Glass Hub */}
                      <div className="absolute w-8 h-8 rounded-full bg-gradient-to-tr from-slate-400 to-slate-200 border-2 border-slate-600 shadow-md flex items-center justify-center text-[8px] font-black text-slate-800">
                        IoT
                      </div>
                    </div>
                  </div>

                  {/* Bottom Footer Info */}
                  <div className="text-center pt-1 border-t border-slate-200 dark:border-slate-800">
                    <p className={`text-[10px] font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {iotMachineName} · Smart Inverter Direct Drive
                    </p>
                    <p className={`text-[9px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      Terhubung dengan POS Kasir & SmartOwner App
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PLAYGROUND TAB 4: LIVE GPS RADAR KURIR (HYPER-REALISTIS & INTERAKTIF) */}
          {playgroundTab === 'courier' && (
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-soft grid grid-cols-1 lg:grid-cols-12 gap-8 items-start ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}>
              {/* Left Controls */}
              <div className="lg:col-span-6 space-y-4 text-left">
                <div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-primary/10 text-primary border border-primary/20">
                    SMARTKURIR LIVE GPS RADAR & TELEMETRY
                  </span>
                  <h3 className={`text-lg font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Simulasi Pelacakan GPS Kurir Real-Time:
                  </h3>
                  <p className={`text-xs font-semibold mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                    Pelanggan dan pemilik laundry dapat memantau pergerakan kurir di peta secara live seperti aplikasi ojek online, lengkap dengan estimasi menit tiba.
                  </p>
                </div>

                {/* Trip Type Selector */}
                <div className="space-y-1.5">
                  <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Tipe Pengiriman / Penjemputan:</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setCourierTripType('delivery')}
                      className={`p-2.5 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 ${
                        courierTripType === 'delivery'
                          ? 'bg-primary text-white border-primary shadow-clay-sm'
                          : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Package className="w-4 h-4" />
                      <span>Antar Laundry Bersih</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setCourierTripType('pickup')}
                      className={`p-2.5 rounded-xl text-xs font-black border transition-all flex items-center justify-center gap-1.5 ${
                        courierTripType === 'pickup'
                          ? 'bg-primary text-white border-primary shadow-clay-sm'
                          : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Truck className="w-4 h-4" />
                      <span>Jemput Cucian Kotor</span>
                    </button>
                  </div>
                </div>

                {/* Driver Profile Card with High Contrast */}
                <div className={`p-4 rounded-2xl border transition-all space-y-3 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-xs'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 to-indigo-600 text-white flex items-center justify-center text-lg shadow-xs relative">
                        🛵
                        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-xs sm:text-sm">Doni Pratama</h4>
                          <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 font-bold text-[9px]">ONLINE</span>
                        </div>
                        <p className="text-[10px] text-slate-500 font-semibold">Honda Vario 160 · B 4821 TZX</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="flex items-center gap-1 text-amber-500 text-xs font-black">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span>4.9</span>
                      </div>
                      <p className="text-[9px] text-slate-400 font-bold">142 Pengantaran</p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center text-[10px]">
                    <span className="text-slate-500 font-medium">
                      Muatan: <strong>3 Kantong Cucian (#INV-2405)</strong>
                    </span>
                    <span className="text-emerald-600 font-bold">Baterai Kurir: 88% 🔋</span>
                  </div>
                </div>

                {/* Route Scrubber & Waypoint Buttons */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <label className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Progres Perjalanan di Peta:
                    </label>
                    <span className="font-mono font-black text-primary">{Math.round(courierProgress)}%</span>
                  </div>

                  {/* Interactive Slider */}
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={courierProgress}
                    onChange={(e) => setCourierProgress(Number(e.target.value))}
                    className="w-full accent-primary cursor-pointer"
                  />

                  {/* Waypoint Shortcut Buttons */}
                  <div className="grid grid-cols-4 gap-1.5">
                    {[
                      { p: 0, label: '🏪 Outlet' },
                      { p: 35, label: '🛣️ Jl. Raya' },
                      { p: 70, label: '🏘️ Komplek' },
                      { p: 100, label: '🏠 Tiba' },
                    ].map((step) => (
                      <button
                        key={step.p}
                        type="button"
                        onClick={() => setCourierProgress(step.p)}
                        className={`py-1 rounded-lg text-[9px] font-black border transition-all ${
                          Math.abs(courierProgress - step.p) < 15
                            ? 'bg-primary text-white border-primary shadow-clay-sm'
                            : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {step.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Play/Pause & Speed Controller */}
                <div className="pt-1 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCourierMoving(!courierMoving)}
                    className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black shadow-clay-sm flex items-center justify-center gap-1.5 transition-all ${
                      courierMoving
                        ? 'bg-rose-600 hover:bg-rose-700 text-white'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <Radio className="w-4 h-4" />
                    <span>{courierMoving ? 'Pause Radar GPS' : 'Lanjutkan Perjalanan Kurir'}</span>
                  </button>

                  <div className="flex items-center gap-1">
                    {[1, 2, 4].map((spd) => (
                      <button
                        key={spd}
                        type="button"
                        onClick={() => setCourierSpeed(spd)}
                        className={`py-2 px-2.5 rounded-xl text-[10px] font-black border transition-all ${
                          courierSpeed === spd
                            ? 'bg-primary text-white border-primary'
                            : isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                        }`}
                      >
                        {spd}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Step Status Banner */}
                <div className={`p-3 rounded-2xl border text-xs flex items-center gap-2 ${
                  isDark ? 'bg-slate-950 border-slate-800 text-sky-400' : 'bg-sky-50 border-sky-200 text-sky-900'
                }`}>
                  <span className="text-base">📍</span>
                  <p className="font-bold text-[11px] leading-tight">
                    {courierProgress < 25 && '1. Kurir baru berangkat membawa cucian dari Gerai Laundry'}
                    {courierProgress >= 25 && courierProgress < 60 && '2. Kurir sedang melaju di Jl. Raya Darmo (38 km/h lancar)'}
                    {courierProgress >= 60 && courierProgress < 90 && '3. Kurir memasuki gerbang komplek Jl. Cempaka Putih Raya'}
                    {courierProgress >= 90 && courierProgress < 100 && '4. Kurir 50 meter lagi tiba di depan pagar rumah pelanggan'}
                    {courierProgress >= 100 && '5. Kurir TELAH SAMPAI di depan rumah pelanggan! ✨'}
                  </p>
                </div>
              </div>

              {/* Right: Hyper-Realistic Smartphone Vector GPS Radar Map HUD */}
              <div className="lg:col-span-6 flex justify-center">
                <div className="w-80 sm:w-88 rounded-3xl bg-slate-950 border-2 border-slate-700 shadow-2xl overflow-hidden flex flex-col text-white relative">
                  
                  {/* Top Navigation Turn-by-Turn HUD Banner */}
                  <div className="p-3 bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center font-black text-sm shadow">
                        ↗️
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-white">
                          {courierProgress < 60 ? '150m Belok Kanan' : courierProgress < 90 ? '80m Masuk Gerbang' : 'Sampai di Tujuan'}
                        </p>
                        <p className="text-[9px] text-sky-300 font-semibold truncate max-w-[140px]">
                          Jl. Cempaka Putih Raya No. 42A
                        </p>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-black border border-emerald-500/30">
                        38 KM/H
                      </span>
                      <p className="text-[8px] text-slate-400 mt-0.5">GPS: ±2m</p>
                    </div>
                  </div>

                  {/* Realistic Vector Road Map Display (SVG Canvas) */}
                  <div className="relative h-64 bg-[#0F172A] overflow-hidden">
                    {/* Stylized Map Grid & Terrain */}
                    <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:20px_20px]"></div>

                    {/* Vector Roads & River */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 340 250" preserveAspectRatio="none">
                      {/* Secondary Roads */}
                      <path d="M 0 60 Q 120 70 200 40 T 340 50" fill="none" stroke="#1E293B" strokeWidth="12" />
                      <path d="M 40 0 Q 50 120 70 250" fill="none" stroke="#1E293B" strokeWidth="10" />
                      <path d="M 280 0 Q 290 140 310 250" fill="none" stroke="#1E293B" strokeWidth="10" />

                      {/* Main Arterial Road (Highway) */}
                      <path 
                        id="main-courier-route"
                        d="M 50 210 C 100 210, 130 140, 190 130 S 260 70, 300 45" 
                        fill="none" 
                        stroke="#334155" 
                        strokeWidth="14" 
                        strokeLinecap="round" 
                      />

                      {/* Animated Glowing GPS Route Path */}
                      <path 
                        d="M 50 210 C 100 210, 130 140, 190 130 S 260 70, 300 45" 
                        fill="none" 
                        stroke="#0EA5E9" 
                        strokeWidth="5" 
                        strokeLinecap="round" 
                        className="animate-route-flow"
                      />

                      {/* Street Names */}
                      <text x="70" y="230" fill="#64748B" fontSize="8" fontWeight="bold" fontFamily="monospace">Jl. Raya Darmo</text>
                      <text x="170" y="150" fill="#64748B" fontSize="8" fontWeight="bold" fontFamily="monospace">Jl. Basuki Rahmat</text>
                      <text x="210" y="65" fill="#64748B" fontSize="8" fontWeight="bold" fontFamily="monospace">Komp. Cempaka Indah</text>
                    </svg>

                    {/* Point A: Outlet Laundry Pin */}
                    <div className="absolute bottom-5 left-8 flex flex-col items-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs shadow-lg border-2 border-white">
                        🏪
                      </div>
                      <span className="px-1.5 py-0.5 bg-slate-900/90 text-indigo-300 text-[8px] font-black rounded mt-0.5 border border-indigo-500/40">
                        Outlet Berkah
                      </span>
                    </div>

                    {/* Point B: Customer House Destination Pin */}
                    <div className="absolute top-4 right-6 flex flex-col items-center pointer-events-none">
                      <div className="relative flex items-center justify-center">
                        <span className="absolute w-8 h-8 rounded-full bg-rose-500/40 animate-ping"></span>
                        <div className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow-lg border-2 border-white relative z-10">
                          🏠
                        </div>
                      </div>
                      <span className="px-1.5 py-0.5 bg-slate-900/90 text-rose-300 text-[8px] font-black rounded mt-0.5 border border-rose-500/40">
                        Rumah Aisyah
                      </span>
                    </div>

                    {/* Dynamic Moving Courier Marker (Parametric 2D Curve) */}
                    {(() => {
                      const t = courierProgress / 100;
                      // Parametric curve calculation matching the SVG path
                      const courierX = 45 + t * 245;
                      const courierY = 205 - Math.sin(t * Math.PI * 0.9) * 115 - t * 45;

                      return (
                        <div 
                          className="absolute pointer-events-none transition-all duration-300 flex flex-col items-center -translate-x-1/2 -translate-y-1/2"
                          style={{ left: `${courierX}px`, top: `${courierY}px` }}
                        >
                          {/* Pulsing Sonar GPS Wave */}
                          <span className="absolute w-10 h-10 rounded-full bg-sky-400/40 animate-ping"></span>

                          {/* Courier Motor Icon Bubble */}
                          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-primary text-white flex items-center justify-center text-base shadow-2xl border-2 border-white relative z-10 transform hover:scale-110 transition-transform">
                            🛵
                          </div>

                          {/* Floating Driver Label */}
                          <span className="px-2 py-0.5 bg-slate-900 text-sky-300 text-[8px] font-black rounded-full mt-1 border border-sky-400/50 shadow-md whitespace-nowrap">
                            Doni (Kurir)
                          </span>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Bottom Navigation Telemetry Card */}
                  <div className="p-3 bg-slate-900 border-t border-slate-800 flex justify-between items-center">
                    <div>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Estimasi Waktu Tiba:</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-black text-emerald-400 font-mono">
                          ~{Math.max(1, Math.round((100 - courierProgress) * 0.1))} Menit Lagi
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          ({((100 - courierProgress) * 0.035).toFixed(1)} km)
                        </span>
                      </div>
                    </div>

                    <a
                      href="https://wa.me/6281234567890?text=Halo%20Kurir%20Doni,%20saya%20mau%20tanya%20posisi%20cucian%20saya"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black flex items-center gap-1.5 shadow-clay-sm transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Hubungi Kurir</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* 4. 🌟 WORKFLOW 4 LANGKAH OTOMATISASI DENGAN GAMBAR 3D */}
      <section className={`py-16 px-4 sm:px-8 border-t transition-colors ${
        isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black text-primary uppercase tracking-widest">Alur Operasional Laundry Otomatis</span>
            <h2 className={`text-2xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Cara Kerja Cerdas Laundry Modern Masa Depan
            </h2>
            <p className={`text-xs sm:text-sm max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Dari pesanan masuk hingga pakaian wangi sampai di tangan pelanggan, semua termonitor otomatis secara real-time.
            </p>
          </div>

          {/* Step Timeline Indicator */}
          <div className="flex items-center justify-between gap-2 max-w-4xl mx-auto px-4 overflow-x-auto no-scrollbar">
            {[
              { id: 0, title: '1. Book App & Order In', icon: '📱' },
              { id: 1, title: '2. Wash Cycle & IoT', icon: '🧼' },
              { id: 2, title: '3. Steam Iron & Audit', icon: '♨️' },
              { id: 3, title: '4. Fresh Folded & Delivery', icon: '🛵' }
            ].map((stepItem, idx) => (
              <React.Fragment key={stepItem.id}>
                <button
                  onClick={() => setActiveWorkflowStep(stepItem.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl text-xs font-black transition-all flex-shrink-0 border ${
                    activeWorkflowStep === stepItem.id
                      ? 'bg-primary text-white border-primary shadow-clay-sm scale-105'
                      : isDark
                        ? 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-xs'
                  }`}
                >
                  <span className="text-base">{stepItem.icon}</span>
                  <span>{stepItem.title}</span>
                </button>
                {idx < 3 && (
                  <div className={`hidden sm:block flex-1 h-1 rounded-full overflow-hidden ${
                    isDark ? 'bg-slate-800' : 'bg-slate-200'
                  }`}>
                    <div 
                      className="h-full bg-primary transition-all duration-500" 
                      style={{ width: activeWorkflowStep > idx ? '100%' : activeWorkflowStep === idx ? '60%' : '0%' }}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* MAIN INTERACTIVE WORKFLOW STAGE SHOWCASE CANVAS */}
          <div className={`relative rounded-3xl border p-6 sm:p-10 shadow-2xl overflow-hidden backdrop-blur-xl transition-all duration-500 ${
            isDark ? 'bg-slate-900/90 border-slate-800 text-white' : 'bg-white/95 border-slate-200 shadow-slate-300/40 text-slate-900'
          }`}>

            {/* Ambient Background Backlight Glow */}
            <div className={`absolute -top-10 -right-10 w-96 h-96 rounded-full blur-3xl -z-10 transition-all ${
              activeWorkflowStep === 0 ? 'bg-sky-500/20' : activeWorkflowStep === 1 ? 'bg-emerald-500/20' : activeWorkflowStep === 2 ? 'bg-amber-500/20' : 'bg-indigo-500/20'
            }`}></div>

            <div className="grid md:grid-cols-12 gap-8 items-center">

              {/* LEFT: Live Stage Interactive Animation Display (7 Cols) */}
              <div className="md:col-span-7 space-y-4">
                
                {/* STAGE 0: BOOK APP & ORDER IN */}
                {activeWorkflowStep === 0 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                        TAHAP 1: ORDER BOOKING & PENERIMAAN
                      </span>
                      <span className="text-xs font-black text-emerald-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                        Order Masuk Instant
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                      Order Masuk Otomatis via App Pelanggan & POS Kasir
                    </h3>

                    {/* Interactive UI Card */}
                    <div className="p-4 rounded-2xl border border-sky-200 dark:border-sky-900/50 bg-sky-50/50 dark:bg-sky-950/20 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-sky-500 text-white font-black flex items-center justify-center text-lg shadow-sm">
                            📱
                          </div>
                          <div>
                            <p className="text-xs font-black">Order #INV-2026-982</p>
                            <p className="text-[11px] text-slate-500 font-bold">Aisyah Salsabila · Surabaya</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          ✓ Lunas via QRIS
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs font-bold pt-2 border-t border-slate-200/60 dark:border-slate-800">
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border">
                          <span className="text-[10px] text-slate-400">Layanan</span>
                          <p className="font-black text-primary">Cuci Lipat Express</p>
                        </div>
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border">
                          <span className="text-[10px] text-slate-400">Berat Cucian</span>
                          <p className="font-black text-emerald-600">4.5 Kg (Rp 45.000)</p>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                      Sistem kasir langsung mengkalkulasi berat, mencetak tag pakaian anti-air, dan mengirimkan notifikasi konfirmasi ke WhatsApp pelanggan tanpa perlu dicatat manual.
                    </p>
                  </div>
                )}

                {/* STAGE 1: WASH CYCLE & IOT */}
                {activeWorkflowStep === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                        TAHAP 2: PROSES CUCI & MONITORING IOT
                      </span>
                      <span className="text-xs font-black text-sky-500 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-sky-500 animate-spin"></span>
                        Drum Spin 1200 RPM
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                      Pencucian Higienis Terkontrol Sensor IoT
                    </h3>

                    {/* Interactive Washer Display */}
                    <div className="p-4 rounded-2xl border border-emerald-200 dark:border-emerald-900/50 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white font-black flex items-center justify-center text-lg shadow-sm animate-spin">
                            🌀
                          </div>
                          <div>
                            <p className="text-xs font-black">Maytag Commercial Washer #02</p>
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold">Status: Active Wash & Spin Cycle</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-sky-500/10 text-sky-600 border border-sky-500/20">
                          Temp: 45°C
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-black">
                          <span>Progress Siklus Cuci</span>
                          <span className="text-primary">Sisa 12 Menit</span>
                        </div>
                        <div className="w-full bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-gradient-to-r from-emerald-400 via-sky-400 to-primary h-full rounded-full w-[65%] animate-pulse"></div>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                      Penggunaan deterjen diinjeksikan secara tepat via pompa otomatis. Pemilik laundry dapat memantau putaran drum dan jam operasional mesin langsung dari HP.
                    </p>
                  </div>
                )}

                {/* STAGE 2: STEAM IRON & AUDIT */}
                {activeWorkflowStep === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                        TAHAP 3: SETRIKA UAP & FOTO AUDIT GARMENT
                      </span>
                      <span className="text-xs font-black text-amber-500 flex items-center gap-1">
                        <span>♨️</span>
                        Steam Temp 140°C
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                      Setrika Rapi Licin & Audit Foto Sebelum Di-Packing
                    </h3>

                    {/* Interactive Ironing Card */}
                    <div className="p-4 rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/20 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white font-black flex items-center justify-center text-lg shadow-sm">
                            ♨️
                          </div>
                          <div>
                            <p className="text-xs font-black">Finishing & Packing Premium</p>
                            <p className="text-[11px] text-amber-700 dark:text-amber-400 font-bold">Parfum: Sakura Blossom</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-amber-500/10 text-amber-700 border border-amber-500/20">
                          🏷️ RAK A-14
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border flex items-center justify-between text-xs font-bold">
                        <div className="flex items-center gap-2">
                          <span className="text-base">📸</span>
                          <span>Garansi Zero Defect (Foto Audit Garment Ter-Upload)</span>
                        </div>
                        <span className="text-emerald-500 font-black">✓ Verifikasi OK</span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                      Pakaian disetrika rapi, disemprot parfum tahan lama, lalu difoto oleh staf sebelum dibungkus. Konsumen dapat melihat foto kondisi pakaian mereka langsung di aplikasi.
                    </p>
                  </div>
                )}

                {/* STAGE 3: FRESH FOLDED & DELIVERY */}
                {activeWorkflowStep === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        TAHAP 4: PENGANTARAN KURIR & NOTA WA
                      </span>
                      <span className="text-xs font-black text-indigo-500 flex items-center gap-1">
                        <span>🛵</span>
                        Kurir Live Tracking
                      </span>
                    </div>

                    <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                      Pengantaran Kurir Lacak GPS & WA Otomatis
                    </h3>

                    {/* Interactive Delivery Display */}
                    <div className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white font-black flex items-center justify-center text-lg shadow-sm">
                            🛵
                          </div>
                          <div>
                            <p className="text-xs font-black">Doni Pratama (Kurir Smart)</p>
                            <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">ETA ~6 Menit (Jl. Melati No. 42)</p>
                          </div>
                        </div>
                        <span className="px-2.5 py-1 text-[10px] font-black rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                          💬 WA Terkirim
                        </span>
                      </div>

                      <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-600 dark:text-slate-300">Rating Konsumen:</span>
                        <span className="text-amber-500 font-black">⭐ 5.0 (Sangat Memuaskan!)</span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                      Kurir mengantar paket ke rumah pelanggan dengan rute teroptimasi GPS. Konsumen menerima notifikasi WA otomatis lengkap dengan link nota dan lokasi kurir.
                    </p>
                  </div>
                )}
              </div>

              {/* RIGHT: High-Impact Visual Card Preview (5 Cols) */}
              <div className="md:col-span-5 flex flex-col items-center justify-center">
                <div className={`w-full p-6 rounded-3xl border shadow-xl text-center space-y-4 transition-all duration-300 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                }`}>
                  {/* Big Animated Icon Stage */}
                  <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-sky-400 via-primary to-indigo-600 text-white flex items-center justify-center text-4xl shadow-clay-lg animate-hero-float">
                    {['📱', '🌀', '♨️', '🛵'][activeWorkflowStep]}
                  </div>

                  <div>
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">Alur Otomatis #{activeWorkflowStep + 1}</span>
                    <h4 className="text-base font-black mt-1">
                      {['Penerimaan & POS', 'Siklus Cuci IoT', 'Finishing & Audit', 'Antar & WA Digital'][activeWorkflowStep]}
                    </h4>
                  </div>

                  {/* Feature Highlights List */}
                  <div className="space-y-2 text-left pt-2 border-t border-slate-200/60 dark:border-slate-800 text-xs">
                    {activeWorkflowStep === 0 && [
                      '✓ Kalkulasi harga otomatis per kg / satuan',
                      '✓ Tag pakaian anti-air luntur otomatis ter-print',
                      '✓ Pembayaran QRIS & Cash langsung masuk pembukuan'
                    ].map((f, i) => <p key={i} className="font-bold text-slate-600 dark:text-slate-300">{f}</p>)}

                    {activeWorkflowStep === 1 && [
                      '✓ Sensor IoT membaca sisa menit & putaran RPM',
                      '✓ Pompa deterjen otomatis takar dosis tepat',
                      '✓ Notifikasi otomatis jika siklus cuci selesai'
                    ].map((f, i) => <p key={i} className="font-bold text-slate-600 dark:text-slate-300">{f}</p>)}

                    {activeWorkflowStep === 2 && [
                      '✓ Setrika uap tekanan tinggi bebas risiko gosong',
                      '✓ Foto audit kondisi baju di-upload ke database',
                      '✓ Penataan rak tersistem dengan barcode tag'
                    ].map((f, i) => <p key={i} className="font-bold text-slate-600 dark:text-slate-300">{f}</p>)}

                    {activeWorkflowStep === 3 && [
                      '✓ Radar GPS lacak kurir real-time dari HP',
                      '✓ Nota WA terkirim otomatis tanpa simpan nomor',
                      '✓ Konsumen bisa beri rating & ulasan bintang'
                    ].map((f, i) => <p key={i} className="font-bold text-slate-600 dark:text-slate-300">{f}</p>)}
                  </div>

                  {/* Step Selector Dots */}
                  <div className="flex justify-center gap-2 pt-2">
                    {[0, 1, 2, 3].map((stepIdx) => (
                      <button
                        key={stepIdx}
                        onClick={() => setActiveWorkflowStep(stepIdx)}
                        className={`h-2.5 rounded-full transition-all ${
                          activeWorkflowStep === stepIdx ? 'w-8 bg-primary' : 'w-2.5 bg-slate-300 dark:bg-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. 🌟 INTERACTIVE 4-IN-1 ECOSYSTEM SHOWCASE */}
      <section className={`py-20 px-4 sm:px-8 border-t transition-colors ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-[#F1F5F9] border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black text-primary uppercase tracking-widest">Satu Langganan untuk Seluruh Tim</span>
            <h2 className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              4 Aplikasi Terpadu Dalam Satu Ekosistem
            </h2>
            <p className={`text-sm max-w-2xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Semua peran dalam bisnis laundry Anda memiliki aplikasi khusus yang saling terhubung secara live.
            </p>

            {/* Ecosystem Tabs */}
            <div className={`inline-flex p-1.5 rounded-2xl border gap-1.5 max-w-full overflow-x-auto ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
            }`}>
              {[
                { id: 'kasir', label: '💻 SmartKasir (POS)' },
                { id: 'konsumen', label: '📱 SmartKonsumen' },
                { id: 'kurir', label: '🛵 SmartKurir' },
                { id: 'owner', label: '👑 SmartOwner' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveEcosystemTab(tab.id)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                    activeEcosystemTab === tab.id
                      ? 'bg-primary text-white shadow-clay-sm'
                      : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Ecosystem Tab Content Showcase */}
          <div className={`p-6 sm:p-10 rounded-3xl border ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft-lg'
          }`}>
            {activeEcosystemTab === 'kasir' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5 text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-primary border border-sky-200 text-xs font-black">
                    <Monitor className="w-3.5 h-3.5" />
                    <span>Aplikasi Kasir POS & ERP Gerai</span>
                  </div>
                  <h3 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Kasir Walk-In Cepat, Struk Thermal & Kanban Board
                  </h3>
                  <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Input cucian kiloan dan satuan hanya dalam 15 detik! Cetak struk Bluetooth 58mm/80mm, pasang label tag anti-air pada pakaian, dan kelola antrean cuci visual dengan drag-and-drop Kanban board.
                  </p>
                  <ul className="space-y-2.5 text-xs font-bold">
                    <li className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Cetak Struk Thermal & Tag Anti-Air Nomor Rak</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Visual Kanban Board Antrean Cucian (Drag & Drop)</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Manajemen Stok Deterjen & Bahan Baku Kimia</span>
                    </li>
                  </ul>
                  <button
                    onClick={onTryDemoPos}
                    className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-2"
                  >
                    <span>Coba Demo Kasir POS Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* SmartKasir POS Mockup (Clean White in Light Mode) */}
                <div className="lg:col-span-6">
                  <div className={`rounded-3xl border-2 p-5 sm:p-6 space-y-4 shadow-xl transition-all ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-white text-slate-900 border-slate-200 shadow-soft-lg'
                  }`}>
                    {/* POS Window Header */}
                    <div className={`flex justify-between items-center pb-3 border-b text-xs ${
                      isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                        </div>
                        <span className="font-mono font-bold text-[11px] ml-2">SmartKasir POS · Gerai Darmo #01</span>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 font-bold text-[10px] border border-emerald-500/30">
                        🟢 ONLINE
                      </span>
                    </div>

                    {/* Order Cart Content */}
                    <div className={`p-4 rounded-2xl border space-y-3 text-xs ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex justify-between items-center font-black text-sm">
                        <span className="flex items-center gap-1.5">
                          <span>🧺</span>
                          <span>Order #INV-2405</span>
                        </span>
                        <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-mono text-[10px] font-bold border border-sky-200">
                          RAK A-14
                        </span>
                      </div>

                      <div className={`space-y-2 text-[11px] border-t pt-2 ${
                        isDark ? 'border-slate-800 text-slate-300' : 'border-slate-200 text-slate-700'
                      }`}>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Pelanggan:</span>
                          <strong className={isDark ? 'text-white' : 'text-slate-900'}>Aisyah Salsabila (VIP Gold)</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Layanan:</span>
                          <span className="text-primary font-bold">Cuci Kering Lipat Express (4.5 kg)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Parfum:</span>
                          <span className="text-amber-600 font-bold">Sakura Blossom Premium</span>
                        </div>
                      </div>

                      {/* Total & Payment */}
                      <div className={`p-3 rounded-xl border flex justify-between items-center text-xs font-black ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                      }`}>
                        <span className="text-slate-500">Total Tagihan:</span>
                        <span className="text-emerald-600 text-sm font-mono">Rp 45.000 (Lunas QRIS)</span>
                      </div>
                    </div>

                    {/* POS Action Grid */}
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-black">
                      <div className="p-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl shadow-xs cursor-pointer flex flex-col items-center gap-1 transition-all">
                        <Printer className="w-3.5 h-3.5" />
                        <span>Cetak Struk</span>
                      </div>
                      <div className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs cursor-pointer flex flex-col items-center gap-1 transition-all">
                        <Tag className="w-3.5 h-3.5" />
                        <span>Tag Anti-Air</span>
                      </div>
                      <div className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-xs cursor-pointer flex flex-col items-center gap-1 transition-all">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Nota WA</span>
                      </div>
                    </div>

                    {/* Mini Kanban Pill */}
                    <div className={`flex items-center justify-between p-2.5 rounded-xl border text-[10px] ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-100 border-slate-200'
                    }`}>
                      <span className="text-slate-500 font-bold">Antrean Kanban:</span>
                      <div className="flex gap-1.5 font-bold">
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">Antre: 4</span>
                        <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 border border-sky-200">Cuci: 3</span>
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">Siap: 5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeEcosystemTab === 'konsumen' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5 text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-black">
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Aplikasi Pelanggan On-Demand (SmartKonsumen)</span>
                  </div>
                  <h3 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Pesan Antar-Jemput & Lacak Cucian Secara Live
                  </h3>
                  <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Pelanggan Anda bisa memesan laundry antar-jemput dari smartphone, memilih jadwal penjemputan, melacak kurir di peta radar, hingga membeli paket langganan kuota kiloan.
                  </p>
                  <ul className="space-y-2.5 text-xs font-bold">
                    <li className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Live GPS Radar Melacak Posisi Kurir Menuju Rumah</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Beli Paket Langganan Kuota Kiloan (E-Money Hemat)</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Tukar Poin Hadiah Loyalty & Ulasan Bintang 5</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handleOpenTrial(SAAS_PLANS[0])}
                    className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-2"
                  >
                    <span>Coba SmartKonsumen App</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* SmartKonsumen Mobile Phone Mockup (Clean White in Light Mode) */}
                <div className="lg:col-span-6 flex justify-center">
                  <div className={`w-80 sm:w-88 rounded-3xl border-4 p-4 space-y-3.5 shadow-2xl transition-all ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white text-slate-900 border-slate-200 shadow-soft-xl'
                  }`}>
                    {/* Phone Status Bar */}
                    <div className="flex justify-between items-center text-[10px] text-slate-500 font-mono px-1">
                      <span>09:41</span>
                      <div className={`w-20 h-3.5 rounded-full mx-auto ${isDark ? 'bg-black' : 'bg-slate-200'}`}></div>
                      <span>5G 🔋 100%</span>
                    </div>

                    {/* Member Greeting & Loyalty Points */}
                    <div className={`p-3.5 rounded-2xl border flex justify-between items-center ${
                      isDark 
                        ? 'bg-gradient-to-r from-sky-900/60 to-indigo-900/60 border-sky-500/30' 
                        : 'bg-gradient-to-r from-sky-50 to-indigo-50 border-sky-200 shadow-xs'
                    }`}>
                      <div>
                        <p className="text-[10px] text-primary font-bold">Selamat Pagi,</p>
                        <h5 className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>Aisyah Salsabila ✨</h5>
                      </div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[9px] font-black rounded-full border border-amber-300">
                          👑 VIP GOLD
                        </span>
                        <p className="text-[10px] text-amber-700 font-mono font-bold mt-0.5">1.450 Poin</p>
                      </div>
                    </div>

                    {/* Active Order Card with Stepper */}
                    <div className={`p-3.5 rounded-2xl border space-y-2.5 ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-xs'
                    }`}>
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-black">📦 Order #INV-2405</span>
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full border border-emerald-200">
                          Sedang Diantar
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 font-semibold">Cuci Kering Lipat Express (4.5 kg)</p>

                      {/* 4-Step Animated Tracking Stepper */}
                      <div className="grid grid-cols-4 gap-1 text-center text-[8px] font-black pt-1">
                        <div className="p-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ✓ Diterima
                        </div>
                        <div className="p-1 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                          ✓ Dicuci
                        </div>
                        <div className="p-1 rounded bg-primary text-white shadow-xs animate-pulse">
                          🛵 Diantar
                        </div>
                        <div className={`p-1 rounded ${isDark ? 'bg-slate-800 text-slate-500' : 'bg-slate-200 text-slate-500'}`}>
                          Selesai
                        </div>
                      </div>

                      {/* Courier Snippet */}
                      <div className={`p-2.5 rounded-xl border flex justify-between items-center text-[10px] ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                      }`}>
                        <div className="flex items-center gap-2">
                          <span className="text-base">🛵</span>
                          <div className="text-left">
                            <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>Doni Pratama</p>
                            <p className="text-[9px] text-emerald-600 font-bold">Estimasi ~8 Menit Tiba</p>
                          </div>
                        </div>
                        <a
                          href="https://wa.me/6281234567890"
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[9px] font-bold shadow-xs"
                        >
                          Hubungi 📞
                        </a>
                      </div>
                    </div>

                    {/* Quick Menu Shortcuts */}
                    <div className="grid grid-cols-3 gap-2 text-center text-[9px] font-black">
                      <div className={`p-2 rounded-xl border cursor-pointer transition-all ${
                        isDark ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                      }`}>
                        <p className="text-sm">🛵</p>
                        <p className="mt-0.5">Pesan Antar</p>
                      </div>
                      <div className={`p-2 rounded-xl border cursor-pointer transition-all ${
                        isDark ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                      }`}>
                        <p className="text-sm">💳</p>
                        <p className="mt-0.5">Paket Kuota</p>
                      </div>
                      <div className={`p-2 rounded-xl border cursor-pointer transition-all ${
                        isDark ? 'bg-slate-900 hover:bg-slate-800 border-slate-800 text-slate-300' : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800 shadow-xs'
                      }`}>
                        <p className="text-sm">🎁</p>
                        <p className="mt-0.5">Tukar Poin</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeEcosystemTab === 'kurir' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5 text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-black">
                    <Truck className="w-3.5 h-3.5" />
                    <span>Aplikasi Khusus Driver (SmartKurir)</span>
                  </div>
                  <h3 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Navigasi Google Maps & Foto Bukti Serah Terima
                  </h3>
                  <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Armada kurir motor laundry memiliki tampilan smartphone khusus untuk menerima daftar jemput & antar, 1-klik navigasi Google Maps, 1-klik WhatsApp sapaan tiba, dan upload foto bukti serah terima.
                  </p>
                  <ul className="space-y-2.5 text-xs font-bold">
                    <li className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Toggle Status Driver: ONLINE / OFFLINE</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>1-Click Navigasi GPS Google Maps ke Rumah Pelanggan</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Foto Kamera Bukti Serah Terima Cucian Anti-Hilang</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handleOpenTrial(SAAS_PLANS[0])}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-2"
                  >
                    <span>Coba SmartKurir App</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* SmartKurir Mobile Phone Mockup (Clean White in Light Mode) */}
                <div className="lg:col-span-6 flex justify-center">
                  <div className={`w-80 sm:w-88 rounded-3xl border-4 p-4 space-y-3.5 shadow-2xl transition-all ${
                    isDark ? 'bg-slate-950 border-slate-700 text-white' : 'bg-white text-slate-900 border-slate-200 shadow-soft-xl'
                  }`}>
                    {/* Driver Status Banner */}
                    <div className={`p-3 rounded-2xl border flex justify-between items-center ${
                      isDark 
                        ? 'bg-emerald-950/80 border-emerald-500/40 text-white' 
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900 shadow-xs'
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></div>
                        <div className="text-left">
                          <p className="text-[10px] text-emerald-700 font-bold uppercase">STATUS DRIVER:</p>
                          <h5 className="text-xs font-black">ONLINE · SIAP TERIMA ORDER</h5>
                        </div>
                      </div>
                      <span className="text-xs font-black text-amber-600">⭐ 4.9</span>
                    </div>

                    {/* Driver Metrics */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className={`p-2.5 rounded-xl border ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">Selesai Hari Ini</p>
                        <p className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>12 Trip</p>
                      </div>
                      <div className={`p-2.5 rounded-xl border ${
                        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}>
                        <p className="text-[9px] text-slate-500 font-bold uppercase">Total Tip Kurir</p>
                        <p className="text-base font-black text-emerald-600 font-mono">Rp 45.000</p>
                      </div>
                    </div>

                    {/* Active Dispatch Task */}
                    <div className={`p-3.5 rounded-2xl border space-y-2.5 text-left ${
                      isDark ? 'bg-slate-900 border-slate-800' : 'bg-amber-50/70 border-amber-200 text-slate-900'
                    }`}>
                      <div className="flex justify-between items-center text-xs font-black">
                        <span className="text-amber-700">🚨 TUGAS AKTIF #DEL-104</span>
                        <span className="px-2 py-0.5 bg-amber-200/80 text-amber-900 text-[9px] rounded font-bold">Antar Pakaian</span>
                      </div>
                      <div className={`text-[11px] space-y-1 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        <p>Pelanggan: <strong className={isDark ? 'text-white' : 'text-slate-900'}>Aisyah Salsabila</strong></p>
                        <p className="text-slate-500">Alamat: Jl. Cempaka Putih Raya No. 42A</p>
                        <p className="text-primary font-bold">Muatan: 3 Kantong Cucian Bersih (#INV-2405)</p>
                      </div>

                      {/* Driver Action Buttons */}
                      <div className="grid grid-cols-3 gap-1.5 pt-1 text-center text-[9px] font-black">
                        <a
                          href="https://maps.google.com"
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl flex flex-col items-center gap-0.5 shadow-xs"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Peta Maps</span>
                        </a>
                        <a
                          href="https://wa.me/6281234567890"
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex flex-col items-center gap-0.5 shadow-xs"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Chat WA</span>
                        </a>
                        <button
                          type="button"
                          className="p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl flex flex-col items-center gap-0.5 shadow-xs"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Foto Bukti</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeEcosystemTab === 'owner' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-5 text-left">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-xs font-black">
                    <Crown className="w-3.5 h-3.5" />
                    <span>Aplikasi Eksekutif Pemilik (SmartOwner)</span>
                  </div>
                  <h3 className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Pantau Omzet, Kas Laci, & Mesin IoT dari Mana Saja
                  </h3>
                  <p className={`text-xs sm:text-sm font-semibold leading-relaxed ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                    Pemilik laundry dapat memantau bisnis multi-cabang dari smartphone: cek omzet harian live, rincian kas tunai vs QRIS, peringatan deterjen menipis, dan tarik kas harian ke rekening pribadi.
                  </p>
                  <ul className="space-y-2.5 text-xs font-bold">
                    <li className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Executive Dashboard Finansial & Omzet Real-time</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Monitoring Live Armada Mesin Cuci IoT yang Berputar</span>
                    </li>
                    <li className="flex items-center gap-2 text-emerald-600">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Peringatan Kritis Stok Kimia & Fitur Tarik Saldo Kas</span>
                    </li>
                  </ul>
                  <button
                    onClick={() => handleOpenTrial(SAAS_PLANS[0])}
                    className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-black shadow-xs transition-all flex items-center gap-2"
                  >
                    <span>Coba SmartOwner App</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* SmartOwner Executive Financial Mockup (Clean White in Light Mode) */}
                <div className="lg:col-span-6">
                  <div className={`rounded-3xl border-2 p-5 sm:p-6 space-y-4 shadow-2xl text-left transition-all ${
                    isDark 
                      ? 'bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 border-indigo-500/30 text-white' 
                      : 'bg-white text-slate-900 border-slate-200 shadow-soft-xl'
                  }`}>
                    {/* Header */}
                    <div className={`flex justify-between items-center pb-3 border-b text-xs ${
                      isDark ? 'border-indigo-900/60 text-indigo-300' : 'border-slate-200 text-slate-600'
                    }`}>
                      <div>
                        <span className="text-[10px] text-primary font-bold uppercase tracking-wider">Multi-Cabang Live</span>
                        <h4 className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>SmartOwner Executive ERP</h4>
                      </div>
                      <span className="px-2.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-200">
                        3 Gerai Aktif
                      </span>
                    </div>

                    {/* Main Revenue Card */}
                    <div className={`p-4 rounded-2xl border space-y-1 ${
                      isDark 
                        ? 'bg-indigo-900/30 border-indigo-500/30' 
                        : 'bg-gradient-to-r from-sky-50 via-indigo-50 to-purple-50 border-sky-200 shadow-xs'
                    }`}>
                      <p className="text-[10px] text-primary font-bold uppercase">Total Omzet Hari Ini (Semua Gerai)</p>
                      <div className="flex items-baseline gap-2">
                        <span className={`text-3xl font-black font-mono ${isDark ? 'text-white' : 'text-slate-900'}`}>Rp 4.850.000</span>
                        <span className="text-xs font-bold text-emerald-600">+18.4% vs kemarin</span>
                      </div>
                    </div>

                    {/* Payment Channel Breakdown */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`p-3 rounded-xl border ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <p className="text-[10px] text-slate-500 font-bold">💵 Kas Tunai di Laci</p>
                        <p className={`text-base font-black font-mono mt-0.5 ${isDark ? 'text-white' : 'text-slate-900'}`}>Rp 1.650.000</p>
                      </div>
                      <div className={`p-3 rounded-xl border ${
                        isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}>
                        <p className="text-[10px] text-slate-500 font-bold">📱 QRIS & Transfer Bank</p>
                        <p className="text-base font-black text-primary font-mono mt-0.5">Rp 3.200.000</p>
                      </div>
                    </div>

                    {/* Operational Alerts */}
                    <div className={`p-3 rounded-xl border space-y-1.5 text-[11px] ${
                      isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <div className="flex justify-between items-center text-emerald-700 font-bold">
                        <span>🌀 6 Mesin Cuci IoT Sedang Berputar</span>
                        <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">Normal</span>
                      </div>
                      <div className="flex justify-between items-center text-amber-700 font-bold">
                        <span>⚠️ Stok Deterjen Gerai Rungkut</span>
                        <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded">Sisa 2.5 L</span>
                      </div>
                    </div>

                    {/* 1-Click Withdraw Button */}
                    <button
                      type="button"
                      className="w-full py-3.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-black shadow-clay-sm flex items-center justify-center gap-2 transition-all"
                    >
                      <Zap className="w-4 h-4" />
                      <span>Tarik Saldo Kas Hari Ini ke Rekening BCA</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 6. Interactive ROI Calculator */}
      <section className={`py-16 px-4 sm:px-8 border-t transition-colors ${
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-sky-50/50 border-sky-100'
      }`}>
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="text-center space-y-2">
            <span className="text-xs font-black text-primary uppercase tracking-widest">Kalkulator Simulasi Keuntungan</span>
            <h2 className={`text-2xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Berapa Banyak Omzet yang Bisa Anda Hemat & Tingkatkan?
            </h2>
            <p className={`text-xs sm:text-sm max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Geser kapasitas harian laundry Anda untuk melihat estimasi penghematan kebocoran deterjen & potensi lonjakan omzet.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Sliders */}
            <div className={`lg:col-span-6 p-6 sm:p-8 rounded-3xl border space-y-6 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
            }`}>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className={`text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Kapasitas Cucian Harian:
                  </label>
                  <span className="px-3 py-1 bg-sky-50 text-primary border border-sky-200 font-black text-xs rounded-xl">
                    {kgPerDay} kg / hari
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="500"
                  step="10"
                  value={kgPerDay}
                  onChange={(e) => setKgPerDay(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className={`flex justify-between text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span>30 kg (Gerai Kecil)</span>
                  <span>250 kg (Ramai)</span>
                  <span>500 kg (Besar)</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className={`text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Rata-rata Tarif per Kg:
                  </label>
                  <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 font-black text-xs rounded-xl">
                    Rp {pricePerKg.toLocaleString('id-ID')} / kg
                  </span>
                </div>
                <input
                  type="range"
                  min="6000"
                  max="20000"
                  step="1000"
                  value={pricePerKg}
                  onChange={(e) => setPricePerKg(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <div className={`flex justify-between text-[10px] font-bold ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                  <span>Rp 6.000</span>
                  <span>Rp 12.000</span>
                  <span>Rp 20.000 (Express/Dry Clean)</span>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className={`lg:col-span-6 p-6 sm:p-8 rounded-3xl border space-y-6 relative overflow-hidden ${
              isDark 
                ? 'bg-gradient-to-br from-slate-900 to-indigo-950/60 border-indigo-500/30 shadow-xl' 
                : 'bg-gradient-to-br from-white via-sky-50/50 to-indigo-50/40 border-sky-200 shadow-soft'
            }`}>
              <div className="space-y-1">
                <p className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Estimasi Omzet Bulanan Toko Anda:
                </p>
                <p className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Rp {monthlyRevenue.toLocaleString('id-ID')}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-950/80 border-emerald-500/30' : 'bg-white border-emerald-200 shadow-xs'
                }`}>
                  <p className="text-[10px] font-bold text-emerald-700 uppercase">Hemat Kebocoran Stok:</p>
                  <p className="text-base sm:text-lg font-black text-emerald-700 mt-1">
                    +Rp {estimatedSavings.toLocaleString('id-ID')}
                  </p>
                  <p className={`text-[9px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Kontrol deterjen & nota akurat</p>
                </div>

                <div className={`p-4 rounded-2xl border ${
                  isDark ? 'bg-slate-950/80 border-sky-500/30' : 'bg-white border-sky-200 shadow-xs'
                }`}>
                  <p className="text-[10px] font-bold text-primary uppercase">Potensi Naik Omzet:</p>
                  <p className="text-base sm:text-lg font-black text-primary mt-1">
                    +Rp {potentialGrowth.toLocaleString('id-ID')}
                  </p>
                  <p className={`text-[9px] mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Dengan kurir & paket langganan</p>
                </div>
              </div>

              <div className={`p-3.5 rounded-2xl border text-xs flex items-center justify-between font-bold ${
                isDark ? 'bg-sky-500/10 border-sky-500/30 text-sky-300' : 'bg-sky-50 border-sky-200 text-sky-800'
              }`}>
                <span>Investasi Software: <strong>Hanya Rp 250.000 / bln</strong></span>
                <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-md text-[10px] font-black">ROI &gt; 1000%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Pricing Table Section */}
      <section className={`py-20 px-4 sm:px-8 border-t transition-colors ${
        isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50/80 border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <span className="text-xs font-black text-primary uppercase tracking-widest">Pilihan Paket Berlangganan</span>
            <h2 className={`text-3xl sm:text-5xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Investasi Terjangkau, Hasil Maksimal
            </h2>
            <p className={`text-sm max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Pilih paket yang sesuai dengan skala bisnis laundry Anda. Semua paket sudah termasuk 14 Hari Trial Gratis!
            </p>

            {/* Monthly / Annual Toggle */}
            <div className={`inline-flex items-center gap-2 p-1.5 rounded-2xl border ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
            }`}>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
                  billingCycle === 'monthly' ? 'bg-primary text-white shadow-clay-sm' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Bayar Bulanan
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  billingCycle === 'annual' ? 'bg-primary text-white shadow-clay-sm' : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Bayar Tahunan</span>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-600 text-[10px] font-black rounded-full border border-emerald-500/30">
                  Hemat Rp 1,5 Juta / Diskon 50%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
            {SAAS_PLANS.map((plan) => {
              const price = billingCycle === 'annual' ? Math.round(plan.priceAnnual / 12) : plan.priceMonthly;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all relative ${
                    plan.popular
                      ? isDark 
                        ? 'bg-slate-900 border-2 border-primary ring-4 ring-primary/20 shadow-2xl scale-102 lg:-translate-y-2'
                        : 'bg-white border-2 border-primary ring-4 ring-primary/10 shadow-xl scale-102 lg:-translate-y-2'
                      : isDark
                        ? 'bg-slate-900/70 border border-slate-800 hover:border-slate-700'
                        : 'bg-white border border-slate-200 shadow-soft hover:shadow-lg'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-sky-400 to-indigo-600 text-white font-black text-[10px] uppercase tracking-wider rounded-full shadow-clay-sm">
                      {plan.badge}
                    </div>
                  )}

                  <div className="space-y-4">
                    <div>
                      <h3 className={`text-xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                      <p className={`text-xs mt-1 leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>
                    </div>

                    <div className="pt-2">
                      <div className="flex items-baseline gap-1">
                        <span className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          Rp {price.toLocaleString('id-ID')}
                        </span>
                        <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>/ bulan</span>
                      </div>
                      {billingCycle === 'annual' && (
                        <p className="text-[11px] text-emerald-600 font-bold mt-1">
                          Ditagih Rp {plan.priceAnnual.toLocaleString('id-ID')} per tahun
                        </p>
                      )}
                    </div>

                    <div className="space-y-2.5 pt-4 border-t border-slate-200/40">
                      <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        Fitur yang didapatkan:
                      </p>
                      <ul className="space-y-2">
                        {plan.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2.5 text-xs">
                            <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                            <span className={isDark ? 'text-slate-300' : 'text-slate-700 font-medium'}>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => handleOpenTrial(plan)}
                    className={`w-full py-3.5 rounded-2xl font-black text-xs shadow-clay-sm transition-all flex items-center justify-center gap-2 ${
                      plan.popular
                        ? 'bg-gradient-to-r from-sky-400 via-primary to-indigo-600 text-white hover:opacity-95'
                        : isDark
                          ? 'bg-slate-800 hover:bg-slate-700 text-white'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <span>Pilih Paket {plan.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. 🌟 INTERACTIVE FAQ SECTION WITH EXPANDABLE ACCORDION */}
      <section className={`py-20 px-4 sm:px-8 border-t transition-colors ${
        isDark ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50/80 border-slate-200'
      }`}>
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="text-center space-y-3">
            <span className="text-xs font-black text-primary uppercase tracking-widest">Pertanyaan Umum (FAQ)</span>
            <h2 className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Hal yang Sering Ditanyakan Pengusaha Laundry
            </h2>
            <p className={`text-sm max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Temukan jawaban seputar operasional, printer kasir, nomor WhatsApp, dan integrasi kurir.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Apakah saya membutuhkan hardware atau komputer khusus?',
                a: 'Tidak! LaundryKu Pro berbasis Cloud SaaS yang sangat fleksibel. Anda bisa membukanya dari smartphone Android/iPhone, tablet kasir, ataupun laptop/komputer kasir tanpa perlu instalasi rumit.'
              },
              {
                q: 'Apakah bisa cetak struk dengan printer thermal Bluetooth yang sudah saya punya?',
                a: 'Sangat bisa! Sistem kami mendukung semua merk printer thermal Bluetooth 58mm & 80mm standar (seperti Panda, Iware, Eppos, VSC, dll), termasuk printer kertas label tag anti-air.'
              },
              {
                q: 'Bagaimana cara kerja pengiriman nota WhatsApp otomatis?',
                a: 'Ketika kasir menyelesaikan input order atau mengupdate status cucian, sistem akan langsung men-trigger pesan WhatsApp ke nomor pelanggan berisi rincian nota digital, nominal, dan tautan live radar kurir.'
              },
              {
                q: 'Apakah kurir saya harus install aplikasi besar?',
                a: 'Tidak, modul SmartKurir didesain sangat ringan (PWA) yang dapat dibuka langsung dari browser HP kurir. Kurir langsung mendapatkan rute Google Maps dan tombol chat WA ke pelanggan.'
              },
              {
                q: 'Apakah ada batasan jumlah transaksi per bulan?',
                a: 'Tidak ada! Pada paket Pro Unlimited dan Enterprise, Anda mendapatkan Unlimited Transaksi dengan biaya Rp 0 per nota.'
              }
            ].map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
                  }`}
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex justify-between items-center gap-4 font-black text-xs sm:text-sm"
                  >
                    <span className={isDark ? 'text-white' : 'text-slate-900'}>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-primary transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 9. REAL TESTIMONIALS & CASE STUDIES */}
      <section className={`py-20 px-4 sm:px-8 border-t transition-colors ${
        isDark ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'
      }`}>
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black text-primary uppercase tracking-widest">Testimoni Pengusaha Laundry</span>
            <h2 className={`text-3xl sm:text-4xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              Dipercaya Lebih Dari 500+ Pengusaha di Indonesia
            </h2>
            <p className={`text-sm max-w-xl mx-auto ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
              Dengarkan cerita sukses bagaimana LaundryKu Pro membantu mereka meningkatkan omzet & mencegah kebocoran kasir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: 'Hendra Wijaya',
                laundry: 'FreshClean Express Surabaya',
                role: 'Pemilik 3 Cabang',
                quote: '“Dulu sering kecolongan deterjen dan komplain pakaian tertukar. Sekarang dengan Tag anti-air nomor rak dan IoT mesin, operasional 3 cabang saya jalan otomatis tanpa harus ditungguin tiap hari!”',
                rating: 5,
                city: 'Surabaya'
              },
              {
                name: 'Siti Nurhaliza',
                laundry: 'Berkah Kiloan Bandung',
                role: 'Laundry Mahasiswa & Kos',
                quote: '“Fitur paket langganan kuota kiloan dan WhatsApp otomatis bikin pelanggan repeat order terus. Omzet naik 40% hanya dalam 2 bulan setelah pakai software ini!”',
                rating: 5,
                city: 'Bandung'
              },
              {
                name: 'Raden Bagus Pratama',
                laundry: 'Sultan Dry Clean & Shoes Bali',
                role: 'Premium Shoe & Dry Clean',
                quote: '“Foto audit sebelum cuci menyelamatkan kami dari komplain noda lama. Pelanggan VIP sangat puas karena bisa lacak kurir via live GPS radar layaknya ojol.”',
                rating: 5,
                city: 'Denpasar, Bali'
              },
            ].map((t, idx) => (
              <div key={idx} className={`p-6 sm:p-8 rounded-3xl border space-y-4 flex flex-col justify-between ${
                isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/70 border-slate-200 shadow-xs'
              }`}>
                <div className="space-y-3">
                  <div className="flex text-amber-400 text-sm gap-0.5">
                    {'⭐'.repeat(t.rating)}
                  </div>
                  <p className={`text-xs sm:text-sm font-medium italic leading-relaxed ${
                    isDark ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    {t.quote}
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60 dark:border-slate-800">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                    {t.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                  </div>
                  <div>
                    <h4 className={`text-xs font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.name}</h4>
                    <p className="text-[10px] text-primary font-bold">{t.laundry} · {t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. Footer */}
      <footer className={`py-12 px-4 sm:px-8 border-t text-center space-y-4 transition-colors ${
        isDark ? 'bg-slate-950 border-slate-900 text-slate-500' : 'bg-white border-slate-200 text-slate-500'
      }`}>
        <div className="flex items-center justify-center gap-2 font-black text-sm text-slate-700 dark:text-slate-300">
          <span>🧼 LaundryKu SaaS Platform</span>
          <span>·</span>
          <span>PT Solusi Digital Laundry Indonesia</span>
        </div>
        <p className="text-xs text-slate-500">
          Software ERP & POS Laundry Terlengkap No. 1 di Indonesia · WhatsApp CS: +62 812-3456-7890
        </p>
      </footer>

      {/* 11. Modal Pendaftaran Trial 14 Hari & Onboarding */}
      {showTrialModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border animate-scale-up ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            
            {/* STEP 1: FORM PENDAFTARAN */}
            {trialStep === 'form' && (
              <>
                <div className="flex justify-between items-start pb-3 border-b border-slate-200/60 dark:border-slate-800">
                  <div>
                    <span className="px-2.5 py-0.5 bg-sky-50 text-primary border border-sky-200 text-[10px] font-black rounded-full uppercase tracking-wider">
                      14 HARI FREE TRIAL
                    </span>
                    <h3 className={`text-xl font-black mt-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Daftar Akun Laundry Baru
                    </h3>
                    <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                      Paket Terpilih: <strong className="text-primary font-black">{selectedPlanForTrial?.name || 'Pro Unlimited'}</strong>
                    </p>
                  </div>
                  <button
                    onClick={() => setShowTrialModal(false)}
                    className={`p-1.5 rounded-xl ${isDark ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'} transition-colors`}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleTrialSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Nama Lengkap Pemilik Laundry:
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Contoh: Budi Pratama"
                      className={`w-full border rounded-2xl px-4 py-3 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        Nama Outlet / Brand Laundry:
                      </label>
                      <input
                        type="text"
                        required
                        value={formBusiness}
                        onChange={(e) => setFormBusiness(e.target.value)}
                        placeholder="Contoh: Berkah Clean Express"
                        className={`w-full border rounded-2xl px-4 py-3 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                        }`}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                        WhatsApp Aktif (Untuk Login & Notifikasi):
                      </label>
                      <input
                        type="tel"
                        required
                        value={formPhone}
                        onChange={(e) => setFormPhone(e.target.value)}
                        placeholder="0812-3456-7890"
                        className={`w-full border rounded-2xl px-4 py-3 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                          isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                      Kota / Lokasi Gerai:
                    </label>
                    <input
                      type="text"
                      value={formCity}
                      onChange={(e) => setFormCity(e.target.value)}
                      placeholder="Contoh: Jakarta Pusat, Surabaya, Denpasar Bali"
                      className={`w-full border rounded-2xl px-4 py-3 text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                        isDark ? 'bg-slate-950 border-slate-800 text-white placeholder-slate-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 shadow-xs'
                      }`}
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 text-xs space-y-1">
                    <p className="font-black text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <span>✓ Akses Penuh 14 Hari Tanpa Kartu Kredit</span>
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold">
                      Setelah 14 hari, Anda dapat melanjutkan langganan bulanan tanpa kehilangan data transaksi.
                    </p>
                  </div>

                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowTrialModal(false)}
                      className={`flex-1 py-3.5 rounded-2xl font-bold text-xs ${
                        isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3.5 bg-gradient-to-r from-sky-400 via-primary to-indigo-600 hover:opacity-95 text-white rounded-2xl font-black text-xs shadow-clay-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Aktifkan Akun Trial 14 Hari</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}

            {/* STEP 2: PROVISIONING CLOUD DATABASE ANIMATION */}
            {trialStep === 'provisioning' && (
              <div className="py-8 text-center space-y-6 animate-fade-in">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-sky-400 via-primary to-indigo-600 flex items-center justify-center text-3xl shadow-clay-sm animate-bounce">
                  ⚡
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-black tracking-tight">Menyiapkan Gerai Anda...</h3>
                  <p className="text-xs font-semibold text-primary animate-pulse">{provisioningText}</p>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200 dark:border-slate-700">
                  <div 
                    className="bg-gradient-to-r from-sky-400 via-primary to-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${provisioningProgress}%` }}
                  ></div>
                </div>

                <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                  <span>Inisialisasi Sistem</span>
                  <span>{provisioningProgress}% Selesai</span>
                </div>
              </div>
            )}

            {/* STEP 3: SUCCESS ONBOARDING TICKET & LAUNCHPAD */}
            {trialStep === 'success_ticket' && createdTenantData && (
              <div className="space-y-6 animate-scale-up">
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-500 text-white flex items-center justify-center text-3xl shadow-clay-sm">
                    🎉
                  </div>
                  <h3 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                    Selamat, Gerai Anda Resmi Aktif!
                  </h3>
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Akun <strong>{createdTenantData.businessName}</strong> ({createdTenantData.ownerName}) telah terkonfigurasi.
                  </p>
                </div>

                {/* Digital Ticket Card */}
                <div className={`p-5 rounded-3xl border-2 border-dashed space-y-4 ${
                  isDark ? 'bg-slate-950/60 border-slate-700 text-white' : 'bg-sky-50/50 border-sky-300 text-slate-900'
                }`}>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-200 dark:border-slate-800">
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400">ID Gerai Resmi:</span>
                      <p className="text-base font-black text-primary">{createdTenantData.id}</p>
                    </div>
                    <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-black rounded-full shadow-xs">
                      Aktif 14 Hari
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs font-semibold">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">No. WhatsApp Login:</span>
                      <strong className="text-slate-800 dark:text-slate-200">{createdTenantData.ownerPhone}</strong>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block">PIN Akses Cepat:</span>
                      <strong className="text-primary font-black">1234</strong>
                    </div>
                  </div>
                </div>

                {/* Gateway Launch Buttons */}
                <div className="space-y-2.5">
                  <p className="text-xs font-black text-center text-slate-500 uppercase tracking-wider">
                    Pilih Gerbang Masuk Anda:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      onClick={() => handleLaunchPartnerPortal('owner_mobile')}
                      className="p-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white font-black text-xs shadow-lg flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">👑</span>
                      <span>Buka ERP Owner</span>
                      <span className="text-[10px] font-semibold text-indigo-200">Pantau Omzet & Laporan</span>
                    </button>

                    <button
                      onClick={() => handleLaunchPartnerPortal('web')}
                      className="p-4 rounded-2xl bg-gradient-to-r from-sky-500 to-primary hover:opacity-95 text-white font-black text-xs shadow-lg flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer group"
                    >
                      <span className="text-2xl group-hover:scale-110 transition-transform">💻</span>
                      <span>Buka Kasir POS</span>
                      <span className="text-[10px] font-semibold text-sky-200">Mulai Transaksi & Struk</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}
    </div>
  );
}
