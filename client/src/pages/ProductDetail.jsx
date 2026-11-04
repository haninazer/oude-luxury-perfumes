import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Star, ShieldCheck, Truck, Sparkles, ChevronRight, AlertTriangle } from 'lucide-react';
import { productApi } from '../services/api.js';
import { useCart } from '../context/CartContext.jsx';
import FragrancePyramid from '../components/FragrancePyramid.jsx';
import ProductCard from '../components/ProductCard.jsx';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, loading: cartLoading } = useCart();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      setLoading(true);
      setError(null);
      try {
        const res = await productApi.getById(id);
        if (res.success && res.product) {
          setProduct(res.product);
          setRelated(res.related || []);
          setQuantity(1);
          window.scrollTo(0, 0);
        } else {
          setError('Product not found.');
        }
      } catch (err) {
        setError(err.data?.message || 'Failed to load fragrance details.');
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#24150F] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-2 border-[#B58A4F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif text-[#D8B995] text-base">Unveiling Fragrance Essence...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-[70vh] bg-[#24150F] flex items-center justify-center px-4">
        <div className="bg-[#24150F] text-[#F3E5D2] p-8 rounded-2xl border border-[#B58A4F]/30 max-w-md text-center space-y-4">
          <p className="font-serif text-2xl text-red-400">Fragrance Unavailable</p>
          <p className="text-xs text-[#D8B995]/70">{error || 'This fragrance profile could not be found.'}</p>
          <Link
            to="/shop"
            className="inline-block px-6 py-2.5 bg-[#B58A4F] text-[#24150F] text-xs font-semibold uppercase tracking-wider rounded"
          >
            Return to Collection
          </Link>
        </div>
      </div>
    );
  }

  const isOutOfStock = product.stock <= 0;

  const handleAddToCart = async () => {
    if (!isOutOfStock) {
      await addToCart(product.id, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2500);
    }
  };

  const handleBuyNow = async () => {
    if (!isOutOfStock) {
      await addToCart(product.id, quantity);
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-[#24150F] text-[#F3E5D2] min-h-screen pb-24 pt-20">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 text-xs text-[#D8B995]/70 flex items-center space-x-2">
        <Link to="/" className="hover:text-[#B58A4F]">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/shop" className="hover:text-[#B58A4F]">Fragrances</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#D4AF37] font-serif font-semibold">{product.name}</span>
      </div>

      {/* Main Product Showcase Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Visual Flacon Stage */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-[#B58A4F]/40 bg-[#24150F] shadow-2xl">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24150F] via-transparent to-transparent opacity-60" />
              
              {/* Bottle Hue Badge */}
              <div className="absolute top-4 left-4 bg-[#24150F]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#B58A4F]/40 flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B58A4F]" />
                <span className="text-xs font-serif text-[#F3E5D2]">{product.bottle_color} Flacon</span>
              </div>

              {/* Concentration Tag */}
              <div className="absolute bottom-4 left-4 bg-[#24150F]/90 backdrop-blur-md px-3.5 py-1 rounded-full border border-[#B58A4F]/30 text-[11px] font-mono text-[#D4AF37]">
                EDP {product.size || '100ml'} • 28% Extrait De Parfum
              </div>
            </div>

            {/* Value Guarantees */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs text-[#F3E5D2]">
              <div className="p-4 bg-[#24150F] hover:bg-[#352014] rounded-2xl border border-[#B58A4F]/30 hover:border-[#D4AF37] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-default group">
                <Truck className="w-4 h-4 text-[#B58A4F] group-hover:text-[#D4AF37] group-hover:scale-125 transition-all mx-auto mb-1" />
                <span className="font-serif font-semibold block text-[11px] text-[#F3E5D2] group-hover:text-[#D4AF37] transition-colors">Free Courier</span>
                <span className="text-[10px] text-[#D8B995]/70">On orders over ₹3,000</span>
              </div>
              <div className="p-4 bg-[#24150F] hover:bg-[#352014] rounded-2xl border border-[#B58A4F]/30 hover:border-[#D4AF37] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-default group">
                <Sparkles className="w-4 h-4 text-[#B58A4F] group-hover:text-[#D4AF37] group-hover:scale-125 transition-all mx-auto mb-1" />
                <span className="font-serif font-semibold block text-[11px] text-[#F3E5D2] group-hover:text-[#D4AF37] transition-colors">Complimentary Sample</span>
                <span className="text-[10px] text-[#D8B995]/70">Try before unsealing</span>
              </div>
              <div className="p-4 bg-[#24150F] hover:bg-[#352014] rounded-2xl border border-[#B58A4F]/30 hover:border-[#D4AF37] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 cursor-default group">
                <ShieldCheck className="w-4 h-4 text-[#B58A4F] group-hover:text-[#D4AF37] group-hover:scale-125 transition-all mx-auto mb-1" />
                <span className="font-serif font-semibold block text-[11px] text-[#F3E5D2] group-hover:text-[#D4AF37] transition-colors">100% Authentic</span>
                <span className="text-[10px] text-[#D8B995]/70">Hand-finished seals</span>
              </div>
            </div>
          </div>

          {/* Right Column: Information, Pricing, & Ordering */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Header info */}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs uppercase font-mono tracking-widest text-[#B58A4F]">
                  {product.category}
                </span>
                <span className="text-[#D8B995]/40">•</span>
                <span className="text-xs text-[#D8B995]/70 italic">Product #{product.id}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#F3E5D2] mt-1.5 leading-tight">
                {product.name}
              </h1>

              <p className="text-base text-[#D4AF37] font-serif italic mt-1">
                "{product.character}"
              </p>

              {/* Rating and Reviews */}
              <div className="flex items-center space-x-2 mt-3">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="text-xs font-mono font-medium text-[#F3E5D2]">
                  {product.rating || '4.95'}
                </span>
                <span className="text-xs text-[#D8B995]/60">
                  ({product.reviews_count || 32} verified connoisseur reviews)
                </span>
              </div>
            </div>

            {/* Price block */}
            <div className="p-6 bg-[#24150F] text-[#F3E5D2] rounded-2xl border border-[#B58A4F]/40 shadow-xl flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-[#D8B995]/70 block">
                  Price (All Taxes Included)
                </span>
                <span className="font-serif text-3xl font-bold text-[#D4AF37]">
                  ₹{Number(product.price).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-[#D8B995]/70 ml-2">/ 100ml Eau De Parfum</span>
              </div>

              {/* Stock Badge */}
              <div>
                {isOutOfStock ? (
                  <span className="px-3 py-1 bg-red-950 text-red-300 rounded text-xs font-bold border border-red-700/50">
                    Currently Sold Out
                  </span>
                ) : product.stock <= 15 ? (
                  <span className="px-3 py-1 bg-amber-950 text-amber-300 rounded text-xs font-medium border border-amber-700/50 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Only {product.stock} bottles left
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-emerald-950 text-emerald-300 rounded text-xs font-medium border border-emerald-700/50">
                    In Stock ({product.stock} available)
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 text-sm text-[#D8B995]/90 leading-relaxed font-light">
              <p>{product.description}</p>
            </div>

            {/* Olfactory Specs Meter */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#24150F] p-4 rounded-2xl border border-[#B58A4F]/30 text-xs text-center shadow-lg">
              <div>
                <span className="text-[10px] text-[#D8B995]/60 uppercase tracking-wider block">Longevity</span>
                <span className="font-serif font-bold text-[#D4AF37] text-sm">14+ Hours</span>
              </div>
              <div className="border-l border-[#B58A4F]/20">
                <span className="text-[10px] text-[#D8B995]/60 uppercase tracking-wider block">Sillage</span>
                <span className="font-serif font-bold text-[#D4AF37] text-sm">Regal & Deep</span>
              </div>
              <div className="border-l border-[#B58A4F]/20">
                <span className="text-[10px] text-[#D8B995]/60 uppercase tracking-wider block">Concentration</span>
                <span className="font-serif font-bold text-[#D4AF37] text-sm">Extrait 28%</span>
              </div>
              <div className="border-l border-[#B58A4F]/20">
                <span className="text-[10px] text-[#D8B995]/60 uppercase tracking-wider block">Season</span>
                <span className="font-serif font-bold text-[#D4AF37] text-sm">All Seasons</span>
              </div>
            </div>

            {/* Add to Bag Controls */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-4">
                {/* Quantity picker */}
                <div className="flex items-center bg-[#24150F] text-[#F3E5D2] border border-[#B58A4F]/40 hover:border-[#D4AF37] transition-colors rounded-xl px-4 py-3 space-x-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1 || isOutOfStock}
                    className="text-[#D8B995] hover:text-[#D4AF37] hover:scale-125 transition-all disabled:opacity-30"
                  >
                    -
                  </button>
                  <span className="font-mono text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    disabled={quantity >= product.stock || isOutOfStock}
                    className="text-[#D8B995] hover:text-[#D4AF37] hover:scale-125 transition-all disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                {/* Add to Cart button */}
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock || cartLoading}
                  className={`flex-1 py-4 px-6 rounded-xl text-xs uppercase tracking-widest font-bold transition-all duration-300 shadow-lg flex items-center justify-center space-x-2 ${
                    isOutOfStock
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                      : 'bg-[#24150F] hover:bg-[#352014] hover:border-[#D4AF37] hover:scale-[1.02] active:scale-95 text-[#F3E5D2] border border-[#B58A4F] hover:shadow-gold-glow'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4 text-[#B58A4F]" />
                  <span>{isOutOfStock ? 'Sold Out' : (added ? 'Added to Bag ✓' : 'Add to Bag')}</span>
                </button>
              </div>

              {/* Instant Buy Now Button */}
              {!isOutOfStock && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-4 bg-gradient-to-r from-[#B58A4F] to-[#D4AF37] hover:brightness-115 hover:scale-[1.02] active:scale-95 text-[#24150F] font-bold text-xs uppercase tracking-widest rounded-xl shadow-gold-glow hover:shadow-[0_8px_30px_rgba(212,175,55,0.5)] transition-all duration-300"
                >
                  Instant White-Glove Checkout • ₹{(Number(product.price) * quantity).toLocaleString('en-IN')}
                </button>
              )}
            </div>

          </div>
        </div>

        {/* INTERACTIVE FRAGRANCE PYRAMID SECTION */}
        <div className="mt-20">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs uppercase font-mono tracking-widest text-[#B58A4F] block">
              Olfactory Progression
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#F3E5D2]">
              How {product.name} Evolves
            </h2>
            <p className="text-xs text-[#D8B995]/70 font-light">
              Arabian luxury fragrances are composed to develop gradually upon your skin over twelve to sixteen hours.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <FragrancePyramid
              topNotes={product.top_notes}
              heartNotes={product.heart_notes}
              baseNotes={product.base_notes}
              character={product.character}
            />
          </div>
        </div>

        {/* RELATED COMPLEMENTARY PERFUMES */}
        {related.length > 0 && (
          <div className="mt-24 pt-12 border-t border-[#B58A4F]/25">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-[#B58A4F] block">
                  Curated Pairings
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#F3E5D2]">
                  Complementary Arabian Scents
                </h3>
              </div>
              <Link to="/shop" className="text-xs text-[#D4AF37] hover:underline font-serif font-medium">
                View All 7 Fragrances →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
