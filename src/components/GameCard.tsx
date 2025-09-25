import React from 'react';
import { motion } from 'framer-motion';

interface TeamInfo {
  name: string;
  logo: string;
  odds: number;
}

interface GameCardProps {
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  leagueName: string;
  matchTime: string;
  matchDate: string;
  isLive?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  homeTeam,
  awayTeam,
  leagueName,
  matchTime,
  matchDate,
  isLive = false,
}) => {
  return (
    <motion.div 
      className="card p-4 relative card-hover"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {isLive && (
        <div className="absolute top-2 right-2 bg-error px-2 py-1 rounded-md text-xs font-bold flex items-center">
          <span className="h-2 w-2 bg-white rounded-full mr-1 animate-pulse"></span>
          AO VIVO
        </div>
      )}
      
      <div className="text-xs text-gray-400 mb-2 flex justify-between">
        <span>{leagueName}</span>
        <span>{matchDate} • {matchTime}</span>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 flex-1">
          <img src={homeTeam.logo} alt={homeTeam.name} className="w-8 h-8 object-contain" />
          <span className="font-medium truncate">{homeTeam.name}</span>
        </div>
        <div className="text-center mx-2">
          <span className="text-xs text-gray-400">VS</span>
        </div>
        <div className="flex items-center space-x-2 flex-1 justify-end text-right">
          <span className="font-medium truncate">{awayTeam.name}</span>
          <img src={awayTeam.logo} alt={awayTeam.name} className="w-8 h-8 object-contain" />
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-2 mt-4">
        <button className="bg-secondary-dark hover:bg-secondary text-center py-2 rounded-md text-sm transition-colors">
          1 <span className="font-bold text-primary">{homeTeam.odds.toFixed(2)}</span>
        </button>
        <button className="bg-secondary-dark hover:bg-secondary text-center py-2 rounded-md text-sm transition-colors">
          X <span className="font-bold text-primary">3.25</span>
        </button>
        <button className="bg-secondary-dark hover:bg-secondary text-center py-2 rounded-md text-sm transition-colors">
          2 <span className="font-bold text-primary">{awayTeam.odds.toFixed(2)}</span>
        </button>
      </div>
      
      <button className="text-xs text-primary hover:underline w-full text-center mt-3">
        +15 mercados
      </button>
    </motion.div>
  );
};

export default GameCard;