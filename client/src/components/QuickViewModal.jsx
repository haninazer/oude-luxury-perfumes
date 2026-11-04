import React, { useState } from 'react';
import { X, ShoppingBag, Star, Sparkles, Check, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function QuickViewModal({ product, onClose }) {
  const { addToCart, loading } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const isOutOfStock = product.stock <= 0;

  const handleAdd = async () => {
    if (!isOutOfStock) {
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />

      <div className="relative luxury-vitrine border border-[#D4AF37]/40 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 text-[#F3E5D2] overflow-hidden">
        {/* Ambient Halo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0%,transparent_70%)] pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#D8B995]/70 hover:text-[#D4AF37] hover:scale-120 p-1.5 rounded-full transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
          {/* Image */}
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border border-[#D4AF37]/35 bg-[#120804] group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(212,175,55,0.25)_0%,transparent_70%)] pointer-events-none" />
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md border border-[#D4AF37]/40 px-3 py-1 rounded-full text-[11px] font-mono text-[#D4AF37] shadow">
              {product.category}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-serif tracking-[0.25em] text-[#D4AF37]">
                OUDÉ LUXURY FLACON • EDP {product.size || '100ml'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold gold-foil-text mt-1">
                {product.name}
              </h2>
              <p className="text-xs text-[#D8B995]/90 italic mt-1 font-serif">
                "{product.character}"
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current drop-shadow-[0_0_4px_rgba(212,175,55,0.6)]" />
                ))}
              </div>
              <span className="text-xs text-[#D8B995]/70 font-mono">
                {product.rating || '4.95'} ({product.reviews_count || 24} luxury reviews)
              </span>
            </div>

            <div className="text-3xl font-serif font-bold gold-foil-text">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </div>

            <p className="text-xs text-[#D8B995]/90 leading-relaxed border-t border-[#D4AF37]/20 pt-3 font-light">
              {product.description}
            </p>

            {/* Olfactory Notes Preview */}
            <div className="bg-[#140A06]/90 p-4 rounded-xl border border-[#D4AF37]/25 text-xs space-y-1.5 shadow">
              <div>
                <span className="text-[#D4AF37] font-serif font-semibold">Top Notes:</span>{' '}
                <span className="text-[#D8B995]/90">{product.top_notes}</span>
              </div>
              <div>
                <span className="text-[#D4AF37] font-serif font-semibold">Heart Notes:</span>{' '}
                <span className="text-[#D8B995]/90">{product.heart_notes}</span>
              </div>
              <div>
                <span className="text-[#D4AF37] font-serif font-semibold">Base Notes:</span>{' '}
                <span className="text-[#D8B995]/90">{product.base_notes}</span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-[#D4AF37]/40 hover:border-[#D4AF37] transition-colors rounded-xl bg-[#140A06] px-3.5 py-2 space-x-3.5">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-[#D8B995] hover:text-[#D4AF37] hover:scale-125 transition-all disabled:opacity-40"
                    disabled={quantity <= 1 || isOutOfStock}
                  >
                    -
                  </button>
                  <span className="text-xs font-mono font-medium text-[#F3E5D2]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-[#D8B995] hover:text-[#D4AF37] hover:scale-125 transition-all disabled:opacity-40"
                    disabled={quantity >= product.stock || isOutOfStock}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock || loading}
                  className={`flex-1 py-3 px-6 rounded-xl text-xs uppercase tracking-wider font-bold transition-all duration-300 shadow-xl flex items-center justify-center space-x-2 ${
                    isOutOfStock
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                      : 'btn-gold-embossed'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-[#1A0D07]" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isOutOfStock ? 'Sold Out' : `Add to Bag • ₹${(Number(product.price) * quantity).toLocaleString('en-IN')}`}</span>
                    </>
                  )}
                </button>
              </div>

              <div className="text-center">
                <Link
                  to={`/product/${product.id}`}
                  onClick={onClose}
                  className="text-xs text-[#D4AF37] hover:underline inline-flex items-center space-x-1 font-serif"
                >
                  <span>Explore full olfactory pyramid, longevity meter, & customer reviews</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
