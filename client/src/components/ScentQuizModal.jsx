import React, { useState } from 'react';
import { X, Sparkles, Check, ArrowRight, RotateCcw, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

export default function ScentQuizModal({ isOpen, onClose }) {
  const { addToCart } = useCart();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [recommendation, setRecommendation] = useState(null);

  if (!isOpen) return null;

  const questions = [
    {
      id: 'mood',
      title: 'What olfactory atmosphere speaks to your spirit?',
      options: [
        { label: 'Majestic Cambodian Oud & Sacred Woods', desc: 'Deep, commanding, and steeped in ancient regal tradition.', target: 1 }, // Oud Royal
        { label: 'Desert Gardens & Dewy Damask Roses', desc: 'Graceful floral sweetness with oriental warmth.', target: 2 }, // Desert Bloom
        { label: 'Smoky Amber & Dark Spices', desc: 'Mysterious, brooding, and bold with black pepper and labdanum.', target: 3 }, // Amber Noir
        { label: 'Intense Leather & Raw Desert Dunes', desc: 'Pure power and heritage with Cambodian agarwood and vetiver.', target: 4 }, // Sahara Oud
        { label: 'Radiant Spices & Golden Sunset Warmth', desc: 'Opulent cinnamon, orange blossom, and creamy tonka.', target: 6 }, // Golden Majesty
        { label: 'Crisp Marine Citrus & Cool Night Breeze', desc: 'Refreshing Italian bergamot, coastal herbs, and cedarwood.', target: 7 }, // Midnight Oasis
      ]
    },
    {
      id: 'occasion',
      title: 'Where will you wear your signature scent?',
      options: [
        { label: 'Grand Evening Galas & Celebrations', scoreBoost: 'high' },
        { label: 'Daily Signature & Executive Presence', scoreBoost: 'medium' },
        { label: 'Intimate Evenings & Personal Indulgence', scoreBoost: 'personal' },
      ]
    },
    {
      id: 'intensity',
      title: 'What is your preferred sillage and trail?',
      options: [
        { label: 'Regal & Dominant (Fills the room with majestic aura)', level: 'strong' },
        { label: 'Graceful & Elegant (Intriguing to those who step close)', level: 'moderate' },
        { label: 'Soft & Velvety (Subtle luxury close to your pulse)', level: 'subtle' },
      ]
    }
  ];

  const handleSelectOption = (index) => {
    const updatedAnswers = { ...answers, [step]: index };
    setAnswers(updatedAnswers);

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Calculate final match
      calculateResult(updatedAnswers);
    }
  };

  const calculateResult = (finalAnswers) => {
    // Map chosen mood directly or evaluate
    const moodIdx = finalAnswers[0] || 0;
    const targets = [
      {
        id: 1,
        name: 'Oud Royal',
        category: 'Oriental Woody',
        price: 4999,
        color: 'Amber Gold',
        reason: 'Your preference for majestic Cambodian oud and royal aura pairs seamlessly with our signature Oud Royal.',
        image: '/products/oud-royal.jpg'
      },
      {
        id: 2,
        name: 'Desert Bloom',
        category: 'Floral Oriental',
        price: 3499,
        color: 'Rose Pink',
        reason: 'You appreciate graceful romance and blooming florals balanced with warm oriental undertones.',
        image: '/products/desert-bloom.jpg'
      },
      {
        id: 3,
        name: 'Amber Noir',
        category: 'Amber Woody',
        price: 4299,
        color: 'Smoky Dark Brown',
        reason: 'Your dark, magnetic profile calls for the smoky woods, cinnamon, and warm labdanum of Amber Noir.',
        image: '/products/amber-noir.jpg'
      },
      {
        id: 4,
        name: 'Sahara Oud',
        category: 'Woody Oriental',
        price: 5499,
        color: 'Deep Amber Bronze',
        reason: 'For lovers of uncompromised Arabian heritage, raw leather accords, and intense aged agarwood.',
        image: '/products/sahara-oud.jpg'
      },
      {
        id: 6,
        name: 'Golden Majesty',
        category: 'Oriental Amber',
        price: 4799,
        color: 'Radiant Gold',
        reason: 'Your radiant spirit desires warmth, opulent spices, orange blossom, and smooth sandalwood.',
        image: '/products/golden-majesty.jpg'
      },
      {
        id: 7,
        name: 'Midnight Oasis',
        category: 'Fresh Woody',
        price: 3999,
        color: 'Midnight Blue and Gold',
        reason: 'Your refined taste favors freshness blended with depth—marine accords, bergamot, and rich cedarwood.',
        image: '/products/midnight-oasis.jpg'
      }
    ];

    setRecommendation(targets[moodIdx % targets.length]);
  };

  const handleReset = () => {
    setStep(0);
    setAnswers({});
    setRecommendation(null);
  };

  const handleAddRecommended = async () => {
    if (recommendation) {
      await addToCart(recommendation.id, 1);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />

      <div className="relative bg-[#24150F] border border-[#B58A4F]/40 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl z-10 text-[#F3E5D2]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-[#D8B995]/70 hover:text-[#D4AF37] hover:scale-120 p-1.5 rounded transition-all z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {!recommendation ? (
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#B58A4F] block">
                OUDÉ Olfactory Diagnostics
              </span>
              <h2 className="font-serif text-2xl font-bold mt-1 text-[#F3E5D2]">
                Find Your Signature Scent
              </h2>
              <p className="text-xs text-[#D8B995]/70 mt-1">
                Step {step + 1} of {questions.length} • Tailoring your Arabian fragrance profile
              </p>
              {/* Progress Bar */}
              <div className="w-full bg-[#352014] h-1 rounded-full mt-3 overflow-hidden">
                <div
                  className="bg-[#B58A4F] h-full transition-all duration-300"
                  style={{ width: `${((step + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Current Question */}
            <h3 className="font-serif text-lg font-semibold text-[#F3E5D2] mb-4 text-center">
              {questions[step].title}
            </h3>

            {/* Options List */}
            <div className="space-y-3">
              {questions[step].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelectOption(i)}
                  className="w-full text-left p-4 rounded-xl bg-[#352014]/60 hover:bg-[#352014] border border-[#B58A4F]/20 hover:border-[#D4AF37] hover:scale-[1.01] hover:shadow-lg transition-all duration-200 group flex items-start justify-between cursor-pointer"
                >
                  <div>
                    <p className="font-serif text-base font-semibold text-[#F3E5D2] group-hover:text-[#D4AF37] transition-colors">
                      {opt.label}
                    </p>
                    {opt.desc && (
                      <p className="text-xs text-[#D8B995]/70 mt-0.5 group-hover:text-[#D8B995] transition-colors">{opt.desc}</p>
                    )}
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#B58A4F] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:text-[#D4AF37] transition-all mt-1 flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Result Card */
          <div className="text-center space-y-5 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-[#B58A4F]/20 border border-[#B58A4F] mx-auto flex items-center justify-center text-[#B58A4F]">
              <Sparkles className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#B58A4F] block">
                Your Flawless Scent Match
              </span>
              <h2 className="font-serif text-3xl font-bold text-[#F3E5D2] mt-1">
                {recommendation.name}
              </h2>
              <p className="text-xs font-mono text-[#D8B995]/80 mt-0.5">
                {recommendation.category} • EDP 100ml • {recommendation.color} Flacon
              </p>
            </div>

            <div className="relative max-w-xs mx-auto aspect-square rounded-xl overflow-hidden border border-[#B58A4F]/40 shadow-xl">
              <img
                src={recommendation.image}
                alt={recommendation.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#24150F] via-transparent to-transparent" />
              <div className="absolute bottom-3 inset-x-3 text-center">
                <span className="font-serif text-xl font-bold text-[#B58A4F]">
                  ₹{recommendation.price.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#D8B995]/90 max-w-md mx-auto leading-relaxed bg-[#352014]/70 p-3.5 rounded-lg border border-[#B58A4F]/20">
              "{recommendation.reason}"
            </p>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                onClick={handleAddRecommended}
                className="flex-1 bg-gradient-to-r from-[#B58A4F] to-[#D4AF37] hover:brightness-110 text-[#24150F] py-3 rounded-lg text-xs uppercase tracking-wider font-bold transition-all shadow-lg flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Recommended Fragrance to Bag</span>
              </button>

              <Link
                to={`/product/${recommendation.id}`}
                onClick={onClose}
                className="px-5 py-3 rounded-lg text-xs uppercase tracking-wider font-semibold border border-[#B58A4F]/40 hover:bg-[#352014] text-[#F3E5D2] transition-colors"
              >
                View Full Details
              </Link>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-[#D8B995]/60 hover:text-[#B58A4F] inline-flex items-center space-x-1.5 transition-colors pt-2"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Scent Quiz</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
