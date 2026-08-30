import React, { useState } from 'react';
import { Heart, Coffee, ExternalLink, X, DollarSign } from 'lucide-react';

interface TipModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TipModal({ isOpen, onClose }: TipModalProps) {
  const [selectedAmount, setSelectedAmount] = useState<number>(5);

  if (!isOpen) return null;

  // Replace with your actual payment/tipping links
  const buyMeACoffeeUrl = `https://www.buymeacoffee.com/yourusername?amount=${selectedAmount}`;
  const paypalUrl = `https://paypal.me/yourusername/${selectedAmount}`;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#0b0f17] border border-[#1e293b] rounded-xl p-5 w-full max-w-sm space-y-4 relative shadow-2xl text-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[#64748b] hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex justify-center">
          <div className="p-3 bg-[#f59e0b]/10 text-[#f59e0b] rounded-full">
            <Heart className="w-6 h-6 fill-[#f59e0b]" />
          </div>
        </div>

        <div>
          <h3 className="text-sm font-black text-white uppercase tracking-wider">
            Support the Developer
          </h3>
          <p className="text-[10px] text-[#94a3b8] mt-1">
            If this analytics tool is helping you manage your table bankroll, consider sending a quick tip!
          </p>
        </div>

        {/* Tip Preset Buttons */}
        <div className="flex justify-center gap-2">
          {[2, 5, 10, 25].map((amount) => (
            <button
              key={amount}
              onClick={() => setSelectedAmount(amount)}
              className={`px-3 py-2 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                selectedAmount === amount
                  ? 'bg-[#f59e0b] text-[#0b0f17] scale-105'
                  : 'bg-[#1e293b] text-[#cbd5e1] hover:bg-[#334155]'
              }`}
            >
              ${amount}
            </button>
          ))}
        </div>

        {/* Action Links */}
        <div className="space-y-2 pt-2">
          <a
            href={buyMeACoffeeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-[#ffdd00] text-[#000000] font-black rounded-lg text-xs flex items-center justify-center gap-2 hover:opacity-90 cursor-pointer"
          >
            <Coffee className="w-4 h-4" /> Tip ${selectedAmount} via BuyMeACoffee
          </a>

          <a
            href={paypalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2.5 bg-[#0070ba] text-white font-bold rounded-lg text-xs flex items-center justify-center gap-2 hover:bg-[#005ea6] cursor-pointer"
          >
            <DollarSign className="w-4 h-4" /> Send ${selectedAmount} via PayPal
          </a>
        </div>
      </div>
    </div>
  );
}