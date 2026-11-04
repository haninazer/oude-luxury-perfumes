import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Compass, ArrowRight, Sparkles, Flame, Droplets, ShieldCheck, ChevronDown } from 'lucide-react';
import { productApi } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';
import HeroFlacon from '../components/HeroFlacon.jsx';

export default function Home({ onOpenQuiz }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await productApi.getAll();
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
  }, []);

  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#1C100B] text-[#F3E5D2] overflow-hidden">
      
      {/* 1. PRIMARY HERO SECTION - 2K ULTRA HD DESERT SUNSET & GROUNDED FLACON */}
      <section className="relative min-h-screen w-full flex items-center overflow-hidden bg-[#24150F]">
        
        {/* Laptop / Desktop Background Image (Ultra HD 2560x1440 2K) */}
        <div
          className="hidden md:block absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/bg-desktop.jpg')`,
            imageRendering: '-webkit-optimize-contrast',
          }}
        />

        {/* Mobile Background Image (Super Retina 1364x2048) */}
        <div
          className="block md:hidden absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/bg-mobile.jpg')`,
            imageRendering: '-webkit-optimize-contrast',
          }}
        />

        {/* Content Container */}
        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 w-full z-10 py-24 sm:py-28 min-h-screen flex items-center">
          <div className="max-w-xl space-y-6 sm:space-y-8">
            
            {/* Pre-Heading */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] sm:text-xs uppercase font-serif tracking-[0.28em] text-[#352014] font-semibold drop-shadow-[0_1px_1px_rgba(255,230,190,0.5)]">
                OUDÉ — THE ART OF ARABIAN PERFUMERY
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold text-[#24150F] leading-[1.05] tracking-tight drop-shadow-[0_1px_2px_rgba(255,230,190,0.4)]">
              THE ESSENCE OF<br />
              ARABIAN<br />
              LUXURY.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-[#352014] font-medium leading-relaxed max-w-md drop-shadow-[0_1px_1px_rgba(255,230,190,0.3)]">
              A curated journey through rare oud, precious woods and the timeless spirit of Arabia.
            </p>

            {/* CTA Buttons */}
            <div className="pt-2 sm:pt-4 flex flex-wrap gap-4 items-center">
              <Link
                to="/shop"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-[#24150F] hover:bg-[#352014] text-[#F3E5D2] font-serif text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-2xl group hover:shadow-gold-glow"
              >
                <span>DISCOVER THE COLLECTION</span>
                <ArrowUpRight className="w-4 h-4 text-[#D8B995] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>

              <button
                onClick={onOpenQuiz}
                className="inline-flex items-center space-x-2 px-6 py-4 bg-[#24150F]/15 hover:bg-[#24150F]/25 text-[#24150F] border border-[#24150F]/40 backdrop-blur-sm text-xs font-serif uppercase tracking-[0.2em] font-semibold transition-all"
              >
                <Compass className="w-3.5 h-3.5 text-[#352014]" />
                <span>Scent Profiler</span>
              </button>
            </div>

          </div>
        </div>

        {/* Desktop Bottle: Seated directly on top of the rock plinth */}
        <div className="hidden md:block absolute right-[13%] lg:right-[15%] xl:right-[16.5%] bottom-[13%] lg:bottom-[15%] w-44 sm:w-48 md:w-52 lg:w-56 z-20 pointer-events-auto">
          <HeroFlacon />
        </div>

        {/* Mobile Bottle: Seated on the mobile rock */}
        <div className="block md:hidden absolute right-[10%] sm:right-[14%] bottom-[22%] sm:bottom-[24%] w-36 sm:w-40 z-20 pointer-events-auto">
          <HeroFlacon />
        </div>

        {/* Subtle scroll indicator */}
        <button
          onClick={scrollToCollection}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 text-[#352014]/70 hover:text-[#24150F] flex flex-col items-center space-y-1 transition-colors animate-bounce"
          aria-label="Scroll to next section"
        >
          <span className="text-[10px] uppercase font-serif tracking-widest font-semibold">Explore</span>
          <ChevronDown className="w-4 h-4" />
        </button>
      </section>

      {/* 2. SECOND HERO SECTION: GOLDEN SAND DUNES SENSORY CHAPTER */}
      <section
        className="relative py-28 px-6 sm:px-10 lg:px-14 bg-cover bg-center text-[#F3E5D2] overflow-hidden border-y border-[#B58A4F]/40 shadow-2xl"
        style={{
          backgroundImage: `url('/dunes-sand.jpg')`,
          backgroundAttachment: 'scroll',
        }}
      >
        {/* Top & Bottom Deep Espresso Vignette Shadows for Seamless Transition */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#24150F] to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#1C100B] to-transparent pointer-events-none" />

        {/* Center Contrast Shade for Text Readability */}
        <div className="absolute inset-0 bg-[#24150F]/45 backdrop-blur-[1px] pointer-events-none" />

        <div className="relative max-w-6xl mx-auto z-10 text-center space-y-10">
          
          {/* Header */}
          <div className="space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#24150F]/80 border border-[#B58A4F]/50 shadow-xl backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] uppercase font-serif tracking-[0.25em] text-[#D8B995] font-semibold">
                THE SACRED SANDS OF ARABIA
              </span>
            </div>

            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#F3E5D2] leading-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]">
              Born from the Dunes,<br />
              <span className="text-[#D4AF37] italic font-serif">Matured by Ancient Craft.</span>
            </h2>

            <p className="text-sm sm:text-base text-[#F3E5D2]/90 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
              Across thousands of miles of undulating desert sand, the ritual of perfumery has heralded the arrival of Arabian nobility. Every flacon of OUDÉ captures this timeless alchemy.
            </p>
          </div>

          {/* 3 Sensory Pillars Over the Dunes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 text-left">
            
            {/* Pillar 1: Rare Agarwood */}
            <div className="bg-[#24150F]/85 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[#B58A4F]/40 shadow-2xl hover:border-[#D4AF37] transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#352014] border border-[#B58A4F]/40 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:scale-110 transition-transform">
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#B58A4F] block mb-1">
                Raw Heartwood Essence
              </span>
              <h3 className="font-serif text-xl font-bold text-[#F3E5D2] mb-2">
                Aged Cambodian Oud
              </h3>
              <p className="text-xs text-[#D8B995]/85 leading-relaxed">
                Extracted from ancient resinous agarwood trees, aged in sealed glass vessels for rich balsamic warmth, smoke, and majestic authority.
              </p>
            </div>

            {/* Pillar 2: Dawn Distillates */}
            <div className="bg-[#24150F]/85 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[#B58A4F]/40 shadow-2xl hover:border-[#D4AF37] transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#352014] border border-[#B58A4F]/40 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:scale-110 transition-transform">
                <Droplets className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#B58A4F] block mb-1">
                Floral Royalty
              </span>
              <h3 className="font-serif text-xl font-bold text-[#F3E5D2] mb-2">
                Taif & Damask Roses
              </h3>
              <p className="text-xs text-[#D8B995]/85 leading-relaxed">
                Harvested by hand in the cool mountain dawn to preserve volatile dew petals, lending velvet romance and golden sweetness.
              </p>
            </div>

            {/* Pillar 3: 16+ Hours Extrait */}
            <div className="bg-[#24150F]/85 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[#B58A4F]/40 shadow-2xl hover:border-[#D4AF37] transition-all duration-300 group hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#352014] border border-[#B58A4F]/40 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#B58A4F] block mb-1">
                Uncompromising Potency
              </span>
              <h3 className="font-serif text-xl font-bold text-[#F3E5D2] mb-2">
                28% Extrait Concentration
              </h3>
              <p className="text-xs text-[#D8B995]/85 leading-relaxed">
                Formulated at the highest concentration grade in fine perfumery, guaranteeing an unforgettable royal sillage that endures past sunset.
              </p>
            </div>

          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToCollection}
              className="px-8 py-4 bg-gradient-to-r from-[#B58A4F] to-[#D4AF37] hover:brightness-110 text-[#24150F] font-serif text-xs uppercase tracking-[0.22em] font-bold rounded-lg shadow-gold-glow transition-all flex items-center space-x-2"
            >
              <span>Explore The Seven Scents</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenQuiz}
              className="px-8 py-4 bg-[#24150F]/80 hover:bg-[#24150F] text-[#F3E5D2] border border-[#B58A4F]/50 font-serif text-xs uppercase tracking-[0.2em] font-medium rounded-lg backdrop-blur-md transition-all flex items-center space-x-2"
            >
              <Compass className="w-4 h-4 text-[#D4AF37]" />
              <span>Take Scent Profiler Quiz</span>
            </button>
          </div>

        </div>
      </section>

      {/* 3. THE SEVEN PERFUMES COLLECTION (MATCHING DARK LUXURY ARABIAN THEME) */}
      <section id="collection" className="py-24 px-6 sm:px-10 lg:px-14 max-w-7xl mx-auto bg-[#1C100B]">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-serif tracking-[0.25em] text-[#B58A4F] block">
            The OUDÉ Fragrance Anthology
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#F3E5D2]">
            The Seven Iconic Creations
          </h2>
          <div className="w-16 h-0.5 bg-[#B58A4F] mx-auto mt-2" />
          <p className="text-sm text-[#D8B995]/80 font-light leading-relaxed">
            Each flacon represents a distinct olfactory odyssey—formulated with 28% Extrait de Parfum concentration for unyielding longevity and majestic sillage.
          </p>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-2 border-[#B58A4F] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-sm text-[#D8B995] mt-3">Curating the Fragrances...</p>
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

        <div className="text-center mt-14">
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-[#B58A4F] hover:bg-[#D4AF37] text-[#24150F] text-xs font-serif uppercase tracking-[0.2em] font-bold transition-all shadow-gold-glow"
          >
            <span>Explore All 7 Fragrances & Filter Notes</span>
            <ArrowRight className="w-4 h-4 text-[#24150F]" />
          </Link>
        </div>
      </section>

      {/* 4. OUR STORY SECTION */}
      <section id="story" className="bg-[#24150F] text-[#F3E5D2] py-24 border-y border-[#B58A4F]/30 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Flacon Feature */}
            <div className="lg:col-span-5 relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-[#B58A4F]/40 shadow-2xl bg-[#352014]">
                <img
                  src="https://images.unsplash.com/photo-1547887537-6158d64c35b3?q=80&w=1200&auto=format&fit=crop"
                  alt="Arabian Perfume Heritage"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:block bg-[#352014] p-5 rounded-2xl border border-[#B58A4F]/50 shadow-2xl max-w-xs">
                <p className="font-serif text-[#D4AF37] font-bold text-sm">28% Extrait Concentration</p>
                <p className="text-xs text-[#D8B995]/80 mt-1">
                  Aged Cambodian agarwood and Taif rose oils matured in darkness for unmatched longevity.
                </p>
              </div>
            </div>

            {/* Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase font-serif tracking-[0.25em] text-[#B58A4F] block">
                Heritage & Alchemy
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight text-[#F3E5D2]">
                Crafted in the Heart of Arabian Tradition
              </h2>
              <div className="w-16 h-0.5 bg-[#B58A4F]" />
              <p className="text-sm text-[#D8B995]/90 leading-relaxed font-light">
                In Arabian culture, fragrance is a timeless sacred rite—a gesture of hospitality, nobility, and presence. OUDÉ was founded to revive ancient spice trails and resin trade routes through modern olfactory mastery.
              </p>
              <p className="text-sm text-[#D8B995]/90 leading-relaxed font-light">
                Every drop contains rare sustainably-harvested Cambodian agarwood, velvety Damascus rose distillates, golden frankincense from the Dhofar hills, and sun-warmed amber, creating scents that linger long after the wearer has departed.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#B58A4F]/20 text-xs">
                <div className="p-4 bg-[#352014]/60 rounded-xl border border-[#B58A4F]/20">
                  <span className="text-[#B58A4F] font-serif font-bold text-sm block">Rare Oud Woods</span>
                  <span className="text-[#D8B995]/70">Harvested from deep natural resinous heartwood.</span>
                </div>
                <div className="p-4 bg-[#352014]/60 rounded-xl border border-[#B58A4F]/20">
                  <span className="text-[#B58A4F] font-serif font-bold text-sm block">Hand-Sealed</span>
                  <span className="text-[#D8B995]/70">Finished with golden brass flacon filigree.</span>
                </div>
                <div className="p-4 bg-[#352014]/60 rounded-xl border border-[#B58A4F]/20">
                  <span className="text-[#B58A4F] font-serif font-bold text-sm block">16+ Hours</span>
                  <span className="text-[#D8B995]/70">Tested longevity on skin and fabrics.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SCENT QUIZ PROFILER CALLOUT */}
      <section id="quiz" className="py-20 px-6 sm:px-10 lg:px-14 max-w-5xl mx-auto text-center">
        <div className="bg-gradient-to-r from-[#24150F] via-[#352014] to-[#24150F] rounded-3xl p-8 sm:p-14 border border-[#B58A4F]/40 shadow-2xl text-[#F3E5D2] relative overflow-hidden">
          <div className="relative z-10 max-w-xl mx-auto space-y-4">
            <span className="text-xs uppercase font-serif tracking-[0.25em] text-[#B58A4F] block">
              Sensory Diagnostics
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Find Your Signature Arabian Scent
            </h2>
            <p className="text-xs sm:text-sm text-[#D8B995]/80 font-light leading-relaxed">
              Answer 3 quick sensory questions about your personality, mood, and preferred sillage. Our olfactory engine will match you with your exact OUDÉ flacon.
            </p>
            <div className="pt-4">
              <button
                onClick={onOpenQuiz}
                className="px-8 py-4 bg-gradient-to-r from-[#B58A4F] to-[#D4AF37] hover:brightness-110 text-[#24150F] font-bold text-xs uppercase tracking-widest rounded-full shadow-gold-glow transition-all"
              >
                Start Scent Quiz (60 Seconds)
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

      {/* Contact anchor for nav scrolling */}
      <div id="contact" />
    </div>
  );
}
