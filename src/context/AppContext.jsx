import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  INITIAL_TENANTS, INITIAL_SERVICES, INITIAL_CUSTOMERS, 
  INITIAL_COURIERS, INITIAL_MACHINES, INITIAL_INVENTORY, 
  INITIAL_STAFF, INITIAL_ORDERS, PROMO_VOUCHERS 
} from '../utils/dummyData';

const AppContext = createContext();

export function AppProvider({ children }) {
  // Helper for safe localStorage access
  const getStorage = (key, fallback) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : fallback;
    } catch {
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

  // 1. Multi-Tenant Core State
  const [tenants, setTenants] = useState(() => getStorage('laundry_tenants_v2', INITIAL_TENANTS));
  const [activeTenantId, setActiveTenantId] = useState(() => getStorage('laundry_active_tenant_id_v2', 'TNT-001'));
  const activeTenant = tenants.find(t => t.id === activeTenantId) || tenants[0] || INITIAL_TENANTS[0];

  // 2. Authentication Sessions State (Persisted per Role)
  const [authSessions, setAuthSessions] = useState(() => getStorage('laundry_auth_sessions_v2', {
    owner: false,
    pos: false,
    courier: false,
    customer: false,
    admin: false
  }));

  // 3. Operational Entities
  const [orders, setOrders] = useState(() => getStorage('laundry_orders_v2', INITIAL_ORDERS));
  const [services, setServices] = useState(() => getStorage('laundry_services_v2', INITIAL_SERVICES));
  const [customers, setCustomers] = useState(() => getStorage('laundry_customers_v2', INITIAL_CUSTOMERS));
  const [couriers, setCouriers] = useState(() => getStorage('laundry_couriers_v2', INITIAL_COURIERS));
  const [machines, setMachines] = useState(() => getStorage('laundry_machines_v2', INITIAL_MACHINES));
  const [inventory, setInventory] = useState(() => getStorage('laundry_inventory_v2', INITIAL_INVENTORY));
  const [staff, setStaff] = useState(() => getStorage('laundry_staff_v2', INITIAL_STAFF));
  const [vouchers] = useState(PROMO_VOUCHERS);

  // Active Customer Context (Default to Aisyah)
  const [activeCustomerId, setActiveCustomerId] = useState(() => getStorage('laundry_active_customer_id_v2', 'CUST-001'));
  const activeCustomer = customers.find(c => c.id === activeCustomerId) || customers[0] || INITIAL_CUSTOMERS[0];

  // System Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (title, message, type = 'info') => {
    setToast({ title, message, type, id: Date.now() });
    setTimeout(() => setToast(null), 3500);
  };

  // Sync to LocalStorage
  useEffect(() => setStorage('laundry_tenants_v2', tenants), [tenants]);
  useEffect(() => setStorage('laundry_active_tenant_id_v2', activeTenantId), [activeTenantId]);
  useEffect(() => setStorage('laundry_auth_sessions_v2', authSessions), [authSessions]);
  useEffect(() => setStorage('laundry_orders_v2', orders), [orders]);
  useEffect(() => setStorage('laundry_services_v2', services), [services]);
  useEffect(() => setStorage('laundry_customers_v2', customers), [customers]);
  useEffect(() => setStorage('laundry_couriers_v2', couriers), [couriers]);
  useEffect(() => setStorage('laundry_machines_v2', machines), [machines]);
  useEffect(() => setStorage('laundry_inventory_v2', inventory), [inventory]);
  useEffect(() => setStorage('laundry_staff_v2', staff), [staff]);
  useEffect(() => setStorage('laundry_active_customer_id_v2', activeCustomerId), [activeCustomerId]);

  // ================= ACTION HANDLERS ================= //

  // Login handler
  const handleLogin = (role, identifier, pin) => {
    // Basic verification against registered data
    let isValid = false;
    let userName = '';

    if (role === 'owner') {
      const tenant = tenants.find(t => t.ownerPhone.includes(identifier) || t.ownerEmail.toLowerCase() === identifier.toLowerCase());
      if (tenant && pin === '1234') {
        isValid = true;
        userName = tenant.ownerName;
        setActiveTenantId(tenant.id);
      }
    } else if (role === 'pos') {
      if ((identifier.includes('089650846031') || identifier.toLowerCase().includes('kasir')) && pin === '1234') {
        isValid = true;
        userName = 'Kasir Frontdesk';
      }
    } else if (role === 'courier') {
      const cr = couriers.find(c => c.phone.includes(identifier) || c.name.toLowerCase().includes(identifier.toLowerCase()));
      if (cr && pin === '1234') {
        isValid = true;
        userName = cr.name;
      }
    } else if (role === 'customer') {
      const cust = customers.find(c => c.phone.includes(identifier) || c.name.toLowerCase().includes(identifier.toLowerCase()) || c.email.toLowerCase() === identifier.toLowerCase());
      if (cust && pin === '1234') {
        isValid = true;
        userName = cust.name;
        setActiveCustomerId(cust.id);
      }
    } else if (role === 'admin') {
      if ((identifier.includes('admin') || identifier.includes('089650846031')) && pin === '1234') {
        isValid = true;
        userName = 'Super Administrator';
      }
    }

    if (isValid) {
      setAuthSessions(prev => ({ ...prev, [role]: true }));
      showToast('Login Berhasil', `Selamat datang kembali, ${userName}!`, 'success');
      return { success: true, userName };
    } else {
      showToast('Gagal Masuk', 'Nomor HP/Email atau PIN yang Anda masukkan salah.', 'error');
      return { success: false, error: 'Kredensial tidak valid' };
    }
  };

  // Logout handler
  const handleLogout = (role) => {
    setAuthSessions(prev => ({ ...prev, [role]: false }));
    showToast('Sesi Berakhir', 'Anda telah berhasil keluar dari akun.', 'info');
  };

  // Register 14-day trial tenant
  const registerTrialTenant = (tenantData) => {
    const newId = `TNT-${String(tenants.length + 1).padStart(3, '0')}`;
    const newTenant = {
      id: newId,
      businessName: tenantData.businessName,
      ownerName: tenantData.ownerName,
      ownerPhone: tenantData.ownerPhone,
      ownerEmail: `${tenantData.ownerName.toLowerCase().replace(/\s+/g, '')}@laundryku.id`,
      planId: 'trial',
      planName: '14 Hari Free Trial Pro',
      status: 'active',
      joinedDate: new Date().toISOString().split('T')[0],
      expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      city: tenantData.city || 'Jakarta',
      address: `Jl. ${tenantData.businessName}, ${tenantData.city || 'Jakarta'}`,
      branding: {
        laundryName: tenantData.businessName,
        tagline: 'Layanan Laundry Bersih, Cepat & Terpercaya',
        primaryColor: '#0284C7',
        logo: '🧼'
      }
    };

    setTenants(prev => [newTenant, ...prev]);
    setActiveTenantId(newId);
    showToast('Aktivasi Berhasil', `Toko ${tenantData.businessName} siap digunakan!`, 'success');
    return newTenant;
  };

  // Create new Pickup Order (Customer Flow: Unweighed 0 Kg)
  const createPickupOrder = (orderData) => {
    const today = new Date();
    const invoiceId = `INV-${today.getFullYear().toString().slice(-2)}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;
    const timeStr = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(today);

    const newOrder = {
      id: invoiceId,
      customerName: activeCustomer.name,
      customerPhone: activeCustomer.phone,
      serviceName: orderData.serviceName || 'Cuci & Setrika Reguler',
      serviceId: orderData.serviceId || 'svc_1',
      amount: 0, // Unweighed: Kasir will weigh at POS
      unit: orderData.unit || 'Kg',
      pricePerUnit: orderData.pricePerUnit || 9000,
      totalPrice: 0,
      paymentStatus: 'Unpaid',
      paymentMethod: null,
      status: 'pending_pickup',
      orderTime: timeStr,
      eta: 'Menunggu timbangan kasir',
      courierName: couriers[0]?.name || 'Doni Pratama',
      pickupAddress: orderData.address || activeCustomer.address,
      bagCount: orderData.bagCount || 1,
      notes: orderData.notes || 'Tidak ada',
      history: [
        { time: 'Baru Saja', title: 'Pesanan Dibuat', desc: 'Permintaan jemput laundry via aplikasi konsumen' }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    showToast('Permintaan Terkirim', `Pesanan ${invoiceId} berhasil dibuat. Kurir akan segera menjemput!`, 'success');
    return newOrder;
  };

  // Kasir POS: Weighed and Issue WhatsApp Receipt
  const weighAndIssueInvoice = (orderId, weightAmount, customNotes = '') => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        const total = Math.round(weightAmount * order.pricePerUnit);
        const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        return {
          ...order,
          amount: parseFloat(weightAmount),
          totalPrice: total,
          status: 'received',
          notes: customNotes || order.notes,
          eta: '2 Hari Kerja',
          history: [
            ...order.history,
            { time: timeNow, title: 'Ditimbang Kasir', desc: `Berat riil: ${weightAmount} ${order.unit}. Total: Rp ${total.toLocaleString('id-ID')}` }
          ]
        };
      }
      return order;
    }));
    showToast('Timbangan Berhasil', `Nota digital ${orderId} diterbitkan & dikirim ke WhatsApp konsumen.`, 'success');
  };

  // Update order status across production pipeline
  const updateOrderStatus = (orderId, nextStatus) => {
    const statusTitles = {
      pending_pickup: 'Menunggu Penjemputan',
      received: 'Diterima di Outlet',
      washing: 'Sedang Dicuci',
      drying: 'Proses Pengeringan',
      ironing: 'Setrika Uap & Packing',
      ready: 'Siap Diantar Kurir',
      completed: 'Selesai & Diterima'
    };

    const timeNow = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

    setOrders(prev => prev.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          status: nextStatus,
          history: [
            ...order.history,
            { time: timeNow, title: statusTitles[nextStatus] || nextStatus, desc: `Status diperbarui menjadi ${statusTitles[nextStatus] || nextStatus}` }
          ]
        };
      }
      return order;
    }));
    showToast('Status Diperbarui', `Pesanan ${orderId} bergerak ke: ${statusTitles[nextStatus]}`, 'info');
  };

  // Pay order (Wallet or COD)
  const payOrder = (orderId, method = 'Wallet') => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    if (method === 'Wallet') {
      if (activeCustomer.walletBalance < order.totalPrice) {
        showToast('Saldo Tidak Cukup', 'Silakan top-up saldo laundry wallet terlebih dahulu.', 'error');
        return false;
      }
      // Deduct balance & add reward points
      setCustomers(prev => prev.map(c => {
        if (c.id === activeCustomer.id) {
          return {
            ...c,
            walletBalance: c.walletBalance - order.totalPrice,
            loyaltyPoints: c.loyaltyPoints + Math.round(order.totalPrice / 1000) * 10
          };
        }
        return c;
      }));
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          paymentStatus: 'Paid',
          paymentMethod: method
        };
      }
      return o;
    }));

    showToast('Pembayaran Berhasil', `Pesanan ${orderId} telah lunas via ${method === 'Wallet' ? 'Laundry Wallet' : 'Tunai/COD'}.`, 'success');
    return true;
  };

  // Top up customer wallet
  const topUpWallet = (amount) => {
    const num = parseInt(amount, 10);
    if (isNaN(num) || num <= 0) return;

    setCustomers(prev => prev.map(c => {
      if (c.id === activeCustomer.id) {
        return { ...c, walletBalance: c.walletBalance + num };
      }
      return c;
    }));
    showToast('Top Up Berhasil', `Saldo Rp ${num.toLocaleString('id-ID')} berhasil ditambahkan ke wallet.`, 'success');
  };

  // Control IoT Machine
  const toggleMachine = (machineId, targetStatus) => {
    setMachines(prev => prev.map(m => {
      if (m.id === machineId) {
        return {
          ...m,
          status: targetStatus,
          timeLeft: targetStatus === 'running' ? 35 : 0
        };
      }
      return m;
    }));
    showToast('IoT Mesin Diperbarui', `Mesin ${machineId} sekarang dalam status: ${targetStatus}.`, 'info');
  };

  // Restock inventory
  const restockInventory = (itemId, addStock) => {
    const num = parseInt(addStock, 10);
    if (isNaN(num) || num <= 0) return;

    setInventory(prev => prev.map(i => {
      if (i.id === itemId) {
        return { ...i, stock: i.stock + num };
      }
      return i;
    }));
    showToast('Stok Ditambahkan', `Berhasil menambah +${num} item stok.`, 'success');
  };

  return (
    <AppContext.Provider value={{
      // Core state
      tenants, activeTenant, setActiveTenantId,
      authSessions, handleLogin, handleLogout,
      orders, services, customers, couriers, machines, inventory, staff, vouchers,
      activeCustomer, setActiveCustomerId,
      toast, showToast,
      // Operations
      registerTrialTenant,
      createPickupOrder,
      weighAndIssueInvoice,
      updateOrderStatus,
      payOrder,
      topUpWallet,
      toggleMachine,
      restockInventory
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
