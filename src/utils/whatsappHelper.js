/**
 * WhatsApp Helper Utilities for LaundryKu
 * Formats order receipts and generates direct WhatsApp Web / App sharing links.
 */

export const formatIndonesianPhone = (phone) => {
  if (!phone) return '';
  // Remove spaces, hyphens, pluses, parentheses
  let cleaned = phone.replace(/[^\d+]/g, '');
  
  if (cleaned.startsWith('+62')) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith('08')) {
    cleaned = '62' + cleaned.substring(1);
  } else if (cleaned.startsWith('8')) {
    cleaned = '62' + cleaned;
  }
  return cleaned;
};

export const getStatusLabel = (status) => {
  switch (status?.toLowerCase()) {
    case 'received': return '📥 Diterima / Antrean';
    case 'washing': return '🧼 Sedang Dicuci';
    case 'drying': return '💨 Proses Pengeringan';
    case 'ironing': return '🔌 Setrika & Packing Rapi';
    case 'ready': return '🚚 Siap Diantar Kurir';
    case 'selesai':
    case 'diambil': return '✅ Selesai / Diterima';
    default: return 'Sedang Diproses';
  }
};

export const generateOrderReceiptText = (order) => {
  const totalPrice = typeof order.totalPrice === 'number' 
    ? order.totalPrice 
    : parseInt(String(order.price || order.totalPrice || '0').replace(/[^\d]/g, '')) || 0;

  const statusText = getStatusLabel(order.status);
  const now = new Date().toLocaleDateString('id-ID', { dateStyle: 'medium' });

  return `*🧼 LAUNDRYKU PRO - NOTA & UPDATE PESANAN*
━━━━━━━━━━━━━━━━━━━━
Halo Kak *${order.customerName || 'Pelanggan Setia'}*, berikut adalah rincian pesanan laundry Anda:

📋 *No. Invoice:* ${order.id}
🧺 *Layanan:* ${order.serviceName || 'Cuci Komplit'}
⚖️ *Beban / Qty:* ${order.amount} ${order.unit || 'Kg'}
📊 *Status Terkini:* *${statusText}*
💰 *Total Tagihan:* *Rp ${totalPrice.toLocaleString('id-ID')}*
💳 *Metode Bayar:* ${order.paymentMethod || 'Wallet / Tunai'}
⏱️ *Estimasi Selesai:* ${order.eta || '1x24 Jam'}
${order.notes && order.notes !== 'Tidak ada' ? `📝 *Catatan:* ${order.notes}\n` : ''}━━━━━━━━━━━━━━━━━━━━
✨ *Status & Riwayat:* Pakaian Anda dirawat dengan detergen premium & proses higienis terbaik.

_Terima kasih telah mempercayakan pakaian Anda di LaundryKu!_
📍 *Outlet:* Jl. Cempaka Putih Raya No. 42A, Jakarta Pusat`;
};

export const getWhatsAppShareUrl = (order) => {
  const phone = formatIndonesianPhone(order.customerPhone || '');
  const text = encodeURIComponent(generateOrderReceiptText(order));
  if (phone) {
    return `https://wa.me/${phone}?text=${text}`;
  }
  return `https://wa.me/?text=${text}`;
};

export const getWhatsAppChatUrl = (phone, customMessage = '') => {
  const formatted = formatIndonesianPhone(phone);
  const text = customMessage ? `?text=${encodeURIComponent(customMessage)}` : '';
  return `https://wa.me/${formatted}${text}`;
};

/**
 * CRM Win-Back message for inactive / at-risk customers (> 21 days)
 */
export const getWhatsAppWinBackUrl = (customer, promoCode = 'KANGEN20') => {
  const phone = formatIndonesianPhone(customer?.phone || '');
  const name = customer?.name || 'Pelanggan Setia';
  const text = encodeURIComponent(
`*🧼 KANGEN MENCUCI DI LAUNDRYKU? ADA HADIAH UNTUK KAK ${name.toUpperCase()}!* 🎁
━━━━━━━━━━━━━━━━━━━━
Halo Kak *${name}*, kami perhatikan Kakak sudah cukup lama tidak mencuci di LaundryKu. Pakaian menumpuk di rumah? Jangan repot, serahkan saja pada kami!

Khusus hari ini, kami berikan *VOUCHER DISKON SPESIAL 20%*:
🏷️ Kode Kupon: *${promoCode}*
🛵 *Gratis Antar-Jemput* langsung ke depan pintu rumah Kakak!

Tinggal balas pesan ini dengan alamat & jadwal jemput yang diinginkan, kurir kami langsung meluncur. 🛵💨

_LaundryKu - Sahabat Pakaian Bersih, Rapi & Wangi Tahan Lama_ ✨`
  );

  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
};

/**
 * CRM VIP Greeting message for Gold & Platinum members
 */
export const getWhatsAppVIPGreetingUrl = (customer) => {
  const phone = formatIndonesianPhone(customer?.phone || '');
  const name = customer?.name || 'Member VIP';
  const tierName = customer?.tier || 'VIP Gold';
  const points = customer?.points || 0;

  const text = encodeURIComponent(
`*👑 SPESIAL APRESIASI MEMBER ${tierName.toUpperCase()} - LAUNDRYKU* ✨
━━━━━━━━━━━━━━━━━━━━
Halo Kak *${name}*, terima kasih telah menjadi pelanggan prioritas kami!

Status Akun Kakak saat ini:
⭐ *Tier Member:* *${tierName}*
🪙 *Loyalty Points:* *${points.toLocaleString('id-ID')} Poin*
✨ *Benefit Aktif:* Diskon Otomatis + Prioritas Antrean Mesin Cuci + Layanan Express Prioritas!

Apakah ada pakaian atau bed cover yang ingin dijemput hari ini? Hubungi kami kapan saja melalui jalur VIP ini.

_Salam hangat dari Manajemen LaundryKu Pro_ 🌟`
  );

  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
};

/**
 * CRM Welcome message for newly registered members
 */
export const getWhatsAppWelcomeUrl = (customer) => {
  const phone = formatIndonesianPhone(customer?.phone || '');
  const name = customer?.name || 'Pelanggan Baru';

  const text = encodeURIComponent(
`*🎉 SELAMAT DATANG DI LAUNDRYKU PRO, KAK ${name.toUpperCase()}!* 🧼
━━━━━━━━━━━━━━━━━━━━
Terima kasih telah bergabung menjadi member LaundryKu! Kami siap membantu merawat pakaian Kakak tetap bersih higienis, licin rapi, dan wangi tahan lama.

🎁 *Bonus Poin Member Baru:* +100 Loyalty Points telah masuk ke akun Kakak.
📱 Nikmati kemudahan antar-jemput dan pantau status cucian secara real-time lewat aplikasi kami.

Simpan nomor ini untuk kemudahan order & konsultasi ya Kak. Selamat beraktivitas! ✨`
  );

  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
};

