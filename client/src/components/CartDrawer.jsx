import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    shippingFee,
    amountToFreeShipping,
    freeShippingQualified,
    discount,
    discountDescription,
    grandTotal,
    promoCode,
    isCartOpen,
    loading,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    applyPromo,
    clearCart
  } = useCart();

  const [inputCode, setInputCode] = useState(promoCode || '');
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  const handleApplyPromo = (e) => {
    e.preventDefault();
    applyPromo(inputCode);
  };

  const handleProceedCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  // Calculate percentage toward free delivery
  const progressPercent = Math.min(100, Math.round((subtotal / 3000) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0C0604] text-[#F3E5D2] border-l border-[#D4AF37]/35 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#120804]">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
              <h2 className="font-serif text-xl tracking-wider text-[#F3E5D2] font-semibold gold-foil-text">
                Your Fragrance Bag
              </h2>
              <span className="text-xs bg-[#1C0D07] text-[#D4AF37] px-2.5 py-0.5 rounded-full border border-[#D4AF37]/40 font-mono">
                {itemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-[#D8B995]/80 hover:text-[#D4AF37] hover:scale-110 p-1.5 rounded transition-all"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Complimentary Shipping Progress Meter */}
          <div className="bg-[#140A06] px-6 py-3.5 border-b border-[#D4AF37]/15">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#D8B995]">
                {freeShippingQualified ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Complimentary White-Glove Courier Unlocked!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#D4AF37]">₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px] text-[#D4AF37] font-bold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#080402] rounded-full h-1.5 overflow-hidden border border-[#D4AF37]/20">
              <div
                className="bg-gradient-to-r from-[#DFBA73] to-[#D4AF37] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#D4AF37]/15">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#1A0E08] border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
                  <ShoppingBag className="w-8 h-8 opacity-70" />
                </div>
                <div>
                  <p className="font-serif text-lg text-[#F3E5D2]">Your bag is currently empty</p>
                  <p className="text-xs text-[#D8B995]/70 max-w-xs mt-1">
                    Discover our collection of seven handcrafted Arabian perfumes inspired by timeless heritage.
                  </p>
                </div>
                <Link
                  to="/shop"
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2.5 btn-gold-embossed font-semibold text-xs uppercase tracking-wider rounded-lg transition-all"
                >
                  Explore The Collection
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.product_id} className="py-4 flex space-x-4 group">
                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="w-16 h-20 object-cover rounded-xl border border-[#D4AF37]/30 bg-[#160B06] flex-shrink-0 group-hover:scale-105 transition-transform"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/product/${item.product_id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-serif text-base font-medium text-[#F3E5D2] hover:text-[#D4AF37] transition-colors truncate"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-[#D8B995]/50 hover:text-red-400 hover:scale-120 p-1 transition-all"
                        title="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-[11px] text-[#D8B995]/70 mt-0.5">
                      {item.size || '100ml'} EDP • {item.bottle_color || 'Luxury Flacon'}
                    </p>

                    {item.isOutOfStock ? (
                      <p className="text-xs text-red-400 mt-1 flex items-center gap-1 font-medium">
                        <AlertTriangle className="w-3.5 h-3.5" /> Out of Stock on server
                      </p>
                    ) : item.isQuantityExceeded ? (
                      <p className="text-xs text-amber-400 mt-1 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> Only {item.stock} left in stock
                      </p>
                    ) : null}

                    <div className="flex justify-between items-center mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 bg-[#140A06] border border-[#D4AF37]/30 rounded-lg px-2.5 py-1">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="text-[#D8B995] hover:text-[#D4AF37] p-0.5 disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-medium px-2 text-[#F3E5D2]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="text-[#D8B995] hover:text-[#D4AF37] p-0.5 disabled:opacity-30"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-bold text-[#D4AF37]">
                          ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                        </div>
                        {item.quantity > 1 && (
                          <div className="text-[10px] text-[#D8B995]/60">
                            ₹{Number(item.price).toLocaleString('en-IN')} each
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Promo Code & Server-Side Financials */}
          {items.length > 0 && (
            <div className="bg-[#120804] px-6 py-4 border-t border-[#D4AF37]/25 space-y-3">
              {/* Promo input */}
              <form onSubmit={handleApplyPromo} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. OUDE10)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#0A0402] text-[#F3E5D2] placeholder-[#D8B995]/40 px-3 py-2 text-xs rounded-xl border border-[#D4AF37]/30 uppercase font-mono focus:outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="bg-[#1A0E08] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#1A0E08] border border-[#D4AF37]/50 px-4 py-2 text-xs rounded-xl font-bold transition-all"
                >
                  Apply
                </button>
              </form>

              {/* Discount Notice */}
              {discount > 0 && (
                <div className="flex justify-between items-center text-xs text-emerald-400 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-800/40">
                  <span>{discountDescription || 'Privilege Code Applied'}</span>
                  <span>-₹{discount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {/* Financial Lines (Server-Calculated) */}
              <div className="space-y-1.5 text-xs text-[#D8B995]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#F3E5D2]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>White-Glove Shipping</span>
                  <span className="font-mono">
                    {shippingFee === 0 ? (
                      <span className="text-emerald-400 font-medium">COMPLIMENTARY</span>
                    ) : (
                      `₹${shippingFee.toLocaleString('en-IN')}`
                    )}
                  </span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Privilege Discount</span>
                    <span className="font-mono">-₹{discount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="pt-2 border-t border-[#D4AF37]/20 flex justify-between items-center text-sm font-semibold text-[#F3E5D2]">
                  <span className="font-serif">Server-Calculated Total</span>
                  <span className="font-serif text-lg font-bold gold-foil-text">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleProceedCheckout}
                  disabled={loading}
                  className="w-full btn-gold-embossed py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-xl flex items-center justify-center space-x-2 group"
                >
                  <span>Proceed to Luxury Checkout</span>
                  <ArrowRight className="w-4 h-4 text-[#1A0D07] group-hover:translate-x-1 transition-transform" />
                </button>

                <div className="flex justify-between text-[11px] text-[#D8B995]/70 pt-1">
                  <button
                    onClick={clearCart}
                    className="hover:text-red-400 hover:underline transition-colors"
                  >
                    Clear Bag
                  </button>
                  <Link
                    to="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="hover:text-[#D4AF37] hover:underline transition-colors"
                  >
                    Continue Browsing
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
