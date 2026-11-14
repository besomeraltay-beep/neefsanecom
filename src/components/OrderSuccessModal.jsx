import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { CheckCircle, Truck, ArrowRight, MessageCircle } from 'lucide-react';

export default function OrderSuccessModal({
  isOpen,
  onClose,
  orderDetails,
  onViewOrders
}) {
  useEffect(() => {
    if (!isOpen || !orderDetails) return;

    // Launch celebratory confetti
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#C2410C', '#111827', '#10b981', '#f59e0b']
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#C2410C', '#111827', '#10b981', '#f59e0b']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, [isOpen, orderDetails]);

  if (!isOpen || !orderDetails) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div 
        className="relative w-full max-w-lg bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 sm:p-8 text-center space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Check Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
          <CheckCircle className="w-9 h-9" />
        </div>

        {/* Headline */}
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block mb-2">
            Siparişiniz Başarıyla Alındı!
          </span>
          <h2 className="text-2xl font-extrabold text-[#111827] tracking-tight">
            Teşekkür Ederiz!
          </h2>
          <p className="text-sm text-gray-600 mt-2 max-w-sm mx-auto">
            Sayın <strong className="text-gray-900">{orderDetails.customer.firstName || 'Müşterimiz'}</strong>, siparişiniz başarıyla oluşturuldu ve hazırlık aşamasına alındı.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-2.5 text-left text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <span className="text-gray-500">Sipariş Takip No:</span>
            <span className="font-mono font-bold text-[#C2410C] text-sm">
              #{orderDetails.orderNumber}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Ödeme Yöntemi:</span>
            <span className="text-gray-900 font-semibold">{orderDetails.paymentMethod}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Seçilen Kargo:</span>
            <span className="text-gray-900 font-bold">{orderDetails.courier || 'MNG Kargo'}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Kargo Takip No:</span>
            <span className="font-mono font-bold text-gray-900 bg-white px-2 py-0.5 rounded border border-gray-200">
              {orderDetails.trackingNumber || 'MNG-7491028401'}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Toplam Tutar:</span>
            <span className="text-[#111827] font-extrabold text-sm">{orderDetails.total} TL</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-gray-500">Tahmini Teslimat:</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Truck className="w-3.5 h-3.5" />
              {orderDetails.deliveryEstimate || '1 - 2 İş Günü'}
            </span>
          </div>
        </div>

        {/* Notification note */}
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 flex items-center gap-2.5 text-left">
          <MessageCircle className="w-5 h-5 text-gray-400 shrink-0" />
          <p className="text-[11px] text-gray-500">
            Kargo takip numaranız ve sipariş faturanız e-posta ve SMS yoluyla tarafınıza iletilecektir.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          {onViewOrders && (
            <button
              onClick={() => {
                onClose();
                onViewOrders();
              }}
              className="flex-1 py-3 px-4 border border-gray-300 hover:border-gray-500 text-gray-800 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Siparişlerimi Görüntüle
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white font-bold text-xs py-3 px-4 rounded-xl transition-colors cursor-pointer"
          >
            <span>Alışverişe Devam Et</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
