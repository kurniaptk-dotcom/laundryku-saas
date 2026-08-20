import React, { useState } from 'react';
import { Star, X, Sparkles, Heart, Check, MessageSquare, Award, ThumbsUp } from 'lucide-react';

export default function RatingModal({
  order,
  isOpen,
  onClose,
  onSubmitReview
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState(['Harum Mewah', 'Sangat Rapi']);
  const [comment, setComment] = useState('');

  if (!isOpen || !order) return null;

  const availableTags = [
    'Harum Mewah',
    'Sangat Rapi',
    'Tepat Waktu',
    'Kurir Ramah',
    'Pakaian Lembut',
    'Super Bersih',
    'Packing Aman'
  ];

  const toggleTag = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      id: `REV-${Date.now().toString().slice(-4)}`,
      orderId: order.id,
      customerName: order.customerName || 'Aisyah Salsabila',
      customerPhone: order.customerPhone || '0812-3456-7890',
      rating,
      date: new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium' }).format(new Date()),
      serviceName: order.serviceName || 'Cuci & Setrika',
      tags: selectedTags,
      comment: comment || 'Pelayanan laundry sangat memuaskan dan pakaian wangi!',
      status: rating < 3 ? 'pending_compensation' : 'resolved'
    };

    onSubmitReview(newReview);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-scale-up">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-amber-500 via-primary to-indigo-600 text-white text-center relative overflow-hidden">
          <button onClick={onClose} className="absolute right-4 top-4 p-1.5 text-white/80 hover:text-white">
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-14 h-14 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl mb-2 shadow-sm">
            ⭐
          </div>
          <h3 className="text-base sm:text-lg font-black">Beri Ulasan Pesanan</h3>
          <p className="text-xs text-sky-100 font-semibold">{order.id} · {order.serviceName}</p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          {/* Star Selector */}
          <div className="text-center space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Bagaimana kualitas hasil cucian Anda?</p>
            <div className="flex justify-center items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || rating) >= star;
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1.5 focus:outline-none transition-transform hover:scale-125 active:scale-95"
                  >
                    <Star
                      className={`w-8 h-8 transition-colors ${
                        isFilled 
                          ? 'text-amber-400 fill-amber-400 drop-shadow-md' 
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                );
              })}
            </div>
            <p className="text-xs font-black text-slate-850">
              {rating === 5 && '🌟 Luar Biasa! Sangat Puas'}
              {rating === 4 && '😊 Bagus & Memuaskan'}
              {rating === 3 && '😐 Cukup Baik'}
              {rating === 2 && '😕 Kurang Puas'}
              {rating === 1 && '😞 Sangat Mengecewakan'}
            </p>
          </div>

          {/* Quick Tags */}
          <div className="space-y-2">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Apa yang paling Anda sukai?
            </label>
            <div className="flex flex-wrap gap-1.5">
              {availableTags.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-amber-50 text-amber-800 border-2 border-amber-300 shadow-xs'
                        : 'bg-slate-100 text-slate-600 border border-transparent hover:bg-slate-200'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Comment */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-black text-slate-400 uppercase tracking-wider">
              Komentar / Masukan Tambahan
            </label>
            <textarea
              rows="3"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Ceritakan pengalaman Anda menggunakan layanan LaundryKu..."
              className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-semibold focus:outline-none focus:border-primary"
            ></textarea>
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-primary to-indigo-600 hover:opacity-95 text-white font-black text-xs rounded-2xl shadow-clay-sm flex items-center justify-center gap-2 transition-all active:scale-98"
          >
            <Heart className="w-4 h-4 fill-current" />
            <span>Kirim Ulasan & Dapatkan +50 Poin</span>
          </button>
        </form>

      </div>
    </div>
  );
}
