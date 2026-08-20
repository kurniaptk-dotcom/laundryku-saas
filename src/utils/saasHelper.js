/**
 * SaaS B2B Platform Helper & Mock Data
 * Manages SaaS plans, tenant (laundry business) registrations, MRR metrics, and WhatsApp billing.
 */

export const SAAS_PLANS = [
  {
    id: 'pro_unlimited',
    name: 'Pro Unlimited (All-In-One)',
    badge: '🔥 Paling Laris & Rekomendasi',
    priceMonthly: 250000,
    priceAnnual: 1500000, // Diskon 50% (Hemat Rp 1.500.000)
    description: 'Unlimited transaksi & bebas biaya per nota. Solusi lengkap operasional & kasir untuk laundry ramai.',
    color: 'from-sky-500 via-primary to-indigo-600',
    popular: true,
    features: [
      '⚡ Unlimited Transaksi & Pesanan (Rp 0 Biaya Nota)',
      'Kasir POS Walk-In Cepat & Multi-Payment',
      'Cetak Struk Thermal 58mm & 80mm',
      'Label / Tag Pakaian Anti-Air (No. Rak)',
      'Live GPS Tracking Kurir Antar-Jemput',
      'Foto Audit Pakaian (Sebelum & Sesudah Cuci)',
      'Kirim Nota & Update WhatsApp Otomatis',
      'Paket Langganan Kuota Kiloan Member',
      'Manajemen Stok Deterjen & Bahan Baku',
      'Modul Gaji & Komisi Karyawan (Payroll)',
      'Monitoring IoT Fleet Mesin Cuci',
      'Ekspor Laporan Keuangan Excel (CSV)'
    ],
    limitations: []
  },
  {
    id: 'starter',
    name: 'Starter UMKM',
    badge: 'Paket Dasar',
    priceMonthly: 125000,
    priceAnnual: 900000,
    description: 'Untuk 1 gerai kecil yang hanya butuh kasir POS & nota digital sederhana.',
    color: 'from-blue-500 to-sky-600',
    popular: false,
    features: [
      '1 Gerai / Outlet Aktif',
      'Kasir POS Walk-In Cepat',
      'Cetak Struk Thermal 58mm & 80mm',
      'Label / Tag Pakaian Anti-Air',
      'Kirim Nota WhatsApp ke Pelanggan',
      'Maksimal 300 Pesanan / Bulan',
      'Laporan Omzet Harian Standar'
    ],
    limitations: ['Tanpa GPS Tracking Kurir', 'Tanpa Audit Foto Pakaian', 'Tanpa Manajemen Gaji']
  },
  {
    id: 'enterprise',
    name: 'Franchise & Multi-Outlet',
    badge: '👑 Multi Cabang',
    priceMonthly: 450000,
    priceAnnual: 3500000,
    description: 'Untuk jaringan franchise laundry dan multi-cabang besar dengan branding khusus.',
    color: 'from-indigo-600 via-purple-600 to-pink-600',
    popular: false,
    features: [
      'Unlimited Gerai & Multi-Branch ERP',
      'Semua Fitur Paket Pro Unlimited',
      'Custom White-Label Logo & Domain Gerai',
      'Integrasi Multi-Cabang Terpusat',
      'Prioritas WhatsApp Support 24/7',
      'Dedicated Account Manager'
    ],
    limitations: []
  }
];

export const DEFAULT_TENANTS = [
  {
    id: 'TNT-001',
    businessName: 'LaundryKu Hub Utama',
    ownerName: 'Ahmad Faisal',
    ownerPhone: '0812-3456-7890',
    city: 'Jakarta Pusat',
    planId: 'pro_unlimited',
    planName: 'Pro Unlimited',
    monthlyFee: 250000,
    status: 'active', // active, trial, expired
    joinDate: '2026-01-15',
    expiryDate: '2026-09-15',
    daysRemaining: 26,
    branchesCount: 2,
    totalOrdersProcessed: 1420,
    totalRevenueProcessed: 38500000,
    whatsappQuotaUsed: 2150,
    branding: {
      laundryName: 'LaundryKu Pro',
      tagline: 'Bersih, Rapi & Wangi Tahan Lama',
      address: 'Jl. Cempaka Putih Raya No. 42A, Jakarta Pusat',
      phone: '0812-3456-7890',
      receiptFooter: 'Terima kasih atas kepercayaan Anda! Pakaian bersih maksimal.'
    }
  },
  {
    id: 'TNT-002',
    businessName: 'FreshClean Express Surabaya',
    ownerName: 'Hendra Wijaya',
    ownerPhone: '0813-8877-6655',
    city: 'Surabaya',
    planId: 'starter',
    planName: 'Starter UMKM',
    monthlyFee: 125000,
    status: 'active',
    joinDate: '2026-02-01',
    expiryDate: '2026-09-01',
    daysRemaining: 12,
    branchesCount: 1,
    totalOrdersProcessed: 680,
    totalRevenueProcessed: 14200000,
    whatsappQuotaUsed: 890,
    branding: {
      laundryName: 'FreshClean Express',
      tagline: 'Cuci Kering Lipat 4 Jam Jadi',
      address: 'Jl. Raya Darmo No. 88, Surabaya',
      phone: '0813-8877-6655',
      receiptFooter: 'Klaim noda maksimal 1x24 jam setelah barang diterima.'
    }
  },
  {
    id: 'TNT-003',
    businessName: 'Sultan Dry Clean & Shoe Care',
    ownerName: 'Raden Bagus Pratama',
    ownerPhone: '0821-9988-1122',
    city: 'Denpasar, Bali',
    planId: 'enterprise',
    planName: 'Franchise & Multi-Outlet',
    monthlyFee: 450000,
    status: 'active',
    joinDate: '2025-11-10',
    expiryDate: '2026-11-10',
    daysRemaining: 82,
    branchesCount: 5,
    totalOrdersProcessed: 3890,
    totalRevenueProcessed: 112000000,
    whatsappQuotaUsed: 5400,
    branding: {
      laundryName: 'Sultan Dry Clean',
      tagline: 'Perawatan Pakaian Premium & Sepatu Mewah',
      address: 'Jl. Sunset Road No. 101, Kuta, Bali',
      phone: '0821-9988-1122',
      receiptFooter: 'Garansi pengerjaan profesional & wangi aromaterapi.'
    }
  },
  {
    id: 'TNT-004',
    businessName: 'Berkah Kiloan Bandung',
    ownerName: 'Siti Nurhaliza',
    ownerPhone: '0857-1122-3344',
    city: 'Bandung',
    planId: 'pro_unlimited',
    planName: 'Pro Unlimited',
    monthlyFee: 250000,
    status: 'trial', // 14-day free trial
    joinDate: '2026-08-14',
    expiryDate: '2026-08-28',
    daysRemaining: 8,
    branchesCount: 1,
    totalOrdersProcessed: 115,
    totalRevenueProcessed: 2850000,
    whatsappQuotaUsed: 190,
    branding: {
      laundryName: 'Berkah Kiloan',
      tagline: 'Murah, Bersih, Berkah',
      address: 'Jl. Dago No. 45, Bandung',
      phone: '0857-1122-3344',
      receiptFooter: 'Buka setiap hari jam 07:00 - 21:00 WIB.'
    }
  },
  {
    id: 'TNT-005',
    businessName: 'Melati Wash Yogyakarta',
    ownerName: 'Bambang Sudiro',
    ownerPhone: '0818-4455-6677',
    city: 'Yogyakarta',
    planId: 'starter',
    planName: 'Starter UMKM',
    monthlyFee: 125000,
    status: 'expired',
    joinDate: '2026-05-01',
    expiryDate: '2026-08-01',
    daysRemaining: 0,
    branchesCount: 1,
    totalOrdersProcessed: 430,
    totalRevenueProcessed: 8900000,
    whatsappQuotaUsed: 620,
    branding: {
      laundryName: 'Melati Wash',
      tagline: 'Pilihan Mahasiswa Jogja',
      address: 'Jl. Kaliurang KM 5, Sleman, Yogyakarta',
      phone: '0818-4455-6677',
      receiptFooter: 'Terima cuci kiloan & bed cover kos.'
    }
  }
];

export const calculateSaaSMetrics = (tenants = DEFAULT_TENANTS) => {
  const activeTenants = tenants.filter(t => t.status === 'active');
  const trialTenants = tenants.filter(t => t.status === 'trial');
  const expiredTenants = tenants.filter(t => t.status === 'expired');

  const mrr = activeTenants.reduce((sum, t) => sum + (t.monthlyFee || 0), 0);
  const arr = mrr * 12;
  const totalOrdersProcessedAll = tenants.reduce((sum, t) => sum + (t.totalOrdersProcessed || 0), 0);
  const totalGmvProcessedAll = tenants.reduce((sum, t) => sum + (t.totalRevenueProcessed || 0), 0);
  const totalWhatsappQuotaUsed = tenants.reduce((sum, t) => sum + (t.whatsappQuotaUsed || 0), 0);

  return {
    totalTenants: tenants.length,
    activeCount: activeTenants.length,
    trialCount: trialTenants.length,
    expiredCount: expiredTenants.length,
    mrr,
    arr,
    totalOrdersProcessedAll,
    totalGmvProcessedAll,
    totalWhatsappQuotaUsed
  };
};

export const getWhatsAppInvoiceUrl = (tenant, planName = 'Pro Business', amount = 199000) => {
  const phone = (tenant.ownerPhone || '').replace(/[^\d]/g, '');
  const cleanPhone = phone.startsWith('0') ? '62' + phone.substring(1) : phone.startsWith('62') ? phone : '6281234567890';
  
  const text = `*👑 INVOICE TAGIHAN SAAS LAUNDRYKU PRO*
━━━━━━━━━━━━━━━━━━━━
Halo Bapak/Ibu *${tenant.ownerName}* (${tenant.businessName}),

Berikut adalah rincian tagihan perpanjangan langganan software POS & ERP Laundry Anda:

📦 *Paket:* ${planName}
🏢 *Nama Gerai:* ${tenant.businessName}
📅 *Masa Aktif:* 30 Hari (1 Bulan)
💰 *Total Tagihan:* *Rp ${amount.toLocaleString('id-ID')}*

Silakan lakukan pembayaran via transfer bank atau QRIS resmi kami:
🏦 *BCA:* 8820-1234-5678 a/n PT LaundryKu Solusi Digital
📱 *QRIS:* Scan di dashboard Super Admin

Setelah transfer, mohon kirimkan bukti bayar agar akun Anda langsung diperpanjang secara otomatis. Terima kasih! 🚀`;

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
};
