import React, { useState } from 'react';
import { 
  Building2, Printer, Phone, MapPin, Tag, 
  Sparkles, Check, X, Shield, QrCode, CreditCard
} from 'lucide-react';

export default function TenantSettingsModal({
  isOpen,
  onClose,
  branding = {},
  onSaveBranding
}) {
  const [laundryName, setLaundryName] = useState(branding.laundryName || 'LaundryKu Pro');
  const [tagline, setTagline] = useState(branding.tagline || 'Layanan Laundry Bersih, Rapi & Wangi');
  const [address, setAddress] = useState(branding.address || 'Jl. Cempaka Putih Raya No. 42A, Jakarta Pusat');
  const [phone, setPhone] = useState(branding.phone || '0812-3456-7890');
  const [receiptFooter, setReceiptFooter] = useState(branding.receiptFooter || 'Terima kasih atas kunjungan Anda! Pakaian bersih maksimal.');
  const [bankAccount, setBankAccount] = useState(branding.bankAccount || 'BCA 8820-1234-5678 a/n LaundryKu');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const updated = {
      ...branding,
      laundryName,
      tagline,
      address,
      phone,
      receiptFooter,
      bankAccount
    };
    if (onSaveBranding) onSaveBranding(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto no-scrollbar">
        <div className="flex justify-between items-start pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 text-primary flex items-center justify-center shadow-clay-sm">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-primary tracking-wider">White-Label Customization</span>
              <h3 className="text-lg font-black text-slate-900">Pengaturan Profil & Branding Gerai</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">Nama Bisnis / Brand Laundry</label>
            <input
              type="text"
              required
              value={laundryName}
              onChange={(e) => setLaundryName(e.target.value)}
              placeholder="Contoh: FreshClean Express"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-black text-slate-900 focus:border-primary focus:bg-white focus:outline-none"
            />
            <p className="text-[10px] text-slate-400 font-semibold">Nama ini akan tercetak di Struk Thermal, Nota WhatsApp, dan Header Kasir POS.</p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">Slogan / Tagline Toko</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="Contoh: Cuci Bersih & Wangi Tahan Lama"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700">Nomor WhatsApp CS Outlet</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812-xxxx-xxxx"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:border-primary focus:bg-white focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-700">Rekening Bank / QRIS Kasir</label>
              <input
                type="text"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
                placeholder="BCA 123-456 a/n Toko"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:border-primary focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">Alamat Lengkap Outlet Gerai</label>
            <textarea
              rows="2"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Raya Utama No. 123..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-700">Footer Syarat & Ketentuan Struk Thermal</label>
            <textarea
              rows="2"
              value={receiptFooter}
              onChange={(e) => setReceiptFooter(e.target.value)}
              placeholder="Contoh: Klaim komplain maks 1x24 jam setelah diambil..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold text-slate-800 focus:border-primary focus:bg-white focus:outline-none"
            />
          </div>

          <div className="p-3.5 bg-sky-50 border border-sky-100 rounded-2xl text-xs text-primary font-semibold flex items-start gap-2">
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Perubahan ini langsung memperbarui seluruh tampilan kasir POS, cetak struk, dan pesan WhatsApp toko Anda.</span>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 border-2 border-slate-200 text-slate-700 font-black text-xs rounded-2xl hover:bg-slate-50 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 py-3.5 bg-gradient-to-r from-sky-400 via-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm transition-all"
            >
              Simpan Perubahan Brand ✓
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
