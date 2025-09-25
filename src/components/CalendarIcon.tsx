import React from 'react';
import { Clock } from 'lucide-react';

const CalendarIcon: React.FC = () => {
  return (
    <div className="flex items-center justify-center h-full">
      <div className="relative">
        {/* Calendar */}
        <div className="w-24 h-24 rounded-lg bg-primary-light border-4 border-primary flex flex-col">
          {/* Calendar Top */}
          <div className="h-6 bg-primary flex justify-center items-center">
            <div className="flex space-x-1">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-2 h-3 bg-primary-light rounded-b-sm"></div>
              ))}
            </div>
          </div>
          
          {/* Calendar Body */}
          <div className="flex-1 grid grid-cols-3 grid-rows-2 gap-1 p-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-primary rounded-sm"></div>
            ))}
          </div>
        </div>
        
        {/* Clock */}
        <div className="absolute -bottom-2 -right-4">
          <div className="w-14 h-14 rounded-full bg-primary border-2 border-primary-light flex items-center justify-center">
            <Clock size={20} className="text-secondary-dark" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarIcon;