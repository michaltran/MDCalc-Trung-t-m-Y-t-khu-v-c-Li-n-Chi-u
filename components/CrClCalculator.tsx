
import React, { useState } from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Calculator } from '../types';

interface CrClCalculatorProps {
  calc: Calculator;
  onBack: () => void;
}

const CrClCalculator: React.FC<CrClCalculatorProps> = ({ calc, onBack }) => {
  const [gender, setGender] = useState<number>(1); // 0: Nam, 1: Nữ
  const [age, setAge] = useState<string>('80');
  const [weight, setWeight] = useState<string>('70');
  const [creatinine, setCreatinine] = useState<string>('170');
  const [crUnit, setCrUnit] = useState<number>(1); // 1: µmol/L
  const [height, setHeight] = useState<string>('165'); 

  const calculateResults = () => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const h = parseFloat(height);
    let cr = parseFloat(creatinine);

    if (isNaN(a) || isNaN(w) || isNaN(cr) || cr === 0) return null;

    // Quy đổi Creatinine sang mg/dL (1 mg/dL = 88.4 µmol/L)
    const crMgDl = crUnit === 1 ? cr / 88.4 : cr;
    
    // Tính BMI (kg/m²)
    const hMeters = h / 100;
    const bmi = h > 0 ? w / (hMeters * hMeters) : 0;

    // 1. Cockcroft-Gault nguyên bản (Actual)
    let resActual = ((140 - a) * w) / (72 * crMgDl);
    if (gender === 1) resActual *= 0.85;

    // 2. Cân nặng lý tưởng (IBW) - Phương trình Devine
    const hInches = h / 2.54;
    let ibw = gender === 0 ? 50 + 2.3 * (hInches - 60) : 45.5 + 2.3 * (hInches - 60);
    let resIBW = ((140 - a) * ibw) / (72 * crMgDl);
    if (gender === 1) resIBW *= 0.85;

    // 3. Cân nặng hiệu chỉnh (ABW)
    const abw = ibw + 0.4 * (w - ibw);
    let resAdj = ((140 - a) * abw) / (72 * crMgDl);
    if (gender === 1) resAdj *= 0.85;

    // Xác định kết quả "Chính" (Primary) để hiển thị trong layout chung (thường là IBW cho bình thường hoặc Adj cho béo phì)
    let primaryScore = resActual;
    if (h > 0) {
      if (bmi < 18.5) primaryScore = resActual;
      else if (bmi < 25) primaryScore = resIBW;
      else primaryScore = resAdj;
    }

    return {
      actual: parseFloat(resActual.toFixed(1)),
      adj: parseFloat(resAdj.toFixed(1)),
      ibw: parseFloat(resIBW.toFixed(1)),
      primary: parseFloat(primaryScore.toFixed(1)),
      abwValue: Math.round(abw * 10) / 10,
      bmiValue: parseFloat(bmi.toFixed(1)),
      isVeryLow: resActual < 30 || primaryScore < 30
    };
  };

  const results = calculateResults();

  const OptionBtn = ({ label, value, current, onClick }: any) => (
    <button
      onClick={() => onClick(value)}
      className={`flex-1 py-3 px-4 text-[11px] font-black border-r last:border-r-0 transition-all uppercase tracking-tighter
        ${current === value ? `bg-[#1261A6] text-white` : 'bg-white text-gray-400 hover:bg-gray-50'}`}
    >
      {label}
    </button>
  );

  return (
    <CalculatorLayout 
      calc={calc} 
      onBack={onBack} 
      result={{
        score: results?.primary || 0,
        interpretation: results?.primary ? (results.primary < 30 ? "Suy thận nặng" : "Chức năng ổn định") : "Chờ nhập liệu",
        color: results?.primary && results.primary < 30 ? "bg-[#C53030]" : "bg-[#1261A6]"
      }}
      pointBreakdown={results ? [
        { label: 'BMI', points: results.bmiValue, maxPoints: 40 },
        { label: 'CrCl Chính', points: results.primary, maxPoints: 120 }
      ] : []}
    >
      <div className="space-y-0 text-sm">
        {/* Sex */}
        <div className="flex border-b border-gray-100 py-3.5 items-center">
          <div className="w-1/3 font-black text-[#1261A6] text-[10px] uppercase tracking-widest">Giới tính</div>
          <div className="w-2/3 flex border border-gray-300 rounded overflow-hidden">
            <OptionBtn label="Nữ" value={1} current={gender} onClick={setGender} />
            <OptionBtn label="Nam" value={0} current={gender} onClick={setGender} />
          </div>
        </div>

        {/* Age */}
        <div className="flex border-b border-gray-100 py-3.5 items-center">
          <div className="w-1/3 font-black text-[#1261A6] text-[10px] uppercase tracking-widest">Tuổi</div>
          <div className="w-2/3 flex border border-gray-300 rounded overflow-hidden">
            <input type="number" value={age} onChange={e => setAge(e.target.value)} className="flex-1 px-3 py-2 outline-none font-black text-gray-700 text-sm" />
            <div className="bg-gray-50 px-3 py-2 text-[9px] text-gray-400 font-black border-l border-gray-300 min-w-[80px] flex items-center justify-center uppercase">tuổi</div>
          </div>
        </div>

        {/* Weight */}
        <div className="flex border-b border-gray-100 py-3.5 items-center">
          <div className="w-1/3 font-black text-[#1261A6] text-[10px] uppercase tracking-widest">Cân nặng</div>
          <div className="w-2/3 flex border border-gray-300 rounded overflow-hidden">
            <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="flex-1 px-3 py-2 outline-none font-black text-gray-700 text-sm" />
            <div className="bg-gray-50 px-3 py-2 text-[9px] text-[#1261A6] font-black border-l border-gray-300 min-w-[80px] flex items-center justify-center uppercase">kg</div>
          </div>
        </div>

        {/* Creatinine */}
        <div className="flex border-b border-gray-100 py-3.5 items-center">
          <div className="w-1/3 font-black text-[#1261A6] text-[10px] uppercase tracking-widest">Creatinine</div>
          <div className="w-2/3 flex border border-gray-300 rounded overflow-hidden">
            <input type="number" value={creatinine} onChange={e => setCreatinine(e.target.value)} className="flex-1 px-3 py-2 outline-none font-black text-gray-700 text-sm" />
            <div className="bg-gray-50 px-3 py-2 text-[9px] text-[#1261A6] font-black border-l border-gray-300 min-w-[100px] flex items-center justify-center uppercase">
              {crUnit === 1 ? 'µmol/L' : 'mg/dL'}
            </div>
          </div>
        </div>

        {/* Height */}
        <div className="flex py-3.5 items-center relative border-b border-gray-100">
          <div className="w-1/3 flex flex-col">
            <span className="font-black text-[#1261A6] text-[10px] uppercase tracking-widest leading-none">Chiều cao</span>
            <span className="text-[8px] text-gray-400 font-bold uppercase mt-1">Bắt buộc tính IBW/ABW</span>
          </div>
          <div className="w-2/3 flex flex-col">
            <div className="flex border border-gray-300 rounded overflow-hidden">
              <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="flex-1 px-3 py-2 outline-none font-black text-gray-700 text-sm" />
              <div className="bg-gray-50 px-3 py-2 text-[9px] text-[#1261A6] font-black border-l border-gray-300 min-w-[80px] flex items-center justify-center uppercase">cm</div>
            </div>
          </div>
        </div>
      </div>

      {/* KHUNG KẾT QUẢ MÔ PHỎNG MỐC 100% MD-CALC */}
      {results && (
        <div className="mt-8 bg-[#006e51] rounded shadow-2xl overflow-hidden text-white border border-[#005e45] animate-fade-in">
          <div className="flex flex-col md:flex-row min-h-[220px]">
            {/* Cột 1: Original Cockcroft-Gault */}
            <div className="flex-1 p-6 md:border-r border-white/10 flex flex-col">
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-5xl font-black tracking-tighter">{results.actual}</span>
                <span className="text-sm font-bold opacity-70">mL/min</span>
              </div>
              <p className="text-[12px] font-bold leading-tight opacity-90 mt-2">
                Độ thanh thải Creatinine,<br />Cockcroft-Gault nguyên bản
              </p>
            </div>

            {/* Cột 2: Modified for Overweight */}
            <div className="flex-1 p-6 md:border-r border-white/10 flex flex-col bg-[#005e45]/30">
              <div className="flex items-baseline gap-1.5 mb-2">
                <span className="text-5xl font-black tracking-tighter">{results.adj}</span>
                <span className="text-sm font-bold opacity-70">mL/min</span>
              </div>
              <p className="text-[12px] font-bold leading-tight opacity-90 mt-2">
                Độ thanh thải Creatinine hiệu chỉnh cho BN thừa cân, sử dụng cân nặng hiệu chỉnh {results.abwValue} kg.
              </p>
            </div>

            {/* Cột 3: Range (IBW to Adjusted) */}
            <div className="flex-1 p-6 flex flex-col relative">
              <div className="flex items-baseline gap-1.5 mb-1">
                <span className="text-3xl md:text-4xl font-black tracking-tighter">
                  {results.ibw < results.adj ? `${results.ibw}-${results.adj}` : `${results.adj}-${results.ibw}`}
                </span>
              </div>
              <div className="text-sm font-bold opacity-70 mb-3">mL/min</div>
              <p className="text-[11px] font-medium leading-snug opacity-80 italic">
                Lưu ý: Dải kết quả này sử dụng IBW và cân nặng hiệu chỉnh. Hiện vẫn còn tranh luận về việc nên sử dụng loại cân nặng nào.
              </p>

              {/* Nút bấm bên trong khung xanh */}
              <div className="mt-auto flex flex-col sm:flex-row gap-2 pt-6">
                <button className="flex-1 bg-[#1ab394] hover:bg-[#17a084] text-white py-2 px-3 rounded text-[11px] font-black uppercase flex items-center justify-center gap-2 transition-colors shadow-sm">
                  Sao chép kết quả
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"></path><path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z"></path></svg>
                </button>
                <button className="flex-1 bg-[#1ab394] hover:bg-[#17a084] text-white py-2 px-3 rounded text-[11px] font-black uppercase flex items-center justify-center gap-1 transition-colors shadow-sm">
                  Bước tiếp theo
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M13 5l7 7-7 7"></path></svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </CalculatorLayout>
  );
};

export default CrClCalculator;
