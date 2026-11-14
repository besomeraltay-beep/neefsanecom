import React, { useState } from 'react';
import { 
  X, 
  Package, 
  Truck, 
  Calendar, 
  ShoppingBag, 
  MapPin, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  ExternalLink,
  Phone
} from 'lucide-react';

export default function UserOrdersModal({
  isOpen,
  onClose,
  orders = [],
  onOpenProductDetail
}) {
  const [selectedOrder, setSelectedOrder] = useState(null);

  if (!isOpen) return null;

  // Status mapping
  const statusConfig = {
    'Hazırlanıyor': {
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      step: 1,
      desc: 'Siparişiniz depoda özenle paketleniyor ve kalite kontrolü yapılıyor.'
    },
    'Kargoya Verildi': {
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      step: 2,
      desc: 'Siparişiniz kargo şubesine teslim edildi ve yola çıktı.'
    },
    'Kargoda': {
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      step: 2,
      desc: 'Siparişiniz kargo firması transfer merkezinde ve dağıtım şubesine ilerliyor.'
    },
    'Dağıtımda': {
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      step: 3,
      desc: 'Kurye siparişinizi bugün teslim etmek üzere dağıtıma çıkardı.'
    },
    'Teslim Edildi': {
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      step: 4,
      desc: 'Siparişiniz belirtilen adreste teslim edilmiştir. Güle güle kullanın!'
    },
    'İptal Edildi': {
      color: 'bg-red-50 text-red-800 border-red-200',
      step: 0,
      desc: 'Sipariş talebiniz üzerine iptal edilmiştir.'
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-3xl bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden p-6 sm:p-8 max-h-[90vh] flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-black hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-gray-200">
          <div className="w-12 h-12 rounded-2xl bg-[#111827] flex items-center justify-center text-white shadow-sm">
            <Package className="w-6 h-6 text-[#C2410C]" />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900 tracking-tight">Siparişlerim & Kargo Takibi</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Siparişinizin anlık kargo aşamasını, takip numarasını ve teslimat detaylarını inceleyin
            </p>
          </div>
        </div>

        {/* Orders List Container */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-1">
          {orders.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Henüz Kayıtlı Siparişiniz Yok</h3>
              <p className="text-xs text-gray-500 max-w-sm">
                Sitemizden vereceğiniz siparişlerin canlı kargo takibi ve faturası bu ekranda otomatik listelenecektir.
              </p>
              <button
                onClick={onClose}
                className="mt-3 px-6 py-3 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Koleksiyonları İncele
              </button>
            </div>
          ) : (
            orders.map((order, index) => {
              const currentStatus = order.status || 'Hazırlanıyor';
              const conf = statusConfig[currentStatus] || statusConfig['Hazırlanıyor'];
              const isExpanded = selectedOrder === order.orderNumber;

              const courierName = order.courier || 'MNG Kargo';
              const trackingCode = order.trackingNumber || 'MNG-7491028401';
              const trackingUrl = order.trackingUrl || `https://kargotakip.mngkargo.com.tr/?code=${trackingCode}`;

              return (
                <div 
                  key={order.orderNumber || index}
                  className="rounded-2xl bg-gray-50 border border-gray-200/90 overflow-hidden shadow-sm transition-all hover:border-gray-300"
                >
                  {/* Order Top Bar */}
                  <div className="p-4 sm:p-5 bg-white border-b border-gray-200 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-sm sm:text-base text-gray-900">
                        #{order.orderNumber}
                      </span>
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${conf.color}`}>
                        {currentStatus}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>{order.date || 'Bugün'}</span>
                      </span>
                      <span className="font-black text-sm text-[#111827]">
                        {order.total} TL
                      </span>
                    </div>
                  </div>

                  {/* Visual Cargo Progress Tracker (4 Steps) */}
                  <div className="px-4 sm:px-6 pt-5 pb-3">
                    <div className="flex items-center justify-between relative">
                      {/* Background Line */}
                      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
                      
                      {/* Active Progress Line */}
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-[#C2410C] -translate-y-1/2 z-0 transition-all duration-500"
                        style={{ 
                          width: conf.step === 1 ? '15%' : (conf.step === 2 ? '50%' : (conf.step === 3 ? '80%' : '100%')) 
                        }}
                      ></div>

                      {/* Step 1: Sipariş Alındı */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          conf.step >= 1 ? 'bg-[#C2410C] text-white ring-4 ring-orange-100' : 'bg-gray-200 text-gray-600'
                        }`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-700 mt-1.5 whitespace-nowrap">
                          Hazırlanıyor
                        </span>
                      </div>

                      {/* Step 2: Kargoya Verildi */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          conf.step >= 2 ? 'bg-[#C2410C] text-white ring-4 ring-orange-100' : 'bg-gray-200 text-gray-600'
                        }`}>
                          <Truck className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-700 mt-1.5 whitespace-nowrap">
                          Kargoda
                        </span>
                      </div>

                      {/* Step 3: Dağıtımda */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          conf.step >= 3 ? 'bg-[#C2410C] text-white ring-4 ring-orange-100' : 'bg-gray-200 text-gray-600'
                        }`}>
                          <Clock className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-700 mt-1.5 whitespace-nowrap">
                          Dağıtımda
                        </span>
                      </div>

                      {/* Step 4: Teslim Edildi */}
                      <div className="relative z-10 flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                          conf.step >= 4 ? 'bg-emerald-600 text-white ring-4 ring-emerald-100' : 'bg-gray-200 text-gray-600'
                        }`}>
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] sm:text-xs font-semibold text-gray-700 mt-1.5 whitespace-nowrap">
                          Teslim Edildi
                        </span>
                      </div>
                    </div>

                    {/* Status Description Box */}
                    <div className="mt-4 p-3 rounded-xl bg-white border border-gray-200 text-xs text-gray-600 flex items-start gap-2.5">
                      <Truck className="w-4 h-4 text-[#C2410C] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-gray-900">{conf.desc}</span>
                        {order.deliveryEstimate && (
                          <div className="text-[11px] text-gray-500 mt-0.5">
                            Tahmini Teslimat: <strong className="text-gray-800">{order.deliveryEstimate}</strong>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cargo Carrier & Tracking Box */}
                  <div className="p-4 sm:p-5 bg-orange-50/40 border-y border-orange-100/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="text-gray-500 text-[11px]">Kargo Firması & Takip Numarası:</div>
                      <div className="font-bold text-gray-900 flex items-center gap-2 mt-0.5">
                        <span className="bg-white px-2 py-0.5 rounded border border-gray-200 text-xs font-bold">
                          {courierName}
                        </span>
                        <span className="font-mono text-xs sm:text-sm text-[#111827] select-all bg-white px-2 py-0.5 rounded border border-gray-200 font-bold">
                          {trackingCode}
                        </span>
                      </div>
                    </div>

                    <a
                      href={trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#111827] hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer shrink-0"
                    >
                      <span>Kargo Sayfasında Sorgula</span>
                      <ExternalLink className="w-3.5 h-3.5 text-gray-400" />
                    </a>
                  </div>

                  {/* Order Items Preview */}
                  <div className="p-4 sm:p-5 space-y-3">
                    <div className="text-xs font-bold text-gray-900">
                      Sipariş Edilen Ürünler ({order.items?.length || 0})
                    </div>

                    <div className="space-y-2">
                      {order.items?.map((item, itemIdx) => (
                        <div 
                          key={itemIdx} 
                          onClick={() => onOpenProductDetail && onOpenProductDetail(item)}
                          className="flex items-center gap-3 text-xs bg-white p-3 rounded-xl border border-gray-200 hover:border-gray-400 transition-colors cursor-pointer group"
                        >
                          <img 
                            src={item.image} 
                            alt="" 
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400';
                            }}
                            className="w-12 h-12 rounded-lg object-cover border border-gray-100 shrink-0" 
                          />
                          <div className="flex-1 min-w-0">
                            <div className="font-bold text-gray-900 truncate group-hover:text-[#C2410C] transition-colors">
                              {item.name}
                            </div>
                            <div className="text-[11px] text-gray-500 mt-0.5 flex flex-wrap gap-x-2">
                              <span>Adet: <strong>{item.quantity}</strong></span>
                              {item.selectedModel && <span>• Model: <strong>{item.selectedModel}</strong></span>}
                              {item.selectedColor && <span>• Renk: <strong>{item.selectedColor}</strong></span>}
                            </div>
                          </div>
                          <div className="font-black text-sm text-[#111827] shrink-0">
                            {(item.discountPrice || item.price) * item.quantity} TL
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Toggle Detailed Info (Address, Payment) */}
                    <div className="pt-2">
                      <button
                        onClick={() => setSelectedOrder(isExpanded ? null : order.orderNumber)}
                        className="text-xs font-bold text-gray-600 hover:text-black transition-colors cursor-pointer underline"
                      >
                        {isExpanded ? 'Detayları Gizle' : 'Teslimat ve Ödeme Detaylarını Gör'}
                      </button>

                      {isExpanded && (
                        <div className="mt-3 p-4 rounded-xl bg-white border border-gray-200 space-y-3 animate-fadeIn text-xs">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <div className="text-gray-400 text-[11px] uppercase font-bold mb-1 flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-[#C2410C]" />
                                <span>Teslimat Adresi</span>
                              </div>
                              <div className="font-bold text-gray-900">
                                {order.customer?.firstName} {order.customer?.lastName}
                              </div>
                              <div className="text-gray-600 mt-0.5">
                                {order.customer?.address || 'Bağdat Caddesi No: 42'}
                              </div>
                              <div className="text-gray-600">
                                {order.customer?.district ? `${order.customer.district} / ` : ''}{order.customer?.city || 'İstanbul'}
                              </div>
                              {order.customer?.phone && (
                                <div className="text-gray-500 mt-1 flex items-center gap-1">
                                  <Phone className="w-3 h-3" />
                                  <span>{order.customer.phone}</span>
                                </div>
                              )}
                            </div>

                            <div>
                              <div className="text-gray-400 text-[11px] uppercase font-bold mb-1 flex items-center gap-1">
                                <CreditCard className="w-3.5 h-3.5 text-[#C2410C]" />
                                <span>Ödeme Bilgisi</span>
                              </div>
                              <div className="font-bold text-gray-900">
                                {order.paymentMethod || 'Kredi / Banka Kartı'}
                              </div>
                              <div className="text-emerald-700 font-semibold mt-0.5">
                                Ödeme Durumu: Başarılı (Tahsil Edildi)
                              </div>
                              <div className="text-gray-500 text-[11px] mt-2">
                                256-Bit SSL 3D Secure Korumalı İşlem
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
}
