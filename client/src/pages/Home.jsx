import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Sparkles, Star, ShieldCheck, Truck, RefreshCw, Compass, ArrowRight } from 'lucide-react';
import { productApi } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import QuickViewModal from '../components/QuickViewModal.jsx';

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

  return (
    <div className="bg-[#F3E5D2] text-[#24150F] overflow-hidden">
      
      {/* 1. HERO SECTION - MATCHING REFERENCE SCREENSHOT EXACTLY */}
      <section
        className="relative min-h-screen w-full bg-cover bg-right sm:bg-center flex items-center pt-24 sm:pt-0"
        style={{
          backgroundImage: `url('/hero-clean.jpg')`,
          backgroundColor: '#E8C9A8'
        }}
      >
        {/* Subtle warm ambient overlay gradient to ensure high readability on any screen size */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#F3E5D2]/70 via-[#F3E5D2]/25 to-transparent pointer-events-none md:max-w-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 w-full z-10 py-16 sm:py-24">
          <div className="max-w-xl space-y-6 sm:space-y-8">
            
            {/* Pre-Heading */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] sm:text-xs uppercase font-serif tracking-[0.25em] text-[#352014] font-medium">
                OUDÉ — THE ART OF ARABIAN PERFUMERY
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[76px] font-bold text-[#24150F] leading-[1.06] tracking-tight">
              THE ESSENCE OF<br />
              ARABIAN<br />
              LUXURY.
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base md:text-lg text-[#352014]/90 font-light leading-relaxed max-w-md">
              A curated journey through rare oud, precious woods and the timeless spirit of Arabia.
            </p>

            {/* Discover The Collection CTA Button */}
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
                className="hidden sm:inline-flex items-center space-x-2 px-6 py-4 bg-[#F3E5D2]/80 hover:bg-[#F3E5D2] text-[#24150F] border border-[#24150F]/30 backdrop-blur-sm text-xs font-serif uppercase tracking-[0.2em] font-medium transition-all"
              >
                <Compass className="w-3.5 h-3.5 text-[#B58A4F]" />
                <span>Scent Profiler</span>
              </button>
            </div>

          </div>
        </div>

        {/* Subtle bottom fade transition into the collection section */}
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-[#F3E5D2] to-transparent pointer-events-none" />
      </section>

      {/* 2. THE SEVEN PERFUMES COLLECTION */}
      <section id="collection" className="py-24 px-6 sm:px-10 lg:px-14 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs uppercase font-serif tracking-[0.25em] text-[#B58A4F] block">
            The OUDÉ Fragrance Anthology
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#24150F]">
            The Seven Iconic Creations
          </h2>
          <div className="w-16 h-0.5 bg-[#B58A4F] mx-auto mt-2" />
          <p className="text-sm text-[#352014]/80 font-light leading-relaxed">
            Each flacon represents a distinct olfactory odyssey—formulated with 28% Extrait de Parfum concentration for unyielding longevity and majestic sillage.
          </p>
        </div>

        {/* Product Cards Grid */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-2 border-[#B58A4F] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="font-serif text-sm text-[#352014] mt-3">Curating the Fragrances...</p>
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
            className="inline-flex items-center space-x-2 px-8 py-4 bg-[#24150F] hover:bg-[#352014] text-[#F3E5D2] text-xs font-serif uppercase tracking-[0.2em] font-semibold transition-all shadow-lg"
          >
            <span>Explore All 7 Fragrances & Filter Notes</span>
            <ArrowRight className="w-4 h-4 text-[#B58A4F]" />
          </Link>
        </div>
      </section>

      {/* 3. OUR STORY SECTION */}
      <section id="story" className="bg-[#24150F] text-[#F3E5D2] py-24 border-y border-[#B58A4F]/30 relative overflow-hidden">
        {/* Subtle decorative motif */}
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

      {/* 4. SCENT QUIZ PROFILER CALLOUT */}
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
