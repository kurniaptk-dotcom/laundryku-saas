/**
 * Payroll & Staff Commission Helper for LaundryKu
 * Calculates commissions per kg (washing & ironing) and per trip (couriers),
 * plus basic salary and meal allowance.
 */

export const DEFAULT_STAFF = [
  {
    id: 'STF-001',
    name: 'Siti Rahmawati',
    role: 'Operator Cuci (Washer)',
    roleType: 'washer',
    phone: '0812-4455-6677',
    baseSalary: 1800000,
    mealAllowancePerDay: 25000,
    daysWorked: 24,
    commissionRate: 1000, // Rp 1.000 / Kg cuci
    status: 'Aktif',
    avatar: 'SR'
  },
  {
    id: 'STF-002',
    name: 'Ratna Sari',
    role: 'Staf Setrika & Packing',
    roleType: 'ironer',
    phone: '0857-9988-1122',
    baseSalary: 1900000,
    mealAllowancePerDay: 25000,
    daysWorked: 25,
    commissionRate: 1500, // Rp 1.500 / Kg setrika
    status: 'Aktif',
    avatar: 'RS'
  },
  {
    id: 'STF-003',
    name: 'Doni Pratama',
    role: 'Kurir Antar-Jemput (Driver)',
    roleType: 'courier',
    phone: '0812-9988-7711',
    baseSalary: 1500000,
    mealAllowancePerDay: 30000,
    daysWorked: 26,
    commissionRate: 4000, // Rp 4.000 / Trip
    status: 'Aktif',
    avatar: 'DP'
  },
  {
    id: 'STF-004',
    name: 'Hendra Gunawan',
    role: 'Supervisor & Kasir Gerai',
    roleType: 'admin',
    phone: '0813-1122-3344',
    baseSalary: 2800000,
    mealAllowancePerDay: 30000,
    daysWorked: 26,
    commissionRate: 0,
    status: 'Aktif',
    avatar: 'HG'
  }
];

export const calculatePayroll = (staffList = [], orders = []) => {
  // Aggregate completed orders
  const totalKgWashed = orders.reduce((sum, o) => {
    const qty = typeof o.amount === 'number' ? o.amount : parseFloat(o.amount) || 0;
    return sum + qty;
  }, 0);

  const totalTrips = orders.length;

  return staffList.map(staff => {
    let unitsProcessed = 0;
    let commissionTotal = 0;

    if (staff.roleType === 'washer') {
      unitsProcessed = Math.round(totalKgWashed * 0.95); // 95% processed
      commissionTotal = unitsProcessed * (staff.commissionRate || 1000);
    } else if (staff.roleType === 'ironer') {
      unitsProcessed = Math.round(totalKgWashed * 0.85); // 85% ironed
      commissionTotal = unitsProcessed * (staff.commissionRate || 1500);
    } else if (staff.roleType === 'courier') {
      unitsProcessed = Math.round(totalTrips * 0.7); // 70% handled by main courier
      commissionTotal = unitsProcessed * (staff.commissionRate || 4000);
    } else {
      unitsProcessed = totalTrips;
      commissionTotal = 250000; // Fixed bonus for supervisor
    }

    const totalMeal = (staff.mealAllowancePerDay || 0) * (staff.daysWorked || 0);
    const grossSalary = (staff.baseSalary || 0) + commissionTotal + totalMeal;
    const deduction = 0; // BPJS / Kasbon
    const netSalary = grossSalary - deduction;

    return {
      ...staff,
      unitsProcessed,
      unitLabel: staff.roleType === 'courier' ? 'Trip' : 'Kg',
      commissionTotal,
      totalMeal,
      grossSalary,
      deduction,
      netSalary
    };
  });
};

export const exportPayrollToCSV = (payrollRecords = []) => {
  const headers = ['ID Karyawan', 'Nama Karyawan', 'Jabatan / Peran', 'No. Telepon', 'Hari Kerja', 'Volume Kerja (Kg/Trip)', 'Gaji Pokok (Rp)', 'Total Komisi (Rp)', 'Uang Makan (Rp)', 'Total Gaji Bersih (Rp)', 'Status'];
  const rows = payrollRecords.map(p => [
    p.id,
    p.name,
    p.role,
    p.phone,
    `${p.daysWorked} Hari`,
    `${p.unitsProcessed} ${p.unitLabel}`,
    p.baseSalary,
    p.commissionTotal,
    p.totalMeal,
    p.netSalary,
    p.status
  ]);

  const csvContent = '\uFEFF' + [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
  ].join('\r\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Laporan_Gaji_LaundryKu_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
