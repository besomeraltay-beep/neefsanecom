import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CategoryCards({ onSelectCategory, activeCategory }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -260 : 260;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  // Circular Trendyol categories matching the user's uploaded screenshot
  const categoryItems = [
    {
      id: 'all',
      name: 'Ürünleri Keşfet',
      image: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=240&auto=format&fit=crop&q=80',
      badge: 'TÜMÜ',
      ringColor: 'ring-[#f27a1a]'
    },
    {
      id: '3d-araba-figuru',
      name: '3D Araba Figürleri',
      image: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=240&auto=format&fit=crop&q=80',
      badge: 'ÇOK SATAN',
      ringColor: 'ring-orange-500'
    },
    {
      id: 'telefon-kilifi',
      name: 'Telefon Kılıfları',
      image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=240&auto=format&fit=crop&q=80',
      badge: 'MAGSAFE',
      ringColor: 'ring-amber-500'
    },
    {
      id: 'kolye',
      name: 'Kararmaz Çelik Kolye',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=240&auto=format&fit=crop&q=80',
      badge: '316L ÇELİK',
      ringColor: 'ring-yellow-600'
    },
    {
      id: 'bileklik',
      name: 'Özel Bileklikler',
      image: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=240&auto=format&fit=crop&q=80',
      ringColor: 'ring-blue-500'
    },
    {
      id: 'diger-aksesuarlar',
      name: 'Diğer Aksesuarlar',
      image: 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=240&auto=format&fit=crop&q=80',
      ringColor: 'ring-purple-500'
    },
    {
      id: 'bestseller_quick',
      name: 'Avantajlı Ürünler',
      image: 'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?w=240&auto=format&fit=crop&q=80',
      badge: 'FIRSAT',
      ringColor: 'ring-red-500'
    },
    {
      id: 'discount_quick',
      name: 'Fiyatı Düşenler',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=240&auto=format&fit=crop&q=80',
      badge: '% İNDİRİM',
      ringColor: 'ring-emerald-500'
    }
  ];

  return (
    <div className="bg-white border-b border-gray-100 py-3 sm:py-4">
      {/* Container width exactly matching Trendyol: max-w-[1200px] */}
      <div className="max-w-[1200px] mx-auto px-4 relative">
        
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => scroll('left')}
          className="hidden md:flex absolute -left-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 transition-all cursor-pointer"
          aria-label="Önceki Kategoriler"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Circular Category Stories Row (No 'Kategoriler' header text) */}
        <div 
          ref={scrollRef}
          className="flex items-start justify-between gap-3 sm:gap-6 overflow-x-auto no-scrollbar scroll-smooth px-1 py-1"
        >
          {categoryItems.map((item) => {
            const isSelected = activeCategory === item.id || (item.id === 'all' && activeCategory === 'all');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'bestseller_quick' || item.id === 'discount_quick') {
                    onSelectCategory('all');
                  } else {
                    onSelectCategory(item.id);
                  }
                }}
                className="group flex flex-col items-center shrink-0 w-[68px] sm:w-[82px] text-center cursor-pointer focus:outline-none"
              >
                {/* Circular Image Container */}
                <div className={`relative w-15 h-15 sm:w-17 sm:h-17 rounded-full p-[2.5px] transition-all duration-200 ${
                  isSelected 
                    ? 'ring-2 ring-[#f27a1a] shadow-xs' 
                    : 'border border-gray-200 group-hover:border-[#f27a1a] group-hover:shadow-xs'
                }`}>
                  <div className="w-full h-full rounded-full overflow-hidden bg-gray-50">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1601593346740-925612772716?w=240&auto=format&fit=crop&q=80';
                      }}
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>

                  {item.badge && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-[#f27a1a] text-white text-[8px] font-black uppercase px-1.5 py-0.2 rounded-full shadow-2xs whitespace-nowrap">
                      {item.badge}
                    </span>
                  )}
                </div>

                {/* Text Title Below Circle */}
                <span className={`text-[11px] sm:text-xs mt-2 line-clamp-2 leading-tight transition-colors ${
                  isSelected 
                    ? 'font-bold text-[#f27a1a]' 
                    : 'font-semibold text-gray-700 group-hover:text-black'
                }`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => scroll('right')}
          className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md items-center justify-center text-gray-700 hover:text-black hover:bg-gray-50 transition-all cursor-pointer"
          aria-label="Sonraki Kategoriler"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
