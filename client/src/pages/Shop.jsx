import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, Sparkles } from 'lucide-react';
import { productApi } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  // Filters state from URL or defaults
  const currentCategory = searchParams.get('category') || 'All';
  const searchQuery = searchParams.get('q') || '';
  const sortBy = searchParams.get('sortBy') || 'featured';
  const [maxPrice, setMaxPrice] = useState(6000);

  // Fetch categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await productApi.getCategories();
        if (res.success) {
          setCategories(res.categories);
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    }
    loadCategories();
  }, []);

  // Fetch products whenever filters change
  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = {};
        if (currentCategory && currentCategory !== 'All') params.category = currentCategory;
        if (searchQuery.trim()) params.q = searchQuery.trim();
        if (sortBy) params.sortBy = sortBy;
        if (maxPrice < 6000) params.maxPrice = maxPrice;

        const res = await productApi.getAll(params);
        if (res.success) {
          setProducts(res.products);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [currentCategory, searchQuery, sortBy, maxPrice]);

  const handleCategoryChange = (cat) => {
    const next = new URLSearchParams(searchParams);
    if (cat === 'All') {
      next.delete('category');
    } else {
      next.set('category', cat);
    }
    setSearchParams(next);
  };

  const handleSearchChange = (e) => {
    const val = e.target.value;
    const next = new URLSearchParams(searchParams);
    if (val.trim()) {
      next.set('q', val);
    } else {
      next.delete('q');
    }
    setSearchParams(next);
  };

  const handleSortChange = (e) => {
    const next = new URLSearchParams(searchParams);
    next.set('sortBy', e.target.value);
    setSearchParams(next);
  };

  const handleResetFilters = () => {
    setMaxPrice(6000);
    setSearchParams({});
  };

  const hasActiveFilters = currentCategory !== 'All' || searchQuery.trim() !== '' || maxPrice < 6000 || sortBy !== 'featured';

  return (
    <div className="luxury-canvas-bg min-h-screen text-[#F3E5D2] pb-32 pt-24 relative overflow-hidden">
      
      {/* Editorial Header Banner */}
      <div className="relative py-20 px-6 sm:px-10 lg:px-14 text-center border-b border-[#D4AF37]/20 overflow-hidden">
        
        {/* Ambient Top Golden Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-56 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.2)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-black/60 border border-[#D4AF37]/40 shadow-lg backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[11px] uppercase font-serif tracking-[0.3em] text-[#D4AF37] font-semibold">
              MAISON DE HAUTE PARFUMERIE • DUBAI & GRASSE
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight gold-foil-text drop-shadow-[0_4px_24px_rgba(212,175,55,0.35)]">
            The Imperial Collection
          </h1>

          {/* Ornate Gold Star Divider */}
          <div className="flex items-center justify-center space-x-3 my-4">
            <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
            <span className="text-[#D4AF37] text-sm">✦</span>
            <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
          </div>

          <p className="text-xs sm:text-base text-[#D8B995]/90 max-w-2xl mx-auto font-light leading-relaxed">
            Seven rare olfactory expressions distilled from sustainably aged Cambodian agarwood, wild mountain roses, and golden ambergris. Masterfully formulated at 28% Extrait de Parfum concentration for monumental sillage.
          </p>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 pt-12">
        
        {/* Glassmorphic Haute Parfumerie Filter Suite */}
        <div className="luxury-glass-panel p-6 sm:p-8 rounded-3xl mb-12 space-y-6 relative z-10">
          
          {/* Top Row: Search & Sort Controls */}
          <div className="flex flex-col md:flex-row gap-5 items-center justify-between">
            
            {/* Search Input with Gold Ambient Halo */}
            <div className="relative w-full md:w-96 group">
              <Search className="w-4 h-4 text-[#D4AF37] absolute left-4 top-3.5 transition-transform group-hover:scale-110" />
              <input
                type="text"
                placeholder="Search notes, oud, saffron, amber..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[#120905]/90 text-[#F3E5D2] placeholder-[#D8B995]/45 pl-11 pr-4 py-3 text-xs rounded-xl border border-[#D4AF37]/25 hover:border-[#D4AF37]/60 focus:border-[#D4AF37] focus:shadow-[0_0_20px_rgba(212,175,55,0.25)] transition-all focus:outline-none"
              />
            </div>

            {/* Price Slider & Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-5 w-full md:w-auto justify-between md:justify-end">
              
              {/* Max Price Slider */}
              <div className="flex items-center space-x-3 text-xs bg-[#120905]/60 px-4 py-2.5 rounded-xl border border-[#D4AF37]/20">
                <span className="text-[#D8B995]/80 font-serif">Price Ceiling:</span>
                <span className="font-mono text-[#D4AF37] font-bold text-sm">₹{maxPrice.toLocaleString('en-IN')}</span>
                <input
                  type="range"
                  min="3499"
                  max="6000"
                  step="200"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-[#D4AF37] hover:accent-[#FFF3D1] cursor-pointer transition-all"
                />
              </div>

              {/* Sort Selector */}
              <div className="flex items-center space-x-2 text-xs bg-[#120905]/60 px-4 py-2.5 rounded-xl border border-[#D4AF37]/20">
                <span className="text-[#D8B995]/80 font-serif">Sort:</span>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="bg-transparent text-[#F3E5D2] text-xs font-serif border-none focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-[#180C07] text-[#F3E5D2]">Featured Masterpieces</option>
                  <option value="price_asc" className="bg-[#180C07] text-[#F3E5D2]">Price: Low to High</option>
                  <option value="price_desc" className="bg-[#180C07] text-[#F3E5D2]">Price: High to Low</option>
                  <option value="rating" className="bg-[#180C07] text-[#F3E5D2]">Highest Rated</option>
                  <option value="name" className="bg-[#180C07] text-[#F3E5D2]">Alphabetical</option>
                </select>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#D4AF37] hover:brightness-125 hover:scale-105 flex items-center space-x-1.5 px-3 py-2 rounded-lg border border-[#D4AF37]/30 transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5 hover:rotate-180 transition-transform duration-500" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Olfactory Families Pills */}
          <div className="pt-4 border-t border-[#D4AF37]/15 flex flex-wrap gap-2.5 items-center">
            <span className="text-xs text-[#D8B995]/80 mr-1 flex items-center gap-1 font-serif">
              <Filter className="w-3.5 h-3.5 text-[#D4AF37]" /> Olfactory Families:
            </span>
            <button
              onClick={() => handleCategoryChange('All')}
              className={`px-4 py-2 rounded-full text-xs font-serif tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 ${
                currentCategory === 'All'
                  ? 'btn-gold-embossed'
                  : 'bg-[#180C07]/80 text-[#D8B995] hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] hover:border-[#D4AF37] border border-[#B58A4F]/30'
              }`}
            >
              All Scents (7)
            </button>
            {categories.map((c) => (
              <button
                key={c.category}
                onClick={() => handleCategoryChange(c.category)}
                className={`px-4 py-2 rounded-full text-xs font-serif tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 ${
                  currentCategory === c.category
                    ? 'btn-gold-embossed'
                    : 'bg-[#180C07]/80 text-[#D8B995] hover:bg-[#D4AF37]/15 hover:text-[#D4AF37] hover:border-[#D4AF37] border border-[#B58A4F]/30'
                }`}
              >
                {c.category} ({c.count})
              </button>
            ))}
          </div>

        </div>

        {/* Results Bar */}
        <div className="flex justify-between items-center mb-8 text-xs text-[#D8B995]/80">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            <span>
              Presenting <strong className="gold-foil-text font-serif font-bold text-sm">{products.length}</strong> Arabian Haute Parfumerie Flacon(s)
            </span>
          </div>
          {searchQuery && (
            <span>
              Query: <span className="font-serif italic text-[#D4AF37]">"{searchQuery}"</span>
            </span>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-28 text-center space-y-4">
            <div className="w-12 h-12 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto shadow-gold-glow" />
            <p className="font-serif text-sm text-[#D8B995]">Unveiling the Imperial Reserves...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="luxury-glass-panel rounded-3xl p-14 text-center max-w-lg mx-auto space-y-5">
            <p className="font-serif text-2xl gold-foil-text font-bold">No Fragrances Found</p>
            <p className="text-xs text-[#D8B995]/80 leading-relaxed">
              No flacons matched your olfactory filter criteria. Reset your filters to explore all seven original Arabian creations.
            </p>
            <button
              onClick={handleResetFilters}
              className="btn-gold-embossed px-6 py-3 rounded-xl text-xs uppercase tracking-wider font-bold"
            >
              View Full Collection
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-7 sm:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}

      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal
          product={quickViewProduct}
          onClose={() => setQuickViewProduct(null)}
        />
      )}
    </div>
  );
}
