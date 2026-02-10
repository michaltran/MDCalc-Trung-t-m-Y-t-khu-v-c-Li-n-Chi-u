
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
      className="bg-white border border-gray-100 rounded-2xl p-6 text-left transition-all hover:shadow-xl hover:border-[#1261A6] group shadow-sm active:scale-[0.98]"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-extrabold text-gray-800 group-hover:text-[#1261A6] transition-colors text-lg leading-snug">
          {calc.name}
        </h3>
        <span className="text-[9px] bg-blue-50 text-[#1261A6] px-2.5 py-1.5 rounded-lg uppercase font-black tracking-widest border border-blue-100">
          {calc.specialties[0]}
        </span>
      </div>
      <p className="text-sm text-gray-500 line-clamp-2 font-medium leading-relaxed">
        {calc.description}
      </p>
    </button>
  );
};

export default CalculatorCard;
