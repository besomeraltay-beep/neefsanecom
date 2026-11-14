import React, { useState, useEffect, useMemo, useRef } from 'react';
import Navbar from './components/Navbar';
import ProductCard from './components/ProductCard';
import ProductDetailPage from './components/ProductDetailPage';
import OrdersPage from './components/OrdersPage';
import CartDrawer from './components/CartDrawer';
import WishlistDrawer from './components/WishlistDrawer';
import CheckoutModal from './components/CheckoutModal';
import OrderSuccessModal from './components/OrderSuccessModal';
import UserAuthModal from './components/UserAuthModal';
import UserAccountModal from './components/UserAccountModal';
import CorporateModal from './components/CorporateModal';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import AdminLoginPage from './components/AdminLoginPage';
import TrendyolSidebarFilter from './components/TrendyolSidebarFilter';
import Toast from './components/Toast';

import { CATEGORIES, INITIAL_PRODUCTS } from './data/initialProducts';
import { 
  getProducts, 
  saveProduct, 
  deleteProduct, 
  getOrders, 
  createOrder, 
  updateOrder, 
  deleteOrder, 
  getCoupons, 
  saveCoupon, 
  deleteCoupon, 
  getStoreSettings, 
  saveStoreSettings 
} from './services/db';
import { 
  Search, 
  ArrowUpDown,
  SlidersHorizontal,
  ChevronLeft,
  X,
  ArrowUp
} from 'lucide-react';
import CategoryCards from './components/CategoryCards';

export default function App() {
  // Products state (centralized)
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('neefsane_catalog_v5');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PRODUCTS.length) {
          return parsed;
        }
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Cart state persisted in localStorage
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('neefsane_cart_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Wishlist state persisted in localStorage
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('neefsane_wishlist_v2');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // User orders persisted in localStorage - ONLY 100% genuine user orders
  const [orders, setOrders] = useState(() => {
    try {
      const saved = localStorage.getItem('neefsane_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Purge any old demo / mock presentation orders
          const genuineOrders = parsed.filter(o => 
            o.orderNumber !== 'NEEF-729410' && 
            o.id !== 'SIP-849201' &&
            o.orderNumber !== 'SIP-849201'
          );
          localStorage.setItem('neefsane_orders', JSON.stringify(genuineOrders));
          return genuineOrders;
        }
      }
      return [];
    } catch {
      return [];
    }
  });

  // Current logged in user simulation
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('neefsane_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Applied Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Dynamic Coupons state persisted in localStorage
  const [coupons, setCoupons] = useState(() => {
    try {
      const saved = localStorage.getItem('neefsane_coupons_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return [
      { id: 'c1', code: 'HOSGELDIN10', type: 'percent', value: 0.10, label: '%10 İlk Sipariş İndirimi', minSpend: 0, isActive: true },
      { id: 'c2', code: 'EFSANE10', type: 'percent', value: 0.10, label: '%10 Özel İndirim', minSpend: 300, isActive: true },
      { id: 'c3', code: 'NEEF20', type: 'percent', value: 0.20, label: '%20 Lansman İndirimi', minSpend: 600, isActive: true }
    ];
  });

  // Store Settings state persisted in localStorage
  const [storeSettings, setStoreSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('neefsane_settings_v1');
      return saved ? JSON.parse(saved) : { freeShippingThreshold: 500, phone: '0850 300 00 00', whatsapp: '905000000000' };
    } catch {
      return { freeShippingThreshold: 500, phone: '0850 300 00 00', whatsapp: '905000000000' };
    }
  });

  // Filter & Search states (Trendyol standard)
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeTabSection, setActiveTabSection] = useState('all'); // 'all', 'featured', 'new', 'bestseller'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('popular'); // 'popular', 'price-asc', 'price-desc', 'newest', 'rating'
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1500);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [minRating, setMinRating] = useState(0);

  // Mobile Trendyol Filter & Sort state
  const [isMobileSortOpen, setIsMobileSortOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (activeCategory !== 'all') count++;
    if (minPrice > 0 || maxPrice < 1500) count++;
    if (onlyInStock) count++;
    if (onlyDiscounted) count++;
    if (minRating > 0) count++;
    return count;
  }, [activeCategory, minPrice, maxPrice, onlyInStock, onlyDiscounted, minRating]);

  const sortLabels = {
    'popular': 'Önerilen Sıralama',
    'price-asc': 'En Düşük Fiyat',
    'price-desc': 'En Yüksek Fiyat',
    'rating': 'En Çok Değerlendirilenler',
    'newest': 'En Yeni Eklenenler'
  };

  // Modals state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // User & Corporate modals
  const [authModal, setAuthModal] = useState({ isOpen: false, tab: 'login' });
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const [corporateModal, setCorporateModal] = useState({ isOpen: false, type: 'about' });

  // URL routing helper
  const parseRoute = (pathname) => {
    if (pathname.startsWith('/admin')) {
      return { route: 'admin', param: null };
    }
    if (pathname.startsWith('/siparislerim') || pathname.startsWith('/orders')) {
      return { route: 'orders', param: null };
    }
    if (pathname.startsWith('/urun/') || pathname.startsWith('/product/')) {
      const parts = pathname.split('/');
      const id = parts[2] || null;
      return { route: 'product', param: id };
    }
    return { route: 'store', param: null };
  };

  // Standalone Routing state (Separate /admin, /siparislerim, /urun/:id)
  const [routeState, setRouteState] = useState(() => parseRoute(window.location.pathname));

  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('neefsane_admin_auth') === 'true';
  });

  // Listen to browser forward/back buttons
  useEffect(() => {
    const handlePopState = () => {
      const next = parseRoute(window.location.pathname);
      setRouteState(next);
      if (next.route === 'product' && next.param) {
        const found = products.find(p => p.id === next.param);
        if (found) setSelectedProduct(found);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [products]);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    const next = parseRoute(path);
    setRouteState(next);
    if (next.route === 'product' && next.param) {
      const found = products.find(p => p.id === next.param);
      if (found) setSelectedProduct(found);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Toast state
  const [toast, setToast] = useState({ message: '', type: 'success' });

  // Catalog Section ref for smooth scrolling
  const catalogRef = useRef(null);

  // Initial fetch from DB service (Supabase or Local)
  useEffect(() => {
    getProducts().then(data => { if (data && data.length) setProducts(data); });
    getOrders().then(data => { if (data) setOrders(data); });
    getCoupons().then(data => { if (data && data.length) setCoupons(data); });
    getStoreSettings().then(data => { if (data) setStoreSettings(data); });
  }, []);

  // Persist state
  useEffect(() => {
    localStorage.setItem('neefsane_catalog_v5', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('neefsane_coupons_v1', JSON.stringify(coupons));
  }, [coupons]);

  useEffect(() => {
    localStorage.setItem('neefsane_settings_v1', JSON.stringify(storeSettings));
  }, [storeSettings]);

  useEffect(() => {
    localStorage.setItem('neefsane_cart_v2', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('neefsane_wishlist_v2', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('neefsane_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('neefsane_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('neefsane_user');
    }
  }, [currentUser]);

  // Toast trigger
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Scroll to catalog section helper
  const scrollToCatalog = () => {
    if (catalogRef.current) {
      catalogRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Cart operations
  const handleAddToCart = (productWithVariant) => {
    const existingIndex = cart.findIndex(
      item => item.id === productWithVariant.id &&
              item.selectedColor === productWithVariant.selectedColor &&
              item.selectedModel === productWithVariant.selectedModel
    );

    const qtyToAdd = productWithVariant.quantity || 1;

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += qtyToAdd;
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...productWithVariant, quantity: qtyToAdd }]);
    }

    showToast(`"${productWithVariant.name}" sepete eklendi.`);
  };

  const handleBuyNow = (productWithVariant) => {
    handleAddToCart(productWithVariant);
    setSelectedProduct(null);
    setIsCheckoutOpen(true);
  };

  const handleUpdateCartQuantity = (item, newQuantity) => {
    if (newQuantity <= 0) {
      handleRemoveCartItem(item);
      return;
    }
    const updated = cart.map(cartItem => {
      if (
        cartItem.id === item.id &&
        cartItem.selectedColor === item.selectedColor &&
        cartItem.selectedModel === item.selectedModel
      ) {
        return { ...cartItem, quantity: newQuantity };
      }
      return cartItem;
    });
    setCart(updated);
  };

  const handleRemoveCartItem = (item) => {
    const updated = cart.filter(
      cartItem => !(
        cartItem.id === item.id &&
        cartItem.selectedColor === item.selectedColor &&
        cartItem.selectedModel === item.selectedModel
      )
    );
    setCart(updated);
    showToast('Ürün sepetten çıkarıldı.', 'info');
  };

  // Wishlist toggle
  const handleToggleFavorite = (product) => {
    const isFav = wishlist.some(item => item.id === product.id);
    if (isFav) {
      setWishlist(wishlist.filter(item => item.id !== product.id));
      showToast(`"${product.name}" favorilerden çıkarıldı.`, 'info');
    } else {
      setWishlist([...wishlist, product]);
      showToast(`"${product.name}" favorilere eklendi.`);
    }
  };

  // Checkout complete
  const handleOrderComplete = (newOrder) => {
    setOrders([newOrder, ...orders]);
    createOrder(newOrder);
    setCart([]);
    setAppliedCoupon(null);
    setIsCheckoutOpen(false);
    setCompletedOrder(newOrder);
    showToast('Siparişiniz başarıyla oluşturuldu!');
  };

  // Admin Catalog Handlers
  const handleSaveProductFromAdmin = (savedProduct, isEdit) => {
    saveProduct(savedProduct, isEdit);
    if (isEdit) {
      setProducts(products.map(p => p.id === savedProduct.id ? savedProduct : p));
      showToast(`"${savedProduct.name}" başarıyla güncellendi.`);
    } else {
      setProducts([savedProduct, ...products]);
      showToast(`"${savedProduct.name}" mağaza vitrinine eklendi.`);
    }
  };

  const handleDeleteProductFromAdmin = (productId) => {
    deleteProduct(productId);
    const prodToDelete = products.find(p => p.id === productId);
    setProducts(products.filter(p => p.id !== productId));
    showToast(`"${prodToDelete?.name || 'Ürün'}" vitrinden silindi.`, 'info');
  };

  const handleResetCatalog = () => {
    if (window.confirm('Katalog orijinal haline (25 ürüne) döndürülecektir. Devam edilsin mi?')) {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('neefsane_catalog_v5', JSON.stringify(INITIAL_PRODUCTS));
      showToast('Katalog varsayılan haline döndürüldü.');
    }
  };

  // Order Management Handlers
  const handleUpdateOrder = (orderNumber, updatedFields) => {
    updateOrder(orderNumber, updatedFields);
    const updated = orders.map(ord => ord.orderNumber === orderNumber ? { ...ord, ...updatedFields } : ord);
    setOrders(updated);
    showToast(`Sipariş #${orderNumber} güncellendi.`);
  };

  const handleDeleteOrder = (orderNumber) => {
    deleteOrder(orderNumber);
    const updated = orders.filter(ord => ord.orderNumber !== orderNumber);
    setOrders(updated);
    showToast(`Sipariş #${orderNumber} silindi.`, 'info');
  };

  const handleCreateTestOrder = () => {
    const testNum = `NEEF-${Math.floor(100000 + Math.random() * 900000)}`;
    const sampleProduct = products[0] || INITIAL_PRODUCTS[0];
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: testNum,
      date: new Date().toLocaleDateString('tr-TR', { day: '2-digit', month: 'long', year: 'numeric' }) + ' ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      status: 'Hazırlanıyor',
      courier: 'MNG Kargo',
      trackingNumber: `MNG-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      trackingUrl: 'https://mngkargo.com.tr',
      paymentMethod: 'Kredi / Banka Kartı',
      subtotal: sampleProduct.discountPrice || sampleProduct.price,
      shippingFee: 0,
      total: sampleProduct.discountPrice || sampleProduct.price,
      customer: {
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        phone: '0532 555 44 33',
        email: 'ahmet.yilmaz@example.com',
        city: 'İstanbul',
        district: 'Kadıköy',
        address: 'Caferağa Mah. Moda Cad. No: 42 D: 5'
      },
      items: [
        {
          id: sampleProduct.id,
          name: sampleProduct.name,
          image: sampleProduct.image,
          price: sampleProduct.discountPrice || sampleProduct.price,
          quantity: 1,
          selectedModel: sampleProduct.models?.[0] || '16 cm Standart',
          selectedColor: sampleProduct.colors?.[0]?.name || 'Lava Turuncusu'
        }
      ],
      timeline: [
        { status: 'Sipariş Alındı', time: 'Bugün ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }), description: 'Siparişiniz başarıyla alındı ve onaylandı.', completed: true },
        { status: 'Hazırlanıyor', time: 'Bugün ' + new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }), description: 'Ürününüz 3D atölyemizde özenle hazırlanıyor.', completed: true },
        { status: 'Kargoya Verildi', time: 'Bekleniyor', description: 'Kargo kuryesine teslim edildiğinde takip numarası paylaşılacaktır.', completed: false },
        { status: 'Teslim Edildi', time: 'Bekleniyor', description: 'Paketiniz adresinize teslim edilecek.', completed: false }
      ]
    };
    createOrder(newOrder);
    setOrders([newOrder, ...orders]);
    showToast(`Test Siparişi #${testNum} oluşturuldu!`);
  };

  // Coupon Management Handlers
  const handleSaveCoupon = (couponData, isEdit) => {
    saveCoupon(couponData, isEdit);
    if (isEdit) {
      setCoupons(coupons.map(c => c.id === couponData.id ? couponData : c));
      showToast(`"${couponData.code}" kuponu güncellendi.`);
    } else {
      setCoupons([couponData, ...coupons]);
      showToast(`"${couponData.code}" kuponu oluşturuldu.`);
    }
  };

  const handleDeleteCoupon = (couponId) => {
    deleteCoupon(couponId);
    setCoupons(coupons.filter(c => c.id !== couponId));
    showToast('Kupon silindi.', 'info');
  };

  const handleToggleCoupon = (couponId) => {
    const target = coupons.find(c => c.id === couponId);
    if (target) {
      const updated = { ...target, isActive: !target.isActive };
      saveCoupon(updated, true);
      setCoupons(coupons.map(c => c.id === couponId ? updated : c));
      showToast('Kupon durumu güncellendi.');
    }
  };

  // Reset filters
  const handleResetFilters = () => {
    setActiveCategory('all');
    setActiveTabSection('all');
    setSearchTerm('');
    setSortBy('popular');
    setMinPrice(0);
    setMaxPrice(1500);
    setOnlyInStock(false);
    setOnlyDiscounted(false);
    setMinRating(0);
    showToast('Tüm filtreler temizlendi.', 'info');
  };

  // Check if any filter is active
  const hasActiveFilters = activeCategory !== 'all' || 
                           activeTabSection !== 'all' || 
                           searchTerm || 
                           minPrice > 0 || 
                           maxPrice < 1500 || 
                           onlyInStock || 
                           onlyDiscounted || 
                           minRating > 0;

  // Filtered & Sorted products computation
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      // Category match
      if (activeCategory !== 'all' && prod.category !== activeCategory) {
        return false;
      }

      // Tab Section match (Öne Çıkanlar, Yeni Gelenler, Çok Satanlar)
      if (activeTabSection === 'featured' && !prod.isFeatured) return false;
      if (activeTabSection === 'new' && !prod.isNew) return false;
      if (activeTabSection === 'bestseller' && !prod.isBestSeller) return false;

      // Search Term query
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesName = prod.name.toLowerCase().includes(query);
        const matchesCat = (prod.categoryName || '').toLowerCase().includes(query);
        const matchesDesc = (prod.description || '').toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesDesc) {
          return false;
        }
      }

      // Price range filter
      const currentPrice = prod.discountPrice || prod.price;
      if (currentPrice < minPrice || currentPrice > maxPrice) {
        return false;
      }

      // In-stock only filter
      if (onlyInStock && prod.stockCount !== undefined && prod.stockCount <= 0) {
        return false;
      }

      // Discounted only filter
      if (onlyDiscounted && (!prod.discountPrice || prod.discountPrice >= prod.price)) {
        return false;
      }

      // Rating filter
      if (minRating > 0 && (Number(prod.rating) || 0) < minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      // User requirement: When "Tümü" is selected, the first 2 products must ALWAYS be 3D car figures!
      // (1. 3D Porsche 911 GT3 RS, 2. 3D Nissan Skyline GT-R R34)
      if (activeCategory === 'all') {
        const getPriority = (item) => {
          if (item.id === 'neef-3d-01') return 2000;
          if (item.id === 'neef-3d-02') return 1000;
          return 0;
        };
        const pA = getPriority(a);
        const pB = getPriority(b);
        if (pA !== pB) return pB - pA;
      }

      const priceA = a.discountPrice || a.price;
      const priceB = b.discountPrice || b.price;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      // default: popular (reviews count)
      return (b.reviewsCount || 0) - (a.reviewsCount || 0);
    });
  }, [products, activeCategory, activeTabSection, searchTerm, sortBy, minPrice, maxPrice, onlyInStock, onlyDiscounted, minRating]);

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // If user navigated to /admin (separate page)
  if (routeState.route === 'admin') {
    if (!isAdminAuthenticated) {
      return (
        <AdminLoginPage
          onSuccess={() => {
            sessionStorage.setItem('neefsane_admin_auth', 'true');
            setIsAdminAuthenticated(true);
            showToast('Yönetici paneline giriş yapıldı.');
          }}
          onBackToStore={() => navigateTo('/')}
        />
      );
    }

    return (
      <AdminDashboard
        products={products}
        onSaveProduct={handleSaveProductFromAdmin}
        onDeleteProduct={handleDeleteProductFromAdmin}
        onCloseAdmin={() => navigateTo('/')}
        onResetToDefaultCatalog={handleResetCatalog}
        orders={orders}
        onUpdateOrder={handleUpdateOrder}
        onDeleteOrder={handleDeleteOrder}
        onCreateTestOrder={handleCreateTestOrder}
        coupons={coupons}
        onSaveCoupon={handleSaveCoupon}
        onDeleteCoupon={handleDeleteCoupon}
        onToggleCoupon={handleToggleCoupon}
        storeSettings={storeSettings}
        onUpdateStoreSettings={(s) => {
          saveStoreSettings(s);
          setStoreSettings(s);
          showToast('Mağaza ayarları başarıyla kaydedildi.');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#111827] flex flex-col font-sans selection:bg-[#C2410C] selection:text-white">
      
      {/* Toast Notification */}
      <Toast 
        message={toast.message} 
        type={toast.type} 
        onClose={() => setToast({ message: '', type: 'success' })} 
      />

      {/* Main Navbar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        cartCount={totalCartCount}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        activeCategory={activeCategory}
        onSelectCategory={(id) => {
          setActiveCategory(id);
          setActiveTabSection('all');
          if (routeState.route !== 'store') {
            navigateTo('/');
          } else {
            scrollToCatalog();
          }
        }}
        currentUser={currentUser}
        onOpenAuth={(tab) => setAuthModal({ isOpen: true, tab })}
        onOpenAccount={() => setIsAccountOpen(true)}
        onOpenOrders={() => navigateTo('/siparislerim')}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Hesaptan çıkış yapıldı.', 'info');
        }}
        products={products}
        onOpenProductDetail={(prod) => {
          setSelectedProduct(prod);
          navigateTo(`/urun/${prod.id}`);
        }}
      />

      {/* Route-Based Page Body */}
      {routeState.route === 'orders' ? (
        /* Standalone Orders & Tracking Page */
        <OrdersPage
          orders={orders}
          onOpenProductDetail={(prod) => {
            setSelectedProduct(prod);
            navigateTo(`/urun/${prod.id}`);
          }}
          onBackToStore={() => navigateTo('/')}
          onAddToCart={handleAddToCart}
          onShowToast={showToast}
        />
      ) : routeState.route === 'product' ? (
        /* Standalone Product Detail Page (No Popup Modal!) */
        <ProductDetailPage
          key={selectedProduct?.id || routeState.param || 'pdp'}
          product={selectedProduct || products.find(p => p.id === routeState.param) || products[0]}
          allProducts={products}
          onBackToStore={() => navigateTo('/')}
          onAddToCart={handleAddToCart}
          onBuyNow={handleBuyNow}
          isFavorite={selectedProduct ? wishlist.some(item => item.id === selectedProduct.id) : false}
          onToggleFavorite={handleToggleFavorite}
          onSelectProduct={(p) => {
            setSelectedProduct(p);
            navigateTo(`/urun/${p.id}`);
          }}
          wishlist={wishlist}
          onShowToast={showToast}
        />
      ) : (
        /* Main Store Showcase & Catalog (Trendyol Full Width Layout) */
        <div ref={catalogRef} className="flex-1 w-full flex flex-col">
          
          {/* 1. ÜST: Yuvarlak Kategori Hikayeleri (Trendyol Story Çemberleri) */}
          <CategoryCards 
            activeCategory={activeCategory} 
            onSelectCategory={(id) => {
              setActiveCategory(id);
              setActiveTabSection('all');
            }} 
          />

          {/* 2. MOBİL: Kategori Başlığı ve Ürün Sayısı */}
          <div className="flex items-center justify-between px-3.5 py-2.5 bg-white border-b border-gray-100 lg:hidden">
            <div className="flex items-center gap-2">
              {activeCategory !== 'all' && (
                <button 
                  onClick={() => setActiveCategory('all')} 
                  className="p-1 -ml-1 text-gray-700 hover:text-black cursor-pointer"
                  title="Tüm Ürünler"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-sm font-black text-gray-900 tracking-tight leading-tight">
                  {CATEGORIES.find(c => c.id === activeCategory)?.name || 'Tüm Ürünler'}
                </h1>
                <span className="text-[11px] text-gray-500 font-medium">
                  {filteredProducts.length} Ürün {searchTerm && `• "${searchTerm}"`}
                </span>
              </div>
            </div>
          </div>

          {/* 3. MOBİL: STICKY SIRALAMA & FİLTRELE BARI (Trendyol Birebir İmzası) */}
          <div className="sticky top-0 sm:top-[68px] z-30 bg-white border-y border-gray-200 grid grid-cols-2 text-center text-xs font-semibold shadow-xs lg:hidden divide-x divide-gray-200">
            <button 
              type="button"
              onClick={() => setIsMobileSortOpen(true)}
              className="flex items-center justify-center gap-1.5 py-3 text-gray-800 active:bg-orange-50/40 cursor-pointer"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#F27A1A]" />
              <span className="font-bold text-[12px]">{sortLabels[sortBy] || 'Önerilen Sıralama'}</span>
            </button>
            
            <button 
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center justify-center gap-1.5 py-3 text-gray-800 active:bg-orange-50/40 cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#F27A1A]" />
              <span className="font-bold text-[12px]">
                Filtrele {activeFilterCount > 0 && <span className="text-[#F27A1A]">({activeFilterCount})</span>}
              </span>
            </button>
          </div>

          {/* 4. ANA İÇERİK ALANI */}
          <main className="w-full max-w-[1800px] mx-auto px-2 sm:px-6 lg:px-8 py-3 sm:py-6">
            
            <div className="flex flex-col lg:flex-row gap-5 items-start">
              
              {/* Sol Kolon: Masaüstü Filtreler (Mobilde gizli) */}
              <div className="hidden lg:block w-56 shrink-0">
                <TrendyolSidebarFilter
                  categories={CATEGORIES}
                  activeCategory={activeCategory}
                  onSelectCategory={(id) => {
                    setActiveCategory(id);
                    scrollToCatalog();
                  }}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  onPriceChange={(min, max) => {
                    setMinPrice(min);
                    setMaxPrice(max);
                  }}
                  onlyInStock={onlyInStock}
                  onStockToggle={(val) => setOnlyInStock(val)}
                  onlyDiscounted={onlyDiscounted}
                  onDiscountToggle={(val) => setOnlyDiscounted(val)}
                  minRating={minRating}
                  onRatingChange={(val) => setMinRating(val)}
                  onResetFilters={handleResetFilters}
                  hasActiveFilters={hasActiveFilters}
                  totalProductCount={filteredProducts.length}
                />
              </div>

              {/* Sağ Kolon: Ürün Vitrini */}
              <div className="flex-1 min-w-0 space-y-3 sm:space-y-5">
                
                {/* Masaüstü Üst Bar (Mobilde gizli) */}
                <div className="hidden lg:flex p-4 sm:p-5 bg-white rounded-2xl border border-gray-200/90 shadow-sm items-center justify-between gap-4">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
                      {CATEGORIES.find(c => c.id === activeCategory)?.name || 'Tüm Ürünler'}
                    </h1>
                    <p className="text-xs text-gray-500 mt-0.5">
                      <strong className="text-gray-900">{filteredProducts.length}</strong> ürün listeleniyor
                      {searchTerm && <span> • "<strong>{searchTerm}</strong>" araması</span>}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 justify-end">
                    <div className="flex items-center p-1 bg-gray-100 rounded-xl">
                      {[
                        { id: 'all', label: 'Tümü' },
                        { id: 'featured', label: 'Öne Çıkanlar' },
                        { id: 'bestseller', label: 'Çok Satanlar' },
                        { id: 'new', label: 'En Yeniler' }
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTabSection(tab.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            activeTabSection === tab.id
                              ? 'bg-white text-gray-900 shadow-xs'
                              : 'text-gray-500 hover:text-gray-900'
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold">
                      <ArrowUpDown className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-gray-900 focus:outline-none cursor-pointer"
                      >
                        <option value="popular">Önerilen Sıralama</option>
                        <option value="price-asc">Fiyat: En Düşük</option>
                        <option value="price-desc">Fiyat: En Yüksek</option>
                        <option value="rating">En Çok Değerlendirilenler</option>
                        <option value="newest">En Yeni Eklenenler</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Ürün Izgarası: MOBİLDE 2'Lİ (grid-cols-2 gap-2), MASAÜSTÜNDE 4'LÜ */}
                {filteredProducts.length === 0 ? (
                  <div className="py-20 text-center bg-white rounded-2xl border border-gray-200 p-8 space-y-4 shadow-sm">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto text-gray-400">
                      <Search className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-gray-900">Seçtiğiniz Kriterlere Uygun Ürün Bulunamadı</h3>
                      <p className="text-xs text-gray-500 max-w-sm mx-auto mt-1">
                        Filtrelerinizi sıfırlayarak veya farklı bir fiyat aralığı seçerek tüm ürünleri görebilirsiniz.
                      </p>
                    </div>
                    <button
                      onClick={handleResetFilters}
                      className="px-6 py-2.5 bg-[#111827] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors cursor-pointer shadow-sm"
                    >
                      Filtreleri Temizle
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        isFavorite={wishlist.some(item => item.id === product.id)}
                        onToggleFavorite={handleToggleFavorite}
                        onAddToCart={(p) => handleAddToCart(p)}
                        onOpenDetail={(p) => {
                          setSelectedProduct(p);
                          navigateTo(`/urun/${p.id}`);
                        }}
                      />
                    ))}
                  </div>
                )}

              </div>

            </div>

          </main>

          {/* Mobil Yukarı Çık Butonu (Trendyol tarzı) */}
          <button 
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="fixed bottom-6 right-4 z-40 w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-lg border border-gray-200 flex items-center justify-center text-gray-700 active:scale-95 transition-all lg:hidden cursor-pointer"
            title="Yukarı Çık"
          >
            <ArrowUp className="w-5 h-5 text-gray-800" />
          </button>

          {/* MOBİL SIRALAMA MODAL BOTTOM SHEET */}
          {isMobileSortOpen && (
            <div 
              className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs animate-fadeIn lg:hidden"
              onClick={() => setIsMobileSortOpen(false)}
            >
              <div 
                className="w-full bg-white rounded-t-2xl p-4 space-y-3 max-h-[80vh] overflow-y-auto animate-slideUp"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="font-black text-base text-gray-900">Sıralama</h3>
                  <button 
                    onClick={() => setIsMobileSortOpen(false)} 
                    className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <div className="space-y-1">
                  {[
                    { id: 'popular', label: 'Önerilen Sıralama' },
                    { id: 'price-asc', label: 'En Düşük Fiyat' },
                    { id: 'price-desc', label: 'En Yüksek Fiyat' },
                    { id: 'rating', label: 'En Çok Değerlendirilenler' },
                    { id: 'newest', label: 'En Yeni Eklenenler' }
                  ].map((opt) => {
                    const isSelected = sortBy === opt.id;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id);
                          setIsMobileSortOpen(false);
                        }}
                        className="w-full flex items-center justify-between py-3 px-2 text-sm font-semibold border-b border-gray-50 active:bg-orange-50/50 cursor-pointer"
                      >
                        <span className={isSelected ? 'text-[#F27A1A] font-bold' : 'text-gray-800'}>
                          {opt.label}
                        </span>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected ? 'border-[#F27A1A]' : 'border-gray-300'
                        }`}>
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-[#F27A1A]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* MOBİL FİLTRELE DRAWER / BOTTOM SHEET */}
          {isMobileFilterOpen && (
            <div 
              className="fixed inset-0 z-50 flex flex-col justify-end bg-black/60 backdrop-blur-xs animate-fadeIn lg:hidden"
              onClick={() => setIsMobileFilterOpen(false)}
            >
              <div 
                className="w-full bg-white rounded-t-2xl max-h-[85vh] flex flex-col overflow-hidden animate-slideUp"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-[#F27A1A]" />
                    <h3 className="font-black text-base text-gray-900">Filtreler</h3>
                    {activeFilterCount > 0 && (
                      <span className="text-xs bg-orange-100 text-[#F27A1A] font-bold px-2 py-0.5 rounded-full">
                        ({activeFilterCount})
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    {hasActiveFilters && (
                      <button 
                        onClick={handleResetFilters} 
                        className="text-xs font-bold text-[#F27A1A] underline cursor-pointer"
                      >
                        Temizle
                      </button>
                    )}
                    <button 
                      onClick={() => setIsMobileFilterOpen(false)} 
                      className="p-1 text-gray-400 hover:text-gray-700 cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                  <TrendyolSidebarFilter
                    categories={CATEGORIES}
                    activeCategory={activeCategory}
                    onSelectCategory={(id) => {
                      setActiveCategory(id);
                    }}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    onPriceChange={(min, max) => {
                      setMinPrice(min);
                      setMaxPrice(max);
                    }}
                    onlyInStock={onlyInStock}
                    onStockToggle={(val) => setOnlyInStock(val)}
                    onlyDiscounted={onlyDiscounted}
                    onDiscountToggle={(val) => setOnlyDiscounted(val)}
                    minRating={minRating}
                    onRatingChange={(val) => setMinRating(val)}
                    onResetFilters={handleResetFilters}
                    hasActiveFilters={hasActiveFilters}
                    totalProductCount={filteredProducts.length}
                  />
                </div>

                <div className="p-4 border-t border-gray-100 bg-white">
                  <button
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-3 bg-[#F27A1A] hover:bg-[#d9670d] text-white rounded-xl text-sm font-black shadow-md active:scale-98 transition-all cursor-pointer"
                  >
                    Ürünleri Gör ({filteredProducts.length} Ürün)
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedCheckout={() => setIsCheckoutOpen(true)}
        appliedCoupon={appliedCoupon}
        coupons={coupons}
        onApplyCoupon={(c) => {
          setAppliedCoupon(c);
          showToast(`"${c.code}" kuponu uygulandı!`);
        }}
        onRemoveCoupon={() => {
          setAppliedCoupon(null);
          showToast('Kupon kaldırıldı.', 'info');
        }}
      />

      {/* Wishlist Drawer */}
      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={(item) => handleToggleFavorite(item)}
        onAddToCart={(item) => handleAddToCart(item)}
        onOpenDetail={(item) => {
          setSelectedProduct(item);
          setIsWishlistOpen(false);
          navigateTo(`/urun/${item.id}`);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cart}
        appliedCoupon={appliedCoupon}
        onOrderComplete={handleOrderComplete}
        currentUser={currentUser}
      />

      {/* Order Success Modal */}
      <OrderSuccessModal
        isOpen={!!completedOrder}
        onClose={() => setCompletedOrder(null)}
        orderDetails={completedOrder}
        onViewOrders={() => {
          setCompletedOrder(null);
          navigateTo('/siparislerim');
        }}
      />

      {/* User Auth Modal (Login / Register) */}
      <UserAuthModal
        isOpen={authModal.isOpen}
        initialTab={authModal.tab}
        onClose={() => setAuthModal({ isOpen: false, tab: 'login' })}
        onLoginSuccess={(user, isRegister) => {
          setCurrentUser(user);
          if (!isRegister) {
            showToast(`Hoş geldiniz, ${user.name}!`);
          }
        }}
        onOpenAccount={() => setIsAccountOpen(true)}
      />

      {/* User Account Modal (Hesabım) */}
      <UserAccountModal
        isOpen={isAccountOpen}
        onClose={() => setIsAccountOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          setCurrentUser(updated);
          showToast('Hesap bilgileriniz güncellendi.');
        }}
        onLogout={() => {
          setCurrentUser(null);
          showToast('Çıkış yapıldı.', 'info');
        }}
        onOpenOrders={() => {
          setIsAccountOpen(false);
          navigateTo('/siparislerim');
        }}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        ordersCount={orders.length}
        wishlistCount={wishlist.length}
      />

      {/* Corporate & Info Modal (About, Contact, FAQ, Shipping, Privacy, Terms) */}
      <CorporateModal
        isOpen={corporateModal.isOpen}
        modalType={corporateModal.type}
        onClose={() => setCorporateModal({ isOpen: false, type: 'about' })}
      />

      {/* Footer */}
      <Footer
        onSelectCategory={(id) => {
          setActiveCategory(id);
          setActiveTabSection('all');
          if (routeState.route !== 'store') {
            navigateTo('/');
          } else {
            scrollToCatalog();
          }
        }}
        onOpenCorporate={(type) => setCorporateModal({ isOpen: true, type })}
        onOpenOrders={() => navigateTo('/siparislerim')}
        onOpenAdmin={() => navigateTo('/admin')}
        onShowToast={showToast}
      />

    </div>
  );
}
