import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ShieldCheck, Truck, RefreshCw, Send, Heart } from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-[#24150F] text-[#D8B995] border-t border-[#B58A4F]/30 pt-16 pb-8">
      {/* Brand Values / Value Proposition Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-[#B58A4F]/20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center sm:text-left">
          <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-[#352014]/60 hover:border hover:border-[#B58A4F]/30 hover:-translate-y-1 transition-all duration-300 cursor-default group">
            <div className="w-12 h-12 rounded-full bg-[#352014] border border-[#B58A4F]/40 group-hover:border-[#D4AF37] flex items-center justify-center text-[#B58A4F] group-hover:text-[#D4AF37] group-hover:scale-115 flex-shrink-0 transition-all">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-[#F3E5D2] group-hover:text-[#D4AF37] font-semibold text-base transition-colors">Rare Cambodian Oud</h4>
              <p className="text-xs text-[#D8B995]/70">Pure natural oils aged to perfection.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-[#352014]/60 hover:border hover:border-[#B58A4F]/30 hover:-translate-y-1 transition-all duration-300 cursor-default group">
            <div className="w-12 h-12 rounded-full bg-[#352014] border border-[#B58A4F]/40 group-hover:border-[#D4AF37] flex items-center justify-center text-[#B58A4F] group-hover:text-[#D4AF37] group-hover:scale-115 flex-shrink-0 transition-all">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-[#F3E5D2] group-hover:text-[#D4AF37] font-semibold text-base transition-colors">White-Glove Delivery</h4>
              <p className="text-xs text-[#D8B995]/70">Complimentary on orders over ₹3,000.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-[#352014]/60 hover:border hover:border-[#B58A4F]/30 hover:-translate-y-1 transition-all duration-300 cursor-default group">
            <div className="w-12 h-12 rounded-full bg-[#352014] border border-[#B58A4F]/40 group-hover:border-[#D4AF37] flex items-center justify-center text-[#B58A4F] group-hover:text-[#D4AF37] group-hover:scale-115 flex-shrink-0 transition-all">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-[#F3E5D2] group-hover:text-[#D4AF37] font-semibold text-base transition-colors">100% Authentic Flacons</h4>
              <p className="text-xs text-[#D8B995]/70">Hand-finished with gold metallic detailing.</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-[#352014]/60 hover:border hover:border-[#B58A4F]/30 hover:-translate-y-1 transition-all duration-300 cursor-default group">
            <div className="w-12 h-12 rounded-full bg-[#352014] border border-[#B58A4F]/40 group-hover:border-[#D4AF37] flex items-center justify-center text-[#B58A4F] group-hover:text-[#D4AF37] group-hover:scale-115 flex-shrink-0 transition-all">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-serif text-[#F3E5D2] group-hover:text-[#D4AF37] font-semibold text-base transition-colors">Olfactory Guarantee</h4>
              <p className="text-xs text-[#D8B995]/70">Sample card included in every box.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Newsletter */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Brand Intro Column */}
          <div className="md:col-span-4 space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-serif tracking-[0.25em] text-[#F3E5D2] font-bold">
                OUDÉ
              </span>
            </div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#B58A4F]">
              THE ESSENCE OF ARABIAN LUXURY
            </p>
            <p className="text-sm text-[#D8B995]/80 leading-relaxed pr-6">
              OUDÉ captures the grandeur of Arabian desert heritage. Designed for connoisseurs of timeless elegance, combining precious Cambodian oud, warm amber, and exquisite damask roses.
            </p>
            <div className="pt-2 text-xs text-[#D8B995]/60 font-mono">
              Curated for Luxury Fragrance Connoisseurs in India & the Gulf
            </div>
          </div>

          {/* Quick Collection Links */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-serif text-[#F3E5D2] text-sm tracking-wider uppercase font-semibold">
              The Seven Scents
            </h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/product/1" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-200 inline-block">Oud Royal</Link></li>
              <li><Link to="/product/2" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-200 inline-block">Desert Bloom</Link></li>
              <li><Link to="/product/3" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-200 inline-block">Amber Noir</Link></li>
              <li><Link to="/product/4" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-200 inline-block">Sahara Oud</Link></li>
              <li><Link to="/product/5" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-200 inline-block">Royal Musk</Link></li>
              <li><Link to="/product/6" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-200 inline-block">Golden Majesty</Link></li>
              <li><Link to="/product/7" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-200 inline-block">Midnight Oasis</Link></li>
            </ul>
          </div>

          {/* Client Concierge */}
          <div className="md:col-span-2 space-y-3">
            <h5 className="font-serif text-[#F3E5D2] text-sm tracking-wider uppercase font-semibold">
              Concierge
            </h5>
            <ul className="space-y-2 text-xs">
              <li><Link to="/shop" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-200 inline-block">All Perfumes</Link></li>
              <li><Link to="/profile" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-200 inline-block">Track Orders</Link></li>
              <li><Link to="/login" className="hover:text-[#D4AF37] hover:translate-x-1.5 transition-all duration-200 inline-block">Client Account</Link></li>
              <li><Link to="/admin" className="text-[#D4AF37] hover:underline hover:translate-x-1.5 transition-all duration-200 inline-block font-medium">Admin Portal</Link></li>
              <li><span className="text-[#D8B995]/60">Tel: +91 98765 43210</span></li>
              <li><span className="text-[#D8B995]/60">Email: concierge@oude.com</span></li>
            </ul>
          </div>

          {/* VIP Scent Club Newsletter */}
          <div className="md:col-span-4 space-y-4">
            <h5 className="font-serif text-[#F3E5D2] text-sm tracking-wider uppercase font-semibold">
              The OUDÉ Private Circle
            </h5>
            <p className="text-xs text-[#D8B995]/80 leading-relaxed">
              Subscribe to receive exclusive access to private reserve batches, olfactory masterclasses, and a 10% welcome privilege.
            </p>
            {subscribed ? (
              <div className="p-3 bg-[#352014] border border-[#B58A4F] rounded text-xs text-[#F3E5D2] flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#B58A4F]" />
                <span>Welcome to the Circle. Use code <strong>OUDE10</strong> at checkout.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex space-x-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/40 px-3.5 py-2.5 rounded text-xs border border-[#B58A4F]/30 hover:border-[#B58A4F] focus:outline-none focus:border-[#D4AF37] transition-colors"
                />
                <button
                  type="submit"
                  className="bg-[#B58A4F] hover:bg-[#D4AF37] hover:scale-105 active:scale-95 text-[#24150F] px-4 py-2.5 rounded text-xs font-semibold uppercase tracking-wider transition-all duration-200 shadow hover:shadow-gold-glow flex items-center space-x-1"
                >
                  <span>Join</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
            <div className="text-[11px] text-[#D8B995]/60">
              Protected by 256-bit SSL encryption. We honor your privacy.
            </div>
          </div>
        </div>
      </div>

      {/* Copyright & Disclaimer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-[#B58A4F]/20 flex flex-col sm:flex-row items-center justify-between text-xs text-[#D8B995]/60 space-y-3 sm:space-y-0">
        <div>
          © {new Date().getFullYear()} OUDÉ – Arabian Luxury Perfumes. Built for Full Stack Developer Practical Assessment.
        </div>
        <div className="flex items-center space-x-4">
          <span className="font-serif italic text-[#B58A4F]">Crafted with passion by Hani Nazer Mutheri</span>
        </div>
      </div>
    </footer>
  );
}
