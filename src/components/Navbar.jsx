import React, { useState, useRef, useEffect } from 'react';
import { 
  Heart, 
  Search, 
  User, 
  Menu, 
  X, 
  LogOut, 
  PackageCheck, 
  ArrowRight,
  Truck,
  Sparkles,
  Copy,
  Check,
  ShoppingCart
} from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  activeCategory,
  onSelectCategory,
  currentUser,
  onOpenAuth,
  onOpenAccount,
  onOpenOrders,
  onLogout,
  products = [],
  onOpenProductDetail
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText('HOSGELDIN10');
    setCouponCopied(true);
    setTimeout(() => setCouponCopied(false), 2000);
  };

  const categories = [
    { id: 'all', name: 'Tüm Ürünler' },
    { id: '3d-araba-figuru', name: '3D Araba Figürleri' },
    { id: 'telefon-kilifi', name: 'Telefon Kılıfları' },
    { id: 'kolye', name: 'Kolye' },
    { id: 'bileklik', name: 'Bileklik' },
    { id: 'diger-aksesuarlar', name: 'Diğer Aksesuarlar' }
  ];

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Quick live search suggestions
  const searchResults = searchTerm.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.categoryName.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      
      {/* Top Campaign Banner (Trendyol Profesyonel Kampanya Şeridi) */}
      <div className="relative w-full h-11 sm:h-12 bg-gradient-to-r from-[#240046] via-[#5a189a] via-[#7b2cbf] to-[#240046] text-white text-xs sm:text-[13px] overflow-hidden flex items-center select-none shadow-md border-b border-purple-900/40">
        
        {/* Arka Plan Şık Işıltı Efektleri */}
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fbbf24_1px,transparent_1px)] [background-size:18px_18px]"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse pointer-events-none"></div>

        <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center relative z-10">
          
          {/* Ortalanmış, Zengin & Dengeli Kampanya Alanı */}
          <div className="flex items-center justify-center gap-3 sm:gap-5 md:gap-7 flex-wrap">
            
            {/* 3D Görünümlü Canlı Rozet */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#f97316] to-[#e11d48] text-white font-black text-[10px] sm:text-[11px] px-3 py-1 rounded-full shadow-[0_0_12px_rgba(249,115,22,0.45)] border border-white/25 tracking-wider uppercase">
                <Sparkles className="w-3 h-3 text-amber-200 fill-amber-200" />
                <span>İLK SİPARİŞ FIRSATI</span>
              </span>
            </div>

            {/* Vurgulu Ana Metin: %10 İndirim */}
            <div className="flex items-center gap-2">
              <span className="text-white font-extrabold text-xs sm:text-sm tracking-tight drop-shadow-sm">
                Tüm Ürünlerde Sepette Anında <span className="text-amber-300 font-black underline decoration-amber-400 decoration-2 underline-offset-4">%10 İNDİRİM!</span>
              </span>
            </div>

            {/* Tıklanıp Kopyalanabilir Kupon Kodu */}
            <button
              onClick={handleCopyCoupon}
              className="inline-flex items-center gap-1.5 bg-black/40 hover:bg-black/60 active:scale-95 text-white px-2.5 py-1 rounded-lg border border-amber-300/40 text-xs transition-all cursor-pointer shadow-inner group"
              title="Kupon kodunu kopyalamak için tıklayın"
            >
              <span className="text-gray-300 text-[10px] uppercase font-medium">Kupon:</span>
              <span className="text-amber-300 font-mono font-black tracking-widest uppercase">HOSGELDIN10</span>
              {couponCopied ? (
                <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded">
                  <Check className="w-3 h-3" />
                  <span>Kopyalandı!</span>
                </span>
              ) : (
                <Copy className="w-3 h-3 text-gray-400 group-hover:text-white transition-colors" />
              )}
            </button>

            {/* Sağ Avantajlar: Ücretsiz Kargo & Aynı Gün Teslimat */}
            <div className="hidden lg:flex items-center gap-4 text-xs font-semibold text-purple-100 pl-4 border-l border-purple-400/30">
              <span className="flex items-center gap-1.5 text-emerald-300">
                <Truck className="w-3.5 h-3.5 text-emerald-400" />
                <span>500 TL Üzeri Kargo Bedava</span>
              </span>
              <span className="text-white/30">•</span>
              <span className="text-amber-200">
                Saat 16:00'a Kadar <strong>Aynı Gün Kargo</strong>
              </span>
            </div>

          </div>

        </div>
      </div>

      {/* Main Navigation Bar (Trendyol Exact Corner-to-Corner Placement) */}
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trendyol Üst Küçük Yardım Linkleri */}
        <div className="hidden md:flex justify-end items-center gap-6 pt-2 pb-1 text-[11px] text-gray-500 font-normal">
          <button 
            onClick={onOpenOrders} 
            className="hover:text-[#f27a1a] transition-colors cursor-pointer"
          >
            İndirim Kuponlarım
          </button>
          <button 
            onClick={onOpenOrders} 
            className="hover:text-[#f27a1a] transition-colors cursor-pointer flex items-center gap-1"
          >
            <PackageCheck className="w-3 h-3 text-[#f27a1a]" />
            <span>Sipariş Takibi</span>
          </button>
          <button 
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} 
            className="hover:text-[#f27a1a] transition-colors cursor-pointer"
          >
            Hakkımızda
          </button>
          <button 
            onClick={() => alert("Müşteri Hizmetleri Destek Hattı: destek@neefsane.com | 0850 123 45 67")} 
            className="hover:text-[#f27a1a] transition-colors cursor-pointer"
          >
            Yardım & Destek
          </button>
        </div>

        {/* Ana Başlık Satırı: Logo - Arama Çubuğu - Butonlar */}
        <div className="flex items-center justify-between py-2 sm:py-2.5 gap-4 sm:gap-6">
          
          {/* Logo (Trendyol Konumu & Font Büyüklüğü: Sol Kenarda neefsane Yazısı) */}
          <div className="flex items-center shrink-0">
            <button
              onClick={() => {
                onSelectCategory('all');
                setSearchTerm('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-left group focus:outline-none cursor-pointer flex items-baseline gap-0.5"
            >
              <span className="text-[29px] sm:text-[32px] font-bold tracking-tight text-[#111827] lowercase leading-none">
                neefsane
              </span>
              <span className="w-2 h-2 rounded-full bg-[#f27a1a] ml-0.5 mb-0.5"></span>
            </button>
          </div>

          {/* Broad Search Bar (Trendyol Boyut ve Tasarımında: 580px - 620px) */}
          <div ref={searchRef} className="hidden md:flex flex-1 max-w-[580px] lg:max-w-[620px] mx-4 relative">
            <div className="relative w-full">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Ürün, kategori veya marka ara"
                className="w-full bg-[#f3f3f3] hover:bg-[#eaeaea] focus:bg-white text-gray-900 placeholder-gray-500 text-xs sm:text-[13px] rounded-md pl-10 pr-10 py-2 h-[42px] border border-transparent focus:border-[#f27a1a] focus:ring-1 focus:ring-[#f27a1a] focus:outline-none transition-all"
              />
              <Search className="w-4 h-4 text-[#f27a1a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Suggestions Dropdown */}
            {searchFocused && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-gray-100">
                <div className="p-2.5 bg-gray-50 text-[11px] font-semibold text-gray-500 uppercase tracking-wider flex justify-between">
                  <span>Arama Sonuçları</span>
                  <span>{searchResults.length} ürün</span>
                </div>
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onOpenProductDetail(item);
                      setSearchFocused(false);
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-12 h-12 rounded-lg object-cover bg-gray-100 border border-gray-200" 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900 truncate">{item.name}</div>
                      <div className="text-xs text-gray-500">{item.categoryName}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900">
                        {item.discountPrice || item.price} TL
                      </div>
                      {item.discountPrice && (
                        <div className="text-xs text-gray-400 line-through">{item.price} TL</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons: Hesabım, Favorilerim, Sepetim (Trendyol exact font, spacing & icons) */}
          <div className="flex items-center gap-5 sm:gap-7">
            
            {/* Hesabım Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 py-1.5 px-1 rounded-md text-[#333] hover:text-[#f27a1a] transition-colors text-xs sm:text-[13px] font-semibold cursor-pointer"
                aria-label="Hesap Menüsü"
              >
                <User className="w-4 h-4 text-[#333]" />
                <span className="hidden sm:inline">Hesabım</span>
              </button>

              {/* User Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 py-2 divide-y divide-gray-100 animate-fadeIn">
                  {currentUser ? (
                    <>
                      <div className="px-4 py-3 bg-gray-50/50">
                        <p className="text-xs text-gray-500">Giriş yapıldı</p>
                        <p className="text-sm font-bold text-gray-900 truncate">{currentUser.name}</p>
                        <p className="text-xs text-gray-500 truncate">{currentUser.email}</p>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            onOpenAccount();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black flex items-center gap-2.5"
                        >
                          <User className="w-4 h-4 text-gray-500" />
                          <span>Hesap Bilgilerim</span>
                        </button>

                        <button
                          onClick={() => {
                            onOpenOrders();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black flex items-center gap-2.5"
                        >
                          <PackageCheck className="w-4 h-4 text-gray-500" />
                          <span>Siparişlerim</span>
                        </button>

                        <button
                          onClick={() => {
                            onOpenWishlist();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-black flex items-center gap-2.5"
                        >
                          <Heart className="w-4 h-4 text-gray-500" />
                          <span>Favorilerim ({wishlistCount})</span>
                        </button>
                      </div>

                      <div className="py-1">
                        <button
                          onClick={() => {
                            onLogout();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Çıkış Yap</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="p-3 space-y-2">
                      <button
                        onClick={() => {
                          onOpenAuth('login');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full py-2.5 bg-[#111827] text-white rounded-lg text-sm font-bold hover:bg-black transition-colors"
                      >
                        Giriş Yap
                      </button>
                      <button
                        onClick={() => {
                          onOpenAuth('register');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-50 transition-colors"
                      >
                        Üye Ol
                      </button>
                      <div className="pt-2 border-t border-gray-100">
                        <button
                          onClick={() => {
                            onOpenOrders();
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left py-1 text-xs text-gray-500 hover:text-black cursor-pointer"
                        >
                          Sipariş Takibi
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Favorilerim (Trendyol exact style) */}
            <button
              onClick={onOpenWishlist}
              className="flex items-center gap-1.5 py-1.5 px-1 rounded-md text-[#333] hover:text-[#f27a1a] transition-colors text-xs sm:text-[13px] font-semibold cursor-pointer relative"
              aria-label="Favorilerim"
            >
              <div className="relative">
                <Heart className="w-4 h-4 text-[#333]" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#f27a1a] text-white font-bold text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Favorilerim</span>
            </button>

            {/* Sepetim (Trendyol exact ShoppingCart icon & orange badge) */}
            <button
              onClick={onOpenCart}
              className="flex items-center gap-1.5 py-1.5 px-1 rounded-md text-[#333] hover:text-[#f27a1a] transition-colors text-xs sm:text-[13px] font-semibold cursor-pointer relative"
              aria-label="Sepetim"
            >
              <div className="relative">
                <ShoppingCart className="w-4 h-4 text-[#333]" />
                {cartCount > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-[#f27a1a] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline">Sepetim</span>
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              aria-label="Menü"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>

        {/* Mobile Search Bar */}
        <div className="md:hidden pb-3">
          <div className="relative w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ürün, kategori veya marka ara"
              className="w-full bg-[#f3f3f3] text-gray-900 placeholder-gray-500 text-xs rounded-md pl-10 pr-10 py-2.5 border border-transparent focus:border-[#f27a1a] focus:outline-none"
            />
            <Search className="w-4 h-4 text-[#f27a1a] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Bar (Clean Professional Subnav) */}
        <nav className="hidden md:flex items-center gap-8 py-3 border-t border-gray-100 overflow-x-auto no-scrollbar text-[13px] font-semibold">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`transition-colors py-1 cursor-pointer whitespace-nowrap relative ${
                  isActive
                    ? 'text-[#f27a1a] font-bold'
                    : 'text-gray-700 hover:text-[#f27a1a]'
                }`}
              >
                <span>{cat.name}</span>
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-[2px] bg-[#f27a1a] rounded-full"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 space-y-4 animate-fadeIn">
            <div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                Kategoriler
              </div>
              <div className="space-y-1">
                {categories.map((cat) => {
                  const isActive = activeCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between ${
                        isActive
                          ? 'bg-[#111827] text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <ArrowRight className="w-4 h-4 text-gray-400" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                Kullanıcı İşlemleri
              </div>
              <div className="grid grid-cols-2 gap-2">
                {currentUser ? (
                  <>
                    <button
                      onClick={() => {
                        onOpenAccount();
                        setMobileMenuOpen(false);
                      }}
                      className="py-2.5 px-3 border border-gray-300 rounded-lg text-xs font-bold text-gray-800 text-center"
                    >
                      Hesabım
                    </button>
                    <button
                      onClick={() => {
                        onOpenOrders();
                        setMobileMenuOpen(false);
                      }}
                      className="py-2.5 px-3 border border-gray-300 rounded-lg text-xs font-bold text-gray-800 text-center"
                    >
                      Siparişlerim
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        onOpenAuth('login');
                        setMobileMenuOpen(false);
                      }}
                      className="py-2.5 px-3 bg-[#111827] text-white rounded-lg text-xs font-bold text-center"
                    >
                      Giriş Yap
                    </button>
                    <button
                      onClick={() => {
                        onOpenAuth('register');
                        setMobileMenuOpen(false);
                      }}
                      className="py-2.5 px-3 border border-gray-300 text-gray-800 rounded-lg text-xs font-bold text-center"
                    >
                      Kayıt Ol
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
