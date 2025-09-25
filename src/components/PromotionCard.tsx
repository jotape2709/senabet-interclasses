import React from 'react';
import { motion } from 'framer-motion';

interface PromotionCardProps {
  title: string;
  highlightText?: string;
  restOfTitle?: string;
  buttonText: string;
  onClick: () => void;
  icon: React.ReactNode;
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  title,
  highlightText,
  restOfTitle,
  buttonText,
  onClick,
  icon
}) => {
  return (
    <motion.div 
      className="card bg-secondary-dark rounded-2xl p-8 relative overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center h-full">
        <div className="mb-6 md:mb-0">
          <h3 className="text-2xl md:text-3xl font-heading font-bold mb-1">
            {title}{' '}
            {highlightText && (
              <span className="text-primary">{highlightText}</span>
            )}
            {restOfTitle}
          </h3>
          <motion.button
            className="btn btn-primary mt-4 md:mt-6 text-base md:text-lg w-full md:w-auto"
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {buttonText}
          </motion.button>
        </div>
        <div className="w-28 h-28 md:w-32 md:h-32 relative">
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default PromotionCard;