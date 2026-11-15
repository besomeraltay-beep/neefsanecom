import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, X, AlertCircle } from 'lucide-react';

export default function AdminLoginModal({
  isOpen,
  onClose,
  onSuccess
}) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    const expectedPass = import.meta.env.VITE_ADMIN_PASS || '11432445352.Aa';
    if (password === expectedPass) {
      setError('');
      setPassword('');
      onSuccess();
    } else {
      setError('Hatalı yönetici şifresi! Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={onClose} />

      <div 
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden z-10 p-6 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#111827] text-white flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#C2410C]" />
            </div>
            <div>
              <div className="text-sm font-black text-gray-900 uppercase tracking-tight">Yönetici Girişi</div>
              <div className="text-[11px] text-gray-400">NEEFSANE Admin Paneli</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-700">
              Yönetici Şifresi
            </label>
            <input
              type="password"
              autoFocus
              required
              placeholder="Şifrenizi girin..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white px-3.5 py-2.5 rounded-xl border border-gray-300 text-xs focus:outline-none focus:border-[#111827]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#111827] hover:bg-black text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <span>Panele Giriş Yap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-gray-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Güvenli Yönetim Arayüzü</span>
        </div>
      </div>
    </div>
  );
}
