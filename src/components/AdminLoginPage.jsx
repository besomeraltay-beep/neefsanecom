import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, AlertCircle, ArrowLeft } from 'lucide-react';

export default function AdminLoginPage({
  onSuccess,
  onBackToStore
}) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const cleanUser = username.trim().toLowerCase();
      const expectedUser = (import.meta.env.VITE_ADMIN_USER || 'altay').trim().toLowerCase();
      const expectedPass = import.meta.env.VITE_ADMIN_PASS || '11432445352.Aa';

      const isUserValid = cleanUser === expectedUser;
      const isPassValid = password === expectedPass;

      if (isUserValid && isPassValid) {
        setIsLoading(false);
        onSuccess();
      } else {
        setIsLoading(false);
        setError('Girdiğiniz kullanıcı adı veya şifre hatalı!');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 font-sans selection:bg-[#C2410C] selection:text-white">
      
      {/* Top Back Link */}
      <div className="w-full max-w-md mb-6 flex justify-between items-center">
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Mağaza Vitrinine Dön</span>
        </button>

        <span className="text-[11px] font-mono text-slate-500">v2.4.0 • Secure</span>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl space-y-8 backdrop-blur-xl relative overflow-hidden">
        
        {/* Glow accent in background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#C2410C]/20 rounded-full blur-3xl pointer-events-none"></div>

        {/* Brand & Heading */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-700 border border-slate-700 shadow-inner text-[#C2410C] mx-auto">
            <Lock className="w-6 h-6" />
          </div>

          <div>
            <div className="text-2xl font-black tracking-tight uppercase text-white">
              NEEFSANE
            </div>
            <p className="text-xs font-semibold text-[#C2410C] uppercase tracking-widest mt-1">
              Yönetim Portalı
            </p>
          </div>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Ürün kataloğu, stok ve fiyat yönetimi için lütfen yetkili şifrenizle giriş yapın.
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800/80 text-red-300 text-xs flex items-center gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">
              Yönetici Kullanıcı Adı
            </label>
            <input
              type="text"
              required
              placeholder="Kullanıcı adınızı girin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#C2410C] transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-300">
                Yönetici Şifresi
              </label>
            </div>
            <input
              type="password"
              required
              autoFocus
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-[#C2410C] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 bg-[#C2410C] hover:bg-[#9a3412] text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-orange-950/30 transition-all cursor-pointer disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span>Giriş Yapılıyor...</span>
            ) : (
              <>
                <span>Yönetim Paneline Giriş</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-center gap-2 text-[11px] text-slate-500">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>Şifrelenmiş Yetkili Oturumu</span>
        </div>

      </div>

      <div className="text-center text-slate-600 text-[11px] mt-8">
        © 2026 NEEFSANE E-Ticaret ve Yönetim Sistemleri
      </div>

    </div>
  );
}
