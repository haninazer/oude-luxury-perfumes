import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Truck, Lock, CreditCard, Sparkles, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { orderApi } from '../services/api.js';

export default function Checkout() {
  const { user, isAuthenticated } = useAuth();
  const {
    items,
    itemCount,
    subtotal,
    shippingFee,
    discount,
    discountDescription,
    grandTotal,
    promoCode,
    applyPromo,
    clearCart
  } = useCart();
  const navigate = useNavigate();

  // Shipping Form State
  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    customer_email: user?.email || '',
    shipping_address: user?.address || '',
    city: 'Mumbai',
    postal_code: '400050',
    phone: user?.phone || '+91 98765 43210',
    payment_method: 'Credit Card (Simulated)'
  });

  const [inputPromo, setInputPromo] = useState(promoCode || '');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Sync user details if logged in
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        customer_name: prev.customer_name || user.name || '',
        customer_email: prev.customer_email || user.email || '',
        shipping_address: prev.shipping_address || user.address || '',
        phone: prev.phone || user.phone || ''
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleApplyPromoCode = (e) => {
    e.preventDefault();
    applyPromo(inputPromo);
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (items.length === 0) {
      setErrorMessage('Your fragrance bag is empty.');
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customer_name: formData.customer_name,
        customer_email: formData.customer_email,
        shipping_address: formData.shipping_address,
        city: formData.city,
        postal_code: formData.postal_code,
        phone: formData.phone,
        payment_method: formData.payment_method,
        items: items.map(i => ({
          productId: i.product_id,
          quantity: i.quantity
        })),
        promoCode
      };

      const res = await orderApi.create(orderPayload);

      if (res.success && res.order) {
        await clearCart();
        navigate('/order-confirmation', { state: { order: res.order } });
      } else {
        setErrorMessage(res.message || 'Failed to place order.');
      }
    } catch (err) {
      console.error('Order checkout error:', err);
      const errors = err.data?.errors;
      if (errors && errors.length > 0) {
        setErrorMessage(errors.join(' '));
      } else {
        setErrorMessage(err.data?.message || err.message || 'Unable to complete order.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[75vh] bg-[#24150F] flex items-center justify-center px-4 pt-20">
        <div className="bg-[#24150F] text-[#F3E5D2] p-8 rounded-2xl border border-[#B58A4F]/30 max-w-md text-center space-y-4 shadow-xl">
          <p className="font-serif text-2xl">Your Bag is Empty</p>
          <p className="text-xs text-[#D8B995]/70">
            Select at least one perfume from our collection before proceeding to checkout.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-[#B58A4F] text-[#24150F] text-xs font-semibold uppercase tracking-wider rounded-lg shadow-gold-glow"
          >
            Explore Fragrances
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#24150F] min-h-screen text-[#F3E5D2] pb-24 pt-20">
      {/* Header */}
      <div className="bg-[#24150F] text-[#F3E5D2] py-8 border-b border-[#B58A4F]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/shop" className="text-[#D8B995] hover:text-[#B58A4F] text-xs flex items-center space-x-1">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Store</span>
            </Link>
            <span className="text-[#B58A4F]">/</span>
            <span className="font-serif text-lg font-semibold tracking-wider">White-Glove Luxury Checkout</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-[#D8B995]/70">
            <Lock className="w-4 h-4 text-[#B58A4F]" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {errorMessage && (
          <div className="mb-8 p-4 bg-red-950/90 text-red-200 border border-red-700/60 rounded-xl flex items-center space-x-3 text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Form: Shipping & Payment Details */}
          <div className="lg:col-span-7 space-y-8">
            
            {/* 1. Client Contact & Delivery Address */}
            <div className="bg-[#24150F] text-[#F3E5D2] p-6 sm:p-8 rounded-2xl border border-[#B58A4F]/30 shadow-xl space-y-6">
              <div className="flex justify-between items-center pb-3 border-b border-[#B58A4F]/20">
                <h2 className="font-serif text-xl font-bold flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-[#B58A4F] text-[#24150F] text-xs font-mono font-bold flex items-center justify-center">1</span>
                  <span>Delivery Address</span>
                </h2>
                {!isAuthenticated && (
                  <Link to="/login" className="text-xs text-[#B58A4F] hover:underline">
                    Have an account? Sign In
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#D8B995] mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    required
                    value={formData.customer_name}
                    onChange={handleChange}
                    placeholder="e.g. Hani Nazer Mutheri"
                    className="w-full bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/40 px-4 py-2.5 rounded-lg text-sm border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#D8B995] mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="customer_email"
                    required
                    value={formData.customer_email}
                    onChange={handleChange}
                    placeholder="hani@oude.com"
                    className="w-full bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/40 px-4 py-2.5 rounded-lg text-sm border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#D8B995] mb-1.5">
                    Shipping Address (Street / Flat / Estate) *
                  </label>
                  <textarea
                    rows={2}
                    name="shipping_address"
                    required
                    value={formData.shipping_address}
                    onChange={handleChange}
                    placeholder="Penthouse 14B, Palm Avenue, Downtown"
                    className="w-full bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/40 px-4 py-2.5 rounded-lg text-sm border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#D8B995] mb-1.5">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/40 px-4 py-2.5 rounded-lg text-sm border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#D8B995] mb-1.5">
                    Postal Code (PIN) *
                  </label>
                  <input
                    type="text"
                    name="postal_code"
                    required
                    value={formData.postal_code}
                    onChange={handleChange}
                    className="w-full bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/40 px-4 py-2.5 rounded-lg text-sm border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase font-mono tracking-wider text-[#D8B995] mb-1.5">
                    Contact Phone Number (For White-Glove Courier Delivery) *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/40 px-4 py-2.5 rounded-lg text-sm border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
                  />
                </div>
              </div>
            </div>

            {/* 2. Payment Method */}
            <div className="bg-[#24150F] text-[#F3E5D2] p-6 sm:p-8 rounded-2xl border border-[#B58A4F]/30 shadow-xl space-y-4">
              <div className="pb-3 border-b border-[#B58A4F]/20">
                <h2 className="font-serif text-xl font-bold flex items-center space-x-2">
                  <span className="w-6 h-6 rounded-full bg-[#B58A4F] text-[#24150F] text-xs font-mono font-bold flex items-center justify-center">2</span>
                  <span>Payment Gateway (Simulated)</span>
                </h2>
                <p className="text-xs text-[#D8B995]/70 mt-1">
                  Secure simulated sandbox payment. No real credit card charge occurs.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  { id: 'Credit Card (Simulated)', label: 'Credit / Debit Card (Visa, MasterCard, Amex)', desc: 'Instant authorization with mock verification.' },
                  { id: 'UPI / Instant QR', label: 'UPI / QR (Google Pay, PhonePe, Paytm)', desc: 'Scan and pay via any Indian UPI application.' },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery (White-Glove VIP Courier)', desc: 'Pay at your doorstep upon verification.' },
                ].map((pm) => (
                  <label
                    key={pm.id}
                    className={`flex items-start space-x-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      formData.payment_method === pm.id
                        ? 'bg-[#352014] border-[#B58A4F] shadow-gold-glow'
                        : 'bg-[#352014]/40 border-[#B58A4F]/20 hover:border-[#B58A4F]/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment_method"
                      value={pm.id}
                      checked={formData.payment_method === pm.id}
                      onChange={handleChange}
                      className="mt-1 accent-[#B58A4F]"
                    />
                    <div>
                      <p className="font-serif font-bold text-sm text-[#F3E5D2]">{pm.label}</p>
                      <p className="text-xs text-[#D8B995]/70 mt-0.5">{pm.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Server-Calculated Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-[#24150F] text-[#F3E5D2] p-6 sm:p-8 rounded-2xl border border-[#B58A4F]/30 shadow-2xl space-y-6 sticky top-28">
              
              <div className="pb-4 border-b border-[#B58A4F]/20 flex justify-between items-center">
                <h2 className="font-serif text-xl font-bold">Order Summary</h2>
                <span className="text-xs font-mono text-[#D4AF37]">{itemCount} item(s)</span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-[#B58A4F]/15 max-h-60 overflow-y-auto pr-1">
                {items.map((item) => (
                  <div key={item.product_id} className="py-3 flex items-center space-x-3 text-xs">
                    <img
                      src={item.image_url}
                      alt={item.name}
                      className="w-12 h-14 object-cover rounded-lg border border-[#B58A4F]/30 bg-[#352014]"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-bold text-sm text-[#F3E5D2] truncate">{item.name}</p>
                      <p className="text-[11px] text-[#D8B995]/70">
                        Qty: {item.quantity} • {item.size || '100ml'}
                      </p>
                    </div>
                    <span className="font-mono text-[#D4AF37] font-bold">
                      ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Promo Code Input */}
              <div className="pt-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter code (try OUDE10)"
                    value={inputPromo}
                    onChange={(e) => setInputPromo(e.target.value.toUpperCase())}
                    className="flex-1 bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/40 px-3 py-2 text-xs rounded-lg border border-[#B58A4F]/30 uppercase font-mono focus:outline-none focus:border-[#B58A4F]"
                  />
                  <button
                    type="button"
                    onClick={handleApplyPromoCode}
                    className="bg-[#B58A4F]/30 hover:bg-[#B58A4F] text-[#F3E5D2] hover:text-[#24150F] border border-[#B58A4F] px-3.5 py-2 text-xs rounded-lg font-medium transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {discount > 0 && (
                  <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {discountDescription}
                  </p>
                )}
              </div>

              {/* Financial Breakdown (Server Calculated) */}
              <div className="space-y-2 text-xs text-[#D8B995] pt-3 border-t border-[#B58A4F]/20">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#F3E5D2]">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>White-Glove Courier Delivery</span>
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
                <div className="pt-3 border-t border-[#B58A4F]/30 flex justify-between items-center text-base font-bold text-[#F3E5D2]">
                  <span className="font-serif">Server Total</span>
                  <span className="font-serif text-2xl text-[#D4AF37]">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-gradient-to-r from-[#B58A4F] to-[#D4AF37] hover:brightness-110 text-[#24150F] font-bold text-xs uppercase tracking-widest rounded-xl shadow-gold-glow transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#24150F] border-t-transparent rounded-full animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Complete Luxury Order • ₹{grandTotal.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

              <div className="text-center text-[10px] text-[#D8B995]/60 flex items-center justify-center space-x-2">
                <Truck className="w-3.5 h-3.5 text-[#B58A4F]" />
                <span>Estimated Delivery: 2-3 Business Days Across India</span>
              </div>

            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
