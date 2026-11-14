import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  RotateCcw, 
  Share2, 
  Check
} from 'lucide-react';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80';

export default function ProductDetailModal({
  product,
  allProducts = [],
  isOpen,
  onClose,
  onAddToCart,
  onBuyNow,
  isFavorite,
  onToggleFavorite,
  onSelectRelatedProduct
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !product) return null;

  const activeImage = selectedImage || product.image;
  const activeColor = selectedColor || product.colors?.[0] || null;
  const activeModel = selectedModel || product.models?.[0] || null;

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleAddToCart = () => {
    onAddToCart({
      ...product,
      selectedColor: activeColor?.name,
      selectedColorHex: activeColor?.hex,
      selectedModel: activeModel,
      quantity: quantity
    });
  };

  const handleBuyNow = () => {
    onBuyNow({
      ...product,
      selectedColor: activeColor?.name,
      selectedColorHex: activeColor?.hex,
      selectedModel: activeModel,
      quantity: quantity
    });
  };

  // Find related products in the same category
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-sm animate-fadeIn">
      
      {/* Backdrop click to close */}
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Contained Modal Box - NEVER overflows screen */}
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden border border-gray-200 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Sticky Modal Header with Title & Close button */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 border-b border-gray-200 bg-white shrink-0">
          <div className="flex items-center gap-2 min-w-0 pr-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#C2410C] bg-orange-50 px-2 py-0.5 rounded border border-orange-200 shrink-0">
              {product.categoryName}
            </span>
            <span className="text-xs sm:text-sm font-bold text-gray-900 truncate">
              {product.name}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors shrink-0 cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Modal Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main 2-column Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            
            {/* Left Column: Gallery & Images (5 cols) */}
            <div className="md:col-span-5 space-y-3">
              
              {/* Main Image Box */}
              <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50 border border-gray-200 shadow-sm flex items-center justify-center">
                <img
                  src={activeImage}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                  className="w-full h-full object-cover object-center transition-all duration-300"
                />

                {/* Floating Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                  {product.tag && (
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#111827] text-white">
                      {product.tag}
                    </span>
                  )}
                  {discountPercent > 0 && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#C2410C] text-white">
                      %{discountPercent} İndirim
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails Row */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(img)}
                      className={`relative w-14 h-14 rounded-lg overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                        activeImage === img ? 'border-[#C2410C] ring-2 ring-[#C2410C]/20' : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img 
                        src={img} 
                        alt="" 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMG;
                        }}
                        className="w-full h-full object-cover" 
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-2 gap-2 pt-3 border-t border-gray-100 text-[11px] text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span>Aynı Gün Hızlı Kargo</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <RotateCcw className="w-3.5 h-3.5 text-[#C2410C]" />
                  <span>14 Gün Kolay İade</span>
                </div>
              </div>

            </div>

            {/* Right Column: Pricing, Options & Actions (7 cols) */}
            <div className="md:col-span-7 space-y-4">
              
              {/* Rating & Stock */}
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1 font-bold text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>{product.rating || '4.9'}</span>
                  <span className="text-gray-400 font-normal">({product.reviewsCount || 42} Değerlendirme)</span>
                </div>

                <div className="flex items-center gap-1.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-semibold text-emerald-700">Stokta Var</span>
                  {product.stockCount && product.stockCount <= 10 && (
                    <span className="text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded text-[10px] font-bold border border-amber-200">
                      Son {product.stockCount} adet!
                    </span>
                  )}
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-lg sm:text-xl font-extrabold text-gray-900 leading-snug">
                {product.name}
              </h1>

              {/* Price Banner */}
              <div className="flex items-baseline gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
                {product.discountPrice ? (
                  <>
                    <span className="text-2xl font-black text-[#111827]">
                      {product.discountPrice} TL
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      {product.price} TL
                    </span>
                    <span className="text-xs font-bold text-[#C2410C] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
                      %{discountPercent} İndirimli
                    </span>
                  </>
                ) : (
                  <span className="text-2xl font-black text-[#111827]">
                    {product.price} TL
                  </span>
                )}
                <span className="text-[11px] text-gray-400 ml-auto">KDV Dahil</span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Model / Device Variant Selector */}
              {product.models && product.models.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-900">Model / Ölçü:</span>
                    <span className="text-gray-500 font-medium">{activeModel}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.models.map((mod, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedModel(mod)}
                        className={`text-xs px-2.5 py-1.5 rounded-lg border font-medium transition-all cursor-pointer ${
                          activeModel === mod
                            ? 'bg-[#111827] text-white border-[#111827]'
                            : 'bg-white text-gray-700 border-gray-300 hover:border-gray-500'
                        }`}
                      >
                        {mod}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Variant Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-900">Renk:</span>
                    <span className="text-gray-500 font-medium">{activeColor?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.colors.map((c, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedColor(c)}
                        className={`relative w-7 h-7 rounded-full border-2 transition-all cursor-pointer flex items-center justify-center ${
                          activeColor?.name === c.name ? 'border-[#C2410C] scale-110 shadow-sm' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {activeColor?.name === c.name && (
                          <Check className={`w-3.5 h-3.5 ${c.hex === '#f8fafc' || c.hex === '#cbd5e1' ? 'text-black' : 'text-white'}`} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity & Actions Bar */}
              <div className="pt-2 space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-700">Adet:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-2.5 py-1 hover:bg-gray-100 text-gray-700 text-sm font-bold"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-gray-900 min-w-8 text-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-2.5 py-1 hover:bg-gray-100 text-gray-700 text-sm font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="p-1.5 text-gray-500 hover:text-black rounded-lg hover:bg-gray-100 transition-colors ml-auto text-xs flex items-center gap-1 cursor-pointer"
                    title="Ürünü Paylaş"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>{copiedLink ? 'Kopyalandı!' : 'Paylaş'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-sm"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Sepete Ekle</span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    className="flex-1 bg-[#C2410C] hover:bg-[#9a3412] text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors cursor-pointer shadow-sm"
                  >
                    Hemen Al
                  </button>

                  <button
                    onClick={() => onToggleFavorite(product)}
                    className={`p-3 rounded-xl border transition-colors cursor-pointer ${
                      isFavorite 
                        ? 'bg-rose-50 border-rose-200 text-[#C2410C]' 
                        : 'border-gray-300 hover:border-gray-500 text-gray-700'
                    }`}
                    title="Favorilere Ekle"
                  >
                    <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Product Specifications Checklist */}
              {product.features && (
                <div className="pt-3 border-t border-gray-100 space-y-1.5">
                  <div className="text-xs font-bold text-gray-900">Teknik Özellikler</div>
                  <ul className="text-xs text-gray-600 space-y-1 list-disc list-inside">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {feat}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>

          </div>

          {/* Similar Products Section */}
          {relatedProducts.length > 0 && (
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">
                Benzer Ürünler
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {relatedProducts.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onSelectRelatedProduct(rel)}
                    className="bg-gray-50 hover:bg-white p-2.5 rounded-xl border border-gray-200 hover:border-gray-400 transition-all cursor-pointer group"
                  >
                    <div className="aspect-square w-full rounded-lg overflow-hidden bg-white mb-2">
                      <img 
                        src={rel.image} 
                        alt={rel.name} 
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = FALLBACK_IMG;
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                      />
                    </div>
                    <div className="text-xs font-bold text-gray-900 truncate group-hover:text-[#C2410C]">
                      {rel.name}
                    </div>
                    <div className="text-xs font-black text-[#111827] mt-1">
                      {rel.discountPrice || rel.price} TL
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
