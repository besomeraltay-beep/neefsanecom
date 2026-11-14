import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  MapPin, 
  PackageCheck, 
  Heart, 
  LogOut, 
  ShieldCheck, 
  Edit2
} from 'lucide-react';

export default function UserAccountModal({
  isOpen,
  onClose,
  currentUser,
  onUpdateUser,
  onLogout,
  onOpenOrders,
  onOpenWishlist,
  ordersCount = 0,
  wishlistCount = 0
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');

  if (!isOpen || !currentUser) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onUpdateUser({
      ...currentUser,
      name,
      phone,
      address
    });
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Profile Card Header */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
          <div className="w-14 h-14 rounded-full bg-[#111827] text-white flex items-center justify-center text-xl font-bold">
            {currentUser.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 truncate">{currentUser.name}</h2>
            <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
            <span className="inline-block mt-1 text-[10px] font-bold text-[#C2410C] bg-orange-50 px-2 py-0.5 rounded border border-orange-200">
              NEEFSANE Kulüp Üyesi
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <button
            onClick={() => {
              onClose();
              onOpenOrders();
            }}
            className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <PackageCheck className="w-4 h-4 text-gray-700" />
              <span className="text-xs font-bold text-[#111827]">{ordersCount} Sipariş</span>
            </div>
            <div className="text-[11px] font-semibold text-gray-500">Siparişlerimi Gör</div>
          </button>

          <button
            onClick={() => {
              onClose();
              onOpenWishlist();
            }}
            className="p-3 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-left transition-colors cursor-pointer"
          >
            <div className="flex items-center justify-between mb-1">
              <Heart className="w-4 h-4 text-[#C2410C]" />
              <span className="text-xs font-bold text-[#111827]">{wishlistCount} Ürün</span>
            </div>
            <div className="text-[11px] font-semibold text-gray-500">Favorilerimi Gör</div>
          </button>
        </div>

        {/* Details or Edit Form */}
        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-3 mb-6">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Ad Soyad</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-white text-gray-900 text-xs rounded-lg p-2.5 border border-gray-300 focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Telefon</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full bg-white text-gray-900 text-xs rounded-lg p-2.5 border border-gray-300 focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Kayıtlı Teslimat Adresi</label>
              <textarea
                rows="2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-white text-gray-900 text-xs rounded-lg p-2.5 border border-gray-300 focus:border-black focus:outline-none"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="flex-1 py-2.5 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                Kaydet
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 border border-gray-300 text-gray-700 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                Vazgeç
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3 mb-6 text-xs text-gray-700">
            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-[10px] text-gray-400 block">E-Posta</span>
                  <span className="font-semibold text-gray-900">{currentUser.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-gray-400" />
                <div>
                  <span className="text-[10px] text-gray-400 block">Telefon</span>
                  <span className="font-semibold text-gray-900">{currentUser.phone || 'Belirtilmedi'}</span>
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-gray-50 border border-gray-200">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                <div>
                  <span className="text-[10px] text-gray-400 block">Teslimat Adresi</span>
                  <span className="font-semibold text-gray-900 leading-relaxed block">
                    {currentUser.address || 'Kayıtlı adres bulunmuyor.'}
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 border border-gray-300 hover:border-gray-500 text-gray-800 text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Bilgilerimi Düzenle</span>
            </button>
          </div>
        )}

        {/* Logout */}
        <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Hesabınız Güvende</span>
          </div>

          <button
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1.5 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Oturumu Kapat</span>
          </button>
        </div>

      </div>
    </div>
  );
}
