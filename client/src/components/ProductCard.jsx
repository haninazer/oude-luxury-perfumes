import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Star, Sparkles, CheckCircle } from 'lucide-react';
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
    if (c.includes('amber gold') || c.includes('radiant gold')) return '#B58A4F';
    if (c.includes('rose pink')) return '#D9777F';
    if (c.includes('dark brown')) return '#4A2E1F';
    if (c.includes('bronze')) return '#8C5E35';
    if (c.includes('ivory')) return '#D8C7A3';
    if (c.includes('midnight blue')) return '#1E3A8A';
    return '#B58A4F';
  };

  return (
    <div className="group relative bg-[#24150F] rounded-xl overflow-hidden border border-[#B58A4F]/30 hover:border-[#D4AF37] transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_16px_36px_rgba(181,138,79,0.35)] flex flex-col cursor-pointer">
      {/* Top badges */}
      <div className="absolute top-3 inset-x-3 z-10 flex justify-between items-center pointer-events-none">
        <span className="text-[10px] font-mono tracking-wider uppercase px-2.5 py-1 rounded bg-[#352014]/90 text-[#D8B995] border border-[#B58A4F]/40 backdrop-blur-sm group-hover:border-[#D4AF37] transition-colors">
          {product.category}
        </span>
        {isOutOfStock ? (
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-red-950/90 text-red-400 border border-red-700/50">
            Out of Stock
          </span>
        ) : (
          <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-[#B58A4F]/20 text-[#D4AF37] border border-[#B58A4F]/30 backdrop-blur-sm group-hover:bg-[#B58A4F]/30 transition-colors">
            EDP {product.size || '100ml'}
          </span>
        )}
      </div>

      {/* Image container with Arabian arched styling */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden bg-[#352014]/40 aspect-[4/5]">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Subtle gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#24150F] via-transparent to-black/20 opacity-80 group-hover:opacity-60 transition-opacity duration-300" />

        {/* Quick View Floating Button */}
        <button
          onClick={handleQuickViewClick}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 px-4 py-2 bg-[#24150F]/95 hover:bg-[#D4AF37] text-[#F3E5D2] hover:text-[#24150F] text-xs font-semibold uppercase tracking-wider rounded-lg border border-[#B58A4F]/50 opacity-0 group-hover:opacity-100 hover:scale-105 active:scale-95 transition-all duration-300 backdrop-blur-sm shadow-xl flex items-center space-x-1.5"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Quick View</span>
        </button>
      </Link>

      {/* Content Section */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Bottle hue dot & Character */}
          <div className="flex items-center space-x-2 mb-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full border border-white/40 flex-shrink-0 group-hover:scale-125 transition-transform"
              style={{ backgroundColor: getColorAccent(product.bottle_color) }}
              title={product.bottle_color}
            />
            <span className="text-[11px] text-[#D8B995]/70 italic truncate group-hover:text-[#D8B995] transition-colors">
              {product.character || product.bottle_color}
            </span>
          </div>

          {/* Product Title */}
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-serif text-xl font-bold text-[#F3E5D2] group-hover:text-[#D4AF37] transition-colors leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Rating */}
          <div className="flex items-center space-x-1.5 mt-1.5">
            <div className="flex items-center text-[#D4AF37] group-hover:scale-105 transition-transform origin-left">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-current" />
              ))}
            </div>
            <span className="text-[11px] text-[#D8B995]/70 font-mono">
              {product.rating || '4.9'} ({product.reviews_count || 24})
            </span>
          </div>

          {/* Fragrance Key Notes Summary */}
          <div className="mt-3 pt-2.5 border-t border-[#B58A4F]/15 text-xs text-[#D8B995]/80 space-y-1">
            <p className="truncate group-hover:text-[#F3E5D2] transition-colors">
              <span className="text-[#B58A4F] font-serif font-medium">Notes:</span> {product.top_notes?.split(',')[0]} • {product.heart_notes?.split(',')[0]} • {product.base_notes?.split(',')[0]}
            </p>
          </div>
        </div>

        {/* Footer: Price and Add Button */}
        <div className="mt-4 pt-3 border-t border-[#B58A4F]/20 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#D8B995]/60 uppercase tracking-wider block">Price</span>
            <span className="font-serif text-lg font-bold text-[#F3E5D2] group-hover:text-[#D4AF37] transition-colors">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </span>
          </div>

          <button
            onClick={handleAdd}
            disabled={isOutOfStock || loading}
            className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-semibold transition-all duration-300 flex items-center space-x-1.5 ${
              isOutOfStock
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                : 'bg-[#B58A4F] hover:bg-[#D4AF37] hover:scale-105 text-[#24150F] shadow-lg hover:shadow-[0_4px_20px_rgba(212,175,55,0.45)] active:scale-95'
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
