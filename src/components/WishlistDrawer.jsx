import React from 'react';
import { X, Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onAddToCart,
  onOpenDetail
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-gray-200 shadow-2xl flex flex-col justify-between">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-orange-100 flex items-center justify-center text-[#C2410C]">
                <Heart className="w-5 h-5 fill-current" />
              </div>
              <div>
                <h2 className="text-base font-bold text-gray-900">Favori Listem</h2>
                <p className="text-xs text-gray-500">{wishlist.length} ürün kaydedildi</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-200 transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {wishlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900">Favorileriniz Boş</h3>
                  <p className="text-xs text-gray-500 mt-1 max-w-xs">
                    Beğendiğiniz ürünlerin üzerindeki kalp simgesine tıklayarak buraya kaydedebilirsiniz.
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Ürünleri İncele
                </button>
              </div>
            ) : (
              wishlist.map((item) => {
                const itemPrice = item.discountPrice || item.price;
                return (
                  <div 
                    key={item.id}
                    className="flex gap-3 p-3 rounded-xl bg-gray-50 border border-gray-200 items-center"
                  >
                    <div 
                      onClick={() => { onOpenDetail(item); onClose(); }}
                      className="w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200 shrink-0 cursor-pointer"
                    >
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 
                        onClick={() => { onOpenDetail(item); onClose(); }}
                        className="text-xs font-bold text-gray-900 line-clamp-1 hover:text-[#C2410C] cursor-pointer"
                      >
                        {item.name}
                      </h4>
                      <div className="text-xs font-black text-[#111827] mt-0.5">
                        {itemPrice} TL
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          onAddToCart(item);
                          onRemoveFromWishlist(item);
                        }}
                        className="p-2 rounded-lg bg-[#111827] hover:bg-black text-white transition-colors cursor-pointer"
                        title="Sepete Ekle"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveFromWishlist(item)}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-gray-100 transition-colors cursor-pointer"
                        title="Favorilerden Kaldır"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Action */}
          {wishlist.length > 0 && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => {
                  wishlist.forEach(p => onAddToCart(p));
                  onClose();
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white font-bold text-xs py-3.5 rounded-xl transition-all shadow-sm cursor-pointer"
              >
                <span>Tümünü Sepete Ekle</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
