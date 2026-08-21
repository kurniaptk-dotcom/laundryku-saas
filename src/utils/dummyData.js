// Clean Initial Master Data for LaundryKu SaaS System

export const INITIAL_TENANTS = [
  {
    id: 'TNT-001',
    businessName: 'LaundryKu Cempaka Putih',
    ownerName: 'Ahmad Faisal',
    ownerPhone: '089650846031',
    ownerEmail: 'faisal@laundryku.id',
    planId: 'pro',
    planName: 'LaundryKu Pro Business',
    status: 'active',
    joinedDate: '2024-01-15',
    expiryDate: '2025-01-15',
    city: 'Jakarta Pusat',
    address: 'Jl. Cempaka Putih Raya No. 42A, Jakarta Pusat',
    branding: {
      laundryName: 'LaundryKu Pro',
      tagline: 'Solusi Cuci Bersih, Higienis & Terpercaya',
      primaryColor: '#0284C7',
      logo: '🧼'
    }
  },
  {
    id: 'TNT-002',
    businessName: 'FreshWash Express',
    ownerName: 'Budi Santoso',
    ownerPhone: '081234567891',
    ownerEmail: 'budi@freshwash.id',
    planId: 'basic',
    planName: 'Starter Kiloan',
    status: 'active',
    joinedDate: '2024-03-01',
    expiryDate: '2024-09-01',
    city: 'Surabaya',
    address: 'Jl. Gubeng Kertajaya No. 12, Surabaya',
    branding: {
      laundryName: 'FreshWash Express',
      tagline: 'Cepat Bersih Wangi Seharian',
      primaryColor: '#10B981',
      logo: '🌀'
    }
  }
];

export const INITIAL_SERVICES = [
  { id: 'svc_1', name: 'Cuci & Setrika Reguler', price: 9000, unit: 'Kg', duration: '2 Hari', icon: '🧼', popular: true },
  { id: 'svc_2', name: 'Cuci & Setrika Kilat (Express)', price: 15000, unit: 'Kg', duration: '6 Jam', icon: '⚡', popular: true },
  { id: 'svc_3', name: 'Cuci Kering Saja', price: 6000, unit: 'Kg', duration: '1 Hari', icon: '👕', popular: false },
  { id: 'svc_4', name: 'Setrika Uap Presisi', price: 5000, unit: 'Kg', duration: '1 Hari', icon: '🔌', popular: false },
  { id: 'svc_5', name: 'Bed Cover & Selimut Tebal', price: 25000, unit: 'Pcs', duration: '2 Hari', icon: '🛏️', popular: true },
  { id: 'svc_6', name: 'Cuci Sepatu & Sneaker Deep Clean', price: 30000, unit: 'Pasang', duration: '2 Hari', icon: '👟', popular: true },
  { id: 'svc_7', name: 'Tas & Ransel Premium', price: 25000, unit: 'Pcs', duration: '3 Hari', icon: '🎒', popular: false },
  { id: 'svc_8', name: 'Gorden & Karpet Rumah', price: 15000, unit: 'Meter', duration: '3 Hari', icon: '🏡', popular: false }
];

export const INITIAL_CUSTOMERS = [
  {
    id: 'CUST-001',
    name: 'Aisyah Salsabila',
    phone: '0812-3456-7890',
    email: 'aisyah@gmail.com',
    address: 'Jl. Cempaka Putih Timur No. 18, Jakarta Pusat',
    walletBalance: 125000,
    loyaltyPoints: 1250,
    tier: 'Gold Member',
    totalOrders: 14,
    totalSpent: 480000
  },
  {
    id: 'CUST-002',
    name: 'Rian Pratama',
    phone: '0813-9876-5432',
    email: 'rian@gmail.com',
    address: 'Apartemen Menteng Square Lt. 12 No. 04',
    walletBalance: 45000,
    loyaltyPoints: 320,
    tier: 'Silver Member',
    totalOrders: 5,
    totalSpent: 165000
  },
  {
    id: 'CUST-003',
    name: 'Dewi Lestari',
    phone: '0857-1122-3344',
    email: 'dewi@gmail.com',
    address: 'Jl. Percetakan Negara II No. 5B',
    walletBalance: 0,
    loyaltyPoints: 50,
    tier: 'Bronze Member',
    totalOrders: 1,
    totalSpent: 35000
  }
];

export const INITIAL_COURIERS = [
  {
    id: 'CR-001',
    name: 'Doni Pratama',
    phone: '0813-9988-1122',
    vehicle: 'Honda Vario B 4821 TZX',
    rating: 4.9,
    status: 'online',
    completedToday: 8
  },
  {
    id: 'CR-002',
    name: 'Bambang Irawan',
    phone: '0821-4455-6677',
    vehicle: 'Yamaha NMAX B 3190 SKL',
    rating: 4.8,
    status: 'online',
    completedToday: 6
  }
];

export const INITIAL_MACHINES = [
  { id: 'M-01', name: 'Washer LG Inverter 15Kg #1', type: 'Washer', status: 'running', currentOrder: 'INV-240821-001', timeLeft: 24, loadCapacity: '15 Kg' },
  { id: 'M-02', name: 'Washer Electrolux 20Kg #2', type: 'Washer', status: 'idle', currentOrder: null, timeLeft: 0, loadCapacity: '20 Kg' },
  { id: 'M-03', name: 'Dryer Maytag Gas 10.5Kg #1', type: 'Dryer', status: 'running', currentOrder: 'INV-240820-003', timeLeft: 12, loadCapacity: '10.5 Kg' },
  { id: 'M-04', name: 'Dryer SpeedQueen 10.5Kg #2', type: 'Dryer', status: 'idle', currentOrder: null, timeLeft: 0, loadCapacity: '10.5 Kg' },
  { id: 'M-05', name: 'Boiler Ironing Station #1', type: 'Iron', status: 'running', currentOrder: 'INV-240820-002', timeLeft: 15, loadCapacity: 'Uap 3.5 Bar' }
];

export const INITIAL_INVENTORY = [
  { id: 'INV-1', name: 'Deterjen Cair Premium Smartwash', stock: 45, unit: 'Liter', minStock: 15, cost: 18000 },
  { id: 'INV-2', name: 'Parfum Laundry Sakura Premium', stock: 12, unit: 'Liter', minStock: 5, cost: 45000 },
  { id: 'INV-3', name: 'Softener Anti Bakteri Aroma Segar', stock: 28, unit: 'Liter', minStock: 10, cost: 22000 },
  { id: 'INV-4', name: 'Plastik Packing Jinjing 35x50', stock: 180, unit: 'Pcs', minStock: 50, cost: 500 },
  { id: 'INV-5', name: 'Hanger Kawat Kuat', stock: 320, unit: 'Pcs', minStock: 100, cost: 1200 }
];

export const INITIAL_STAFF = [
  { id: 'STF-001', name: 'Siti Rahmawati', role: 'Kasir & Frontdesk', shift: 'Pagi (07:00 - 15:00)', salary: 3200000, status: 'Hadir' },
  { id: 'STF-002', name: 'Agus Setiawan', role: 'Operator Cuci & Kering', shift: 'Pagi (07:00 - 15:00)', salary: 3000000, status: 'Hadir' },
  { id: 'STF-003', name: 'Nurul Hidayah', role: 'Operator Setrika Uap & Packing', shift: 'Sore (14:00 - 22:00)', salary: 3000000, status: 'Libur' }
];

export const INITIAL_ORDERS = [
  {
    id: 'INV-240821-001',
    customerName: 'Aisyah Salsabila',
    customerPhone: '0812-3456-7890',
    serviceName: 'Cuci & Setrika Reguler',
    serviceId: 'svc_1',
    amount: 4.5,
    unit: 'Kg',
    pricePerUnit: 9000,
    totalPrice: 40500,
    paymentStatus: 'Paid',
    paymentMethod: 'Wallet',
    status: 'washing', // 'pending_pickup' | 'received' | 'washing' | 'drying' | 'ironing' | 'ready' | 'delivered' | 'completed'
    orderTime: '21 Agu 2024, 08:30',
    eta: '23 Agu 2024, 12:00',
    courierName: 'Doni Pratama',
    pickupAddress: 'Jl. Cempaka Putih Timur No. 18, Jakarta Pusat',
    bagCount: 1,
    notes: 'Pakaian kantor tolong disetrika licin dan wangi sakura',
    history: [
      { time: '08:30', title: 'Pesanan Dibuat', desc: 'Permintaan jemput laundry via aplikasi konsumen' },
      { time: '09:15', title: 'Dijemput Kurir', desc: 'Kurir Doni Pratama mengambil bag di lokasi' },
      { time: '09:50', title: 'Ditimbang Kasir POS', desc: 'Berat riil: 4.5 Kg. Nota otomatis dikirim ke WhatsApp' },
      { time: '10:15', title: 'Mulai Dicuci', desc: 'Sedang dicuci di Washer LG Inverter #1' }
    ]
  },
  {
    id: 'INV-240821-002',
    customerName: 'Rian Pratama',
    customerPhone: '0813-9876-5432',
    serviceName: 'Cuci & Setrika Kilat (Express)',
    serviceId: 'svc_2',
    amount: 3.0,
    unit: 'Kg',
    pricePerUnit: 15000,
    totalPrice: 45000,
    paymentStatus: 'Unpaid',
    paymentMethod: 'COD',
    status: 'ironing',
    orderTime: '21 Agu 2024, 09:00',
    eta: '21 Agu 2024, 15:00',
    courierName: 'Bambang Irawan',
    pickupAddress: 'Apartemen Menteng Square Lt. 12 No. 04',
    bagCount: 1,
    notes: 'Butuh cepat jam 3 sore mau dipakai bepergian',
    history: [
      { time: '09:00', title: 'Drop-off Outlet', desc: 'Pelanggan menyerahkan pakaian langsung ke kasir' },
      { time: '09:10', title: 'Ditimbang Kasir', desc: 'Berat 3.0 Kg Express' },
      { time: '10:00', title: 'Selesai Cuci & Kering', desc: 'Pakaian telah higienis 100%' },
      { time: '11:00', title: 'Setrika Uap Presisi', desc: 'Sedang disetrika di Station #1' }
    ]
  },
  {
    id: 'INV-240821-003',
    customerName: 'Dewi Lestari',
    customerPhone: '0857-1122-3344',
    serviceName: 'Bed Cover & Selimut Tebal',
    serviceId: 'svc_5',
    amount: 1,
    unit: 'Pcs',
    pricePerUnit: 25000,
    totalPrice: 25000,
    paymentStatus: 'Unpaid',
    paymentMethod: null,
    status: 'pending_pickup',
    orderTime: '21 Agu 2024, 11:20',
    eta: 'Menunggu timbangan kasir',
    courierName: 'Doni Pratama',
    pickupAddress: 'Jl. Percetakan Negara II No. 5B',
    bagCount: 1,
    notes: 'Warna putih tolong pakai pemutih khusus kain lembut',
    history: [
      { time: '11:20', title: 'Pemesanan Jemput', desc: 'Menunggu kurir mengambil ke alamat penjemputan' }
    ]
  },
  {
    id: 'INV-240820-008',
    customerName: 'Aisyah Salsabila',
    customerPhone: '0812-3456-7890',
    serviceName: 'Cuci Sepatu & Sneaker Deep Clean',
    serviceId: 'svc_6',
    amount: 2,
    unit: 'Pasang',
    pricePerUnit: 30000,
    totalPrice: 60000,
    paymentStatus: 'Paid',
    paymentMethod: 'Wallet',
    status: 'completed',
    orderTime: '19 Agu 2024, 14:00',
    eta: '20 Agu 2024, 17:00',
    courierName: 'Doni Pratama',
    pickupAddress: 'Jl. Cempaka Putih Timur No. 18, Jakarta Pusat',
    bagCount: 1,
    notes: 'Sepatu Nike Air Jordan & Converse',
    history: [
      { time: '19 Agu, 14:00', title: 'Pesanan Selesai', desc: 'Sepatu bersih telah diterima konsumen' }
    ]
  }
];

export const PROMO_VOUCHERS = [
  {
    code: 'CLEAN30',
    title: 'Diskon 30% Cuci Sepatu & Tas',
    discountPct: 30,
    minSpend: 50000,
    validUntil: '31 Des 2025',
    color: 'from-sky-500 to-indigo-600'
  },
  {
    code: 'FREEONGKIR',
    title: 'Gratis Ongkir Antar Jemput',
    discountPct: 100,
    minSpend: 25000,
    validUntil: '31 Des 2025',
    color: 'from-teal-500 to-emerald-600'
  },
  {
    code: 'MEMBERVIP',
    title: 'Diskon Kiloan Spesial Gold Member 20%',
    discountPct: 20,
    minSpend: 30000,
    validUntil: '31 Des 2025',
    color: 'from-amber-500 to-orange-600'
  }
];
