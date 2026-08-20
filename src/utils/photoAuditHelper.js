/**
 * Garment Photo Audit Helper for LaundryKu
 * Stores and manages before & after photos for garment inspections.
 */

export const DEFAULT_ORDER_PHOTOS = {
  'INV-240515-001': [
    {
      id: 'ph_1',
      stage: 'before',
      title: 'Noda Kopi di Kerah Kemeja Putih',
      note: 'Ditemukan noda kopi samar pada bagian kerah baju saat penjemputan',
      time: '15 Mei 2024, 09:30',
      tag: 'Noda Awal',
      imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'ph_2',
      stage: 'before',
      title: 'Kancing Bawah Celana Chino Lepas',
      note: 'Kancing saku belakang celana sudah terlepas sebelum dicuci',
      time: '15 Mei 2024, 09:32',
      tag: 'Kancing Lepas',
      imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'ph_3',
      stage: 'after',
      title: 'Kemeja Bersih & Noda Kerah Hilang',
      note: 'Noda kerah berhasil diangkat 100% dengan spot remover khusus',
      time: '15 Mei 2024, 14:15',
      tag: 'Selesai Bersih',
      imageUrl: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'ph_4',
      stage: 'after',
      title: 'Pakaian Rapi di Kemasan Plastik Segel',
      note: 'Sudah disetrika uap, diberi parfum lavender, dan disegel higienis',
      time: '15 Mei 2024, 14:30',
      tag: 'Packing Rapi',
      imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80'
    }
  ]
};

export const getPhotosForOrder = (orderId, orderPhotosState = {}) => {
  return orderPhotosState[orderId] || DEFAULT_ORDER_PHOTOS[orderId] || [
    {
      id: 'ph_default_before',
      stage: 'before',
      title: 'Foto Pakaian Saat Penjemputan',
      note: 'Kondisi awal cucian sebelum diproses di mesin',
      time: 'Hari ini',
      tag: 'Inspeksi Masuk',
      imageUrl: 'https://images.unsplash.com/photo-1545127398-14699f92334b?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'ph_default_after',
      stage: 'after',
      title: 'Foto Pakaian Selesai & Packing',
      note: 'Pakaian telah disetrika rapi dan siap diantar',
      time: 'Hari ini',
      tag: 'Packing Selesai',
      imageUrl: 'https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=600&auto=format&fit=crop&q=80'
    }
  ];
};
