import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  Star, 
  ShoppingBag, 
  Eye, 
  Truck, 
  Check, 
  Camera, 
  Zap, 
  Award 
} from 'lucide-react';

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onOpenDetail
}) {
  const [isAdded, setIsAdded] = useState(false);

  // Live ticking countdown for mobile flash badge (Trendyol style: 23 : 14 : 05)
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

  // Generate deterministic social proof numbers for mobile Trendyol view
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
    <>
      {/* ========================================================================= */}
      {/* 1. MOBİL GÖRÜNÜM: TRENDYOL BİREBİR KARTI (SADECE MOBİLDE - lg:hidden)      */}
      {/* ========================================================================= */}
      <div 
        onClick={() => onOpenDetail(product)}
        className="block lg:hidden group relative flex flex-col justify-between bg-white rounded-xl border border-gray-200/90 shadow-2xs overflow-hidden cursor-pointer select-none"
      >
        {/* Ürün Görseli (Trendyol 3:4 Dikey Portre Oranı) */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#F4F4F4]">
          <img
            src={primaryImg}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80';
            }}
            className="h-full w-full object-cover object-center"
            loading="lazy"
          />

          {/* Sol Üst Yuvarlak Rozet */}
          <div className="absolute top-2 left-2 z-10 pointer-events-none">
            {isBest ? (
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#EA580C] to-[#F97316] text-white flex flex-col items-center justify-center p-0.5 text-center shadow-md border-2 border-white/60">
                <span className="text-[7.5px] font-black leading-[9px] uppercase tracking-tighter">EN ÇOK</span>
                <span className="text-[8px] font-black leading-[9px] uppercase tracking-tighter">SATAN</span>
              </div>
            ) : isFlash ? (
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#7C3AED] via-[#A855F7] to-[#EC4899] text-white flex flex-col items-center justify-center p-0.5 text-center shadow-md border-2 border-white/60">
                <span className="text-[7px] font-black leading-[8px] uppercase tracking-tighter text-amber-200">24 SAATTE 1</span>
                <span className="text-[8px] font-black leading-[9px] uppercase tracking-tighter">FLAŞ</span>
                <span className="text-[7px] font-black leading-[8px] uppercase tracking-tighter">ÜRÜN</span>
              </div>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#0F172A] to-[#334155] text-white flex flex-col items-center justify-center p-0.5 text-center shadow-md border-2 border-white/60">
                <span className="text-[7px] text-amber-300 font-black leading-[8px]">★★</span>
                <span className="text-[7.5px] font-black leading-[9px] uppercase tracking-tighter">AVANTAJLI</span>
                <span className="text-[7px] font-black leading-[8px] uppercase tracking-tighter">ÜRÜN</span>
              </div>
            )}
          </div>

          {/* Sağ Üst Favori Butonu */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center active:scale-90 z-10 shadow-sm ${
              isFavorite 
                ? 'bg-white text-rose-600' 
                : 'bg-white/90 text-gray-700 border border-gray-100'
            }`}
            aria-label="Favori"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>

          {/* Sponsorlu */}
          {isSponsored && (
            <span className="absolute bottom-2 left-2 bg-black/40 backdrop-blur-xs text-white text-[9px] font-medium px-1.5 py-0.5 rounded-xs pointer-events-none z-10">
              Sponsorlu
            </span>
          )}

          {/* Noktalar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/30 backdrop-blur-xs px-2 py-0.5 rounded-full pointer-events-none z-10">
            <span className="w-1 h-1 rounded-full bg-white"></span>
            <span className="w-1 h-1 rounded-full bg-white/50"></span>
            <span className="w-1 h-1 rounded-full bg-white/50"></span>
          </div>

          {/* Renk Çemberi */}
          <div className="absolute bottom-2 right-2 bg-white/95 backdrop-blur-xs text-gray-800 text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 border border-gray-200/80 z-10">
            <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-blue-500 via-pink-500 to-amber-400"></span>
            <span>{product.colors?.length || 2}</span>
          </div>
        </div>

        {/* Görsel Altı Flaş / Çok Satan Şerit */}
        {isFlash ? (
          <div className="bg-[#F27A1A] text-white text-[10px] font-bold px-2 py-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Zap className="w-3 h-3 fill-white text-white" />
              <span>Flaş Ürün</span>
            </span>
            <span className="font-mono text-[9px] tracking-wider font-extrabold bg-black/15 px-1.5 py-0.5 rounded-xs">
              {pad(countdown.hours)} : {pad(countdown.minutes)} : {pad(countdown.seconds)}
            </span>
          </div>
        ) : (
          <div className="bg-[#F27A1A] text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1.5">
            <Award className="w-3 h-3" />
            <span>En Çok Satan {rankNumber}. Ürün</span>
          </div>
        )}

        {/* İçerik */}
        <div className="flex flex-col flex-1 p-2 justify-between bg-white">
          <div>
            <h3 className="text-[12px] leading-[17px] line-clamp-2 text-gray-800 font-normal">
              <span className="font-bold text-gray-900 mr-1">NEEFSANE</span>
              <svg className="inline-block w-3 h-3 text-[#1E90FF] -mt-0.5 mr-1" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
              <span>{product.name}</span>
            </h3>

            {/* Sosyal Kanıt */}
            <div className="flex items-center gap-1 text-[#D80064] text-[10px] font-bold mt-1">
              <span className="text-xs">🚀</span>
              <span>3 günde {socialCount} kişi ekledi!</span>
            </div>

            {/* Yıldız ve Yorum */}
            <div className="flex items-center gap-1 text-[11px] text-gray-600 mt-1 flex-wrap">
              <span className="font-extrabold text-gray-900">{product.rating || '4.8'}</span>
              <div className="flex text-amber-400 text-xs tracking-tighter">★★★★★</div>
              <span className="text-gray-400 font-medium text-[10px]">({product.reviewsCount || 417})</span>
              <Camera className="w-3 h-3 text-gray-400 ml-0.5" />
            </div>

            {/* Rozetler */}
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

          <div className="pt-2 mt-1 border-t border-gray-100">
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-sm font-black text-[#F27A1A]">
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

            <div className="mt-1">
              <span className="bg-[#FFF0F5] text-[#D80064] text-[9.5px] font-bold px-1.5 py-0.5 rounded-xs inline-block">
                NEEFSANE Plus ile {(currentPrice * 0.92).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL
              </span>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`w-full mt-2 py-1.5 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-900 active:scale-95 text-white'
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

      {/* ========================================================================= */}
      {/* 2. MASAÜSTÜ GÖRÜNÜM: ORİJİNAL LÜKS KART (ASLA DEĞİŞMEDİ - hidden lg:flex)  */}
      {/* ========================================================================= */}
      <div 
        onClick={() => onOpenDetail(product)}
        className="hidden lg:flex group relative flex-col justify-between rounded-2xl bg-white border border-gray-200/90 hover:border-gray-400/80 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer select-none"
      >
        {/* Product Image Stage (Square, spacious & wide framing) */}
        <div className="relative aspect-square w-full overflow-hidden bg-[#F8F9FA]">
          <img
            src={primaryImg}
            alt={product.name}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80';
            }}
            className={`h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-105 ${
              secondaryImg !== primaryImg ? 'group-hover:opacity-0' : ''
            }`}
            loading="lazy"
          />

          {secondaryImg !== primaryImg && (
            <img
              src={secondaryImg}
              alt={`${product.name} alternatif görünüm`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = primaryImg;
              }}
              className="absolute inset-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out group-hover:scale-105"
              loading="lazy"
            />
          )}

          {/* Floating Quick View Pill */}
          <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 flex justify-center pointer-events-none z-10">
            <span className="bg-white/95 backdrop-blur-md text-gray-900 text-[11px] font-black px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-white/60">
              <Eye className="w-3.5 h-3.5 text-[#C2410C]" />
              <span>Detaylı İncele</span>
            </span>
          </div>

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10 pointer-events-none">
            {product.tag && (
              <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#111827]/90 text-white shadow-2xs backdrop-blur-xs">
                {product.tag}
              </span>
            )}
            {discountPercent > 0 && (
              <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#C2410C] text-white shadow-2xs">
                %{discountPercent} İndirim
              </span>
            )}
          </div>

          {/* Wishlist Glass Heart Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(product);
            }}
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-xs z-10 ${
              isFavorite 
                ? 'bg-rose-50 text-rose-600 border border-rose-200' 
                : 'bg-white/85 hover:bg-white text-gray-600 hover:text-black border border-white/60 hover:scale-110 active:scale-95'
            }`}
            aria-label={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
            title={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
          </button>

          {/* Low Stock Warning */}
          {product.stockCount <= 5 && product.stockCount > 0 && (
            <div className="absolute bottom-2 left-2.5 bg-amber-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-2xs backdrop-blur-xs z-10">
              Son {product.stockCount} adet
            </div>
          )}
        </div>

        {/* Card Content Body */}
        <div className="flex flex-col flex-1 p-3.5 sm:p-4 justify-between bg-white">
          <div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 truncate">
              NEEFSANE • {product.categoryName || product.category}
            </div>

            <h3 
              className="font-bold text-gray-900 text-xs sm:text-[13px] line-clamp-2 leading-snug group-hover:text-[#C2410C] transition-colors mb-2"
              title={product.name}
            >
              {product.name}
            </h3>

            <div className="flex items-center justify-between text-xs mb-2">
              <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span className="text-gray-900 font-extrabold text-xs">{product.rating || '4.9'}</span>
                <span className="text-gray-400 font-medium text-[11px]">({product.reviewsCount || 124})</span>
              </div>

              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                <Truck className="w-3 h-3 text-emerald-600" />
                <span>Hızlı Kargo</span>
              </span>
            </div>

            {product.colors && product.colors.length > 0 && (
              <div className="flex items-center gap-1.5 mb-2.5">
                {product.colors.slice(0, 4).map((c, idx) => (
                  <span
                    key={idx}
                    className="w-3 h-3 rounded-full border border-gray-300 shadow-2xs"
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
                {product.colors.length > 4 && (
                  <span className="text-[10px] font-semibold text-gray-400">+{product.colors.length - 4}</span>
                )}
              </div>
            )}
          </div>

          <div className="pt-2.5 border-t border-gray-100 mt-auto">
            <div className="flex items-baseline justify-between gap-2">
              <div className="flex items-baseline gap-2">
                <span className="text-base sm:text-lg font-black text-[#111827]">
                  {currentPrice} TL
                </span>
                {originalPrice && (
                  <span className="text-xs text-gray-400 line-through font-semibold">
                    {originalPrice} TL
                  </span>
                )}
              </div>

              {discountPercent > 0 && (
                <span className="text-[10px] font-extrabold text-[#C2410C] bg-orange-50 border border-orange-200/60 px-1.5 py-0.5 rounded-md">
                  %{discountPercent} İndirim
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={handleAdd}
              className={`w-full mt-3 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#111827] hover:bg-[#C2410C] text-white active:scale-[0.99]'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Sepete Eklendi</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Sepete Ekle</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
