import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import { EXTENDED_PRODUCTS, ITEMS_PER_PAGE } from '../data/mockProducts';

const CATEGORIES = ["Scale Figure", "Nendoroid", "Model Kit", "Merchandise"];
const LOCATIONS = [
  "DKI Jakarta", "Jabodetabek", "Bandung", "Medan", "Surabaya", 
  "Bali", "Makassar", "Semarang", "Yogyakarta", "Palembang", "Malang"
];
const AVAILABILITY = ["Ready Stock", "PreOrder"];
const CONDITIONS = ["Baru", "Bekas"];
const SHIPPING = ["Instan", "Same Day"];
const RECENCY = ["7 Hari", "14 Hari", "1 Bulan", "3 Bulan"];

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const searchQuery = searchParams.get('q') || '';
  
  const currentPage = parseInt(searchParams.get('page') || '1');

  const [selectedFilters, setSelectedFilters] = useState<string[]>(() => {
    const filters: string[] = [];
    searchParams.getAll('category').forEach(v => filters.push(v));
    searchParams.getAll('availability').forEach(v => {
        if (v === 'preorder') filters.push('PreOrder');
        else if (v === 'ready') filters.push('Ready Stock');
        else filters.push(v);
    });
    searchParams.getAll('location').forEach(v => filters.push(v));
    searchParams.getAll('condition').forEach(v => filters.push(v));
    searchParams.getAll('shipping').forEach(v => filters.push(v));
    searchParams.getAll('recency').forEach(v => filters.push(v));
    if (searchParams.get('rating') === '4') filters.push("Rating 4 ke atas");
    return filters;
  });

  const [priceRange, setPriceRange] = useState({ 
    min: searchParams.get('minPrice') || '', 
    max: searchParams.get('maxPrice') || '' 
  });
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'Paling Sesuai');
  const [now] = useState(() => Date.now());

  const syncParams = (newFilters: string[], newPrice: typeof priceRange, newSort: string, page: number) => {
    const params = new URLSearchParams();
    if (searchQuery) params.set('q', searchQuery);
    
    newFilters.forEach(f => {
        if (CATEGORIES.includes(f)) params.append('category', f);
        else if (f === "Ready Stock") params.append('availability', 'ready');
        else if (f === "PreOrder") params.append('availability', 'preorder');
        else if (LOCATIONS.includes(f)) params.append('location', f);
        else if (CONDITIONS.includes(f)) params.append('condition', f);
        else if (SHIPPING.includes(f)) params.append('shipping', f);
        else if (RECENCY.includes(f)) params.append('recency', f);
        else if (f === "Rating 4 ke atas") params.set('rating', '4');
    });

    if (newPrice.min) params.set('minPrice', newPrice.min);
    if (newPrice.max) params.set('maxPrice', newPrice.max);
    if (newSort !== 'Paling Sesuai') params.set('sort', newSort);
    if (page > 1) params.set('page', page.toString());

    setSearchParams(params);
  };

  const handleFilterChange = (label: string, checked: boolean) => {
    let nextFilters: string[];
    if (checked) {
      nextFilters = [...selectedFilters, label];
      if (label === "Ready Stock") nextFilters = nextFilters.filter(f => f !== "PreOrder");
      if (label === "PreOrder") nextFilters = nextFilters.filter(f => f !== "Ready Stock");
    } else {
      nextFilters = selectedFilters.filter(f => f !== label);
    }
    
    setSelectedFilters(nextFilters);
    syncParams(nextFilters, priceRange, sortBy, 1);
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    const nextPrice = { ...priceRange, [type]: value };
    setPriceRange(nextPrice);
    syncParams(selectedFilters, nextPrice, sortBy, 1);
  };

  const handleReset = () => {
    setSelectedFilters([]);
    setPriceRange({ min: '', max: '' });
    syncParams([], { min: '', max: '' }, sortBy, 1);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    syncParams(selectedFilters, priceRange, newSort, currentPage);
  };

  const handlePageChange = (page: number) => {
    syncParams(selectedFilters, priceRange, sortBy, page);
    window.scrollTo(0, 0);
  };

  const filteredProducts = useMemo(() => {
    return EXTENDED_PRODUCTS.filter(product => {
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase()) && !product.series.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      if (selectedFilters.length > 0) {
        const locations = selectedFilters.filter(f => LOCATIONS.includes(f));
        const conditions = selectedFilters.filter(f => CONDITIONS.includes(f));
        const availability = selectedFilters.filter(f => AVAILABILITY.includes(f));
        const shipping = selectedFilters.filter(f => SHIPPING.includes(f));
        const categories = selectedFilters.filter(f => CATEGORIES.includes(f));
        const recency = selectedFilters.filter(f => RECENCY.includes(f));
        const ratingFilter = selectedFilters.includes("Rating 4 ke atas");

        if (locations.length > 0 && !locations.includes(product.location)) return false;
        if (conditions.length > 0 && !conditions.includes(product.condition)) return false;
        if (availability.length > 0) {
          const isMatch = availability.some(f => (f === "Ready Stock" && product.isReady) || (f === "PreOrder" && !product.isReady));
          if (!isMatch) return false;
        }
        if (shipping.length > 0 && !product.shipping.some(s => shipping.includes(s))) return false;
        if (categories.length > 0 && !categories.includes(product.category)) return false;
        if (ratingFilter && product.rating < 4) return false;

        if (recency.length > 0) {
          const daysOld = (now - new Date(product.addedAt).getTime()) / (1000 * 60 * 60 * 24);
          const matchesRecency = recency.some(r => {
            if (r === "7 Hari") return daysOld <= 7;
            if (r === "14 Hari") return daysOld <= 14;
            if (r === "1 Bulan") return daysOld <= 30;
            if (r === "3 Bulan") return daysOld <= 90;
            return false;
          });
          if (!matchesRecency) return false;
        }
      }

      const min = parseInt(priceRange.min) || 0;
      const max = parseInt(priceRange.max) || Infinity;
      if (product.price < min || product.price > max) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'Harga Terendah') return a.price - b.price;
      if (sortBy === 'Harga Tertinggi') return b.price - a.price;
      if (sortBy === 'Terbaru') return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
      return 0;
    });
  }, [selectedFilters, priceRange, sortBy, searchQuery, now]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    EXTENDED_PRODUCTS.forEach(p => {
      if (p.isReady) counts["Ready Stock"] = (counts["Ready Stock"] || 0) + 1;
      else counts["PreOrder"] = (counts["PreOrder"] || 0) + 1;
      counts[p.location] = (counts[p.location] || 0) + 1;
      counts[p.condition] = (counts[p.condition] || 0) + 1;
      p.shipping.forEach(s => counts[s] = (counts[s] || 0) + 1);
      counts[p.category] = (counts[p.category] || 0) + 1;
      if (p.rating >= 4) counts["Rating 4 ke atas"] = (counts["Rating 4 ke atas"] || 0) + 1;
      
      const daysOld = (now - new Date(p.addedAt).getTime()) / (1000 * 60 * 60 * 24);
      if (daysOld <= 7) counts["7 Hari"] = (counts["7 Hari"] || 0) + 1;
      if (daysOld <= 14) counts["14 Hari"] = (counts["14 Hari"] || 0) + 1;
      if (daysOld <= 30) counts["1 Bulan"] = (counts["1 Bulan"] || 0) + 1;
      if (daysOld <= 90) counts["3 Bulan"] = (counts["3 Bulan"] || 0) + 1;
    });
    return counts;
  }, [now]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const activeCategoryFilters = selectedFilters.filter(f => CATEGORIES.includes(f));

  return (
    <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      <div className="flex gap-8 overflow-hidden">
        <FilterSidebar
          selectedFilters={selectedFilters}
          onFilterChange={handleFilterChange}
          onReset={handleReset}
          priceRange={priceRange}
          onPriceChange={handlePriceChange}
          filterCounts={filterCounts}
          isMobileOpen={isMobileFilterOpen}
          onClose={() => setIsMobileFilterOpen(false)}
        />

        <div className="flex-1">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <div>
              <h1 className="text-xl font-bold text-slate-900 italic">
                {searchQuery 
                  ? `Hasil Pencarian untuk "${searchQuery}"` 
                  : activeCategoryFilters.length > 0 
                    ? `Kategori: ${activeCategoryFilters.join(', ')}` 
                    : 'Semua Produk'}
              </h1>
              <p className="text-sm text-slate-500">
                {filteredProducts.length} produk ditemukan
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile Filter Button */}
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 4.5h18m-18 5h18m-18 5h18m-18 5h18" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                Filter
              </button>

              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-600 hidden sm:inline whitespace-nowrap">Urutkan:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100 transition-all cursor-pointer"
                >
                  <option>Paling Sesuai</option>
                  <option>Terbaru</option>
                  <option>Harga Terendah</option>
                  <option>Harga Tertinggi</option>
                </select>
              </div>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {paginatedProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-10 md:p-20 text-center border border-dashed border-slate-200">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Yah, barangnya nggak ketemu...</h3>
              <p className="text-slate-500 max-w-xs mx-auto">Coba cek ejaan kamu atau gunakan kata kunci yang lebih umum.</p>
              <button onClick={handleReset} className="mt-8 text-orange-600 font-bold hover:underline">Hapus Semua Filter</button>
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                </button>

                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => handlePageChange(i + 1)}
                    className={`w-10 h-10 rounded-lg font-bold transition-all ${currentPage === i + 1
                        ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                        : 'border border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} /></svg>
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default SearchPage;
