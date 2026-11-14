import React, { useState, useEffect } from 'react';
import { 
  Star, 
  ShoppingBag, 
  Heart, 
  Truck, 
  RotateCcw, 
  Share2, 
  Check, 
  ArrowLeft,
  ShieldCheck,
  Zap
} from 'lucide-react';
import ProductCard from './ProductCard';

const FALLBACK_IMG = 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80';

export default function ProductDetailPage({
  product,
  allProducts = [],
  onBackToStore,
  onAddToCart,
  onBuyNow,
  isFavorite,
  onToggleFavorite,
  onSelectProduct,
  wishlist = [],
  onShowToast
}) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedModel, setSelectedModel] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState('description'); // 'description', 'features', 'shipping'

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Ürün Bulunamadı</h2>
        <p className="text-xs text-gray-500 mb-4">Aradığınız ürün mevcut değil veya kaldırılmış olabilir.</p>
        <button
          onClick={onBackToStore}
          className="px-6 py-2.5 bg-[#111827] text-white text-xs font-bold rounded-xl"
        >
          Mağazaya Geri Dön
        </button>
      </div>
    );
  }

  const activeImage = selectedImage || product.image;
  const activeColor = selectedColor || product.colors?.[0] || null;
  const activeModel = selectedModel || product.models?.[0] || null;

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  const handleShare = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      if (typeof onShowToast === 'function') {
        onShowToast('Ürün bağlantısı panoya kopyalandı.');
      }
    }
  };

  const handleAddToCartClick = () => {
    onAddToCart({
      ...product,
      selectedColor: activeColor?.name,
      selectedColorHex: activeColor?.hex,
      selectedModel: activeModel,
      quantity: quantity
    });
  };

  const handleBuyNowClick = () => {
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
    <div className="min-h-screen bg-[#F8F9FA] py-6 sm:py-8">
      <div className="w-full max-w-[1240px] mx-auto px-4 sm:px-6">
        
        {/* Breadcrumb Navigation & Back Button */}
        <div className="flex items-center justify-between gap-4 mb-5 pb-3 border-b border-gray-200">
          <nav className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
            <button 
              onClick={onBackToStore} 
              className="hover:text-black font-medium transition-colors cursor-pointer"
            >
              Ana Sayfa
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-600 font-medium">
              {product.categoryName || product.category}
            </span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-bold truncate max-w-[200px] sm:max-w-md">
              {product.name}
            </span>
          </nav>

          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-black transition-colors cursor-pointer shrink-0 bg-white border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kataloğa Dön</span>
          </button>
        </div>

        {/* Main Product Layout (Compact, Fits Screen Without Overflowing) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 bg-white rounded-2xl border border-gray-200/90 p-5 sm:p-7 shadow-xs mb-8">
          
          {/* Left Column: Image Gallery (5 cols, max 440px) */}
          <div className="lg:col-span-5 flex flex-col items-center lg:items-start space-y-3.5 w-full">
            
            {/* Main Stage Image (Constrained to max-w-[440px] so it fits screen viewport) */}
            <div className="relative aspect-square w-full max-w-[440px] mx-auto lg:mx-0 rounded-2xl bg-gray-50 overflow-hidden border border-gray-200 group shadow-xs">
              <img
                src={activeImage}
                alt={product.name}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = FALLBACK_IMG;
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />

              {/* Floating Badges */}
              <div className="absolute top-3 left-3 flex flex-col gap-1 items-start z-10 pointer-events-none">
                {product.tag && (
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#111827] text-white shadow-xs">
                    {product.tag}
                  </span>
                )}
                {discountPercent > 0 && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-[#C2410C] text-white shadow-xs">
                    %{discountPercent} İndirim
                  </span>
                )}
              </div>

              {/* Share & Wishlist Floating Action Buttons */}
              <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
                <button
                  onClick={() => onToggleFavorite(product)}
                  className={`p-2 rounded-full transition-all duration-200 shadow-md cursor-pointer ${
                    isFavorite 
                      ? 'bg-[#C2410C] text-white' 
                      : 'bg-white/90 hover:bg-white text-gray-700 hover:text-black'
                  }`}
                  aria-label="Favorilere Ekle"
                  title="Favorilere Ekle"
                >
                  <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                </button>

                <button
                  onClick={handleShare}
                  className="p-2 rounded-full bg-white/90 hover:bg-white text-gray-700 hover:text-black transition-all shadow-md cursor-pointer"
                  aria-label="Paylaş"
                  title="Ürün Bağlantısını Kopyala"
                >
                  {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                </button>
              </div>

              {/* Low Stock Warning */}
              {product.stockCount <= 5 && product.stockCount > 0 && (
                <div className="absolute bottom-3 left-3 bg-amber-50/95 backdrop-blur-xs border border-amber-300 text-amber-900 text-[11px] font-bold px-2.5 py-0.5 rounded-lg shadow-xs z-10">
                  ⚡ Son {product.stockCount} adet kaldı!
                </div>
              )}
            </div>

            {/* Thumbnail Row */}
            {Array.isArray(product.images) && product.images.length > 1 && (
              <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1 w-full max-w-[440px]">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all cursor-pointer ${
                      activeImage === img 
                        ? 'border-[#C2410C] ring-2 ring-[#C2410C]/20 shadow-xs' 
                        : 'border-gray-200 hover:border-gray-300 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust Highlights */}
            <div className="grid grid-cols-2 gap-2.5 pt-1 text-xs w-full max-w-[440px]">
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />
                <span className="font-semibold text-gray-700 text-[11px]">Aynı Gün Hızlı Kargo</span>
              </div>
              <div className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-gray-700 text-[11px]">14 Gün Kolay İade</span>
              </div>
            </div>

          </div>

          {/* Right Column: Product Info & Purchase Options (7 cols) */}
          <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
            
            <div className="space-y-4">
              
              {/* Category, Rating & Reviews */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 pb-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-[#C2410C] bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200/80">
                  {product.categoryName}
                </span>

                <div className="flex items-center gap-2 text-xs">
                  <div className="flex items-center gap-1 text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{product.rating || '4.9'}</span>
                  </div>
                  <span className="text-gray-400">•</span>
                  <span className="text-gray-500 font-medium">{product.reviewsCount || 128} Değerlendirme</span>
                  <span className="text-gray-400">•</span>
                  <span className="text-emerald-700 font-bold">Stokta Var</span>
                </div>
              </div>

              {/* Product Title */}
              <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight leading-snug">
                {product.name}
              </h1>

              {/* Price Box */}
              <div className="p-3 sm:p-3.5 rounded-xl bg-gray-50 border border-gray-200/80 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-[#111827]">
                  {product.discountPrice || product.price} TL
                </span>
                {product.discountPrice && (
                  <>
                    <span className="text-base text-gray-400 line-through font-semibold">
                      {product.price} TL
                    </span>
                    <span className="text-[11px] font-bold text-[#C2410C] bg-orange-100/80 px-2 py-0.5 rounded-md">
                      %{discountPercent} Kazanç
                    </span>
                  </>
                )}
              </div>

              {/* Model / Size Variants */}
              {Array.isArray(product.models) && product.models.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-900">Seçenek / Boyut:</span>
                    <span className="text-gray-500 font-medium">{activeModel}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.models.map((mod) => (
                      <button
                        key={mod}
                        type="button"
                        onClick={() => setSelectedModel(mod)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                          activeModel === mod
                            ? 'bg-[#111827] text-white shadow-2xs'
                            : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        {mod}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Variants */}
              {Array.isArray(product.colors) && product.colors.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-900">Renk Seçimi:</span>
                    <span className="text-gray-500 font-medium">{activeColor?.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {product.colors.map((color) => {
                      const isSelected = activeColor?.name === color.name;
                      return (
                        <button
                          key={color.name}
                          type="button"
                          onClick={() => setSelectedColor(color)}
                          className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                            isSelected 
                              ? 'ring-2 ring-offset-2 ring-[#111827] scale-105 shadow-xs' 
                              : 'hover:scale-105 opacity-80 hover:opacity-100'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        >
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-white drop-shadow-md stroke-[3]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center gap-3 pt-2">
                <span className="text-xs font-bold text-gray-900">Adet:</span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3.5 py-1.5 text-xs font-bold text-gray-900 min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3.5 py-1.5 text-gray-600 hover:bg-gray-100 font-bold transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>

            </div>

            {/* CTAs: Add to Cart & Buy Now */}
            <div className="pt-3 space-y-2.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                
                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={handleAddToCartClick}
                  className="w-full py-3.5 px-5 bg-[#111827] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Sepete Ekle</span>
                </button>

                {/* Buy Now */}
                <button
                  type="button"
                  onClick={handleBuyNowClick}
                  className="w-full py-3.5 px-5 bg-[#C2410C] hover:bg-[#9a3412] text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Zap className="w-4 h-4" />
                  <span>Hemen Satın Al</span>
                </button>
              </div>

              {/* Safe Checkout Badges */}
              <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 text-emerald-900 flex items-center justify-between text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>256-Bit SSL 3D Secure ile Güvenli Ödeme</span>
                </span>
                <span className="text-[11px] text-emerald-700">Orijinal Ürün Garantisi</span>
              </div>

            </div>

          </div>

        </div>

        {/* Tabbed Product Details & Features Section */}
        <div className="bg-white rounded-3xl border border-gray-200/90 p-6 sm:p-8 mb-12 shadow-xs">
          
          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6 gap-6">
            <button
              onClick={() => setActiveTab('description')}
              className={`pb-3 text-xs sm:text-sm font-black transition-all cursor-pointer relative ${
                activeTab === 'description' 
                  ? 'text-[#C2410C]' 
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span>Ürün Açıklaması</span>
              {activeTab === 'description' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C2410C] rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('features')}
              className={`pb-3 text-xs sm:text-sm font-black transition-all cursor-pointer relative ${
                activeTab === 'features' 
                  ? 'text-[#C2410C]' 
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span>Özellikler & Detaylar</span>
              {activeTab === 'features' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C2410C] rounded-full"></span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('shipping')}
              className={`pb-3 text-xs sm:text-sm font-black transition-all cursor-pointer relative ${
                activeTab === 'shipping' 
                  ? 'text-[#C2410C]' 
                  : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <span>Kargo & Teslimat Bilgisi</span>
              {activeTab === 'shipping' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C2410C] rounded-full"></span>
              )}
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === 'description' && (
            <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed max-w-4xl animate-fadeIn">
              <p>{product.description}</p>
              <p className="text-gray-500">
                NEEFSANE markası altında üretilen tüm ürünler, titiz kalite kontrol aşamalarından geçirilerek kargoya hazırlanır. Özel darbe emici kutusunda güvenle teslim edilir.
              </p>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="space-y-3 max-w-2xl animate-fadeIn">
              {Array.isArray(product.features) && product.features.length > 0 ? (
                <ul className="space-y-2">
                  {product.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-700">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#C2410C] shrink-0"></div>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-500">Bu ürün için ek teknik özellik bulunmamaktadır.</p>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="space-y-3 text-xs sm:text-sm text-gray-700 max-w-3xl animate-fadeIn">
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-2">
                <h4 className="font-bold text-gray-900 flex items-center gap-2">
                  <Truck className="w-4 h-4 text-[#C2410C]" />
                  <span>Kargo Süreci & Anlaşmalı Firmalar</span>
                </h4>
                <p className="text-xs text-gray-600">
                  Siparişleriniz <strong>MNG Kargo, Yurtiçi Kargo veya Aras Kargo</strong> güvencesiyle sigortalı olarak gönderilir. Saat 16:00'a kadar verilen tüm siparişler aynı gün kargoya teslim edilmektedir.
                </p>
                <p className="text-xs text-gray-600">
                  500 TL ve üzeri siparişlerde kargo tamamen <strong>ücretsizdir</strong>.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Related Products Showcase */}
        {relatedProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                  Benzer Ürünler
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Bu kategoride en çok tercih edilen diğer koleksiyon parçaları
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  isFavorite={wishlist.some(item => item.id === relProduct.id)}
                  onToggleFavorite={onToggleFavorite}
                  onAddToCart={onAddToCart}
                  onOpenDetail={onSelectProduct}
                />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
