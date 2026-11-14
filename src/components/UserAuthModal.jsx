import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  Sparkles, 
  Check, 
  Copy, 
  Truck, 
  ShieldCheck, 
  PackageCheck, 
  ArrowRight,
  Gift,
  AlertCircle,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { loginCustomer, registerCustomer } from '../services/db';

export default function UserAuthModal({
  isOpen,
  initialTab = 'login',
  onClose,
  onLoginSuccess,
  onOpenAccount
}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  // Loading & error state
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Welcome screen state for new member
  const [newRegisteredUser, setNewRegisteredUser] = useState(null);
  const [couponCopied, setCouponCopied] = useState(false);

  if (!isOpen) return null;

  const handleModalClose = () => {
    setNewRegisteredUser(null);
    setErrorMessage('');
    onClose();
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      const user = await loginCustomer({ email: loginEmail, password: loginPassword });
      onLoginSuccess(user, false);
      handleModalClose();
    } catch (err) {
      setErrorMessage(err.message || 'Giriş yapılamadı. Lütfen bilgilerinizi kontrol edin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    try {
      const newUser = await registerCustomer({
        name: registerName,
        email: registerEmail,
        phone: registerPhone,
        password: registerPassword
      });

      // Save and notify parent without closing immediately
      onLoginSuccess(newUser, true);
      setNewRegisteredUser(newUser);

      // Trigger celebratory confetti burst
      try {
        confetti({
          particleCount: 85,
          spread: 75,
          origin: { y: 0.55 }
        });
      } catch {
        // safe fallback
      }
    } catch (err) {
      setErrorMessage(err.message || 'Kayıt işlemi başarısız oldu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCoupon = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText('HOSGELDIN10');
    }
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-md bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* 1. STATE: Yeni Üye Hoş Geldiniz Ekranı (Professional Welcome Screen) */}
        {newRegisteredUser ? (
          <div className="text-center space-y-5 animate-fadeIn py-2">
            
            {/* VIP Avatar / Badge */}
            <div className="relative inline-block mx-auto">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#111827] via-gray-900 to-[#C2410C] flex items-center justify-center text-white shadow-xl shadow-orange-500/10 mx-auto">
                <Gift className="w-10 h-10 text-amber-400 animate-pulse" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            {/* Greeting Header */}
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-[11px] font-bold text-[#C2410C] uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 fill-current" />
                <span>NEEFSANE Ailesine Katıldınız</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                Aramıza Hoş Geldin, {newRegisteredUser.name}!
              </h2>
              <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
                Üyeliğiniz başarıyla aktif edildi. Size özel hoş geldin hediyeniz ve üyelik avantajlarınız hesabınıza tanımlandı.
              </p>
            </div>

            {/* Exclusive Welcome Gift Card */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/90 to-orange-50/60 border border-amber-200/90 text-left relative overflow-hidden shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200/70 px-2 py-0.5 rounded-md">
                  Yeni Üyelere Özel Hediye
                </span>
                <span className="text-xs font-black text-[#C2410C]">%10 Sepet İndirimi</span>
              </div>

              <div className="flex items-center justify-between gap-2 bg-white rounded-xl p-2.5 border border-amber-200 shadow-2xs">
                <div>
                  <div className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">İndirim Kuponu</div>
                  <div className="font-mono font-black text-sm text-gray-900 tracking-wider">HOSGELDIN10</div>
                </div>
                <button
                  type="button"
                  onClick={handleCopyCoupon}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                    couponCopied 
                      ? 'bg-emerald-600 text-white' 
                      : 'bg-[#111827] hover:bg-black text-white'
                  }`}
                >
                  {couponCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kodu Kopyala</span>
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-2">
                * İlk siparişinizde ödeme aşamasında bu kuponu girerek %10 indirimden anında yararlanabilirsiniz.
              </p>
            </div>

            {/* VIP Perks List */}
            <div className="text-left space-y-2 py-1 text-xs">
              <div className="flex items-center gap-2.5 text-gray-700">
                <div className="w-6 h-6 rounded-lg bg-orange-100/70 text-[#C2410C] flex items-center justify-center shrink-0">
                  <Truck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-medium">500 TL üzeri tüm siparişlerinizde <strong>Ücretsiz Kargo</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-700">
                <div className="w-6 h-6 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center shrink-0">
                  <PackageCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-medium">Siparişleriniz için <strong>Canlı Kargo & SMS Takibi</strong></span>
              </div>
              <div className="flex items-center gap-2.5 text-gray-700">
                <div className="w-6 h-6 rounded-lg bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span className="text-[11px] font-medium">256-Bit SSL ile <strong>%100 Güvenli Alışveriş ve Site Güvenirliği</strong></span>
              </div>
            </div>

            {/* Action CTAs */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleModalClose}
                className="w-full py-3.5 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Hemen Alışverişe Başla</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {onOpenAccount && (
                <button
                  type="button"
                  onClick={() => {
                    handleModalClose();
                    onOpenAccount();
                  }}
                  className="w-full py-2.5 text-gray-500 hover:text-gray-900 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Hesap Bilgilerimi Düzenle
                </button>
              )}
            </div>

          </div>
        ) : (
          /* 2. STATE: Standart Giriş / Kayıt Formu */
          <>
            {/* Brand header */}
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <span className="text-2xl font-black text-gray-900 tracking-tight">NEEFSANE</span>
                <span className="w-2 h-2 rounded-full bg-[#C2410C]"></span>
              </div>
              <p className="text-xs text-gray-500">
                {activeTab === 'login' ? 'Hesabınıza giriş yapın' : 'Aramıza katılın, ilk siparişinize özel %10 indirim kazanın'}
              </p>
            </div>

            {/* Tab switch */}
            <div className="flex border-b border-gray-200 mb-6">
              <button
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'login' 
                    ? 'border-[#111827] text-gray-900' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Giriş Yap
              </button>
              <button
                onClick={() => {
                  setActiveTab('register');
                  setErrorMessage('');
                }}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                  activeTab === 'register' 
                    ? 'border-[#111827] text-gray-900' 
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                Kayıt Ol
              </button>
            </div>

            {/* Error Message Alert */}
            {errorMessage && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Login Form */}
            {activeTab === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">E-Posta Adresi</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => {
                        setLoginEmail(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="ornek@mail.com"
                      className="w-full bg-white text-gray-900 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-gray-300 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Şifre</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={loginPassword}
                      onChange={(e) => {
                        setLoginPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="••••••••"
                      className="w-full bg-white text-gray-900 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-gray-300 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" defaultChecked className="rounded accent-[#111827]" />
                    <span>Beni Hatırla</span>
                  </label>
                  <a href="#sifremi-unuttum" onClick={(e) => e.preventDefault()} className="text-[#C2410C] hover:underline">
                    Şifremi Unuttum
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-[#111827] hover:bg-black disabled:bg-gray-400 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Giriş Yapılıyor...</span>
                    </>
                  ) : (
                    <span>Giriş Yap</span>
                  )}
                </button>
              </form>
            ) : (
              /* Register Form */
              <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Ad Soyad *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      value={registerName}
                      onChange={(e) => {
                        setRegisterName(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="Örn: Burak Özdemir"
                      className="w-full bg-white text-gray-900 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-gray-300 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">E-Posta Adresi *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="email"
                      required
                      value={registerEmail}
                      onChange={(e) => {
                        setRegisterEmail(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="ornek@mail.com"
                      className="w-full bg-white text-gray-900 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-gray-300 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Telefon Numarası</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      value={registerPhone}
                      onChange={(e) => {
                        setRegisterPhone(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="05XX XXX XX XX"
                      className="w-full bg-white text-gray-900 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-gray-300 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Şifre Oluşturun *</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={registerPassword}
                      onChange={(e) => {
                        setRegisterPassword(e.target.value);
                        if (errorMessage) setErrorMessage('');
                      }}
                      placeholder="En az 6 karakter"
                      className="w-full bg-white text-gray-900 text-xs rounded-xl pl-9 pr-3 py-2.5 border border-gray-300 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 bg-[#111827] hover:bg-black disabled:bg-gray-400 text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm mt-2 flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Kaydediliyor...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>Üyeliğimi Başlat & Hediyemi Al</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </>
        )}

      </div>
    </div>
  );
}
