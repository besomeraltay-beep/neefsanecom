import React from 'react';
import { ArrowRight, ShieldCheck, Truck, RefreshCw, Sparkles, CheckCircle2 } from 'lucide-react';

export default function HeroBanner({ onExploreClick }) {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        
        {/* Main Hero Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text Content */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gray-100 text-gray-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#C2410C]"></span>
              <span>2026 Özel Koleksiyon</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#111827] leading-[1.15]">
              Tarzını Yansıtan <br />
              <span className="text-[#C2410C]">Detaylar.</span>
            </h1>

            <p className="text-gray-600 text-base sm:text-lg max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              3D figürlerden günlük aksesuarlarına, sevdiğin ürünler NEEFSANE'de.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111827] hover:bg-black text-white font-bold text-sm sm:text-base px-8 py-4 rounded-lg shadow-sm hover:shadow transition-all duration-200 cursor-pointer"
              >
                <span>Ürünleri Keşfet</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick check items */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-y-2 gap-x-6 text-xs text-gray-600 font-medium">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C2410C]" />
                <span>Hassas 3D Katman Baskısı</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C2410C]" />
                <span>316L Kararmaz Çelik</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#C2410C]" />
                <span>Aynı Gün Hızlı Teslimat</span>
              </div>
            </div>

          </div>

          {/* Visual Showcase (Featured Images Grid) */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 max-w-lg mx-auto lg:max-w-none">
              
              {/* Card 1: 3D Car */}
              <div className="relative group overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 aspect-[4/5]">
                <img
                  src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80"
                  alt="3D Araba Figürleri"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80';
                  }}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300">Özel Seri</span>
                  <div className="text-sm font-bold truncate">3D Araba Figürleri</div>
                </div>
              </div>

              {/* Right column with two smaller cards */}
              <div className="flex flex-col gap-3 sm:gap-4">
                
                {/* Card 2: Phone Case */}
                <div className="relative group overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 flex-1">
                  <img
                    src="https://images.unsplash.com/photo-1601593346740-925612772716?w=600&auto=format&fit=crop&q=80"
                    alt="Telefon Kılıfları"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300">Darbe Emici</span>
                    <div className="text-xs sm:text-sm font-bold truncate">Telefon Kılıfları</div>
                  </div>
                </div>

                {/* Card 3: Jewelry / Necklace */}
                <div className="relative group overflow-hidden rounded-2xl bg-gray-100 border border-gray-200 flex-1">
                  <img
                    src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&auto=format&fit=crop&q=80"
                    alt="Kolye & Bileklik"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1601593346740-925612772716?w=800&auto=format&fit=crop&q=80';
                    }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-gray-300">Kararmaz Çelik</span>
                    <div className="text-xs sm:text-sm font-bold truncate">Kolye & Bileklik</div>
                  </div>
                </div>

              </div>

            </div>
          </div>

        </div>

        {/* 4 Feature Trust Pillars */}
        <div className="mt-12 pt-8 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#111827] shrink-0">
              <Truck className="w-5 h-5 text-[#C2410C]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-gray-900">Hızlı Kargo</div>
              <div className="text-[11px] text-gray-500">500 TL üzeri ücretsiz</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#111827] shrink-0">
              <ShieldCheck className="w-5 h-5 text-[#C2410C]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-gray-900">Güvenli Ödeme</div>
              <div className="text-[11px] text-gray-500">256-Bit SSL & 3D Secure</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#111827] shrink-0">
              <Sparkles className="w-5 h-5 text-[#C2410C]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-gray-900">Orijinal Kalite</div>
              <div className="text-[11px] text-gray-500">Özel 3D ve çelik işçilik</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
            <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-[#111827] shrink-0">
              <RefreshCw className="w-5 h-5 text-[#C2410C]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-bold text-gray-900">14 Gün İade</div>
              <div className="text-[11px] text-gray-500">Kolay değişim garantisi</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
