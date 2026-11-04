import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, X, User, Shield, ChevronDown, LogOut, ArrowUpRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { productApi } from '../services/api.js';

export default function Navbar({ onOpenQuiz }) {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Scroll detection for navbar transition
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
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

  // Click outside detection
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

  // Search debounce
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

  const scrollToSection = (id) => {
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // On home page before scrolling, use transparent dark espresso styling matching the reference screenshot!
  const isTransparent = isHome && !isScrolled;

  const textColor = isTransparent ? 'text-[#24150F]' : 'text-[#F3E5D2]';
  const navBg = isTransparent
    ? 'bg-transparent'
    : 'bg-[#24150F]/95 backdrop-blur-md shadow-lg border-b border-[#B58A4F]/30';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${navBg} ${
        isTransparent ? 'py-6 sm:py-8' : 'py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-14 flex items-center justify-between">
        
        {/* Brand Logo: OUDÉ */}
        <Link to="/" className="flex items-center group">
          <span
            className={`font-serif text-2xl sm:text-3xl font-semibold tracking-[0.28em] transition-colors ${textColor}`}
          >
            OUDÉ
          </span>
        </Link>

        {/* Center Nav: HOME, COLLECTION, OUR STORY, CONTACT */}
        <nav className="hidden md:flex items-center space-x-10 text-xs tracking-[0.2em] uppercase font-medium">
          <Link
            to="/"
            className={`transition-colors relative py-1 ${
              location.pathname === '/'
                ? `${textColor} font-semibold border-b border-[#24150F]`
                : `${textColor}/80 hover:${textColor}`
            }`}
          >
            HOME
          </Link>

          <Link
            to="/shop"
            className={`transition-colors relative py-1 ${
              location.pathname === '/shop'
                ? `${textColor} font-semibold border-b border-[#B58A4F]`
                : `${textColor}/80 hover:${textColor}`
            }`}
          >
            COLLECTION
          </Link>

          <button
            onClick={() => scrollToSection('story')}
            className={`transition-colors py-1 ${textColor}/80 hover:${textColor}`}
          >
            OUR STORY
          </button>

          <button
            onClick={() => scrollToSection('contact')}
            className={`transition-colors py-1 ${textColor}/80 hover:${textColor}`}
          >
            CONTACT
          </button>
        </nav>

        {/* Right Icons: Search, User, Bag */}
        <div className="flex items-center space-x-5 sm:space-x-7">
          
          {/* Search Button */}
          <div className="relative" ref={searchRef}>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`p-1.5 transition-colors ${textColor}/85 hover:${textColor}`}
              aria-label="Search"
            >
              <Search className="w-5 h-5 stroke-[1.75]" />
            </button>

            {/* Live Search Modal/Dropdown */}
            {searchOpen && (
              <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-[#24150F] text-[#F3E5D2] border border-[#B58A4F]/40 rounded-xl shadow-2xl p-4 z-50">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search oud, saffron, amber, rose..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                    className="w-full bg-[#352014] text-[#F3E5D2] placeholder-[#D8B995]/50 px-4 py-2.5 pr-10 rounded text-xs border border-[#B58A4F]/30 focus:outline-none focus:border-[#B58A4F]"
                  />
                  <button
                    type="submit"
                    className="absolute right-3 top-2.5 text-[#B58A4F] hover:text-[#D4AF37]"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </form>

                {searchLoading ? (
                  <div className="py-4 text-center text-xs text-[#D8B995]">Searching perfumes...</div>
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
                          className="w-9 h-10 object-cover rounded border border-[#B58A4F]/20"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-serif text-[#F3E5D2] group-hover:text-[#B58A4F] truncate">
                            {product.name}
                          </p>
                          <p className="text-[10px] text-[#D8B995]/70 truncate">{product.category}</p>
                        </div>
                        <span className="text-xs font-mono font-medium text-[#B58A4F]">₹{Number(product.price).toLocaleString('en-IN')}</span>
                      </Link>
                    ))}
                    <button
                      onClick={handleSearchSubmit}
                      className="w-full text-center py-2 text-xs text-[#B58A4F] hover:underline uppercase tracking-wider font-medium mt-1"
                    >
                      View all results for "{searchQuery}"
                    </button>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* User Account / Admin Menu */}
          <div className="relative" ref={userMenuRef}>
            {isAuthenticated ? (
              <div>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className={`flex items-center space-x-1.5 p-1 transition-colors ${textColor}`}
                >
                  <div className="w-6 h-6 rounded-full bg-[#B58A4F]/25 border border-[#B58A4F] flex items-center justify-center font-serif text-xs font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#24150F] text-[#F3E5D2] border border-[#B58A4F]/40 rounded-xl shadow-2xl py-2 z-50 text-xs">
                    <div className="px-4 py-2 border-b border-[#B58A4F]/20">
                      <p className="font-serif font-bold text-sm text-[#F3E5D2] truncate">{user.name}</p>
                      <p className="text-[10px] text-[#B58A4F] truncate">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-[#352014] text-[#D8B995] hover:text-[#B58A4F]"
                    >
                      <User className="w-4 h-4" />
                      <span>My Profile & Orders</span>
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 hover:bg-[#352014] text-[#D4AF37] font-semibold"
                      >
                        <Shield className="w-4 h-4" />
                        <span>Admin Dashboard</span>
                      </Link>
                    )}
                    <button
                      onClick={logout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-red-400 hover:bg-[#352014] text-left border-t border-[#B58A4F]/20 mt-1"
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
                className={`p-1.5 transition-colors ${textColor}/85 hover:${textColor}`}
                title="Account"
              >
                <User className="w-5 h-5 stroke-[1.75]" />
              </Link>
            )}
          </div>

          {/* Shopping Bag Button with Exact Badge Count */}
          <button
            onClick={() => setIsCartOpen(true)}
            className={`relative p-1.5 transition-transform hover:scale-105 ${textColor}`}
            aria-label="View Shopping Bag"
          >
            <ShoppingBag className="w-5 h-5 stroke-[1.75]" />
            <span
              className={`absolute -top-1 -right-1 text-[10px] font-bold font-mono rounded-full w-4 h-4 flex items-center justify-center ${
                isTransparent
                  ? 'bg-[#24150F] text-[#F3E5D2]'
                  : 'bg-[#B58A4F] text-[#24150F]'
              }`}
            >
              {itemCount}
            </span>
          </button>
        </div>

      </div>
    </header>
  );
}
