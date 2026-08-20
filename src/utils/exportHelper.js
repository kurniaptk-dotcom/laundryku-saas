/**
 * CSV / Excel Export Helper for LaundryKu ERP
 * Exports orders and financial transactions to cleanly formatted UTF-8 CSV files with BOM.
 */

export const exportOrdersToCSV = (orders = [], filenamePrefix = 'Laporan_Transaksi_LaundryKu') => {
  if (!orders || orders.length === 0) {
    alert('Tidak ada data pesanan untuk diekspor.');
    return;
  }

  const headers = [
    'No Invoice',
    'Nama Pelanggan',
    'No Telepon',
    'Layanan',
    'Jumlah',
    'Satuan',
    'Status Pesanan',
    'Metode Pembayaran',
    'Waktu Order',
    'Estimasi Selesai',
    'Catatan / Pewangi',
    'Total Harga (Rp)'
  ];

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '""';
    const stringValue = String(str).replace(/"/g, '""');
    return `"${stringValue}"`;
  };

  const rows = orders.map((order) => {
    const totalPrice = typeof order.totalPrice === 'number'
      ? order.totalPrice
      : parseInt(String(order.price || order.totalPrice || '0').replace(/[^\d]/g, '')) || 0;

    return [
      escapeCSV(order.id),
      escapeCSV(order.customerName || '-'),
      escapeCSV(order.customerPhone || '-'),
      escapeCSV(order.serviceName || '-'),
      order.amount || 1,
      escapeCSV(order.unit || 'Kg'),
      escapeCSV(order.status || 'received'),
      escapeCSV(order.paymentMethod || 'Wallet'),
      escapeCSV(order.orderTime || '-'),
      escapeCSV(order.eta || '-'),
      escapeCSV(order.notes || '-'),
      totalPrice
    ].join(',');
  });

  // UTF-8 BOM so Excel opens with proper Indonesian characters
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const filename = `${filenamePrefix}_${dateStr}.csv`;

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const exportInventoryToCSV = (inventory = [], filenamePrefix = 'Laporan_Stok_Bahan_LaundryKu') => {
  if (!inventory || inventory.length === 0) {
    alert('Tidak ada data inventaris untuk diekspor.');
    return;
  }

  const headers = [
    'ID Item',
    'Nama Bahan / Perlengkapan',
    'Kategori',
    'Sisa Stok',
    'Satuan',
    'Batas Minimum Stok',
    'Status Level',
    'Harga Beli / Unit (Rp)',
    'Total Valuasi Aset (Rp)',
    'Mitra Supplier',
    'Restock Terakhir'
  ];

  const escapeCSV = (str) => {
    if (str === null || str === undefined) return '""';
    const stringValue = String(str).replace(/"/g, '""');
    return `"${stringValue}"`;
  };

  const rows = inventory.map((item) => {
    const totalValuation = (item.stock || 0) * (item.costPerUnit || 0);
    const isLow = item.stock <= item.minStock;
    const isCritical = item.stock <= (item.minStock * 0.5);
    const statusText = isCritical ? 'KRITIS' : isLow ? 'MENIPIS' : 'AMAN';

    return [
      escapeCSV(item.id),
      escapeCSV(item.name),
      escapeCSV(item.category || 'Chemical'),
      item.stock || 0,
      escapeCSV(item.unit || 'Unit'),
      item.minStock || 0,
      escapeCSV(statusText),
      item.costPerUnit || 0,
      totalValuation,
      escapeCSV(item.supplier || '-'),
      escapeCSV(item.lastRestock || '-')
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  const today = new Date();
  const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  const filename = `${filenamePrefix}_${dateStr}.csv`;

  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

