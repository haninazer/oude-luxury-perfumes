import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.user?.role === 'admin' && from === '/') {
        navigate('/admin');
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(err.data?.message || err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const autofillAdmin = () => {
    setEmail('admin@oude.com');
    setPassword('Admin@Oude2026!');
  };

  const autofillCustomer = () => {
    setEmail('hani@oude.com');
    setPassword('Customer@123!');
  };

  return (
    <div className="min-h-screen luxury-canvas-bg text-[#F3E5D2] flex items-center justify-center px-4 py-28 relative overflow-hidden">
      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 max-w-4xl h-56 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.18)_0%,transparent_70%)] pointer-events-none" />

      <div className="max-w-md w-full luxury-glass-panel text-[#F3E5D2] rounded-3xl border border-[#D4AF37]/35 shadow-2xl p-8 sm:p-10 space-y-6 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="text-[10px] uppercase font-serif tracking-[0.28em] text-[#D4AF37] block">
            CLIENT AUTHENTICATION
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight gold-foil-text">
            Welcome Back to OUDÉ
          </h1>
          <p className="text-xs text-[#D8B995]/80 font-light">
            Sign in to access your personal fragrance bag and order history.
          </p>
        </div>

        {/* Demo Fast Autofill Helper Banner */}
        <div className="p-3.5 bg-[#140A06] rounded-2xl border border-[#D4AF37]/30 text-xs space-y-2">
          <span className="text-[11px] text-[#D4AF37] font-serif font-semibold block">
            Assessment Quick-Login Credentials:
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={autofillAdmin}
              className="flex-1 py-2 px-2 bg-[#0A0402] hover:bg-[#D4AF37] hover:text-[#0A0402] text-[#D8B995] rounded-xl border border-[#D4AF37]/30 text-[10px] font-mono transition-all font-semibold"
            >
              👑 Fill Admin
            </button>
            <button
              type="button"
              onClick={autofillCustomer}
              className="flex-1 py-2 px-2 bg-[#0A0402] hover:bg-[#D4AF37] hover:text-[#0A0402] text-[#D8B995] rounded-xl border border-[#D4AF37]/30 text-[10px] font-mono transition-all font-semibold"
            >
              👤 Fill Customer
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-red-950/80 border border-red-800 text-red-200 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#D8B995] mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-[#140A06] text-[#F3E5D2] placeholder-[#D8B995]/40 pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase font-mono tracking-wider text-[#D8B995] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#140A06] text-[#F3E5D2] placeholder-[#D8B995]/40 pl-10 pr-4 py-2.5 text-xs rounded-xl border border-[#D4AF37]/30 focus:outline-none focus:border-[#D4AF37] focus:shadow-[0_0_15px_rgba(212,175,55,0.2)] transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 btn-gold-embossed text-xs font-serif uppercase tracking-widest font-bold rounded-xl shadow-2xl transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4 text-[#1A0D07]" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-2 text-xs text-[#D8B995]/70">
          New to OUDÉ?{' '}
          <Link to="/register" className="text-[#D4AF37] font-serif font-bold hover:underline">
            Create an Account
          </Link>
        </div>

      </div>
    </div>
  );
}
