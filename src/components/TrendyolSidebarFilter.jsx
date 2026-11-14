import React, { useState } from 'react';
import { 
  Filter, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  Star, 
  Layers, 
  Tag, 
  DollarSign
} from 'lucide-react';
import { CATEGORIES } from '../data/initialProducts';

export default function TrendyolSidebarFilter({
  categories = CATEGORIES,
  activeCategory,
  onSelectCategory,
  minPrice,
  maxPrice,
  onPriceChange,
  onlyInStock,
  onStockToggle,
  onlyDiscounted,
  onDiscountToggle,
  minRating,
  onRatingChange,
  onResetFilters,
  hasActiveFilters,
  totalProductCount
}) {
  // Accordion open/close states
  const [openSections, setOpenSections] = useState({
    category: true,
    price: true,
    options: true,
    rating: true
  });

  const toggleSection = (sec) => {
    setOpenSections(prev => ({ ...prev, [sec]: !prev[sec] }));
  };

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);

  const handleApplyPrice = (e) => {
    e.preventDefault();
    onPriceChange(Number(localMin), Number(localMax));
  };

  return (
    <aside className="w-full bg-white rounded-2xl border border-gray-200/90 shadow-sm p-4 sm:p-5 space-y-5 sticky top-24">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#C2410C]" />
          <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight">Filtreler</h3>
          <span className="text-[11px] text-gray-400 font-medium">({totalProductCount})</span>
        </div>

        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="text-[11px] font-bold text-[#C2410C] hover:text-[#9a3412] flex items-center gap-1 transition-colors cursor-pointer"
            title="Tüm seçimleri temizle"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Temizle</span>
          </button>
        )}
      </div>

      {/* 1. Kategori Seçimi (Trendyol Tarzı Sol Liste) */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection('category')}
          className="w-full flex items-center justify-between text-xs font-black text-gray-900 mb-2 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-gray-500" />
            <span>İlgili Kategori</span>
          </span>
          {openSections.category ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {openSections.category && (
          <div className="space-y-1 pt-1 animate-fadeIn">
            {categories.map((cat) => {
              const isSelected = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left cursor-pointer ${
                    isSelected
                      ? 'bg-orange-50/80 text-[#C2410C] font-bold'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 font-medium'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-[#C2410C] shrink-0" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Fiyat Aralığı (Trendyol Min - Max inputları) */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection('price')}
          className="w-full flex items-center justify-between text-xs font-black text-gray-900 mb-2 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-gray-500" />
            <span>Fiyat Aralığı (TL)</span>
          </span>
          {openSections.price ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {openSections.price && (
          <form onSubmit={handleApplyPrice} className="space-y-2.5 pt-1 animate-fadeIn">
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                placeholder="En Az"
                value={localMin}
                onChange={(e) => setLocalMin(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#111827]"
              />
              <span className="text-gray-400 text-xs">-</span>
              <input
                type="number"
                min="0"
                placeholder="En Çok"
                value={localMax}
                onChange={(e) => setLocalMax(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#111827]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-1.5 bg-[#111827] hover:bg-black text-white text-xs font-bold rounded-lg transition-colors cursor-pointer shadow-sm"
            >
              Uygula
            </button>
          </form>
        )}
      </div>

      {/* 3. Avantajlı Seçenekler (Stokta, İndirimli) */}
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection('options')}
          className="w-full flex items-center justify-between text-xs font-black text-gray-900 mb-2 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-gray-500" />
            <span>Fırsat & Durum</span>
          </span>
          {openSections.options ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {openSections.options && (
          <div className="space-y-2 pt-1 animate-fadeIn text-xs">
            {/* Sadece Stoktakiler */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700 hover:text-black">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => onStockToggle(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-[#C2410C]"
              />
              <span className="font-medium">Sadece Stokta Olanlar</span>
            </label>

            {/* İndirimli Ürünler */}
            <label className="flex items-center gap-2 cursor-pointer select-none text-gray-700 hover:text-black">
              <input
                type="checkbox"
                checked={onlyDiscounted}
                onChange={(e) => onDiscountToggle(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 accent-[#C2410C]"
              />
              <span className="font-medium">İndirimli Ürünler</span>
              <span className="ml-auto text-[10px] font-bold text-[#C2410C] bg-orange-50 px-1.5 py-0.2 rounded border border-orange-200">
                Fırsat
              </span>
            </label>
          </div>
        )}
      </div>

      {/* 4. Değerlendirme Puanı (4 Yıldız ve Üzeri vb.) */}
      <div>
        <button
          onClick={() => toggleSection('rating')}
          className="w-full flex items-center justify-between text-xs font-black text-gray-900 mb-2 cursor-pointer"
        >
          <span className="flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
            <span>Ürün Puanı</span>
          </span>
          {openSections.rating ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>

        {openSections.rating && (
          <div className="space-y-1 pt-1 animate-fadeIn text-xs">
            {[4.5, 4.0, 3.5].map((rate) => {
              const isSelected = minRating === rate;
              return (
                <button
                  key={rate}
                  onClick={() => onRatingChange(isSelected ? 0 : rate)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer text-left ${
                    isSelected ? 'bg-amber-50 text-amber-900 font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                  </div>
                  <span>{rate} ve üzeri</span>
                  {isSelected && <Check className="w-3 h-3 text-amber-600 ml-auto" />}
                </button>
              );
            })}
          </div>
        )}
      </div>

    </aside>
  );
}
