import React from 'react';
import { Sparkles, AlertCircle, CheckCircle, X } from 'lucide-react';
import { useCart } from '../context/CartContext.jsx';

export default function ToastNotification() {
  const { toastMessage } = useCart();

  if (!toastMessage) return null;

  const isError = toastMessage.type === 'error';

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <div
        className={`px-4 py-3 rounded-lg shadow-2xl border flex items-center space-x-3 text-sm backdrop-blur-md ${
          isError
            ? 'bg-red-950/90 text-red-200 border-red-800/60'
            : 'bg-[#24150F]/95 text-[#F3E5D2] border-[#B58A4F]/60 shadow-gold-glow'
        }`}
      >
        {isError ? (
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
        ) : (
          <Sparkles className="w-5 h-5 text-[#B58A4F] flex-shrink-0" />
        )}
        <span className="font-serif">{toastMessage.message}</span>
      </div>
    </div>
  );
}
