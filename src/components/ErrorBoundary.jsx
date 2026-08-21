import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    // Keep unrelated data on the same browser origin intact.
    Object.keys(localStorage)
      .filter((key) => key.startsWith('laundry_'))
      .forEach((key) => localStorage.removeItem(key));
    window.location.reload();
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-6 select-none">
          <div className="max-w-md w-full bg-slate-800/90 border border-slate-700 rounded-3xl p-8 shadow-2xl text-center space-y-6 animate-scale-up">
            <div className="w-16 h-16 bg-rose-500/20 text-rose-400 rounded-2xl flex items-center justify-center mx-auto shadow-inner border border-rose-500/30">
              <AlertTriangle className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">Terjadi Kendala Teknis</h2>
              <p className="text-xs text-slate-300 font-semibold leading-relaxed">
                Aplikasi mengalami kendala tak terduga. Jangan khawatir, data Anda aman. Silakan muat ulang halaman.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-slate-950/70 border border-slate-700/60 rounded-xl text-left overflow-x-auto max-h-32 text-[11px] font-mono text-rose-300">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="flex-1 py-3.5 px-4 bg-primary hover:bg-primary-dark text-white rounded-2xl font-black text-xs flex items-center justify-center gap-2 shadow-clay-sm transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Muat Ulang Aplikasi</span>
              </button>

              <button
                onClick={this.handleReset}
                className="py-3.5 px-4 bg-slate-700 hover:bg-rose-900/60 text-slate-200 hover:text-rose-200 rounded-2xl font-black text-xs transition-all border border-slate-600"
                title="Reset cache data demo ke awal"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
