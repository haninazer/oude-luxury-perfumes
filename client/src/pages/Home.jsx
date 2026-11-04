import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Star, ShieldCheck, Flame, Compass, ChevronRight, Award } from 'lucide-react';
import { productApi } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';

export default function Home({ onOpenQuiz }) {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await productApi.getAll();
        if (res.success) {
          setFeaturedProducts(res.products);
        }
      } catch (err) {
        console.error('Failed to load products for home:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="bg-[#F3E5D2] text-[#24150F] overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] bg-gradient-to-b from-[#24150F] via-[#352014] to-[#24150F] text-[#F3E5D2] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
        {/* Subtle decorative gold pattern background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#B58A4F_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Ambient golden lighting */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#B58A4F]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8 z-10">
          {/* Top Tagline Pill */}
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#352014]/80 border border-[#B58A4F]/40 backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-[#B58A4F]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#D8B995] font-medium">
              The Essence of Arabian Luxury
            </span>
          </div>

          {/* Majestic Hero Headline */}
          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#F3E5D2] leading-[1.15]">
            Timeless Scents of the{' '}
            <span className="gold-shimmer-text block sm:inline">
              Arabian Desert
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#D8B995]/90 leading-relaxed font-light">
            Immerse yourself in seven original fragrances inspired by ancient caravan trails, rare Cambodian agarwood, velvety damask rose, and opulent amber.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#B58A4F] to-[#D4AF37] hover:brightness-110 text-[#24150F] font-bold text-xs uppercase tracking-[0.2em] rounded shadow-gold-glow transition-all duration-300 flex items-center justify-center space-x-2 group"
            >
              <span>Explore The Seven Scents</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button
              onClick={onOpenQuiz}
              className="w-full sm:w-auto px-8 py-4 bg-[#352014]/80 hover:bg-[#352014] text-[#F3E5D2] hover:text-[#B58A4F] border border-[#B58A4F]/40 font-medium text-xs uppercase tracking-[0.2em] rounded backdrop-blur-sm transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <Compass className="w-4 h-4 text-[#B58A4F]" />
              <span>Scent Profiler Quiz</span>
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="pt-12 grid grid-cols-3 max-w-lg mx-auto border-t border-[#B58A4F]/20 text-center">
            <div>
              <p className="font-serif text-2xl font-bold text-[#F3E5D2]">7</p>
              <p className="text-[10px] uppercase tracking-wider text-[#D8B995]/70">Signature Scents</p>
            </div>
            <div className="border-x border-[#B58A4F]/20">
              <p className="font-serif text-2xl font-bold text-[#B58A4F]">100ml</p>
              <p className="text-[10px] uppercase tracking-wider text-[#D8B995]/70">Eau de Parfum</p>
            </div>
            <div>
              <p className="font-serif text-2xl font-bold text-[#F3E5D2]">16+ hrs</p>
              <p className="text-[10px] uppercase tracking-wider text-[#D8B995]/70">Royal Longevity</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE SEVEN PERFUMES SHOWCASE */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-mono tracking-widest text-[#B58A4F] block">
            The Complete OUDÉ Anthology
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#24150F]">
            Seven Exclusive Fragrances
          </h2>
          <div className="w-16 h-0.5 bg-[#B58A4F] mx-auto mt-2" />
          <p className="text-sm text-[#352014]/80 leading-relaxed font-light">
            Every bottle is hand-poured in an iconic flacon, reflecting distinct olfactory families—from dark smoky woods to graceful blooming florals.
          </p>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-2 border-[#B58A4F] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-sm text-[#352014] mt-3">Unveiling the Fragrances...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-8 py-3.5 bg-[#352014] hover:bg-[#24150F] text-[#F3E5D2] hover:text-[#B58A4F] border border-[#B58A4F]/40 font-medium text-xs uppercase tracking-widest rounded transition-colors"
          >
            <span>View Complete Collection & Filter Notes</span>
            <ChevronRight className="w-4 h-4 text-[#B58A4F]" />
          </Link>
        </div>
      </section>

      {/* 3. LUXURY SPOTLIGHT: OUD ROYAL & SAHARA OUD */}
      <section className="bg-[#24150F] text-[#F3E5D2] py-20 border-y border-[#B58A4F]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Visual Flacon Display */}
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-[#B58A4F]/40 shadow-2xl bg-[#352014]">
                <img
                  src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop"
                  alt="Oud Royal Amber Flacon"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:block bg-[#352014] p-4 rounded-xl border border-[#B58A4F]/50 shadow-xl max-w-xs">
                <div className="flex items-center space-x-2 text-[#D4AF37] mb-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-serif font-bold">OUD ROYAL • 4.95 Rating</span>
                </div>
                <p className="text-[11px] text-[#D8B995]/80">
                  "The majestic pairing of Cambodian oud with warm golden amber is truly regal."
                </p>
              </div>
            </div>

            {/* Narrative Info */}
            <div className="space-y-6">
              <span className="text-xs uppercase font-mono tracking-widest text-[#B58A4F] block">
                The Crown Jewel of OUDÉ
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F3E5D2] leading-tight">
                The Art of Arabian Perfumery
              </h2>
              <p className="text-sm text-[#D8B995]/90 leading-relaxed font-light">
                In Arabian heritage, perfume is neither an accessory nor an afterthought—it is a sacred language of welcome, nobility, and hospitality.
              </p>
              <p className="text-sm text-[#D8B995]/90 leading-relaxed font-light">
                Every bottle of OUDÉ is formulated with high concentrations of pure perfume oils (28% Extrait concentration), delivering profound projection, mesmerizing depth, and a drydown that endures well into the next dawn.
              </p>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#B58A4F]/20 text-xs">
                <div className="p-3 bg-[#352014]/60 rounded border border-[#B58A4F]/20">
                  <span className="text-[#B58A4F] font-serif font-semibold block text-sm">Cambodian Agarwood</span>
                  <span className="text-[#D8B995]/70">Wild-harvested sustainably from mature resinous heartwood.</span>
                </div>
                <div className="p-3 bg-[#352014]/60 rounded border border-[#B58A4F]/20">
                  <span className="text-[#B58A4F] font-serif font-semibold block text-sm">Damask Rose Essence</span>
                  <span className="text-[#D8B995]/70">Hand-picked at dawn to capture peak aromatic volatile notes.</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  to="/product/1"
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-[#B58A4F] hover:bg-[#D4AF37] text-[#24150F] font-bold text-xs uppercase tracking-wider rounded transition-colors"
                >
                  <span>Experience Oud Royal (₹4,999)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 4. SCENT PROFILER INTERACTIVE BANNER */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-r from-[#24150F] via-[#352014] to-[#24150F] rounded-3xl p-8 sm:p-14 border border-[#B58A4F]/40 shadow-2xl text-[#F3E5D2] relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="text-xs uppercase font-mono tracking-widest text-[#B58A4F] block">
              Not Sure Which Fragrance Fits You?
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Find Your Signature Scent in 60 Seconds
            </h2>
            <p className="text-xs sm:text-sm text-[#D8B995]/80 font-light leading-relaxed">
              Answer three sensory questions about your personality and favourite scent atmosphere. Our olfactory engine will pinpoint your perfect match.
            </p>
            <div className="pt-4">
              <button
                onClick={onOpenQuiz}
                className="px-8 py-3.5 bg-gradient-to-r from-[#B58A4F] to-[#D4AF37] hover:brightness-110 text-[#24150F] font-bold text-xs uppercase tracking-widest rounded-full shadow-gold-glow transition-all"
              >
                Launch Scent Profiler
              </button>
            </div>
          </div>
        </div>
      </section>

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
