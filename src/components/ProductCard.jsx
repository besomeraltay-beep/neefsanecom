import React, { useState } from 'react';
import { Heart, Star, ShoppingBag, Eye, Truck, Check } from 'lucide-react';

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onOpenDetail
}) {
  const [isAdded, setIsAdded] = useState(false);

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const currentPrice = product.discountPrice || product.price;
  const originalPrice = product.discountPrice ? product.price : null;

  // Primary and secondary hover image
  const primaryImg = product.image || (product.images && product.images[0]);
  const secondaryImg = (product.images && product.images[1]) || primaryImg;

  const handleAdd = (e) => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1200);
  };

  return (
    <div 
      onClick={() => onOpenDetail(product)}
      className="group relative flex flex-col justify-between rounded-2xl bg-white border border-gray-200/90 hover:border-gray-400/80 hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer select-none"
    >
      
      {/* Product Image Stage (Square, spacious & wide framing) */}
      <div className="relative aspect-square w-full overflow-hidden bg-[#F8F9FA]">
        
        {/* Main Base Image */}
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

        {/* Secondary Image on Hover (Luxury Storefront Crossfade) */}
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
          {/* Subtitle / Brand Category */}
          <div className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 truncate">
            NEEFSANE • {product.categoryName || product.category}
          </div>

          {/* Product Name */}
          <h3 
            className="font-bold text-gray-900 text-xs sm:text-[13px] line-clamp-2 leading-snug group-hover:text-[#C2410C] transition-colors mb-2"
            title={product.name}
          >
            {product.name}
          </h3>

          {/* Rating & Fast Delivery Pill */}
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

          {/* Color preview dots */}
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

        {/* Pricing & Add to Cart Button */}
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

          {/* Full-width High-Conversion Button */}
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
  );
}
