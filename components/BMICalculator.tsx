
import React, { useState } from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Calculator } from '../types';

interface BMICalculatorProps {
  calc: Calculator;
  onBack: () => void;
}

const BMICalculator: React.FC<BMICalculatorProps> = ({ calc, onBack }) => {
  const [weight, setWeight] = useState<string>('70');
  const [height, setHeight] = useState<string>('170');
  const [gender, setGender] = useState<number>(0); // 0: Nam, 1: Nữ

  const calculate = () => {
    const w = parseFloat(weight);
    const hCm = parseFloat(height);
    const hM = hCm / 100;

    if (!w || !hCm || hCm === 0) return { score: 0, interpretation: 'Vui lòng nhập số liệu', color: 'bg-gray-400' };

    const bmi = w / (hM * hM);
    const bsa = Math.sqrt((hCm * w) / 3600);

    let interpretation = "";
    let color = "bg-[#1261A6]";
    const genderText = gender === 0 ? "Nam" : "Nữ";
    let details = `Đối tượng: ${genderText}. Diện tích bề mặt cơ thể (BSA): ${bsa.toFixed(2)} m².`;

    if (bmi < 18.5) {
      interpretation = "Nhẹ cân (Underweight)";
      color = "bg-orange-400";
    } else if (bmi < 25) {
      interpretation = "Cân nặng bình thường";
      color = "bg-green-600";
    } else if (bmi < 30) {
      interpretation = "Tiền béo phì (Overweight)";
      color = "bg-orange-500";
    } else if (bmi < 35) {
      interpretation = "Béo phì độ I";
      color = "bg-red-500";
    } else if (bmi < 40) {
      interpretation = "Béo phì độ II";
      color = "bg-red-600";
    } else {
      interpretation = "Béo phì độ III";
      color = "bg-red-800";
    }

    return { 
      score: parseFloat(bmi.toFixed(1)), 
      interpretation, 
      details, 
      color 
    };
  };

  const result = calculate();

  const OptionBtn = ({ label, value, current, onClick }: { label: string, value: number, current: number, onClick: (v: number) => void }) => (
    <button
      onClick={() => onClick(value)}
      className={`flex-1 py-3 px-4 text-sm font-bold border-r last:border-r-0 transition-all
        ${current === value ? 'bg-[#1261A6] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
    >
      {label}
    </button>
  );

  return (
    <CalculatorLayout 
      calc={calc} 
      onBack={onBack} 
      result={result}
      pointBreakdown={[
        { label: 'BMI', points: result.score, maxPoints: 50 },
      ]}
    >
      <div className="space-y-4 sm:space-y-6">
        {/* Giới tính */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 items-center py-4 border-b border-gray-100">
          <div className="w-full">
            <div className="text-sm font-extrabold text-gray-800 uppercase tracking-tight">Giới tính</div>
            <div className="text-[10px] text-gray-400 font-medium">Phân tích bối cảnh lâm sàng</div>
          </div>
          <div className="w-full flex border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <OptionBtn label="Nam" value={0} current={gender} onClick={setGender} />
            <OptionBtn label="Nữ" value={1} current={gender} onClick={setGender} />
          </div>
        </div>

        {/* Cân nặng */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 items-center py-4 border-b border-gray-100">
          <div className="w-full">
            <div className="text-sm font-extrabold text-gray-800 uppercase tracking-tight">Cân nặng</div>
            <div className="text-[10px] text-gray-400 font-medium">Đơn vị: kilôgam (kg)</div>
          </div>
          <div className="w-full relative">
            <input 
              type="number" 
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:border-[#1261A6] outline-none transition-all text-lg"
              placeholder="0"
            />
            <span className="absolute right-4 top-4 text-xs font-black text-gray-300">KG</span>
          </div>
        </div>

        {/* Chiều cao */}
        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-4 items-center py-4 border-b border-gray-100 last:border-0">
          <div className="w-full">
            <div className="text-sm font-extrabold text-gray-800 uppercase tracking-tight">Chiều cao</div>
            <div className="text-[10px] text-gray-400 font-medium">Đơn vị: xentimét (cm)</div>
          </div>
          <div className="w-full relative">
            <input 
              type="number" 
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:border-[#1261A6] outline-none transition-all text-lg"
              placeholder="0"
            />
            <span className="absolute right-4 top-4 text-xs font-black text-gray-300">CM</span>
          </div>
        </div>
      </div>
    </CalculatorLayout>
  );
};

export default BMICalculator;
