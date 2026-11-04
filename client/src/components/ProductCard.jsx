import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Star, Sparkles } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function ProductCard({ product, onQuickView }) {
  const { addToCart, loading } = useCart();

  const isOutOfStock = product.stock <= 0;

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isOutOfStock) {
      await addToCart(product.id, 1);
    }
  };

  const handleQuickViewClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    }
  };

  // Color mapping indicator
  const getColorAccent = (bottleColor) => {
    const c = (bottleColor || '').toLowerCase();
    if (c.includes('amber gold') || c.includes('radiant gold')) return '#D4AF37';
    if (c.includes('rose pink')) return '#E08595';
    if (c.includes('dark brown')) return '#663B20';
    if (c.includes('bronze')) return '#A67040';
    if (c.includes('ivory')) return '#F0E6D2';
    if (c.includes('midnight blue')) return '#1E3A8A';
    return '#D4AF37';
  };

  return (
    <div className="group relative luxury-vitrine rounded-2xl overflow-hidden flex flex-col cursor-pointer transition-all duration-500 hover:-translate-y-2.5">
      
      {/* Top Floating Badges */}
      <div className="absolute top-3.5 inset-x-3.5 z-20 flex justify-between items-center pointer-events-none">
        <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md text-[#D8B995] border border-[#B58A4F]/40 shadow-md">
          {product.category}
        </span>
        {isOutOfStock ? (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-red-950/90 text-red-300 border border-red-700/60 shadow">
            Sold Out
          </span>
        ) : (
          <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded-full bg-[#B58A4F]/25 backdrop-blur-md text-[#D4AF37] border border-[#D4AF37]/50 shadow-[0_0_12px_rgba(212,175,55,0.3)]">
            28% Extrait • {product.size || '100ml'}
          </span>
        )}
      </div>

      {/* Flacon Showcase Stage */}
      <Link
        to={`/product/${product.id}`}
        className="block relative overflow-hidden aspect-[4/5] bg-gradient-to-b from-[#180C07] via-[#100704] to-[#0A0402]"
      >
        {/* Ambient Backlight Halo radiating behind the bottle */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.24)_0%,rgba(181,138,79,0.08)_40%,transparent_72%)] pointer-events-none group-hover:opacity-100 transition-opacity duration-700" />

        {/* Flacon Image */}
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Pedestal Bottom Shading */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#140A06] via-[#140A06]/60 to-transparent pointer-events-none" />

        {/* Quick View Floating Button */}
        <button
          onClick={handleQuickViewClick}
          className="absolute bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-[#1A0E08]/90 hover:bg-[#D4AF37] text-[#F3E5D2] hover:text-[#1A0E08] text-xs font-semibold uppercase tracking-wider rounded-xl border border-[#D4AF37]/50 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-md shadow-2xl flex items-center space-x-1.5 z-20"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </Link>

      {/* Vitrine Description Plate */}
      <div className="p-6 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#180C07]/90 to-[#0F0704] border-t border-[#D4AF37]/20">
        <div>
          {/* Scent Persona & Bottle Hue */}
          <div className="flex items-center space-x-2 mb-2">
            <span
              className="w-2.5 h-2.5 rounded-full border border-[#D4AF37]/60 shadow-[0_0_8px_rgba(212,175,55,0.5)] flex-shrink-0 group-hover:scale-125 transition-transform"
              style={{ backgroundColor: getColorAccent(product.bottle_color) }}
              title={product.bottle_color}
            />
            <span className="text-[11px] text-[#D8B995]/80 italic truncate font-serif">
              "{product.character || product.bottle_color}"
            </span>
          </div>

          {/* Product Title with Gold Foil Effect */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-2xl font-bold text-[#F3E5D2] group-hover:gold-foil-text transition-all leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating Stars & Luxury Reviews */}
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex items-center text-[#D4AF37] group-hover:scale-105 transition-transform origin-left">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current drop-shadow-[0_0_4px_rgba(212,175,55,0.6)]" />
              ))}
            </div>
            <span className="text-[11px] text-[#D8B995]/70 font-mono">
              {product.rating || '4.95'} ({product.reviews_count || 32} reviews)
            </span>
          </div>

          {/* Fragrance Pyramid Capsule */}
          <div className="mt-3.5 p-3 rounded-xl bg-black/40 border border-[#B58A4F]/20 text-[11px] text-[#D8B995]/85 space-y-1 group-hover:border-[#D4AF37]/40 transition-colors">
            <p className="truncate">
              <span className="text-[#D4AF37] font-serif font-semibold">Notes:</span>{' '}
              {product.top_notes?.split(',')[0]} • {product.heart_notes?.split(',')[0]} • {product.base_notes?.split(',')[0]}
            </p>
          </div>
        </div>

        {/* Footer: Price & Embossed 24K Add to Bag Button */}
        <div className="mt-5 pt-4 border-t border-[#D4AF37]/15 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#D8B995]/60 uppercase tracking-widest block font-mono">Price</span>
            <span className="font-serif text-2xl font-bold gold-foil-text block">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock || loading}
            className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all duration-300 flex items-center space-x-2 ${
              isOutOfStock
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                : 'btn-gold-embossed'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5 group-hover:rotate-6 transition-transform" />
            <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
