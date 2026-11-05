import React, { useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle2, Package, Printer, ArrowRight, ShieldCheck, Truck } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function OrderConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (order) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#B58A4F', '#D4AF37', '#F3E5D2', '#C49A70']
      });
    }
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-[75vh] luxury-canvas-bg flex items-center justify-center px-4 pt-24">
        <div className="luxury-glass-panel text-[#F3E5D2] p-10 rounded-3xl border border-[#D4AF37]/35 max-w-md text-center space-y-5 shadow-2xl">
          <p className="font-serif text-3xl font-bold gold-foil-text">No Order Session Found</p>
          <p className="text-xs text-[#D8B995]/80 leading-relaxed">
            If you have placed an order, you can view its live status under your profile.
          </p>
          <Link
            to="/shop"
            className="inline-block px-8 py-3.5 btn-gold-embossed text-xs font-serif uppercase tracking-widest font-bold rounded-xl shadow-2xl"
          >
            Explore Fragrances
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="luxury-canvas-bg min-h-screen text-[#F3E5D2] py-24 px-4 sm:px-6 lg:px-8 pt-32 relative overflow-hidden">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-56 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-3xl mx-auto space-y-8 relative z-10">
        
        {/* Celebration Header */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-black/60 border border-[#D4AF37] mx-auto flex items-center justify-center text-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.4)]">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs uppercase font-serif tracking-[0.28em] text-[#D4AF37] block">
            ORDER CONFIRMED & ALLOCATED
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold gold-foil-text">
            The Essence of Arabian Luxury is En Route
          </h1>
          <p className="text-xs sm:text-sm text-[#D8B995]/90 max-w-lg mx-auto font-light leading-relaxed">
            Thank you, {order.customer_name}. Your flacon is being prepared and hand-sealed by our master perfumers in our temperature-controlled vault.
          </p>
        </div>

        {/* The Luxury Receipt Card */}
        <div className="luxury-glass-panel text-[#F3E5D2] rounded-3xl border border-[#D4AF37]/35 shadow-2xl overflow-hidden p-6 sm:p-10 space-y-8">
          
          {/* Top Bar: Order & Tracking ID */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#D4AF37]/20 gap-4">
            <div>
              <span className="text-[10px] uppercase font-mono text-[#D8B995]/70 block">
                White-Glove Tracking ID
              </span>
              <span className="font-mono text-xl sm:text-2xl font-bold gold-foil-text">
                {order.tracking_code || `OUDE-${new Date().getFullYear()}-${String(order.id).padStart(5, '0')}`}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-mono text-[#D8B995]/70 block">
                Order Status
              </span>
              <span className="inline-block px-3 py-1 bg-[#180C07] text-[#D4AF37] border border-[#D4AF37]/40 rounded-lg text-xs font-serif capitalize shadow">
                ● {order.status || 'Processing'}
              </span>
            </div>
          </div>

          {/* Delivery & Payment Metadata Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#D8B995]/90 border-b border-[#D4AF37]/20 pb-6">
            <div>
              <span className="gold-foil-text font-serif font-semibold text-sm block mb-1">
                Recipient Details
              </span>
              <p className="text-[#F3E5D2] font-medium">{order.customer_name}</p>
              <p>{order.customer_email}</p>
              <p>{order.phone}</p>
            </div>

            <div>
              <span className="gold-foil-text font-serif font-semibold text-sm block mb-1">
                White-Glove Courier Address
              </span>
              <p className="text-[#F3E5D2]">{order.shipping_address}</p>
              <p>{order.city}, PIN {order.postal_code}</p>
              <p className="mt-1 text-[11px] text-[#D8B995]/70 italic">Payment: {order.payment_method}</p>
            </div>
          </div>

          {/* Order Items Table */}
          <div className="space-y-4">
            <h3 className="font-serif text-lg font-bold gold-foil-text">
              Acquired Fragrances
            </h3>
            
            <div className="divide-y divide-[#D4AF37]/15">
              {order.items?.map((item, idx) => (
                <div key={idx} className="py-4 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-3 min-w-0">
                    {item.image_url && (
                      <img
                        src={item.image_url}
                        alt={item.name || item.product_name}
                        className="w-12 h-14 object-cover rounded-xl border border-[#D4AF37]/30 bg-[#160B06] flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0">
                      <p className="font-serif font-bold text-base text-[#F3E5D2] truncate">
                        {item.name || item.product_name}
                      </p>
                      <p className="text-[#D8B995]/70">
                        Qty: {item.quantity} • 100ml Eau De Parfum Extrait
                      </p>
                    </div>
                  </div>

                  <span className="font-mono text-sm font-bold text-[#D4AF37]">
                    ₹{(Number(item.price) * item.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Financial Breakdown (Server Calculated) */}
          <div className="bg-[#120804] p-5 rounded-2xl border border-[#D4AF37]/25 space-y-2 text-xs text-[#D8B995]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono text-[#F3E5D2]">₹{Number(order.subtotal).toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span>White-Glove Courier</span>
              <span className="font-mono text-emerald-400">
                {Number(order.shipping_fee) === 0 ? 'COMPLIMENTARY' : `₹${Number(order.shipping_fee).toLocaleString('en-IN')}`}
              </span>
            </div>
            {Number(order.discount) > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Privilege Discount</span>
                <span className="font-mono">-₹{Number(order.discount).toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="pt-2 border-t border-[#D4AF37]/25 flex justify-between items-center text-base font-bold text-[#F3E5D2]">
              <span className="font-serif">Total Invoiced</span>
              <span className="font-serif text-2xl font-bold gold-foil-text">
                ₹{Number(order.total).toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2 no-print">
            <button
              onClick={handlePrint}
              className="px-6 py-3.5 bg-[#140A06] hover:bg-[#1E0F09] text-[#F3E5D2] border border-[#D4AF37]/40 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <Printer className="w-4 h-4 text-[#D4AF37]" />
              <span>Print Official Invoice</span>
            </button>

            <Link
              to="/profile"
              className="px-6 py-3.5 bg-[#140A06] hover:bg-[#1E0F09] text-[#F3E5D2] border border-[#D4AF37]/40 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all flex items-center justify-center space-x-2"
            >
              <Package className="w-4 h-4 text-[#D4AF37]" />
              <span>Track in My Account</span>
            </Link>

            <Link
              to="/shop"
              className="flex-1 px-6 py-3.5 btn-gold-embossed rounded-xl text-xs font-serif uppercase tracking-widest font-bold transition-all shadow-2xl flex items-center justify-center space-x-2"
            >
              <span>Explore More Scents</span>
              <ArrowRight className="w-4 h-4 text-[#1A0D07]" />
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
