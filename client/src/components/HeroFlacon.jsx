import React, { useState } from 'react';

export default function HeroFlacon() {
  const [mistActive, setMistActive] = useState(false);

  // Subtle click aroma puff without moving or hovering the bottle
  const handleClick = () => {
    setMistActive(true);
    setTimeout(() => setMistActive(false), 1800);
  };

  return (
    <div
      onClick={handleClick}
      className="relative select-none cursor-pointer flex justify-center items-end"
      title="OUDÉ Royal Extrait"
    >
      {/* Gentle Fragrance Mist Ring on Click Only (No hover effect) */}
      {mistActive && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 pointer-events-none z-30 flex flex-col items-center animate-fade-in">
          <div className="w-14 h-14 rounded-full border border-[#D4AF37]/80 animate-ping opacity-60" />
          <div className="mt-1 px-3 py-1 rounded-full bg-[#24150F]/90 text-[#D4AF37] border border-[#B58A4F]/40 text-[10px] font-serif tracking-wider shadow-lg whitespace-nowrap">
            ✦ Cambodian Oud Essence ✦
          </div>
        </div>
      )}

      {/* The Flacon - Grounded stably on top of the rock */}
      <div className="relative transition-opacity duration-1000 ease-out opacity-100">
        <img
          src="/oude-flacon.png"
          alt="OUDÉ Arabian Luxury Perfume"
          className="w-full h-auto object-contain filter drop-shadow-[0_12px_16px_rgba(36,21,15,0.7)] pointer-events-auto"
          draggable="false"
        />

        {/* Soft, realistic contact shadow on the rock surface */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4/5 h-3 bg-[#24150F]/70 blur-sm rounded-full pointer-events-none" />
      </div>
    </div>
  );
}
