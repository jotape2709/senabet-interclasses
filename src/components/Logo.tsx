import React from 'react';
import { Square } from 'lucide-react';

const Logo: React.FC = () => {
  return (
    <div className="flex items-center">
      <div className="relative mr-2">
        <Square size={32} fill="#D4AF37" color="#D4AF37" className="transform rotate-12" />
        <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-secondary-dark font-bold text-xl">
          S
        </span>
      </div>
      <span className="text-primary font-heading font-bold text-2xl tracking-wider">SENABET</span>
    </div>
  );
};

export default Logo;