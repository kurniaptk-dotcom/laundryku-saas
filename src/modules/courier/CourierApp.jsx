import React, { useState } from 'react';
import { 
  Truck, Phone, MessageSquare, MapPin, CheckCircle2, 
  Clock, Navigation, ShieldCheck, LogOut, ArrowRight, X
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { generateWhatsAppPickupAlertUrl } from '../../utils/whatsapp';

export default function CourierApp({ onLogout }) {
  const { orders, couriers, updateOrderStatus, activeTenant } = useApp();
  const [isOnline, setIsOnline] = useState(true);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' | 'history'

  const currentCourier = couriers[0] || { name: 'Doni Pratama', vehicle: 'Honda Vario B 4821 TZX', phone: '0813-9988-1122' };

  // Courier tasks
  const pendingPickupOrders = orders.filter(o => o.status === 'pending_pickup');
  const readyDeliveryOrders = orders.filter(o => o.status === 'ready');
  const activeCourierTasks = [...pendingPickupOrders, ...readyDeliveryOrders];
  const completedCourierTasks = orders.filter(o => o.status === 'completed');

  const handleAdvanceTask = (order) => {
    if (order.status === 'pending_pickup') {
      updateOrderStatus(order.id, 'received');
    } else if (order.status === 'ready') {
      updateOrderStatus(order.id, 'completed');
    }
  };

  return (
    <div className="w-full min-h-screen py-0 sm:py-6 flex justify-center items-start bg-slate-950 font-sans antialiased select-none">
      <div className="w-full max-w-md min-h-screen sm:min-h-[780px] bg-slate-900 rounded-none sm:rounded-[36px] shadow-2xl border border-slate-800 text-slate-100 flex flex-col justify-between overflow-hidden relative">
        
        {/* Header Driver */}
        <div>
          <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-900/90 backdrop-blur-md sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-600 flex items-center justify-center text-white text-xl shadow-clay-sm">
                🛵
              </div>
              <div>
                <h1 className="text-sm font-black text-white">{currentCourier.name}</h1>
                <p className="text-[10px] text-slate-400 font-semibold">{currentCourier.vehicle}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`px-3 py-1.5 rounded-full text-xs font-black transition-all flex items-center gap-1.5 ${
                  isOnline ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`}></span>
                <span>{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
              </button>

              {onLogout && (
                <button
                  onClick={onLogout}
                  className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 rounded-xl transition-all"
                  title="Keluar Kurir"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-3 p-4">
            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 font-black uppercase">Tugas Hari Ini:</span>
              <strong className="text-lg font-black text-white block mt-0.5">{activeCourierTasks.length} Antrean</strong>
            </div>
            <div className="p-3.5 bg-slate-800/80 rounded-2xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 font-black uppercase">Selesai Antar:</span>
              <strong className="text-lg font-black text-emerald-400 block mt-0.5">{completedCourierTasks.length} Order</strong>
            </div>
          </div>

          {/* Tasks List */}
          <div className="px-4 space-y-3 pb-6">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">
              Radar Tugas Antar & Jemput:
            </h3>

            {activeCourierTasks.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <span className="text-4xl">🛵</span>
                <p className="text-xs font-bold text-slate-400">Tidak ada tugas aktif saat ini.</p>
              </div>
            ) : (
              activeCourierTasks.map(order => (
                <div key={order.id} className="p-4 bg-slate-800 rounded-3xl border border-slate-700 space-y-3 shadow-soft">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                        order.status === 'pending_pickup' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                      }`}>
                        {order.status === 'pending_pickup' ? '🛵 Jemput Laundry' : '📦 Antar Laundry Bersih'}
                      </span>
                      <h4 className="text-sm font-black text-white mt-1.5">{order.customerName}</h4>
                      <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="truncate">{order.pickupAddress}</span>
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-700/60">
                    <a
                      href={generateWhatsAppPickupAlertUrl(order, currentCourier.name)}
                      target="_blank"
                      rel="noreferrer"
                      className="py-2.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>

                    <button
                      onClick={() => handleAdvanceTask(order)}
                      className="py-2.5 bg-primary hover:bg-primary-dark text-white rounded-xl text-xs font-black shadow-clay-sm transition-all cursor-pointer"
                    >
                      {order.status === 'pending_pickup' ? 'Tiba di Gerai ✓' : 'Selesai Serahkan ✓'}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 text-center text-[10px] text-slate-500">
          SmartKurir Radar v2.0 • GPS Aktif
        </div>

      </div>
    </div>
  );
}
