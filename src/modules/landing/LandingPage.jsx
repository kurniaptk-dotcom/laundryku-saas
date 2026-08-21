import React, { useState } from 'react';
import { 
  Sparkles, CheckCircle2, ShieldCheck, Zap, ArrowRight, 
  Smartphone, Monitor, Crown, Truck, MessageSquare, DollarSign, 
  Scale, RefreshCw, Star, Layers, BarChart3, Lock, HelpCircle, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function LandingPage({ onNavigate }) {
  const { registerTrialTenant } = useApp();
  const [showTrialModal, setShowTrialModal] = useState(false);
  const [trialStep, setTrialStep] = useState(1); // 1: Form, 2: Provisioning, 3: Ticket
  const [formData, setFormData] = useState({
    ownerName: '',
    businessName: '',
    ownerPhone: '',
    city: 'Jakarta'
  });
  const [createdTenant, setCreatedTenant] = useState(null);

  const handleStartTrial = (e) => {
    e.preventDefault();
    if (!formData.ownerName || !formData.businessName || !formData.ownerPhone) {
      alert('Mohon lengkapi semua kolom pendaftaran.');
      return;
    }

    setTrialStep(2);
    setTimeout(() => {
      const newTenant = registerTrialTenant(formData);
      setCreatedTenant(newTenant);
      setTrialStep(3);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased selection:bg-primary selection:text-white">
      
      {/* 1. Top Navbar */}
      <nav className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 px-6 lg:px-12 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-400 via-primary to-indigo-600 flex items-center justify-center text-white text-xl shadow-clay-sm">
            🧼
          </div>
          <div>
            <span className="text-lg font-black text-white tracking-tight flex items-center gap-1.5">
              LaundryKu <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30">SaaS Pro</span>
            </span>
            <p className="text-[10px] text-slate-400 font-semibold">Operating System Bisnis Laundry Modern</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-300">
          <a href="#fitur" className="hover:text-sky-400 transition-colors">Fitur Unggulan</a>
          <a href="#alur" className="hover:text-sky-400 transition-colors">Alur Smartlink</a>
          <a href="#harga" className="hover:text-sky-400 transition-colors">Harga Paket</a>
          <a href="#faq" className="hover:text-sky-400 transition-colors">FAQ</a>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => onNavigate('pos')}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-black transition-all"
          >
            <Monitor className="w-3.5 h-3.5 text-primary" />
            <span>Login Kasir POS</span>
          </button>
          <button 
            onClick={() => setShowTrialModal(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-sky-500 via-primary to-indigo-600 hover:opacity-95 text-white text-xs font-black rounded-xl shadow-clay-sm transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Coba Gratis 14 Hari ✨
          </button>
        </div>
      </nav>

      {/* 2. Hero Header */}
      <section className="relative px-6 lg:px-12 pt-16 pb-24 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-black shadow-xs animate-bounce-subtle">
          <Sparkles className="w-4 h-4 text-amber-300 animate-spin-slow" />
          <span>Solusi Manajemen Laundry No. 1 Terintegrasi WhatsApp & IoT</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Kelola Bisnis Laundry Anda <br />
          <span className="bg-gradient-to-r from-sky-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
            Secara Otomatis & Terpusat
          </span>
        </h1>

        <p className="text-sm sm:text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
          Tingkatkan omzet gerai Anda dengan sistem timbangan digital kasir POS, notifikasi nota WhatsApp otomatis, kontrol IoT mesin cuci, hingga aplikasi pelacakan khusus konsumen & kurir.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => setShowTrialModal(true)}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-black text-sm rounded-2xl shadow-clay-lg flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Daftar Trial 14 Hari Sekarang</span>
            <ArrowRight className="w-4 h-4 stroke-[3]" />
          </button>
          <button 
            onClick={() => onNavigate('customer')}
            className="w-full sm:w-auto px-6 py-4 bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 font-black text-sm rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4 text-sky-400" />
            <span>Lihat Aplikasi Konsumen</span>
          </button>
        </div>

        {/* Floating Role Quick Switch Grid */}
        <div className="pt-12 grid grid-cols-2 sm:grid-cols-5 gap-3 max-w-3xl mx-auto">
          {[
            { role: 'customer', label: '📱 Konsumen', desc: 'Lacak & Dompet' },
            { role: 'pos', label: '💻 Kasir POS', desc: 'Timbang & Nota WA' },
            { role: 'owner', label: '👑 Owner ERP', desc: 'Omzet & Mesin' },
            { role: 'courier', label: '🛵 Kurir App', desc: 'Radar Jemput' },
            { role: 'admin', label: '⚙️ Super Admin', desc: 'Kelola Tenant' },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => onNavigate(item.role)}
              className="p-3.5 bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-sky-500/50 rounded-2xl text-left transition-all group"
            >
              <h4 className="text-xs font-black text-white group-hover:text-sky-400 transition-colors">{item.label}</h4>
              <p className="text-[10px] text-slate-400 font-medium mt-0.5">{item.desc}</p>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Real Smartlink Operational Flow Section */}
      <section id="alur" className="py-20 bg-slate-950/60 border-y border-slate-800 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-black uppercase text-sky-400 tracking-wider">Alur Standar Industri</span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Workflow Otomatis Seperti di Dunia Nyata
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
              Menghilangkan kesalahan tebak berat sendiri dengan integrasi timbangan kasir dan nota transparan via WhatsApp.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Pesan Jemputan', desc: 'Pelanggan order via aplikasi tanpa perlu menimbang sendiri (status pending).', icon: Smartphone, color: 'text-sky-400 bg-sky-500/10' },
              { step: '02', title: 'Kurir Jemput Pakaian', desc: 'Kurir menerima notifikasi rute, mengambil cucian di rumah konsumen, dan antar ke gerai.', icon: Truck, color: 'text-amber-400 bg-amber-500/10' },
              { step: '03', title: 'Timbang Kasir & Nota WA', desc: 'Kasir menimbang berat riil di POS. Nota digital & rincian tagihan terkirim otomatis ke WhatsApp.', icon: Scale, color: 'text-emerald-400 bg-emerald-500/10' },
              { step: '04', title: 'Produksi & Bayar Fleksibel', desc: 'Cucian diproses di mesin cuci IoT. Konsumen bayar via Laundry Wallet atau COD tunai.', icon: DollarSign, color: 'text-indigo-400 bg-indigo-500/10' },
            ].map((flow, i) => {
              const Icon = flow.icon;
              return (
                <div key={i} className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4 relative overflow-hidden">
                  <span className="text-3xl font-black text-slate-800 absolute right-4 top-4 select-none">{flow.step}</span>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${flow.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-base font-black text-white">{flow.title}</h4>
                    <p className="text-xs text-slate-400 font-medium leading-relaxed">{flow.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Pricing Plans */}
      <section id="harga" className="py-20 px-6 lg:px-12 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-black uppercase text-sky-400 tracking-wider">Investasi Terbaik</span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">Pilihan Paket Langganan SaaS</h2>
          <p className="text-xs sm:text-sm text-slate-400">Pilih paket sesuai skala bisnis laundry kiloan maupun satuan Anda.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              name: 'Starter Kiloan',
              price: 'Rp 99.000',
              period: '/bulan',
              desc: 'Cocok untuk outlet laundry rumahan baru rintisan.',
              features: ['1 Outlet & 2 Kasir', 'POS Kasir Timbangan Digital', 'Nota WhatsApp Manual', 'Laporan Omzet Bulanan'],
              isPopular: false
            },
            {
              name: 'LaundryKu Pro Business',
              price: 'Rp 199.000',
              period: '/bulan',
              desc: 'Pilihan paling favorit untuk laundry berkembang pesat.',
              features: ['Hingga 3 Cabang Outlet', 'Semua Fitur Starter', 'WhatsApp Autosender Otomatis', 'Aplikasi Kurir & Konsumen PWA', 'Integrasi IoT Mesin Cuci', 'Sistem Gaji & Absensi Staf'],
              isPopular: true
            },
            {
              name: 'Enterprise Franchise',
              price: 'Rp 399.000',
              period: '/bulan',
              desc: 'Untuk pemilik waralaba / jaringan cabang besar.',
              features: ['Unlimited Cabang & Kasir', 'Semua Fitur Pro', 'Custom Domain & Branding Logo', 'Dedicated Account Manager', 'Multi-Gudang & Stok Pusat', 'Akses API Terbuka'],
              isPopular: false
            }
          ].map((plan, idx) => (
            <div 
              key={idx}
              className={`p-8 rounded-3xl border flex flex-col justify-between space-y-6 relative ${
                plan.isPopular 
                  ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950/40 border-sky-500 shadow-2xl ring-1 ring-sky-500' 
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              {plan.isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-sky-500 to-indigo-600 text-[10px] font-black uppercase text-white rounded-full shadow">
                  Paling Populer ★
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-400 mt-1">{plan.desc}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-black text-white">{plan.price}</span>
                  <span className="text-xs text-slate-400 font-bold">{plan.period}</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-slate-800 text-xs font-semibold text-slate-300">
                  {plan.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowTrialModal(true)}
                className={`w-full py-3.5 rounded-2xl font-black text-xs transition-all cursor-pointer ${
                  plan.isPopular
                    ? 'bg-gradient-to-r from-sky-500 to-indigo-600 hover:opacity-95 text-white shadow-clay-sm'
                    : 'bg-slate-800 hover:bg-slate-700 text-white'
                }`}
              >
                Coba 14 Hari Gratis
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="border-t border-slate-800 py-10 px-6 lg:px-12 text-center text-xs text-slate-500">
        <p>© 2024 LaundryKu SaaS Ecosystem. Seluruh Hak Cipta Dilindungi.</p>
        <p className="mt-1">Dibuat dengan standar industri manajemen laundry terdepan.</p>
      </footer>

      {/* ================= TRIAL REGISTRATION MODAL ================= */}
      {showTrialModal && (
        <div className="fixed inset-0 z-60 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative space-y-6 animate-scale-up">
            
            <button 
              onClick={() => { setShowTrialModal(false); setTrialStep(1); }}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {trialStep === 1 && (
              <form onSubmit={handleStartTrial} className="space-y-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-sky-500/10 text-sky-400 rounded-full text-[10px] font-black">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>Aktivasi Instan 14 Hari Free</span>
                  </div>
                  <h3 className="text-xl font-black text-white">Daftarkan Gerai Laundry Anda</h3>
                  <p className="text-xs text-slate-400">Lengkapi data usaha untuk mengaktifkan database kasir & ERP cloud Anda.</p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-[11px] font-black text-slate-300 block mb-1">Nama Pemilik (Owner):</label>
                    <input 
                      type="text"
                      required
                      placeholder="Contoh: Ahmad Faisal"
                      value={formData.ownerName}
                      onChange={e => setFormData({ ...formData, ownerName: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-semibold"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-black text-slate-300 block mb-1">Nama Usaha Laundry:</label>
                    <input 
                      type="text"
                      required
                      placeholder="Contoh: LaundryKu Berkah"
                      value={formData.businessName}
                      onChange={e => setFormData({ ...formData, businessName: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-semibold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-black text-slate-300 block mb-1">No. WhatsApp Aktif:</label>
                      <input 
                        type="tel"
                        required
                        placeholder="0812xxxxxxxx"
                        value={formData.ownerPhone}
                        onChange={e => setFormData({ ...formData, ownerPhone: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-300 block mb-1">Kota Outlet:</label>
                      <input 
                        type="text"
                        required
                        placeholder="Jakarta / Surabaya"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-sky-500 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-black text-xs rounded-xl shadow-clay-sm hover:opacity-95 transition-all cursor-pointer"
                  >
                    Aktifkan Free Trial 14 Hari Sekarang →
                  </button>
                </div>
              </form>
            )}

            {trialStep === 2 && (
              <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-sky-500/20 text-sky-400 flex items-center justify-center mx-auto animate-spin">
                  <RefreshCw className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-white">Mengonfigurasi Server & Database...</h4>
                  <p className="text-xs text-slate-400">Menyiapkan workspace kasir POS, tabel transaksi, dan webhook WhatsApp.</p>
                </div>
              </div>
            )}

            {trialStep === 3 && createdTenant && (
              <div className="space-y-5 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-2xl mx-auto">
                  ✓
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white">Selamat! Gerai Anda Siap</h3>
                  <p className="text-xs text-slate-400">Database <strong className="text-sky-400">{createdTenant.businessName}</strong> aktif selama 14 hari.</p>
                </div>

                {/* Ticket Details */}
                <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-left text-xs space-y-2 text-slate-300">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tenant ID:</span>
                    <strong className="text-white font-mono">{createdTenant.id}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Owner WhatsApp:</span>
                    <strong className="text-white">{createdTenant.ownerPhone}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">PIN Kasir/Owner:</span>
                    <strong className="text-emerald-400 font-mono font-black">1234</strong>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button
                    onClick={() => { setShowTrialModal(false); onNavigate('owner'); }}
                    className="py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-clay-sm cursor-pointer"
                  >
                    👑 Buka ERP Owner
                  </button>
                  <button
                    onClick={() => { setShowTrialModal(false); onNavigate('pos'); }}
                    className="py-3 bg-primary hover:bg-primary-dark text-white font-black text-xs rounded-xl shadow-clay-sm cursor-pointer"
                  >
                    💻 Buka Kasir POS
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
