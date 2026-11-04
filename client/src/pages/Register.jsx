import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Mail, User, Phone, MapPin, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password.length < 6) {
      setError('Password must contain at least 6 characters.');
      return;
    }

    setLoading(true);

    try {
      await register(formData);
      navigate('/');
    } catch (err) {
      setError(err.data?.message || err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-[#F3E5D2] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-[#24150F] text-[#F3E5D2] rounded-3xl border border-[#B58A4F]/30 shadow-2xl p-8 sm:p-10 space-y-6">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#B58A4F] block">
            Client Registration
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-[#F3E5D2]">
            Create an OUDÉ Account
          </h1>
          <p className="text-xs text-[#D8B995]/70 font-light">
            Enjoy server-synced carts, personalized fragrance recommendations, and white-glove order tracking.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#D8B995] mb-1">
              Full Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#B58A4F] absolute left-3.5 top-3" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Hani Nazer Mutheri"
                className="w-full bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/40 pl-10 pr-4 py-2.5 text-xs rounded border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#D8B995] mb-1">
              Email Address *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#B58A4F] absolute left-3.5 top-3" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="hani@oude.com"
                className="w-full bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/40 pl-10 pr-4 py-2.5 text-xs rounded border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#D8B995] mb-1">
              Password (Hashed Securely via bcrypt) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#B58A4F] absolute left-3.5 top-3" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/40 pl-10 pr-4 py-2.5 text-xs rounded border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#D8B995] mb-1">
              Contact Phone (Optional)
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-[#B58A4F] absolute left-3.5 top-3" />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 98765 43210"
                className="w-full bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/40 pl-10 pr-4 py-2.5 text-xs rounded border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#D8B995] mb-1">
              Default Shipping Address (Optional)
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-[#B58A4F] absolute left-3.5 top-3" />
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Penthouse 14B, Palm Avenue, Mumbai"
                className="w-full bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/40 pl-10 pr-4 py-2.5 text-xs rounded border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-[#B58A4F] to-[#D4AF37] hover:brightness-110 text-[#24150F] font-bold text-xs uppercase tracking-widest rounded-lg shadow-gold-glow transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Creating Client Profile...</span>
            ) : (
              <>
                <span>Register with OUDÉ</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#D8B995]/70">
          Already have an account?{' '}
          <Link to="/login" className="text-[#B58A4F] font-serif font-bold hover:underline">
            Sign In Here
          </Link>
        </div>

      </div>
    </div>
  );
}
