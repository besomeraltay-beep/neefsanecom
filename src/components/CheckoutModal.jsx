import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Truck, 
  Banknote, 
  Lock, 
  MapPin,
  User
} from 'lucide-react';

export default function CheckoutModal({
  isOpen,
  onClose,
  cartItems,
  appliedCoupon,
  onOrderComplete,
  currentUser
}) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    firstName: currentUser ? currentUser.name.split(' ')[0] : '',
    lastName: currentUser ? currentUser.name.split(' ').slice(1).join(' ') : '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    city: 'İstanbul',
    district: '',
    address: currentUser?.address || '',
    orderNote: '',
    cardNumber: '',
    cardName: currentUser?.name || '',
    cardExpiry: '',
    cardCvv: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedCourier = 'MNG Kargo';

  if (!isOpen) return null;

  const rawSubtotal = cartItems.reduce((acc, item) => {
    const itemPrice = item.discountPrice || item.price;
    return acc + (itemPrice * item.quantity);
  }, 0);

  const discountAmount = appliedCoupon 
    ? (appliedCoupon.type === 'percent' ? Math.round(rawSubtotal * appliedCoupon.value) : appliedCoupon.value)
    : 0;

  const subtotalAfterDiscount = Math.max(0, rawSubtotal - discountAmount);
  const isFreeShipping = subtotalAfterDiscount >= 500;
  const shippingCost = isFreeShipping ? 0 : 49;
  const grandTotal = subtotalAfterDiscount + shippingCost;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const orderNumber = `NEEF-${Math.floor(100000 + Math.random() * 900000)}`;
      const randomTrack = Math.floor(1000000000 + Math.random() * 9000000000);
      const courierPrefix = selectedCourier === 'Yurtiçi Kargo' ? 'YK' : (selectedCourier === 'Aras Kargo' ? 'ARAS' : 'MNG');
      const trackingNumber = `${courierPrefix}-${randomTrack}`;
      
      const trackingUrls = {
        'MNG Kargo': `https://kargotakip.mngkargo.com.tr/?code=${trackingNumber}`,
        'Yurtiçi Kargo': `https://www.yurticikargo.com/tr/online-servisler/gonderi-sorgula?code=${trackingNumber}`,
        'Aras Kargo': `https://www.araskargo.com.tr/kargo-takip?code=${trackingNumber}`
      };

      const now = new Date();
      const estDate = new Date(now.setDate(now.getDate() + 2));
      const deliveryEstimate = estDate.toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

      onOrderComplete({
        orderNumber,
        date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: 'Hazırlanıyor',
        customer: formData,
        items: cartItems,
        total: grandTotal,
        paymentMethod: paymentMethod === 'card' ? 'Kredi / Banka Kartı (3D Secure)' : (paymentMethod === 'cod' ? 'Kapıda Nakit / Kart' : 'Havale / FAST'),
        courier: selectedCourier,
        trackingNumber: trackingNumber,
        trackingUrl: trackingUrls[selectedCourier] || trackingUrls['MNG Kargo'],
        deliveryEstimate: deliveryEstimate
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden my-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-200 flex items-center justify-center text-gray-800">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Güvenli Sipariş Tamamlama</h2>
              <p className="text-xs text-gray-500">256-Bit SSL ile tüm bilgileriniz şifrelenir</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-white border border-gray-200 text-gray-400 hover:text-black transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmitOrder} className="p-4 sm:p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Form Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* 1. İletişim Bilgileri */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#C2410C]" />
                  <span>1. İletişim Bilgileri</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Adınız *</label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Ahmet"
                      className="w-full bg-white text-gray-900 text-xs rounded-lg p-2.5 border border-gray-300 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Soyadınız *</label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Yılmaz"
                      className="w-full bg-white text-gray-900 text-xs rounded-lg p-2.5 border border-gray-300 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Telefon Numarası *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="05XX XXX XX XX"
                      className="w-full bg-white text-gray-900 text-xs rounded-lg p-2.5 border border-gray-300 focus:border-black focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">E-Posta Adresi *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="ornek@mail.com"
                      className="w-full bg-white text-gray-900 text-xs rounded-lg p-2.5 border border-gray-300 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Teslimat Adresi */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#C2410C]" />
                  <span>2. Teslimat Adresi</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">Şehir *</label>
                    <select
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full bg-white text-gray-900 text-xs rounded-lg p-2.5 border border-gray-300 focus:border-black focus:outline-none"
                    >
                      <option value="İstanbul">İstanbul</option>
                      <option value="Ankara">Ankara</option>
                      <option value="İzmir">İzmir</option>
                      <option value="Bursa">Bursa</option>
                      <option value="Antalya">Antalya</option>
                      <option value="Kocaeli">Kocaeli</option>
                      <option value="Eskişehir">Eskişehir</option>
                      <option value="Diğer">Diğer İl</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-600 block mb-1">İlçe / Semt *</label>
                    <input
                      type="text"
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="Kadıköy"
                      className="w-full bg-white text-gray-900 text-xs rounded-lg p-2.5 border border-gray-300 focus:border-black focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-gray-600 block mb-1">Açık Adres (Cadde, Sokak, Kapı No) *</label>
                  <textarea
                    name="address"
                    required
                    rows="2"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Örnek Mahallesi, Efsane Sokak No: 12 Daire: 4"
                    className="w-full bg-white text-gray-900 text-xs rounded-lg p-2.5 border border-gray-300 focus:border-black focus:outline-none"
                  />
                </div>
              </div>

              {/* 3. Ödeme Yöntemi */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#C2410C]" />
                  <span>3. Ödeme Yöntemi</span>
                </h3>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'card'
                        ? 'border-[#111827] bg-gray-50 text-gray-900 ring-1 ring-[#111827]'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <CreditCard className="w-5 h-5 mx-auto mb-1 text-gray-800" />
                    <span className="text-xs font-bold block">Kredi Kartı</span>
                    <span className="text-[10px] text-gray-400">Tüm Kartlar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'cod'
                        ? 'border-[#111827] bg-gray-50 text-gray-900 ring-1 ring-[#111827]'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Truck className="w-5 h-5 mx-auto mb-1 text-gray-800" />
                    <span className="text-xs font-bold block">Kapıda Ödeme</span>
                    <span className="text-[10px] text-gray-400">Nakit / Kart</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('eft')}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      paymentMethod === 'eft'
                        ? 'border-[#111827] bg-gray-50 text-gray-900 ring-1 ring-[#111827]'
                        : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <Banknote className="w-5 h-5 mx-auto mb-1 text-gray-800" />
                    <span className="text-xs font-bold block">Havale / FAST</span>
                    <span className="text-[10px] text-emerald-600 font-bold">%5 Ek İndirim</span>
                  </button>
                </div>

                {/* Card input simulation */}
                {paymentMethod === 'card' && (
                  <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Kart Sahibi Ad Soyad</label>
                      <input
                        type="text"
                        name="cardName"
                        value={formData.cardName}
                        onChange={handleChange}
                        placeholder="AHMET YILMAZ"
                        className="w-full bg-white text-gray-900 text-xs rounded-lg p-2 border border-gray-300 uppercase focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] text-gray-600 block mb-1">Kart Numarası</label>
                      <input
                        type="text"
                        name="cardNumber"
                        maxLength="19"
                        value={formData.cardNumber}
                        onChange={handleChange}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full bg-white text-gray-900 text-xs rounded-lg p-2 border border-gray-300 focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Son Kullanma (AA/YY)</label>
                        <input
                          type="text"
                          name="cardExpiry"
                          maxLength="5"
                          value={formData.cardExpiry}
                          onChange={handleChange}
                          placeholder="12/28"
                          className="w-full bg-white text-gray-900 text-xs rounded-lg p-2 border border-gray-300 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-gray-600 block mb-1">Güvenlik Kodu (CVV)</label>
                        <input
                          type="text"
                          name="cardCvv"
                          maxLength="3"
                          value={formData.cardCvv}
                          onChange={handleChange}
                          placeholder="•••"
                          className="w-full bg-white text-gray-900 text-xs rounded-lg p-2 border border-gray-300 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

            {/* Right Column: Order Summary (5 cols) */}
            <div className="lg:col-span-5 bg-gray-50 p-4 sm:p-5 rounded-xl border border-gray-200 flex flex-col justify-between space-y-4">
              
              <div>
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-200 pb-3 mb-3">
                  Sipariş Özeti ({cartItems.length} ürün)
                </h3>

                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {cartItems.map((item, idx) => {
                    const price = item.discountPrice || item.price;
                    return (
                      <div key={idx} className="flex items-center gap-2.5 text-xs">
                        <img 
                          src={item.image} 
                          alt="" 
                          className="w-12 h-12 rounded-lg object-cover bg-white border border-gray-200 shrink-0" 
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 truncate">{item.name}</div>
                          <div className="text-[11px] text-gray-500">
                            Adet: {item.quantity} {item.selectedModel ? `• ${item.selectedModel}` : ''}
                          </div>
                        </div>
                        <div className="font-bold text-gray-900 shrink-0">
                          {price * item.quantity} TL
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 pt-4 border-t border-gray-200 space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Ara Toplam:</span>
                    <span className="font-semibold text-gray-900">{rawSubtotal} TL</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-emerald-700 font-semibold">
                      <span>Kupon İndirimi ({appliedCoupon.code}):</span>
                      <span>-{discountAmount} TL</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Kargo:</span>
                    <span>{shippingCost === 0 ? <strong className="text-emerald-700">Ücretsiz</strong> : `${shippingCost} TL`}</span>
                  </div>
                  <div className="flex justify-between text-sm font-extrabold text-gray-900 pt-2 border-t border-gray-200">
                    <span>Ödenecek Tutar:</span>
                    <span className="text-base text-[#111827]">{grandTotal} TL</span>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-colors cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isSubmitting ? 'Siparişiniz Alınıyor...' : `${grandTotal} TL - Siparişi Onayla`}</span>
                </button>
                <p className="text-[11px] text-gray-400 text-center mt-2">
                  "Siparişi Onayla" butonuna tıklayarak Mesafeli Satış Sözleşmesi'ni kabul etmiş olursunuz.
                </p>
              </div>

            </div>

          </div>

        </form>

      </div>
    </div>
  );
}
