
import React from 'react';
import { Calculator } from '../types';

interface CalculatorCardProps {
  calc: Calculator;
  onClick: () => void;
}

const CalculatorCard: React.FC<CalculatorCardProps> = ({ calc, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="bg-white border border-gray-200 rounded-xl p-5 text-left transition-all hover:shadow-md hover:border-blue-400 group"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
          {calc.name}
        </h3>
        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded uppercase font-bold tracking-wider">
          {calc.specialties[0]}
        </span>
      </div>
      <p className="text-sm text-gray-500 line-clamp-2">
        {calc.description}
      </p>
    </button>
  );
};

export default CalculatorCard;
