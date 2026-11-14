import React, { useState, useEffect } from 'react';
import { Heart, Truck, Camera, Zap, Award, Check } from 'lucide-react';

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onOpenDetail
}) {
  const [isAdded, setIsAdded] = useState(false);

  // Live ticking countdown for flash badge (Trendyol style: 23 : 14 : 05)
  const [countdown, setCountdown] = useState(() => {
    const now = new Date();
    const hours = 23 - (now.getHours() % 24);
    const minutes = 59 - now.getMinutes();
    const seconds = 59 - now.getSeconds();
    return { hours, minutes, seconds };
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 23, minutes: 59, seconds: 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;

  // Primary and secondary hover image
  const primaryImg = product.image || (product.images && product.images[0]);
  const secondaryImg = (product.images && product.images[1]) || primaryImg;

  // Generate deterministic social proof numbers based on product ID
  const hash = (product.id || '').split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const socialCount = ((hash % 30) / 10 + 1).toFixed(1).replace('.', ',') + 'B';
  const rankNumber = (hash % 5) + 1;
  const isFlash = Boolean(product.discountPrice || hash % 2 === 0);
  const isBest = Boolean(product.isBestseller || hash % 3 === 0);
  const isSponsored = hash % 4 === 0;

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <div 
      onClick={() => onOpenDetail(product)}
      className="group relative flex flex-col justify-between bg-white rounded-xl border border-gray-200/90 hover:border-gray-300 hover:shadow-md transition-all duration-200 overflow-hidden cursor-pointer select-none"
    >
      
      {/* 1. Ürün Görsel Sahnesi (Trendyol 3:4 Dikey Portre Oranı) */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F4F4]">
        
        {/* Ana Ürün Görseli */}
        <img
          src={primaryImg}
          alt={product.name}
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80';
          }}
          className={`h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105 ${
            secondaryImg !== primaryImg ? 'group-hover:opacity-0' : ''
          }`}
          loading="lazy"
        />

        {/* Hover'da İkinci Fotoğraf Geçişi (Masaüstü için) */}
        {secondaryImg !== primaryImg && (
          <img
            src={secondaryImg}
            alt={`${product.name} alternatif`}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = primaryImg;
            }}
            className="absolute inset-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out group-hover:scale-105"
            loading="lazy"
          />
        )}

        {/* SOL ÜST ROZET (Trendyol Yuvarlak Rozetleri) */}
        <div className="absolute top-2 left-2 z-10 pointer-events-none">
          {isBest ? (
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#EA580C] to-[#F97316] text-white flex flex-col items-center justify-center p-0.5 text-center shadow-md border-2 border-white/60">
              <span className="text-[7.5px] sm:text-[8px] font-black leading-[9px] uppercase tracking-tighter">
                EN ÇOK
              </span>
              <span className="text-[8px] sm:text-[9px] font-black leading-[9px] uppercase tracking-tighter">
                SATAN
              </span>
            </div>
          ) : isFlash ? (
            <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white flex flex-col items-center justify-center p-0.5 text-center shadow-md border-2 border-white/60">
              <span className="text-[7px] font-black leading-[8px] uppercase tracking-tighter text-amber-200">
                24 SAATTE 1
              </span>
              <span className="text-[8px] font-black leading-[9px] uppercase tracking-tighter">
                FLAŞ
              </span>
              <span className="text-[7px] font-black leading-[8px] uppercase tracking-tighter">
                ÜRÜN
              </span>
            </div>
          ) : (
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#0F172A] to-[#334155] text-white flex flex-col items-center justify-center p-0.5 text-center shadow-md border-2 border-white/60">
              <span className="text-[7px] text-amber-300 font-black leading-[8px]">★★</span>
              <span className="text-[7.5px] font-black leading-[9px] uppercase tracking-tighter">
                AVANTAJLI
              </span>
              <span className="text-[7px] font-black leading-[8px] uppercase tracking-tighter">
                ÜRÜN
              </span>
            </div>
          )}
        </div>

        {/* SAĞ ÜST: Favori Kalp Butonu (Beyaz Daire) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product);
          }}
          className={`absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform active:scale-90 hover:scale-105 z-10 shadow-sm ${
            isFavorite 
              ? 'bg-white text-rose-600' 
              : 'bg-white/90 hover:bg-white text-gray-700 hover:text-black border border-gray-100'
          }`}
          aria-label={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* SOL ALT: Sponsorlu Etiketi */}
        {isSponsored && (
          <span className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.5 rounded-xs pointer-events-none z-10">
            Sponsorlu
          </span>
        )}

        {/* ORTA ALT: Galeri Noktaları (•••) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-full pointer-events-none z-10">
          <span className="w-1 h-1 rounded-full bg-white"></span>
          <span className="w-1 h-1 rounded-full bg-white/50"></span>
          <span className="w-1 h-1 rounded-full bg-white/50"></span>
        </div>

        {/* SAĞ ALT: Renk Seçenekleri Rozeti (Renk çemberi + sayı) */}
        <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs text-gray-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-gray-200/80 z-10">
          <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-blue-500 via-pink-500 to-amber-400"></span>
          <span>{product.colors?.length || 2}</span>
        </div>

      </div>

      {/* 2. GÖRSEL ALTI TURUNCU FLAŞ / ÇOK SATAN BANT (Trendyol İmzası) */}
      {isFlash ? (
        <div className="bg-[#F27A1A] text-white text-[10px] sm:text-[11px] font-bold px-2 py-1 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Zap className="w-3 h-3 fill-white text-white" />
            <span>Flaş Ürün</span>
          </span>
          <span className="font-mono text-[9px] sm:text-[10px] tracking-wider font-extrabold bg-black/15 px-1.5 py-0.5 rounded-xs">
            {pad(countdown.hours)} : {pad(countdown.minutes)} : {pad(countdown.seconds)}
          </span>
        </div>
      ) : (
        <div className="bg-[#F27A1A] text-white text-[10px] sm:text-[11px] font-bold px-2 py-1 flex items-center gap-1.5">
          <Award className="w-3 h-3" />
          <span>En Çok Satan {rankNumber}. Ürün</span>
        </div>
      )}

      {/* 3. KART İÇERİK ALANI */}
      <div className="flex flex-col flex-1 p-2 sm:p-2.5 justify-between bg-white">
        
        <div>
          {/* Marka (Kalın) + Ürün Adı (Normal) */}
          <h3 
            className="text-[12px] sm:text-[13px] leading-[17px] line-clamp-2 text-gray-800 font-normal group-hover:text-[#F27A1A] transition-colors"
            title={product.name}
          >
            <span className="font-bold text-gray-900 mr-1">NEEFSANE</span>
            <svg className="inline-block w-3 h-3 text-[#1E90FF] -mt-0.5 mr-1" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <span>{product.name}</span>
          </h3>

          {/* Sosyal Kanıt (Trendyol Roket Satırı: 3 günde 1,5B kişi ekledi!) */}
          <div className="flex items-center gap-1 text-[#D80064] text-[10px] sm:text-[11px] font-bold mt-1">
            <span className="text-xs">🚀</span>
            <span>3 günde {socialCount} kişi ekledi!</span>
          </div>

          {/* Puan, Yıldızlar, Yorum Sayısı ve Fotoğraflı Yorum İkonu */}
          <div className="flex items-center gap-1 text-[11px] text-gray-600 mt-1 flex-wrap">
            <span className="font-extrabold text-gray-900">{product.rating || '4.8'}</span>
            <div className="flex text-amber-400 text-xs tracking-tighter">
              ★★★★★
            </div>
            <span className="text-gray-400 font-medium text-[10px]">
              ({product.reviewsCount || 417})
            </span>
            <Camera className="w-3 h-3 text-gray-400 ml-0.5" title="Fotoğraflı Değerlendirmeler" />
          </div>

          {/* Kampanya Rozetleri (Çok Al Az Öde, Kargo Bedava) */}
          <div className="flex flex-wrap items-center gap-1 text-[10px] font-semibold mt-1.5">
            {currentPrice >= 500 && (
              <span className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-xs flex items-center gap-0.5 border border-emerald-200/50">
                <Truck className="w-2.5 h-2.5" />
                <span>Kargo Bedava</span>
              </span>
            )}
            <span className="text-[#EA580C] bg-orange-50 px-1 py-0.5 rounded-xs border border-orange-200/50">
              🏷️ Çok Al Az Öde
            </span>
          </div>
        </div>

        {/* Fiyat Satırı ve Club Rozeti */}
        <div className="pt-2 mt-1 border-t border-gray-100">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-black text-[#F27A1A]">
              {Number(currentPrice).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
            </span>
            {originalPrice && (
              <span className="text-[11px] text-gray-400 line-through font-semibold">
                {Number(originalPrice).toLocaleString('tr-TR')} TL
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[9.5px] font-extrabold text-white bg-rose-600 px-1 py-0.5 rounded-xs">
                %{discountPercent}
              </span>
            )}
          </div>

          {/* NEEFSANE Plus / Club Fırsat Kutusu */}
          <div className="mt-1">
            <span className="bg-[#FFF0F5] text-[#D80064] text-[9.5px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded-xs inline-block">
              NEEFSANE Plus ile {(currentPrice * 0.92).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
            </span>
          </div>

          {/* Sepete Ekle Butonu */}
          <button
            type="button"
            onClick={handleAdd}
            className={`w-full mt-2 py-1.5 px-2 rounded-lg text-xs font-bold transition-all duration-150 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
              isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-gray-900 hover:bg-[#F27A1A] text-white active:scale-95'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Eklendi</span>
              </>
            ) : (
              <span>Sepete Ekle</span>
            )}
          </button>
        </div>

      </div>

    </div>
  );
}