import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './modules/landing/LandingPage';
import LoginPage from './modules/auth/LoginPage';
import CustomerApp from './modules/customer/CustomerApp';
import PosDashboard from './modules/pos/PosDashboard';
import OwnerDashboard from './modules/owner/OwnerDashboard';
import CourierApp from './modules/courier/CourierApp';
import AdminDashboard from './modules/admin/AdminDashboard';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

function resolveCurrentRoute() {
  const path = window.location.pathname.toLowerCase();
  if (path.includes('/owner')) return 'owner';
  if (path.includes('/pos')) return 'pos';
  if (path.includes('/kurir') || path.includes('/courier')) return 'courier';
  if (path.includes('/customer') || path.includes('/konsumen')) return 'customer';
  if (path.includes('/admin')) return 'admin';
  return 'landing';
}

function MainRouter() {
  const { authSessions, handleLogout, toast } = useApp();
  const [currentView, setCurrentView] = useState(() => resolveCurrentRoute());

  // Listen to browser navigation popstate
  useEffect(() => {
    const onPopState = () => {
      setCurrentView(resolveCurrentRoute());
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigateTo = (view) => {
    setCurrentView(view);
    const pathMap = {
      landing: '/',
      customer: '/customer',
      pos: '/pos',
      owner: '/owner',
      courier: '/kurir',
      admin: '/admin'
    };
    const targetPath = pathMap[view] || '/';
    window.history.pushState(null, '', targetPath);
  };

  // Render view router
  const renderCurrentView = () => {
    // 1. Landing Page
    if (currentView === 'landing') {
      return <LandingPage onNavigate={navigateTo} />;
    }

    // 2. Customer App
    if (currentView === 'customer') {
      if (!authSessions.customer) {
        return (
          <LoginPage
            role="customer"
            onBackToLanding={() => navigateTo('landing')}
            onSuccessLogin={() => navigateTo('customer')}
          />
        );
      }
      return <CustomerApp onLogout={() => handleLogout('customer')} />;
    }

    // 3. POS Cashier Workspace
    if (currentView === 'pos') {
      if (!authSessions.pos) {
        return (
          <LoginPage
            role="pos"
            onBackToLanding={() => navigateTo('landing')}
            onSuccessLogin={() => navigateTo('pos')}
          />
        );
      }
      return <PosDashboard onLogout={() => handleLogout('pos')} />;
    }

    // 4. Owner ERP
    if (currentView === 'owner') {
      if (!authSessions.owner) {
        return (
          <LoginPage
            role="owner"
            onBackToLanding={() => navigateTo('landing')}
            onSuccessLogin={() => navigateTo('owner')}
          />
        );
      }
      return (
        <OwnerDashboard
          onLogout={() => handleLogout('owner')}
          onSwitchToPos={() => navigateTo('pos')}
        />
      );
    }

    // 5. Courier Driver App
    if (currentView === 'courier') {
      if (!authSessions.courier) {
        return (
          <LoginPage
            role="courier"
            onBackToLanding={() => navigateTo('landing')}
            onSuccessLogin={() => navigateTo('courier')}
          />
        );
      }
      return <CourierApp onLogout={() => handleLogout('courier')} />;
    }

    // 6. Super Admin SaaS
    if (currentView === 'admin') {
      if (!authSessions.admin) {
        return (
          <LoginPage
            role="admin"
            onBackToLanding={() => navigateTo('landing')}
            onSuccessLogin={() => navigateTo('admin')}
          />
        );
      }
      return (
        <AdminDashboard
          onLogout={() => handleLogout('admin')}
          onSwitchToTenant={() => navigateTo('owner')}
        />
      );
    }

    return <LandingPage onNavigate={navigateTo} />;
  };

  return (
    <div className="relative min-h-screen">
      {/* Toast Alert Notification */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-70 w-11/12 max-w-sm bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 animate-slide-down">
          {toast.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          ) : toast.type === 'error' ? (
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-sky-400 flex-shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black">{toast.title}</h4>
            <p className="text-[11px] text-slate-300 font-medium">{toast.message}</p>
          </div>
        </div>
      )}

      {renderCurrentView()}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
