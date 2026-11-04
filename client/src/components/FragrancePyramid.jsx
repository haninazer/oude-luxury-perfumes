import React, { useState } from 'react';
import { Sparkles, Clock, Compass, Layers } from 'lucide-react';

export default function FragrancePyramid({ topNotes = '', heartNotes = '', baseNotes = '', character = '' }) {
  const [activeTier, setActiveTier] = useState('heart'); // 'top', 'heart', or 'base'

  const parseNotes = (str) => {
    if (!str) return [];
    return str.split(',').map((s) => s.trim()).filter(Boolean);
  };

  const top = parseNotes(topNotes);
  const heart = parseNotes(heartNotes);
  const base = parseNotes(baseNotes);

  const tiers = {
    top: {
      title: 'Top Notes — The Opening Impression',
      timeline: 'First 15 to 30 minutes',
      role: 'The immediate sensory greeting upon first contact with your pulse points.',
      notes: top,
      accent: 'from-[#E8C9A8] to-[#D8B995]',
      badgeColor: 'border-[#E8C9A8] bg-[#E8C9A8]/10 text-[#E8C9A8]',
    },
    heart: {
      title: 'Heart Notes — The Olfactory Soul',
      timeline: '2 to 6 hours',
      role: 'The true core character and personality of the Arabian fragrance.',
      notes: heart,
      accent: 'from-[#D4AF37] to-[#B58A4F]',
      badgeColor: 'border-[#B58A4F] bg-[#B58A4F]/20 text-[#D4AF37]',
    },
    base: {
      title: 'Base Notes — The Enduring Legacy',
      timeline: '8 to 16+ hours',
      role: 'The rich foundation of aged resins, woods, and musk that leaves a memorable sillage.',
      notes: base,
      accent: 'from-[#B58A4F] to-[#4A2E1F]',
      badgeColor: 'border-[#B58A4F]/60 bg-[#352014] text-[#F3E5D2]',
    },
  };

  const current = tiers[activeTier];

  return (
    <div className="bg-[#24150F] border border-[#B58A4F]/30 rounded-xl p-6 shadow-xl">
      <div className="flex items-center justify-between pb-4 border-b border-[#B58A4F]/20 mb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#B58A4F] block">
            Olfactory Architecture
          </span>
          <h3 className="font-serif text-xl font-bold text-[#F3E5D2]">
            Interactive Fragrance Pyramid
          </h3>
        </div>
        <div className="hidden sm:flex items-center space-x-1 text-xs text-[#D8B995]/70">
          <Clock className="w-3.5 h-3.5 text-[#B58A4F]" />
          <span>Gradual Olfactory Evolution</span>
        </div>
      </div>

      {/* Visual Pyramid Tier Controls */}
      <div className="max-w-md mx-auto mb-8 space-y-2">
        {/* Top Tier (Narrowest) */}
        <button
          onClick={() => setActiveTier('top')}
          className={`w-1/2 mx-auto block py-2.5 px-3 rounded-t-lg text-center text-xs font-serif font-semibold tracking-wider transition-all duration-300 ${
            activeTier === 'top'
              ? 'bg-gradient-to-r from-[#D8B995] to-[#B58A4F] text-[#24150F] shadow-gold-glow scale-105'
              : 'bg-[#352014] text-[#D8B995] hover:bg-[#352014]/80 border border-[#B58A4F]/30'
          }`}
        >
          ▲ Top Notes (Opening)
        </button>

        {/* Heart Tier (Medium) */}
        <button
          onClick={() => setActiveTier('heart')}
          className={`w-3/4 mx-auto block py-3 px-4 text-center text-xs font-serif font-bold tracking-wider transition-all duration-300 ${
            activeTier === 'heart'
              ? 'bg-gradient-to-r from-[#B58A4F] to-[#D4AF37] text-[#24150F] shadow-gold-glow scale-105'
              : 'bg-[#352014] text-[#D8B995] hover:bg-[#352014]/80 border border-[#B58A4F]/30'
          }`}
        >
          ✦ Heart Notes (The Soul)
        </button>

        {/* Base Tier (Widest) */}
        <button
          onClick={() => setActiveTier('base')}
          className={`w-full block py-3.5 px-4 rounded-b-lg text-center text-xs font-serif font-bold tracking-wider transition-all duration-300 ${
            activeTier === 'base'
              ? 'bg-gradient-to-r from-[#936C38] to-[#B58A4F] text-[#24150F] shadow-gold-glow scale-105'
              : 'bg-[#352014] text-[#D8B995] hover:bg-[#352014]/80 border border-[#B58A4F]/30'
          }`}
        >
          ▼ Base Notes (The Drydown & Sillage)
        </button>
      </div>

      {/* Tier Details Panel */}
      <div className="bg-[#352014]/60 border border-[#B58A4F]/30 rounded-lg p-5 transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <h4 className="font-serif text-lg font-bold text-[#F3E5D2]">
            {current.title}
          </h4>
          <span className="text-xs font-mono text-[#B58A4F] px-2.5 py-1 bg-[#24150F] rounded border border-[#B58A4F]/30 inline-block self-start">
            Duration: {current.timeline}
          </span>
        </div>

        <p className="text-xs text-[#D8B995]/80 leading-relaxed mb-4">
          {current.role}
        </p>

        {/* Interactive Note Badges */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-[#B58A4F]/15">
          {current.notes.map((note, idx) => (
            <span
              key={idx}
              className={`text-xs px-3 py-1.5 rounded-full border font-medium flex items-center space-x-1.5 transition-transform hover:scale-105 ${current.badgeColor}`}
            >
              <Sparkles className="w-3 h-3 text-[#B58A4F]" />
              <span>{note}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
