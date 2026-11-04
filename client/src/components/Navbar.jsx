import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, User, Search, Menu, X, Shield, Sparkles, ChevronDown, LogOut, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { productApi } from '../services/api.js';

export default function Navbar({ onOpenQuiz }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Scroll detection for navbar styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
    setSearchOpen(false);
  }, [location.pathname]);

  // Handle outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Live search debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const res = await productApi.getAll({ q: searchQuery });
        if (res.success) {
          setSearchResults(res.products.slice(0, 4));
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      {/* Top Luxury Announcement Bar */}
      <div className="bg-[#24150F] text-[#D8B995] text-xs py-2 px-4 border-b border-[#B58A4F]/20 text-center flex items-center justify-center space-x-3 tracking-widest uppercase">
        <span className="hidden sm:inline">✦ Complimentary Luxury White-Glove Delivery Across India on Orders Above ₹3,000 ✦</span>
        <span className="sm:hidden">✦ Free Delivery Above ₹3,000 ✦</span>
        <span className="inline-block px-2 py-0.5 bg-[#B58A4F]/30 text-[#F3E5D2] rounded border border-[#B58A4F]/40 font-mono text-[10px]">
          CODE: OUDE10 (10% OFF)
        </span>
      </div>

      {/* Main Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#24150F]/95 backdrop-blur-md shadow-lg border-b border-[#B58A4F]/30 py-3'
            : 'bg-[#24150F] border-b border-[#B58A4F]/20 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#D8B995] hover:text-[#B58A4F] p-2 focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Left Navigation Links - Desktop */}
          <nav className="hidden lg:flex items-center space-x-8 text-sm tracking-widest uppercase font-medium">
            <Link
              to="/"
              className={`transition-colors duration-200 ${
                location.pathname === '/' ? 'text-[#B58A4F]' : 'text-[#F3E5D2]/80 hover:text-[#B58A4F]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/shop"
              className={`transition-colors duration-200 ${
                location.pathname === '/shop' ? 'text-[#B58A4F]' : 'text-[#F3E5D2]/80 hover:text-[#B58A4F]'
              }`}
            >
              Collection
            </Link>
            <button
              onClick={onOpenQuiz}
              className="text-[#F3E5D2]/80 hover:text-[#B58A4F] flex items-center space-x-1.5 transition-colors duration-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B58A4F]" />
              <span>Scent Profiler</span>
            </button>
            <Link
              to="/shop?category=Oriental+Woody"
              className="text-[#F3E5D2]/80 hover:text-[#B58A4F] transition-colors duration-200"
            >
              Royal Oud
            </Link>
          </nav>

          {/* Centered Brand Logo */}
          <Link to="/" className="flex flex-col items-center group text-center py-1">
            <div className="flex items-center space-x-2">
              <span className="text-2xl sm:text-3xl font-serif tracking-[0.25em] text-[#F3E5D2] font-semibold group-hover:text-[#B58A4F] transition-colors">
                OUDÉ
              </span>
            </div>
            <span className="text-[9px] sm:text-[10px] tracking-[0.3em] uppercase text-[#B58A4F] font-light">
              Arabian Luxury Perfumes
            </span>
          </Link>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Search Toggle Button */}
            <div className="relative" ref={searchRef}>
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="text-[#F3E5D2]/80 hover:text-[#B58A4F] p-2 transition-colors"
                aria-label="Search Fragrances"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Interactive Search Overlay Dropdown */}
              {searchOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#24150F] border border-[#B58A4F]/40 rounded-lg shadow-2xl p-4 z-50">
                  <form onSubmit={handleSearchSubmit} className="relative">
                    <input
                      type="text"
                      placeholder="Search oud, rose, saffron, amber..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                      className="w-full bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/50 px-4 py-2.5 pr-10 rounded border border-[#B58A4F]/30 text-sm focus:outline-none focus:border-[#B58A4F]"
                    />
                    <button
                      type="submit"
                      className="absolute right-2.5 top-2.5 text-[#B58A4F] hover:text-[#D4AF37]"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Search Autocomplete Results */}
                  {searchLoading ? (
                    <div className="py-4 text-center text-xs text-[#D8B995]">Searching the collection...</div>
                  ) : searchResults.length > 0 ? (
                    <div className="mt-3 divide-y divide-[#B58A4F]/20 max-h-64 overflow-y-auto">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          to={`/product/${product.id}`}
                          onClick={() => setSearchOpen(false)}
                          className="flex items-center space-x-3 py-2 px-1 hover:bg-[#352014] rounded transition-colors group"
                        >
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded border border-[#B58A4F]/20"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-serif text-[#F3E5D2] group-hover:text-[#B58A4F] truncate">
                              {product.name}
                            </p>
                            <p className="text-[11px] text-[#D8B995]/70 truncate">{product.category}</p>
                          </div>
                          <span className="text-xs font-medium text-[#B58A4F]">₹{Number(product.price).toLocaleString('en-IN')}</span>
                        </Link>
                      ))}
                      <button
                        onClick={handleSearchSubmit}
                        className="w-full text-center py-2 text-xs text-[#B58A4F] hover:underline uppercase tracking-wider font-medium mt-1"
                      >
                        View all results for "{searchQuery}"
                      </button>
                    </div>
                  ) : searchQuery.trim() ? (
                    <div className="py-4 text-center text-xs text-[#D8B995]/70">
                      No fragrances found matching "{searchQuery}".
                    </div>
                  ) : null}
                </div>
              )}
            </div>

            {/* User Account Menu */}
            <div className="relative" ref={userMenuRef}>
              {isAuthenticated ? (
                <div>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center space-x-1 text-[#F3E5D2]/90 hover:text-[#B58A4F] p-1.5 transition-colors rounded text-xs"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#B58A4F]/20 border border-[#B58A4F]/50 flex items-center justify-center text-[#B58A4F] font-serif font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-[#B58A4F]" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-[#24150F] border border-[#B58A4F]/40 rounded-lg shadow-2xl py-2 z-50 text-sm">
                      <div className="px-4 py-2 border-b border-[#B58A4F]/20">
                        <p className="text-xs text-[#D8B995]/70 uppercase tracking-wider">Signed In As</p>
                        <p className="font-serif text-[#F3E5D2] font-medium truncate">{user.name}</p>
                        <p className="text-[11px] text-[#B58A4F] truncate">{user.email}</p>
                      </div>

                      <Link
                        to="/profile"
                        className="flex items-center space-x-2.5 px-4 py-2 text-[#F3E5D2]/80 hover:bg-[#352014] hover:text-[#B58A4F]"
                      >
                        <User className="w-4 h-4" />
                        <span>My Profile & Orders</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="flex items-center space-x-2.5 px-4 py-2 text-[#D4AF37] hover:bg-[#352014] font-medium"
                        >
                          <Shield className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={logout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-red-400 hover:bg-[#352014] text-left border-t border-[#B58A4F]/20 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-[#F3E5D2]/80 hover:text-[#B58A4F] p-2 transition-colors flex items-center space-x-1.5"
                  title="Sign In"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden md:inline text-xs uppercase tracking-wider">Sign In</span>
                </Link>
              )}
            </div>

            {/* Shopping Cart Button with Animated Badge */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#F3E5D2]/90 hover:text-[#B58A4F] transition-colors group"
              aria-label="View Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B58A4F] text-[#24150F] text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#24150F] animate-pulse">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#24150F] border-b border-[#B58A4F]/30 px-6 py-6 space-y-4">
            <Link
              to="/"
              className="block text-base tracking-widest uppercase font-serif text-[#F3E5D2] hover:text-[#B58A4F]"
            >
              Home
            </Link>
            <Link
              to="/shop"
              className="block text-base tracking-widest uppercase font-serif text-[#F3E5D2] hover:text-[#B58A4F]"
            >
              The Seven Perfumes
            </Link>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuiz();
              }}
              className="flex items-center space-x-2 text-base tracking-widest uppercase font-serif text-[#B58A4F]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Scent Profiler Quiz</span>
            </button>
            <div className="pt-4 border-t border-[#B58A4F]/20 flex flex-col space-y-3">
              {isAuthenticated ? (
                <>
                  <Link to="/profile" className="text-sm text-[#F3E5D2] flex items-center space-x-2">
                    <User className="w-4 h-4 text-[#B58A4F]" />
                    <span>My Profile & Orders ({user.name})</span>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="text-sm text-[#D4AF37] flex items-center space-x-2">
                      <Shield className="w-4 h-4" />
                      <span>Admin Portal</span>
                    </Link>
                  )}
                  <button onClick={logout} className="text-sm text-red-400 text-left">
                    Sign Out
                  </button>
                </>
              ) : (
                <div className="flex space-x-4">
                  <Link
                    to="/login"
                    className="flex-1 py-2 text-center text-xs uppercase tracking-wider bg-[#352014] text-[#F3E5D2] border border-[#B58A4F]/40 rounded"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="flex-1 py-2 text-center text-xs uppercase tracking-wider bg-[#B58A4F] text-[#24150F] font-semibold rounded"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
