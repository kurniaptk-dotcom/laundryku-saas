import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Users, ShoppingBag, DollarSign, 
  Settings, BarChart3, HelpCircle, LogOut, CheckCircle2,
  Clock, Play, ChevronRight, HelpCircle as HelpIcon, ArrowUpRight,
  Search, Filter, Plus, Printer, QrCode, Sparkles, Tag, 
  Power, RefreshCw, Smartphone, Check, X, Phone, FileText,
  Activity, ArrowDownRight, Layers, Bell, Shield, Zap, 
  SlidersHorizontal, CheckCircle, Package, Flame, Droplets, Wind,
  Download, Truck, UserCheck, RotateCcw, LayoutGrid, List,
  GripVertical, MoveRight, ArrowRight, ArrowLeft, Thermometer,
  Gauge, AlertCircle, Wrench, CheckCircle as CheckIcon, Edit3,
  Trash2, Info, Cpu, Wifi, HardDrive, UserPlus, CreditCard, Award,
  Menu, MessageCircle, Share2, Camera, Star, Eye, MessageSquare,
  AlertTriangle, ThumbsUp, Building2
} from 'lucide-react';
import { getWhatsAppShareUrl, getWhatsAppChatUrl, getWhatsAppWinBackUrl, getWhatsAppVIPGreetingUrl, getWhatsAppWelcomeUrl } from '../utils/whatsappHelper';
import { exportOrdersToCSV, exportInventoryToCSV } from '../utils/exportHelper';
import { calculateTier, getTierProgression } from '../utils/tierHelper';
import { calculatePayroll, exportPayrollToCSV } from '../utils/payrollHelper';
import { getWhatsAppCompensationUrl } from '../utils/feedbackHelper';
import ServiceIcon from './ServiceIcon';
import ThermalReceiptModal from './ThermalReceiptModal';
import GarmentPhotoModal from './GarmentPhotoModal';

export default function WebDashboard({
  activeOrders = [],
  orderHistory = [],
  onUpdateOrderStatus,
  onDeleteOrder,
  walletBalance = 125000,
  loyaltyPoints = 1250,
  services = [],
  promos = [],
  machines = [],
  couriers = [],
  customers = [],
  inventory = [],
  staffList = [],
  reviews = [],
  orderPhotos = {},
  onResolveReview,
  // Staff & Payroll CRUD
  onAddStaff,
  onEditStaff,
  onDeleteStaff,
  // Services CRUD
  onAddService,
  onEditService,
  onDeleteService,
  onUpdateServicePrice,
  // Promos CRUD
  onAddPromo,
  onEditPromo,
  onDeletePromo,
  // Couriers CRUD
  onAddCourier,
  onEditCourier,
  onDeleteCourier,
  onAssignCourier,
  // Customers CRM CRUD
  onAddCustomer,
  onEditCustomer,
  onDeleteCustomer,
  // Inventory CRUD
  onAddInventoryItem,
  onEditInventoryItem,
  onRestockInventoryItem,
  onDeleteInventoryItem,
  // Machines CRUD
  onCreateAdminOrder,
  onStartMachine,
  onStopMachine,
  onAddMachine,
  onEditMachine,
  onDeleteMachine,
  onResetDemoData,
  onSwitchToMobile,
  branding = {},
  onOpenBrandingSettings,
  onOpenSuperAdmin,
  currentTenant = {}
}) {
  const [selectedDashboardTab, setSelectedDashboardTab] = useState('orders');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [ordersViewMode, setOrdersViewMode] = useState('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dragOverCol, setDragOverCol] = useState(null);
  const [draggingOrderId, setDraggingOrderId] = useState(null);

  // Real-time Clock
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Print Receipt Modal State
  const [selectedReceiptOrder, setSelectedReceiptOrder] = useState(null);

  // Machine Start Modal State
  const [selectedMachineToStart, setSelectedMachineToStart] = useState(null);
  const [startMachineOrderId, setStartMachineOrderId] = useState('');
  const [startMachineProgram, setStartMachineProgram] = useState({
    name: 'Normal Heavy Clean',
    duration: 35,
    temp: '40°C'
  });

  // Machine CRUD Modals
  const [showAddMachineModal, setShowAddMachineModal] = useState(false);
  const [selectedMachineToDetail, setSelectedMachineToDetail] = useState(null);
  const [selectedMachineToEdit, setSelectedMachineToEdit] = useState(null);

  // 1. Machine Forms
  const [newMachineForm, setNewMachineForm] = useState({
    name: '',
    brand: 'LG Commercial Pro',
    modelNo: 'FH069FD3F Titan-C',
    serialNumber: '',
    type: 'washer',
    capacity: '10 Kg',
    powerType: 'Inverter Direct Drive (220V)',
    spinSpeed: '1200 RPM',
    ipAddress: '192.168.1.105'
  });

  const [editMachineForm, setEditMachineForm] = useState({
    id: '',
    name: '',
    brand: '',
    modelNo: '',
    serialNumber: '',
    type: 'washer',
    capacity: '10 Kg',
    powerType: '',
    spinSpeed: '',
    ipAddress: '',
    healthScore: 98,
    status: 'idle'
  });

  // 2. Services CRUD Modals
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [selectedServiceToEdit, setSelectedServiceToEdit] = useState(null);
  const [newServiceForm, setNewServiceForm] = useState({
    name: '',
    price: '',
    unit: 'Kg',
    icon: '🧺',
    desc: 'Layanan pencucian profesional higienis'
  });
  const [editServiceForm, setEditServiceForm] = useState({
    id: '',
    name: '',
    price: 0,
    unit: 'Kg',
    icon: '🧺',
    desc: ''
  });

  // 3. Promos CRUD Modals
  const [showAddPromoModal, setShowAddPromoModal] = useState(false);
  const [selectedPromoToEdit, setSelectedPromoToEdit] = useState(null);
  const [newPromoForm, setNewPromoForm] = useState({
    code: '',
    title: '',
    desc: 'Diskon spesial pelanggan.',
    tag: 'Spesial',
    discountPct: '20'
  });
  const [editPromoForm, setEditPromoForm] = useState({
    id: '',
    code: '',
    title: '',
    desc: '',
    tag: '',
    discountPct: 20
  });

  // 4. Couriers CRUD Modals
  const [showAddCourierModal, setShowAddCourierModal] = useState(false);
  const [selectedCourierToEdit, setSelectedCourierToEdit] = useState(null);
  const [newCourierForm, setNewCourierForm] = useState({
    name: '',
    phone: '',
    vehicle: 'Honda Vario (B 1234 XYZ)',
    avatar: 'DR'
  });
  const [editCourierForm, setEditCourierForm] = useState({
    id: '',
    name: '',
    phone: '',
    vehicle: '',
    avatar: '',
    status: 'Siaga'
  });

  // 5. Customers CRM CRUD Modals & Segmentation
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const [selectedCustomerToEdit, setSelectedCustomerToEdit] = useState(null);
  const [crmSegmentFilter, setCrmSegmentFilter] = useState('all'); // all, vip, loyal, at_risk, new
  const [crmSearchTerm, setCrmSearchTerm] = useState('');

  const [newCustomerForm, setNewCustomerForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: 'Jakarta',
    tier: 'Member Bronze',
    balance: 0,
    points: 100,
    totalSpent: 0,
    preferences: 'Parfum Segar Standar'
  });
  const [editCustomerForm, setEditCustomerForm] = useState({
    id: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    tier: 'Member Bronze',
    balance: 0,
    points: 0,
    totalSpent: 0,
    preferences: ''
  });

  // 6. Inventory CRUD & Restock State
  const [showAddInventoryModal, setShowAddInventoryModal] = useState(false);
  const [selectedInventoryToEdit, setSelectedInventoryToEdit] = useState(null);
  const [selectedInventoryToRestock, setSelectedInventoryToRestock] = useState(null);
  const [inventoryCategoryFilter, setInventoryCategoryFilter] = useState('all');
  const [inventorySearchTerm, setInventorySearchTerm] = useState('');

  const [newInventoryForm, setNewInventoryForm] = useState({
    name: '',
    category: 'Chemical',
    stock: 20,
    unit: 'Liter',
    minStock: 10,
    costPerUnit: 15000,
    supplier: 'CV Kimia Bersih Abadi',
    icon: '🧼'
  });

  const [editInventoryForm, setEditInventoryForm] = useState({
    id: '',
    name: '',
    category: 'Chemical',
    stock: 0,
    unit: 'Liter',
    minStock: 10,
    costPerUnit: 0,
    supplier: '',
    icon: '🧼'
  });

  const [restockQty, setRestockQty] = useState(10);
  const [restockCost, setRestockCost] = useState('');

  // 7. Thermal & Garment Tag Modal State
  const [selectedThermalOrder, setSelectedThermalOrder] = useState(null);

  // 8. Garment Photo Audit Modal State
  const [selectedPhotoOrder, setSelectedPhotoOrder] = useState(null);

  // 9. Customer Feedback & CS Resolution State
  const [feedbackFilter, setFeedbackFilter] = useState('all'); // 'all' | 'pending' | '5star'
  const [feedbackSearchTerm, setFeedbackSearchTerm] = useState('');

  // 10. Staff & Payroll State
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [selectedStaffToEdit, setSelectedStaffToEdit] = useState(null);
  const [selectedStaffPayslip, setSelectedStaffPayslip] = useState(null);
  const [staffRoleFilter, setStaffRoleFilter] = useState('all');
  const [staffSearchTerm, setStaffSearchTerm] = useState('');

  const [newStaffForm, setNewStaffForm] = useState({
    name: '',
    role: 'Operator Cuci (Washer)',
    roleType: 'washer',
    phone: '',
    baseSalary: 1800000,
    mealAllowancePerDay: 25000,
    daysWorked: 25,
    commissionRate: 1000
  });

  const [editStaffForm, setEditStaffForm] = useState({
    id: '',
    name: '',
    role: '',
    roleType: 'washer',
    phone: '',
    baseSalary: 0,
    mealAllowancePerDay: 0,
    daysWorked: 0,
    commissionRate: 0,
    status: 'Aktif'
  });

  // Calculations for Inventory
  const lowStockCount = inventory.filter(i => (i.stock || 0) <= (i.minStock || 10)).length;
  const totalInventoryValuation = inventory.reduce((acc, i) => acc + ((i.stock || 0) * (i.costPerUnit || 0)), 0);
  const uniqueSuppliersCount = new Set(inventory.map(i => i.supplier).filter(Boolean)).size;

  const filteredInventory = inventory.filter(item => {
    const matchCategory = inventoryCategoryFilter === 'all' || item.category === inventoryCategoryFilter;
    const matchSearch = (item.name?.toLowerCase().includes(inventorySearchTerm.toLowerCase()) || 
                         item.supplier?.toLowerCase().includes(inventorySearchTerm.toLowerCase()));
    return matchCategory && matchSearch;
  });

  // Calculations for Payroll
  const allOrdersList = [...activeOrders, ...orderHistory];
  const payrollRecords = calculatePayroll(staffList, allOrdersList);
  const totalPayrollCost = payrollRecords.reduce((sum, p) => sum + (p.netSalary || 0), 0);
  const totalCommissionsPaid = payrollRecords.reduce((sum, p) => sum + (p.commissionTotal || 0), 0);
  const totalWashedAndIronedKg = allOrdersList.reduce((sum, o) => sum + (parseFloat(o.amount) || 0), 0);
  const topPerformer = [...payrollRecords].sort((a, b) => (b.unitsProcessed || 0) - (a.unitsProcessed || 0))[0];

  const filteredPayrollRecords = payrollRecords.filter(staff => {
    const matchRole = staffRoleFilter === 'all' || staff.roleType === staffRoleFilter;
    const matchSearch = staff.name?.toLowerCase().includes(staffSearchTerm.toLowerCase()) || 
                        staff.role?.toLowerCase().includes(staffSearchTerm.toLowerCase());
    return matchRole && matchSearch;
  });

  // POS Cashier Form State
  const [posCustomerName, setPosCustomerName] = useState('Aisyah Salsabila');
  const [posCustomerPhone, setPosCustomerPhone] = useState('0812-3456-7890');
  const [posSelectedService, setPosSelectedService] = useState(services[0]?.id || 'cuci_setrika');
  const [posQuantity, setPosQuantity] = useState(4);
  const [posFragrance, setPosFragrance] = useState('🌸 Lavender Bloom');
  const [posPaymentMethod, setPosPaymentMethod] = useState('Tunai Kasir');
  const [posNotes, setPosNotes] = useState('');
  const [posDiscountCode, setPosDiscountCode] = useState('');
  const [posAppliedDiscount, setPosAppliedDiscount] = useState(0);
  const [posSuccessMsg, setPosSuccessMsg] = useState('');

  // Metrics
  const activeOrdersCount = activeOrders.length;
  const calculatedEarnings = orderHistory.reduce((acc, order) => {
    const val = parseInt(String(order.price || order.totalPrice || '').replace(/[^\d]/g, ''));
    return acc + (isNaN(val) ? 0 : val);
  }, 0) + activeOrders.reduce((acc, order) => {
    return acc + (order.totalPrice || 60000);
  }, 0);

  const kanbanColumns = [
    { key: 'received', label: 'Diterima / Masuk', icon: '📥', color: 'from-slate-600 to-slate-800', border: 'border-slate-300', bg: 'bg-slate-50', badge: 'bg-slate-200 text-slate-700' },
    { key: 'washing', label: 'Sedang Dicuci', icon: '🧼', color: 'from-sky-500 to-blue-600', border: 'border-sky-300', bg: 'bg-sky-50/50', badge: 'bg-sky-100 text-sky-750' },
    { key: 'drying', label: 'Pengeringan', icon: '💨', color: 'from-amber-500 to-orange-600', border: 'border-amber-300', bg: 'bg-amber-50/50', badge: 'bg-amber-100 text-amber-800' },
    { key: 'ironing', label: 'Setrika & Packing', icon: '🔌', color: 'from-indigo-500 to-purple-600', border: 'border-indigo-300', bg: 'bg-indigo-50/50', badge: 'bg-indigo-100 text-indigo-750' },
    { key: 'ready', label: 'Siap Diantar Kurir', icon: '🚚', color: 'from-emerald-500 to-teal-600', border: 'border-emerald-300', bg: 'bg-emerald-50/50', badge: 'bg-emerald-100 text-emerald-800' },
    { key: 'Selesai', label: 'Selesai / Diambil', icon: '✅', color: 'from-emerald-600 to-emerald-800', border: 'border-slate-300', bg: 'bg-slate-50/70', badge: 'bg-emerald-100 text-emerald-800' }
  ];

  const statuses = [
    { value: 'received', label: 'Diterima' },
    { value: 'washing', label: 'Cuci' },
    { value: 'drying', label: 'Pengeringan' },
    { value: 'ironing', label: 'Setrika' },
    { value: 'ready', label: 'Siap Diantar' },
    { value: 'Selesai', label: 'Selesai' }
  ];

  const allOrdersMap = new Map();
  [...orderHistory, ...activeOrders].forEach(o => {
    allOrdersMap.set(o.id, {
      ...o,
      totalPrice: typeof o.totalPrice === 'number' ? o.totalPrice : parseInt(String(o.price || o.totalPrice || '50000').replace(/[^\d]/g, '')) || 50000
    });
  });
  const allOrders = Array.from(allOrdersMap.values());

  const filteredOrders = allOrders.filter(order => {
    const matchSearch = (order.id?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         order.serviceName?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchStatus = statusFilter === 'all' ? true : 
                        statusFilter === 'active' ? (order.status !== 'Selesai' && order.status !== 'Diambil') :
                        statusFilter === 'completed' ? (order.status === 'Selesai' || order.status === 'Diambil') :
                        order.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const currentPosService = services.find(s => s.id === posSelectedService) || services[0] || { price: 12000, name: 'Cuci & Setrika', unit: 'Kg' };
  const posSubtotal = (currentPosService?.price || 12000) * posQuantity;
  const posDiscountAmount = (posSubtotal * posAppliedDiscount) / 100;
  const posFinalTotal = Math.max(0, posSubtotal - posDiscountAmount);

  const handleApplyDiscount = () => {
    const found = promos.find(p => p.code.toLowerCase() === posDiscountCode.trim().toLowerCase());
    if (found) {
      setPosAppliedDiscount(found.discountPct || 20);
    } else {
      alert('Kode promo tidak valid');
    }
  };

  const handleDragStart = (e, orderId) => {
    e.dataTransfer.setData('text/plain', orderId);
    setDraggingOrderId(orderId);
  };

  const handleDragEnd = () => {
    setDraggingOrderId(null);
    setDragOverCol(null);
  };

  const handleDragOver = (e, colKey) => {
    e.preventDefault();
    if (dragOverCol !== colKey) {
      setDragOverCol(colKey);
    }
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const orderId = e.dataTransfer.getData('text/plain') || draggingOrderId;
    if (orderId) {
      onUpdateOrderStatus(orderId, targetStatus);
    }
    setDragOverCol(null);
    setDraggingOrderId(null);
  };

  const handleMoveStep = (orderId, currentStatus, direction) => {
    const statusOrder = ['received', 'washing', 'drying', 'ironing', 'ready', 'Selesai'];
    const curIdx = statusOrder.indexOf(currentStatus === 'Diambil' ? 'Selesai' : currentStatus);
    if (curIdx === -1) return;

    const nextIdx = direction === 'next' ? Math.min(statusOrder.length - 1, curIdx + 1) : Math.max(0, curIdx - 1);
    onUpdateOrderStatus(orderId, statusOrder[nextIdx]);
  };

  const handleExportCSV = () => {
    const ordersToExport = filteredOrders.length > 0 ? filteredOrders : allOrders;
    exportOrdersToCSV(ordersToExport, 'Laporan_Transaksi_LaundryKu');
  };

  const handlePosSubmit = (e) => {
    e.preventDefault();
    if (!posCustomerName) return;

    const today = new Date();
    const invoiceId = `POS-${today.getFullYear().toString().slice(-2)}${(today.getMonth() + 1).toString().padStart(2, '0')}${today.getDate().toString().padStart(2, '0')}-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder = {
      id: invoiceId,
      customerName: posCustomerName,
      customerPhone: posCustomerPhone || '0812-0000-0000',
      serviceName: currentPosService.name,
      type: currentPosService.unit?.toLowerCase() || 'kg',
      amount: posQuantity,
      unit: currentPosService.unit || 'Kg',
      status: 'received',
      paymentMethod: posPaymentMethod,
      orderTime: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(today),
      statusTime: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short' }).format(today),
      eta: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date(today.getTime() + 24 * 60 * 60 * 1000)) + ', 17:00',
      notes: `${posFragrance ? `Parfum: ${posFragrance}. ` : ''}${posNotes || 'Order Kasir Walk-In'}`,
      totalPrice: posFinalTotal
    };

    onCreateAdminOrder(newOrder);
    setPosSuccessMsg(`Pesanan ${invoiceId} berhasil diproses & dicatat!`);
    setSelectedReceiptOrder(newOrder);
    setPosNotes('');
    setPosDiscountCode('');
    setPosAppliedDiscount(0);
    setTimeout(() => setPosSuccessMsg(''), 4000);
  };

  const washerPrograms = [
    { name: 'Quick Express Wash', duration: 20, temp: '30°C', desc: 'Cuci kilat 20 menit untuk pakaian ringan' },
    { name: 'Normal Heavy Clean', duration: 35, temp: '40°C', desc: 'Pencucian standar mendalam serat kain' },
    { name: 'Bed Cover & Blanket Care', duration: 50, temp: '60°C', desc: 'Sterilisasi suhu tinggi untuk selimut tebal' },
    { name: 'Delicate / Silk Gentle', duration: 25, temp: 'Cold', desc: 'Putaran halus untuk bahan sutra & rajut' }
  ];

  const dryerPrograms = [
    { name: 'Eco Warm Dry', duration: 25, temp: '50°C', desc: 'Pengeringan hemat gas suhu sedang' },
    { name: 'Turbo High-Heat Dry', duration: 35, temp: '70°C', desc: 'Kering maksimal bebas kuman & bakteri' },
    { name: 'Bed Cover Jumbo Dry', duration: 45, temp: '75°C', desc: 'Pengeringan intensif bahan tebal' }
  ];

  const weeklyStats = [
    { day: 'Sen', amount: 480, height: '55%' },
    { day: 'Sel', amount: 620, height: '70%' },
    { day: 'Rab', amount: 550, height: '62%' },
    { day: 'Kam', amount: 780, height: '88%' },
    { day: 'Jum', amount: 690, height: '78%' },
    { day: 'Sab', amount: 950, height: '100%', highlight: true },
    { day: 'Min', amount: 890, height: '92%', highlight: true }
  ];

  return (
    <div className="flex h-screen bg-[#F3F6F9] w-full overflow-hidden text-slate-800 font-sans select-none antialiased">
      {/* 1. MOBILE BACKDROP OVERLAY */}
      {isMobileSidebarOpen && (
        <div 
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-sm lg:hidden animate-fade-in"
        />
      )}

      {/* 2. MODERN SLATE SIDEBAR (DESKTOP + MOBILE DRAWER) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#090E17] text-slate-300 flex flex-col justify-between p-5 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 lg:w-68 border-r border-white/5 shadow-2xl ${
        isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="absolute top-0 left-0 w-full h-32 bg-primary/10 blur-3xl pointer-events-none"></div>

        <div className="space-y-7 relative z-10">
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-sky-400 via-primary to-indigo-600 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-sky-500/20 ring-2 ring-white/15">
                🧼
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-black text-white tracking-tight truncate max-w-[120px]">
                    {branding.laundryName || 'LaundryKu'}
                  </h2>
                  <span className="px-1.5 py-0.5 rounded-md bg-sky-500/20 text-sky-300 font-black text-[9px] border border-sky-400/30">PRO</span>
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Kasir & ERP Laundry</p>
              </div>
            </div>
            
            {/* Close button on mobile */}
            <button 
              onClick={() => setIsMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-xl bg-white/10 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6 overflow-y-auto no-scrollbar max-h-[calc(100vh-280px)]">
            <div>
              <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Menu Utama</p>
              <nav className="space-y-1">
                {[
                  { id: 'orders', label: 'Antrean & Kanban Board', icon: LayoutGrid, badge: activeOrders.length },
                  { id: 'machines', label: 'IoT Fleet Mesin', icon: RefreshCw },
                  { id: 'pos', label: 'Kasir POS Walk-In', icon: DollarSign },
                  { id: 'overview', label: 'Ringkasan & Analitik', icon: BarChart3 },
                  { id: 'couriers', label: 'Armada Kurir Antar', icon: Truck },
                ].map((menu) => {
                  const Icon = menu.icon;
                  const isActive = selectedDashboardTab === menu.id;
                  return (
                    <button
                      key={menu.id}
                      onClick={() => {
                        setSelectedDashboardTab(menu.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg shadow-primary/25 font-black'
                          : 'hover:bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{menu.label}</span>
                      </div>
                      {menu.badge > 0 && (
                        <span className="px-2 py-0.5 bg-rose-500 text-white rounded-full text-[10px] font-black shadow-sm animate-pulse">
                          {menu.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div>
              <p className="px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CMS & Database CRUD</p>
              <nav className="space-y-1">
                {[
                  { id: 'services_cms', label: 'CMS Tarif & Layanan', icon: Settings, count: services.length },
                  { id: 'promos_cms', label: 'CMS Promo & Kupon', icon: Tag, count: promos.length },
                  { id: 'customers', label: 'Database Member CRM', icon: Users, count: customers.length },
                  { id: 'inventory', label: 'Stok Bahan Baku & Kimia', icon: Package, count: inventory.length, badge: lowStockCount },
                  { id: 'payroll', label: 'Gaji & Komisi Karyawan', icon: Award, count: staffList.length },
                  { id: 'feedback', label: 'Ulasan & Resolusi CS', icon: Sparkles, count: reviews.length, badge: reviews.filter(r => r.status === 'pending_compensation').length },
                ].map((menu) => {
                  const Icon = menu.icon;
                  const isActive = selectedDashboardTab === menu.id;
                  return (
                    <button
                      key={menu.id}
                      onClick={() => {
                        setSelectedDashboardTab(menu.id);
                        setIsMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-black transition-all group ${
                        isActive
                          ? 'bg-gradient-to-r from-primary to-indigo-600 text-white shadow-lg shadow-primary/25'
                          : 'hover:bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                        <span>{menu.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {menu.badge > 0 && (
                          <span className="px-1.5 py-0.5 bg-rose-500 text-white rounded-full text-[9px] font-black animate-pulse">
                            {menu.badge}
                          </span>
                        )}
                        <span className="text-[10px] font-bold opacity-60 bg-white/10 px-2 py-0.5 rounded-md">
                          {menu.count}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/10 space-y-2 relative z-10">
          {onOpenSuperAdmin && (
            <button
              onClick={onOpenSuperAdmin}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-black text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 rounded-xl border border-amber-500/30 transition-colors shadow-xs"
              title="Kembali ke Panel Super Admin Master"
            >
              <span>👑 Super Admin Master</span>
            </button>
          )}

          {onOpenBrandingSettings && (
            <button
              onClick={onOpenBrandingSettings}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-black text-sky-300 hover:text-white bg-sky-500/10 hover:bg-sky-500/20 rounded-xl border border-sky-500/30 transition-colors"
              title="Atur Nama Laundry, Logo & Format Struk"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>🏷️ Profil & Branding Toko</span>
            </button>
          )}

          <button
            onClick={onResetDemoData}
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 text-[10px] font-black text-slate-400 hover:text-amber-400 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors"
            title="Kembalikan semua data ke default demo"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Data Demo</span>
          </button>

          <div className="flex items-center justify-between bg-white/5 p-3 rounded-2xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 text-white flex items-center justify-center font-black text-xs shadow-md">
                  AD
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-[#090E17]"></span>
              </div>
              <div>
                <p className="text-xs font-black text-white">Daffa Pradipta</p>
                <p className="text-[10px] text-sky-400 font-bold">Outlet Manager</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* 2. MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#F8FAFC]">
        {/* Top Control Bar */}
        <header className="h-18 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between z-10 flex-shrink-0 shadow-xs gap-3">
          <div className="flex items-center gap-3 sm:gap-6">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200 transition-colors flex items-center justify-center flex-shrink-0 shadow-xs"
              title="Buka Menu Navigasi Admin"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400 font-bold">
                <span>Portal Outlet</span>
                <span>/</span>
                <span className="text-primary font-black uppercase tracking-wider truncate max-w-[140px] sm:max-w-none">
                  {selectedDashboardTab.replace('_', ' ')}
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight mt-0.5 truncate max-w-[200px] sm:max-w-none">
                {selectedDashboardTab === 'orders' && 'Kanban Board & Antrean Cucian'}
                {selectedDashboardTab === 'machines' && 'Manajemen & CRUD Armada Mesin IoT'}
                {selectedDashboardTab === 'pos' && 'Point of Sale (Kasir Walk-In)'}
                {selectedDashboardTab === 'overview' && 'Ringkasan & Analitik Bisnis'}
                {selectedDashboardTab === 'couriers' && 'CRUD Armada Kurir Antar-Jemput'}
                {selectedDashboardTab === 'services_cms' && 'CMS CRUD Tarif & Layanan'}
                {selectedDashboardTab === 'promos_cms' && 'CMS CRUD Kupon Diskon & Voucher'}
                {selectedDashboardTab === 'customers' && 'Database & Manajemen Member CRM'}
                {selectedDashboardTab === 'inventory' && 'Manajemen Stok Bahan & Perlengkapan'}
                {selectedDashboardTab === 'payroll' && 'Manajemen Gaji, Komisi & Payroll Karyawan'}
                {selectedDashboardTab === 'feedback' && 'Pusat Ulasan Pelanggan & Resolusi Keluhan CS'}
              </h1>
            </div>

            <div className="hidden xl:flex items-center gap-2 bg-slate-100/80 px-3 py-1.5 rounded-xl border border-slate-200/80 text-slate-700 font-mono text-xs font-black">
              <Clock className="w-3.5 h-3.5 text-primary" />
              <span>{currentTime.toLocaleTimeString('id-ID')} WIB</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Contextual Action Button based on selected tab */}
            {selectedDashboardTab === 'payroll' && (
              <button
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center gap-2 transition-all hover:scale-102"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Tambah Karyawan</span>
              </button>
            )}

            {selectedDashboardTab === 'services_cms' && (
              <button
                onClick={() => setShowAddServiceModal(true)}
                className="px-3 sm:px-4 py-2 sm:py-2.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center gap-1.5 sm:gap-2 transition-all hover:scale-102"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Tambah Layanan</span>
              </button>
            )}

            {selectedDashboardTab === 'promos_cms' && (
              <button
                onClick={() => setShowAddPromoModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center gap-2 transition-all hover:scale-102"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Buat Kupon Baru</span>
              </button>
            )}

            {selectedDashboardTab === 'couriers' && (
              <button
                onClick={() => setShowAddCourierModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center gap-2 transition-all hover:scale-102"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Tambah Kurir</span>
              </button>
            )}

            {selectedDashboardTab === 'customers' && (
              <button
                onClick={() => setShowAddCustomerModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center gap-2 transition-all hover:scale-102"
              >
                <UserPlus className="w-4 h-4 stroke-[2.5]" />
                <span>+ Tambah Member</span>
              </button>
            )}

            {selectedDashboardTab === 'machines' && (
              <button
                onClick={() => setShowAddMachineModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center gap-2 transition-all hover:scale-102"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Tambah Unit Mesin</span>
              </button>
            )}

            {selectedDashboardTab === 'inventory' && (
              <button
                onClick={() => setShowAddInventoryModal(true)}
                className="px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center gap-2 transition-all hover:scale-102"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>+ Tambah Bahan Baku</span>
              </button>
            )}

            {onOpenBrandingSettings && (
              <button
                onClick={onOpenBrandingSettings}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 bg-sky-50 hover:bg-sky-100 text-primary border border-sky-200 rounded-2xl text-xs font-black shadow-xs transition-all"
                title="Kustomisasi Nama Laundry & Struk Thermal"
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Branding Toko</span>
              </button>
            )}

            <button
              onClick={handleExportCSV}
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl border border-slate-200 transition-colors flex items-center gap-2 shadow-xs"
              title="Unduh Rekap Laporan Transaksi Excel/CSV"
            >
              <Download className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Unduh CSV</span>
            </button>

            <button
              onClick={() => setSelectedDashboardTab('pos')}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-xs flex items-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Order Kasir</span>
            </button>
          </div>
        </header>

        {/* Scrollable Dashboard Workspace */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-8">
          {/* TAB 1: KANBAN BOARD & ORDERS */}
          {selectedDashboardTab === 'orders' && (
            <div className="space-y-6 max-w-full mx-auto">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900">
                      {ordersViewMode === 'kanban' ? 'Visual Kanban Board (Drag & Drop)' : 'Daftar Antrean Tabel'}
                    </h3>
                    <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-black rounded-md">
                      {filteredOrders.length} Pesanan
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">
                    {ordersViewMode === 'kanban' 
                      ? 'Tarik & geser (Drag and Drop) kartu cucian ke kolom proses berikutnya untuk update instan.' 
                      : 'Kelola, cari, dan cetak invoice seluruh antrean pakaian.'}
                  </p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Cari Invoice / Pelanggan..."
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
                    <button
                      onClick={() => setOrdersViewMode('kanban')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                        ordersViewMode === 'kanban' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span>Kanban</span>
                    </button>
                    <button
                      onClick={() => setOrdersViewMode('table')}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                        ordersViewMode === 'table' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      <List className="w-3.5 h-3.5" />
                      <span>Tabel</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* KANBAN BOARD */}
              {ordersViewMode === 'kanban' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 overflow-x-auto pb-4 items-start">
                  {kanbanColumns.map((col) => {
                    const colOrders = filteredOrders.filter(o => {
                      if (col.key === 'Selesai') return o.status === 'Selesai' || o.status === 'Diambil';
                      return o.status === col.key;
                    });
                    const isDragOver = dragOverCol === col.key;

                    return (
                      <div
                        key={col.key}
                        onDragOver={(e) => handleDragOver(e, col.key)}
                        onDrop={(e) => handleDrop(e, col.key)}
                        className={`rounded-3xl border-2 transition-all flex flex-col min-h-[560px] max-h-[calc(100vh-250px)] ${col.bg} ${
                          isDragOver 
                            ? 'border-primary ring-4 ring-primary/20 bg-sky-100/50 scale-101 shadow-lg' 
                            : `${col.border} shadow-soft`
                        }`}
                      >
                        <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm rounded-t-3xl z-10">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{col.icon}</span>
                            <h4 className="text-xs font-black text-slate-850 truncate max-w-[120px]">{col.label}</h4>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${col.badge}`}>
                            {colOrders.length}
                          </span>
                        </div>

                        <div className="p-3 space-y-3 flex-1 overflow-y-auto no-scrollbar">
                          {colOrders.length === 0 ? (
                            <div className="h-40 border-2 border-dashed border-slate-200/90 rounded-2xl flex flex-col items-center justify-center p-4 text-center text-slate-400">
                              <span className="text-2xl mb-1 opacity-50">{col.icon}</span>
                              <p className="text-[11px] font-bold">Tarik order ke sini</p>
                            </div>
                          ) : (
                            colOrders.map((order) => (
                              <div
                                key={order.id}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, order.id)}
                                onDragEnd={handleDragEnd}
                                className={`p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-soft-lg hover:border-primary/50 transition-all duration-200 cursor-grab active:cursor-grabbing space-y-3 group ${
                                  draggingOrderId === order.id ? 'opacity-40 scale-95 border-dashed border-primary' : ''
                                }`}
                              >
                                <div className="flex justify-between items-start">
                                  <div className="flex items-center gap-1.5">
                                    <GripVertical className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary transition-colors flex-shrink-0" />
                                    <h5 className="font-black text-xs text-slate-900">{order.id}</h5>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <a
                                      href={getWhatsAppShareUrl(order)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="p-1 text-slate-400 hover:text-emerald-600 rounded hover:bg-emerald-50 transition-colors"
                                      title="Kirim Nota via WhatsApp"
                                    >
                                      <MessageCircle className="w-3.5 h-3.5 fill-emerald-500/20" />
                                    </a>
                                      <button
                                        onClick={() => setSelectedPhotoOrder(order)}
                                        className="p-1 text-slate-400 hover:text-sky-600 rounded hover:bg-sky-50 transition-colors"
                                        title="Foto Audit Pakaian (Before & After)"
                                      >
                                        <Camera className="w-3.5 h-3.5" />
                                      </button>
                                      <button
                                        onClick={() => setSelectedThermalOrder(order)}
                                        className="p-1 text-slate-400 hover:text-primary rounded hover:bg-sky-50 transition-colors"
                                        title="Cetak Struk Thermal & Tag Pakaian"
                                      >
                                        <Printer className="w-3.5 h-3.5" />
                                      </button>
                                    <button
                                      onClick={() => onDeleteOrder(order.id)}
                                      className="p-1 text-slate-400 hover:text-rose-600 rounded hover:bg-rose-50"
                                      title="Hapus / Batalkan Pesanan"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>

                                <div>
                                  <p className="text-xs font-black text-slate-800">{order.customerName || 'Aisyah Salsabila'}</p>
                                  <p className="text-[10px] text-slate-400 font-semibold">{order.customerPhone || '0812-3456-7890'}</p>
                                </div>

                                <div className="flex items-center justify-between text-[11px] pt-1">
                                  <span className="px-2 py-0.5 bg-sky-50 text-primary font-black rounded-md border border-sky-100 truncate max-w-[110px]">
                                    {order.serviceName}
                                  </span>
                                  <span className="font-black text-slate-700">{order.amount} {order.unit}</span>
                                </div>

                                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px]">
                                  <span className="font-black text-slate-900">Rp {(order.totalPrice || 50000).toLocaleString('id-ID')}</span>
                                  <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                    {order.paymentMethod || 'Wallet'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-bold bg-slate-50 p-1.5 rounded-lg border border-slate-150">
                                  <Truck className="w-3 h-3 text-primary flex-shrink-0" />
                                  <span className="truncate">{order.courierName?.split(' ')[0] || 'Doni'}</span>
                                </div>

                                <div className="pt-1 flex items-center justify-between text-[10px] opacity-80 group-hover:opacity-100">
                                  <button
                                    onClick={() => handleMoveStep(order.id, order.status, 'prev')}
                                    className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-700 flex items-center gap-0.5 font-bold"
                                    title="Mundur 1 Tahap"
                                  >
                                    <ArrowLeft className="w-3 h-3" />
                                  </button>
                                  <span className="text-[9px] text-slate-300 font-bold uppercase">Geser →</span>
                                  <button
                                    onClick={() => handleMoveStep(order.id, order.status, 'next')}
                                    className="p-1 hover:bg-primary hover:text-white rounded text-primary flex items-center gap-0.5 font-bold transition-colors"
                                    title="Maju ke Tahap Berikutnya"
                                  >
                                    <ArrowRight className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                        <th className="py-4 px-5">Invoice ID</th>
                        <th className="py-4 px-5">Pelanggan</th>
                        <th className="py-4 px-5">Layanan</th>
                        <th className="py-4 px-5">Beban / Qty</th>
                        <th className="py-4 px-5">Kurir Antar</th>
                        <th className="py-4 px-5">Total Biaya</th>
                        <th className="py-4 px-5">Status Progres</th>
                        <th className="py-4 px-5 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredOrders.map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-5 font-black text-slate-900">{o.id}</td>
                          <td className="py-4 px-5">
                            <p className="font-extrabold text-slate-850">{o.customerName || 'Aisyah Salsabila'}</p>
                            <p className="text-[10px] text-slate-400 font-semibold">{o.customerPhone || '0812-3456-7890'}</p>
                          </td>
                          <td className="py-4 px-5 font-bold text-slate-700">{o.serviceName}</td>
                          <td className="py-4 px-5 font-semibold text-slate-650">{o.amount} {o.unit}</td>
                          <td className="py-4 px-5">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[10px] font-bold flex items-center gap-1 w-max">
                              <Truck className="w-3 h-3 text-primary" />
                              <span>{o.courierName?.split(' ')[0] || 'Doni'}</span>
                            </span>
                          </td>
                          <td className="py-4 px-5 font-black text-slate-900">Rp {(o.totalPrice || 60000).toLocaleString('id-ID')}</td>
                          <td className="py-4 px-5">
                            <select
                              value={o.status === 'Diambil' ? 'Selesai' : o.status}
                              onChange={(e) => onUpdateOrderStatus(o.id, e.target.value)}
                              className="text-[11px] font-black bg-slate-100 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-primary"
                            >
                              {statuses.map(st => (
                                <option key={st.value} value={st.value}>{st.label}</option>
                              ))}
                            </select>
                          </td>
                          <td className="py-4 px-5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <a
                                href={getWhatsAppShareUrl(o)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-black text-[11px] transition-all inline-flex items-center gap-1 shadow-xs border border-emerald-200"
                                title="Kirim Struk via WhatsApp"
                              >
                                <MessageCircle className="w-3 h-3 fill-current" /> WA
                              </a>
                              <button
                                onClick={() => setSelectedPhotoOrder(o)}
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-[11px] transition-all inline-flex items-center gap-1 shadow-xs"
                                title="Foto Audit Pakaian (Before & After)"
                              >
                                <Camera className="w-3 h-3" /> Foto Audit
                              </button>
                              <button
                                onClick={() => setSelectedThermalOrder(o)}
                                className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-primary border border-sky-200 rounded-xl font-black text-[11px] transition-all inline-flex items-center gap-1 shadow-xs"
                                title="Cetak Nota Thermal 58/80mm & Tag Baju"
                              >
                                <Printer className="w-3 h-3" /> Cetak Nota / Tag
                              </button>
                              <button
                                onClick={() => onDeleteOrder(o.id)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all"
                                title="Hapus Order"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: CMS SERVICES (CRUD) */}
          {selectedDashboardTab === 'services_cms' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">CMS Tarif & Layanan Laundry</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Kelola katalog layanan, ubah harga, dan tambah jasa baru secara real-time</p>
                </div>
                <button
                  onClick={() => setShowAddServiceModal(true)}
                  className="px-4.5 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center gap-2 hover:opacity-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Tambah Layanan</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.map((serv) => (
                  <div key={serv.id} className="p-5 border border-slate-200/80 rounded-3xl hover:border-slate-300 transition-all flex justify-between items-center bg-slate-50/50 group">
                    <div className="flex items-center gap-4">
                      <div className="w-13 h-13 rounded-2xl bg-white border border-slate-200 text-2xl flex items-center justify-center shadow-clay-sm flex-shrink-0">
                        {serv.icon || '🧺'}
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900">{serv.name}</h4>
                        <p className="text-xs text-slate-400 font-semibold mt-0.5">{serv.desc || 'Layanan profesional'}</p>
                        <p className="text-xs font-black text-primary mt-1">
                          Rp {serv.price.toLocaleString('id-ID')} / {serv.unit}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditServiceForm(serv);
                          setSelectedServiceToEdit(serv);
                        }}
                        className="px-3.5 py-2 bg-slate-200/80 hover:bg-slate-300 text-slate-800 rounded-xl font-black text-xs transition-all flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onDeleteService(serv.id)}
                        className="p-2 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all"
                        title="Hapus Layanan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CMS PROMOS (CRUD) */}
          {selectedDashboardTab === 'promos_cms' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">CMS Kode Voucher & Diskon</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Buat, edit persentase potongan, dan kelola kupon aktif</p>
                </div>
                <button
                  onClick={() => setShowAddPromoModal(true)}
                  className="px-4.5 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center gap-2 hover:opacity-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Buat Kupon Baru</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {promos.map((p) => (
                  <div key={p.id} className="p-6 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-3xl shadow-soft space-y-4 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-xs font-black bg-slate-900 text-white px-3 py-1 rounded-xl tracking-wider">
                          {p.code}
                        </span>
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
                          Diskon {p.discountPct || 20}%
                        </span>
                      </div>
                      <h4 className="text-sm font-black text-slate-900 mt-3">{p.title}</h4>
                      <p className="text-xs text-slate-400 font-semibold mt-1 leading-relaxed">{p.desc}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-[10px] font-black text-primary bg-sky-50 px-2 py-0.5 rounded-md">
                        {p.tag || 'Spesial'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            setEditPromoForm(p);
                            setSelectedPromoToEdit(p);
                          }}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => onDeletePromo(p.id)}
                          className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-colors"
                          title="Hapus Kupon"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: COURIERS FLEET (CRUD) */}
          {selectedDashboardTab === 'couriers' && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-6 max-w-7xl mx-auto">
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-black text-slate-900">Armada Kurir Antar-Jemput Gerai</h3>
                  <p className="text-xs text-slate-400 font-semibold mt-0.5">Kelola data driver, plat kendaraan, kontak WhatsApp, dan penugasan</p>
                </div>
                <button
                  onClick={() => setShowAddCourierModal(true)}
                  className="px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center gap-2 hover:opacity-95"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>+ Tambah Kurir</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {couriers.map((c) => (
                  <div key={c.id} className="p-6 bg-slate-50 border border-slate-200 rounded-3xl shadow-soft space-y-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white font-black text-base flex items-center justify-center shadow-clay-sm">
                            {c.avatar || 'DR'}
                          </div>
                          <div>
                            <h4 className="text-sm font-black text-slate-900">{c.name}</h4>
                            <p className="text-xs text-slate-400 font-semibold">{c.phone}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditCourierForm(c);
                              setSelectedCourierToEdit(c);
                            }}
                            className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                            title="Edit Data Kurir"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteCourier(c.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                            title="Hapus Kurir"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs text-slate-600 font-semibold pt-4 border-t border-slate-200 mt-4">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Kendaraan:</span>
                          <span className="font-bold text-slate-800">{c.vehicle}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Status:</span>
                          <span className="font-bold text-emerald-600">{c.status || 'Siaga'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Rating Pelanggan:</span>
                          <span className="font-bold text-amber-600">{c.rating || '4.9 ⭐'}</span>
                        </div>
                      </div>
                    </div>

                    <a
                      href={`https://wa.me/${c.phone.replace(/[^\d]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>Hubungi WhatsApp</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: SMART CUSTOMERS CRM & SEGMENTATION */}
          {selectedDashboardTab === 'customers' && (() => {
            // CRM Analytics & Filtering
            const totalMembers = customers.length;
            const vipMembers = customers.filter(c => (c.totalSpent || 0) >= 750000 || c.tier?.toLowerCase().includes('gold') || c.tier?.toLowerCase().includes('plat'));
            const atRiskMembers = customers.filter(c => c.lastOrderDate?.includes('April') || (c.lastOrderDate && c.lastOrderDate.includes('2023')));
            const loyalMembers = customers.filter(c => (c.totalOrders || 0) >= 5 && !atRiskMembers.includes(c));
            const newMembers = customers.filter(c => (c.totalOrders || 0) <= 2 && !atRiskMembers.includes(c));
            const totalDepositBalance = customers.reduce((acc, c) => acc + (c.balance || 0), 0);

            const filteredCustomers = customers.filter(c => {
              // Segmentation filter
              if (crmSegmentFilter === 'vip') {
                if (!vipMembers.includes(c)) return false;
              } else if (crmSegmentFilter === 'loyal') {
                if (!loyalMembers.includes(c)) return false;
              } else if (crmSegmentFilter === 'at_risk') {
                if (!atRiskMembers.includes(c)) return false;
              } else if (crmSegmentFilter === 'new') {
                if (!newMembers.includes(c)) return false;
              }

              // Search term filter
              if (crmSearchTerm.trim()) {
                const q = crmSearchTerm.toLowerCase();
                return (
                  c.name.toLowerCase().includes(q) ||
                  c.phone.toLowerCase().includes(q) ||
                  (c.email || '').toLowerCase().includes(q) ||
                  (c.address || '').toLowerCase().includes(q) ||
                  (c.preferences || '').toLowerCase().includes(q) ||
                  (c.tier || '').toLowerCase().includes(q)
                );
              }
              return true;
            });

            return (
              <div className="space-y-6 max-w-7xl mx-auto">
                {/* 4 CRM Metric Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-wider">Total Member CRM</span>
                      <div className="p-2 bg-sky-50 text-primary rounded-xl">
                        <Users className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-slate-850">{totalMembers} <span className="text-xs font-bold text-slate-400">Pelanggan</span></p>
                    <p className="text-[10px] text-emerald-600 font-bold">● 100% Terverifikasi WhatsApp</p>
                  </div>

                  <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-black text-amber-600 uppercase tracking-wider">VIP & Sultan Members</span>
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                        <Award className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-amber-600">{vipMembers.length} <span className="text-xs font-bold text-slate-400">Akun</span></p>
                    <p className="text-[10px] text-slate-400 font-bold">Belanja &gt; Rp 750.000 / Kuota Gold</p>
                  </div>

                  <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-black text-rose-600 uppercase tracking-wider">Perlu Follow-Up (Pasif)</span>
                      <div className="p-2 bg-rose-50 text-rose-600 rounded-xl">
                        <AlertCircle className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-rose-600">{atRiskMembers.length} <span className="text-xs font-bold text-slate-400">Pelanggan</span></p>
                    <p className="text-[10px] text-rose-500 font-bold">⚠️ Tidak mencuci &gt; 21 Hari</p>
                  </div>

                  <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
                    <div className="flex justify-between items-start">
                      <span className="text-[11px] font-black text-emerald-600 uppercase tracking-wider">Total Deposit Saldo</span>
                      <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                        <CreditCard className="w-4 h-4" />
                      </div>
                    </div>
                    <p className="text-2xl font-black text-emerald-600">Rp {totalDepositBalance.toLocaleString('id-ID')}</p>
                    <p className="text-[10px] text-slate-400 font-bold">Dana tersimpan di Laundry Wallet</p>
                  </div>
                </div>

                {/* CRM Controls: Segmentation Pills & Search */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Database & Segmentasi Pelanggan (CRM)</h3>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Filter segmen pelanggan dan kirim follow-up WhatsApp otomatis untuk meningkatkan retensi</p>
                    </div>
                    <button
                      onClick={() => setShowAddCustomerModal(true)}
                      className="px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center gap-2 hover:opacity-95"
                    >
                      <UserPlus className="w-4 h-4 stroke-[2.5]" />
                      <span>+ Tambah Member</span>
                    </button>
                  </div>

                  {/* Filter Pills & Search Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all', label: `Semua (${totalMembers})` },
                        { id: 'vip', label: `🌟 VIP & Sultan (${vipMembers.length})` },
                        { id: 'loyal', label: `💎 Loyal Active (${loyalMembers.length})` },
                        { id: 'at_risk', label: `⚠️ Perlu Follow-Up (${atRiskMembers.length})` },
                        { id: 'new', label: `🌱 Member Baru (${newMembers.length})` }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setCrmSegmentFilter(tab.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                            crmSegmentFilter === tab.id
                              ? 'bg-slate-900 text-white shadow-sm'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="relative min-w-[240px]">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={crmSearchTerm}
                        onChange={(e) => setCrmSearchTerm(e.target.value)}
                        placeholder="Cari nama, WA, preferensi..."
                        className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Customer CRM Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {filteredCustomers.map((cust) => {
                    const isAtRisk = atRiskMembers.includes(cust);
                    const isVip = vipMembers.includes(cust);
                    const tierInfo = getTierProgression(cust.totalSpent || 0);

                    return (
                      <div key={cust.id} className="p-6 border border-slate-200/90 rounded-3xl flex flex-col justify-between bg-white hover:shadow-soft transition-all space-y-4">
                        <div>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3.5">
                              <div className={`w-13 h-13 rounded-2xl ${tierInfo.currentTier.cardBg} text-white font-black text-base flex items-center justify-center shadow-clay-sm flex-shrink-0`}>
                                {cust.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <h4 className="text-sm font-black text-slate-900">{cust.name}</h4>
                                <p className="text-[11px] text-slate-400 font-semibold">{cust.phone}</p>
                                <span className={`inline-block mt-1 px-2.5 py-0.5 text-[10px] font-black rounded-full border ${tierInfo.currentTier.borderColor} ${tierInfo.currentTier.accentColor} bg-slate-900`}>
                                  {tierInfo.currentTier.badge}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditCustomerForm(cust);
                                  setSelectedCustomerToEdit(cust);
                                }}
                                className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                                title="Edit Data Member"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteCustomer(cust.id)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                title="Hapus Member"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Address & Preferences */}
                          <div className="space-y-2 mt-4 text-xs font-semibold">
                            <p className="text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-150 truncate">
                              📍 {cust.address || 'Alamat belum diatur'}
                            </p>
                            <div className="bg-amber-50/70 p-2.5 rounded-xl border border-amber-200/70 text-[11px] text-amber-900">
                              <span className="font-black text-amber-800">✨ Preferensi Cuci: </span>
                              <span>{cust.preferences || 'Standar tanpa catatan khusus'}</span>
                            </div>
                          </div>

                          {/* Activity & Last Order */}
                          <div className="mt-3 flex items-center justify-between text-[11px] font-bold">
                            <span className="text-slate-400">Aktivitas Terakhir:</span>
                            {isAtRisk ? (
                              <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 font-black">
                                ⚠️ {cust.lastOrderDate || '25+ Hari lalu (Pasif)'}
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200">
                                ✅ {cust.lastOrderDate || 'Aktif Baru-baru ini'}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Financial & Points Summary */}
                        <div className="space-y-3 pt-3 border-t border-slate-150">
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2 bg-slate-50 rounded-xl">
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Belanja</p>
                              <p className="text-[11px] font-black text-slate-900">Rp {((cust.totalSpent || 0) / 1000).toLocaleString('id-ID')}k</p>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-xl">
                              <p className="text-[9px] font-bold text-slate-400 uppercase">Wallet</p>
                              <p className="text-[11px] font-black text-primary">Rp {((cust.balance || 0) / 1000).toLocaleString('id-ID')}k</p>
                            </div>
                            <div className="p-2 bg-slate-50 rounded-xl">
                              <p className="text-[9px] font-bold text-amber-600 uppercase">Points</p>
                              <p className="text-[11px] font-black text-amber-700">{cust.points || 0} Pts</p>
                            </div>
                          </div>

                          {/* 1-Click WhatsApp CRM Automation Buttons */}
                          {isAtRisk ? (
                            <a
                              href={getWhatsAppWinBackUrl(cust, 'KANGEN20')}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all text-center"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
                              <span>💬 Ajak Balik (Kirim Kupon 20%)</span>
                            </a>
                          ) : isVip ? (
                            <a
                              href={getWhatsAppVIPGreetingUrl(cust)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-yellow-600 hover:opacity-95 text-white font-black text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-all text-center"
                            >
                              <Award className="w-3.5 h-3.5" />
                              <span>💬 Sapa Member VIP (WhatsApp)</span>
                            </a>
                          ) : (
                            <a
                              href={getWhatsAppWelcomeUrl(cust)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all text-center"
                            >
                              <MessageCircle className="w-3.5 h-3.5 text-primary" />
                              <span>💬 Kirim Sapaan WhatsApp</span>
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* TAB 6: IOT MACHINES (CRUD) */}
          {selectedDashboardTab === 'machines' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div className="bg-gradient-to-r from-slate-900 via-[#0E1B31] to-[#0A2540] p-6 sm:p-7 rounded-3xl text-white shadow-soft relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2 z-10 max-w-xl">
                  <span className="px-3 py-1 bg-sky-500/20 text-sky-300 text-[10px] font-black rounded-lg uppercase tracking-wider border border-sky-400/30">
                    Smart Hardware Hub · Full CRUD & Specs
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">Manajemen Perangkat IoT Mesin Laundry</h3>
                  <p className="text-xs text-slate-300 font-medium leading-relaxed">
                    Kelola spesifikasi hardware, merk mesin komersial, serial number, IP gateway, serta kontrol siklus pengerjaan pakaian otomatis.
                  </p>
                </div>

                <div className="flex items-center gap-3 z-10">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center min-w-[100px]">
                    <p className="text-[10px] text-sky-200 font-bold uppercase tracking-wider">Total Armada</p>
                    <p className="text-2xl font-black text-white mt-0.5">{machines.length} Unit</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/15 text-center min-w-[100px]">
                    <p className="text-[10px] text-sky-200 font-bold uppercase tracking-wider">Sedang Aktif</p>
                    <p className="text-2xl font-black text-emerald-400 mt-0.5">
                      {machines.filter(m => m.status === 'running').length} Unit
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {machines.map((m) => {
                  const isRunning = m.status === 'running';
                  const progressPct = m.totalDuration ? Math.min(100, Math.round(((m.totalDuration - m.timeLeft) / m.totalDuration) * 100)) : 0;
                  const assignedOrder = activeOrders.find(o => o.id === m.assignedOrderId);

                  return (
                    <div 
                      key={m.id}
                      className={`p-6 bg-white rounded-3xl border-2 shadow-soft space-y-5 transition-all duration-300 relative overflow-hidden flex flex-col justify-between ${
                        isRunning ? 'border-primary ring-4 ring-primary/10 shadow-soft-lg' : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div className={`w-13 h-13 rounded-2.5xl flex items-center justify-center text-2xl shadow-clay-sm ${
                            isRunning ? 'bg-gradient-to-tr from-primary to-indigo-600 text-white' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {m.type === 'washer' ? '🧼' : '💨'}
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                              isRunning ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 animate-pulse' : 'bg-slate-100 text-slate-600'
                            }`}>
                              <span className={`w-2 h-2 rounded-full ${isRunning ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                              {isRunning ? 'Berputar' : 'Siaga'}
                            </span>

                            <button
                              onClick={() => setSelectedMachineToDetail(m)}
                              className="p-1.5 text-slate-400 hover:text-primary hover:bg-sky-50 rounded-xl transition-colors"
                              title="Lihat Spesifikasi Lengkap"
                            >
                              <Info className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                setEditMachineForm(m);
                                setSelectedMachineToEdit(m);
                              }}
                              className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-colors"
                              title="Edit Data & Spek Mesin"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => onDeleteMachine(m.id)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                              title="Hapus Unit Mesin"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="flex items-center justify-center py-2">
                          <div className={`w-28 h-28 rounded-full border-4 flex items-center justify-center transition-all relative ${
                            isRunning ? 'border-dashed border-primary bg-sky-50/70 animate-spin-slow' : 'border-slate-200 bg-slate-50'
                          }`}>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl ${
                              isRunning ? 'bg-white shadow-clay-sm' : 'bg-slate-100 text-slate-400'
                            }`}>
                              {m.type === 'washer' ? (
                                <Droplets className={`w-7 h-7 ${isRunning ? 'text-primary animate-bounce-slow' : 'text-slate-400'}`} />
                              ) : (
                                <Wind className={`w-7 h-7 ${isRunning ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="text-base font-black text-slate-900 leading-tight truncate">{m.name}</h4>
                              <span className="text-[10px] font-mono font-bold text-slate-400">{m.id}</span>
                            </div>
                            <p className="text-xs font-bold text-primary mt-0.5 truncate">{m.brand || 'Komersial Pro'}</p>
                            <p className="text-[11px] text-slate-400 font-semibold mt-0.5">Kapasitas: <strong className="text-slate-750">{m.capacity}</strong> · {m.spinSpeed || '1200 RPM'}</p>
                          </div>

                          {isRunning ? (
                            <div className="p-3 bg-sky-50 rounded-2xl border border-sky-100 space-y-2 text-xs">
                              <div className="flex justify-between items-center">
                                <span className="font-bold text-slate-600">Pesanan:</span>
                                <span className="font-black text-primary bg-white px-2 py-0.5 rounded-lg border border-sky-200">
                                  {m.assignedOrderId || 'Manual Run'}
                                </span>
                              </div>
                              {assignedOrder && (
                                <p className="text-[11px] text-slate-500 font-semibold truncate">
                                  {assignedOrder.customerName} · {assignedOrder.serviceName}
                                </p>
                              )}
                              <div className="flex justify-between items-center text-[11px] pt-1 border-t border-sky-100">
                                <span className="text-slate-400 font-bold">Program:</span>
                                <span className="font-extrabold text-slate-800">{m.programName} ({m.tempC})</span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-2.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-[11px] text-slate-500 font-bold">
                              <span>IP: {m.ipAddress || '192.168.1.10x'}</span>
                              <span className="text-emerald-600 font-black">● Siaga</span>
                            </div>
                          )}

                          {isRunning && (
                            <div className="space-y-1.5 pt-1">
                              <div className="flex justify-between text-xs font-black">
                                <span className="text-primary flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5" /> Sisa Waktu:
                                </span>
                                <span className="text-slate-900 text-sm font-black">{m.timeLeft} Menit</span>
                              </div>
                              <div className="w-full h-2.5 bg-sky-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-primary to-indigo-600 rounded-full transition-all duration-500" 
                                  style={{ width: `${progressPct}%` }}
                                ></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="pt-3">
                        {isRunning ? (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => onStopMachine(m.id, true)}
                              className="py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
                              title="Selesaikan & Pindahkan Status Order"
                            >
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Selesai</span>
                            </button>
                            <button
                              onClick={() => onStopMachine(m.id, false)}
                              className="py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all"
                              title="Hentikan Darurat"
                            >
                              <Power className="w-3.5 h-3.5" />
                              <span>Stop</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedMachineToStart(m);
                              const availableActive = activeOrders.find(o => m.type === 'washer' ? o.status === 'received' : o.status === 'washing');
                              setStartMachineOrderId(availableActive ? availableActive.id : '');
                              setStartMachineProgram(m.type === 'washer' ? washerPrograms[1] : dryerPrograms[0]);
                            }}
                            className="w-full py-3.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center justify-center gap-2 transition-all active:scale-98"
                          >
                            <Play className="w-4 h-4 fill-current" />
                            <span>Mulai Jalankan Mesin</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 7: POS CASHIER */}
          {selectedDashboardTab === 'pos' && (
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-soft space-y-7">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Kasir Point of Sale (POS)</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">Input order cepat untuk pelanggan walk-in / datang langsung</p>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary rounded-xl text-xs font-black border border-primary/20">
                    Terminal #01
                  </span>
                </div>

                {posSuccessMsg && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-black flex items-center gap-3 animate-scale-up">
                    <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                    <span>{posSuccessMsg}</span>
                  </div>
                )}

                <form onSubmit={handlePosSubmit} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">1. Data Pelanggan</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-600">Nama Pelanggan *</span>
                        <input
                          type="text"
                          required
                          value={posCustomerName}
                          onChange={(e) => setPosCustomerName(e.target.value)}
                          placeholder="Nama lengkap pelanggan"
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-primary focus:bg-white transition-colors"
                        />
                      </div>
                      <div className="space-y-1">
                        <span className="text-[11px] font-bold text-slate-600">Nomor WhatsApp / HP</span>
                        <input
                          type="text"
                          value={posCustomerPhone}
                          onChange={(e) => setPosCustomerPhone(e.target.value)}
                          placeholder="0812-xxxx-xxxx"
                          className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-primary focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">2. Pilih Layanan Jasa</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {services.map((serv) => {
                        const isSelected = posSelectedService === serv.id;
                        return (
                          <div
                            key={serv.id}
                            onClick={() => setPosSelectedService(serv.id)}
                            className={`p-4 rounded-2.5xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                              isSelected
                                ? 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-sm'
                                : 'border-slate-200/80 bg-white hover:border-slate-300'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <ServiceIcon
                                serviceId={serv.id}
                                name={serv.name}
                                fallbackIcon={serv.icon}
                                size="sm"
                              />
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${isSelected ? 'border-primary bg-primary text-white' : 'border-slate-300'}`}>
                                {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-black text-slate-900 leading-tight">{serv.name}</h4>
                              <p className="text-xs font-extrabold text-primary mt-1">Rp {serv.price.toLocaleString('id-ID')} <span className="text-[10px] text-slate-400 font-bold">/{serv.unit}</span></p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">3. Beban Cucian & Jumlah ({currentPosService?.unit || 'Kg'})</label>
                    <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-4 rounded-2.5xl border border-slate-200">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => setPosQuantity(Math.max(1, posQuantity - 1))}
                          className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 font-black text-base flex items-center justify-center hover:bg-slate-100 shadow-xs"
                        >
                          -
                        </button>
                        <span className="text-2xl font-black text-slate-900 px-3">{posQuantity}</span>
                        <button
                          type="button"
                          onClick={() => setPosQuantity(posQuantity + 1)}
                          className="w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-800 font-black text-base flex items-center justify-center hover:bg-slate-100 shadow-xs"
                        >
                          +
                        </button>
                      </div>

                      <div className="flex items-center gap-2 flex-1 justify-end flex-wrap">
                        <span className="text-[11px] font-bold text-slate-400 mr-1">Preset:</span>
                        {[2, 3, 5, 7, 10].map((qty) => (
                          <button
                            key={qty}
                            type="button"
                            onClick={() => setPosQuantity(qty)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                              posQuantity === qty ? 'bg-primary text-white shadow-xs' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {qty} {currentPosService?.unit || 'Kg'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">4. Varian Parfum Cucian</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {['🌸 Lavender Bloom', '🌊 Ocean Fresh', '🍓 Sweet Floral', '🍃 Green Tea Soft'].map((frag) => (
                        <button
                          key={frag}
                          type="button"
                          onClick={() => setPosFragrance(frag)}
                          className={`p-2.5 rounded-xl text-[11px] font-black border transition-all text-center ${
                            posFragrance === frag ? 'border-primary bg-primary/5 text-primary' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {frag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-wider">5. Metode Pembayaran Kasir</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[
                        { id: 'Tunai Kasir', label: '💵 Tunai Kasir' },
                        { id: 'QRIS Mandiri', label: '📱 QRIS Instan' },
                        { id: 'Transfer Bank', label: '💳 Transfer Bank' }
                      ].map((m) => (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() => setPosPaymentMethod(m.id)}
                          className={`p-3.5 rounded-2xl text-xs font-black border-2 transition-all ${
                            posPaymentMethod === m.id ? 'border-primary bg-primary/5 text-primary shadow-xs' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {m.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-sm rounded-2xl shadow-clay-sm flex items-center justify-center gap-2.5 transition-all hover:scale-101 active:scale-98"
                  >
                    <Printer className="w-5 h-5 stroke-[2.5]" />
                    <span>Proses Transaksi & Cetak Struk POS</span>
                  </button>
                </form>
              </div>

              <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span>Kalkulator & Nota Tagihan</span>
                    </h4>
                    <span className="text-[10px] font-black text-slate-400 uppercase">Live Preview</span>
                  </div>

                  <div className="bg-[#FAFBFD] p-5 rounded-2.5xl border border-slate-200 font-mono text-xs text-slate-800 space-y-4 shadow-inner">
                    <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
                      <p className="font-black text-base text-slate-900">🧺 LAUNDRYKU PRO</p>
                      <p className="text-[10px] text-slate-400">Jl. Cempaka Putih Raya No. 42A, Jakarta Pusat</p>
                      <p className="text-[10px] text-slate-400">WhatsApp: 0812-3456-7890</p>
                    </div>

                    <div className="space-y-1.5 text-[11px] pb-3 border-b border-dashed border-slate-300">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Pelanggan:</span>
                        <span className="font-bold">{posCustomerName || 'Umum / Walk-in'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">No. Kontak:</span>
                        <span>{posCustomerPhone || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Parfum:</span>
                        <span>{posFragrance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Bayar:</span>
                        <span className="font-black text-primary">{posPaymentMethod}</span>
                      </div>
                    </div>

                    <div className="space-y-2 pb-3 border-b border-slate-200">
                      <div className="flex justify-between font-bold">
                        <span>{currentPosService?.name}</span>
                        <span>Rp {posSubtotal.toLocaleString('id-ID')}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>{posQuantity} {currentPosService?.unit || 'Kg'} @ Rp {(currentPosService?.price || 12000).toLocaleString('id-ID')}</span>
                      </div>
                      {posAppliedDiscount > 0 && (
                        <div className="flex justify-between text-rose-600 font-bold text-[11px]">
                          <span>Diskon Promo ({posAppliedDiscount}%)</span>
                          <span>-Rp {posDiscountAmount.toLocaleString('id-ID')}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center text-sm font-black text-slate-900 pt-1">
                      <span>TOTAL TAGIHAN:</span>
                      <span className="text-lg text-primary">Rp {posFinalTotal.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="pt-2 text-center space-y-1">
                      <div className="w-full h-8 bg-slate-900/10 rounded flex items-center justify-center font-mono text-[9px] tracking-widest text-slate-500">
                        ||||| ||||||| |||| |||||||| ||||
                      </div>
                      <p className="text-[9px] text-slate-400">Terima kasih atas kepercayaan Anda</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase">Terapkan Kode Kupon Promo</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={posDiscountCode}
                        onChange={(e) => setPosDiscountCode(e.target.value.toUpperCase())}
                        placeholder="Contoh: WNDCLEAN30"
                        className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:outline-none focus:border-primary"
                      />
                      <button
                        type="button"
                        onClick={handleApplyDiscount}
                        className="px-4 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
                      >
                        Gunakan
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: OVERVIEW */}
          {selectedDashboardTab === 'overview' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { title: 'Total Pendapatan', val: `Rp ${calculatedEarnings.toLocaleString('id-ID')}`, trend: '+18.4%', trendUp: true, subtitle: 'Total akumulasi omset', icon: DollarSign, color: 'from-emerald-400 to-teal-500', bg: 'bg-emerald-50 text-emerald-600' },
                  { title: 'Antrean Aktif', val: `${activeOrdersCount} Pesanan`, trend: `${activeOrdersCount} perlu proses`, trendUp: true, subtitle: 'Cuci, kering & setrika', icon: ShoppingBag, color: 'from-sky-400 to-primary', bg: 'bg-sky-50 text-primary' },
                  { title: 'Armada Mesin Live', val: `${machines.filter(m => m.status === 'running').length} / ${machines.length} Unit`, trend: '85% efisiensi', trendUp: true, subtitle: 'IoT Fleet status', icon: RefreshCw, color: 'from-amber-400 to-orange-500', bg: 'bg-amber-50 text-amber-600' },
                  { title: 'Total Member CRM', val: `${customers.length} Orang`, trend: `${loyaltyPoints} Pts`, trendUp: true, subtitle: 'Database Terdaftar', icon: Users, color: 'from-purple-400 to-indigo-600', bg: 'bg-purple-50 text-purple-600' },
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="p-6 bg-white rounded-3xl border border-slate-200/80 shadow-soft hover:shadow-soft-lg hover:border-slate-300 transition-all duration-300 space-y-4 group">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{stat.title}</p>
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight">{stat.val}</h3>
                        </div>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-clay-sm ${stat.bg} group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-semibold">{stat.subtitle}</span>
                        <span className="font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                          {stat.trend}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Weekly Stats and Chart */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-7 rounded-3xl border border-slate-200/80 shadow-soft space-y-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                    <div>
                      <h4 className="text-base font-black text-slate-900">Grafik Omset Mingguan</h4>
                      <p className="text-xs text-slate-400 font-semibold mt-0.5">Pendapatan operasional 7 hari terakhir</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => exportOrdersToCSV(allOrders, 'Laporan_Keuangan_Omzet_LaundryKu')}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-750 font-black text-xs rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all"
                        title="Unduh Rekap Laporan Omzet Transaksi ke File CSV"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-600" />
                        <span>Unduh Laporan (.CSV)</span>
                      </button>
                      <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl border border-emerald-100">
                        +14.2% Omset Naik ↑
                      </span>
                    </div>
                  </div>

                  <div className="h-56 flex items-end justify-between gap-3 pt-6 px-4">
                    {weeklyStats.map((item, idx) => (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-3 group h-full justify-end">
                        <div className="relative w-full flex justify-center items-end" style={{ height: '80%' }}>
                          <div 
                            className={`w-full max-w-[36px] rounded-t-2xl transition-all duration-500 group-hover:opacity-80 ${
                              item.highlight 
                                ? 'bg-gradient-to-t from-primary to-indigo-600 shadow-md shadow-primary/20' 
                                : 'bg-slate-200 hover:bg-primary/40'
                            }`}
                            style={{ height: item.height }}
                          ></div>
                          <span className="absolute -top-7 text-[10px] font-black bg-slate-900 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                            Rp {item.amount}.000
                          </span>
                        </div>
                        <span className="text-xs font-extrabold text-slate-500">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white p-7 rounded-3xl border border-slate-200/80 shadow-soft space-y-5">
                  <h4 className="text-base font-black text-slate-900">Indikator Kualitas Gerai</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Ketepatan Waktu Pick-Up (ETA)', val: '99.2%', color: 'bg-emerald-500' },
                      { label: 'Kepuasan Aroma & Kelembutan', val: '4.95 / 5.0', color: 'bg-primary' },
                      { label: 'Efisiensi Muatan Mesin Cuci', val: '88.0%', color: 'bg-indigo-500' },
                      { label: 'Ketepatan Waktu Kurir Antar', val: '97.5%', color: 'bg-amber-500' }
                    ].map((q, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold text-slate-600">
                          <span>{q.label}</span>
                          <span className="font-black text-slate-900">{q.val}</span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${q.color}`} style={{ width: q.val.includes('%') ? q.val : '98%' }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: INVENTORY & CHEMICAL SUPPLIES */}
          {selectedDashboardTab === 'inventory' && (
            <div className="space-y-7 max-w-7xl mx-auto animate-fade-in">
              {/* 1. Inventory Key Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Item Bahan</span>
                    <div className="p-2.5 bg-primary/10 text-primary rounded-2xl">
                      <Package className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{inventory.length} <span className="text-xs text-slate-400 font-bold">Jenis</span></div>
                  <p className="text-[11px] text-slate-400 font-semibold">Bahan kimia, kemasan & perlengkapan</p>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Valuasi Aset Stok</span>
                    <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                      <DollarSign className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">
                    Rp {(totalInventoryValuation || 0).toLocaleString('id-ID')}
                  </div>
                  <p className="text-[11px] text-emerald-600 font-bold">● Total nilai persediaan gerai</p>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Peringatan Stok</span>
                    <div className={`p-2.5 rounded-2xl ${lowStockCount > 0 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-slate-100 text-slate-400'}`}>
                      <AlertCircle className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
                    <span>{lowStockCount}</span>
                    {lowStockCount > 0 ? (
                      <span className="text-xs font-extrabold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-lg border border-rose-200">
                        Perlu Restock
                      </span>
                    ) : (
                      <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                        Stok Aman
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 font-semibold">Item di bawah batas minimum</p>
                </div>

                <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Mitra Supplier</span>
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                      <Truck className="w-5 h-5" />
                    </div>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900">{uniqueSuppliersCount} <span className="text-xs text-slate-400 font-bold">Distributor</span></div>
                  <p className="text-[11px] text-slate-400 font-semibold">Penyuplai bahan aktif</p>
                </div>
              </div>

              {/* 2. Control Bar: Filter, Search, Action */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/80 shadow-soft space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900">Daftar Stok Bahan & Perlengkapan</h3>
                    <p className="text-xs text-slate-400 font-semibold mt-0.5">
                      Pantau penggunaan deterjen, pelembut, parfum, plastik packing, dan hanger
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                    <button
                      onClick={() => exportInventoryToCSV(inventory)}
                      className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-750 font-black text-xs rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 transition-all"
                      title="Unduh Rekap Laporan Stok ke CSV"
                    >
                      <Download className="w-4 h-4 text-slate-600" />
                      <span>Unduh Laporan (.CSV)</span>
                    </button>
                    <button
                      onClick={() => setShowAddInventoryModal(true)}
                      className="px-4 py-2.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center gap-2 transition-all hover:scale-102"
                    >
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>+ Tambah Bahan Baru</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-slate-100 items-center justify-between">
                  {/* Category Filter Pills */}
                  <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
                    {[
                      { id: 'all', label: 'Semua Bahan' },
                      { id: 'Chemical', label: '🧼 Chemical & Deterjen' },
                      { id: 'Fragrance', label: '🧴 Parfum Laundry' },
                      { id: 'Packaging', label: '🛍️ Plastik Packing' },
                      { id: 'Hardware', label: '👔 Perlengkapan / Tag' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setInventoryCategoryFilter(cat.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                          inventoryCategoryFilter === cat.id
                            ? 'bg-slate-900 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={inventorySearchTerm}
                      onChange={(e) => setInventorySearchTerm(e.target.value)}
                      placeholder="Cari bahan / supplier..."
                      className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:border-primary focus:bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* 3. Inventory Items Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredInventory.map((item) => {
                  const stock = item.stock || 0;
                  const minStock = item.minStock || 10;
                  const isCritical = stock <= (minStock * 0.5);
                  const isLow = stock <= minStock;
                  const stockPct = Math.min(100, Math.round((stock / (minStock * 2.5)) * 100));
                  const valuation = stock * (item.costPerUnit || 0);

                  return (
                    <div 
                      key={item.id} 
                      className={`bg-white p-5 rounded-3xl border transition-all flex flex-col justify-between shadow-soft hover:shadow-soft-lg group ${
                        isCritical 
                          ? 'border-rose-300 ring-1 ring-rose-200/50' 
                          : isLow 
                          ? 'border-amber-300 ring-1 ring-amber-200/50' 
                          : 'border-slate-200/80 hover:border-slate-300'
                      }`}
                    >
                      <div className="space-y-4">
                        {/* Header & Category Badge */}
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 text-2xl flex items-center justify-center shadow-xs flex-shrink-0 group-hover:scale-105 transition-transform">
                              {item.icon || '📦'}
                            </div>
                            <div>
                              <h4 className="text-sm font-black text-slate-900 leading-snug">{item.name}</h4>
                              <span className="text-[10px] font-bold text-slate-400">{item.category} · SKU: {item.id}</span>
                            </div>
                          </div>

                          {isCritical ? (
                            <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-[10px] font-black rounded-lg border border-rose-200 animate-pulse">
                              Kritis
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-black rounded-lg border border-amber-200">
                              Menipis
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-lg border border-emerald-200">
                              Aman
                            </span>
                          )}
                        </div>

                        {/* Stock Level Progress */}
                        <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-150 space-y-2">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs font-bold text-slate-500">Sisa Stok:</span>
                            <span className="text-base font-black text-slate-900">
                              {stock.toLocaleString('id-ID')} <span className="text-xs font-bold text-slate-500">{item.unit}</span>
                            </span>
                          </div>

                          <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                isCritical 
                                  ? 'bg-rose-500' 
                                  : isLow 
                                  ? 'bg-amber-500' 
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.max(8, stockPct)}%` }}
                            ></div>
                          </div>

                          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 pt-0.5">
                            <span>Min: {minStock} {item.unit}</span>
                            <span>Valuasi: Rp {valuation.toLocaleString('id-ID')}</span>
                          </div>
                        </div>

                        {/* Metadata Details */}
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between text-slate-500">
                            <span className="font-semibold">Harga Beli:</span>
                            <span className="font-extrabold text-slate-800">Rp {(item.costPerUnit || 0).toLocaleString('id-ID')} / {item.unit}</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span className="font-semibold">Supplier:</span>
                            <span className="font-extrabold text-slate-800 truncate max-w-[150px]">{item.supplier || '-'}</span>
                          </div>
                          <div className="flex justify-between text-slate-500">
                            <span className="font-semibold">Restock Terakhir:</span>
                            <span className="font-extrabold text-slate-800">{item.lastRestock || '-'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedInventoryToRestock(item);
                            setRestockQty(10);
                            setRestockCost(item.costPerUnit || '');
                          }}
                          className="flex-1 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white rounded-xl font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-98"
                        >
                          <Plus className="w-3.5 h-3.5 stroke-[3]" />
                          <span>+ Restock</span>
                        </button>
                        
                        <button
                          onClick={() => {
                            setEditInventoryForm(item);
                            setSelectedInventoryToEdit(item);
                          }}
                          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-black text-xs transition-all"
                          title="Edit Bahan"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => onDeleteInventoryItem(item.id)}
                          className="p-2.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl font-black text-xs transition-all"
                          title="Hapus Item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredInventory.length === 0 && (
                <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                  <Package className="w-12 h-12 text-slate-300 mx-auto" />
                  <h4 className="text-base font-black text-slate-800">Tidak ada bahan yang sesuai</h4>
                  <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
                    Coba ganti kata kunci pencarian atau pilih kategori bahan lainnya.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 10: GAJI & KOMISI KARYAWAN (PAYROLL) */}
          {selectedDashboardTab === 'payroll' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Top 4 KPI Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Payroll Bulan Ini</p>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                      Rp {(totalPayrollCost / 1000000).toFixed(2)} Jt
                    </h3>
                    <p className="text-[10px] text-emerald-600 font-bold">● {staffList.length} Staf Aktif</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-xs">
                    💵
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Komisi Kinerja</p>
                    <h3 className="text-xl sm:text-2xl font-black text-primary">
                      Rp {totalCommissionsPaid.toLocaleString('id-ID')}
                    </h3>
                    <p className="text-[10px] text-slate-400 font-semibold">Berdasarkan Kg & Trip</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-primary flex items-center justify-center text-xl shadow-xs">
                    ⚡
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Volume Kerja</p>
                    <h3 className="text-xl sm:text-2xl font-black text-indigo-700">
                      {Math.round(totalWashedAndIronedKg)} Kg
                    </h3>
                    <p className="text-[10px] text-indigo-500 font-bold">+{allOrdersList.length} Trip Kurir</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-xl shadow-xs">
                    🧺
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Karyawan Terproduktif</p>
                    <h3 className="text-base sm:text-lg font-black text-amber-700 truncate max-w-[130px]">
                      {topPerformer?.name?.split(' ')[0] || 'Siti'}
                    </h3>
                    <p className="text-[10px] text-amber-600 font-bold">{topPerformer?.unitsProcessed || 0} {topPerformer?.unitLabel}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shadow-xs">
                    🏆
                  </div>
                </div>
              </div>

              {/* Filter & Actions Bar */}
              <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                {/* Role Pills */}
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { id: 'all', label: 'Semua Karyawan' },
                    { id: 'washer', label: '🧼 Operator Cuci' },
                    { id: 'ironer', label: '🔌 Staf Setrika' },
                    { id: 'courier', label: '🚚 Kurir Driver' },
                    { id: 'admin', label: '💼 Kasir & SPV' },
                  ].map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setStaffRoleFilter(role.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                        staffRoleFilter === role.id
                          ? 'bg-primary text-white shadow-clay-sm'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>

                {/* Search & Export Button */}
                <div className="flex items-center gap-2.5 w-full md:w-auto">
                  <div className="relative flex-1 md:w-56">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={staffSearchTerm}
                      onChange={(e) => setStaffSearchTerm(e.target.value)}
                      placeholder="Cari nama karyawan..."
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-primary"
                    />
                  </div>

                  <button
                    onClick={() => exportPayrollToCSV(payrollRecords)}
                    className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs shadow-xs flex items-center gap-1.5 transition-all"
                    title="Unduh Rekap Gaji Karyawan (.CSV)"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Staff Payroll Table */}
              <div className="bg-white rounded-3xl border border-slate-200/80 shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase font-black tracking-wider text-[10px]">
                        <th className="py-4 px-5">Karyawan</th>
                        <th className="py-4 px-5">Peran / Jabatan</th>
                        <th className="py-4 px-5">Hari Kerja</th>
                        <th className="py-4 px-5">Kinerja (Volume)</th>
                        <th className="py-4 px-5">Gaji Pokok</th>
                        <th className="py-4 px-5">Komisi Kinerja</th>
                        <th className="py-4 px-5">Uang Makan</th>
                        <th className="py-4 px-5">Total Gaji Bersih</th>
                        <th className="py-4 px-5 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-semibold">
                      {filteredPayrollRecords.map((staff) => (
                        <tr key={staff.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-primary to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                                {staff.avatar || staff.name.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-extrabold text-slate-850">{staff.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{staff.phone || staff.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-[11px] font-bold">
                              {staff.role}
                            </span>
                          </td>
                          <td className="py-4 px-5 text-slate-700">
                            {staff.daysWorked} Hari
                          </td>
                          <td className="py-4 px-5">
                            <div className="space-y-0.5">
                              <span className="font-black text-slate-850 text-xs">{staff.unitsProcessed} {staff.unitLabel}</span>
                              <p className="text-[10px] text-slate-400">@ Rp {staff.commissionRate.toLocaleString('id-ID')}/{staff.unitLabel}</p>
                            </div>
                          </td>
                          <td className="py-4 px-5 text-slate-700">
                            Rp {staff.baseSalary.toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-5 font-black text-emerald-600">
                            +Rp {staff.commissionTotal.toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-5 text-slate-700">
                            +Rp {staff.totalMeal.toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-5 font-black text-sm text-primary">
                            Rp {staff.netSalary.toLocaleString('id-ID')}
                          </td>
                          <td className="py-4 px-5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedStaffPayslip(staff)}
                                className="px-2.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl font-black text-[11px] transition-all flex items-center gap-1 border border-emerald-200 shadow-xs"
                                title="Lihat & Cetak Slip Gaji"
                              >
                                <FileText className="w-3 h-3" />
                                <span>Slip Gaji</span>
                              </button>
                              <button
                                onClick={() => {
                                  setEditStaffForm(staff);
                                  setSelectedStaffToEdit(staff);
                                }}
                                className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all"
                                title="Edit Karyawan"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => onDeleteStaff(staff.id)}
                                className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl transition-all"
                                title="Hapus Karyawan"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 11: ULASAN PELANGGAN & RESOLUSI CS */}
          {selectedDashboardTab === 'feedback' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Top 4 KPI Metrics */}
              {(() => {
                const avgCSAT = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '5.0';
                const pendingCount = reviews.filter(r => r.status === 'pending_compensation' || r.rating < 3).length;
                const fiveStarCount = reviews.filter(r => r.rating === 5).length;
                const totalSatisfactionPercent = reviews.length ? Math.round((reviews.filter(r => r.rating >= 4).length / reviews.length) * 100) : 100;

                const filteredReviews = reviews.filter(r => {
                  const matchFilter = feedbackFilter === 'all' 
                    ? true 
                    : feedbackFilter === 'pending' 
                      ? r.status === 'pending_compensation' || r.rating < 3
                      : r.rating === 5;
                  const matchSearch = r.customerName?.toLowerCase().includes(feedbackSearchTerm.toLowerCase()) ||
                                      r.comment?.toLowerCase().includes(feedbackSearchTerm.toLowerCase()) ||
                                      r.orderId?.toLowerCase().includes(feedbackSearchTerm.toLowerCase());
                  return matchFilter && matchSearch;
                });

                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Skor CSAT Rata-Rata</p>
                          <h3 className="text-xl sm:text-2xl font-black text-amber-500 flex items-center gap-1.5">
                            <span>⭐ {avgCSAT}</span>
                            <span className="text-xs text-slate-400 font-semibold">/ 5.0</span>
                          </h3>
                          <p className="text-[10px] text-emerald-600 font-bold">● {totalSatisfactionPercent}% Pelanggan Puas</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center text-xl shadow-xs">
                          ⭐
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Ulasan Masuk</p>
                          <h3 className="text-xl sm:text-2xl font-black text-slate-900">
                            {reviews.length} Ulasan
                          </h3>
                          <p className="text-[10px] text-slate-400 font-semibold">Dari Pelanggan Terverifikasi</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-sky-50 text-primary flex items-center justify-center text-xl shadow-xs">
                          💬
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Ulasan 5 Bintang</p>
                          <h3 className="text-xl sm:text-2xl font-black text-emerald-600">
                            {fiveStarCount} Ulasan
                          </h3>
                          <p className="text-[10px] text-emerald-600 font-bold">🌟 Layanan Istimewa</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-xl shadow-xs">
                          🏆
                        </div>
                      </div>

                      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-soft flex items-center justify-between">
                        <div className="space-y-1">
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Perlu Tindak Lanjut CS</p>
                          <h3 className="text-xl sm:text-2xl font-black text-rose-600">
                            {pendingCount} Keluhan
                          </h3>
                          <p className="text-[10px] text-rose-500 font-bold">{pendingCount > 0 ? '⚠️ Butuh Voucher Kompensasi' : '✓ Semua Ditangani'}</p>
                        </div>
                        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center text-xl shadow-xs">
                          🚨
                        </div>
                      </div>
                    </div>

                    {/* Filter & Search Bar */}
                    <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="flex flex-wrap gap-1.5">
                        {[
                          { id: 'all', label: `Semua Ulasan (${reviews.length})` },
                          { id: 'pending', label: `⚠️ Perlu Kompensasi (${pendingCount})` },
                          { id: '5star', label: `🌟 5 Bintang (${fiveStarCount})` },
                        ].map((f) => (
                          <button
                            key={f.id}
                            onClick={() => setFeedbackFilter(f.id)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                              feedbackFilter === f.id
                                ? 'bg-primary text-white shadow-clay-sm'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                          >
                            {f.label}
                          </button>
                        ))}
                      </div>

                      <div className="relative w-full md:w-64">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={feedbackSearchTerm}
                          onChange={(e) => setFeedbackSearchTerm(e.target.value)}
                          placeholder="Cari ulasan atau nama pelanggan..."
                          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    {/* Reviews List */}
                    <div className="space-y-4">
                      {filteredReviews.map((rev) => {
                        const isPending = rev.status === 'pending_compensation' || rev.rating < 3;
                        return (
                          <div
                            key={rev.id}
                            className={`bg-white p-5 rounded-3xl border transition-all shadow-soft space-y-3.5 ${
                              isPending ? 'border-rose-300 ring-2 ring-rose-100 bg-rose-50/20' : 'border-slate-200/80'
                            }`}
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-primary text-white font-black text-xs flex items-center justify-center shadow-xs">
                                  {rev.customerName.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="text-xs sm:text-sm font-black text-slate-900">{rev.customerName}</h4>
                                    <span className="text-[10px] text-slate-400 font-mono">({rev.orderId})</span>
                                  </div>
                                  <p className="text-[11px] text-slate-400 font-semibold">{rev.serviceName} · {rev.date}</p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200">
                                  <span className="text-sm font-black text-amber-600">⭐ {rev.rating}.0</span>
                                </div>
                                {isPending ? (
                                  <span className="px-2.5 py-1 bg-rose-100 text-rose-700 text-[10px] font-black rounded-lg border border-rose-200">
                                    ⚠️ Perlu Follow-up
                                  </span>
                                ) : (
                                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-lg border border-emerald-200">
                                    ✓ Puas / Selesai
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Comment & Tags */}
                            <div className="space-y-2">
                              <p className="text-xs sm:text-sm text-slate-750 font-semibold leading-relaxed">
                                "{rev.comment}"
                              </p>

                              {rev.tags?.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                  {rev.tags.map((tag, idx) => (
                                    <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-md">
                                      #{tag}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>

                            {/* CS Action Bar for Low Ratings */}
                            {isPending && (
                              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                                <div>
                                  <h5 className="text-xs font-black text-rose-900">🚨 Keluhan Pelanggan Terdeteksi</h5>
                                  <p className="text-[11px] text-rose-700 font-semibold">
                                    Kirimkan pesan permohonan maaf dan voucher diskon kompensasi 20% (Kode: <strong>MAAF20</strong>) langsung ke WhatsApp pelanggan.
                                  </p>
                                </div>

                                <a
                                  href={getWhatsAppCompensationUrl(rev)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => onResolveReview(rev.id)}
                                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black text-xs shadow-xs flex items-center gap-1.5 whitespace-nowrap transition-all"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 fill-current" />
                                  <span>Kirim Voucher WA (MAAF20)</span>
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {filteredReviews.length === 0 && (
                        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                          <Sparkles className="w-12 h-12 text-slate-300 mx-auto" />
                          <h4 className="text-base font-black text-slate-800">Tidak ada ulasan yang sesuai</h4>
                          <p className="text-xs text-slate-400 font-semibold max-w-sm mx-auto">
                            Coba ubah kata kunci pencarian atau pilih filter ulasan lainnya.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>
          )}
        </main>
      </div>

      {/* ========================================================================= */}
      {/* ALL CRUD MODALS: SERVICES, PROMOS, COURIERS, CUSTOMERS, MACHINES, RECEIPT */}
      {/* ========================================================================= */}

      {/* MODAL 1: ADD SERVICE (CREATE) */}
      {showAddServiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Tambah Layanan Baru (CMS)</h3>
              <button onClick={() => setShowAddServiceModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nama Layanan *</label>
                <input
                  type="text"
                  required
                  value={newServiceForm.name}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, name: e.target.value })}
                  placeholder="Contoh: Dry Clean Jas & Blazer"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-black text-slate-500">Tarif Harga (Rp) *</label>
                  <input
                    type="number"
                    value={newServiceForm.price}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, price: e.target.value })}
                    placeholder="35000"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Satuan</label>
                  <select
                    value={newServiceForm.unit}
                    onChange={(e) => setNewServiceForm({ ...newServiceForm, unit: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  >
                    <option value="Kg">Kg</option>
                    <option value="Pc">Pc</option>
                    <option value="Pasang">Pasang</option>
                    <option value="Meter">Meter</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Deskripsi Singkat</label>
                <input
                  type="text"
                  value={newServiceForm.desc}
                  onChange={(e) => setNewServiceForm({ ...newServiceForm, desc: e.target.value })}
                  placeholder="Pencucian khusus dengan perlakuan premium"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold"
                />
              </div>

              <button
                onClick={() => {
                  if (!newServiceForm.name || !newServiceForm.price) return;
                  onAddService({
                    id: `srv_${Date.now()}`,
                    name: newServiceForm.name,
                    price: Number(newServiceForm.price),
                    unit: newServiceForm.unit,
                    desc: newServiceForm.desc || 'Layanan laundry premium',
                    icon: newServiceForm.icon || '🧺',
                    active: true
                  });
                  setShowAddServiceModal(false);
                  setNewServiceForm({ name: '', price: '', unit: 'Kg', icon: '🧺', desc: '' });
                }}
                className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm"
              >
                Simpan & Publikasikan ke Aplikasi
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT SERVICE (UPDATE) */}
      {selectedServiceToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Edit Layanan: {editServiceForm.name}</h3>
              <button onClick={() => setSelectedServiceToEdit(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nama Layanan</label>
                <input
                  type="text"
                  value={editServiceForm.name}
                  onChange={(e) => setEditServiceForm({ ...editServiceForm, name: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-black text-slate-500">Tarif Harga (Rp)</label>
                  <input
                    type="number"
                    value={editServiceForm.price}
                    onChange={(e) => setEditServiceForm({ ...editServiceForm, price: Number(e.target.value) })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Satuan</label>
                  <select
                    value={editServiceForm.unit}
                    onChange={(e) => setEditServiceForm({ ...editServiceForm, unit: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  >
                    <option value="Kg">Kg</option>
                    <option value="Pc">Pc</option>
                    <option value="Pasang">Pasang</option>
                    <option value="Meter">Meter</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Deskripsi</label>
                <input
                  type="text"
                  value={editServiceForm.desc}
                  onChange={(e) => setEditServiceForm({ ...editServiceForm, desc: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold"
                />
              </div>

              <button
                onClick={() => {
                  onEditService(editServiceForm);
                  setSelectedServiceToEdit(null);
                }}
                className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm"
              >
                Simpan Perubahan Layanan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD PROMO (CREATE) */}
      {showAddPromoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Buat Kupon Promo Baru</h3>
              <button onClick={() => setShowAddPromoModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Kode Kupon (Huruf Kapital) *</label>
                <input
                  type="text"
                  value={newPromoForm.code}
                  onChange={(e) => setNewPromoForm({ ...newPromoForm, code: e.target.value.toUpperCase() })}
                  placeholder="Contoh: HEMAT30"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-black tracking-wider"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-black text-slate-500">Judul Promo *</label>
                  <input
                    type="text"
                    value={newPromoForm.title}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, title: e.target.value })}
                    placeholder="Diskon 30% Spesial"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Diskon (%)</label>
                  <input
                    type="number"
                    value={newPromoForm.discountPct}
                    onChange={(e) => setNewPromoForm({ ...newPromoForm, discountPct: e.target.value })}
                    placeholder="30"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Deskripsi Promo</label>
                <input
                  type="text"
                  value={newPromoForm.desc}
                  onChange={(e) => setNewPromoForm({ ...newPromoForm, desc: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold"
                />
              </div>
              <button
                onClick={() => {
                  if (!newPromoForm.code || !newPromoForm.title) return;
                  onAddPromo({
                    id: `p_${Date.now()}`,
                    code: newPromoForm.code,
                    title: newPromoForm.title,
                    desc: newPromoForm.desc,
                    tag: newPromoForm.tag || 'Spesial',
                    discountPct: Number(newPromoForm.discountPct),
                    color: 'from-purple-500 to-indigo-600',
                    active: true
                  });
                  setShowAddPromoModal(false);
                  setNewPromoForm({ code: '', title: '', desc: 'Diskon spesial pelanggan.', tag: 'Spesial', discountPct: '20' });
                }}
                className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm"
              >
                Simpan & Aktifkan Kupon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: EDIT PROMO (UPDATE) */}
      {selectedPromoToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Edit Kupon: {editPromoForm.code}</h3>
              <button onClick={() => setSelectedPromoToEdit(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Kode Kupon</label>
                <input
                  type="text"
                  value={editPromoForm.code}
                  onChange={(e) => setEditPromoForm({ ...editPromoForm, code: e.target.value.toUpperCase() })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-black"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2 space-y-1">
                  <label className="text-xs font-black text-slate-500">Judul Promo</label>
                  <input
                    type="text"
                    value={editPromoForm.title}
                    onChange={(e) => setEditPromoForm({ ...editPromoForm, title: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Diskon (%)</label>
                  <input
                    type="number"
                    value={editPromoForm.discountPct}
                    onChange={(e) => setEditPromoForm({ ...editPromoForm, discountPct: Number(e.target.value) })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Deskripsi</label>
                <input
                  type="text"
                  value={editPromoForm.desc}
                  onChange={(e) => setEditPromoForm({ ...editPromoForm, desc: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold"
                />
              </div>
              <button
                onClick={() => {
                  onEditPromo(editPromoForm);
                  setSelectedPromoToEdit(null);
                }}
                className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm"
              >
                Simpan Perubahan Kupon
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD COURIER (CREATE) */}
      {showAddCourierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Tambah Driver Kurir Baru</h3>
              <button onClick={() => setShowAddCourierModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nama Lengkap Driver *</label>
                <input
                  type="text"
                  required
                  value={newCourierForm.name}
                  onChange={(e) => setNewCourierForm({ ...newCourierForm, name: e.target.value })}
                  placeholder="Contoh: Rian Hidayat"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nomor WhatsApp / HP *</label>
                <input
                  type="text"
                  required
                  value={newCourierForm.phone}
                  onChange={(e) => setNewCourierForm({ ...newCourierForm, phone: e.target.value })}
                  placeholder="0812-xxxx-xxxx"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Kendaraan & Plat Nomor *</label>
                <input
                  type="text"
                  required
                  value={newCourierForm.vehicle}
                  onChange={(e) => setNewCourierForm({ ...newCourierForm, vehicle: e.target.value })}
                  placeholder="Contoh: Honda Beat (B 5678 KLM)"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <button
                onClick={() => {
                  if (!newCourierForm.name || !newCourierForm.phone) return;
                  onAddCourier({
                    id: `c_${Date.now()}`,
                    name: newCourierForm.name,
                    phone: newCourierForm.phone,
                    vehicle: newCourierForm.vehicle,
                    rating: '5.0 ⭐',
                    avatar: newCourierForm.name.slice(0, 2).toUpperCase(),
                    active: true,
                    status: 'Siaga'
                  });
                  setShowAddCourierModal(false);
                  setNewCourierForm({ name: '', phone: '', vehicle: 'Honda Vario (B 1234 XYZ)', avatar: 'DR' });
                }}
                className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm"
              >
                Simpan & Daftarkan Driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: EDIT COURIER (UPDATE) */}
      {selectedCourierToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Edit Driver: {editCourierForm.name}</h3>
              <button onClick={() => setSelectedCourierToEdit(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nama Driver</label>
                <input
                  type="text"
                  value={editCourierForm.name}
                  onChange={(e) => setEditCourierForm({ ...editCourierForm, name: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nomor WhatsApp</label>
                <input
                  type="text"
                  value={editCourierForm.phone}
                  onChange={(e) => setEditCourierForm({ ...editCourierForm, phone: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Kendaraan & Plat</label>
                <input
                  type="text"
                  value={editCourierForm.vehicle}
                  onChange={(e) => setEditCourierForm({ ...editCourierForm, vehicle: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <button
                onClick={() => {
                  onEditCourier(editCourierForm);
                  setSelectedCourierToEdit(null);
                }}
                className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm"
              >
                Simpan Perubahan Driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: ADD CUSTOMER MEMBER (CREATE) */}
      {showAddCustomerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-soft-lg p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Daftarkan Member Pelanggan Baru</h3>
              <button onClick={() => setShowAddCustomerModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nama Pelanggan *</label>
                <input
                  type="text"
                  required
                  value={newCustomerForm.name}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, name: e.target.value })}
                  placeholder="Contoh: Farhan Pratama"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">No. WhatsApp *</label>
                  <input
                    type="text"
                    required
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Email</label>
                  <input
                    type="email"
                    value={newCustomerForm.email}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                    placeholder="email@domain.com"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Tier Member</label>
                  <select
                    value={newCustomerForm.tier}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, tier: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  >
                    <option value="Member Bronze">🥉 Member Bronze</option>
                    <option value="Member Silver">🥈 Member Silver</option>
                    <option value="VIP Gold">🥇 VIP Gold</option>
                    <option value="Platinum Sultan">💎 Platinum Sultan</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Saldo Awal (Rp)</label>
                  <input
                    type="number"
                    value={newCustomerForm.balance}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, balance: Number(e.target.value) })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Poin Awal</label>
                  <input
                    type="number"
                    value={newCustomerForm.points}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, points: Number(e.target.value) })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Total Akumulasi Belanja (Rp)</label>
                  <input
                    type="number"
                    value={newCustomerForm.totalSpent || 0}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, totalSpent: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Preferensi Khusus / Parfum</label>
                  <input
                    type="text"
                    value={newCustomerForm.preferences || ''}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, preferences: e.target.value })}
                    placeholder="Contoh: Pewangi Lavender, Jangan Disikat"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Alamat Lengkap</label>
                <input
                  type="text"
                  value={newCustomerForm.address}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                  placeholder="Jl. Thamrin No. 10, Jakarta"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold"
                />
              </div>

              <button
                onClick={() => {
                  if (!newCustomerForm.name || !newCustomerForm.phone) return;
                  const calculatedTier = calculateTier(newCustomerForm.totalSpent || 0);
                  onAddCustomer({
                    id: `CUST-00${customers.length + 1}`,
                    name: newCustomerForm.name,
                    email: newCustomerForm.email || 'customer@laundrymail.com',
                    phone: newCustomerForm.phone,
                    address: newCustomerForm.address || 'Jakarta',
                    tier: newCustomerForm.tier || calculatedTier.name,
                    balance: newCustomerForm.balance || 0,
                    points: newCustomerForm.points || 0,
                    totalSpent: newCustomerForm.totalSpent || 0,
                    preferences: newCustomerForm.preferences || 'Standar tanpa catatan khusus',
                    lastOrderDate: 'Hari ini',
                    totalOrders: 0
                  });
                  setShowAddCustomerModal(false);
                  setNewCustomerForm({ name: '', email: '', phone: '', address: 'Jakarta', tier: 'Member Bronze', balance: 0, points: 100, totalSpent: 0, preferences: '' });
                }}
                className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm"
              >
                Simpan & Daftarkan Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 8: EDIT CUSTOMER (UPDATE & ADJUST WALLET/POINTS/PREFERENCES) */}
      {selectedCustomerToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-soft-lg p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Edit Member: {editCustomerForm.name}</h3>
              <button onClick={() => setSelectedCustomerToEdit(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nama Pelanggan</label>
                <input
                  type="text"
                  value={editCustomerForm.name}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, name: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">No. WhatsApp</label>
                  <input
                    type="text"
                    value={editCustomerForm.phone}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, phone: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Tier Member</label>
                  <select
                    value={editCustomerForm.tier}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, tier: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  >
                    <option value="Member Bronze">🥉 Member Bronze</option>
                    <option value="Member Silver">🥈 Member Silver</option>
                    <option value="VIP Gold">🥇 VIP Gold</option>
                    <option value="Platinum Sultan">💎 Platinum Sultan</option>
                  </select>
                </div>
              </div>

              {/* Adjust Balance, Points & Total Spent */}
              <div className="p-4 bg-sky-50 rounded-2xl border border-sky-100 grid grid-cols-3 gap-2.5">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-primary">Saldo Wallet (Rp)</label>
                  <input
                    type="number"
                    value={editCustomerForm.balance}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, balance: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-sky-200 rounded-xl text-xs font-black text-slate-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-amber-700">Reward Points</label>
                  <input
                    type="number"
                    value={editCustomerForm.points}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, points: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-amber-200 rounded-xl text-xs font-black text-amber-900"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-indigo-700">Total Belanja (Rp)</label>
                  <input
                    type="number"
                    value={editCustomerForm.totalSpent || 0}
                    onChange={(e) => setEditCustomerForm({ ...editCustomerForm, totalSpent: Number(e.target.value) })}
                    className="w-full p-2.5 bg-white border border-indigo-200 rounded-xl text-xs font-black text-indigo-900"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Preferensi Khusus & Catatan Alergi</label>
                <input
                  type="text"
                  value={editCustomerForm.preferences || ''}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, preferences: e.target.value })}
                  placeholder="Contoh: Pewangi Lavender Bloom, Kemeja Digantung Hanger"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Alamat</label>
                <input
                  type="text"
                  value={editCustomerForm.address}
                  onChange={(e) => setEditCustomerForm({ ...editCustomerForm, address: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold"
                />
              </div>

              <button
                onClick={() => {
                  onEditCustomer(editCustomerForm);
                  setSelectedCustomerToEdit(null);
                }}
                className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm"
              >
                Simpan Perubahan Data Member
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 9: DETAIL SPEK MESIN */}
      {selectedMachineToDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-soft-lg p-6 sm:p-8 space-y-6 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-start pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2.5xl bg-sky-50 text-primary flex items-center justify-center text-3xl shadow-clay-sm">
                  {selectedMachineToDetail.type === 'washer' ? '🧼' : '💨'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-black text-slate-900">{selectedMachineToDetail.name}</h3>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 font-mono text-[10px] font-black rounded">
                      {selectedMachineToDetail.id}
                    </span>
                  </div>
                  <p className="text-xs font-bold text-primary">{selectedMachineToDetail.brand || 'Komersial Pro'}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMachineToDetail(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Spesifikasi Teknis & Hardware</h4>
              <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2.5xl border border-slate-200 text-xs font-semibold">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Model Perangkat:</span>
                  <span className="text-slate-900 font-black">{selectedMachineToDetail.modelNo || 'Commercial Standard'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Serial Number (SN):</span>
                  <span className="text-slate-900 font-mono font-bold">{selectedMachineToDetail.serialNumber || 'SN-2024-88910'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Tipe Daya & Mesin:</span>
                  <span className="text-slate-900 font-bold">{selectedMachineToDetail.powerType || 'Listrik 220V'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Kapasitas & Putaran:</span>
                  <span className="text-slate-900 font-bold">{selectedMachineToDetail.capacity} · {selectedMachineToDetail.spinSpeed || '1200 RPM'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">IP Gateway IoT:</span>
                  <span className="text-primary font-mono font-black">{selectedMachineToDetail.ipAddress || '192.168.1.101'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Kesehatan Filter:</span>
                  <span className="text-emerald-600 font-black">{selectedMachineToDetail.healthScore || 98}% (Bersih)</span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider">Riwayat Pemakaian & Servis</h4>
                <div className="flex justify-between items-center text-xs p-3 bg-white border border-slate-200 rounded-2xl">
                  <span className="text-slate-600 font-semibold">Total Siklus Pengerjaan:</span>
                  <span className="font-black text-slate-900">{selectedMachineToDetail.totalCycles || 140} Siklus</span>
                </div>
                <div className="flex justify-between items-center text-xs p-3 bg-white border border-slate-200 rounded-2xl">
                  <span className="text-slate-600 font-semibold">Tanggal Instalasi:</span>
                  <span className="font-bold text-slate-800">{selectedMachineToDetail.installationDate || 'Januari 2024'}</span>
                </div>
                <div className="flex justify-between items-center text-xs p-3 bg-white border border-slate-200 rounded-2xl">
                  <span className="text-slate-600 font-semibold">Servis Berkala Terakhir:</span>
                  <span className="font-bold text-slate-800">{selectedMachineToDetail.lastServiceDate || 'Mei 2024'}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  setEditMachineForm(selectedMachineToDetail);
                  setSelectedMachineToEdit(selectedMachineToDetail);
                  setSelectedMachineToDetail(null);
                }}
                className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center justify-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit Spesifikasi Mesin</span>
              </button>
              <button
                onClick={() => setSelectedMachineToDetail(null)}
                className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-2xl"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 10: EDIT MESIN */}
      {selectedMachineToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-soft-lg p-6 sm:p-8 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Edit Spesifikasi Unit Mesin</h3>
                <p className="text-xs text-slate-400 font-semibold">ID Perangkat: {editMachineForm.id}</p>
              </div>
              <button onClick={() => setSelectedMachineToEdit(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nama Mesin</label>
                <input
                  type="text"
                  value={editMachineForm.name}
                  onChange={(e) => setEditMachineForm({ ...editMachineForm, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Merk / Produsen</label>
                  <input
                    type="text"
                    value={editMachineForm.brand}
                    onChange={(e) => setEditMachineForm({ ...editMachineForm, brand: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Model Perangkat</label>
                  <input
                    type="text"
                    value={editMachineForm.modelNo}
                    onChange={(e) => setEditMachineForm({ ...editMachineForm, modelNo: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Serial Number (SN)</label>
                  <input
                    type="text"
                    value={editMachineForm.serialNumber}
                    onChange={(e) => setEditMachineForm({ ...editMachineForm, serialNumber: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Kapasitas Muatan</label>
                  <select
                    value={editMachineForm.capacity}
                    onChange={(e) => setEditMachineForm({ ...editMachineForm, capacity: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  >
                    <option value="10 Kg">10 Kg</option>
                    <option value="12 Kg">12 Kg</option>
                    <option value="15 Kg">15 Kg</option>
                    <option value="20 Kg">20 Kg (Jumbo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Tipe Daya</label>
                  <input
                    type="text"
                    value={editMachineForm.powerType}
                    onChange={(e) => setEditMachineForm({ ...editMachineForm, powerType: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">IP Gateway IoT</label>
                  <input
                    type="text"
                    value={editMachineForm.ipAddress}
                    onChange={(e) => setEditMachineForm({ ...editMachineForm, ipAddress: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onEditMachine(editMachineForm);
                setSelectedMachineToEdit(null);
              }}
              className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm"
            >
              Simpan Perubahan Spesifikasi
            </button>
          </div>
        </div>
      )}

      {/* MODAL 11: ADD MESIN */}
      {showAddMachineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-soft-lg p-6 sm:p-8 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Tambah Unit Mesin IoT Baru</h3>
                <p className="text-xs text-slate-400 font-semibold">Integrasikan hardware mesin baru ke sistem monitoring</p>
              </div>
              <button onClick={() => setShowAddMachineModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nama Unit Mesin *</label>
                <input
                  type="text"
                  required
                  value={newMachineForm.name}
                  onChange={(e) => setNewMachineForm({ ...newMachineForm, name: e.target.value })}
                  placeholder="Contoh: Mesin Cuci Front Load 3"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Tipe Perangkat *</label>
                  <select
                    value={newMachineForm.type}
                    onChange={(e) => setNewMachineForm({ ...newMachineForm, type: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  >
                    <option value="washer">Mesin Cuci (Washer)</option>
                    <option value="dryer">Mesin Pengering (Dryer)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Kapasitas Muatan *</label>
                  <select
                    value={newMachineForm.capacity}
                    onChange={(e) => setNewMachineForm({ ...newMachineForm, capacity: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  >
                    <option value="10 Kg">10 Kg</option>
                    <option value="12 Kg">12 Kg</option>
                    <option value="15 Kg">15 Kg</option>
                    <option value="20 Kg">20 Kg (Jumbo)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Merk / Brand Mesin</label>
                  <select
                    value={newMachineForm.brand}
                    onChange={(e) => setNewMachineForm({ ...newMachineForm, brand: e.target.value })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  >
                    <option value="LG Commercial Pro">LG Commercial Pro</option>
                    <option value="Speed Queen Heavy Duty">Speed Queen Heavy Duty</option>
                    <option value="Maytag Commercial">Maytag Commercial</option>
                    <option value="Electrolux Professional">Electrolux Professional</option>
                    <option value="Huebsch Industrial">Huebsch Industrial</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Model Seri</label>
                  <input
                    type="text"
                    value={newMachineForm.modelNo}
                    onChange={(e) => setNewMachineForm({ ...newMachineForm, modelNo: e.target.value })}
                    placeholder="Contoh: Titan-C Pro"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Serial Number (SN)</label>
                  <input
                    type="text"
                    value={newMachineForm.serialNumber}
                    onChange={(e) => setNewMachineForm({ ...newMachineForm, serialNumber: e.target.value })}
                    placeholder="SN-2024-XXXXX"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">IP Gateway IoT</label>
                  <input
                    type="text"
                    value={newMachineForm.ipAddress}
                    onChange={(e) => setNewMachineForm({ ...newMachineForm, ipAddress: e.target.value })}
                    placeholder="192.168.1.xxx"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-mono font-bold"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                if (!newMachineForm.name) return;
                const newId = newMachineForm.type === 'washer' 
                  ? `MC-0${machines.filter(m => m.type === 'washer').length + 1}` 
                  : `DR-0${machines.filter(m => m.type === 'dryer').length + 1}`;

                onAddMachine({
                  id: newId,
                  name: newMachineForm.name,
                  brand: newMachineForm.brand,
                  modelNo: newMachineForm.modelNo || 'Commercial Pro',
                  serialNumber: newMachineForm.serialNumber || `SN-2024-${Math.floor(1000 + Math.random() * 9000)}`,
                  type: newMachineForm.type,
                  powerType: newMachineForm.type === 'washer' ? 'Inverter Direct Drive (220V)' : 'Gas LPG High Pressure',
                  spinSpeed: newMachineForm.type === 'washer' ? '1200 RPM' : 'Airflow 240 CFM',
                  capacity: newMachineForm.capacity,
                  installationDate: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date()),
                  lastServiceDate: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date()),
                  ipAddress: newMachineForm.ipAddress || '192.168.1.109',
                  status: 'idle',
                  assignedOrderId: null,
                  programName: '-',
                  tempC: '-',
                  timeLeft: 0,
                  totalDuration: 0,
                  healthScore: 100,
                  totalCycles: 0
                });
                setShowAddMachineModal(false);
                setNewMachineForm({
                  name: '',
                  brand: 'LG Commercial Pro',
                  modelNo: 'FH069FD3F Titan-C',
                  serialNumber: '',
                  type: 'washer',
                  capacity: '10 Kg',
                  powerType: 'Inverter Direct Drive (220V)',
                  spinSpeed: '1200 RPM',
                  ipAddress: '192.168.1.105'
                });
              }}
              className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm"
            >
              Simpan & Hubungkan ke IoT Hub
            </button>
          </div>
        </div>
      )}

      {/* MODAL 12: START MESIN */}
      {selectedMachineToStart && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-soft-lg p-6 sm:p-7 space-y-6 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{selectedMachineToStart.type === 'washer' ? '🧼' : '💨'}</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Jalankan {selectedMachineToStart.name}</h3>
                  <p className="text-xs text-slate-400 font-semibold">{selectedMachineToStart.brand} · {selectedMachineToStart.capacity}</p>
                </div>
              </div>
              <button onClick={() => setSelectedMachineToStart(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                1. Tautkan Pesanan Pelanggan (Otomatis Sync)
              </label>
              <select
                value={startMachineOrderId}
                onChange={(e) => setStartMachineOrderId(e.target.value)}
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 focus:outline-none focus:border-primary"
              >
                <option value="">-- Jalankan Manual (Tanpa Tautan Order) --</option>
                {activeOrders.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.id} - {o.customerName} ({o.serviceName} · {o.amount} {o.unit} · {o.status})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2.5">
              <label className="text-xs font-black text-slate-500 uppercase tracking-wider">
                2. Pilih Program {selectedMachineToStart.type === 'washer' ? 'Pencucian' : 'Pengeringan'}
              </label>
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(selectedMachineToStart.type === 'washer' ? washerPrograms : dryerPrograms).map((prog) => {
                  const isSelected = startMachineProgram?.name === prog.name;
                  return (
                    <div
                      key={prog.name}
                      onClick={() => setStartMachineProgram(prog)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex justify-between items-center ${
                        isSelected
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-black text-slate-900">{prog.name}</h4>
                          <span className="px-2 py-0.5 bg-slate-200 text-slate-700 text-[10px] font-black rounded-md">
                            {prog.temp}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">{prog.desc}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-primary">{prog.duration} Menit</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <button
              onClick={() => {
                onStartMachine(selectedMachineToStart.id, startMachineOrderId, startMachineProgram);
                setSelectedMachineToStart(null);
              }}
              className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Mulai Berputar ({startMachineProgram.duration} Menit)</span>
            </button>
          </div>
        </div>
      )}

      {/* MODAL 13: PRINT STRUK */}
      {selectedReceiptOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-soft-lg p-6 space-y-5 text-slate-800 animate-scale-up border border-slate-200">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-xs font-black text-slate-400 uppercase tracking-wider">Struk Kasir POS</span>
              <button 
                onClick={() => setSelectedReceiptOrder(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="font-mono text-xs space-y-3 bg-[#FAFBFD] p-5 rounded-2xl border border-slate-200">
              <div className="text-center space-y-1">
                <p className="font-black text-base text-slate-900">🧼 LAUNDRYKU PRO</p>
                <p className="text-[10px] text-slate-500">Jl. Cempaka Putih Raya No. 42A</p>
                <p className="text-[10px] text-slate-500">WA: 0812-3456-7890</p>
              </div>

              <div className="border-t border-b border-dashed border-slate-300 py-2.5 space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>No. Nota:</span>
                  <span className="font-bold text-slate-900">{selectedReceiptOrder.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span>{selectedReceiptOrder.customerName || 'Aisyah Salsabila'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu:</span>
                  <span>{selectedReceiptOrder.orderTime || '15 Mei 2024'}</span>
                </div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex justify-between">
                  <span>{selectedReceiptOrder.serviceName} ({selectedReceiptOrder.amount} {selectedReceiptOrder.unit})</span>
                  <span>Rp {(selectedReceiptOrder.totalPrice || 50000).toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="border-t border-slate-300 pt-2 flex justify-between font-black text-xs">
                <span>TOTAL:</span>
                <span className="text-primary text-sm">Rp {(selectedReceiptOrder.totalPrice || 50000).toLocaleString('id-ID')}</span>
              </div>

              <div className="text-center pt-2 text-[10px] text-slate-400">
                Terima kasih atas kunjungan Anda!
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.print?.();
                  setSelectedReceiptOrder(null);
                }}
                className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Nota</span>
              </button>
              <a
                href={getWhatsAppShareUrl(selectedReceiptOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3.5 bg-emerald-500 hover:bg-emerald-600 active:scale-98 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center justify-center gap-2 transition-all text-center"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Kirim via WA</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 14: TAMBAH BAHAN BAKU BARU */}
      {showAddInventoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-6 sm:p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📦</span>
                <h3 className="text-base font-black text-slate-900">Tambah Bahan Baku Baru</h3>
              </div>
              <button onClick={() => setShowAddInventoryModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nama Bahan / Perlengkapan *</label>
                <input
                  type="text"
                  required
                  value={newInventoryForm.name}
                  onChange={(e) => setNewInventoryForm({ ...newInventoryForm, name: e.target.value })}
                  placeholder="Contoh: Deterjen Alkali Premium"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Kategori *</label>
                  <select
                    value={newInventoryForm.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      const icons = { Chemical: '🧼', Fragrance: '🧴', Packaging: '🛍️', Hardware: '👔' };
                      const units = { Chemical: 'Liter', Fragrance: 'Liter', Packaging: 'Lembar', Hardware: 'Pcs' };
                      setNewInventoryForm({
                        ...newInventoryForm,
                        category: cat,
                        icon: icons[cat] || '📦',
                        unit: units[cat] || 'Unit'
                      });
                    }}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  >
                    <option value="Chemical">🧼 Chemical & Deterjen</option>
                    <option value="Fragrance">🧴 Parfum Laundry</option>
                    <option value="Packaging">🛍️ Plastik Packing</option>
                    <option value="Hardware">👔 Hardware / Tag</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Satuan *</label>
                  <input
                    type="text"
                    required
                    value={newInventoryForm.unit}
                    onChange={(e) => setNewInventoryForm({ ...newInventoryForm, unit: e.target.value })}
                    placeholder="Liter / Lembar / Pcs"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Stok Awal</label>
                  <input
                    type="number"
                    min="0"
                    value={newInventoryForm.stock}
                    onChange={(e) => setNewInventoryForm({ ...newInventoryForm, stock: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Batas Min. Stok (Alert)</label>
                  <input
                    type="number"
                    min="1"
                    value={newInventoryForm.minStock}
                    onChange={(e) => setNewInventoryForm({ ...newInventoryForm, minStock: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Harga Beli / Unit (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={newInventoryForm.costPerUnit}
                    onChange={(e) => setNewInventoryForm({ ...newInventoryForm, costPerUnit: Number(e.target.value) })}
                    placeholder="15000"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Ikon Emoji</label>
                  <input
                    type="text"
                    value={newInventoryForm.icon}
                    onChange={(e) => setNewInventoryForm({ ...newInventoryForm, icon: e.target.value })}
                    placeholder="🧼"
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold text-center text-lg"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nama Supplier / Distributor</label>
                <input
                  type="text"
                  value={newInventoryForm.supplier}
                  onChange={(e) => setNewInventoryForm({ ...newInventoryForm, supplier: e.target.value })}
                  placeholder="Contoh: CV Kimia Bersih Abadi"
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <button
                onClick={() => {
                  if (!newInventoryForm.name) return alert('Nama bahan wajib diisi!');
                  const today = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date());
                  onAddInventoryItem({
                    id: `inv_${Date.now()}`,
                    ...newInventoryForm,
                    lastRestock: today
                  });
                  setShowAddInventoryModal(false);
                  setNewInventoryForm({
                    name: '',
                    category: 'Chemical',
                    stock: 20,
                    unit: 'Liter',
                    minStock: 10,
                    costPerUnit: 15000,
                    supplier: 'CV Kimia Bersih Abadi',
                    icon: '🧼'
                  });
                }}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm"
              >
                Simpan Bahan Baku
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 15: EDIT BAHAN BAKU */}
      {selectedInventoryToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-6 sm:p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900">Edit Data Bahan</h3>
              <button onClick={() => setSelectedInventoryToEdit(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nama Bahan *</label>
                <input
                  type="text"
                  required
                  value={editInventoryForm.name}
                  onChange={(e) => setEditInventoryForm({ ...editInventoryForm, name: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Kategori</label>
                  <select
                    value={editInventoryForm.category}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, category: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  >
                    <option value="Chemical">🧼 Chemical</option>
                    <option value="Fragrance">🧴 Fragrance</option>
                    <option value="Packaging">🛍️ Packaging</option>
                    <option value="Hardware">👔 Hardware</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Satuan</label>
                  <input
                    type="text"
                    value={editInventoryForm.unit}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, unit: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Sisa Stok Saat Ini</label>
                  <input
                    type="number"
                    min="0"
                    value={editInventoryForm.stock}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, stock: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Batas Min. Stok</label>
                  <input
                    type="number"
                    min="1"
                    value={editInventoryForm.minStock}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, minStock: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Harga Beli / Unit (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={editInventoryForm.costPerUnit}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, costPerUnit: Number(e.target.value) })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Supplier</label>
                  <input
                    type="text"
                    value={editInventoryForm.supplier}
                    onChange={(e) => setEditInventoryForm({ ...editInventoryForm, supplier: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  onEditInventoryItem(editInventoryForm);
                  setSelectedInventoryToEdit(null);
                }}
                className="w-full py-3.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 16: QUICK RESTOCK */}
      {selectedInventoryToRestock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-6 sm:p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{selectedInventoryToRestock.icon || '📦'}</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Restock {selectedInventoryToRestock.name}</h3>
                  <p className="text-xs text-slate-400 font-semibold">Sisa stok saat ini: {selectedInventoryToRestock.stock} {selectedInventoryToRestock.unit}</p>
                </div>
              </div>
              <button onClick={() => setSelectedInventoryToRestock(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Jumlah Masuk ({selectedInventoryToRestock.unit}) *</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={restockQty}
                    onChange={(e) => setRestockQty(Math.max(1, Number(e.target.value)))}
                    className="flex-1 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-black text-slate-900"
                  />
                  <div className="flex gap-1.5">
                    {[10, 25, 50, 100].map((quick) => (
                      <button
                        key={quick}
                        type="button"
                        onClick={() => setRestockQty(quick)}
                        className="px-2.5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-black rounded-xl"
                      >
                        +{quick}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Harga Beli / Unit (Rp)</label>
                <input
                  type="number"
                  min="0"
                  value={restockCost}
                  onChange={(e) => setRestockCost(e.target.value)}
                  placeholder={String(selectedInventoryToRestock.costPerUnit || 0)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-100 text-xs space-y-1">
                <div className="flex justify-between font-bold text-slate-600">
                  <span>Estimasi Stok Baru:</span>
                  <span className="font-black text-emerald-700 text-sm">
                    {Number(selectedInventoryToRestock.stock) + Number(restockQty)} {selectedInventoryToRestock.unit}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-slate-600">
                  <span>Total Biaya Restock:</span>
                  <span className="font-black text-slate-900">
                    Rp {(Number(restockQty) * Number(restockCost || selectedInventoryToRestock.costPerUnit || 0)).toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  onRestockInventoryItem(selectedInventoryToRestock.id, restockQty, restockCost);
                  setSelectedInventoryToRestock(null);
                }}
                className="w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center justify-center gap-2"
              >
                <Check className="w-4 h-4 stroke-[3]" />
                <span>Konfirmasi Restock Masuk</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 17: TAMBAH KARYAWAN BARU */}
      {showAddStaffModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-6 sm:p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-2xl">👤</span>
                <div>
                  <h3 className="text-base font-black text-slate-900">Tambah Karyawan Baru</h3>
                  <p className="text-xs text-slate-400 font-semibold">Daftarkan staf & atur skema komisi kerja</p>
                </div>
              </div>
              <button onClick={() => setShowAddStaffModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nama Lengkap Karyawan *</label>
                <input
                  type="text"
                  required
                  value={newStaffForm.name}
                  onChange={(e) => setNewStaffForm({ ...newStaffForm, name: e.target.value })}
                  placeholder="Contoh: Siti Rahmawati"
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Peran / Jabatan *</label>
                  <select
                    value={newStaffForm.roleType}
                    onChange={(e) => {
                      const roleType = e.target.value;
                      let role = 'Operator Cuci (Washer)';
                      let commissionRate = 1000;
                      if (roleType === 'ironer') { role = 'Staf Setrika & Packing'; commissionRate = 1500; }
                      else if (roleType === 'courier') { role = 'Kurir Antar-Jemput (Driver)'; commissionRate = 4000; }
                      else if (roleType === 'admin') { role = 'Supervisor & Kasir'; commissionRate = 0; }
                      setNewStaffForm({ ...newStaffForm, roleType, role, commissionRate });
                    }}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  >
                    <option value="washer">Operator Cuci (Washer)</option>
                    <option value="ironer">Staf Setrika & Packing</option>
                    <option value="courier">Kurir Antar-Jemput (Driver)</option>
                    <option value="admin">Supervisor & Kasir</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">No. WhatsApp *</label>
                  <input
                    type="text"
                    value={newStaffForm.phone}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, phone: e.target.value })}
                    placeholder="0812-xxxx-xxxx"
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Gaji Pokok / Bulan (Rp)</label>
                  <input
                    type="number"
                    value={newStaffForm.baseSalary}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, baseSalary: Number(e.target.value) })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">
                    Komisi (Rp/{newStaffForm.roleType === 'courier' ? 'Trip' : 'Kg'})
                  </label>
                  <input
                    type="number"
                    value={newStaffForm.commissionRate}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, commissionRate: Number(e.target.value) })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Uang Makan / Hari (Rp)</label>
                  <input
                    type="number"
                    value={newStaffForm.mealAllowancePerDay}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, mealAllowancePerDay: Number(e.target.value) })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Jumlah Hari Kerja / Bulan</label>
                  <input
                    type="number"
                    value={newStaffForm.daysWorked}
                    onChange={(e) => setNewStaffForm({ ...newStaffForm, daysWorked: Number(e.target.value) })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  if (!newStaffForm.name) return;
                  onAddStaff({
                    id: `STF-${Date.now().toString().slice(-4)}`,
                    name: newStaffForm.name,
                    role: newStaffForm.role,
                    roleType: newStaffForm.roleType,
                    phone: newStaffForm.phone || '0812-0000-0000',
                    baseSalary: Number(newStaffForm.baseSalary),
                    mealAllowancePerDay: Number(newStaffForm.mealAllowancePerDay),
                    daysWorked: Number(newStaffForm.daysWorked),
                    commissionRate: Number(newStaffForm.commissionRate),
                    status: 'Aktif',
                    avatar: newStaffForm.name.slice(0, 2).toUpperCase()
                  });
                  setShowAddStaffModal(false);
                  setNewStaffForm({
                    name: '',
                    role: 'Operator Cuci (Washer)',
                    roleType: 'washer',
                    phone: '',
                    baseSalary: 1800000,
                    mealAllowancePerDay: 25000,
                    daysWorked: 25,
                    commissionRate: 1000
                  });
                }}
                className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center justify-center gap-2"
              >
                <span>Simpan Data Karyawan</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 18: EDIT KARYAWAN */}
      {selectedStaffToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-6 sm:p-7 space-y-5 border border-slate-200 animate-scale-up">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-black text-slate-900">Edit Karyawan: {editStaffForm.name}</h3>
                <p className="text-xs text-slate-400 font-semibold">Perbarui data gaji & komisi</p>
              </div>
              <button onClick={() => setSelectedStaffToEdit(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-black text-slate-500">Nama Lengkap</label>
                <input
                  type="text"
                  value={editStaffForm.name}
                  onChange={(e) => setEditStaffForm({ ...editStaffForm, name: e.target.value })}
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Gaji Pokok (Rp)</label>
                  <input
                    type="number"
                    value={editStaffForm.baseSalary}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, baseSalary: Number(e.target.value) })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Tarif Komisi (Rp)</label>
                  <input
                    type="number"
                    value={editStaffForm.commissionRate}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, commissionRate: Number(e.target.value) })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Uang Makan / Hari</label>
                  <input
                    type="number"
                    value={editStaffForm.mealAllowancePerDay}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, mealAllowancePerDay: Number(e.target.value) })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-slate-500">Hari Kerja Aktif</label>
                  <input
                    type="number"
                    value={editStaffForm.daysWorked}
                    onChange={(e) => setEditStaffForm({ ...editStaffForm, daysWorked: Number(e.target.value) })}
                    className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-bold"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  onEditStaff(editStaffForm);
                  setSelectedStaffToEdit(null);
                }}
                className="w-full py-4 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm"
              >
                Simpan Perubahan Data
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 19: SLIP GAJI (PAYSLIP) */}
      {selectedStaffPayslip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in print:p-0 print:bg-white">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-soft-lg p-6 sm:p-7 space-y-5 border border-slate-200 animate-scale-up print:shadow-none print:border-none">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100 print:hidden">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-base font-black text-slate-900">Slip Gaji Karyawan</h3>
              </div>
              <button onClick={() => setSelectedStaffPayslip(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payslip Paper Layout */}
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 font-sans space-y-4 text-xs">
              <div className="text-center pb-3 border-b border-slate-200 space-y-0.5">
                <h4 className="font-black text-base text-slate-900">🧼 LAUNDRYKU PRO</h4>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Slip Gaji & Komisi Karyawan</p>
                <p className="text-[10px] text-slate-400">Periode: {new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(new Date())}</p>
              </div>

              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Nama Karyawan:</span>
                  <span className="font-black text-slate-850">{selectedStaffPayslip.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Jabatan:</span>
                  <span className="font-bold text-slate-700">{selectedStaffPayslip.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Hari Kerja:</span>
                  <span className="font-bold text-slate-700">{selectedStaffPayslip.daysWorked} Hari</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Kinerja:</span>
                  <span className="font-black text-indigo-700">{selectedStaffPayslip.unitsProcessed} {selectedStaffPayslip.unitLabel}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-dashed border-slate-300 space-y-2">
                <div className="flex justify-between text-slate-600 font-bold">
                  <span>1. Gaji Pokok</span>
                  <span>Rp {selectedStaffPayslip.baseSalary.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-black">
                  <span>2. Komisi Kinerja ({selectedStaffPayslip.unitsProcessed} {selectedStaffPayslip.unitLabel})</span>
                  <span>+Rp {selectedStaffPayslip.commissionTotal.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-slate-600 font-bold">
                  <span>3. Uang Makan ({selectedStaffPayslip.daysWorked} Hari)</span>
                  <span>+Rp {selectedStaffPayslip.totalMeal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <div className="pt-3 border-t-2 border-slate-900 flex justify-between items-baseline font-black text-sm">
                <span className="text-slate-900 uppercase">Total Gaji Diterima:</span>
                <span className="text-primary text-base">Rp {selectedStaffPayslip.netSalary.toLocaleString('id-ID')}</span>
              </div>
            </div>

            <div className="flex gap-2 print:hidden">
              <button
                onClick={() => window.print()}
                className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Slip Gaji</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 20: THERMAL 58/80MM & GARMENT TAG PRINT MODAL */}
      <ThermalReceiptModal
        order={selectedThermalOrder}
        isOpen={Boolean(selectedThermalOrder)}
        onClose={() => setSelectedThermalOrder(null)}
        branding={branding}
      />

      {/* MODAL 21: GARMENT PHOTO AUDIT (BEFORE & AFTER) */}
      <GarmentPhotoModal
        order={selectedPhotoOrder}
        isOpen={Boolean(selectedPhotoOrder)}
        onClose={() => setSelectedPhotoOrder(null)}
        orderPhotosState={orderPhotos}
      />
    </div>
  );
}


