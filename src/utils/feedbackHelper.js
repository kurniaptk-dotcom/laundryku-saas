/**
 * Feedback & Customer Reviews Helper for LaundryKu
 * Handles star ratings, CSAT calculation, and WhatsApp compensation vouchers.
 */

export const DEFAULT_REVIEWS = [
  {
    id: 'REV-001',
    orderId: 'INV-240515-001',
    customerName: 'Aisyah Salsabila',
    customerPhone: '0812-3456-7890',
    rating: 5,
    date: '15 Mei 2024',
    serviceName: 'Cuci & Setrika Reguler',
    tags: ['Harum Mewah', 'Sangat Rapi', 'Tepat Waktu', 'Kurir Ramah'],
    comment: 'Pakaian wangi banget dan setrikanya rapi tanpa lecek. Kurir Doni juga sangat sopan dan tepat waktu!',
    status: 'resolved'
  },
  {
    id: 'REV-002',
    orderId: 'INV-240515-002',
    customerName: 'Budi Pratama',
    customerPhone: '0813-8899-7711',
    rating: 2,
    date: '14 Mei 2024',
    serviceName: 'Cuci Kering',
    tags: ['Kurang Wangi'],
    comment: 'Pewanginya agak kurang terasa untuk cucian handuk tebal, tolong ditingkatkan untuk order berikutnya.',
    status: 'pending_compensation' // Flagged for CS followup!
  },
  {
    id: 'REV-003',
    orderId: 'INV-240515-003',
    customerName: 'Citra Dewi',
    customerPhone: '0857-1122-3344',
    rating: 5,
    date: '12 Mei 2024',
    serviceName: 'Setrika Saja & Parfum',
    tags: ['Sangat Rapi', 'Harum Mewah'],
    comment: 'Kemeja kerja saya digantung rapi dengan plastik pelindung. Puas sekali!',
    status: 'resolved'
  },
  {
    id: 'REV-004',
    orderId: 'INV-240515-004',
    customerName: 'Daffa Pradipta',
    customerPhone: '0811-9988-2233',
    rating: 5,
    date: '10 Mei 2024',
    serviceName: 'Deep Clean Sepatu',
    tags: ['Super Bersih', 'Cepat Selesai'],
    comment: 'Sepatu sneakers putih saya yang tadinya kotor berlumpur sekarang jadi seperti baru lagi.',
    status: 'resolved'
  }
];

export const getWhatsAppCompensationUrl = (review) => {
  const phone = review.customerPhone?.replace(/[^\d]/g, '') || '';
  const formattedPhone = phone.startsWith('0') ? '62' + phone.slice(1) : phone;
  
  const text = `Halo Kak ${review.customerName} 🙏,

Terima kasih banyak atas ulasan dan masukan yang Kakak berikan terkait pesanan *#${review.orderId}* di LaundryKu.

Kami memohon maaf yang sebesar-besarnya apabila pelayanan kami sebelumnya belum memenuhi ekspektasi Kakak (${review.comment || 'terkait keharuman/kualitas cuci'}).

Sebagai bentuk komitmen dan apresiasi kami, kami memberikan *Voucher Kompensasi Diskon 20%*:
🎟️ Kode Voucher: *MAAF20*
✨ Potongan: *20% Tanpa Minimum Order*

Kakak bisa langsung memasukkan kode ini pada pesanan berikutnya di aplikasi LaundryKu. Kepuasan Kakak adalah prioritas utama kami! ❤️

Salam hangat,
*Customer Care LaundryKu Pro*`;

  return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`;
};
