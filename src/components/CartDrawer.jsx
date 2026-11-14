import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  Check, 
  ShieldCheck 
} from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onProceedCheckout,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  coupons = []
}) {
  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 500;
  const SHIPPING_FEE = 49;

  const rawSubtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.discountPrice || item.price;
    return acc + (itemPrice * item.quantity);
  }, 0);

  const discountAmount = appliedCoupon 
    ? (appliedCoupon.type === 'percent' ? Math.round(rawSubtotal * appliedCoupon.value) : appliedCoupon.value)
    : 0;

  const subtotalAfterDiscount = Math.max(0, rawSubtotal - discountAmount);
  const isFreeShipping = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD || cartItems.length === 0;
  const shippingCost = isFreeShipping ? 0 : SHIPPING_FEE;
  const grandTotal = cartItems.length === 0 ? 0 : (subtotalAfterDiscount + shippingCost);

  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalAfterDiscount);
  const freeShippingProgress = Math.min(100, (subtotalAfterDiscount / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    // Check dynamic coupons
    const foundCoupon = coupons.find(c => c.code.toUpperCase() === code && c.isActive !== false);
    if (foundCoupon) {
      if (foundCoupon.minSpend && rawSubtotal < foundCoupon.minSpend) {
        setCouponError(`Bu kupon minimum ${foundCoupon.minSpend} TL sepet tutarında geçerlidir.`);
        return;
      }
      onApplyCoupon({
        code: foundCoupon.code,
        value: foundCoupon.value,
        type: foundCoupon.type,
        label: foundCoupon.label || (foundCoupon.type === 'percent' ? `%${Math.round(foundCoupon.value * 100)} İndirim` : `${foundCoupon.value} TL İndirim`)
      });
      setCouponInput('');
      return;
    }

    if (code === 'HOSGELDIN10') {
      onApplyCoupon({ code: 'HOSGELDIN10', value: 0.10, type: 'percent', label: '%10 İlk Sipariş İndirimi' });
      setCouponInput('');
    } else if (code === 'EFSANE10') {
      onApplyCoupon({ code: 'EFSANE10', value: 0.10, type: 'percent', label: '%10 İndirim' });
      setCouponInput('');
    } else if (code === 'NEEF20') {
      onApplyCoupon({ code: 'NEEF20', value: 0.20, type: 'percent', label: '%20 Lansman İndirimi' });
      setCouponInput('');
    } else {
      setCouponError('Geçersiz veya süresi dolmuş kupon kodu. (Örnek: HOSGELDIN10)');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-100 bg-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center text-gray-800">
                <ShoppingBag className="w-5 h-5 text-[#111827]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-bold text-gray-900 tracking-tight">Alışveriş Sepetim</h2>
                  <span className="bg-gray-100 text-gray-700 text-[11px] font-bold px-2 py-0.5 rounded-full">
                    {cartItems.reduce((acc, i) => acc + i.quantity, 0)} Ürün
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">{cartItems.length} farklı ürün</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 flex items-center justify-center transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator (Modern & Elegant) */}
          {cartItems.length > 0 && (
            <div className={`p-3.5 border-b transition-all ${
              isFreeShipping 
                ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-100' 
                : 'bg-orange-50/70 border-orange-100'
            }`}>
              <div className="flex items-center justify-between text-xs mb-1.5 font-semibold">
                <span className="flex items-center gap-2">
                  <Truck className={`w-4 h-4 ${isFreeShipping ? 'text-emerald-600' : 'text-[#f27a1a]'}`} />
                  {isFreeShipping ? (
                    <span className="text-emerald-900 font-bold flex items-center gap-1.5">
                      <span>Tebrikler!</span>
                      <span className="text-emerald-700 font-normal">Kargonuz Ücretsiz.</span>
                    </span>
                  ) : (
                    <span className="text-gray-800">
                      Ücretsiz kargoya <strong className="text-[#f27a1a]">{remainingForFreeShipping} TL</strong> kaldı
                    </span>
                  )}
                </span>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  isFreeShipping 
                    ? 'bg-emerald-600 text-white' 
                    : 'bg-orange-100 text-[#f27a1a]'
                }`}>
                  {isFreeShipping ? 'Kargo Bedava' : '500 TL'}
                </span>
              </div>
              <div className="w-full bg-gray-200/70 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isFreeShipping 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                      : 'bg-gradient-to-r from-amber-500 to-[#f27a1a]'
                  }`}
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Cart Items List or Empty State */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#F8F9FA]">
            {cartItems.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-white border border-gray-200 shadow-sm flex items-center justify-center text-gray-400">
                  <ShoppingBag className="w-8 h-8 text-gray-300" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Sepetiniz Henüz Boş</h3>
                  <p className="text-xs text-gray-500 max-w-xs mt-1">
                    Favori 3D figürlerinizi ve şık aksesuarlarınızı sepetinize ekleyerek alışverişe başlayın.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-sm"
                >
                  Alışverişe Başla
                </button>
              </div>
            ) : (
              cartItems.map((item, idx) => {
                const itemPrice = item.discountPrice || item.price;
                return (
                  <div 
                    key={`${item.id}-${item.selectedColor || ''}-${item.selectedModel || ''}-${idx}`}
                    className="group relative bg-white rounded-2xl border border-gray-200/90 hover:border-gray-300 p-3.5 shadow-xs hover:shadow-sm transition-all flex gap-3.5"
                  >
                    {/* Item Image */}
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0 shadow-2xs">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Details Column */}
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <div>
                        {/* Title & Delete Button */}
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="text-xs sm:text-[13px] font-bold text-gray-900 line-clamp-2 leading-snug">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item)}
                            className="text-gray-400 hover:text-rose-600 hover:bg-rose-50 p-1.5 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Ürünü Sepetten Çıkar"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Selected Variants Pills */}
                        {(item.selectedModel || item.selectedColor) && (
                          <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                            {item.selectedModel && (
                              <span className="bg-gray-100 text-gray-700 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-gray-200/60">
                                {item.selectedModel}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="bg-orange-50 text-orange-800 text-[10px] font-semibold px-2 py-0.5 rounded-md border border-orange-200/60 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#f27a1a]"></span>
                                {item.selectedColor}
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Quantity & Price Bottom Row */}
                      <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
                        {/* Apple/Trendyol Style Quantity Pill Counter */}
                        <div className="flex items-center bg-[#f3f4f6] rounded-lg p-0.5 border border-gray-200/70 shadow-2xs">
                          <button
                            onClick={() => onUpdateQuantity(item, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-white hover:bg-gray-100 active:scale-90 text-gray-700 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
                            title="Adet Azalt"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-bold text-xs text-gray-900 font-mono select-none">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item, item.quantity + 1)}
                            className="w-6 h-6 rounded-md bg-white hover:bg-gray-100 active:scale-90 text-gray-700 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
                            title="Adet Artır"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price Display */}
                        <div className="text-right">
                          <div className="text-sm sm:text-[15px] font-black text-gray-950 font-mono tracking-tight">
                            {itemPrice * item.quantity} TL
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-[10px] text-gray-400 font-medium">
                              (adet {itemPrice} TL)
                            </div>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Order Summary */}
          {cartItems.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-gray-200 bg-white space-y-3.5 shadow-lg">
              
              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="İndirim Kodu (HOSGELDIN10)"
                    className="w-full bg-[#f9fafb] text-gray-900 text-xs rounded-xl pl-8 pr-3 py-2.5 border border-gray-200 focus:border-[#111827] focus:bg-white focus:outline-none uppercase font-mono tracking-wider transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-xl transition-colors cursor-pointer shadow-xs shrink-0"
                >
                  Uygula
                </button>
              </form>

              {/* Quick Coupon Chip if not applied */}
              {!appliedCoupon && (
                <div className="flex items-center justify-between text-[11px] text-gray-500 bg-orange-50/60 border border-orange-100 rounded-lg px-2.5 py-1.5">
                  <span className="flex items-center gap-1 text-gray-700">
                    <span>💡 İlk siparişinizde %10 indirim:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      onApplyCoupon({ code: 'HOSGELDIN10', value: 0.10, type: 'percent', label: '%10 İlk Sipariş İndirimi' });
                    }}
                    className="text-[#f27a1a] font-mono font-bold hover:underline cursor-pointer"
                  >
                    HOSGELDIN10 Uygula
                  </button>
                </div>
              )}

              {couponError && (
                <div className="text-[11px] text-rose-600 font-medium px-1">{couponError}</div>
              )}

              {appliedCoupon && (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-semibold animate-fadeIn">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{appliedCoupon.label}</span>
                    <span className="font-mono bg-white px-1.5 py-0.5 rounded text-[10px] border border-emerald-200 text-emerald-900">
                      {appliedCoupon.code}
                    </span>
                  </span>
                  <button 
                    onClick={onRemoveCoupon}
                    className="text-rose-600 hover:text-rose-800 text-[11px] font-bold hover:underline cursor-pointer"
                  >
                    Kaldır
                  </button>
                </div>
              )}

              {/* Price Breakdown */}
              <div className="space-y-2 text-xs text-gray-600 pt-1">
                <div className="flex justify-between">
                  <span>Ara Toplam:</span>
                  <span className="font-semibold text-gray-900 font-mono">{rawSubtotal} TL</span>
                </div>

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>Kupon İndirimi (%10):</span>
                    <span className="font-mono">-{discountAmount} TL</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Kargo Ücreti:</span>
                  <span>
                    {shippingCost === 0 ? (
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">Ücretsiz</span>
                    ) : (
                      <span className="font-mono font-semibold">{shippingCost} TL</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-baseline text-sm font-bold text-gray-900 pt-2.5 border-t border-gray-100">
                  <span className="text-gray-700">Toplam Tutar:</span>
                  <span className="text-lg sm:text-xl font-black text-gray-950 font-mono tracking-tight">
                    {grandTotal} TL
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  onClose();
                  onProceedCheckout();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#111827] hover:bg-black active:scale-[0.99] text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all cursor-pointer shadow-md hover:shadow-lg group"
              >
                <span>Ödeme Adımına Geç</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 pt-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL ile %100 Güvenli Ödeme & Kolay İade</span>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
