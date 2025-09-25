import React from 'react';
import { DollarSign } from 'lucide-react';

const BonusIcon: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        {/* Phone */}
        <div className="absolute -top-4 -left-10 transform rotate-6">
          <div className="w-16 h-24 rounded-xl bg-primary-dark border-4 border-primary flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <span className="text-secondary-dark text-xl">✓</span>
            </div>
          </div>
        </div>
        
        {/* Money Bag */}
        <div className="absolute -bottom-4 -left-12">
          <div className="w-16 h-16 rounded-full bg-primary-dark border-2 border-primary flex items-center justify-center relative">
            <DollarSign size={24} className="text-primary-light" />
            <div className="absolute top-0 w-10 h-4 bg-primary-dark border-2 border-primary rounded-t-full"></div>
          </div>
        </div>
        
        {/* Coins */}
        <div className="absolute bottom-0 -right-2">
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-primary border-2 border-primary-light flex items-center justify-center">
              <DollarSign size={20} className="text-secondary-dark" />
            </div>
            <div className="absolute -top-6 -right-2 w-10 h-10 rounded-full bg-primary border-2 border-primary-light flex items-center justify-center">
              <DollarSign size={16} className="text-secondary-dark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BonusIcon;