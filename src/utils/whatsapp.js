// Dynamic WhatsApp URL and Invoice Template Generator

export function generateWhatsAppInvoiceUrl(order, laundryName = 'LaundryKu Pro') {
  const phone = (order.customerPhone || '').replace(/[^0-9]/g, '');
  const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;

  const text = `*NOTA DIGITAL ${laundryName.toUpperCase()}* 🧺✨
-----------------------------------------
No. Invoice : *${order.id}*
Nama        : *${order.customerName}*
Layanan     : ${order.serviceName}
Berat/Item  : *${order.amount} ${order.unit}*
Total Bayar : *Rp ${(order.totalPrice || 0).toLocaleString('id-ID')}*
Status      : *${order.paymentStatus === 'Paid' ? 'LUNAS ✓' : 'BELUM BAYAR (COD/Online)'}*
Estimasi    : ${order.eta || '2 Hari Kerja'}
-----------------------------------------
Terima kasih telah mempercayakan pakaian Anda kepada kami!
Lacak status cuci Anda secara real-time di portal konsumen.`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
}

export function generateWhatsAppPickupAlertUrl(order, courierName = 'Doni Pratama') {
  const phone = (order.customerPhone || '').replace(/[^0-9]/g, '');
  const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;

  const text = `Halo Kak *${order.customerName}*, saya *${courierName}* kurir LaundryKu.
Saya sedang menuju lokasi penjemputan untuk order *${order.id}*.
Alamat: ${order.pickupAddress || 'Sesuai aplikasi'}.
Mohon dipersiapkan pakaian kotornya ya Kak. Terima kasih! 🙏🛵`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
}
