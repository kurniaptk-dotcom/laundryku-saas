import React, { useState, useEffect } from 'react';
import MobileEmulator from './components/MobileEmulator';
import WebDashboard from './components/WebDashboard';
import TopUpModal from './components/TopUpModal';
import SaaSLandingPage from './components/SaaSLandingPage';
import SuperAdminDashboard from './components/SuperAdminDashboard';
import TenantSettingsModal from './components/TenantSettingsModal';
import SmartCourierApp from './components/screens/SmartCourierApp';
import SmartOwnerMobile from './components/screens/SmartOwnerMobile';
import DedicatedRoleLoginPage from './components/DedicatedRoleLoginPage';
import { Smartphone, Monitor, Info, Sparkles, Check, Bell, X, AlertCircle, RefreshCw, UserCheck, Globe, Building2, Crown, Truck, User, Sun, Moon } from 'lucide-react';
import { calculateTier } from './utils/tierHelper';
import { createSubscriptionInstance, isSubscriptionActive, SUBSCRIPTION_PLANS } from './utils/subscriptionHelper';
import { DEFAULT_STAFF, calculatePayroll, exportPayrollToCSV } from './utils/payrollHelper';
import { DEFAULT_REVIEWS } from './utils/feedbackHelper';
import { DEFAULT_ORDER_PHOTOS } from './utils/photoAuditHelper';
import { DEFAULT_TENANTS } from './utils/saasHelper';
import { resolveCurrentRoute, navigateToModule } from './utils/routeHelper';
import { AutoManager } from './utils/autoManager';

// Helper for LocalStorage Persistence
const getStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
};

const setStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(e);
  }
};

export default function App() {
  const [activeView, setActiveView] = useState(() => resolveCurrentRoute()); // 'saas_landing' | 'web' | 'super_admin' | 'mobile' | 'owner_mobile' | 'courier_app'
  const [authenticatedRoles, setAuthenticatedRoles] = useState(() => getStorage('laundry_auth_roles', {
    super_admin: false,
    web: false,
    owner_mobile: false,
    courier_app: false,
    mobile: false,
    saas_landing: true
  }));

  useEffect(() => {
    setStorage('laundry_auth_roles', authenticatedRoles);
  }, [authenticatedRoles]);

  // Unified Role Logout Handler
  const handleRoleLogout = (roleKeyToLogout) => {
    setAuthenticatedRoles(prev => ({ ...prev, [roleKeyToLogout]: false }));
    triggerToast('Sesi Berakhir', 'Anda telah berhasil keluar dari portal.', 'info');
  };

  // Autopilot Engine Initialization
  useEffect(() => {
    AutoManager.initSystem();
  }, []);

  // Sync route navigation function
  const handleSwitchView = (newView) => {
    setActiveView(newView);
    navigateToModule(newView);
  };
  const [theme, setTheme] = useState(() => getStorage('laundry_theme', 'light')); // 'light' (default) | 'dark'
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // SaaS Multi-Tenant State
  const [tenants, setTenants] = useState(() => getStorage('laundry_saas_tenants', DEFAULT_TENANTS));
  const [currentTenantId, setCurrentTenantId] = useState(() => getStorage('laundry_current_tenant_id', 'TNT-001'));
  const [isBrandingModalOpen, setIsBrandingModalOpen] = useState(false);

  const currentTenant = tenants.find(t => t.id === currentTenantId) || tenants[0] || DEFAULT_TENANTS[0];

  useEffect(() => {
    setStorage('laundry_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    setStorage('laundry_saas_tenants', tenants);
  }, [tenants]);

  useEffect(() => {
    setStorage('laundry_current_tenant_id', currentTenantId);
  }, [currentTenantId]);

  // PWA Install Event Listeners
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      console.log('LaundryKu PWA successfully installed!');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallPWA = async () => {
    if (!deferredPrompt) {
      alert('📱 Cara Install LaundryKu ke Layar HP/Desktop:\n\n1. Di Chrome/Edge: Klik ikon Install di address bar, atau menu (titik tiga) > "Install LaundryKu".\n2. Di Safari iOS: Tap tombol Share (kotak panah ke atas) > pilih "Add to Home Screen" / "Tambahkan ke Layar Utama".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsInstallable(false);
    }
    setDeferredPrompt(null);
  };
  
  // 1. Member Customers CRM (Multi-user Data)
  const defaultCustomers = [
    { 
      id: 'CUST-001', 
      name: 'Aisyah Salsabila', 
      email: 'aisyah@laundrymail.com', 
      phone: '0812-3456-7890', 
      address: 'Jalan Cempaka Putih Raya No. 42A, Jakarta Pusat', 
      tier: 'VIP Gold', 
      balance: 125000, 
      points: 1250, 
      totalSpent: 1450000,
      totalOrders: 25,
      lastOrderDate: '15 Mei 2024',
      preferences: 'Pewangi Lavender Bloom, Baju Sutra Cuci Halus',
      subscription: {
        planId: 'plan_kost',
        planName: 'Paket Anak Kost Hemat',
        totalKg: 25,
        remainingKg: 20,
        validUntil: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000).toISOString(),
        validUntilFormatted: '15 Juni 2024',
        active: true
      }
    },
    { 
      id: 'CUST-002', 
      name: 'Budi Pratama', 
      email: 'budi.pratama@mail.com', 
      phone: '0813-8899-7711', 
      address: 'Jl. Rawasari Selatan No. 18, Jakarta Pusat', 
      tier: 'Member Bronze', 
      balance: 45000, 
      points: 250, 
      totalSpent: 180000,
      totalOrders: 5,
      lastOrderDate: '18 April 2024',
      preferences: 'Deterjen Non-Parfum, Tanpa Softener'
    },
    { 
      id: 'CUST-003', 
      name: 'Citra Dewi', 
      email: 'citra.dewi@gmail.com', 
      phone: '0857-1122-3344', 
      address: 'Apartemen Green Pramuka Tower C 12-08', 
      tier: 'Member Silver', 
      balance: 20000, 
      points: 60, 
      totalSpent: 480000,
      totalOrders: 8,
      lastOrderDate: '10 Mei 2024',
      preferences: 'Parfum Ocean Fresh, Kemeja Digantung Hanger'
    },
    { 
      id: 'CUST-004', 
      name: 'Daffa Pradipta', 
      email: 'daffa.sultan@gmail.com', 
      phone: '0811-9988-2233', 
      address: 'Menteng Residence Blok A No. 12, Jakarta Pusat', 
      tier: 'Platinum Sultan', 
      balance: 450000, 
      points: 4800, 
      totalSpent: 2650000,
      totalOrders: 38,
      lastOrderDate: '14 Mei 2024',
      preferences: 'Layanan Express VIP, Parfum Sweet Floral, Sepatu Deep Clean'
    }
  ];
  const [customers, setCustomers] = useState(() => getStorage('laundry_customers', defaultCustomers));

  // Current Logged-in Customer on Mobile App
  const [currentCustomerId, setCurrentCustomerId] = useState(() => getStorage('laundry_current_cust_id', 'CUST-001'));
  const [isLoggedIn, setIsLoggedIn] = useState(() => getStorage('laundry_is_logged_in', true));
  const currentCustomer = customers.find(c => c.id === currentCustomerId) || customers[0] || defaultCustomers[0];

  const walletBalance = currentCustomer?.balance ?? 125000;
  const loyaltyPoints = currentCustomer?.points ?? 1250;

  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const [currentMobileScreen, setCurrentMobileScreen] = useState('home');
  const [currentOrderViewId, setCurrentOrderViewId] = useState('INV-240515-001');
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [justCreatedOrderId, setJustCreatedOrderId] = useState('');

  // 2. Dynamic Service Catalog (CRUD Persisted)
  const defaultServices = [
    { id: 'cuci_setrika', name: 'Cuci & Setrika', price: 12000, unit: 'Kg', desc: 'Cuci bersih, wangi, plus setrika licin rapi', icon: '🧼', active: true },
    { id: 'cuci_kering', name: 'Cuci Kering', price: 18000, unit: 'Kg', desc: 'Cuci higienis tanpa setrika, siap pakai', icon: '👕', active: true },
    { id: 'setrika_saja', name: 'Setrika Saja', price: 6000, unit: 'Kg', desc: 'Hanya setrika licin & semprot parfum tahan lama', icon: '🔌', active: true },
    { id: 'bed_cover', name: 'Bed Cover / Selimut', price: 25000, unit: 'Pc', desc: 'Pencucian khusus bahan tebal dan lembut', icon: '🛏️', active: true },
    { id: 'sepatu', name: 'Deep Clean Sepatu', price: 20000, unit: 'Pasang', desc: 'Pembersihan sol, upper, dan perawatan anti jamur', icon: '👟', active: true }
  ];
  const [services, setServices] = useState(() => getStorage('laundry_services', defaultServices));

  // 3. Dynamic Promo Vouchers (CRUD Persisted)
  const defaultPromos = [
    { id: 'p1', code: 'WNDCLEAN30', title: 'Diskon Kilat 30%', desc: 'Khusus layanan Cuci & Setrika setiap akhir pekan.', tag: 'Spesial Weekend', discountPct: 30, color: 'from-sky-500 to-indigo-600', active: true },
    { id: 'p2', code: 'FREEONGKIR', title: 'Potongan Ongkir Rp10.000', desc: 'Bebas biaya antar-jemput ke seluruh area.', tag: 'Pengguna Baru', discountPct: 100, color: 'from-rose-500 to-pink-600', active: true },
    { id: 'p3', code: 'SNEAKERPRO', title: 'Sepatu Bersih Diskon 25%', desc: 'Deep cleaning sneakers & sepatu kulit.', tag: 'Perawatan Khusus', discountPct: 25, color: 'from-emerald-500 to-teal-600', active: true }
  ];
  const [promos, setPromos] = useState(() => getStorage('laundry_promos', defaultPromos));

  // 4. Couriers & Drivers Fleet (CRUD Persisted)
  const defaultCouriers = [
    { id: 'c1', name: 'Doni Pratama', phone: '0812-9988-7711', vehicle: 'Honda Vario (B 4821 KLO)', rating: '4.9 ⭐', avatar: 'DP', active: true, status: 'Siaga' },
    { id: 'c2', name: 'Joko Susilo', phone: '0813-2233-4455', vehicle: 'Yamaha NMax (B 3192 TZX)', rating: '4.95 ⭐', avatar: 'JS', active: true, status: 'Siaga' },
    { id: 'c3', name: 'Rangga Wijaya', phone: '0857-1122-8899', vehicle: 'Honda PCX (B 6789 BCD)', rating: '4.88 ⭐', avatar: 'RW', active: true, status: 'Siaga' }
  ];
  const [couriers, setCouriers] = useState(() => getStorage('laundry_couriers', defaultCouriers));

  // 5. Active orders list with explicit customerId and customerName
  const defaultActiveOrders = [
    {
      id: 'INV-240515-001',
      customerId: 'CUST-001',
      customerName: 'Aisyah Salsabila',
      customerPhone: '0812-3456-7890',
      serviceName: 'Cuci & Setrika',
      type: 'kg',
      amount: 5,
      unit: 'Kg',
      status: 'washing',
      paymentMethod: 'Wallet',
      courierId: 'c1',
      courierName: 'Doni Pratama (Honda Vario B 4821 KLO)',
      orderTime: '15 Mei 2024, 10:30',
      statusTime: '15 Mei 2024, 11:00',
      eta: '16 Mei 2024, 15:00',
      notes: 'Gunakan pewangi lavender ekstra',
      totalPrice: 53000
    },
    {
      id: 'INV-240515-002',
      customerId: 'CUST-002',
      customerName: 'Budi Pratama',
      customerPhone: '0813-8899-7711',
      serviceName: 'Cuci Kering',
      type: 'kg',
      amount: 3,
      unit: 'Kg',
      status: 'received',
      paymentMethod: 'QRIS',
      courierId: 'c2',
      courierName: 'Joko Susilo (Yamaha NMax B 3192 TZX)',
      orderTime: '15 Mei 2024, 11:15',
      statusTime: '15 Mei 2024, 11:15',
      eta: '16 Mei 2024, 17:00',
      notes: 'Pakaian kantor putih',
      totalPrice: 54000
    }
  ];
  const [activeOrders, setActiveOrders] = useState(() => getStorage('laundry_active_orders', defaultActiveOrders));

  // 6. Order history list (Persisted)
  const defaultOrderHistory = [
    { id: 'INV-240512-003', customerId: 'CUST-001', customerName: 'Aisyah Salsabila', customerPhone: '0812-3456-7890', serviceName: 'Cuci Kering', amount: 3, unit: 'Kg', status: 'Selesai', paymentMethod: 'QRIS', price: 'Rp 75.000', totalPrice: 75000, date: '12 Mei 2024' },
    { id: 'INV-240509-002', customerId: 'CUST-001', customerName: 'Aisyah Salsabila', customerPhone: '0812-3456-7890', serviceName: 'Cuci & Setrika', amount: 7, unit: 'Kg', status: 'Selesai', paymentMethod: 'Wallet', price: 'Rp 98.000', totalPrice: 98000, date: '09 Mei 2024' },
    { id: 'INV-240506-001', customerId: 'CUST-003', customerName: 'Citra Dewi', customerPhone: '0857-1122-3344', serviceName: 'Deep Clean Sepatu', amount: 2, unit: 'Pasang', status: 'Diambil', paymentMethod: 'Tunai Kasir', price: 'Rp 60.000', totalPrice: 60000, date: '06 Mei 2024' }
  ];
  const [orderHistory, setOrderHistory] = useState(() => getStorage('laundry_order_history', defaultOrderHistory));

  // 7. Machines Fleet State with Rich Specs & Hardware Info
  const defaultMachines = [
    {
      id: 'MC-01',
      name: 'Mesin Cuci Front Load 1',
      brand: 'LG Commercial Pro',
      modelNo: 'FH069FD3F Titan-C',
      serialNumber: 'LG-SN-2024-9981',
      type: 'washer',
      powerType: 'Inverter Direct Drive (220V/50Hz)',
      spinSpeed: '1200 RPM',
      capacity: '10 Kg',
      installationDate: '10 Januari 2024',
      lastServiceDate: '15 Mei 2024',
      ipAddress: '192.168.1.101',
      status: 'running',
      assignedOrderId: 'INV-240515-001',
      programName: 'Normal Heavy Clean',
      tempC: '40°C',
      timeLeft: 22,
      totalDuration: 35,
      healthScore: 98,
      totalCycles: 142
    },
    {
      id: 'MC-02',
      name: 'Mesin Cuci Front Load 2',
      brand: 'Speed Queen Heavy Duty',
      modelNo: 'SC-60 Quantum Gold',
      serialNumber: 'SQ-SN-2024-4412',
      type: 'washer',
      powerType: 'Industrial High-Torque 3-Phase',
      spinSpeed: '1400 RPM',
      capacity: '10 Kg',
      installationDate: '15 Februari 2024',
      lastServiceDate: '10 Mei 2024',
      ipAddress: '192.168.1.102',
      status: 'idle',
      assignedOrderId: null,
      programName: '-',
      tempC: '-',
      timeLeft: 0,
      totalDuration: 0,
      healthScore: 100,
      totalCycles: 89
    },
    {
      id: 'DR-01',
      name: 'Mesin Pengering Gas 1',
      brand: 'Maytag Commercial',
      modelNo: 'MDG28PC TurboVent',
      serialNumber: 'MY-SN-2024-1102',
      type: 'dryer',
      powerType: 'Gas LPG High Pressure (24.000 BTU)',
      spinSpeed: 'Airflow 230 CFM',
      capacity: '12 Kg',
      installationDate: '10 Januari 2024',
      lastServiceDate: '01 Mei 2024',
      ipAddress: '192.168.1.103',
      status: 'idle',
      assignedOrderId: null,
      programName: '-',
      tempC: '-',
      timeLeft: 0,
      totalDuration: 0,
      healthScore: 94,
      totalCycles: 210
    },
    {
      id: 'DR-02',
      name: 'Mesin Pengering Gas 2',
      brand: 'Electrolux Professional',
      modelNo: 'TD6-14 Line 6000',
      serialNumber: 'EL-SN-2024-7733',
      type: 'dryer',
      powerType: 'Gas LPG Dual Burner Eco',
      spinSpeed: 'Airflow 250 CFM',
      capacity: '12 Kg',
      installationDate: '20 Maret 2024',
      lastServiceDate: '18 Mei 2024',
      ipAddress: '192.168.1.104',
      status: 'running',
      assignedOrderId: 'INV-240515-002',
      programName: 'Turbo High-Heat Dry',
      tempC: '65°C',
      timeLeft: 14,
      totalDuration: 30,
      healthScore: 96,
      totalCycles: 175
    }
  ];
  const [machines, setMachines] = useState(() => getStorage('laundry_machines', defaultMachines));

  // 8. Inventory & Chemical Supplies (Persisted)
  const defaultInventory = [
    { id: 'inv_1', name: 'Deterjen Cair Konsentrat Pro', category: 'Chemical', stock: 45, unit: 'Liter', minStock: 15, costPerUnit: 18000, supplier: 'CV Kimia Bersih Abadi', lastRestock: '14 Mei 2024', icon: '🧼' },
    { id: 'inv_2', name: 'Softener & Pelembut Sakura', category: 'Chemical', stock: 28, unit: 'Liter', minStock: 10, costPerUnit: 15000, supplier: 'CV Kimia Bersih Abadi', lastRestock: '10 Mei 2024', icon: '🌸' },
    { id: 'inv_3', name: 'Parfum Laundry Lavender Bloom', category: 'Fragrance', stock: 12, unit: 'Liter', minStock: 8, costPerUnit: 45000, supplier: 'Aroma Wangi Sentosa', lastRestock: '12 Mei 2024', icon: '🧴' },
    { id: 'inv_4', name: 'Parfum Laundry Ocean Breeze', category: 'Fragrance', stock: 6, unit: 'Liter', minStock: 8, costPerUnit: 45000, supplier: 'Aroma Wangi Sentosa', lastRestock: '08 Mei 2024', icon: '🌊' },
    { id: 'inv_5', name: 'Plastik Packing Jinjing 5kg', category: 'Packaging', stock: 350, unit: 'Lembar', minStock: 100, costPerUnit: 450, supplier: 'Mitra Plastik Jaya', lastRestock: '01 Mei 2024', icon: '🛍️' },
    { id: 'inv_6', name: 'Plastik Packing Jinjing 10kg', category: 'Packaging', stock: 80, unit: 'Lembar', minStock: 100, costPerUnit: 700, supplier: 'Mitra Plastik Jaya', lastRestock: '01 Mei 2024', icon: '📦' },
    { id: 'inv_7', name: 'Hanger Kawat Anti Karat', category: 'Hardware', stock: 240, unit: 'Pcs', minStock: 50, costPerUnit: 1200, supplier: 'Perlengkapan Laundry Mandiri', lastRestock: '15 April 2024', icon: '👔' },
    { id: 'inv_8', name: 'Pita / Label Tagging Nomor', category: 'Hardware', stock: 12, unit: 'Roll', minStock: 5, costPerUnit: 12000, supplier: 'Mitra Plastik Jaya', lastRestock: '20 April 2024', icon: '🏷️' }
  ];
  const [inventory, setInventory] = useState(() => getStorage('laundry_inventory', defaultInventory));

  // 9. Notifications & Live Toast System
  const [notifications, setNotifications] = useState(() => getStorage('laundry_notifications', [
    { id: 'notif_1', title: 'Pesanan Dicuci', message: 'Pakaian pada invoice INV-240515-001 sedang diproses di mesin cuci.', time: '11:00', read: false },
    { id: 'notif_2', title: 'Bonus Poin Masuk', message: 'Selamat! Anda mendapatkan +100 Loyalty Points dari order sebelumnya.', time: 'Kemarin', read: true }
  ]));

  const [activeToast, setActiveToast] = useState(null);

  // 10. Staff List & Payroll
  const [staffList, setStaffList] = useState(() => getStorage('laundry_staff', DEFAULT_STAFF));

  // 11. Customer Reviews & CS Resolution
  const [reviews, setReviews] = useState(() => getStorage('laundry_reviews', DEFAULT_REVIEWS));

  // 12. Garment Audit Photos
  const [orderPhotos, setOrderPhotos] = useState(() => getStorage('laundry_order_photos', DEFAULT_ORDER_PHOTOS));

  // Sync to LocalStorage
  useEffect(() => setStorage('laundry_current_cust_id', currentCustomerId), [currentCustomerId]);
  useEffect(() => setStorage('laundry_is_logged_in', isLoggedIn), [isLoggedIn]);
  useEffect(() => setStorage('laundry_customers', customers), [customers]);
  useEffect(() => setStorage('laundry_services', services), [services]);
  useEffect(() => setStorage('laundry_promos', promos), [promos]);
  useEffect(() => setStorage('laundry_couriers', couriers), [couriers]);
  useEffect(() => setStorage('laundry_active_orders', activeOrders), [activeOrders]);
  useEffect(() => setStorage('laundry_order_history', orderHistory), [orderHistory]);
  useEffect(() => setStorage('laundry_machines', machines), [machines]);
  useEffect(() => setStorage('laundry_inventory', inventory), [inventory]);
  useEffect(() => setStorage('laundry_staff', staffList), [staffList]);
  useEffect(() => setStorage('laundry_reviews', reviews), [reviews]);
  useEffect(() => setStorage('laundry_order_photos', orderPhotos), [orderPhotos]);
  useEffect(() => setStorage('laundry_notifications', notifications), [notifications]);

  // Real-time IoT Machine Timer Countdown Simulator
  useEffect(() => {
    const timerInterval = setInterval(() => {
      setMachines(prevMachines => {
        let hasChanges = false;
        const updated = prevMachines.map(machine => {
          if (machine.status === 'running' && machine.timeLeft > 0) {
            hasChanges = true;
            const nextTime = machine.timeLeft - 1;
            if (nextTime <= 0) {
              if (machine.assignedOrderId) {
                setTimeout(() => {
                  const targetStatus = machine.type === 'washer' ? 'drying' : 'ironing';
                  handleUpdateOrderStatus(machine.assignedOrderId, targetStatus);
                  triggerToast(
                    'Siklus Mesin Selesai! ✨',
                    `${machine.name} selesai. Order ${machine.assignedOrderId} otomatis berpindah ke tahap ${targetStatus === 'drying' ? 'Pengeringan' : 'Setrika & Packing'}.`,
                    'success'
                  );
                }, 500);
              }
              return {
                ...machine,
                status: 'idle',
                timeLeft: 0,
                assignedOrderId: null,
                programName: '-',
                totalCycles: (machine.totalCycles || 100) + 1
              };
            }
            return { ...machine, timeLeft: nextTime };
          }
          return machine;
        });
        return hasChanges ? updated : prevMachines;
      });
    }, 4000);

    return () => clearInterval(timerInterval);
  }, []);

  const triggerToast = (title, message, type = 'info') => {
    setActiveToast({ title, message, type });
    const newNotif = {
      id: `notif_${Date.now()}`,
      title,
      message,
      time: new Intl.DateTimeFormat('id-ID', { timeStyle: 'short' }).format(new Date()),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);

    setTimeout(() => {
      setActiveToast(null);
    }, 4500);
  };

  const handleLogin = (customerId) => {
    setCurrentCustomerId(customerId);
    setIsLoggedIn(true);
    const cust = customers.find(c => c.id === customerId);
    triggerToast('Login Berhasil! 🎉', `Selamat datang kembali, ${cust?.name || 'Pelanggan Setia'}!`, 'success');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAuthenticatedRoles(prev => ({ ...prev, mobile: false }));
    triggerToast('Anda Telah Logout', 'Silakan masukkan nomor WhatsApp Anda untuk masuk kembali.', 'info');
  };

  const handleRegister = (newCustData) => {
    setCustomers(prev => [newCustData, ...prev]);
    setCurrentCustomerId(newCustData.id);
    setIsLoggedIn(true);
    triggerToast('Pendaftaran Berhasil! 🎁', `Selamat datang ${newCustData.name}! Bonus 100 Reward Points telah masuk ke akun Anda.`, 'success');
  };

  const handleTopUp = (amount) => {
    setCustomers(prev => prev.map(c => {
      if (c.id === currentCustomer.id) {
        return { ...c, balance: c.balance + amount };
      }
      return c;
    }));
    triggerToast('Top Up Berhasil', `Saldo ${currentCustomer.name} bertambah Rp ${amount.toLocaleString('id-ID')}`, 'success');
  };

  const handlePurchaseSubscription = (planId) => {
    const newSub = createSubscriptionInstance(planId);
    const plan = SUBSCRIPTION_PLANS.find(p => p.id === planId);
    setCustomers(prev => prev.map(c => {
      if (c.id === currentCustomer.id) {
        return {
          ...c,
          balance: Math.max(0, c.balance - (plan?.price || 0)),
          subscription: newSub
        };
      }
      return c;
    }));
    triggerToast('Paket Kuota Aktif! 🧺', `Berhasil mengaktifkan ${newSub.planName} (+${newSub.totalKg} Kg).`, 'success');
  };

  const handleAddOrder = (newOrder) => {
    const currentTier = calculateTier(currentCustomer.totalSpent || 0);
    const earnedPoints = Math.floor((newOrder.totalPrice / 1000) * (currentTier.pointMultiplier || 1));
    const today = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date());

    setCustomers(prev => prev.map(c => {
      if (c.id === currentCustomer.id) {
        const nextBalance = newOrder.paymentMethod === 'Wallet' || !newOrder.paymentMethod 
          ? Math.max(0, c.balance - newOrder.totalPrice) 
          : c.balance;
        const nextTotalSpent = (c.totalSpent || 0) + newOrder.totalPrice;
        const nextTier = calculateTier(nextTotalSpent);
        const didLevelUp = nextTier.id !== currentTier.id && nextTotalSpent >= nextTier.minSpend;

        if (didLevelUp) {
          setTimeout(() => {
            triggerToast('🎉 Level Up Member!', `Selamat ${c.name}! Anda resmi naik level ke ${nextTier.name}. Nikmati diskon otomatis & benefit baru!`, 'success');
          }, 800);
        }

        // Deduct subscription kg if used
        let updatedSub = c.subscription;
        if (newOrder.paymentMethod === 'Subscription' && c.subscription) {
          const nextRemaining = Math.max(0, (c.subscription.remainingKg || 0) - (newOrder.amount || 0));
          updatedSub = {
            ...c.subscription,
            remainingKg: nextRemaining,
            active: nextRemaining > 0
          };
        }

        return { 
          ...c, 
          balance: nextBalance, 
          points: (c.points || 0) + earnedPoints,
          totalSpent: nextTotalSpent,
          tier: nextTier.name,
          totalOrders: (c.totalOrders || 0) + 1,
          lastOrderDate: today,
          subscription: updatedSub
        };
      }
      return c;
    }));

    const assignedCourier = couriers[Math.floor(Math.random() * couriers.length)] || couriers[0];
    const orderWithCourier = {
      ...newOrder,
      customerId: currentCustomer.id,
      customerName: currentCustomer.name,
      customerPhone: currentCustomer.phone,
      courierId: assignedCourier?.id || 'c1',
      courierName: `${assignedCourier?.name || 'Doni Pratama'} (${assignedCourier?.vehicle || 'Motor'})`
    };

    setActiveOrders(prev => [orderWithCourier, ...prev]);
    setCurrentOrderViewId(newOrder.id);
    setJustCreatedOrderId(newOrder.id);
    setShowOrderSuccess(true);
    triggerToast('Pesanan Baru Dibuat', `Invoice ${newOrder.id} masuk antrean atas nama ${currentCustomer.name}.`, 'success');
  };

  const handleCreateAdminOrder = (posOrder) => {
    const assignedCourier = couriers[0] || { id: 'c1', name: 'Doni Pratama', vehicle: 'Motor' };
    const orderWithCourier = {
      ...posOrder,
      courierId: assignedCourier.id,
      courierName: `${assignedCourier.name} (${assignedCourier.vehicle})`
    };
    setActiveOrders(prev => [orderWithCourier, ...prev]);
    triggerToast('Order Kasir Berhasil', `Order walk-in ${posOrder.id} dicatat ke antrean gerai!`, 'success');
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    const updatedStatusTime = new Intl.DateTimeFormat('id-ID', { 
      dateStyle: 'medium', 
      timeStyle: 'short' 
    }).format(new Date());

    let statusLabel = newStatus;
    if (newStatus === 'washing') statusLabel = 'Sedang Dicuci di Mesin';
    else if (newStatus === 'drying') statusLabel = 'Sedang Dikeringkan';
    else if (newStatus === 'ironing') statusLabel = 'Sedang Disetrika Rapi';
    else if (newStatus === 'ready') statusLabel = 'Siap Diantar Kurir';
    else if (newStatus === 'Selesai' || newStatus === 'Diambil') statusLabel = 'Selesai / Diambil';

    setActiveOrders(prev => {
      const exists = prev.some(o => o.id === orderId);
      if (exists) {
        return prev.map(order => order.id === orderId ? { ...order, status: newStatus, statusTime: updatedStatusTime } : order);
      } else {
        const historyOrder = orderHistory.find(o => o.id === orderId);
        if (historyOrder) {
          return [{ ...historyOrder, status: newStatus, statusTime: updatedStatusTime }, ...prev];
        }
        return prev;
      }
    });

    setOrderHistory(prev => prev.map(order => {
      if (order.id === orderId) {
        return { ...order, status: newStatus, statusTime: updatedStatusTime };
      }
      return order;
    }));

    triggerToast('Status Cucian Diperbarui', `Order ${orderId} sekarang: ${statusLabel}`, 'info');
  };

  const handleDeleteOrder = (orderId) => {
    if (window.confirm(`Batalkan / hapus pesanan ${orderId}?`)) {
      setActiveOrders(prev => prev.filter(o => o.id !== orderId));
      setOrderHistory(prev => prev.filter(o => o.id !== orderId));
      triggerToast('Pesanan Dihapus', `Order ${orderId} telah dihapus dari antrean.`, 'info');
    }
  };

  const handleAssignCourier = (orderId, courierId) => {
    const c = couriers.find(item => item.id === courierId);
    if (!c) return;

    setActiveOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          courierId: c.id,
          courierName: `${c.name} (${c.vehicle})`
        };
      }
      return order;
    }));

    triggerToast('Kurir Ditugaskan', `Kurir ${c.name} ditugaskan untuk order ${orderId}`, 'success');
  };

  const handleRedeemReward = (reward) => {
    if (loyaltyPoints < reward.cost) {
      alert('Poin Anda tidak mencukupi untuk menukar hadiah ini.');
      return;
    }

    setCustomers(prev => prev.map(c => {
      if (c.id === currentCustomer.id) {
        return { ...c, points: c.points - reward.cost };
      }
      return c;
    }));

    if (reward.type === 'coupon') {
      const newPromo = {
        id: `p_reward_${Date.now()}`,
        code: reward.code,
        title: reward.title,
        desc: reward.desc,
        tag: 'Hadiah Poin',
        discountPct: reward.discountPct || 20,
        color: 'from-amber-500 to-orange-600',
        active: true
      };
      setPromos(prev => [newPromo, ...prev]);
      triggerToast('Tukar Poin Berhasil', `Kupon ${reward.code} berhasil ditambahkan ke dompet Promo Anda!`, 'success');
    } else {
      triggerToast('Hadiah Diklaim', `${reward.title} berhasil diklaim dan akan dikirim bersama cucian Anda!`, 'success');
    }
  };

  // =====================
  // SERVICES CRUD
  // =====================
  const handleAddService = (newService) => {
    setServices(prev => [...prev, newService]);
    triggerToast('Layanan Baru Ditambahkan', `${newService.name} telah aktif di katalog.`, 'success');
  };

  const handleEditService = (updatedService) => {
    setServices(prev => prev.map(s => s.id === updatedService.id ? { ...s, ...updatedService } : s));
    triggerToast('Layanan Diperbarui', `Perubahan layanan ${updatedService.name} berhasil disimpan.`, 'success');
  };

  const handleDeleteService = (serviceId) => {
    const s = services.find(item => item.id === serviceId);
    if (window.confirm(`Hapus layanan "${s?.name || serviceId}" dari katalog?`)) {
      setServices(prev => prev.filter(item => item.id !== serviceId));
      triggerToast('Layanan Dihapus', `${s?.name || serviceId} telah dihapus dari katalog.`, 'info');
    }
  };

  const handleUpdateServicePrice = (serviceId, newPrice) => {
    setServices(prev => prev.map(s => s.id === serviceId ? { ...s, price: Number(newPrice) } : s));
    triggerToast('Tarif Diperbarui', 'Perubahan harga berhasil disinkronkan.', 'success');
  };

  // =====================
  // PROMOS CRUD
  // =====================
  const handleAddPromo = (newPromo) => {
    setPromos(prev => [newPromo, ...prev]);
    triggerToast('Kupon Promo Aktif', `Kode kupon ${newPromo.code} siap digunakan pelanggan.`, 'success');
  };

  const handleEditPromo = (updatedPromo) => {
    setPromos(prev => prev.map(p => p.id === updatedPromo.id ? { ...p, ...updatedPromo } : p));
    triggerToast('Kupon Diperbarui', `Kupon ${updatedPromo.code} berhasil diperbarui.`, 'success');
  };

  const handleDeletePromo = (promoId) => {
    const p = promos.find(item => item.id === promoId);
    if (window.confirm(`Hapus kupon promo "${p?.code || promoId}"?`)) {
      setPromos(prev => prev.filter(item => item.id !== promoId));
      triggerToast('Kupon Dihapus', `Kupon ${p?.code || promoId} telah dihapus.`, 'info');
    }
  };

  // =====================
  // COURIERS CRUD
  // =====================
  const handleAddCourier = (newCourier) => {
    setCouriers(prev => [...prev, newCourier]);
    triggerToast('Kurir Ditambahkan', `${newCourier.name} siap ditugaskan antar-jemput.`, 'success');
  };

  const handleEditCourier = (updatedCourier) => {
    setCouriers(prev => prev.map(c => c.id === updatedCourier.id ? { ...c, ...updatedCourier } : c));
    triggerToast('Data Kurir Diperbarui', `Profil kurir ${updatedCourier.name} berhasil diperbarui.`, 'success');
  };

  const handleDeleteCourier = (courierId) => {
    const c = couriers.find(item => item.id === courierId);
    if (window.confirm(`Hapus kurir "${c?.name || courierId}" dari armada gerai?`)) {
      setCouriers(prev => prev.filter(item => item.id !== courierId));
      triggerToast('Kurir Dihapus', `Kurir ${c?.name || courierId} telah dihapus.`, 'info');
    }
  };

  // =====================
  // CUSTOMERS CRM CRUD
  // =====================
  const handleAddCustomer = (newCustomer) => {
    setCustomers(prev => [newCustomer, ...prev]);
    triggerToast('Member Baru Didaftarkan', `${newCustomer.name} resmi menjadi member gerai.`, 'success');
  };

  const handleEditCustomer = (updatedCustomer) => {
    setCustomers(prev => prev.map(c => c.id === updatedCustomer.id ? { ...c, ...updatedCustomer } : c));
    triggerToast('Data Member Diperbarui', `Profil ${updatedCustomer.name} berhasil diperbarui.`, 'success');
  };

  const handleDeleteCustomer = (customerId) => {
    const c = customers.find(item => item.id === customerId);
    if (window.confirm(`Hapus data member "${c?.name || customerId}"?`)) {
      setCustomers(prev => prev.filter(item => item.id !== customerId));
      if (currentCustomerId === customerId) {
        setCurrentCustomerId('CUST-001');
      }
      triggerToast('Member Dihapus', `Data member ${c?.name || customerId} telah dihapus.`, 'info');
    }
  };

  // =====================
  // MACHINES CRUD
  // =====================
  const handleStartMachine = (machineId, orderId, program) => {
    setMachines(prev => prev.map(m => {
      if (m.id === machineId) {
        return {
          ...m,
          status: 'running',
          assignedOrderId: orderId || null,
          programName: program?.name || 'Standard Wash',
          tempC: program?.temp || '40°C',
          timeLeft: program?.duration || 30,
          totalDuration: program?.duration || 30
        };
      }
      return m;
    }));

    if (orderId) {
      const machine = machines.find(m => m.id === machineId);
      const targetStatus = machine?.type === 'dryer' ? 'drying' : 'washing';
      handleUpdateOrderStatus(orderId, targetStatus);
    }

    triggerToast('Mesin Mulai Berputar 🌀', `Program ${program?.name || 'Cuci'} dijalankan pada ${machineId}.`, 'success');
  };

  const handleStopMachine = (machineId, shouldAdvanceOrder = true) => {
    const m = machines.find(item => item.id === machineId);
    if (!m) return;

    if (m.assignedOrderId && shouldAdvanceOrder) {
      const targetStatus = m.type === 'washer' ? 'drying' : 'ironing';
      handleUpdateOrderStatus(m.assignedOrderId, targetStatus);
    }

    setMachines(prev => prev.map(item => {
      if (item.id === machineId) {
        return {
          ...item,
          status: 'idle',
          timeLeft: 0,
          assignedOrderId: null,
          programName: '-',
          totalCycles: (item.totalCycles || 100) + 1
        };
      }
      return item;
    }));

    triggerToast('Mesin Selesai / Dihentikan', `${m.name} kembali dalam kondisi Siaga (Idle).`, 'info');
  };

  const handleAddMachine = (newMachine) => {
    setMachines(prev => [...prev, newMachine]);
    triggerToast('Unit Mesin Ditambahkan', `${newMachine.name} (${newMachine.brand}) berhasil terhubung ke IoT Hub.`, 'success');
  };

  const handleEditMachine = (updatedMachine) => {
    setMachines(prev => prev.map(m => m.id === updatedMachine.id ? { ...m, ...updatedMachine } : m));
    triggerToast('Data Mesin Diperbarui', `Spesifikasi unit ${updatedMachine.name} berhasil disimpan.`, 'success');
  };

  const handleDeleteMachine = (machineId) => {
    const m = machines.find(item => item.id === machineId);
    if (window.confirm(`Hapus unit mesin "${m?.name || machineId}" dari jaringan IoT?`)) {
      setMachines(prev => prev.filter(item => item.id !== machineId));
      triggerToast('Mesin Dihapus', `Unit ${m?.name || machineId} telah dihapus dari fleet.`, 'info');
    }
  };

  // =====================
  // INVENTORY CRUD
  // =====================
  const handleAddInventoryItem = (newItem) => {
    setInventory(prev => [newItem, ...prev]);
    triggerToast('Item Ditambahkan 📦', `${newItem.name} tercatat dalam inventaris gerai.`, 'success');
  };

  const handleEditInventoryItem = (updatedItem) => {
    setInventory(prev => prev.map(item => item.id === updatedItem.id ? { ...item, ...updatedItem } : item));
    triggerToast('Inventaris Diperbarui', `Data ${updatedItem.name} berhasil diperbarui.`, 'success');
  };

  const handleRestockInventoryItem = (itemId, addQty, costPerUnit) => {
    const today = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date());
    setInventory(prev => prev.map(item => {
      if (item.id === itemId) {
        const newStock = Number(item.stock) + Number(addQty);
        return {
          ...item,
          stock: newStock,
          costPerUnit: costPerUnit ? Number(costPerUnit) : item.costPerUnit,
          lastRestock: today
        };
      }
      return item;
    }));
    triggerToast('Restock Berhasil! 📦', `Stok bertambah +${addQty} unit.`, 'success');
  };

  const handleDeleteInventoryItem = (itemId) => {
    const item = inventory.find(i => i.id === itemId);
    if (window.confirm(`Hapus item bahan "${item?.name || itemId}" dari data inventaris?`)) {
      setInventory(prev => prev.filter(i => i.id !== itemId));
      triggerToast('Item Dihapus', `${item?.name || itemId} telah dihapus dari inventaris.`, 'info');
    }
  };

  // =====================
  // STAFF & PAYROLL CRUD
  // =====================
  const handleAddStaff = (newStaff) => {
    setStaffList(prev => [newStaff, ...prev]);
    triggerToast('Karyawan Ditambahkan', `${newStaff.name} berhasil didaftarkan ke sistem payroll.`, 'success');
  };

  const handleEditStaff = (updatedStaff) => {
    setStaffList(prev => prev.map(s => s.id === updatedStaff.id ? { ...s, ...updatedStaff } : s));
    triggerToast('Data Karyawan Diperbarui', `Data ${updatedStaff.name} telah disimpan.`, 'success');
  };

  const handleDeleteStaff = (staffId) => {
    const s = staffList.find(item => item.id === staffId);
    if (window.confirm(`Hapus karyawan "${s?.name || staffId}" dari daftar payroll?`)) {
      setStaffList(prev => prev.filter(item => item.id !== staffId));
      triggerToast('Karyawan Dihapus', `${s?.name || staffId} telah dihapus.`, 'info');
    }
  };

  const handleAddReview = (newReview) => {
    setReviews(prev => [newReview, ...prev]);
    // Reward customer with +50 loyalty points
    setCustomers(prev => prev.map(c => {
      if (c.id === currentCustomer.id) {
        return { ...c, points: (c.points || 0) + 50 };
      }
      return c;
    }));
    triggerToast('Ulasan Terkirim! ⭐', 'Terima kasih atas ulasan Anda. Bonus +50 Poin telah ditambahkan!', 'success');
  };

  const handleResolveReview = (reviewId) => {
    setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, status: 'resolved' } : r));
    triggerToast('Status Keluhan Diperbarui', 'Voucher kompensasi telah dikirim ke pelanggan via WhatsApp.', 'success');
  };

  const handleResetDemoData = () => {
    if (window.confirm('Reset seluruh data demo ke kondisi awal bawaan?')) {
      localStorage.clear();
      setCustomers(defaultCustomers);
      setCurrentCustomerId('CUST-001');
      setServices(defaultServices);
      setPromos(defaultPromos);
      setCouriers(defaultCouriers);
      setActiveOrders(defaultActiveOrders);
      setOrderHistory(defaultOrderHistory);
      setMachines(defaultMachines);
      setInventory(defaultInventory);
      setStaffList(DEFAULT_STAFF);
      setReviews(DEFAULT_REVIEWS);
      setOrderPhotos(DEFAULT_ORDER_PHOTOS);
      triggerToast('Data Direset', 'Semua data telah dikembalikan ke kondisi default demo.', 'info');
    }
  };

  const handleRegisterTenant = async (newTenant, targetView = 'owner_mobile') => {
    setTenants(prev => [newTenant, ...prev]);
    setCurrentTenantId(newTenant.id);
    setAuthenticatedRoles(prev => ({ 
      ...prev, 
      [targetView]: true, 
      owner_mobile: true, 
      web: true 
    }));
    setActiveView(targetView);
    navigateToModule(targetView);

    // Save newly registered tenant to Supabase Cloud
    try {
      const { supabase } = await import('./utils/supabaseClient');
      if (supabase) {
        await supabase.from('tenants').upsert([{
          id: newTenant.id,
          business_name: newTenant.businessName,
          owner_name: newTenant.ownerName,
          owner_phone: newTenant.ownerPhone,
          plan_id: newTenant.planId,
          status: 'trial'
        }]);
      }
    } catch (err) {
      console.warn('Supabase sync warning:', err);
    }

    triggerToast('🎉 Akun Trial Aktif!', `Selamat datang ${newTenant.ownerName}! Gerai ${newTenant.businessName} resmi aktif 14 hari.`, 'success');
  };

  const handleUpdateTenants = (updatedList) => {
    setTenants(updatedList);
    triggerToast('Data Mitra Diperbarui', 'Perubahan akun mitra SaaS berhasil disimpan.', 'success');
  };

  const handleSaveBranding = (updatedBranding) => {
    setTenants(prev => prev.map(t => {
      if (t.id === currentTenant.id) {
        return {
          ...t,
          businessName: updatedBranding.laundryName || t.businessName,
          branding: updatedBranding
        };
      }
      return t;
    }));
    triggerToast('Branding Disimpan! ✨', 'Nama gerai, alamat, dan format struk berhasil diperbarui.', 'success');
  };

  const handleSelectTenantToManage = (tenant) => {
    setCurrentTenantId(tenant.id);
    setActiveView('web');
    triggerToast('Beralih Gerai', `Sedang mengelola kasir & ERP untuk ${tenant.businessName}.`, 'info');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans select-none antialiased">
      {/* 1. Global Floating Toast Notification Banner */}
      {activeToast && (
        <div className="fixed top-5 right-5 z-60 max-w-sm w-full bg-slate-900/95 backdrop-blur-xl text-white p-4 rounded-3xl shadow-2xl border border-white/15 flex items-start gap-3.5 animate-scale-up">
          <div className={`p-2 rounded-2xl ${activeToast.type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-sky-500/20 text-sky-400'}`}>
            {activeToast.type === 'success' ? <Check className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <div className="flex-1 space-y-0.5">
            <h4 className="text-xs font-black text-white">{activeToast.title}</h4>
            <p className="text-[11px] text-slate-300 font-semibold leading-snug">{activeToast.message}</p>
          </div>
          <button onClick={() => setActiveToast(null)} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Top Navigation Bar (SHOWN ONLY TO AUTHENTICATED SUPER ADMIN FOR MASTER CONTROL) */}
      {authenticatedRoles.super_admin && activeView !== 'saas_landing' && (
        <header className="bg-white border-b border-slate-200 px-3 sm:px-6 py-2.5 sm:py-3 flex justify-between items-center shadow-soft z-50 flex-shrink-0 gap-2">
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-sky-400 via-primary to-indigo-600 flex items-center justify-center text-white text-lg sm:text-xl shadow-clay-sm">
              🧼
            </div>
            <div>
              <h1 className="text-xs sm:text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
                <span>LaundryKu Pro</span>
                <span className="hidden sm:inline-block px-2 py-0.5 bg-sky-50 text-primary text-[10px] font-black rounded-full border border-sky-200">Mitra Console</span>
              </h1>
              <p className="hidden md:block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Aplikasi Kasir & ERP Laundry Terintegrasi</p>
            </div>
          </div>

          {/* View Switcher Tabs (Protected Navigation) */}
          <div className="flex bg-slate-100 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-inner flex-shrink-0 gap-0.5 overflow-x-auto no-scrollbar max-w-full">
            <button
              onClick={() => setActiveView('saas_landing')}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-black text-slate-600 hover:text-primary hover:bg-white transition-all"
            >
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span>🌐 Halaman Depan SaaS</span>
            </button>
            <button
              onClick={() => setActiveView('web')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                activeView === 'web'
                  ? 'bg-primary text-white shadow-clay-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>💻 Kasir POS</span>
            </button>
            <button
              onClick={() => setActiveView('owner_mobile')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                activeView === 'owner_mobile'
                  ? 'bg-indigo-600 text-white shadow-clay-sm'
                  : 'text-slate-500 hover:text-indigo-800 hover:bg-indigo-50'
              }`}
            >
              <Crown className="w-3.5 h-3.5" />
              <span>👑 ERP Owner</span>
            </button>
            <button
              onClick={() => setActiveView('courier_app')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                activeView === 'courier_app'
                  ? 'bg-amber-600 text-white shadow-clay-sm'
                  : 'text-slate-500 hover:text-amber-800 hover:bg-amber-50'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>🛵 Kurir Radar</span>
            </button>
            <button
              onClick={() => setActiveView('mobile')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                activeView === 'mobile'
                  ? 'bg-primary text-white shadow-clay-sm'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-white/60'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 Konsumen</span>
            </button>
            <button
              onClick={() => setActiveView('super_admin')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-[11px] font-black transition-all ${
                activeView === 'super_admin'
                  ? 'bg-slate-900 text-white shadow-clay-sm'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              <span>⚙️ Master SaaS</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 flex-shrink-0">
            <button
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-black flex items-center gap-1.5 transition-all shadow-xs ${
                theme === 'dark'
                  ? 'bg-slate-800 text-amber-300 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
              title={theme === 'light' ? 'Beralih ke Mode Gelap' : 'Beralih ke Mode Terang'}
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5 text-slate-600" />}
              <span className="hidden lg:inline">{theme === 'light' ? 'Mode Terang' : 'Mode Gelap'}</span>
            </button>
          </div>
        </header>
      )}

      {/* Main Workspace Frame */}
      <main className="flex-1 overflow-y-auto relative bg-gradient-to-b from-slate-100 to-sky-50/40">
        {/* Full-Page Dedicated Role Login Portals (Super Admin, Owner, Kasir, Kurir, Customer) */}
        {activeView !== 'saas_landing' && !authenticatedRoles[activeView] ? (
          <DedicatedRoleLoginPage
            roleKey={activeView}
            tenants={tenants}
            customers={customers}
            onLoginSuccess={(authRole, tenantId, customerId) => {
              if (tenantId) setCurrentTenantId(tenantId);
              if (customerId) setCurrentCustomerId(customerId);
              setAuthenticatedRoles(prev => ({ ...prev, [authRole]: true }));
              if (authRole === 'super_admin') {
                setActiveView('super_admin');
                navigateToModule('super_admin');
              }
            }}
            onBackToLanding={() => {
              setActiveView('saas_landing');
              navigateToModule('saas_landing');
            }}
            isDark={theme === 'dark'}
          />
        ) : activeView === 'saas_landing' ? (
          <SaaSLandingPage
            onTryDemoPos={() => setActiveView('web')}
            onOpenSuperAdmin={() => setActiveView('super_admin')}
            onOpenOwnerMobile={() => setActiveView('owner_mobile')}
            onOpenCourierApp={() => setActiveView('courier_app')}
            onOpenConsumerApp={() => setActiveView('mobile')}
            onRegisterTenant={handleRegisterTenant}
            theme={theme}
            onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          />
        ) : activeView === 'super_admin' ? (
          <SuperAdminDashboard
            tenants={tenants}
            onUpdateTenants={handleUpdateTenants}
            onSelectTenantToManage={handleSelectTenantToManage}
            onSwitchToLanding={() => setActiveView('saas_landing')}
            onSwitchToMobile={() => setActiveView('mobile')}
            onLogout={() => handleRoleLogout('super_admin')}
            theme={theme}
            onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          />
        ) : activeView === 'courier_app' ? (
          <div className="w-full py-4 sm:py-6 flex justify-center items-start min-h-full">
            <SmartCourierApp
              activeOrders={activeOrders}
              orderHistory={orderHistory}
              couriers={couriers}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              branding={currentTenant?.branding || {}}
              onSwitchRole={setActiveView}
              onLogout={() => handleRoleLogout('courier_app')}
              theme={theme}
              onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            />
          </div>
        ) : activeView === 'owner_mobile' ? (
          <div className="w-full py-4 sm:py-6 flex justify-center items-start min-h-full">
            <SmartOwnerMobile
              activeOrders={activeOrders}
              orderHistory={orderHistory}
              inventory={inventory}
              machines={machines}
              staffList={staffList}
              reviews={reviews}
              branding={currentTenant?.branding || {}}
              onSwitchToFullWeb={() => setActiveView('web')}
              onOpenBrandingSettings={() => setIsBrandingModalOpen(true)}
              onLogout={() => handleRoleLogout('owner_mobile')}
              theme={theme}
              onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            />
          </div>
        ) : activeView === 'mobile' ? (
          <div className="w-full h-full">
            <MobileEmulator
              isLoggedIn={isLoggedIn}
              onLogin={handleLogin}
              onLogout={() => handleRoleLogout('mobile')}
              onRegister={handleRegister}
              currentCustomer={currentCustomer}
              customers={customers}
              onChangeCustomer={setCurrentCustomerId}
              walletBalance={walletBalance}
              loyaltyPoints={loyaltyPoints}
              activeOrders={activeOrders}
              orderHistory={orderHistory}
              currentScreen={currentMobileScreen}
              currentOrderViewId={currentOrderViewId}
              onNavigate={setCurrentMobileScreen}
              onTopUpClick={() => setIsTopUpOpen(true)}
              setSelectedOrderId={setCurrentOrderViewId}
              onAddOrder={handleAddOrder}
              onPurchaseSubscription={handlePurchaseSubscription}
              services={services}
              promos={promos}
              couriers={couriers}
              notifications={notifications}
              onRedeemReward={handleRedeemReward}
              onSubmitReview={handleAddReview}
              branding={currentTenant?.branding || {}}
            />
          </div>
        ) : (
          <WebDashboard
            activeOrders={activeOrders}
            orderHistory={orderHistory}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onDeleteOrder={handleDeleteOrder}
            walletBalance={walletBalance}
            loyaltyPoints={loyaltyPoints}
            services={services}
            promos={promos}
            machines={machines}
            couriers={couriers}
            customers={customers}
            inventory={inventory}
            staffList={staffList}
            reviews={reviews}
            orderPhotos={orderPhotos}
            onResolveReview={handleResolveReview}
            // Staff & Payroll CRUD
            onAddStaff={handleAddStaff}
            onEditStaff={handleEditStaff}
            onDeleteStaff={handleDeleteStaff}
            // Services CRUD
            onAddService={handleAddService}
            onEditService={handleEditService}
            onDeleteService={handleDeleteService}
            onUpdateServicePrice={handleUpdateServicePrice}
            // Promos CRUD
            onAddPromo={handleAddPromo}
            onEditPromo={handleEditPromo}
            onDeletePromo={handleDeletePromo}
            // Couriers CRUD
            onAddCourier={handleAddCourier}
            onEditCourier={handleEditCourier}
            onDeleteCourier={handleDeleteCourier}
            onAssignCourier={handleAssignCourier}
            // Customers CRM CRUD
            onAddCustomer={handleAddCustomer}
            onEditCustomer={handleEditCustomer}
            onDeleteCustomer={handleDeleteCustomer}
            // Inventory CRUD
            onAddInventoryItem={handleAddInventoryItem}
            onEditInventoryItem={handleEditInventoryItem}
            onRestockInventoryItem={handleRestockInventoryItem}
            onDeleteInventoryItem={handleDeleteInventoryItem}
            // Machines CRUD
            onCreateAdminOrder={handleCreateAdminOrder}
            onStartMachine={handleStartMachine}
            onStopMachine={handleStopMachine}
            onAddMachine={handleAddMachine}
            onEditMachine={handleEditMachine}
            onDeleteMachine={handleDeleteMachine}
            onResetDemoData={handleResetDemoData}
            onSwitchToMobile={() => setActiveView('mobile')}
            onLogout={() => handleRoleLogout('web')}
            branding={currentTenant?.branding || {}}
            onOpenBrandingSettings={() => setIsBrandingModalOpen(true)}
            onOpenSuperAdmin={() => setActiveView('super_admin')}
            currentTenant={currentTenant}
          />
        )}
      </main>

      {/* Tenant Branding & White-Label Modal */}
      <TenantSettingsModal
        isOpen={isBrandingModalOpen}
        onClose={() => setIsBrandingModalOpen(false)}
        branding={currentTenant?.branding || {}}
        onSaveBranding={handleSaveBranding}
      />

      {/* Global Wallet Top Up Modal */}
      <TopUpModal
        isOpen={isTopUpOpen}
        onClose={() => setIsTopUpOpen(false)}
        onTopUp={handleTopUp}
      />

      {/* Order Created Success Dialog */}
      {showOrderSuccess && (
        <div className="fixed inset-0 z-55 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white clay-card w-full max-w-sm p-6 text-center rounded-3xl shadow-soft-lg animate-scale-up space-y-4">
            <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-800">Pesanan Berhasil Dibuat!</h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Nomor Invoice Anda adalah <strong className="text-slate-800">{justCreatedOrderId}</strong> atas nama <strong className="text-slate-800">{currentCustomer.name}</strong>.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={() => {
                  setShowOrderSuccess(false);
                  setCurrentMobileScreen('order_detail');
                }}
                className="w-full py-3.5 text-white font-extrabold text-xs rounded-2xl shadow-clay-sm clay-button text-center block"
              >
                Lacak Status Pesanan
              </button>
              <button
                onClick={() => setShowOrderSuccess(false)}
                className="w-full mt-2 py-2 text-slate-500 hover:text-slate-700 font-bold text-xs hover:bg-slate-50 rounded-xl transition-all"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

