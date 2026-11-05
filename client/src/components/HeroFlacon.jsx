import React from 'react';

export default function HeroFlacon() {
  const scrollToCollection = () => {
    const el = document.getElementById('collection');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      onClick={scrollToCollection}
      className="relative select-none flex justify-center items-end hero-flacon-entrance group cursor-pointer"
      title="OUDÉ Royal Extrait • Click to explore collection"
    >
      {/* 1. Ambient Sunset Golden Aura Halo radiating behind the crystal flacon */}
      <div className="absolute inset-0 -top-10 -bottom-6 flex items-center justify-center pointer-events-none">
        <div className="w-52 sm:w-60 h-72 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.45)_0%,rgba(181,138,79,0.2)_40%,transparent_75%)] blur-md hero-flacon-aura group-hover:scale-120 group-hover:opacity-100 transition-all duration-700" />
      </div>

      {/* 2. Floating Flacon Stage */}
      <div className="relative hero-flacon-float z-10">
        
        {/* Subtle Luxury Twinkle Particles */}
        <span className="absolute -top-3 left-6 text-[#D4AF37] text-xs hero-flacon-twinkle-1 pointer-events-none drop-shadow-[0_0_6px_rgba(212,175,55,0.8)]">✦</span>
        <span className="absolute top-12 -right-3 text-[#FFE3A8] text-[10px] hero-flacon-twinkle-2 pointer-events-none drop-shadow-[0_0_6px_rgba(255,227,168,0.9)]">✦</span>
        <span className="absolute bottom-20 -left-4 text-[#D4AF37] text-xs hero-flacon-twinkle-3 pointer-events-none drop-shadow-[0_0_6px_rgba(212,175,55,0.8)]">✦</span>

        {/* Flacon Image */}
        <img
          src="/oude-flacon.png"
          alt="OUDÉ Arabian Luxury Perfume"
          className="w-full h-auto object-contain filter drop-shadow-[0_15px_24px_rgba(24,12,7,0.85)] group-hover:drop-shadow-[0_0_35px_rgba(212,175,55,0.7)] group-hover:scale-105 transition-all duration-500 pointer-events-auto"
          draggable="false"
        />
      </div>

      {/* 3. Soft, realistic contact shadow on the rock surface (synchronized breathing) */}
      <div className="absolute -bottom-1 left-1/2 w-4/5 h-3.5 bg-[#1F100A]/85 blur-sm rounded-full hero-flacon-shadow pointer-events-none z-0" />
    </div>
  );
}
