import React, { useState } from 'react';
import { Camera, X, Image as ImageIcon, CheckCircle, AlertTriangle, Eye, ShieldCheck, Tag, ZoomIn } from 'lucide-react';
import { getPhotosForOrder } from '../utils/photoAuditHelper';

export default function GarmentPhotoModal({
  order,
  isOpen,
  onClose,
  orderPhotosState = {}
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'before' | 'after'
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState(null);

  if (!isOpen || !order) return null;

  const photos = getPhotosForOrder(order.id, orderPhotosState);
  const filteredPhotos = activeTab === 'all' 
    ? photos 
    : photos.filter(p => p.stage === activeTab);

  const beforePhotosCount = photos.filter(p => p.stage === 'before').length;
  const afterPhotosCount = photos.filter(p => p.stage === 'after').length;

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex justify-between items-center relative">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-primary/20 text-sky-400 rounded-2xl border border-sky-400/20">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black text-sky-400 uppercase tracking-wider">Garment Photo Audit</span>
              <h3 className="text-base sm:text-lg font-black">Foto Bukti Cucian: {order.id}</h3>
              <p className="text-xs text-slate-400 font-semibold">{order.customerName} · {order.serviceName}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filter */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex bg-slate-200/80 p-1 rounded-2xl">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Semua ({photos.length})
            </button>
            <button
              onClick={() => setActiveTab('before')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'before' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              🔍 Sebelum Cuci ({beforePhotosCount})
            </button>
            <button
              onClick={() => setActiveTab('after')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeTab === 'after' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              ✨ Selesai Packing ({afterPhotosCount})
            </button>
          </div>
          <span className="hidden sm:inline-block text-[11px] font-bold text-slate-400">
            Transparansi Kualitas
          </span>
        </div>

        {/* Photos Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredPhotos.map((photo) => {
              const isBefore = photo.stage === 'before';
              return (
                <div
                  key={photo.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden group hover:border-primary/40 transition-all flex flex-col justify-between"
                >
                  <div className="relative aspect-video overflow-hidden bg-slate-100 cursor-pointer" onClick={() => setSelectedPhotoPreview(photo)}>
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className={`absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-black border shadow-xs ${
                      isBefore 
                        ? 'bg-amber-500/90 text-white border-amber-400' 
                        : 'bg-emerald-600/90 text-white border-emerald-400'
                    }`}>
                      {isBefore ? '🔍 SEBELUM CUCI' : '✨ SETELAH PACKING'}
                    </span>
                    <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      <ZoomIn className="w-6 h-6" />
                    </div>
                  </div>

                  <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase">
                        <Tag className="w-3 h-3" />
                        <span>{photo.tag}</span>
                      </div>
                      <h4 className="text-xs sm:text-sm font-black text-slate-850">{photo.title}</h4>
                      <p className="text-[11px] text-slate-500 font-semibold leading-relaxed mt-0.5">{photo.note}</p>
                    </div>

                    <p className="text-[10px] text-slate-400 font-bold pt-2 border-t border-slate-100">
                      🕒 Diambil pada: {photo.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-white flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Garansi 100% perlindungan pakaian & anti-tertukar</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-black text-xs transition-all shadow-xs"
          >
            Tutup
          </button>
        </div>

      </div>

      {/* PHOTO ZOOM MODAL */}
      {selectedPhotoPreview && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in" onClick={() => setSelectedPhotoPreview(null)}>
          <div className="max-w-xl w-full bg-slate-900 rounded-3xl overflow-hidden shadow-2xl p-4 space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center text-white">
              <h4 className="text-sm font-black">{selectedPhotoPreview.title}</h4>
              <button onClick={() => setSelectedPhotoPreview(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <img
              src={selectedPhotoPreview.imageUrl}
              alt={selectedPhotoPreview.title}
              className="w-full max-h-[65vh] object-contain rounded-2xl bg-black"
            />
            <p className="text-xs text-slate-300 font-semibold">{selectedPhotoPreview.note}</p>
          </div>
        </div>
      )}
    </div>
  );
}
