import React from 'react';
import { motion } from 'framer-motion';

interface SportOption {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface SportFilterProps {
  sports: SportOption[];
  selectedSport: string;
  onSelectSport: (sportId: string) => void;
}

const SportFilter: React.FC<SportFilterProps> = ({
  sports,
  selectedSport,
  onSelectSport
}) => {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex space-x-2">
        {sports.map((sport) => (
          <motion.button
            key={sport.id}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              selectedSport === sport.id
                ? 'bg-primary text-secondary-dark font-bold'
                : 'bg-secondary-light hover:bg-secondary text-white'
            }`}
            onClick={() => onSelectSport(sport.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>{sport.icon}</span>
            <span>{sport.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default SportFilter;