import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Eye, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';
import { Link } from 'react-router-dom';

export default function HeroFlacon({ onOpenQuiz }) {
  const { addToCart } = useCart();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [mistActive, setMistActive] = useState(false);
  const [addedNotice, setAddedNotice] = useState(false);
  const containerRef = useRef(null);

  // 3D Parallax Tilt based on cursor position
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from center of bottle
      const deltaX = (e.clientX - centerX) / (window.innerWidth / 2);
      const deltaY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Clamp tilt angles
      const rotateY = Math.max(-12, Math.min(12, deltaX * 14));
      const rotateX = Math.max(-12, Math.min(12, -deltaY * 14));

      setTilt({ x: rotateX, y: rotateY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Mist sparkle on click
  const handleBottleClick = () => {
    setMistActive(true);
    setTimeout(() => setMistActive(false), 1600);
  };

  const handleQuickAdd = async (e) => {
    e.stopPropagation();
    await addToCart(1, 1); // Oud Royal
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  return (
    <div
      ref={containerRef}
      className="relative cursor-pointer select-none group perspective-1000"
      onClick={handleBottleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setTilt({ x: 0, y: 0 });
      }}
    >
      {/* 1. Warm Ambient Golden Pulse Glow Behind Bottle */}
      <div
        className="absolute -inset-6 rounded-full bg-gradient-to-tr from-[#B58A4F]/30 via-[#D4AF37]/40 to-transparent blur-2xl transition-all duration-700 pointer-events-none animate-pulse"
        style={{
          transform: isHovered ? 'scale(1.2)' : 'scale(1.0)',
          opacity: isHovered ? 0.9 : 0.6
        }}
      />

      {/* 2. Fragrance Mist Particle Emission on Click */}
      {mistActive && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center animate-fade-in">
          {/* Scent rings */}
          <div className="w-16 h-16 rounded-full border border-[#D4AF37] animate-ping opacity-75" />
          <div className="absolute top-2 w-10 h-10 rounded-full border border-[#B58A4F] animate-ping opacity-50 delay-100" />
          <div className="mt-1 px-3 py-1 rounded-full bg-[#24150F]/90 text-[#D4AF37] border border-[#B58A4F]/50 text-[10px] font-serif tracking-wider shadow-xl whitespace-nowrap">
            ✦ Cambodian Oud Mist Sprayed ✦
          </div>
        </div>
      )}

      {/* 3. The 3D Animated Luxury Bottle */}
      <div
        className="relative transition-transform duration-200 ease-out will-change-transform"
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${
            isHovered ? '-10px' : '0px'
          }) scale(${isHovered ? 1.03 : 1.0})`,
        }}
      >
        {/* Floating breathing animation container */}
        <div className="animate-float-slow relative">
          
          {/* High-Resolution Flacon Cutout */}
          <img
            src="/oude-flacon.png"
            alt="OUDÉ Arabian Luxury Flacon"
            className="w-full h-auto object-contain filter drop-shadow-[0_20px_35px_rgba(36,21,15,0.7)] drop-shadow-[0_0_15px_rgba(181,138,79,0.3)] transition-all duration-300"
            draggable="false"
          />

          {/* Golden Specular Light Sweep / Shimmer Reflection */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-2xl">
            <div className="w-[180%] h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-25 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
          </div>

          {/* Pedestal Cast Shadow Underneath */}
          <div
            className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-3/4 h-6 rounded-full bg-black/60 blur-md pointer-events-none transition-all duration-500"
            style={{
              transform: isHovered
                ? 'translateX(-50%) scale(0.85) translateY(6px)'
                : 'translateX(-50%) scale(1.0)',
              opacity: isHovered ? 0.35 : 0.65
            }}
          />
        </div>
      </div>

      {/* 4. Interactive Hover Floating Badge */}
      <div
        className={`absolute -bottom-10 left-1/2 -translate-x-1/2 transition-all duration-300 pointer-events-none z-20 ${
          isHovered
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-2'
        }`}
      >
        <div className="bg-[#24150F]/95 backdrop-blur-md text-[#F3E5D2] border border-[#B58A4F]/60 px-4 py-2 rounded-xl shadow-2xl flex items-center space-x-2 text-xs whitespace-nowrap">
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="font-serif font-bold text-sm">Oud Royal</span>
          <span className="text-[#D8B995]/70">• ₹4,999</span>
        </div>
      </div>

      {/* Quick Add confirmation toast */}
      {addedNotice && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#24150F] text-emerald-400 border border-emerald-600 px-4 py-2 rounded-xl text-xs font-serif font-bold shadow-2xl z-30 whitespace-nowrap">
          ✓ Added to Bag
        </div>
      )}
    </div>
  );
}
