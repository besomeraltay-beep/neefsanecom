import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Truck, 
  Calendar, 
  MapPin, 
  CreditCard, 
  CheckCircle2, 
  ExternalLink,
  Search,
  ArrowLeft,
  Copy,
  Check,
  Printer,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  ChevronDown
} from 'lucide-react';

export default function OrdersPage({
  orders = [],
  onOpenProductDetail,
  onBackToStore,
  onAddToCart,
  onShowToast
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'delivered', 'cancelled'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedCode, setCopiedCode] = useState(null);
  const [expandedOrderNumber, setExpandedOrderNumber] = useState(null);

  // Status configurations
  const statusConfig = {
    'Hazırlanıyor': {
      color: 'bg-amber-50 text-amber-800 border-amber-200',
      step: 1,
      badge: 'Hazırlanıyor',
      desc: 'Siparişiniz depomuzda özenle paketleniyor ve kalite kontrolü yapılıyor.'
    },
    'Kargoya Verildi': {
      color: 'bg-blue-50 text-blue-800 border-blue-200',
      step: 2,
      badge: 'Kargoya Verildi',
      desc: 'Siparişiniz anlaşmalı kargo firmasına teslim edildi ve yola çıktı.'
    },
    'Dağıtımda': {
      color: 'bg-purple-50 text-purple-800 border-purple-200',
      step: 3,
      badge: 'Dağıtımda',
      desc: 'Kurye siparişinizi adresinize ulaştırmak üzere dağıtıma çıkardı.'
    },
    'Teslim Edildi': {
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      step: 4,
      badge: 'Teslim Edildi',
      desc: 'Siparişiniz adresinize başarıyla teslim edilmiştir. Güle güle kullanın!'
    },
    'İptal Edildi': {
      color: 'bg-rose-50 text-rose-800 border-rose-200',
      step: 0,
      badge: 'İptal Edildi',
      desc: 'Bu sipariş iptal edilmiştir. İade tutarı kartınıza yansıtılmıştır.'
    }
  };

  // Filtered orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      // Tab filter
      const status = order.status || 'Hazırlanıyor';
      if (activeTab === 'active' && !['Hazırlanıyor', 'Kargoya Verildi', 'Dağıtımda'].includes(status)) {
        return false;
      }
      if (activeTab === 'delivered' && status !== 'Teslim Edildi') {
        return false;
      }
      if (activeTab === 'cancelled' && status !== 'İptal Edildi') {
        return false;
      }

      // Search filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchesNumber = (order.orderNumber || '').toLowerCase().includes(query);
        const matchesTracking = (order.trackingNumber || '').toLowerCase().includes(query);
        const matchesCustomer = (order.customer?.fullName || '').toLowerCase().includes(query);
        const matchesItems = (order.items || []).some(item => 
          (item.name || '').toLowerCase().includes(query) ||
          (item.selectedModel || '').toLowerCase().includes(query)
        );
        return matchesNumber || matchesTracking || matchesCustomer || matchesItems;
      }

      return true;
    });
  }, [orders, activeTab, searchQuery]);

  // Order counts
  const counts = useMemo(() => {
    return {
      total: orders.length,
      active: orders.filter(o => ['Hazırlanıyor', 'Kargoya Verildi', 'Dağıtımda'].includes(o.status || 'Hazırlanıyor')).length,
      delivered: orders.filter(o => o.status === 'Teslim Edildi').length,
      cancelled: orders.filter(o => o.status === 'İptal Edildi').length,
    };
  }, [orders]);

  // By default, all orders start collapsed (like summary cards)
  // When a customer clicks on an order or its toggle button, it reveals its live cargo status
  const handleToggleOrder = (orderNum) => {
    setExpandedOrderNumber(prev => (prev === orderNum ? null : orderNum));
  };

  const handleCopy = (text, id) => {
    if (!text) return;
    navigator.clipboard?.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
    if (typeof onShowToast === 'function') {
      onShowToast(`"${text}" panoya kopyalandı.`);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] py-3 sm:py-8">
      <div className="w-full max-w-[1240px] mx-auto px-3 sm:px-6">
        
        {/* Mobile Header Bar (md:hidden) */}
        <div className="md:hidden flex items-center justify-between py-2 mb-3">
          <button 
            onClick={onBackToStore}
            className="flex items-center gap-2 text-sm font-extrabold text-gray-900 active:opacity-70 transition-opacity cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5 text-gray-800" />
            <span>Siparişlerim</span>
          </button>
          <span className="text-[11px] font-bold text-gray-600 bg-white border border-gray-200 px-2.5 py-1 rounded-full shadow-2xs">
            {counts.total} Sipariş
          </span>
        </div>

        {/* Desktop Breadcrumb Navigation */}
        <div className="hidden md:flex items-center justify-between gap-4 mb-6 pb-3 border-b border-gray-200">
          <nav className="flex items-center gap-2 text-xs text-gray-500">
            <button 
              onClick={onBackToStore} 
              className="hover:text-black font-medium transition-colors cursor-pointer"
            >
              Ana Sayfa
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-500 font-medium">Hesabım</span>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-bold">Siparişlerim & Kargo Takibi</span>
          </nav>

          <button
            onClick={onBackToStore}
            className="flex items-center gap-1.5 text-xs font-bold text-gray-700 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Alışverişe Devam Et</span>
          </button>
        </div>

        {/* Desktop Page Header */}
        <div className="hidden md:flex bg-white rounded-3xl border border-gray-200/90 p-5 sm:p-7 mb-6 shadow-xs flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-13 h-13 rounded-2xl bg-[#111827] text-white flex items-center justify-center shadow-md shrink-0">
              <Package className="w-6 h-6 text-[#C2410C]" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                Siparişlerim
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                Tüm siparişlerinizi, kargo takip durumunu ve teslimat detaylarını anlık olarak izleyin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>%100 Güvenli Alışveriş & Canlı Kargo Takibi</span>
            </div>
          </div>
        </div>

        {/* Desktop Compact Discount Coupon */}
        <div className="hidden md:flex bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-amber-500/10 border border-amber-200/90 rounded-2xl p-3.5 sm:px-5 sm:py-3 mb-6 shadow-2xs flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#111827] to-[#C2410C] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-black text-gray-900 tracking-tight">İlk Siparişe Özel %10 İndirim</span>
                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-200">
                  Aktif Kupon
                </span>
              </div>
              <p className="text-[11px] text-gray-500 truncate">
                Tüm koleksiyonlarda ilk alışverişinizde sepette anında %10 indirim sağlar.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
            <div className="flex items-center gap-1.5 bg-white border border-dashed border-amber-300 rounded-xl px-2.5 py-1 shadow-2xs">
              <span className="text-[10px] font-semibold text-gray-400">Kupon Kodu:</span>
              <span className="font-mono font-black text-xs text-gray-900">HOSGELDIN10</span>
            </div>
            <button
              type="button"
              onClick={() => handleCopy('HOSGELDIN10', 'coupon-single')}
              className="px-3.5 py-1.5 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              {copiedCode === 'coupon-single' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Kodu Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Compact Coupon Pill (md:hidden) */}
        <div className="md:hidden bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-500/15 border border-amber-200/90 rounded-xl p-2.5 mb-3 flex items-center justify-between gap-2 shadow-2xs">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-[#C2410C] shrink-0" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-gray-900 block truncate">İlk Siparişe %10 İndirim</span>
              <span className="text-[10px] text-gray-500 font-mono">HOSGELDIN10</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => handleCopy('HOSGELDIN10', 'coupon-mobile')}
            className="px-2.5 py-1 bg-[#111827] text-white text-[11px] font-bold rounded-lg shrink-0 flex items-center gap-1 active:scale-95 transition-transform"
          >
            {copiedCode === 'coupon-mobile' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span>{copiedCode === 'coupon-mobile' ? 'Kopyalandı' : 'Kopyala'}</span>
          </button>
        </div>

        {/* Desktop Filters & Search Toolbar */}
        <div className="hidden md:flex bg-white rounded-2xl border border-gray-200/90 p-4 mb-6 shadow-xs flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-gray-100 rounded-xl w-full md:w-auto">
            {[
              { id: 'all', label: `Tüm Siparişler (${counts.total})` },
              { id: 'active', label: `Devam Edenler (${counts.active})` },
              { id: 'delivered', label: `Teslim Edilenler (${counts.delivered})` },
              { id: 'cancelled', label: `İptal Edilenler (${counts.cancelled})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-xs'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sipariş no, kargo veya ürün ara..."
              className="w-full bg-gray-50 focus:bg-white text-gray-900 placeholder-gray-400 text-xs rounded-xl pl-10 pr-3.5 py-2.5 border border-gray-200 focus:border-[#111827] focus:outline-none transition-all"
            />
          </div>

        </div>

        {/* Mobile Filter Tabs & Search (md:hidden) */}
        <div className="md:hidden space-y-2.5 mb-4">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sipariş no, kargo veya ürün ara..."
              className="w-full bg-white text-gray-900 placeholder-gray-400 text-xs rounded-xl pl-9 pr-8 py-2 border border-gray-200 focus:border-[#111827] focus:outline-none shadow-2xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2 text-xs text-gray-400 font-bold p-0.5"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 -mx-1 px-1">
            {[
              { id: 'all', label: 'Tümü', count: counts.total },
              { id: 'active', label: 'Devam Edenler', count: counts.active },
              { id: 'delivered', label: 'Teslim Edilenler', count: counts.delivered },
              { id: 'cancelled', label: 'İptal', count: counts.cancelled }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === tab.id
                    ? 'bg-[#111827] text-white shadow-xs'
                    : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Orders Listing */}
        {orders.length === 0 ? (
          /* Empty State: Zero orders placed yet */
          <div className="bg-white rounded-3xl border border-gray-200/90 p-12 sm:p-20 text-center shadow-xs space-y-4">
            <div className="w-20 h-20 rounded-3xl bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-2">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-gray-900">
              Henüz Verilmiş Bir Siparişiniz Bulunmuyor
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              NEEFSANE mağazamızdan vereceğiniz tüm siparişler, seçtiğiniz kargo firması (MNG, Yurtiçi, Aras), anlık takip kodu ve teslimat detaylarıyla birlikte bu sayfada görüntülenecektir.
            </p>
            <div className="pt-4">
              <button
                onClick={onBackToStore}
                className="px-8 py-3.5 bg-[#111827] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-xl transition-all shadow-md cursor-pointer inline-flex items-center gap-2"
              >
                <span>Koleksiyonları Keşfet & Alışverişe Başla</span>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          /* Filter result empty */
          <div className="bg-white rounded-3xl border border-gray-200/90 p-12 text-center shadow-xs space-y-3">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto" />
            <h3 className="text-lg font-bold text-gray-900">Arama Kriterinize Uygun Sipariş Bulunamadı</h3>
            <p className="text-xs text-gray-500">
              Filtrelerinizi sıfırlayarak tüm siparişlerinizi tekrar listeleyebilirsiniz.
            </p>
            <button
              onClick={() => {
                setActiveTab('all');
                setSearchQuery('');
              }}
              className="mt-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          /* Real Orders Cards */
          <div className="space-y-4">
            {filteredOrders.map((order, index) => {
              const currentStatus = order.status || 'Hazırlanıyor';
              const conf = statusConfig[currentStatus] || statusConfig['Hazırlanıyor'];
              const currentStep = conf.step || 1;

              const courierName = order.courier || 'MNG Kargo';
              const trackingCode = order.trackingNumber || `MNG-${order.orderNumber}`;
              const trackingUrl = order.trackingUrl || `https://kargotakip.mngkargo.com.tr/?code=${trackingCode}`;
              const isExpanded = expandedOrderNumber === order.orderNumber;
              const itemsList = Array.isArray(order.items) ? order.items : [];

              return (
                <div key={order.orderNumber || index}>
                  {/* DESKTOP ORDER CARD (hidden md:block) */}
                  <div className={`hidden md:block bg-white rounded-3xl border transition-all duration-200 overflow-hidden ${
                    isExpanded 
                      ? 'border-[#111827]/40 shadow-md ring-1 ring-[#111827]/10' 
                      : 'border-gray-200/90 hover:border-gray-300 shadow-xs hover:shadow-sm'
                  }`}>
                    {/* Order Card Clickable Header Bar */}
                  <div 
                    onClick={() => handleToggleOrder(order.orderNumber)}
                    className="p-4 sm:p-5 bg-gray-50/80 hover:bg-gray-100/60 border-b border-gray-200/80 flex flex-wrap items-center justify-between gap-4 cursor-pointer select-none transition-colors"
                  >
                    
                    <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                      {/* Order Number & Copy */}
                      <div>
                        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Sipariş No</div>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono font-black text-sm text-gray-900">
                            #{order.orderNumber}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(order.orderNumber, `order-${index}`);
                            }}
                            className="p-1 rounded text-gray-400 hover:text-black hover:bg-gray-200/70 transition-colors cursor-pointer"
                            title="Sipariş numarasını kopyala"
                          >
                            {copiedCode === `order-${index}` ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Order Date */}
                      <div>
                        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tarih</div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-gray-800 mt-0.5">
                          <Calendar className="w-3.5 h-3.5 text-gray-500" />
                          <span>{order.date}</span>
                        </div>
                      </div>

                      {/* Product Preview Thumbnails (Collapsed Summary) */}
                      <div className="hidden sm:flex items-center gap-2">
                        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mr-1">
                          Ürünler ({itemsList.length})
                        </div>
                        <div className="flex items-center -space-x-2">
                          {itemsList.slice(0, 3).map((it, itIdx) => (
                            <img
                              key={itIdx}
                              src={it.image}
                              alt={it.name}
                              className="w-7 h-7 rounded-lg object-cover border-2 border-white bg-gray-100 shadow-2xs"
                              title={it.name}
                            />
                          ))}
                          {itemsList.length > 3 && (
                            <div className="w-7 h-7 rounded-lg bg-gray-200 border-2 border-white text-[10px] font-bold text-gray-600 flex items-center justify-center">
                              +{itemsList.length - 3}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Total Amount */}
                      <div>
                        <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">Tutar</div>
                        <div className="text-sm font-black text-[#111827] mt-0.5">
                          {order.total} TL
                        </div>
                      </div>
                    </div>

                    {/* Status Badge & Actions */}
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs font-black px-3 py-1 rounded-full border ${conf.color} flex items-center gap-1.5`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse"></span>
                        <span>{conf.badge}</span>
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrint();
                        }}
                        className="p-2 rounded-xl bg-white border border-gray-200 text-gray-600 hover:text-black hover:border-gray-300 transition-colors cursor-pointer hidden sm:block"
                        title="Yazdır / E-Fatura"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      {/* Accordion Toggle Pill Button */}
                      <div className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                        isExpanded 
                          ? 'bg-[#111827] text-white shadow-xs' 
                          : 'bg-white border border-gray-200 text-gray-700 hover:border-gray-300'
                      }`}>
                        <span>{isExpanded ? 'Kargo ve Detayları Kapat' : 'Kargo Durumu & Detay'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                      </div>
                    </div>

                  </div>

                  {/* Expanded Order Details Section (Shows only when this order is clicked) */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 space-y-6 animate-fadeIn">
                      
                      {/* 4-Step Interactive Cargo Progress Tracker */}
                      <div className="p-4 sm:p-5 rounded-2xl bg-gray-50 border border-gray-200/80 space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-gray-900 flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-[#C2410C]" />
                            <span>Kargo Takip Durumu</span>
                          </span>
                          <span className="text-[11px] text-gray-500">{conf.desc}</span>
                        </div>

                        {/* Stepper Bar */}
                        <div className="pt-2 pb-1">
                          <div className="grid grid-cols-4 relative gap-2">
                            
                            {/* Step 1 */}
                            <div className="flex flex-col items-center text-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 z-10 transition-colors ${
                                currentStep >= 1 ? 'bg-[#111827] text-white shadow-xs' : 'bg-gray-200 text-gray-500'
                              }`}>
                                {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
                              </div>
                              <span className="text-[11px] font-bold text-gray-900">Sipariş Alındı</span>
                              <span className="text-[10px] text-gray-400">Hazırlanıyor</span>
                            </div>

                            {/* Step 2 */}
                            <div className="flex flex-col items-center text-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 z-10 transition-colors ${
                                currentStep >= 2 ? 'bg-[#111827] text-white shadow-xs' : 'bg-gray-200 text-gray-500'
                              }`}>
                                {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
                              </div>
                              <span className="text-[11px] font-bold text-gray-900">Kargoya Verildi</span>
                              <span className="text-[10px] text-gray-400">{courierName}</span>
                            </div>

                            {/* Step 3 */}
                            <div className="flex flex-col items-center text-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 z-10 transition-colors ${
                                currentStep >= 3 ? 'bg-[#111827] text-white shadow-xs' : 'bg-gray-200 text-gray-500'
                              }`}>
                                {currentStep > 3 ? <Check className="w-4 h-4" /> : '3'}
                              </div>
                              <span className="text-[11px] font-bold text-gray-900">Dağıtımda</span>
                              <span className="text-[10px] text-gray-400">Kuryede</span>
                            </div>

                            {/* Step 4 */}
                            <div className="flex flex-col items-center text-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1.5 z-10 transition-colors ${
                                currentStep >= 4 ? 'bg-emerald-600 text-white shadow-xs' : 'bg-gray-200 text-gray-500'
                              }`}>
                                {currentStep >= 4 ? <CheckCircle2 className="w-4 h-4" /> : '4'}
                              </div>
                              <span className="text-[11px] font-bold text-gray-900">Teslim Edildi</span>
                              <span className="text-[10px] text-gray-400">Tamamlandı</span>
                            </div>

                          </div>
                        </div>
                      </div>

                      {/* Live Courier Details & Tracking Link Banner */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50/70 via-white to-gray-50 border border-orange-200/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        
                        <div className="flex items-center gap-3.5">
                          <div className="w-12 h-12 rounded-xl bg-[#111827] text-white flex items-center justify-center shrink-0">
                            <Truck className="w-6 h-6 text-[#EA580C]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-extrabold text-gray-900">{courierName}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                                Sigortalı Hızlı Gönderi
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 mt-0.5 flex items-center gap-1.5">
                              <span>Takip Kodu:</span>
                              <strong className="font-mono text-gray-900">{trackingCode}</strong>
                              <button
                                type="button"
                                onClick={() => handleCopy(trackingCode, `track-${index}`)}
                                className="text-gray-400 hover:text-black cursor-pointer"
                                title="Takip kodunu kopyala"
                              >
                                {copiedCode === `track-${index}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                            {order.deliveryEstimate && (
                              <div className="text-[11px] text-gray-500 mt-0.5">
                                Tahmini Teslimat: <strong>{order.deliveryEstimate}</strong>
                              </div>
                            )}
                          </div>
                        </div>

                        <a
                          href={trackingUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:w-auto px-5 py-2.5 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <span>Kargom Nerede? (Canlı Takip)</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>

                      </div>

                      {/* Order Products List */}
                      <div>
                        <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider mb-3">
                          Siparişteki Ürünler ({itemsList.length})
                        </h4>

                        <div className="divide-y divide-gray-100 border border-gray-100 rounded-2xl overflow-hidden">
                          {itemsList.map((item, itemIdx) => {
                            const unitPrice = item.discountPrice || item.price;
                            return (
                              <div 
                                key={itemIdx}
                                className="p-3.5 sm:p-4 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors"
                              >
                                <div className="flex items-center gap-3.5 min-w-0">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-16 h-16 rounded-xl object-cover bg-gray-100 border border-gray-200 shrink-0"
                                  />
                                  <div className="min-w-0">
                                    <h5 
                                      onClick={() => onOpenProductDetail && onOpenProductDetail(item)}
                                      className="font-bold text-gray-900 text-xs sm:text-sm hover:text-[#C2410C] transition-colors cursor-pointer line-clamp-1"
                                      title={item.name}
                                    >
                                      {item.name}
                                    </h5>
                                    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 mt-0.5">
                                      <span>Adet: <strong>{item.quantity}</strong></span>
                                      {item.selectedModel && <span>• Model: <strong>{item.selectedModel}</strong></span>}
                                      {item.selectedColor && <span>• Renk: <strong>{item.selectedColor}</strong></span>}
                                    </div>
                                    <div className="text-xs text-gray-400 mt-0.5">
                                      Birim Fiyat: {unitPrice} TL
                                    </div>
                                  </div>
                                </div>

                                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
                                  <div className="text-sm sm:text-base font-black text-gray-900">
                                    {unitPrice * (item.quantity || 1)} TL
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {onOpenProductDetail && (
                                      <button
                                        type="button"
                                        onClick={() => onOpenProductDetail(item)}
                                        className="px-3 py-1.5 text-[11px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
                                      >
                                        Ürünü İncele
                                      </button>
                                    )}
                                    {onAddToCart && (
                                      <button
                                        type="button"
                                        onClick={() => {
                                          onAddToCart(item);
                                          if (typeof onShowToast === 'function') {
                                            onShowToast(`"${item.name}" tekrar sepete eklendi.`);
                                          }
                                        }}
                                        className="px-3 py-1.5 text-[11px] font-bold text-white bg-[#111827] hover:bg-black rounded-lg transition-colors cursor-pointer"
                                      >
                                        Tekrar Al
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Delivery Address & Payment Summary Footnote */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
                        
                        {/* Address Info */}
                        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 space-y-1">
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-gray-500" />
                            <span>Teslimat Adresi</span>
                          </div>
                          <p className="text-gray-600 leading-relaxed pl-5">
                            {order.customer?.address || 'Kayıtlı teslimat adresi'}
                          </p>
                          <p className="text-gray-500 pl-5 text-[11px]">
                            {order.customer?.district && `${order.customer.district} / `}{order.customer?.city} • {order.customer?.phone}
                          </p>
                        </div>

                        {/* Payment & Security Info */}
                        <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200/70 space-y-1">
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <CreditCard className="w-3.5 h-3.5 text-gray-500" />
                            <span>Ödeme & Fatura Bilgisi</span>
                          </div>
                          <p className="text-gray-600 pl-5">
                            Yöntem: <strong>{order.paymentMethod || 'Kredi / Banka Kartı'}</strong>
                          </p>
                          <p className="text-emerald-700 font-semibold pl-5 text-[11px] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>256-Bit SSL 3D Secure ile Başarıyla Ödendi • E-Fatura Düzenlendi</span>
                          </p>
                        </div>

                      </div>

                    </div>
                  )}

                  </div>

                  {/* MOBILE ORDER CARD (md:hidden) */}
                  <div className="md:hidden bg-white rounded-2xl border border-gray-200/90 shadow-2xs overflow-hidden mb-3">
                    {/* Header: Status, Date, Order No & Total */}
                    <div className="p-3.5 bg-gray-50/70 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-[11px] font-black px-2.5 py-0.5 rounded-full border ${conf.color} flex items-center gap-1.5`}>
                          <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                          <span>{conf.badge}</span>
                        </span>
                        <span className="text-[11px] text-gray-500 font-medium flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span>{order.date}</span>
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs">
                          <span className="text-gray-400 text-[10px] font-bold uppercase">No:</span>
                          <span className="font-mono font-bold text-gray-900">#{order.orderNumber}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(order.orderNumber, `order-m-${index}`);
                            }}
                            className="p-1 text-gray-400 hover:text-black cursor-pointer"
                          >
                            {copiedCode === `order-m-${index}` ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-right">
                          <span className="text-[11px] text-gray-400 font-normal mr-1">Toplam:</span>
                          <span className="text-sm font-black text-gray-900">{order.total} TL</span>
                        </div>
                      </div>
                    </div>

                    {/* Product Items List (Clean mobile rows) */}
                    <div className="p-3 bg-white divide-y divide-gray-50">
                      {itemsList.map((item, itemIdx) => {
                        const unitPrice = item.discountPrice || item.price;
                        return (
                          <div key={itemIdx} className="py-2.5 first:pt-0 last:pb-0 flex items-center gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-14 h-14 rounded-xl object-cover bg-gray-50 border border-gray-200/80 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <h5 
                                onClick={() => onOpenProductDetail && onOpenProductDetail(item)}
                                className="font-bold text-gray-900 text-xs hover:text-[#C2410C] transition-colors cursor-pointer line-clamp-1"
                              >
                                {item.name}
                              </h5>
                              <div className="flex flex-wrap items-center gap-2 text-[11px] text-gray-500 mt-0.5">
                                <span>Adet: <strong>{item.quantity}</strong></span>
                                {item.selectedModel && <span>• {item.selectedModel}</span>}
                                {item.selectedColor && <span>• {item.selectedColor}</span>}
                              </div>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-xs font-black text-gray-900">
                                  {unitPrice * (item.quantity || 1)} TL
                                </span>
                                {onAddToCart && (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      onAddToCart(item);
                                      if (typeof onShowToast === 'function') {
                                        onShowToast(`"${item.name}" tekrar sepete eklendi.`);
                                      }
                                    }}
                                    className="px-2 py-0.5 text-[10px] font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors cursor-pointer"
                                  >
                                    Tekrar Al
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Action buttons row */}
                    <div className="p-2.5 bg-gray-50/80 border-t border-gray-100 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleToggleOrder(order.orderNumber)}
                        className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          isExpanded
                            ? 'bg-[#111827] text-white shadow-xs'
                            : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <Truck className="w-3.5 h-3.5 text-[#C2410C]" />
                        <span>{isExpanded ? 'Detayları Kapat' : 'Kargo & Detay'}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                      </button>

                      <a
                        href={trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-2xs"
                      >
                        <span>Canlı Takip</span>
                        <ExternalLink className="w-3 h-3 text-[#C2410C]" />
                      </a>
                    </div>

                    {/* Mobile Expanded Details */}
                    {isExpanded && (
                      <div className="p-3.5 bg-gray-50 border-t border-gray-100 space-y-3 animate-fadeIn text-xs">
                        {/* 4-Step Vertical Tracker for mobile */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200/80">
                          <div className="text-[11px] font-bold text-gray-800 mb-2.5 flex items-center justify-between">
                            <span className="flex items-center gap-1.5">
                              <Truck className="w-3.5 h-3.5 text-[#C2410C]" />
                              <span>Kargo Aşamaları</span>
                            </span>
                            <span className="text-[10px] text-gray-400 font-normal">{courierName}</span>
                          </div>

                          <div className="space-y-2.5">
                            {[
                              { num: 1, title: 'Sipariş Alındı', sub: 'Hazırlanıyor' },
                              { num: 2, title: 'Kargoya Verildi', sub: courierName },
                              { num: 3, title: 'Dağıtımda', sub: 'Kurye Yolda' },
                              { num: 4, title: 'Teslim Edildi', sub: 'Tamamlandı' },
                            ].map((st) => {
                              const isDone = currentStep >= st.num;
                              const isCurrent = currentStep === st.num;
                              return (
                                <div key={st.num} className="flex items-center gap-2.5">
                                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                                    isDone 
                                      ? (st.num === 4 ? 'bg-emerald-600 text-white' : 'bg-[#111827] text-white') 
                                      : 'bg-gray-100 text-gray-400'
                                  }`}>
                                    {isDone ? <Check className="w-3 h-3" /> : st.num}
                                  </div>
                                  <div className="flex-1 flex items-center justify-between">
                                    <span className={`text-xs ${isCurrent ? 'font-black text-gray-900' : isDone ? 'font-semibold text-gray-700' : 'text-gray-400'}`}>
                                      {st.title}
                                    </span>
                                    <span className="text-[10px] text-gray-400">{st.sub}</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Courier & Tracking Code Box */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200/80 space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-gray-500">Kargo Firması:</span>
                            <span className="text-xs font-bold text-gray-900">{courierName}</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-gray-500">Takip No:</span>
                            <div className="flex items-center gap-1 font-mono text-xs font-bold text-gray-900">
                              <span>{trackingCode}</span>
                              <button
                                type="button"
                                onClick={() => handleCopy(trackingCode, `track-m-${index}`)}
                                className="p-1 text-gray-400 hover:text-black cursor-pointer"
                              >
                                {copiedCode === `track-m-${index}` ? (
                                  <Check className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </button>
                            </div>
                          </div>
                          {order.deliveryEstimate && (
                            <div className="flex items-center justify-between pt-1 border-t border-gray-100 text-[11px]">
                              <span className="text-gray-500">Tahmini Teslimat:</span>
                              <span className="font-bold text-gray-800">{order.deliveryEstimate}</span>
                            </div>
                          )}
                        </div>

                        {/* Address & Payment Info */}
                        <div className="bg-white p-3 rounded-xl border border-gray-200/80 space-y-2">
                          <div>
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                              <MapPin className="w-3 h-3 text-gray-500" />
                              <span>Teslimat Adresi</span>
                            </div>
                            <p className="text-xs text-gray-700 leading-snug">
                              {order.customer?.address || 'Kayıtlı teslimat adresi'}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {order.customer?.district && `${order.customer.district} / `}{order.customer?.city} • {order.customer?.phone}
                            </p>
                          </div>

                          <div className="pt-2 border-t border-gray-100">
                            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1 mb-0.5">
                              <CreditCard className="w-3 h-3 text-gray-500" />
                              <span>Ödeme Bilgisi</span>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">{order.paymentMethod || 'Kredi / Banka Kartı'}</span>
                              <span className="text-emerald-700 font-bold flex items-center gap-1 text-[11px]">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>3D Secure Onaylı</span>
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
