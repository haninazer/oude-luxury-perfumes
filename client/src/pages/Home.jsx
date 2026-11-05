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
    <div className="bg-[#24150F] text-[#F3E5D2] overflow-hidden">
      
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
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="hero-animate-preheading text-[11px] sm:text-xs uppercase font-serif tracking-[0.28em] text-[#352014] font-semibold drop-shadow-[0_1px_1px_rgba(255,230,190,0.5)]">
                OUDÉ — THE ART OF ARABIAN PERFUMERY
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold text-[#24150F] leading-[1.05] tracking-tight drop-shadow-[0_1px_2px_rgba(255,230,190,0.4)]">
              <span className="block overflow-hidden pb-1">
                <span className="hero-animate-line-1">THE ESSENCE OF</span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="hero-animate-line-2">ARABIAN</span>
              </span>
              <span className="block overflow-hidden pb-1">
                <span className="hero-animate-line-3">LUXURY.</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="hero-animate-subtitle text-sm sm:text-base md:text-lg text-[#352014] font-medium leading-relaxed max-w-md drop-shadow-[0_1px_1px_rgba(255,230,190,0.3)]">
              A curated journey through rare oud, precious woods and the timeless spirit of Arabia.
            </p>

            {/* CTA Buttons */}
            <div className="hero-animate-cta pt-2 sm:pt-4 flex flex-wrap gap-4 items-center">
              <Link
                to="/shop"
                className="inline-flex items-center space-x-3 px-8 py-4 bg-[#24150F] hover:bg-[#352014] text-[#F3E5D2] font-serif text-xs uppercase tracking-[0.22em] font-semibold transition-all duration-300 shadow-2xl group hover:shadow-[0_8px_30px_rgba(181,138,79,0.45)] hover:scale-105 hover:border hover:border-[#D4AF37]/60"
              >
                <span>DISCOVER THE COLLECTION</span>
                <ArrowUpRight className="w-4 h-4 text-[#D8B995] group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#D4AF37] transition-all" />
              </Link>

              <button
                onClick={onOpenQuiz}
                className="inline-flex items-center space-x-2 px-6 py-4 bg-[#24150F]/15 hover:bg-[#24150F]/30 hover:border-[#24150F] hover:scale-105 text-[#24150F] border border-[#24150F]/40 backdrop-blur-sm text-xs font-serif uppercase tracking-[0.2em] font-semibold transition-all duration-300 shadow hover:shadow-lg active:scale-95"
              >
                <Compass className="w-3.5 h-3.5 text-[#352014] hover:rotate-45 transition-transform" />
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
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#24150F] to-transparent pointer-events-none" />

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
            <div className="bg-[#24150F]/85 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[#B58A4F]/40 shadow-2xl hover:border-[#D4AF37] hover:bg-[#24150F]/95 hover:shadow-[0_15px_40px_rgba(212,175,55,0.25)] transition-all duration-300 group hover:-translate-y-2 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-[#352014] border border-[#B58A4F]/40 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:scale-115 group-hover:rotate-6 group-hover:bg-[#B58A4F] group-hover:text-[#24150F] transition-all">
                <Flame className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#B58A4F] block mb-1 group-hover:text-[#D4AF37] transition-colors">
                Raw Heartwood Essence
              </span>
              <h3 className="font-serif text-xl font-bold text-[#F3E5D2] mb-2 group-hover:text-[#D4AF37] transition-colors">
                Aged Cambodian Oud
              </h3>
              <p className="text-xs text-[#D8B995]/85 leading-relaxed group-hover:text-[#F3E5D2] transition-colors">
                Extracted from ancient resinous agarwood trees, aged in sealed glass vessels for rich balsamic warmth, smoke, and majestic authority.
              </p>
            </div>

            {/* Pillar 2: Dawn Distillates */}
            <div className="bg-[#24150F]/85 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[#B58A4F]/40 shadow-2xl hover:border-[#D4AF37] hover:bg-[#24150F]/95 hover:shadow-[0_15px_40px_rgba(212,175,55,0.25)] transition-all duration-300 group hover:-translate-y-2 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-[#352014] border border-[#B58A4F]/40 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:scale-115 group-hover:rotate-6 group-hover:bg-[#B58A4F] group-hover:text-[#24150F] transition-all">
                <Droplets className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#B58A4F] block mb-1 group-hover:text-[#D4AF37] transition-colors">
                Floral Royalty
              </span>
              <h3 className="font-serif text-xl font-bold text-[#F3E5D2] mb-2 group-hover:text-[#D4AF37] transition-colors">
                Taif & Damask Roses
              </h3>
              <p className="text-xs text-[#D8B995]/85 leading-relaxed group-hover:text-[#F3E5D2] transition-colors">
                Harvested by hand in the cool mountain dawn to preserve volatile dew petals, lending velvet romance and golden sweetness.
              </p>
            </div>

            {/* Pillar 3: 16+ Hours Extrait */}
            <div className="bg-[#24150F]/85 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-[#B58A4F]/40 shadow-2xl hover:border-[#D4AF37] hover:bg-[#24150F]/95 hover:shadow-[0_15px_40px_rgba(212,175,55,0.25)] transition-all duration-300 group hover:-translate-y-2 cursor-default">
              <div className="w-12 h-12 rounded-xl bg-[#352014] border border-[#B58A4F]/40 flex items-center justify-center text-[#D4AF37] mb-5 group-hover:scale-115 group-hover:rotate-6 group-hover:bg-[#B58A4F] group-hover:text-[#24150F] transition-all">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#B58A4F] block mb-1 group-hover:text-[#D4AF37] transition-colors">
                Uncompromising Potency
              </span>
              <h3 className="font-serif text-xl font-bold text-[#F3E5D2] mb-2 group-hover:text-[#D4AF37] transition-colors">
                28% Extrait Concentration
              </h3>
              <p className="text-xs text-[#D8B995]/85 leading-relaxed group-hover:text-[#F3E5D2] transition-colors">
                Formulated at the highest concentration grade in fine perfumery, guaranteeing an unforgettable royal sillage that endures past sunset.
              </p>
            </div>

          </div>

          {/* Action Row */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={scrollToCollection}
              className="px-8 py-4 bg-gradient-to-r from-[#B58A4F] to-[#D4AF37] hover:brightness-115 hover:scale-105 active:scale-95 text-[#24150F] font-serif text-xs uppercase tracking-[0.22em] font-bold rounded-lg shadow-gold-glow hover:shadow-[0_8px_30px_rgba(212,175,55,0.5)] transition-all flex items-center space-x-2 group"
            >
              <span>Explore The Seven Scents</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={onOpenQuiz}
              className="px-8 py-4 bg-[#24150F]/80 hover:bg-[#352014] hover:border-[#D4AF37] hover:scale-105 active:scale-95 text-[#F3E5D2] hover:text-[#D4AF37] border border-[#B58A4F]/50 font-serif text-xs uppercase tracking-[0.2em] font-medium rounded-lg backdrop-blur-md transition-all flex items-center space-x-2"
            >
              <Compass className="w-4 h-4 text-[#D4AF37] hover:rotate-45 transition-transform" />
              <span>Take Scent Profiler Quiz</span>
            </button>
          </div>

        </div>
      </section>

      {/* 3. THE SEVEN PERFUMES COLLECTION (IMPERIAL OBSIDIAN & 24K GOLD VITRINES) */}
      <section id="collection" className="w-full luxury-canvas-bg py-28 relative overflow-hidden border-t border-[#D4AF37]/20">
        {/* Ambient Top Golden Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-56 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-black/60 border border-[#D4AF37]/40 shadow-lg backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span className="text-[11px] uppercase font-serif tracking-[0.28em] text-[#D4AF37] font-semibold">
                THE OUDÉ FRAGRANCE ANTHOLOGY
              </span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight gold-foil-text drop-shadow-[0_4px_24px_rgba(212,175,55,0.3)]">
              The Seven Iconic Creations
            </h2>

            {/* Ornate Gold Star Divider */}
            <div className="flex items-center justify-center space-x-3 my-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent to-[#D4AF37]" />
              <span className="text-[#D4AF37] text-sm">✦</span>
              <div className="w-16 h-px bg-gradient-to-l from-transparent to-[#D4AF37]" />
            </div>

            <p className="text-sm sm:text-base text-[#D8B995]/90 font-light leading-relaxed max-w-2xl mx-auto">
              Each flacon represents a distinct olfactory odyssey—formulated with 28% Extrait de Parfum concentration for unyielding longevity and majestic sillage.
            </p>
          </div>

          {/* Product Cards Grid */}
          {loading ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto" />
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

          <div className="text-center mt-16">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-3 px-10 py-4 btn-gold-embossed text-xs font-serif uppercase tracking-[0.22em] font-bold rounded-xl shadow-2xl group"
            >
              <span>Explore All 7 Fragrances & Filter Notes</span>
              <ArrowRight className="w-4 h-4 text-[#1A0D07] group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. OUR STORY SECTION */}
      <section id="story" className="bg-[#0C0604] text-[#F3E5D2] py-28 border-y border-[#D4AF37]/25 relative overflow-hidden">
        {/* Subtle radial ambient amber glow */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0%,transparent_70%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Visual Flacon Feature */}
            <div className="lg:col-span-5 relative group">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-2xl bg-[#140A06] relative">
                <img
                  src="/products/oud-royal.jpg"
                  alt="Arabian Perfume Heritage"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0604] via-transparent to-transparent opacity-40 pointer-events-none" />
              </div>
              <div className="absolute -bottom-6 -right-6 hidden sm:block bg-[#160B07]/90 backdrop-blur-md p-5 rounded-2xl border border-[#D4AF37]/50 shadow-2xl max-w-xs hover:border-[#D4AF37] hover:scale-105 transition-all duration-300">
                <p className="font-serif gold-foil-text font-bold text-sm">28% Extrait Concentration</p>
                <p className="text-xs text-[#D8B995]/80 mt-1">
                  Aged Cambodian agarwood and Taif rose oils matured in darkness for unmatched longevity.
                </p>
              </div>
            </div>

            {/* Narrative */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase font-serif tracking-[0.25em] text-[#D4AF37] block">
                Heritage & Alchemy
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold leading-tight gold-foil-text">
                Crafted in the Heart of Arabian Tradition
              </h2>
              <div className="flex items-center space-x-3">
                <div className="w-16 h-px bg-gradient-to-r from-[#D4AF37] to-transparent" />
                <span className="text-[#D4AF37] text-xs">✦</span>
              </div>
              <p className="text-sm text-[#D8B995]/90 leading-relaxed font-light">
                In Arabian culture, fragrance is a timeless sacred rite—a gesture of hospitality, nobility, and presence. OUDÉ was founded to revive ancient spice trails and resin trade routes through modern olfactory mastery.
              </p>
              <p className="text-sm text-[#D8B995]/90 leading-relaxed font-light">
                Every drop contains rare sustainably-harvested Cambodian agarwood, velvety Damascus rose distillates, golden frankincense from the Dhofar hills, and sun-warmed amber, creating scents that linger long after the wearer has departed.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#D4AF37]/20 text-xs">
                <div className="p-4 bg-[#140A06]/80 hover:bg-[#1A0E09] rounded-xl border border-[#D4AF37]/25 hover:border-[#D4AF37] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(212,175,55,0.2)] transition-all duration-300 cursor-default group">
                  <span className="text-[#D4AF37] group-hover:gold-foil-text font-serif font-bold text-sm block transition-colors">Rare Oud Woods</span>
                  <span className="text-[#D8B995]/70 group-hover:text-[#F3E5D2] transition-colors">Harvested from deep natural resinous heartwood.</span>
                </div>
                <div className="p-4 bg-[#140A06]/80 hover:bg-[#1A0E09] rounded-xl border border-[#D4AF37]/25 hover:border-[#D4AF37] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(212,175,55,0.2)] transition-all duration-300 cursor-default group">
                  <span className="text-[#D4AF37] group-hover:gold-foil-text font-serif font-bold text-sm block transition-colors">Hand-Sealed</span>
                  <span className="text-[#D8B995]/70 group-hover:text-[#F3E5D2] transition-colors">Finished with golden brass flacon filigree.</span>
                </div>
                <div className="p-4 bg-[#140A06]/80 hover:bg-[#1A0E09] rounded-xl border border-[#D4AF37]/25 hover:border-[#D4AF37] hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(212,175,55,0.2)] transition-all duration-300 cursor-default group">
                  <span className="text-[#D4AF37] group-hover:gold-foil-text font-serif font-bold text-sm block transition-colors">16+ Hours</span>
                  <span className="text-[#D8B995]/70 group-hover:text-[#F3E5D2] transition-colors">Tested longevity on skin and fabrics.</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. SCENT QUIZ PROFILER CALLOUT */}
      <section id="quiz" className="w-full bg-[#080402] py-24 border-t border-[#D4AF37]/20 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-14 text-center relative z-10">
          <div className="luxury-glass-panel rounded-3xl p-8 sm:p-14 border border-[#D4AF37]/40 hover:border-[#D4AF37] shadow-2xl text-[#F3E5D2] relative overflow-hidden transition-all duration-300 hover:shadow-[0_20px_50px_rgba(212,175,55,0.25)]">
            <div className="relative z-10 max-w-xl mx-auto space-y-4">
              <span className="text-xs uppercase font-serif tracking-[0.25em] text-[#D4AF37] block">
                Sensory Diagnostics
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold gold-foil-text">
                Find Your Signature Arabian Scent
              </h2>
              <p className="text-xs sm:text-sm text-[#D8B995]/90 font-light leading-relaxed">
                Answer 3 quick sensory questions about your personality, mood, and preferred sillage. Our olfactory engine will match you with your exact OUDÉ flacon.
              </p>
              <div className="pt-4">
                <button
                  onClick={onOpenQuiz}
                  className="px-10 py-4 btn-gold-embossed text-xs font-serif uppercase tracking-widest font-bold rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  Start Scent Quiz (60 Seconds)
                </button>
              </div>
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
