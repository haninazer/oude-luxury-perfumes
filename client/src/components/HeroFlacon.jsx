import React from 'react';

export default function HeroFlacon() {
  return (
    <div
      className="relative select-none flex justify-center items-end"
      title="OUDÉ Royal Extrait"
    >
      {/* The Flacon - Grounded stably on top of the rock with NO animation effect */}
      <div className="relative">
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
