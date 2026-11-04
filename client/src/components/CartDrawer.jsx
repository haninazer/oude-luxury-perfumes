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
        <div className="w-screen max-w-md bg-[#24150F] text-[#F3E5D2] border-l border-[#B58A4F]/30 shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#B58A4F]/20 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-[#B58A4F]" />
              <h2 className="font-serif text-xl tracking-wider text-[#F3E5D2] font-semibold">
                Your Fragrance Bag
              </h2>
              <span className="text-xs bg-[#352014] text-[#B58A4F] px-2 py-0.5 rounded-full border border-[#B58A4F]/30 font-mono">
                {itemCount}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="text-[#D8B995]/80 hover:text-[#B58A4F] p-1.5 rounded transition-colors"
              aria-label="Close cart"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Complimentary Shipping Progress Meter */}
          <div className="bg-[#352014]/60 px-6 py-3 border-b border-[#B58A4F]/15">
            <div className="flex justify-between items-center text-xs mb-1.5">
              <span className="text-[#D8B995]">
                {freeShippingQualified ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Complimentary White-Glove Courier Unlocked!
                  </span>
                ) : (
                  <span>
                    Add <strong className="text-[#B58A4F]">₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more for Free Shipping
                  </span>
                )}
              </span>
              <span className="font-mono text-[11px] text-[#B58A4F]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#24150F] rounded-full h-1.5 overflow-hidden border border-[#B58A4F]/20">
              <div
                className="bg-gradient-to-r from-[#B58A4F] to-[#D4AF37] h-full transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-[#B58A4F]/15">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#352014] border border-[#B58A4F]/30 flex items-center justify-center text-[#B58A4F]">
                  <ShoppingBag className="w-8 h-8 opacity-60" />
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
                  className="mt-4 px-6 py-2.5 bg-[#B58A4F] hover:bg-[#D4AF37] text-[#24150F] font-semibold text-xs uppercase tracking-wider rounded transition-colors"
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
                    className="w-16 h-20 object-cover rounded border border-[#B58A4F]/20 bg-[#352014] flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/product/${item.product_id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-serif text-base font-medium text-[#F3E5D2] hover:text-[#B58A4F] transition-colors truncate"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.product_id)}
                        className="text-[#D8B995]/50 hover:text-red-400 p-1 transition-colors"
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
                      <div className="flex items-center space-x-2 bg-[#352014] border border-[#B58A4F]/30 rounded px-2 py-1">
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                          className="text-[#D8B995] hover:text-[#B58A4F] p-0.5 disabled:opacity-30"
                          disabled={item.quantity <= 1}
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-mono font-medium px-2 text-[#F3E5D2]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                          className="text-[#D8B995] hover:text-[#B58A4F] p-0.5 disabled:opacity-30"
                          disabled={item.quantity >= item.stock}
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-medium text-[#B58A4F]">
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
            <div className="bg-[#352014]/90 px-6 py-4 border-t border-[#B58A4F]/25 space-y-3">
              {/* Promo input */}
              <form onSubmit={handleApplyPromo} className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Promo Code (e.g. OUDE10)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="flex-1 bg-[#24150F] text-[#F3E5D2] placeholder-[#D8B995]/50 px-3 py-1.5 text-xs rounded border border-[#B58A4F]/30 uppercase font-mono focus:outline-none focus:border-[#B58A4F]"
                />
                <button
                  type="submit"
                  className="bg-[#B58A4F]/30 hover:bg-[#B58A4F] text-[#F3E5D2] hover:text-[#24150F] border border-[#B58A4F] px-3 py-1.5 text-xs rounded font-medium transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Discount Notice */}
              {discount > 0 && (
                <div className="flex justify-between items-center text-xs text-emerald-400 bg-emerald-950/40 p-2 rounded border border-emerald-800/40">
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
                <div className="pt-2 border-t border-[#B58A4F]/20 flex justify-between items-center text-sm font-semibold text-[#F3E5D2]">
                  <span className="font-serif">Server-Calculated Total</span>
                  <span className="font-serif text-lg text-[#B58A4F]">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={handleProceedCheckout}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#B58A4F] to-[#D4AF37] hover:brightness-110 text-[#24150F] py-3 rounded text-xs uppercase tracking-widest font-bold transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Luxury Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <div className="flex justify-between text-[11px] text-[#D8B995]/70 pt-1">
                  <button
                    onClick={clearCart}
                    className="hover:text-red-400 transition-colors"
                  >
                    Clear Bag
                  </button>
                  <Link
                    to="/shop"
                    onClick={() => setIsCartOpen(false)}
                    className="hover:text-[#B58A4F] transition-colors"
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
