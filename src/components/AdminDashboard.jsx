import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  Package, 
  DollarSign, 
  LogOut, 
  AlertCircle,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  Truck,
  ShoppingCart,
  Copy,
  Printer,
  Download,
  Tag,
  Settings,
  LayoutDashboard,
  CheckCircle2,
  Clock,
  Sparkles,
  Store
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  { id: '3d-araba-figuru', name: '3D Araba Figürleri' },
  { id: 'telefon-kilifi', name: 'Telefon Kılıfları' },
  { id: 'kolye', name: 'Kolye' },
  { id: 'bileklik', name: 'Bileklik' },
  { id: 'diger-aksesuarlar', name: 'Diğer Aksesuarlar' }
];

const COURIER_OPTIONS = [
  'MNG Kargo',
  'Yurtiçi Kargo',
  'Aras Kargo',
  'Trendyol Express',
  'Sürat Kargo',
  'PTT Kargo'
];

const ORDER_STATUS_LIST = [
  'Hazırlanıyor',
  'Kargoya Verildi',
  'Kargoda',
  'Dağıtımda',
  'Teslim Edildi',
  'İptal Edildi'
];

export default function AdminDashboard({
  products,
  onSaveProduct,
  onDeleteProduct,
  onCloseAdmin,
  onResetToDefaultCatalog,
  orders = [],
  onUpdateOrder,
  onDeleteOrder,
  onCreateTestOrder,
  coupons = [],
  onSaveCoupon,
  onDeleteCoupon,
  onToggleCoupon,
  storeSettings = { freeShippingThreshold: 500, phone: '0850 300 00 00', whatsapp: '905000000000' },
  onUpdateStoreSettings
}) {
  // Navigation / View state
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'products', 'product-form', 'orders', 'coupons', 'settings'
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Product list search & filters
  const [adminSearch, setAdminSearch] = useState('');
  const [adminCategory, setAdminCategory] = useState('all');
  const [adminStockFilter, setAdminStockFilter] = useState('all'); // 'all', 'in-stock', 'low-stock', 'out-of-stock'
  
  // Inline quick editing state: { [productId]: { price, stockCount } }
  const [quickEdits, setQuickEdits] = useState({});
  const [quickSavedId, setQuickSavedId] = useState(null);

  // Orders filters
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrderForDetail, setSelectedOrderForDetail] = useState(null);
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState(null);

  // Product Form State
  const initialFormState = {
    id: '',
    name: '',
    category: '3d-araba-figuru',
    price: '',
    discountPrice: '',
    stockCount: 15,
    rating: 5.0,
    reviewsCount: 1,
    tag: 'YENİ',
    isFeatured: true,
    isBestSeller: false,
    isNew: true,
    image: '',
    description: '',
    modelsString: '12 cm Standart, 16 cm Standlı',
    colorsList: [
      { name: 'Lava Turuncusu', hex: '#C2410C' },
      { name: 'Mat Siyah', hex: '#1e293b' },
      { name: 'Titanyum Gümüş', hex: '#94a3b8' }
    ],
    featuresString: 'Yüksek hassasiyetli 3D katman baskısı\nÖzel fırınlanmış dayanıklı yüzey kaplaması\nKoleksiyonluk detaylı modelleme'
  };

  const [form, setForm] = useState(initialFormState);
  const [imagePreview, setImagePreview] = useState('');
  const [newColorName, setNewColorName] = useState('');
  const [newColorHex, setNewColorHex] = useState('#C2410C');
  const [formError, setFormError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New Coupon Form State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState('percent'); // 'percent' or 'fixed'
  const [newCouponValue, setNewCouponValue] = useState(10);
  const [newCouponMinSpend, setNewCouponMinSpend] = useState(0);
  const [newCouponLabel, setNewCouponLabel] = useState('');

  // Store Settings Local State
  const [settingsForm, setSettingsForm] = useState(storeSettings);
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Statistics Calculations
  const stats = useMemo(() => {
    const totalCount = products.length;
    const totalStock = products.reduce((sum, p) => sum + (Number(p.stockCount) || 0), 0);
    const avgPrice = Math.round(products.reduce((sum, p) => sum + (Number(p.discountPrice || p.price) || 0), 0) / (totalCount || 1));
    const lowStock = products.filter(p => (Number(p.stockCount) || 0) <= 5).length;
    const outOfStock = products.filter(p => (Number(p.stockCount) || 0) <= 0).length;
    const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
    const activeOrdersCount = orders.filter(o => o.status !== 'Teslim Edildi' && o.status !== 'İptal Edildi').length;
    const completedOrdersCount = orders.filter(o => o.status === 'Teslim Edildi').length;
    return { 
      totalCount, 
      totalStock, 
      avgPrice, 
      lowStock, 
      outOfStock, 
      totalRevenue, 
      activeOrdersCount,
      completedOrdersCount 
    };
  }, [products, orders]);

  // Filtered Products for the table
  const filteredAdminProducts = useMemo(() => {
    return products.filter(p => {
      const q = adminSearch.toLowerCase();
      const matchesSearch = p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      const matchesCategory = adminCategory === 'all' || p.category === adminCategory;
      
      let matchesStock = true;
      const stock = Number(p.stockCount) || 0;
      if (adminStockFilter === 'in-stock') matchesStock = stock > 5;
      else if (adminStockFilter === 'low-stock') matchesStock = stock > 0 && stock <= 5;
      else if (adminStockFilter === 'out-of-stock') matchesStock = stock <= 0;

      return matchesSearch && matchesCategory && matchesStock;
    });
  }, [products, adminSearch, adminCategory, adminStockFilter]);

  // Filtered Orders for the table
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
      const q = orderSearchQuery.toLowerCase();
      const matchesSearch = !q || 
        (o.orderNumber && o.orderNumber.toLowerCase().includes(q)) ||
        (o.customer?.firstName && o.customer.firstName.toLowerCase().includes(q)) ||
        (o.customer?.lastName && o.customer.lastName.toLowerCase().includes(q)) ||
        (o.customer?.phone && o.customer.phone.includes(q)) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(q));
      return matchesStatus && matchesSearch;
    });
  }, [orders, orderStatusFilter, orderSearchQuery]);

  // Handle Quick Inline Edit changes
  const handleQuickChange = (productId, field, value) => {
    setQuickEdits(prev => ({
      ...prev,
      [productId]: {
        ...(prev[productId] || {}),
        [field]: value
      }
    }));
  };

  const handleSaveQuickEdit = (product) => {
    const edits = quickEdits[product.id];
    if (!edits) return;

    const newPrice = edits.price !== undefined ? Number(edits.price) : product.price;
    const newStock = edits.stockCount !== undefined ? Number(edits.stockCount) : product.stockCount;

    const updated = {
      ...product,
      price: newPrice,
      stockCount: newStock
    };

    onSaveProduct(updated, true);
    setQuickSavedId(product.id);
    setTimeout(() => {
      setQuickSavedId(null);
      setQuickEdits(prev => {
        const next = { ...prev };
        delete next[product.id];
        return next;
      });
    }, 1500);
  };

  // Duplicate product
  const handleDuplicate = (product) => {
    const clone = {
      ...product,
      id: `neef-${Date.now().toString().slice(-6)}`,
      name: `${product.name} (Kopya)`,
      isNew: true
    };
    onSaveProduct(clone, false);
  };

  // Open Form for Editing
  const handleStartEdit = (product) => {
    setEditingProduct(product);
    setForm({
      id: product.id,
      name: product.name || '',
      category: product.category || '3d-araba-figuru',
      price: product.price || '',
      discountPrice: product.discountPrice || '',
      stockCount: product.stockCount || 10,
      rating: product.rating || 5.0,
      reviewsCount: product.reviewsCount || 1,
      tag: product.tag || '',
      isFeatured: !!product.isFeatured,
      isBestSeller: !!product.isBestSeller,
      isNew: !!product.isNew,
      image: product.image || '',
      description: product.description || '',
      modelsString: Array.isArray(product.models) ? product.models.join(', ') : '',
      colorsList: Array.isArray(product.colors) && product.colors.length > 0 ? product.colors : [],
      featuresString: Array.isArray(product.features) ? product.features.join('\n') : ''
    });
    setImagePreview(product.image || '');
    setActiveTab('product-form');
    setFormError('');
  };

  // Open Form for New Product
  const handleStartNew = () => {
    setEditingProduct(null);
    setForm({
      ...initialFormState,
      id: `neef-${Date.now().toString().slice(-6)}`
    });
    setImagePreview('');
    setActiveTab('product-form');
    setFormError('');
  };

  // File Upload handler (converts to base64 so it works without server)
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2.5 * 1024 * 1024) {
      setFormError('Görsel boyutu 2.5MB altında olmalıdır.');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setForm(prev => ({ ...prev, image: reader.result }));
      setFormError('');
    };
    reader.readAsDataURL(file);
  };

  // Add Color
  const handleAddColor = () => {
    if (!newColorName.trim()) return;
    setForm(prev => ({
      ...prev,
      colorsList: [...prev.colorsList, { name: newColorName.trim(), hex: newColorHex }]
    }));
    setNewColorName('');
  };

  // Remove Color
  const handleRemoveColor = (index) => {
    setForm(prev => ({
      ...prev,
      colorsList: prev.colorsList.filter((_, idx) => idx !== index)
    }));
  };

  // Submit Product Form
  const handleSubmitProductForm = (e) => {
    e.preventDefault();
    setFormError('');

    if (!form.name.trim()) {
      setFormError('Lütfen ürün adını yazın.');
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      setFormError('Geçerli bir satış fiyatı girin.');
      return;
    }

    if (!form.image.trim()) {
      setFormError('Lütfen bir ürün görseli yükleyin veya görsel URL bağlantısı yapıştırın.');
      return;
    }

    const models = form.modelsString
      ? form.modelsString.split(',').map(m => m.trim()).filter(Boolean)
      : ['Standart Boy'];

    const features = form.featuresString
      ? form.featuresString.split('\n').map(f => f.trim()).filter(Boolean)
      : ['Özel tasarım ve üstün kaliteli malzeme', 'NEEFSANE güvencesiyle 14 gün iade garantisi'];

    const categoryObj = CATEGORY_OPTIONS.find(c => c.id === form.category);

    const savedProduct = {
      id: form.id || `neef-${Date.now().toString().slice(-6)}`,
      name: form.name.trim(),
      category: form.category,
      categoryName: categoryObj ? categoryObj.name : form.category,
      price: Number(form.price),
      discountPrice: form.discountPrice ? Number(form.discountPrice) : null,
      stockCount: Number(form.stockCount) || 1,
      rating: Number(form.rating) || 5.0,
      reviewsCount: Number(form.reviewsCount) || 1,
      tag: form.tag ? form.tag.trim() : null,
      isFeatured: !!form.isFeatured,
      isBestSeller: !!form.isBestSeller,
      isNew: !!form.isNew,
      image: form.image,
      images: [form.image],
      description: form.description.trim() || `${form.name} – NEEFSANE özel tasarım koleksiyon ürünü.`,
      models: models.length > 0 ? models : ['Standart Boy'],
      colors: form.colorsList.length > 0 ? form.colorsList : [{ name: 'Standart', hex: '#111827' }],
      features: features.length > 0 ? features : [
        'Özel tasarım ve üstün kaliteli malzeme',
        'NEEFSANE güvencesiyle 14 gün iade garantisi'
      ]
    };

    onSaveProduct(savedProduct, !!editingProduct);
    setSaveSuccess(true);

    setTimeout(() => {
      setSaveSuccess(false);
      setActiveTab('products');
      setEditingProduct(null);
    }, 1000);
  };

  // Add New Coupon Handler
  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode.trim()) return;

    const code = newCouponCode.trim().toUpperCase();
    const val = Number(newCouponValue);
    const couponObj = {
      id: `coup-${Date.now()}`,
      code: code,
      type: newCouponType,
      value: newCouponType === 'percent' ? val / 100 : val,
      minSpend: Number(newCouponMinSpend) || 0,
      label: newCouponLabel.trim() || (newCouponType === 'percent' ? `%${val} Özel İndirim` : `${val} TL İndirim`),
      isActive: true
    };

    if (onSaveCoupon) {
      onSaveCoupon(couponObj, false);
    }
    setNewCouponCode('');
    setNewCouponValue(10);
    setNewCouponMinSpend(0);
    setNewCouponLabel('');
  };

  // Export JSON Backup
  const handleExportBackup = () => {
    const backupData = {
      version: 'neefsane_v2.5',
      exportDate: new Date().toISOString(),
      products,
      orders,
      coupons,
      storeSettings
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `neefsane_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON Backup
  const handleImportBackup = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.products && Array.isArray(parsed.products)) {
          localStorage.setItem('neefsane_catalog_v5', JSON.stringify(parsed.products));
        }
        if (parsed.orders && Array.isArray(parsed.orders)) {
          localStorage.setItem('neefsane_orders', JSON.stringify(parsed.orders));
        }
        if (parsed.coupons && Array.isArray(parsed.coupons)) {
          localStorage.setItem('neefsane_coupons_v1', JSON.stringify(parsed.coupons));
        }
        alert('Yedek başarıyla içe aktarıldı! Sayfa yenileniyor...');
        window.location.reload();
      } catch {
        alert('Geçersiz JSON yedek dosyası!');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col font-sans selection:bg-[#C2410C] selection:text-white">
      
      {/* TOP LUXURY ADMIN HEADER */}
      <header className="bg-[#0f172a]/95 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Brand & Mode Indicator */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-white tracking-tight">neefsane</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#C2410C]"></span>
            </div>

            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-slate-800">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C2410C]/20 text-[#fb923c] border border-[#C2410C]/40">
                YÖNETİM PORTALI
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Yerel Mod (Localhost)</span>
              </span>
            </div>
          </div>

          {/* Quick Actions & Store Switcher */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={handleExportBackup}
              className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
              title="Tüm ürün, sipariş ve kupon verilerini JSON olarak bilgisayarınıza indirir"
            >
              <Download className="w-3.5 h-3.5 text-[#fb923c]" />
              <span>Yedek İndir</span>
            </button>

            <button
              onClick={onCloseAdmin}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-900 text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Store className="w-4 h-4 text-[#C2410C]" />
              <span>Mağaza Vitrinine Dön</span>
            </button>

            <button
              onClick={() => {
                sessionStorage.removeItem('neefsane_admin_auth');
                onCloseAdmin();
              }}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-slate-800/80 transition-colors cursor-pointer"
              title="Yönetici Oturumunu Kapat"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* SUBNAV / TAB BAR */}
      <div className="bg-[#0f172a] border-b border-slate-800">
        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-none">
            
            <button
              onClick={() => { setActiveTab('overview'); setEditingProduct(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-[#C2410C] text-white shadow-lg shadow-orange-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Genel Bakış & İstatistik</span>
            </button>

            <button
              onClick={() => { setActiveTab('products'); setEditingProduct(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'products'
                  ? 'bg-[#C2410C] text-white shadow-lg shadow-orange-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Package className="w-4 h-4" />
              <span>Ürün & Stok ({products.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('orders'); setEditingProduct(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#C2410C] text-white shadow-lg shadow-orange-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Gelen Siparişler</span>
              {stats.activeOrdersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                  {stats.activeOrdersCount}
                </span>
              )}
            </button>

            <button
              onClick={() => { setActiveTab('coupons'); setEditingProduct(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'coupons'
                  ? 'bg-[#C2410C] text-white shadow-lg shadow-orange-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Tag className="w-4 h-4" />
              <span>Kuponlar & İndirim ({coupons.length})</span>
            </button>

            <button
              onClick={() => { setActiveTab('settings'); setEditingProduct(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#C2410C] text-white shadow-lg shadow-orange-950/40'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Mağaza Ayarları & Yedek</span>
            </button>

            <div className="ml-auto pl-4">
              <button
                onClick={handleStartNew}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/30 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Ürün Ekle</span>
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW & ANALYTICS DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI Cards Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Revenue */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Toplam Satış Cirosu</span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-3 font-mono">
                  {stats.totalRevenue.toLocaleString('tr-TR')} <span className="text-xs font-bold text-slate-400">TL</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold mt-2 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{orders.length} Adet Müşteri Siparişi</span>
                </div>
              </div>

              {/* Active Orders */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">İşlemdeki Kargo / Sipariş</span>
                  <div className="w-10 h-10 rounded-xl bg-[#C2410C]/10 text-[#fb923c] flex items-center justify-center border border-[#C2410C]/20">
                    <Truck className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-3 font-mono">
                  {stats.activeOrdersCount} <span className="text-xs font-bold text-slate-400">sipariş</span>
                </div>
                <div className="text-[11px] text-amber-400 font-medium mt-2 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Hazırlanan veya Dağıtımda</span>
                </div>
              </div>

              {/* Catalog & Inventory */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Katalog & Toplam Stok</span>
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20">
                    <Package className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white mt-3 font-mono">
                  {stats.totalCount} <span className="text-xs font-bold text-slate-400">model</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-2">
                  Toplam <strong className="text-white font-mono">{stats.totalStock}</strong> adet hazır fiziksel stok
                </div>
              </div>

              {/* Low Stock Warning */}
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Kritik Stok Uyarısı</span>
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center border border-rose-500/20">
                    <AlertCircle className="w-5 h-5" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-rose-400 mt-3 font-mono">
                  {stats.lowStock} <span className="text-xs font-bold text-slate-400">ürün</span>
                </div>
                <div className="text-[11px] text-rose-400 font-medium mt-2">
                  ≤ 5 adet kalan kritik ürünler
                </div>
              </div>

            </div>

            {/* Quick Actions Strip */}
            <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
                <Sparkles className="w-4 h-4 text-[#fb923c]" />
                <span>Hızlı Yönetici Aksiyonları:</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleStartNew}
                  className="px-3.5 py-1.5 rounded-xl bg-[#C2410C] hover:bg-[#9a3412] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yeni Ürün Ekle</span>
                </button>

                <button
                  onClick={() => { setActiveTab('coupons'); }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border border-slate-700"
                >
                  <Tag className="w-3.5 h-3.5 text-amber-400" />
                  <span>Yeni Kupon Tanımla</span>
                </button>

                {onCreateTestOrder && (
                  <button
                    onClick={onCreateTestOrder}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-bold border border-emerald-500/30 transition-all cursor-pointer flex items-center gap-1.5"
                    title="Paneli test etmek için 1 tıkla gerçekçi müşteri siparişi simüle eder"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Örnek Test Siparişi Ekle</span>
                  </button>
                )}
              </div>
            </div>

            {/* Two Column Layout: Recent Orders & Low Stock Watchlist */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Recent Orders (8 cols) */}
              <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#fb923c]" />
                    <h3 className="text-sm font-bold text-white">Son Gelen Siparişler</h3>
                  </div>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs text-[#fb923c] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <span>Tümünü Gör ({orders.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {orders.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 space-y-3">
                    <ShoppingCart className="w-10 h-10 mx-auto opacity-30" />
                    <p className="text-xs">Henüz oluşturulmuş bir müşteri siparişi yok.</p>
                    {onCreateTestOrder && (
                      <button
                        onClick={onCreateTestOrder}
                        className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                      >
                        Örnek Sipariş Oluştur
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="divide-y divide-slate-800/80">
                    {orders.slice(0, 5).map((ord) => (
                      <div key={ord.orderNumber} className="py-3 flex items-center justify-between gap-4 hover:bg-slate-800/40 px-2 rounded-xl transition-colors">
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-xs text-white">#{ord.orderNumber}</span>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              ord.status === 'Teslim Edildi' ? 'bg-emerald-500/20 text-emerald-400' :
                              ord.status === 'Kargoya Verildi' || ord.status === 'Kargoda' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-amber-500/20 text-amber-400'
                            }`}>
                              {ord.status || 'Hazırlanıyor'}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400">
                            {ord.customer?.firstName} {ord.customer?.lastName} • {ord.customer?.city || 'İstanbul'}
                          </div>
                        </div>

                        <div className="text-right space-y-0.5">
                          <div className="font-mono font-bold text-xs text-white">
                            {ord.total} TL
                          </div>
                          <button
                            onClick={() => setSelectedOrderForDetail(ord)}
                            className="text-[11px] text-[#fb923c] hover:underline cursor-pointer"
                          >
                            Detay & Kargo
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column: Low Stock Alerts (4 cols) */}
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-400" />
                    <h3 className="text-sm font-bold text-white">Kritik Stok Takibi</h3>
                  </div>
                  <span className="text-[11px] font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-md border border-rose-500/20">
                    ≤ 5 Adet
                  </span>
                </div>

                {products.filter(p => (Number(p.stockCount) || 0) <= 5).length === 0 ? (
                  <div className="py-10 text-center text-slate-500 space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-40" />
                    <p className="text-xs">Tüm ürünlerinizin stok seviyesi güvende!</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
                    {products.filter(p => (Number(p.stockCount) || 0) <= 5).slice(0, 8).map(p => (
                      <div key={p.id} className="p-3 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img 
                            src={p.image} 
                            alt={p.name} 
                            className="w-10 h-10 rounded-lg object-cover bg-slate-950 shrink-0" 
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                            <div className="text-[11px] text-rose-400 font-bold">
                              Kalan: {p.stockCount} adet
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const updated = { ...p, stockCount: (Number(p.stockCount) || 0) + 10 };
                            onSaveProduct(updated, true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 shrink-0 transition-colors cursor-pointer"
                          title="Stok miktarına anında +10 adet ekler"
                        >
                          +10 Ekle
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCT & INVENTORY CATALOG TABLE */}
        {/* ========================================================================= */}
        {activeTab === 'products' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            
            {/* Search, Category & Stock Filter Controls */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-950/40">
              
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Ürün adı veya kod ara..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="w-full bg-slate-800/80 pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C2410C]"
                  />
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <SlidersHorizontal className="w-4 h-4 text-slate-500 shrink-0" />
                  <select
                    value={adminCategory}
                    onChange={(e) => setAdminCategory(e.target.value)}
                    className="w-full sm:w-auto bg-slate-800/80 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 text-white focus:outline-none focus:border-[#C2410C] cursor-pointer"
                  >
                    <option value="all">Tüm Kategoriler</option>
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Stock Filter Chips */}
              <div className="flex items-center gap-1.5 bg-slate-800/60 p-1 rounded-xl border border-slate-700/80 w-full lg:w-auto justify-end overflow-x-auto">
                {[
                  { id: 'all', label: `Tümü (${products.length})` },
                  { id: 'in-stock', label: 'Stokta (>5)' },
                  { id: 'low-stock', label: `Kritik (${stats.lowStock})` },
                  { id: 'out-of-stock', label: `Tükenen (${stats.outOfStock})` }
                ].map(chip => (
                  <button
                    key={chip.id}
                    onClick={() => setAdminStockFilter(chip.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      adminStockFilter === chip.id
                        ? 'bg-[#C2410C] text-white shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {chip.label}
                  </button>
                ))}
              </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Görsel & Kod</th>
                    <th className="py-3.5 px-4">Ürün Adı</th>
                    <th className="py-3.5 px-4">Kategori</th>
                    <th className="py-3.5 px-4">Fiyat (TL)</th>
                    <th className="py-3.5 px-4 text-center">Stok</th>
                    <th className="py-3.5 px-4 text-center">Durum</th>
                    <th className="py-3.5 px-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredAdminProducts.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-14 text-center text-slate-500">
                        Arama kriterlerine uygun ürün bulunamadı.
                      </td>
                    </tr>
                  ) : (
                    filteredAdminProducts.map((p) => {
                      const edits = quickEdits[p.id] || {};
                      const currentPrice = edits.price !== undefined ? edits.price : p.price;
                      const currentStock = edits.stockCount !== undefined ? edits.stockCount : p.stockCount;
                      const isEdited = edits.price !== undefined || edits.stockCount !== undefined;
                      const isSaved = quickSavedId === p.id;

                      return (
                        <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                          
                          {/* Image & ID */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <img
                                src={p.image}
                                alt={p.name}
                                className="w-12 h-12 rounded-xl object-cover bg-slate-950 border border-slate-700 shrink-0"
                              />
                              <div className="font-mono text-[10px] text-slate-500 uppercase">
                                #{p.id}
                              </div>
                            </div>
                          </td>

                          {/* Name & Badges */}
                          <td className="py-3 px-4">
                            <div className="font-bold text-white text-xs max-w-xs truncate" title={p.name}>
                              {p.name}
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {p.tag && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#C2410C]/20 text-[#fb923c] border border-[#C2410C]/40">
                                  {p.tag}
                                </span>
                              )}
                              {p.isFeatured && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400">
                                  Öne Çıkan
                                </span>
                              )}
                              {p.isBestSeller && (
                                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-500/20 text-purple-400">
                                  Çok Satan
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-4 whitespace-nowrap text-slate-400">
                            {p.categoryName || p.category}
                          </td>

                          {/* Inline Price Edit */}
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                min="1"
                                value={currentPrice}
                                onChange={(e) => handleQuickChange(p.id, 'price', e.target.value)}
                                className="w-20 bg-slate-800 border border-slate-700 text-white font-mono font-bold text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-[#C2410C]"
                              />
                              <span className="text-[11px] text-slate-400">TL</span>
                            </div>
                            {p.discountPrice && (
                              <div className="text-[10px] text-[#fb923c] font-semibold mt-0.5">
                                İndirimli: {p.discountPrice} TL
                              </div>
                            )}
                          </td>

                          {/* Inline Stock Edit */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              <input
                                type="number"
                                min="0"
                                value={currentStock}
                                onChange={(e) => handleQuickChange(p.id, 'stockCount', e.target.value)}
                                className={`w-16 bg-slate-800 border text-center font-mono font-bold text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-[#C2410C] ${
                                  Number(currentStock) <= 0
                                    ? 'border-rose-500 text-rose-400'
                                    : Number(currentStock) <= 5
                                    ? 'border-amber-500 text-amber-400'
                                    : 'border-slate-700 text-emerald-400'
                                }`}
                              />
                              <span className="text-[11px] text-slate-500">adet</span>
                            </div>
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            {Number(currentStock) <= 0 ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                                Tükendi
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                Satışta
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Save button if modified */}
                              {isEdited && (
                                <button
                                  onClick={() => handleSaveQuickEdit(p)}
                                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer"
                                  title="Fiyat/Stok Değişikliğini Kaydet"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {isSaved && (
                                <span className="text-[10px] font-bold text-emerald-400 animate-fadeIn">
                                  Kaydedildi!
                                </span>
                              )}

                              <button
                                onClick={() => handleStartEdit(p)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                title="Detaylı Düzenle"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => handleDuplicate(p)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                                title="Ürünü Klonla (Kopyasını Oluştur)"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => {
                                  if (window.confirm(`"${p.name}" adlı ürünü silmek istediğinize emin misiniz?`)) {
                                    onDeleteProduct(p.id);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title="Ürünü Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-500">
              <div>Toplam {filteredAdminProducts.length} ürün listeleniyor</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={onResetToDefaultCatalog}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Kataloğu Sıfırla</span>
                </button>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: ORDER MANAGEMENT & CARGO TRACKING */}
        {/* ========================================================================= */}
        {activeTab === 'orders' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden space-y-4">
            
            {/* Orders Header & Search Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-950/40">
              
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Sipariş no, müşteri adı veya telefon..."
                  value={orderSearchQuery}
                  onChange={(e) => setOrderSearchQuery(e.target.value)}
                  className="w-full bg-slate-800/80 pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-[#C2410C]"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-800/60 p-1 rounded-xl border border-slate-700/80 w-full lg:w-auto justify-end overflow-x-auto">
                <button
                  onClick={() => setOrderStatusFilter('all')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    orderStatusFilter === 'all' ? 'bg-[#C2410C] text-white' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Tümü ({orders.length})
                </button>
                {ORDER_STATUS_LIST.map(st => {
                  const count = orders.filter(o => o.status === st).length;
                  return (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        orderStatusFilter === st ? 'bg-[#C2410C] text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      {st} ({count})
                    </button>
                  );
                })}
              </div>

            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3.5 px-4">Sipariş No & Tarih</th>
                    <th className="py-3.5 px-4">Müşteri & İletişim</th>
                    <th className="py-3.5 px-4">Kargo & Takip No</th>
                    <th className="py-3.5 px-4">Ürünler</th>
                    <th className="py-3.5 px-4">Tutar</th>
                    <th className="py-3.5 px-4 text-center">Durum</th>
                    <th className="py-3.5 px-4 text-right">İşlemler</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-14 text-center text-slate-500 space-y-2">
                        <ShoppingCart className="w-10 h-10 mx-auto opacity-30" />
                        <div>Bu filtreye uygun sipariş bulunamadı.</div>
                        {onCreateTestOrder && (
                          <button
                            onClick={onCreateTestOrder}
                            className="mt-2 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-colors cursor-pointer"
                          >
                            Örnek Test Siparişi Ekle
                          </button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord.orderNumber} className="hover:bg-slate-800/40 transition-colors">
                        
                        {/* Order No & Date */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-mono font-black text-sm text-white">
                            #{ord.orderNumber}
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {ord.date}
                          </div>
                        </td>

                        {/* Customer */}
                        <td className="py-3 px-4">
                          <div className="font-bold text-white">
                            {ord.customer?.firstName} {ord.customer?.lastName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {ord.customer?.phone}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate max-w-[200px]" title={ord.customer?.address}>
                            {ord.customer?.district ? `${ord.customer.district} / ` : ''}{ord.customer?.city}
                          </div>
                        </td>

                        {/* Courier & Tracking */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                            <Truck className="w-3.5 h-3.5 text-[#fb923c]" />
                            <span>{ord.courier || 'MNG Kargo'}</span>
                          </div>
                          <div className="font-mono text-[11px] text-slate-300 mt-0.5 bg-slate-800 px-2 py-0.5 rounded border border-slate-700 inline-block">
                            {ord.trackingNumber || 'Takip No Girilmedi'}
                          </div>
                        </td>

                        {/* Items */}
                        <td className="py-3 px-4">
                          <div className="space-y-0.5 max-w-xs">
                            {ord.items?.map((it, i) => (
                              <div key={i} className="text-[11px] text-slate-300 truncate">
                                • {it.quantity}x {it.name} {it.selectedModel ? `(${it.selectedModel})` : ''}
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Total */}
                        <td className="py-3 px-4 whitespace-nowrap font-mono font-bold text-white text-sm">
                          {ord.total} TL
                          <div className="text-[10px] text-slate-500 font-sans font-normal">
                            {ord.paymentMethod || 'Kredi Kartı'}
                          </div>
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3 px-4 text-center whitespace-nowrap">
                          <select
                            value={ord.status || 'Hazırlanıyor'}
                            onChange={(e) => {
                              if (onUpdateOrder) {
                                onUpdateOrder(ord.orderNumber, { status: e.target.value });
                              }
                            }}
                            className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none cursor-pointer ${
                              ord.status === 'Teslim Edildi' 
                                ? 'bg-emerald-950/60 text-emerald-400 border-emerald-800' 
                                : ord.status === 'Kargoya Verildi' || ord.status === 'Kargoda'
                                ? 'bg-blue-950/60 text-blue-400 border-blue-800'
                                : ord.status === 'İptal Edildi'
                                ? 'bg-rose-950/60 text-rose-400 border-rose-800'
                                : 'bg-amber-950/60 text-amber-400 border-amber-800'
                            }`}
                          >
                            {ORDER_STATUS_LIST.map(st => (
                              <option key={st} value={st} className="bg-slate-900 text-white">
                                {st}
                              </option>
                            ))}
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setSelectedOrderForDetail(ord)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1"
                              title="Sipariş Detayı & Kargo Takip Düzenle"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#fb923c]" />
                              <span>Detay</span>
                            </button>

                            <button
                              onClick={() => setSelectedOrderForPrint(ord)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                              title="Kargo Fişi / Fatura Yazdır"
                            >
                              <Printer className="w-3.5 h-3.5 text-blue-400" />
                            </button>

                            {onDeleteOrder && (
                              <button
                                onClick={() => {
                                  if (window.confirm(`#${ord.orderNumber} siparişini silmek istediğinize emin misiniz?`)) {
                                    onDeleteOrder(ord.orderNumber);
                                  }
                                }}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title="Siparişi Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>

                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/60 text-xs text-slate-500">
              Kargo takibi ve sipariş durumu değişiklikleri müşterinin <strong>Siparişlerim</strong> takip sayfasına anlık olarak yansır.
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ADD / EDIT PRODUCT FORM */}
        {/* ========================================================================= */}
        {activeTab === 'product-form' && (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">
            
            <div className="flex items-center justify-between pb-5 border-b border-slate-800">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight">
                  {editingProduct ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Girdiğiniz ürün özellikleri, fiyat ve varyantlar anında vitrinde yayına alınır.
                </p>
              </div>

              <button
                onClick={() => { setActiveTab('products'); setEditingProduct(null); }}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {saveSuccess && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 font-bold animate-fadeIn">
                <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>Ürün başarıyla kaydedildi! Kataloğa yönlendiriliyorsunuz...</span>
              </div>
            )}

            <form onSubmit={handleSubmitProductForm} className="space-y-6">
              
              {/* Row 1: Name & Category */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                <div className="md:col-span-8 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <span>Ürün Adı</span>
                    <span className="text-[#C2410C]">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: 3D Renkli Ferrari F40 Masaüstü Figürü"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-[#C2410C]"
                  />
                </div>

                <div className="md:col-span-4 space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <span>Kategori</span>
                    <span className="text-[#C2410C]">*</span>
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-[#C2410C] cursor-pointer"
                  >
                    {CATEGORY_OPTIONS.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Price, Discount Price, Stock, Badge */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1">
                    <span>Normal Satış Fiyatı (TL)</span>
                    <span className="text-[#C2410C]">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="850"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="w-full bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700 text-white font-mono font-bold text-xs focus:outline-none focus:border-[#C2410C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    İndirimli Fiyat (TL)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="649 (Opsiyonel)"
                    value={form.discountPrice}
                    onChange={(e) => setForm({ ...form, discountPrice: e.target.value })}
                    className="w-full bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700 text-[#fb923c] font-mono font-bold text-xs focus:outline-none focus:border-[#C2410C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Stok Adedi
                  </label>
                  <input
                    type="number"
                    min="0"
                    placeholder="15"
                    value={form.stockCount}
                    onChange={(e) => setForm({ ...form, stockCount: e.target.value })}
                    className="w-full bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[#C2410C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    Ürün Rozeti (Tag)
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: YENİ, ÇOK SATAN, ÖZEL SERİ"
                    value={form.tag}
                    onChange={(e) => setForm({ ...form, tag: e.target.value })}
                    className="w-full bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700 text-white text-xs focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
              </div>

              {/* Row 3: Image Upload & Preview */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Ürün Görseli</span>
                  <span className="text-slate-500 font-normal">Dosya yükleyebilir veya doğrudan görsel URL bağlantısı verebilirsiniz</span>
                </label>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-8">
                    <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-700 hover:border-slate-500 rounded-2xl bg-slate-800/40 hover:bg-slate-800/70 cursor-pointer transition-colors text-center">
                      <Upload className="w-8 h-8 text-slate-400 mb-2" />
                      <span className="text-xs font-bold text-white">Bilgisayardan / Telefondan Fotoğraf Seç</span>
                      <span className="text-[11px] text-slate-500 mt-0.5">PNG, JPG veya WEBP (Maks 2.5MB)</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>

                    <div className="mt-2.5 flex items-center gap-2">
                      <span className="text-[11px] text-slate-400 shrink-0">veya URL:</span>
                      <input
                        type="url"
                        placeholder="https://images.unsplash.com/..."
                        value={form.image}
                        onChange={(e) => {
                          setForm({ ...form, image: e.target.value });
                          setImagePreview(e.target.value);
                        }}
                        className="w-full bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-white text-xs focus:outline-none focus:border-[#C2410C]"
                      />
                    </div>
                  </div>

                  {/* Preview Box */}
                  <div className="md:col-span-4 flex items-center justify-center">
                    <div className="w-40 h-40 rounded-2xl border border-slate-700 overflow-hidden bg-slate-950 flex items-center justify-center relative shadow-inner">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Önizleme"
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400';
                          }}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center p-4 text-slate-500 text-xs">
                          Görsel Seçilmedi
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Row 4: Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300">
                  Ürün Açıklaması
                </label>
                <textarea
                  rows="3"
                  placeholder="Ürünün üretim detayları, malzeme kalitesi ve kullanım alanı..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700 text-white text-xs font-normal focus:outline-none focus:border-[#C2410C]"
                />
              </div>

              {/* Row 5: Models & Colors Variants */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-slate-800">
                
                {/* Models */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                    <span>Model / Ölçü Seçenekleri</span>
                    <span className="text-[11px] text-slate-500">Virgülle ayırın</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Örn: 12 cm Standart, 16 cm Standlı, 20 cm XL"
                    value={form.modelsString}
                    onChange={(e) => setForm({ ...form, modelsString: e.target.value })}
                    className="w-full bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700 text-white text-xs focus:outline-none focus:border-[#C2410C]"
                  />
                  <div className="text-[11px] text-slate-500">
                    Örnek: iPhone 15 Pro, iPhone 14 veya 14 cm, 18 cm
                  </div>
                </div>

                {/* Colors */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-300">
                    Renk Varyantları
                  </label>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Renk Adı (Örn: Mat Siyah)"
                      value={newColorName}
                      onChange={(e) => setNewColorName(e.target.value)}
                      className="flex-1 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700 text-white text-xs focus:outline-none focus:border-[#C2410C]"
                    />
                    <input
                      type="color"
                      value={newColorHex}
                      onChange={(e) => setNewColorHex(e.target.value)}
                      className="w-9 h-8 p-0 border-0 rounded cursor-pointer shrink-0 bg-transparent"
                      title="Renk Kodu Seç"
                    />
                    <button
                      type="button"
                      onClick={handleAddColor}
                      className="bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer border border-slate-700"
                    >
                      Ekle
                    </button>
                  </div>

                  {/* Added colors badges */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {form.colorsList.map((c, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 text-xs font-medium px-2.5 py-1 rounded-full border border-slate-700"
                      >
                        <span className="w-2.5 h-2.5 rounded-full border border-slate-600" style={{ backgroundColor: c.hex }} />
                        <span>{c.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveColor(idx)}
                          className="hover:text-rose-400 cursor-pointer ml-0.5 text-slate-500"
                        >
                          &times;
                        </button>
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Row 6: Technical Features Checklist */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>Maddeler Halinde Özellikler</span>
                  <span className="text-[11px] text-slate-500">Her satıra bir özellik yazın</span>
                </label>
                <textarea
                  rows="3"
                  placeholder="Yüksek hassasiyetli 3D katman baskısı&#10;Kararmaz ve paslanmaz 316L cerrahi çelik&#10;Aynı gün kargo imkanı"
                  value={form.featuresString}
                  onChange={(e) => setForm({ ...form, featuresString: e.target.value })}
                  className="w-full bg-slate-800/80 px-3.5 py-2.5 rounded-xl border border-slate-700 text-white text-xs font-normal focus:outline-none focus:border-[#C2410C]"
                />
              </div>

              {/* Submit Buttons */}
              <div className="pt-6 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => { setActiveTab('products'); setEditingProduct(null); }}
                  className="px-5 py-2.5 rounded-xl border border-slate-700 text-slate-300 font-bold text-xs hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  İptal
                </button>

                <button
                  type="submit"
                  className="px-7 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9a3412] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                >
                  <Check className="w-4 h-4 text-white" />
                  <span>{editingProduct ? 'Değişiklikleri Kaydet' : 'Ürünü Mağazaya Ekle'}</span>
                </button>
              </div>

            </form>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: COUPONS & PROMOTIONS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            
            {/* Create New Coupon Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Tag className="w-5 h-5 text-amber-400" />
                <h3 className="text-base font-bold text-white">Yeni İndirim Kuponu Tanımla</h3>
              </div>

              <form onSubmit={handleCreateCoupon} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Kupon Kodu</label>
                  <input
                    type="text"
                    required
                    placeholder="Örn: BAHAR20"
                    value={newCouponCode}
                    onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                    className="w-full bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 text-white font-mono font-bold text-xs focus:outline-none focus:border-[#C2410C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">İndirim Tipi</label>
                  <select
                    value={newCouponType}
                    onChange={(e) => setNewCouponType(e.target.value)}
                    className="w-full bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-[#C2410C] cursor-pointer"
                  >
                    <option value="percent">Yüzde (%) İndirim</option>
                    <option value="fixed">Sabit Tutar (TL) İndirim</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">
                    {newCouponType === 'percent' ? 'Yüzde Oranı (%)' : 'Tutar (TL)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder={newCouponType === 'percent' ? '15' : '100'}
                    value={newCouponValue}
                    onChange={(e) => setNewCouponValue(e.target.value)}
                    className="w-full bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 text-white font-mono font-bold text-xs focus:outline-none focus:border-[#C2410C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Min. Sepet Tutarı (TL)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={newCouponMinSpend}
                    onChange={(e) => setNewCouponMinSpend(e.target.value)}
                    className="w-full bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[#C2410C]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Kuponu Kaydet</span>
                </button>
              </form>
            </div>

            {/* Coupons List Table */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">Tanımlı İndirim Kuponları</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Müşteriler sepet ve ödeme aşamasında bu kuponları kullanabilir.</p>
                </div>
                <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                  {coupons.length} Kupon Aktif
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[11px] border-b border-slate-800">
                    <tr>
                      <th className="py-3.5 px-4">Kupon Kodu</th>
                      <th className="py-3.5 px-4">İndirim Tutarı / Oranı</th>
                      <th className="py-3.5 px-4">Minimum Sepet Şartı</th>
                      <th className="py-3.5 px-4">Açıklama / Etiket</th>
                      <th className="py-3.5 px-4 text-center">Durum</th>
                      <th className="py-3.5 px-4 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {coupons.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-10 text-center text-slate-500">
                          Henüz kupon oluşturulmadı.
                        </td>
                      </tr>
                    ) : (
                      coupons.map((c) => (
                        <tr key={c.id || c.code} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <span className="font-mono font-black text-sm text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                              {c.code}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap font-mono font-bold text-white">
                            {c.type === 'percent' ? `%${Math.round(c.value * 100)} İndirim` : `${c.value} TL Sabit İndirim`}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-400 font-mono">
                            {c.minSpend > 0 ? `${c.minSpend} TL` : 'Alt Limitsiz'}
                          </td>

                          <td className="py-3.5 px-4 text-slate-300">
                            {c.label || '-'}
                          </td>

                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => onToggleCoupon && onToggleCoupon(c.id)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                                c.isActive !== false
                                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                  : 'bg-slate-800 text-slate-500 border-slate-700'
                              }`}
                            >
                              {c.isActive !== false ? 'Aktif' : 'Pasif'}
                            </button>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            {onDeleteCoupon && (
                              <button
                                onClick={() => onDeleteCoupon(c.id)}
                                className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                                title="Kuponu Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: STORE SETTINGS & DATA BACKUP */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-4xl space-y-6">
            
            {/* Store Information Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Settings className="w-5 h-5 text-[#fb923c]" />
                <h3 className="text-base font-bold text-white">Mağaza ve Kargo Yapılandırması</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Ücretsiz Kargo Sepet Alt Sınırı (TL)</label>
                  <input
                    type="number"
                    value={settingsForm.freeShippingThreshold || 500}
                    onChange={(e) => setSettingsForm({ ...settingsForm, freeShippingThreshold: Number(e.target.value) })}
                    className="w-full bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-700 text-white font-mono font-bold text-xs focus:outline-none focus:border-[#C2410C]"
                  />
                  <p className="text-[11px] text-slate-500">Bu tutarın üzerindeki sepetlerde kargo otomatik ücretsiz olur.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">Müşteri Destek Telefonu</label>
                  <input
                    type="text"
                    value={settingsForm.phone || '0850 300 00 00'}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phone: e.target.value })}
                    className="w-full bg-slate-800 px-3.5 py-2.5 rounded-xl border border-slate-700 text-white text-xs focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                {settingsSaved ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 animate-fadeIn">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ayarlar başarıyla kaydedildi!</span>
                  </span>
                ) : <span />}

                <button
                  type="button"
                  onClick={() => {
                    if (onUpdateStoreSettings) onUpdateStoreSettings(settingsForm);
                    setSettingsSaved(true);
                    setTimeout(() => setSettingsSaved(false), 2000);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9a3412] text-white font-bold text-xs transition-colors cursor-pointer"
                >
                  Ayarları Kaydet
                </button>
              </div>
            </div>

            {/* Backup & Restore Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
                <Download className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">Veri Yedekleme ve Taşıma (JSON)</h3>
              </div>
              <p className="text-xs text-slate-400">
                Yerel depolamadaki tüm ürünlerinizi, müşteri siparişlerinizi ve kuponlarınızı tek tıkla bilgisayarınıza indirebilir, canlıya geçerken veya başka bir cihazda geri yükleyebilirsiniz.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleExportBackup}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-[#fb923c]" />
                  <span>Tüm Veritabanını İndir (JSON)</span>
                </button>

                <label className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition-colors cursor-pointer flex items-center gap-2">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>JSON Yedek Yükle</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: ORDER DETAIL & CARGO TRACKING DRAWER */}
      {/* ========================================================================= */}
      {selectedOrderForDetail && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <span className="text-[11px] font-mono text-[#fb923c] font-bold">SİPARİŞ DETAYI</span>
                <h3 className="text-xl font-black text-white font-mono mt-0.5">
                  #{selectedOrderForDetail.orderNumber}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setSelectedOrderForPrint(selectedOrderForDetail);
                  }}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Kargo Fişi / Fatura Yazdır"
                >
                  <Printer className="w-4 h-4 text-blue-400" />
                </button>

                <button
                  onClick={() => setSelectedOrderForDetail(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Customer & Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-800/40 border border-slate-800">
              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Müşteri Bilgileri</div>
                <div className="text-sm font-bold text-white mt-1">
                  {selectedOrderForDetail.customer?.firstName} {selectedOrderForDetail.customer?.lastName}
                </div>
                <div className="text-xs text-slate-300 mt-0.5">
                  {selectedOrderForDetail.customer?.phone}
                </div>
                <div className="text-xs text-slate-400">
                  {selectedOrderForDetail.customer?.email}
                </div>
              </div>

              <div>
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Teslimat Adresi</div>
                <div className="text-xs text-white font-medium mt-1 leading-relaxed">
                  {selectedOrderForDetail.customer?.address}
                </div>
                <div className="text-xs text-[#fb923c] font-bold mt-1">
                  {selectedOrderForDetail.customer?.district ? `${selectedOrderForDetail.customer.district} / ` : ''}
                  {selectedOrderForDetail.customer?.city}
                </div>
              </div>
            </div>

            {/* Purchased Items List */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">Sipariş Edilen Ürünler</div>
              <div className="divide-y divide-slate-800 border border-slate-800 rounded-2xl overflow-hidden bg-slate-950/40">
                {selectedOrderForDetail.items?.map((it, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0">
                      <img 
                        src={it.image} 
                        alt={it.name} 
                        className="w-12 h-12 rounded-xl object-cover bg-slate-900 border border-slate-800 shrink-0" 
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">{it.name}</div>
                        <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                          {it.selectedModel && <span>Ölçü: <strong>{it.selectedModel}</strong></span>}
                          {it.selectedColor && <span>Renk: <strong>{it.selectedColor}</strong></span>}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="font-mono font-bold text-xs text-white">
                        {it.price} TL
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">
                        {it.quantity} adet
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Payment Summary */}
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
              <div className="text-slate-400">
                Ödeme Tipi: <strong className="text-white">{selectedOrderForDetail.paymentMethod || 'Kredi Kartı'}</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-400 mr-2">Toplam Tutar:</span>
                <span className="font-mono font-black text-base text-white">{selectedOrderForDetail.total} TL</span>
              </div>
            </div>

            {/* Cargo Update Controls Form */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-[#C2410C]/40 space-y-4">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#fb923c]" />
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Kargo ve Takip Bilgilerini Güncelle</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Kargo Firması</label>
                  <select
                    defaultValue={selectedOrderForDetail.courier || 'MNG Kargo'}
                    id="cargo-courier-input"
                    className="w-full bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-[#C2410C] cursor-pointer"
                  >
                    {COURIER_OPTIONS.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-300">Kargo Takip Kodu</label>
                  <input
                    type="text"
                    defaultValue={selectedOrderForDetail.trackingNumber || ''}
                    placeholder="Örn: MNG-9842104"
                    id="cargo-tracking-input"
                    className="w-full bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 text-white font-mono text-xs focus:outline-none focus:border-[#C2410C]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-300">Sipariş Durumu</label>
                <select
                  defaultValue={selectedOrderForDetail.status || 'Hazırlanıyor'}
                  id="cargo-status-input"
                  className="w-full bg-slate-800 px-3 py-2 rounded-xl border border-slate-700 text-white text-xs font-bold focus:outline-none focus:border-[#C2410C] cursor-pointer"
                >
                  {ORDER_STATUS_LIST.map(st => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => {
                  const courier = document.getElementById('cargo-courier-input')?.value;
                  const trackingNumber = document.getElementById('cargo-tracking-input')?.value;
                  const status = document.getElementById('cargo-status-input')?.value;

                  if (onUpdateOrder) {
                    onUpdateOrder(selectedOrderForDetail.orderNumber, {
                      courier,
                      trackingNumber,
                      status
                    });
                  }
                  setSelectedOrderForDetail(null);
                }}
                className="w-full py-2.5 rounded-xl bg-[#C2410C] hover:bg-[#9a3412] text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>Kargo Bilgilerini Kaydet & Müşteri Ekranına Yansıt</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: PRINTABLE SHIPPING SLIP & INVOICE */}
      {/* ========================================================================= */}
      {selectedOrderForPrint && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white text-slate-900 rounded-3xl p-8 space-y-6 max-h-[90vh] overflow-y-auto shadow-2xl relative print:w-full print:max-w-none print:p-0 print:shadow-none">
            
            {/* Top Bar for screen only */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 print:hidden">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-[#C2410C]" />
                <span className="font-bold text-sm text-gray-900">Kargo Gönderi Fişi & Sipariş Özeti</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 rounded-xl bg-[#C2410C] hover:bg-[#9a3412] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Yazdır / PDF Kaydet</span>
                </button>
                <button
                  onClick={() => setSelectedOrderForPrint(null)}
                  className="p-2 text-gray-400 hover:text-gray-800 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Print Header */}
            <div className="flex items-center justify-between border-b-2 border-gray-900 pb-4">
              <div>
                <h1 className="text-2xl font-black tracking-tight text-gray-900">neefsane</h1>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-0.5">3D Tasarım & E-Ticaret Sistemleri</p>
              </div>
              <div className="text-right">
                <div className="font-mono font-black text-sm text-gray-900">
                  #{selectedOrderForPrint.orderNumber}
                </div>
                <div className="text-[11px] text-gray-500 mt-0.5">
                  Tarih: {selectedOrderForPrint.date}
                </div>
              </div>
            </div>

            {/* Barcode representation */}
            <div className="p-3 bg-gray-50 rounded-xl border border-gray-200 text-center font-mono">
              <div className="text-2xl tracking-[0.3em] font-black text-gray-900">
                ||||| | |||| ||| |||| | ||||| ||
              </div>
              <div className="text-[11px] text-gray-600 mt-1 font-bold">
                Kargo Takip No: {selectedOrderForPrint.trackingNumber || 'MNG-7491028401'} • {selectedOrderForPrint.courier || 'MNG Kargo'}
              </div>
            </div>

            {/* Addresses */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Gönderici (Satıcı)</div>
                <div className="font-bold text-gray-900 mt-1">NEEFSANE Atölye & Tasarım</div>
                <div className="text-gray-600 mt-0.5 text-[11px]">Moda Cad. No: 42 Kadıköy / İstanbul</div>
                <div className="text-gray-500 text-[11px]">Tel: {storeSettings.phone}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                <div className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">Alıcı (Müşteri)</div>
                <div className="font-bold text-gray-900 mt-1">
                  {selectedOrderForPrint.customer?.firstName} {selectedOrderForPrint.customer?.lastName}
                </div>
                <div className="text-gray-600 mt-0.5 text-[11px]">
                  {selectedOrderForPrint.customer?.address}
                </div>
                <div className="text-gray-900 font-bold text-[11px]">
                  {selectedOrderForPrint.customer?.district ? `${selectedOrderForPrint.customer.district} / ` : ''}
                  {selectedOrderForPrint.customer?.city}
                </div>
                <div className="text-gray-500 text-[11px]">Tel: {selectedOrderForPrint.customer?.phone}</div>
              </div>
            </div>

            {/* Items Table */}
            <table className="w-full text-left text-xs text-gray-700 border-collapse">
              <thead>
                <tr className="border-b border-gray-300 text-gray-900 font-bold uppercase text-[10px]">
                  <th className="py-2">Ürün Açıklaması</th>
                  <th className="py-2 text-center">Adet</th>
                  <th className="py-2 text-right">Birim Fiyat</th>
                  <th className="py-2 text-right">Toplam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {selectedOrderForPrint.items?.map((it, idx) => (
                  <tr key={idx}>
                    <td className="py-2.5 font-medium">
                      {it.name}
                      {it.selectedModel && <span className="text-gray-500 block text-[10px]">{it.selectedModel}</span>}
                    </td>
                    <td className="py-2.5 text-center font-bold">{it.quantity}</td>
                    <td className="py-2.5 text-right font-mono">{it.price} TL</td>
                    <td className="py-2.5 text-right font-mono font-bold">{(it.price * it.quantity)} TL</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t-2 border-gray-900 font-bold text-gray-900">
                  <td colSpan="3" className="py-2 text-right">Genel Toplam:</td>
                  <td className="py-2 text-right font-mono text-sm">{selectedOrderForPrint.total} TL</td>
                </tr>
              </tfoot>
            </table>

            <div className="text-center text-[10px] text-gray-400 pt-2 border-t border-gray-100">
              Bu belge NEEFSANE e-ticaret otomasyonu tarafından oluşturulmuştur.
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
