import React, { useState } from 'react';
import { 
  Send,
  Lock,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function Footer({
  onSelectCategory,
  onOpenCorporate,
  onOpenOrders,
  onShowToast
}) {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 55,
        spread: 60,
        origin: { y: 0.85 }
      });
    } catch {
      // safe fallback
    }

    setIsSubscribed(true);
    if (typeof onShowToast === 'function') {
      onShowToast('Bültenimize başarıyla abone oldunuz! %10 indirim kuponunuz: HOSGELDIN10', 'success');
    }
  };

  return (
    <footer className="bg-white border-t border-gray-200 text-gray-600 text-xs">
      
      {/* Newsletter Signup Banner */}
      <div className="border-b border-gray-200 bg-gray-50/70 py-8">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold text-[#111827]">
              Yeniliklerden ve Özel İndirimlerden İlk Sen Haberdar Ol
            </h3>
            <p className="text-gray-500 text-xs mt-0.5">
              Yeni 3D koleksiyonlar ve dönemsel kampanyalar e-posta adresinize gelsin.
            </p>
          </div>

          {isSubscribed ? (
            <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-900 px-4 py-3 rounded-xl shadow-xs animate-fadeIn w-full md:w-auto">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-xs flex items-center gap-1.5">
                  <span>Aboneliğiniz Başarıyla Tamamlandı!</span>
                  <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                </p>
                <p className="text-[11px] text-emerald-700 mt-0.5">
                  İlk siparişine özel %10 indirim kuponun: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-emerald-300 text-emerald-950 font-bold select-all tracking-wider">HOSGELDIN10</strong>
                </p>
              </div>
            </div>
          ) : (
            <form 
              onSubmit={handleSubscribe}
              className="flex w-full md:w-auto max-w-md gap-2"
            >
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="E-posta adresinizi girin..."
                className="w-full sm:w-72 bg-white text-gray-900 placeholder-gray-400 text-xs rounded-lg px-3.5 py-2.5 border border-gray-300 focus:border-[#111827] focus:outline-none"
              />
              <button
                type="submit"
                className="bg-[#111827] hover:bg-black text-white px-5 py-2.5 rounded-lg font-bold text-xs transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer shadow-sm"
              >
                <span>Abone Ol</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-1.5">
              <span className="text-2xl font-black text-[#111827] tracking-tight uppercase">
                NEEFSANE
              </span>
              <span className="w-2 h-2 rounded-full bg-[#C2410C]"></span>
            </div>

            <p className="text-gray-500 leading-relaxed max-w-sm">
              3D renkli araba figürleri, darbeye dayanıklı telefon kılıfları, 316L kararmaz cerrahi çelik kolye ve bileklik koleksiyonları. Tarzını yansıtan özel detaylar.
            </p>

            {/* Social Icons SVG */}
            <div className="flex items-center gap-2.5 pt-2">
              <a 
                href="#instagram" 
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="#twitter" 
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                aria-label="X (Twitter)"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a 
                href="#facebook" 
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.597 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a 
                href="#youtube" 
                onClick={(e) => e.preventDefault()}
                className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Kategoriler */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">
              Kategoriler
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onSelectCategory('all')} className="hover:text-black transition-colors cursor-pointer">
                  Tüm Ürünler
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('3d-araba-figuru')} className="hover:text-black transition-colors cursor-pointer">
                  3D Araba Figürleri
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('telefon-kilifi')} className="hover:text-black transition-colors cursor-pointer">
                  Telefon Kılıfları
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('kolye')} className="hover:text-black transition-colors cursor-pointer">
                  Kolye
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('bileklik')} className="hover:text-black transition-colors cursor-pointer">
                  Bileklik
                </button>
              </li>
              <li>
                <button onClick={() => onSelectCategory('diger-aksesuarlar')} className="hover:text-black transition-colors cursor-pointer">
                  Diğer Aksesuarlar
                </button>
              </li>
            </ul>
          </div>

          {/* Müşteri Hizmetleri */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">
              Müşteri Hizmetleri
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onOpenCorporate('faq')} className="hover:text-black transition-colors cursor-pointer">
                  Sıkça Sorulan Sorular
                </button>
              </li>
              <li>
                <button onClick={() => onOpenCorporate('shipping')} className="hover:text-black transition-colors cursor-pointer">
                  Teslimat ve İade
                </button>
              </li>
              <li>
                <button onClick={onOpenOrders} className="hover:text-black transition-colors cursor-pointer">
                  Sipariş Takibi
                </button>
              </li>
              <li>
                <button onClick={() => onOpenCorporate('contact')} className="hover:text-black transition-colors cursor-pointer">
                  İletişim & Destek
                </button>
              </li>
            </ul>
          </div>

          {/* Kurumsal & Yasal */}
          <div className="space-y-3">
            <h4 className="font-bold text-gray-900 uppercase tracking-wider text-xs">
              Kurumsal & Yasal
            </h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onOpenCorporate('about')} className="hover:text-black transition-colors cursor-pointer">
                  Hakkımızda
                </button>
              </li>
              <li>
                <button onClick={() => onOpenCorporate('privacy')} className="hover:text-black transition-colors cursor-pointer">
                  Gizlilik Politikası
                </button>
              </li>
              <li>
                <button onClick={() => onOpenCorporate('terms')} className="hover:text-black transition-colors cursor-pointer">
                  Mesafeli Satış Sözleşmesi
                </button>
              </li>
              <li>
                <button onClick={() => onOpenCorporate('contact')} className="hover:text-black transition-colors cursor-pointer">
                  Bize Ulaşın
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Payment Security */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500">
          <div>
            © 2026 <strong>NEEFSANE</strong>. Tüm hakları saklıdır.
          </div>

          {/* Payment providers logos representation */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold text-gray-700 bg-gray-100 px-2.5 py-1 rounded">
              <Lock className="w-3 h-3 text-emerald-600" />
              256-Bit SSL
            </span>
            <span className="font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">Troy</span>
            <span className="font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">Visa</span>
            <span className="font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">Mastercard</span>
          </div>
        </div>

      </div>

    </footer>
  );
}
