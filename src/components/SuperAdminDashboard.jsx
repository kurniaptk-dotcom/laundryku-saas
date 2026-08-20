import React, { useState } from 'react';
import { 
  Building2, Users, DollarSign, TrendingUp, Search, 
  Filter, Plus, Calendar, Clock, CheckCircle2, AlertCircle, 
  MessageCircle, ArrowUpRight, ExternalLink, RefreshCw, 
  Lock, Unlock, Sparkles, ChevronRight, Shield, Award,
  BarChart3, Check, X, Phone, MapPin, Tag, Smartphone, Monitor,
  Sun, Moon, Edit3, Trash2, Download, Send, Megaphone,
  CreditCard, Sliders, Bell, Globe, CheckCircle, Zap, ShieldCheck
} from 'lucide-react';
import { calculateSaaSMetrics, getWhatsAppInvoiceUrl, SAAS_PLANS } from '../utils/saasHelper';

export default function SuperAdminDashboard({
  tenants = [],
  onUpdateTenants,
  onSelectTenantToManage,
  onSwitchToLanding,
  onSwitchToMobile,
  theme = 'light',
  onToggleTheme
}) {
  const [internalTheme, setInternalTheme] = useState(theme);
  const activeTheme = onToggleTheme ? theme : internalTheme;
  const isDark = activeTheme === 'dark';

  const toggleMode = () => {
    if (onToggleTheme) {
      onToggleTheme();
    } else {
      setInternalTheme(prev => prev === 'light' ? 'dark' : 'light');
    }
  };

  // Active Admin View Tab
  const [adminTab, setAdminTab] = useState('tenants'); // 'tenants' | 'plans' | 'analytics' | 'broadcast' | 'settings'

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, trial, expired
  const [planFilter, setPlanFilter] = useState('all');

  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTenant, setEditingTenant] = useState(null);
  const [selectedTenantForExtend, setSelectedTenantForExtend] = useState(null);
  const [extendMonths, setExtendMonths] = useState(1);
  const [tenantToDelete, setTenantToDelete] = useState(null);
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [showPromoModal, setShowPromoModal] = useState(false);

  // Form States for Add/Edit
  const [formData, setFormData] = useState({
    businessName: '',
    ownerName: '',
    ownerPhone: '',
    city: '',
    address: '',
    planId: 'pro_unlimited',
    monthlyFee: 250000,
    status: 'active',
    branchesCount: 1,
    tagline: 'Layanan Laundry Higienis & Cepat',
    receiptFooter: 'Terima kasih atas kepercayaan Anda!'
  });

  // SaaS Plans Editable State
  const [saasPlans, setSaasPlans] = useState(SAAS_PLANS);
  const [editingPlan, setEditingPlan] = useState(null);

  // Promo Codes State
  const [promoCodes, setPromoCodes] = useState([
    { code: 'DISKON50', discount: 50, validUntil: '2026-12-31', uses: 14, maxUses: 50, active: true },
    { code: 'BERKAHRAMADHAN', discount: 30, validUntil: '2026-09-30', uses: 28, maxUses: 100, active: true },
    { code: 'STARTUPGRATIS', discount: 100, validUntil: '2026-08-31', uses: 5, maxUses: 10, active: false }
  ]);
  const [newPromoCode, setNewPromoCode] = useState({ code: '', discount: 20, maxUses: 30, validUntil: '2026-12-31' });

  // Broadcast Notification State
  const [broadcastList, setBroadcastList] = useState([
    {
      id: 'BC-101',
      title: '🚀 Rilis Fitur Baru: GPS Tracking Kurir Real-Time & Audit Foto Pakaian',
      target: 'Semua Mitra',
      date: '20 Agustus 2026',
      status: 'Terkirim (100%)'
    },
    {
      id: 'BC-102',
      title: '⚠️ Pemberitahuan Pemeliharaan Server (Minggu 02:00 - 04:00 WIB)',
      target: 'Mitra Aktif',
      date: '15 Agustus 2026',
      status: 'Terkirim (100%)'
    }
  ]);
  const [broadcastForm, setBroadcastForm] = useState({ title: '', message: '', target: 'Semua Mitra' });

  // Global Platform Settings State
  const [platformSettings, setPlatformSettings] = useState({
    platformName: 'LaundryKu Pro SaaS',
    supportPhone: '0812-3456-7890',
    supportEmail: 'support@laundryku.com',
    bankBCA: '8820-1234-5678 a/n PT LaundryKu Solusi Digital',
    bankMandiri: '141-00-9988-7766 a/n PT LaundryKu Solusi Digital',
    trialDaysDefault: 14,
    enableAutoWaReminder: true
  });

  // Calculate Real SaaS Metrics
  const metrics = calculateSaaSMetrics(tenants);

  // Filtered Tenant List
  const filteredTenants = tenants.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchPlan = planFilter === 'all' || t.planId === planFilter;
    const matchSearch = 
      (t.businessName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.ownerName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.id || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchPlan && matchSearch;
  });

  // Open Add Modal
  const handleOpenAddModal = () => {
    setFormData({
      businessName: '',
      ownerName: '',
      ownerPhone: '',
      city: '',
      address: '',
      planId: 'pro_unlimited',
      monthlyFee: 250000,
      status: 'active',
      branchesCount: 1,
      tagline: 'Layanan Laundry Higienis & Cepat',
      receiptFooter: 'Terima kasih atas kepercayaan Anda!'
    });
    setShowAddModal(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (t) => {
    setEditingTenant(t);
    setFormData({
      businessName: t.businessName || '',
      ownerName: t.ownerName || '',
      ownerPhone: t.ownerPhone || '',
      city: t.city || '',
      address: t.branding?.address || '',
      planId: t.planId || 'pro_unlimited',
      monthlyFee: t.monthlyFee || 250000,
      status: t.status || 'active',
      branchesCount: t.branchesCount || 1,
      tagline: t.branding?.tagline || 'Layanan Laundry Higienis & Cepat',
      receiptFooter: t.branding?.receiptFooter || 'Terima kasih atas kepercayaan Anda!'
    });
  };

  // Save Add Tenant
  const handleSaveAddTenant = (e) => {
    e.preventDefault();
    if (!formData.businessName || !formData.ownerName || !formData.ownerPhone) return;

    const plan = saasPlans.find(p => p.id === formData.planId) || saasPlans[0];
    const newId = `TNT-${Math.floor(100 + Math.random() * 900)}`;

    const newTenant = {
      id: newId,
      businessName: formData.businessName,
      ownerName: formData.ownerName,
      ownerPhone: formData.ownerPhone,
      city: formData.city || 'Indonesia',
      planId: plan.id,
      planName: plan.name,
      monthlyFee: Number(formData.monthlyFee) || plan.priceMonthly,
      status: formData.status,
      joinDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      daysRemaining: 30,
      branchesCount: Number(formData.branchesCount) || 1,
      totalOrdersProcessed: 0,
      totalRevenueProcessed: 0,
      whatsappQuotaUsed: 0,
      branding: {
        laundryName: formData.businessName,
        tagline: formData.tagline,
        address: formData.address || formData.city || 'Indonesia',
        phone: formData.ownerPhone,
        receiptFooter: formData.receiptFooter
      }
    };

    if (onUpdateTenants) {
      onUpdateTenants([newTenant, ...tenants]);
    }
    setShowAddModal(false);
  };

  // Save Edit Tenant
  const handleSaveEditTenant = (e) => {
    e.preventDefault();
    if (!editingTenant) return;

    const plan = saasPlans.find(p => p.id === formData.planId) || saasPlans[0];

    const updated = tenants.map(t => {
      if (t.id === editingTenant.id) {
        return {
          ...t,
          businessName: formData.businessName,
          ownerName: formData.ownerName,
          ownerPhone: formData.ownerPhone,
          city: formData.city,
          planId: plan.id,
          planName: plan.name,
          monthlyFee: Number(formData.monthlyFee) || plan.priceMonthly,
          status: formData.status,
          branchesCount: Number(formData.branchesCount) || 1,
          branding: {
            ...t.branding,
            laundryName: formData.businessName,
            tagline: formData.tagline,
            address: formData.address,
            phone: formData.ownerPhone,
            receiptFooter: formData.receiptFooter
          }
        };
      }
      return t;
    });

    if (onUpdateTenants) onUpdateTenants(updated);
    setEditingTenant(null);
  };

  // Delete Tenant
  const handleConfirmDeleteTenant = () => {
    if (!tenantToDelete) return;
    const updated = tenants.filter(t => t.id !== tenantToDelete.id);
    if (onUpdateTenants) onUpdateTenants(updated);
    setTenantToDelete(null);
  };

  // Extend Subscription
  const handleExtendSubscription = (tenantId, months) => {
    const updated = tenants.map(t => {
      if (t.id === tenantId) {
        const currentExp = new Date(t.status === 'expired' ? Date.now() : t.expiryDate);
        currentExp.setMonth(currentExp.getMonth() + Number(months));
        const newExpiryStr = currentExp.toISOString().split('T')[0];
        const days = Math.max(1, Math.round((currentExp.getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
        
        return {
          ...t,
          status: 'active',
          expiryDate: newExpiryStr,
          daysRemaining: days
        };
      }
      return t;
    });

    if (onUpdateTenants) onUpdateTenants(updated);
    setSelectedTenantForExtend(null);
  };

  // Toggle Suspend Status
  const handleToggleStatus = (tenantId) => {
    const updated = tenants.map(t => {
      if (t.id === tenantId) {
        const nextStatus = t.status === 'active' ? 'expired' : 'active';
        return { ...t, status: nextStatus };
      }
      return t;
    });
    if (onUpdateTenants) onUpdateTenants(updated);
  };

  // Send Broadcast Notification
  const handleSendBroadcast = (e) => {
    e.preventDefault();
    if (!broadcastForm.title || !broadcastForm.message) return;

    const newBroadcast = {
      id: `BC-${Math.floor(100 + Math.random() * 900)}`,
      title: broadcastForm.title,
      target: broadcastForm.target,
      date: 'Hari ini',
      status: `Terkirim ke ${broadcastForm.target}`
    };

    setBroadcastList([newBroadcast, ...broadcastList]);
    setShowBroadcastModal(false);
    setBroadcastForm({ title: '', message: '', target: 'Semua Mitra' });
    alert(`📢 Pesan broadcast berhasil dikirimkan ke ${broadcastForm.target}!`);
  };

  // Add Promo Code
  const handleAddPromoCode = (e) => {
    e.preventDefault();
    if (!newPromoCode.code) return;

    setPromoCodes([
      {
        ...newPromoCode,
        code: newPromoCode.code.toUpperCase(),
        uses: 0,
        active: true
      },
      ...promoCodes
    ]);
    setShowPromoModal(false);
    setNewPromoCode({ code: '', discount: 20, maxUses: 30, validUntil: '2026-12-31' });
  };

  // Export Tenants to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Nama Usaha', 'Owner', 'No WA', 'Kota', 'Paket', 'Biaya Bulanan', 'Status', 'Masa Aktif (Hari)', 'Jatuh Tempo', 'Total Order', 'Total Omzet (Rp)'];
    const rows = tenants.map(t => [
      t.id,
      `"${t.businessName}"`,
      `"${t.ownerName}"`,
      `"${t.ownerPhone}"`,
      `"${t.city}"`,
      `"${t.planName}"`,
      t.monthlyFee,
      t.status,
      t.daysRemaining,
      t.expiryDate,
      t.totalOrdersProcessed || 0,
      t.totalRevenueProcessed || 0
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_mitra_saas_laundry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`min-h-screen font-sans antialiased flex flex-col transition-colors duration-300 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
    }`}>
      {/* 1. Super Admin Top Bar */}
      <header className={`sticky top-0 z-40 backdrop-blur-xl border-b px-4 sm:px-6 py-3.5 flex flex-wrap justify-between items-center gap-3 transition-colors ${
        isDark ? 'bg-slate-900/90 border-slate-800 shadow-lg' : 'bg-white/90 border-slate-200 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-600 text-white flex items-center justify-center text-xl shadow-clay-sm flex-shrink-0">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className={`text-base sm:text-lg font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Super Admin Master Panel
              </h1>
              <span className={`px-2 py-0.5 text-[10px] font-black rounded-full border ${
                isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                SaaS Owner
              </span>
            </div>
            <p className={`text-[10px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Pusat Kontrol & Manajemen Ekosistem LaundryKu Pro
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Theme Toggle */}
          <button
            onClick={toggleMode}
            className={`p-2 sm:px-3 sm:py-2 rounded-xl text-xs font-black border transition-all flex items-center gap-1.5 ${
              isDark 
                ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700' 
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
            title={isDark ? 'Mode Terang' : 'Mode Gelap'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-300" /> : <Moon className="w-4 h-4 text-slate-600" />}
            <span className="hidden md:inline">{isDark ? 'Terang' : 'Gelap'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
            }`}
            title="Download Spreadsheet CSV"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>

          <button
            onClick={onSwitchToLanding}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700' : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200 shadow-xs'
            }`}
          >
            🌐 Landing Page
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2 bg-gradient-to-r from-sky-400 via-primary to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-black shadow-clay-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mitra Baru</span>
          </button>
        </div>
      </header>

      {/* 2. Admin Segmented Navigation Bar */}
      <div className={`border-b px-4 sm:px-6 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-xs'
      }`}>
        {[
          { id: 'tenants', label: '🏢 Mitra & Outlet', count: tenants.length },
          { id: 'plans', label: '💳 Paket & Skema Harga', count: saasPlans.length },
          { id: 'analytics', label: '📊 Finansial & MRR', badge: 'Live' },
          { id: 'broadcast', label: '📢 Broadcast Sistem', count: broadcastList.length },
          { id: 'settings', label: '⚙️ Konfigurasi SaaS' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setAdminTab(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 whitespace-nowrap ${
              adminTab === tab.id
                ? 'bg-primary text-white shadow-clay-sm'
                : isDark 
                ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                adminTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {tab.count}
              </span>
            )}
            {tab.badge && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                adminTab === tab.id ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* 3. Main Body Content */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`p-5 rounded-3xl border space-y-2 relative overflow-hidden transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
          }`}>
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                MRR (Monthly Recurring)
              </span>
              <DollarSign className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-emerald-600">
              Rp {metrics.mrr.toLocaleString('id-ID')}
            </p>
            <p className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Proyeksi ARR: <strong className={isDark ? 'text-white' : 'text-slate-900'}>Rp {metrics.arr.toLocaleString('id-ID')} / thn</strong>
            </p>
          </div>

          <div className={`p-5 rounded-3xl border space-y-2 relative overflow-hidden transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
          }`}>
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Total Mitra Terdaftar
              </span>
              <Building2 className="w-5 h-5 text-primary" />
            </div>
            <p className={`text-2xl sm:text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {metrics.totalTenants} Gerai
            </p>
            <div className="flex gap-2 text-[11px] font-bold">
              <span className="text-emerald-600">{metrics.activeCount} Aktif</span>
              <span className="text-slate-400">•</span>
              <span className="text-amber-600">{metrics.trialCount} Trial</span>
              <span className="text-slate-400">•</span>
              <span className="text-rose-600">{metrics.expiredCount} Expired</span>
            </div>
          </div>

          <div className={`p-5 rounded-3xl border space-y-2 relative overflow-hidden transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
          }`}>
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Total Transaksi Mitra (GMV)
              </span>
              <TrendingUp className="w-5 h-5 text-purple-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-purple-600">
              Rp {metrics.totalGmvProcessedAll.toLocaleString('id-ID')}
            </p>
            <p className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Dari <strong className={isDark ? 'text-white' : 'text-slate-900'}>{metrics.totalOrdersProcessedAll.toLocaleString('id-ID')}</strong> cucian diproses
            </p>
          </div>

          <div className={`p-5 rounded-3xl border space-y-2 relative overflow-hidden transition-all ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
          }`}>
            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Total Notifikasi WhatsApp
              </span>
              <MessageCircle className="w-5 h-5 text-sky-500" />
            </div>
            <p className="text-2xl sm:text-3xl font-black text-primary">
              {metrics.totalWhatsappQuotaUsed.toLocaleString('id-ID')} Pesan
            </p>
            <p className={`text-[11px] font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Nota & status cucian terkirim
            </p>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* TAB 1: MITRA & OUTLET TABLE */}
        {/* ========================================================================= */}
        {adminTab === 'tenants' && (
          <div className={`p-5 sm:p-6 rounded-3xl border space-y-5 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
          }`}>
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div>
                <h2 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Kelola Daftar Mitra & Outlet Laundry
                </h2>
                <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Ubah data mitra, perpanjang masa aktif, ganti paket, kirim tagihan WhatsApp, atau buka toko secara langsung.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
                <div className="relative flex-1 sm:w-64">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Cari ID / usaha / kota..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full border rounded-xl pl-9 pr-3.5 py-2 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>

                {/* Status Filter */}
                <div className={`flex p-1 rounded-xl border gap-0.5 ${
                  isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'
                }`}>
                  {[
                    { id: 'all', label: 'Semua' },
                    { id: 'active', label: 'Aktif' },
                    { id: 'trial', label: 'Trial' },
                    { id: 'expired', label: 'Expired' },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setStatusFilter(tab.id)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-black transition-all ${
                        statusFilter === tab.id
                          ? 'bg-primary text-white shadow-xs'
                          : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tenants Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200/60">
              <table className="w-full text-left text-xs">
                <thead className={`border-b text-[10px] font-black uppercase tracking-wider ${
                  isDark ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'
                }`}>
                  <tr>
                    <th className="p-4">ID & Nama Gerai</th>
                    <th className="p-4">Kontak Owner</th>
                    <th className="p-4">Kota</th>
                    <th className="p-4">Paket SaaS</th>
                    <th className="p-4">Masa Aktif & Status</th>
                    <th className="p-4 text-center">Aksi Manajemen</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
                  {filteredTenants.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-8 text-center text-slate-400">
                        Tidak ada data mitra yang sesuai pencarian.
                      </td>
                    </tr>
                  ) : (
                    filteredTenants.map((t) => {
                      const invoiceUrl = getWhatsAppInvoiceUrl(t, t.planName, t.monthlyFee);

                      return (
                        <tr key={t.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}`}>
                          <td className="p-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className={`font-black text-sm ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.businessName}</span>
                                <span className="text-[10px] text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">#{t.id}</span>
                              </div>
                              <p className={`text-[11px] font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                                {t.branchesCount || 1} Cabang · {t.totalOrdersProcessed || 0} Nota Selesai
                              </p>
                            </div>
                          </td>

                          <td className="p-4">
                            <div>
                              <p className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{t.ownerName}</p>
                              <p className="text-[11px] text-primary font-mono font-semibold">{t.ownerPhone}</p>
                            </div>
                          </td>

                          <td className={`p-4 font-semibold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3.5 h-3.5 text-slate-400" />
                              <span>{t.city}</span>
                            </span>
                          </td>

                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border ${
                              t.planId === 'enterprise' 
                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                : t.planId === 'pro_unlimited' || t.planId === 'pro'
                                ? 'bg-sky-50 text-primary border-sky-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                              {t.planName} (Rp {(t.monthlyFee/1000)}k/bln)
                            </span>
                          </td>

                          <td className="p-4">
                            <div className="space-y-1">
                              {t.status === 'active' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                  <span>Aktif ({t.daysRemaining} hari)</span>
                                </span>
                              )}
                              {t.status === 'trial' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200">
                                  <span>⏳ Trial ({t.daysRemaining} hari)</span>
                                </span>
                              )}
                              {t.status === 'expired' && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-rose-50 text-rose-700 border border-rose-200">
                                  <span>🚫 Expired</span>
                                </span>
                              )}
                              <p className="text-[10px] text-slate-400">Exp: {t.expiryDate}</p>
                            </div>
                          </td>

                          <td className="p-4">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* 1. Buka Toko (Impersonate) */}
                              {onSelectTenantToManage && (
                                <button
                                  onClick={() => onSelectTenantToManage(t)}
                                  className="px-2.5 py-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/30 rounded-xl font-black text-xs transition-all flex items-center gap-1"
                                  title="Buka Dashboard Kasir POS Gerai Ini"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                  <span>Buka Toko</span>
                                </button>
                              )}

                              {/* 2. Edit Tenant */}
                              <button
                                onClick={() => handleOpenEditModal(t)}
                                className={`p-2 rounded-xl font-bold text-xs border transition-all ${
                                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-amber-300 border-slate-700' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200'
                                }`}
                                title="Edit Data & Profil Mitra"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              {/* 3. Perpanjang Masa Aktif */}
                              <button
                                onClick={() => setSelectedTenantForExtend(t)}
                                className={`p-2 rounded-xl font-bold text-xs border transition-all ${
                                  isDark ? 'bg-slate-800 hover:bg-slate-700 text-sky-400 border-slate-700' : 'bg-sky-50 hover:bg-sky-100 text-primary border-sky-200'
                                }`}
                                title="Perpanjang Langganan"
                              >
                                <Clock className="w-3.5 h-3.5" />
                              </button>

                              {/* 4. WhatsApp Invoice */}
                              <a
                                href={invoiceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="p-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl transition-colors"
                                title="Kirim Tagihan Invoice WA"
                              >
                                <MessageCircle className="w-3.5 h-3.5" />
                              </a>

                              {/* 5. Toggle Suspend / Active */}
                              <button
                                onClick={() => handleToggleStatus(t.id)}
                                className={`p-2 rounded-xl border transition-colors ${
                                  t.status === 'active'
                                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                                    : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200'
                                }`}
                                title={t.status === 'active' ? 'Suspend Akun' : 'Aktifkan Akun'}
                              >
                                {t.status === 'active' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                              </button>

                              {/* 6. Hapus Tenant */}
                              <button
                                onClick={() => setTenantToDelete(t)}
                                className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 rounded-xl transition-colors"
                                title="Hapus Mitra dari Sistem"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PAKET & SKEMA HARGA SAAS */}
        {/* ========================================================================= */}
        {adminTab === 'plans' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Paket Langganan & Promo SaaS
                </h2>
                <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Kelola harga paket langganan bulanan/tahunan dan buat voucher kode promo diskon.
                </p>
              </div>

              <button
                onClick={() => setShowPromoModal(true)}
                className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-black shadow-clay-sm flex items-center gap-1.5"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>+ Buat Kode Promo</span>
              </button>
            </div>

            {/* Plan Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {saasPlans.map((plan) => (
                <div 
                  key={plan.id}
                  className={`p-6 rounded-3xl border space-y-4 relative ${
                    plan.popular ? 'border-primary ring-2 ring-primary/20' : 'border-slate-200'
                  } ${isDark ? 'bg-slate-900' : 'bg-white shadow-soft'}`}
                >
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-100 text-sky-800 border border-sky-200">
                      {plan.badge}
                    </span>
                    <button
                      onClick={() => setEditingPlan(plan)}
                      className="text-xs text-primary font-bold hover:underline flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Paket</span>
                    </button>
                  </div>

                  <div>
                    <h3 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{plan.name}</h3>
                    <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>{plan.description}</p>
                  </div>

                  <div className={`p-3 rounded-2xl border ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Biaya Langganan:</p>
                    <p className="text-xl font-black text-emerald-600 font-mono">
                      Rp {plan.priceMonthly.toLocaleString('id-ID')} <span className="text-xs text-slate-400 font-normal">/ bulan</span>
                    </p>
                    <p className="text-xs font-bold text-slate-500 mt-0.5">
                      Tahunan: Rp {plan.priceAnnual.toLocaleString('id-ID')} / thn
                    </p>
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <p className={`text-[11px] font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Fitur Unggulan:</p>
                    {plan.features.slice(0, 5).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span className={isDark ? 'text-slate-300' : 'text-slate-600'}>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Codes Table */}
            <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
            }`}>
              <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Daftar Kode Promo & Diskon SaaS Aktif
              </h3>

              <div className="overflow-x-auto rounded-2xl border border-slate-200/60">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b text-[10px] font-black uppercase tracking-wider ${
                    isDark ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-200'
                  }`}>
                    <tr>
                      <th className="p-3.5">Kode Promo</th>
                      <th className="p-3.5">Diskon</th>
                      <th className="p-3.5">Pemakaian</th>
                      <th className="p-3.5">Berlaku Hingga</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800/60' : 'divide-slate-100'}`}>
                    {promoCodes.map((p, i) => (
                      <tr key={i}>
                        <td className="p-3.5 font-mono font-black text-primary">{p.code}</td>
                        <td className="p-3.5 font-bold text-emerald-600">{p.discount}% OFF</td>
                        <td className="p-3.5 text-slate-600 dark:text-slate-300">{p.uses} / {p.maxUses} Mitra</td>
                        <td className="p-3.5 text-slate-400">{p.validUntil}</td>
                        <td className="p-3.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            p.active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {p.active ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ANALITIK FINANSIAL & MRR */}
        {/* ========================================================================= */}
        {adminTab === 'analytics' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Laporan Pertumbuhan Finansial & Metrik SaaS
              </h2>
              <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Analisis real-time performa bisnis SaaS LaundryKu Pro.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`p-5 rounded-3xl border space-y-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'}`}>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Customer Retention Rate</p>
                <p className="text-3xl font-black text-emerald-600">96.4%</p>
                <p className="text-[11px] text-slate-500">Tingkat perpanjangan langganan mitra</p>
              </div>

              <div className={`p-5 rounded-3xl border space-y-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'}`}>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Average Revenue Per User (ARPU)</p>
                <p className="text-3xl font-black text-primary font-mono">Rp 235.000</p>
                <p className="text-[11px] text-slate-500">Rata-rata pemasukan per gerai per bulan</p>
              </div>

              <div className={`p-5 rounded-3xl border space-y-2 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'}`}>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Churn Rate (Batal Berlangganan)</p>
                <p className="text-3xl font-black text-rose-500">3.6%</p>
                <p className="text-[11px] text-slate-500">Sangat sehat di bawah batas 5%</p>
              </div>
            </div>

            {/* Top Tenants Ranking */}
            <div className={`p-5 sm:p-6 rounded-3xl border space-y-4 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
            }`}>
              <h3 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                🏆 Top 5 Gerai Mitra Berdasarkan Transaksi (GMV)
              </h3>

              <div className="space-y-2.5">
                {[...tenants]
                  .sort((a, b) => (b.totalRevenueProcessed || 0) - (a.totalRevenueProcessed || 0))
                  .slice(0, 5)
                  .map((t, idx) => (
                    <div 
                      key={t.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                        isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 font-black text-xs flex items-center justify-center">
                          #{idx + 1}
                        </div>
                        <div>
                          <p className={`font-black text-xs ${isDark ? 'text-white' : 'text-slate-900'}`}>{t.businessName}</p>
                          <p className="text-[10px] text-slate-400">{t.ownerName} · {t.city}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="text-sm font-black text-emerald-600 font-mono">
                          Rp {(t.totalRevenueProcessed || 0).toLocaleString('id-ID')}
                        </p>
                        <p className="text-[10px] text-slate-400">{t.totalOrdersProcessed || 0} Cucian Selesai</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: BROADCAST SISTEM */}
        {/* ========================================================================= */}
        {adminTab === 'broadcast' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  Broadcast Pengumuman & Notifikasi Sistem
                </h2>
                <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Kirim pengumuman pembaruan fitur, promo, atau jadwal maintenance ke seluruh gerai mitra.
                </p>
              </div>

              <button
                onClick={() => setShowBroadcastModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-black shadow-clay-sm flex items-center gap-1.5"
              >
                <Megaphone className="w-4 h-4" />
                <span>+ Buat Broadcast Baru</span>
              </button>
            </div>

            <div className="space-y-3">
              {broadcastList.map((bc) => (
                <div 
                  key={bc.id}
                  className={`p-5 rounded-3xl border space-y-2 ${
                    isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary font-bold text-[10px] rounded-full border border-primary/20">
                      Target: {bc.target}
                    </span>
                    <span className="text-[10px] text-slate-400">{bc.date}</span>
                  </div>
                  <h4 className={`text-sm font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{bc.title}</h4>
                  <div className="flex justify-between items-center pt-2 text-xs">
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{bc.status}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">ID: {bc.id}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: KONFIGURASI GLOBAL SAAS */}
        {/* ========================================================================= */}
        {adminTab === 'settings' && (
          <div className={`p-6 rounded-3xl border space-y-6 ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-soft'
          }`}>
            <div>
              <h2 className={`text-base font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Konfigurasi Global Platform SaaS
              </h2>
              <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Pengaturan kontak support, rekening pembayaran tagihan langganan, dan kebijakan free trial.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nama Platform SaaS:</label>
                <input
                  type="text"
                  value={platformSettings.platformName}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, platformName: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nomor WhatsApp Support CS:</label>
                <input
                  type="text"
                  value={platformSettings.supportPhone}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, supportPhone: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Rekening Bank BCA Pembayaran:</label>
                <input
                  type="text"
                  value={platformSettings.bankBCA}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, bankBCA: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Rekening Bank Mandiri Pembayaran:</label>
                <input
                  type="text"
                  value={platformSettings.bankMandiri}
                  onChange={(e) => setPlatformSettings({ ...platformSettings, bankMandiri: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => alert('✅ Pengaturan platform SaaS berhasil disimpan!')}
                className="px-6 py-3 bg-gradient-to-r from-sky-400 via-primary to-indigo-600 hover:opacity-95 text-white rounded-xl text-xs font-black shadow-clay-sm transition-all"
              >
                Simpan Konfigurasi Platform ✓
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* 4. MODAL TAMBAH MITRA BARU */}
      {/* ========================================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl border animate-scale-up ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-start pb-3 border-b border-slate-200/60">
              <div>
                <h3 className="text-base font-black">Tambah Mitra Laundry Baru</h3>
                <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Input akun outlet secara manual oleh Super Admin
                </p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSaveAddTenant} className="space-y-3">
              <div className="space-y-1">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nama Bisnis / Laundry:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Berkah Laundry Pro"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nama Pemilik:</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Owner"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    placeholder="0812-xxxx"
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Kota:</label>
                  <input
                    type="text"
                    placeholder="Contoh: Jakarta"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Paket Langganan:</label>
                  <select
                    value={formData.planId}
                    onChange={(e) => {
                      const p = saasPlans.find(item => item.id === e.target.value);
                      setFormData({ ...formData, planId: e.target.value, monthlyFee: p ? p.priceMonthly : 250000 });
                    }}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    {saasPlans.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Rp {(p.priceMonthly/1000)}k)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs ${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-sky-400 via-primary to-indigo-600 hover:opacity-95 text-white rounded-xl font-black text-xs shadow-clay-sm"
                >
                  Simpan & Daftarkan Mitra ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. MODAL EDIT DATA MITRA */}
      {/* ========================================================================= */}
      {editingTenant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-lg rounded-3xl p-6 space-y-4 shadow-2xl border animate-scale-up ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-start pb-3 border-b border-slate-200/60">
              <div>
                <h3 className="text-base font-black">Edit Profil & Langganan Mitra</h3>
                <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  ID: #{editingTenant.id} · {editingTenant.businessName}
                </p>
              </div>
              <button onClick={() => setEditingTenant(null)} className="p-1.5 text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSaveEditTenant} className="space-y-3">
              <div className="space-y-1">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nama Bisnis / Brand:</label>
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nama Owner:</label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>WhatsApp:</label>
                  <input
                    type="tel"
                    required
                    value={formData.ownerPhone}
                    onChange={(e) => setFormData({ ...formData, ownerPhone: e.target.value })}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Kota:</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Paket Langganan:</label>
                  <select
                    value={formData.planId}
                    onChange={(e) => {
                      const p = saasPlans.find(item => item.id === e.target.value);
                      setFormData({ ...formData, planId: e.target.value, monthlyFee: p ? p.priceMonthly : 250000 });
                    }}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    {saasPlans.map(p => (
                      <option key={p.id} value={p.id}>{p.name} (Rp {(p.priceMonthly/1000)}k)</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Status Akun:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  >
                    <option value="active">🟢 Aktif</option>
                    <option value="trial">⏳ Trial (Uji Coba)</option>
                    <option value="expired">🚫 Expired / Nonaktif</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Biaya Bulanan (Rp):</label>
                  <input
                    type="number"
                    value={formData.monthlyFee}
                    onChange={(e) => setFormData({ ...formData, monthlyFee: e.target.value })}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingTenant(null)}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs ${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-sky-400 via-primary to-indigo-600 hover:opacity-95 text-white rounded-xl font-black text-xs shadow-clay-sm"
                >
                  Simpan Perubahan ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 6. MODAL PERPANJANG LANGGANAN */}
      {/* ========================================================================= */}
      {selectedTenantForExtend && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-md rounded-3xl p-6 space-y-5 shadow-2xl border animate-scale-up ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-start pb-3 border-b border-slate-200/60">
              <div>
                <h3 className="text-base font-black">Perpanjang Masa Aktif Mitra</h3>
                <p className={`text-xs font-semibold mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selectedTenantForExtend.businessName}
                </p>
              </div>
              <button onClick={() => setSelectedTenantForExtend(null)} className="p-1.5 text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="space-y-3">
              <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Pilih Durasi Perpanjangan:</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { months: 1, label: '+1 Bulan', fee: selectedTenantForExtend.monthlyFee },
                  { months: 6, label: '+6 Bulan', fee: Math.round(selectedTenantForExtend.monthlyFee * 5) },
                  { months: 12, label: '+1 Tahun', fee: Math.round(selectedTenantForExtend.monthlyFee * 6) },
                ].map(opt => (
                  <button
                    key={opt.months}
                    onClick={() => setExtendMonths(opt.months)}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      extendMonths === opt.months
                        ? 'border-primary bg-sky-50 text-primary font-black ring-2 ring-primary/20'
                        : isDark ? 'border-slate-800 bg-slate-950 text-slate-300' : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <p className="text-xs font-black">{opt.label}</p>
                    <p className="text-[10px] text-slate-400 mt-1">Rp {(opt.fee/1000).toLocaleString('id-ID')}k</p>
                  </button>
                ))}
              </div>
            </div>

            <div className={`p-3.5 rounded-2xl border text-xs space-y-1.5 ${
              isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex justify-between text-slate-500">
                <span>Paket Langganan:</span>
                <span className="font-bold text-slate-900 dark:text-white">{selectedTenantForExtend.planName}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Total Tagihan:</span>
                <span className="font-black text-emerald-600">
                  Rp {(selectedTenantForExtend.monthlyFee * (extendMonths === 12 ? 6 : extendMonths === 6 ? 5 : 1)).toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedTenantForExtend(null)}
                className={`flex-1 py-3 rounded-xl font-bold text-xs ${
                  isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Batal
              </button>
              <button
                onClick={() => handleExtendSubscription(selectedTenantForExtend.id, extendMonths)}
                className="flex-1 py-3 bg-gradient-to-r from-sky-400 via-primary to-indigo-600 hover:opacity-95 text-white rounded-xl font-black text-xs shadow-clay-sm"
              >
                Konfirmasi Perpanjang ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 7. MODAL HAPUS MITRA */}
      {/* ========================================================================= */}
      {tenantToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl border animate-scale-up text-center ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
              ⚠️
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-black">Hapus Mitra Laundry?</h3>
              <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                Apakah Anda yakin ingin menghapus akun <strong className="text-rose-600">{tenantToDelete.businessName}</strong> (#{tenantToDelete.id})? Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setTenantToDelete(null)}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs ${
                  isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDeleteTenant}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-xs shadow-xs"
              >
                Ya, Hapus Mitra
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 8. MODAL BROADCAST NOTIFIKASI */}
      {/* ========================================================================= */}
      {showBroadcastModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-md rounded-3xl p-6 space-y-4 shadow-2xl border animate-scale-up ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-start pb-3 border-b border-slate-200/60">
              <div>
                <h3 className="text-base font-black">Kirim Broadcast Notifikasi</h3>
                <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Kirim pesan serentak ke mitra laundry terdaftar
                </p>
              </div>
              <button onClick={() => setShowBroadcastModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleSendBroadcast} className="space-y-3">
              <div className="space-y-1">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Target Penerima:</label>
                <select
                  value={broadcastForm.target}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, target: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-primary ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  <option value="Semua Mitra">Semua Mitra (Aktif & Expired)</option>
                  <option value="Mitra Aktif">Hanya Mitra Aktif</option>
                  <option value="Mitra Trial">Hanya Mitra Trial</option>
                  <option value="Mitra Expired">Hanya Mitra Expired (Winback)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Judul Pengumuman:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Rilis Fitur Baru!"
                  value={broadcastForm.title}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, title: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Isi Pesan:</label>
                <textarea
                  rows="3"
                  required
                  placeholder="Tulis pesan pengumuman..."
                  value={broadcastForm.message}
                  onChange={(e) => setBroadcastForm({ ...broadcastForm, message: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                ></textarea>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs ${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl font-black text-xs shadow-xs"
                >
                  Kirim Broadcast 📢
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 9. MODAL BUAT KODE PROMO */}
      {/* ========================================================================= */}
      {showPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl border animate-scale-up ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-start pb-3 border-b border-slate-200/60">
              <div>
                <h3 className="text-base font-black">Buat Kode Promo SaaS</h3>
                <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Voucher diskon biaya langganan mitra
                </p>
              </div>
              <button onClick={() => setShowPromoModal(false)} className="p-1.5 text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form onSubmit={handleAddPromoCode} className="space-y-3">
              <div className="space-y-1">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Kode Kupon:</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: HEMAT50"
                  value={newPromoCode.code}
                  onChange={(e) => setNewPromoCode({ ...newPromoCode, code: e.target.value.toUpperCase() })}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs uppercase font-mono font-black focus:outline-none focus:border-primary ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Diskon (%):</label>
                  <input
                    type="number"
                    required
                    min="5"
                    max="100"
                    value={newPromoCode.discount}
                    onChange={(e) => setNewPromoCode({ ...newPromoCode, discount: Number(e.target.value) })}
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Maks Kuota:</label>
                  <input
                    type="number"
                    required
                    value={newPromoCode.maxUses}
                    onChange={(e) => setNewPromoCode({ ...newPromoCode, maxUses: Number(e.target.value) })}
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPromoModal(false)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs ${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-black text-xs shadow-xs"
                >
                  Simpan Kupon ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 10. MODAL EDIT PAKET SAAS */}
      {/* ========================================================================= */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-sm rounded-3xl p-6 space-y-4 shadow-2xl border animate-scale-up ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex justify-between items-start pb-3 border-b border-slate-200/60">
              <div>
                <h3 className="text-base font-black">Edit Paket: {editingPlan.name}</h3>
                <p className={`text-xs font-semibold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Ubah harga & deskripsi paket SaaS
                </p>
              </div>
              <button onClick={() => setEditingPlan(null)} className="p-1.5 text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const fd = new FormData(e.target);
                const updatedPlan = {
                  ...editingPlan,
                  description: fd.get('description'),
                  priceMonthly: Number(fd.get('priceMonthly')),
                  priceAnnual: Number(fd.get('priceAnnual')),
                };
                setSaasPlans(prev => prev.map(p => p.id === updatedPlan.id ? updatedPlan : p));
                setEditingPlan(null);
                alert(`✅ Paket "${updatedPlan.name}" berhasil diperbarui!`);
              }}
              className="space-y-3"
            >
              <div className="space-y-1">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Nama Paket:</label>
                <input
                  type="text"
                  value={editingPlan.name}
                  readOnly
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs font-black opacity-70 cursor-not-allowed ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}
                />
              </div>

              <div className="space-y-1">
                <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Deskripsi Paket:</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={editingPlan.description}
                  className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary resize-none ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Harga Bulanan (Rp):</label>
                  <input
                    type="number"
                    name="priceMonthly"
                    required
                    min="0"
                    defaultValue={editingPlan.priceMonthly}
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div className="space-y-1">
                  <label className={`text-xs font-bold ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>Harga Tahunan (Rp):</label>
                  <input
                    type="number"
                    name="priceAnnual"
                    required
                    min="0"
                    defaultValue={editingPlan.priceAnnual}
                    className={`w-full border rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-primary ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingPlan(null)}
                  className={`flex-1 py-2.5 rounded-xl font-bold text-xs ${
                    isDark ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-white rounded-xl font-black text-xs shadow-xs"
                >
                  Simpan Paket ✓
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
