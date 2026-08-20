import React, { useState } from 'react';
import { Printer, X, QrCode, Tag, Check, Scissors, Layers, ShieldCheck, Share2, Copy } from 'lucide-react';
import { getStatusLabel } from '../utils/whatsappHelper';

export default function ThermalReceiptModal({
  order,
  isOpen,
  onClose,
  branding = {}
}) {
  const [printMode, setPrintMode] = useState('receipt'); // 'receipt' | 'tag'
  const [paperWidth, setPaperWidth] = useState('58mm'); // '58mm' | '80mm'
  const [copied, setCopied] = useState(false);

  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const text = `LAUNDRYKU RECEIPT\nInvoice: ${order.id}\nPelanggan: ${order.customerName}\nLayanan: ${order.serviceName} (${order.amount} ${order.unit})\nTotal: Rp ${(order.totalPrice || 0).toLocaleString('id-ID')}\nStatus: ${getStatusLabel(order.status)}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const totalPrice = typeof order.totalPrice === 'number' 
    ? order.totalPrice 
    : parseInt(String(order.price || order.totalPrice || '0').replace(/[^\d]/g, '')) || 0;

  const rackNumber = `RAK-${(order.id.slice(-2) || '01').toUpperCase()}`;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in print:p-0 print:bg-white">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up print:border-none print:shadow-none print:max-w-none print:w-auto">
        
        {/* Modal Header (Hidden on Print) */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70 print:hidden">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-primary/10 text-primary rounded-xl">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-850">Cetak Nota Thermal & Tag Pakaian</h3>
              <p className="text-[11px] text-slate-400 font-semibold">Kompatibel printer thermal Bluetooth 58mm & 80mm</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Controls (Hidden on Print) */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap gap-2 justify-between items-center bg-white print:hidden">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setPrintMode('receipt')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                printMode === 'receipt' ? 'bg-white text-slate-850 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🧾 Struk Kasir Thermal
            </button>
            <button
              onClick={() => setPrintMode('tag')}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                printMode === 'tag' ? 'bg-white text-slate-850 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🏷️ Tag Label Pakaian
            </button>
          </div>

          {printMode === 'receipt' && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
              <span>Lebar:</span>
              <button
                onClick={() => setPaperWidth('58mm')}
                className={`px-2 py-1 rounded-md text-[11px] font-black ${
                  paperWidth === '58mm' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                58mm
              </button>
              <button
                onClick={() => setPaperWidth('80mm')}
                className={`px-2 py-1 rounded-md text-[11px] font-black ${
                  paperWidth === '80mm' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                80mm
              </button>
            </div>
          )}
        </div>

        {/* Printable Viewport Container */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/70 flex justify-center print:p-0 print:bg-white">
          
          {/* 1. THERMAL RECEIPT PREVIEW */}
          {printMode === 'receipt' && (
            <div 
              className={`bg-white p-5 shadow-sm border border-slate-200 font-mono text-slate-900 text-xs transition-all duration-300 print:shadow-none print:border-none print:p-2 ${
                paperWidth === '58mm' ? 'w-[260px] text-[11px]' : 'w-[340px] text-xs'
              }`}
            >
              {/* Header */}
              <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-300">
                <div className="flex items-center justify-center gap-1">
                  <span className="text-base font-black tracking-tighter">🧼 {branding.laundryName ? branding.laundryName.toUpperCase() : 'LAUNDRYKU PRO'}</span>
                </div>
                <p className="text-[10px] text-slate-600 leading-tight">
                  {branding.address || 'Jl. Cempaka Putih Raya No. 42A'}<br />
                  WA: {branding.phone || '0812-3456-7890'}
                </p>
              </div>

              {/* Order Meta */}
              <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[10px]">
                <div className="flex justify-between">
                  <span>No. Nota :</span>
                  <span className="font-bold">{order.id}</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu    :</span>
                  <span>{order.orderTime || new Date().toLocaleDateString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kasir    :</span>
                  <span>Hendra (Kasir 1)</span>
                </div>
                <div className="flex justify-between">
                  <span>Pelanggan:</span>
                  <span className="font-bold truncate max-w-[140px]">{order.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span>No. HP   :</span>
                  <span>{order.customerPhone || '0812-xxxx-xxxx'}</span>
                </div>
              </div>

              {/* Items Table */}
              <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1.5">
                <div className="flex justify-between font-bold text-[10px]">
                  <span>LAYANAN</span>
                  <span>TOTAL</span>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold">{order.serviceName}</p>
                    <p className="text-[10px] text-slate-500">{order.amount} {order.unit} @ Rp {Math.round(totalPrice / (order.amount || 1)).toLocaleString('id-ID')}</p>
                  </div>
                  <span className="font-bold">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>

              {/* Total Summary */}
              <div className="py-2.5 border-b border-dashed border-slate-300 space-y-1 text-[11px]">
                <div className="flex justify-between font-bold">
                  <span>TOTAL AKHIR :</span>
                  <span className="text-sm">Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Metode Bayar:</span>
                  <span className="font-bold">{order.paymentMethod || 'Wallet / Lunas'}</span>
                </div>
                <div className="flex justify-between text-[10px]">
                  <span>Status Bayar:</span>
                  <span className="font-bold text-emerald-700">LUNAS [PAID]</span>
                </div>
              </div>

              {/* Pickup / Delivery Notice */}
              <div className="py-2 text-[10px] space-y-0.5">
                <div className="flex justify-between">
                  <span>Estimasi Selesai:</span>
                  <span className="font-bold">{order.eta || '1x24 Jam'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Lokasi Rak Pakaian:</span>
                  <span className="font-bold bg-slate-100 px-1">{rackNumber}</span>
                </div>
                {order.notes && order.notes !== 'Tidak ada' && (
                  <p className="text-[9px] text-slate-600 mt-1 italic">
                    *Catatan: {order.notes}
                  </p>
                )}
              </div>

              {/* QR Code Barcode & Custom Footer */}
              <div className="text-center pt-2 pb-1 border-t border-dashed border-slate-300 space-y-1">
                <div className="w-16 h-16 mx-auto bg-slate-900 text-white rounded-lg flex items-center justify-center p-1">
                  <QrCode className="w-14 h-14" />
                </div>
                <p className="text-[8px] tracking-widest uppercase">SCAN UNTUK CEK STATUS LAUNDRY</p>
                <p className="text-[9px] font-bold mt-1 text-slate-700 leading-tight">
                  {branding.receiptFooter || '*** TERIMA KASIH ATAS KUNJUNGAN ANDA ***'}
                </p>
              </div>
            </div>
          )}

          {/* 2. GARMENT TAG LABEL PREVIEW */}
          {printMode === 'tag' && (
            <div className="w-[300px] bg-white p-4 shadow-sm border-2 border-slate-850 rounded-2xl font-mono text-slate-900 space-y-3 print:shadow-none print:border-black">
              <div className="flex justify-between items-start border-b-2 border-slate-850 pb-2">
                <div>
                  <h4 className="font-black text-sm tracking-tight">🏷️ LAUNDRYKU TAG</h4>
                  <p className="text-[9px] text-slate-500 font-bold">Waterproof Garment Pin</p>
                </div>
                <span className="px-2 py-1 bg-slate-900 text-white text-xs font-black rounded-lg">
                  {rackNumber}
                </span>
              </div>

              <div className="space-y-1 text-xs">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Nama Pelanggan:</p>
                <p className="text-base font-black tracking-tight">{order.customerName}</p>
                <p className="text-[11px] text-slate-600 font-bold">{order.customerPhone || '0812-xxxx-xxxx'}</p>
              </div>

              <div className="p-2.5 bg-slate-100 rounded-xl space-y-1 text-xs font-bold border border-slate-200">
                <div className="flex justify-between">
                  <span className="text-slate-500">Layanan:</span>
                  <span>{order.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Beban/Qty:</span>
                  <span className="font-black text-sm text-primary">{order.amount} {order.unit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Order:</span>
                  <span>{order.id}</span>
                </div>
              </div>

              {order.notes && order.notes !== 'Tidak ada' && (
                <div className="p-2 bg-amber-50 rounded-lg border border-amber-200 text-[10px] font-bold text-amber-900">
                  ⚠️ <span>{order.notes}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[9px] text-slate-400">
                <div className="flex items-center gap-1 font-bold">
                  <Scissors className="w-3.5 h-3.5" />
                  <span>Sematkan pada Tag / Pin</span>
                </div>
                <QrCode className="w-8 h-8 text-slate-800" />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions (Hidden on Print) */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex justify-between items-center gap-3 print:hidden">
          <button
            onClick={handleCopyText}
            className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex-1 py-3.5 bg-gradient-to-r from-primary to-indigo-600 hover:opacity-95 text-white rounded-2xl font-black text-xs sm:text-sm shadow-clay-sm flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Printer className="w-4 h-4" />
            <span>🖨️ Cetak ke Printer Thermal</span>
          </button>
        </div>

      </div>
    </div>
  );
}
