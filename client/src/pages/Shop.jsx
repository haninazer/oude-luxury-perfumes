import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw } from 'lucide-react';
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
    <div className="bg-[#1C100B] min-h-screen text-[#F3E5D2] pb-24 pt-20">
      {/* Header Banner */}
      <div className="bg-gradient-to-b from-[#24150F] to-[#1C100B] text-[#F3E5D2] py-16 px-4 sm:px-6 lg:px-8 border-b border-[#B58A4F]/30 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-3 relative z-10">
          <span className="text-xs uppercase font-serif tracking-[0.28em] text-[#B58A4F] block">
            The OUDÉ Fragrance Anthology
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold tracking-tight text-[#F3E5D2]">
            The Luxury Collection
          </h1>
          <p className="text-xs sm:text-sm text-[#D8B995]/80 max-w-xl mx-auto font-light leading-relaxed">
            Discover our seven original creations, crafted with aged Cambodian oud, sensual amber, and pure botanical distillates.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {/* Search, Filter & Sort Bar */}
        <div className="bg-[#24150F] text-[#F3E5D2] p-6 rounded-2xl border border-[#B58A4F]/30 shadow-2xl mb-10 space-y-6">
          
          {/* Top Row: Search & Sort */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 text-[#B58A4F] absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search notes, categories, character..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/50 pl-10 pr-4 py-2.5 text-xs rounded-lg border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
              />
            </div>

            {/* Price Slider & Sort Dropdown */}
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              {/* Max Price Slider */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-[#D8B995]">Max Price:</span>
                <span className="font-mono text-[#D4AF37] font-bold">₹{maxPrice.toLocaleString('en-IN')}</span>
                <input
                  type="range"
                  min="3499"
                  max="6000"
                  step="200"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-24 sm:w-32 accent-[#B58A4F]"
                />
              </div>

              {/* Sort Selector */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-[#D8B995]">Sort:</span>
                <select
                  value={sortBy}
                  onChange={handleSortChange}
                  className="bg-[#352014] text-[#F3E5D2] px-3 py-2 rounded-lg text-xs border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
                >
                  <option value="featured">Featured Collection</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>

              {/* Reset Filters */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#D8B995]/70 hover:text-[#B58A4F] flex items-center space-x-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Row: Category Pills */}
          <div className="pt-4 border-t border-[#B58A4F]/20 flex flex-wrap gap-2 items-center">
            <span className="text-xs text-[#D8B995]/70 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#B58A4F]" /> Olfactory Families:
            </span>
            <button
              onClick={() => handleCategoryChange('All')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-serif tracking-wider transition-colors ${
                currentCategory === 'All'
                  ? 'bg-[#B58A4F] text-[#24150F] font-bold shadow-gold-glow'
                  : 'bg-[#352014] text-[#D8B995] hover:bg-[#352014]/80 border border-[#B58A4F]/30'
              }`}
            >
              All Scents (7)
            </button>
            {categories.map((c) => (
              <button
                key={c.category}
                onClick={() => handleCategoryChange(c.category)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-serif tracking-wider transition-colors ${
                  currentCategory === c.category
                    ? 'bg-[#B58A4F] text-[#24150F] font-bold shadow-gold-glow'
                    : 'bg-[#352014] text-[#D8B995] hover:bg-[#352014]/80 border border-[#B58A4F]/30'
                }`}
              >
                {c.category} ({c.count})
              </button>
            ))}
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center mb-6 text-xs text-[#D8B995]/80">
          <span>
            Showing <strong className="text-[#F3E5D2] font-serif font-bold text-sm">{products.length}</strong> Arabian Luxury Fragrance(s)
          </span>
          {searchQuery && (
            <span>
              Search query: <span className="font-serif italic text-[#D4AF37]">"{searchQuery}"</span>
            </span>
          )}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-[#B58A4F] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-sm text-[#D8B995] mt-3">Filtering Fragrances...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="bg-[#24150F] text-[#F3E5D2] rounded-2xl p-12 text-center border border-[#B58A4F]/30 max-w-lg mx-auto space-y-4">
            <p className="font-serif text-xl">No perfumes matched your criteria</p>
            <p className="text-xs text-[#D8B995]/70">
              Try adjusting your price threshold or clearing your search term to view all seven original fragrances.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-6 py-2.5 bg-[#B58A4F] text-[#24150F] text-xs font-semibold uppercase tracking-wider rounded"
            >
              View All 7 Fragrances
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
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
