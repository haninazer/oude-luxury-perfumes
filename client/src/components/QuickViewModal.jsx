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
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-[#24150F] border border-[#B58A4F]/40 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl z-10 text-[#F3E5D2] overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#D8B995]/70 hover:text-[#B58A4F] p-1.5 rounded transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Image */}
          <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-[#B58A4F]/30 bg-[#352014]">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-[#24150F]/80 backdrop-blur-sm border border-[#B58A4F]/30 px-2.5 py-1 rounded text-[11px] font-mono text-[#D8B995]">
              {product.category}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <span className="text-xs uppercase font-mono tracking-widest text-[#B58A4F]">
                OUDÉ Luxury Flacon • EDP {product.size || '100ml'}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#F3E5D2] mt-1">
                {product.name}
              </h2>
              <p className="text-xs text-[#D8B995]/80 italic mt-1">
                "{product.character}"
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <div className="flex text-[#D4AF37]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-current" />
                ))}
              </div>
              <span className="text-xs text-[#D8B995]/70 font-mono">
                {product.rating || '4.9'} ({product.reviews_count || 24} luxury reviews)
              </span>
            </div>

            <div className="text-2xl font-serif font-bold text-[#B58A4F]">
              ₹{Number(product.price).toLocaleString('en-IN')}
            </div>

            <p className="text-xs text-[#D8B995]/90 leading-relaxed border-t border-[#B58A4F]/20 pt-3">
              {product.description}
            </p>

            {/* Olfactory Notes Preview */}
            <div className="bg-[#352014]/60 p-3.5 rounded-lg border border-[#B58A4F]/20 text-xs space-y-1.5">
              <div>
                <span className="text-[#B58A4F] font-serif font-semibold">Top Notes:</span>{' '}
                <span className="text-[#D8B995]/90">{product.top_notes}</span>
              </div>
              <div>
                <span className="text-[#B58A4F] font-serif font-semibold">Heart Notes:</span>{' '}
                <span className="text-[#D8B995]/90">{product.heart_notes}</span>
              </div>
              <div>
                <span className="text-[#B58A4F] font-serif font-semibold">Base Notes:</span>{' '}
                <span className="text-[#D8B995]/90">{product.base_notes}</span>
              </div>
            </div>

            {/* Quantity and Actions */}
            <div className="pt-2 space-y-3">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-[#B58A4F]/40 rounded bg-[#352014] px-3 py-1.5 space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-[#D8B995] hover:text-[#B58A4F] disabled:opacity-40"
                    disabled={quantity <= 1 || isOutOfStock}
                  >
                    -
                  </button>
                  <span className="text-xs font-mono font-medium text-[#F3E5D2]">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-[#D8B995] hover:text-[#B58A4F] disabled:opacity-40"
                    disabled={quantity >= product.stock || isOutOfStock}
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={isOutOfStock || loading}
                  className={`flex-1 py-3 px-6 rounded-lg text-xs uppercase tracking-wider font-bold transition-all shadow-lg flex items-center justify-center space-x-2 ${
                    isOutOfStock
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                      : 'bg-gradient-to-r from-[#B58A4F] to-[#D4AF37] hover:brightness-110 text-[#24150F]'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-950" />
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
                  className="text-xs text-[#B58A4F] hover:underline inline-flex items-center space-x-1"
                >
                  <span>Explore full notes, longevity meter, & customer reviews</span>
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
