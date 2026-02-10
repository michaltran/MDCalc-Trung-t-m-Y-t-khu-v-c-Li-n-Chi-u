
import React, { useState } from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Calculator } from '../types';

interface CKDEPICalculatorProps {
  calc: Calculator;
  onBack: () => void;
}

type EquationType = 
  | '2021_cr' 
  | '2021_cr_cys' 
  | '2009_cr' 
  | '2012_cys' 
  | '2012_cr_cys';

const CKDEPICalculator: React.FC<CKDEPICalculatorProps> = ({ calc, onBack }) => {
  const [equation, setEquation] = useState<EquationType>('2021_cr');
  const [gender, setGender] = useState<number>(1); // 1: Nữ, 0: Nam
  const [age, setAge] = useState<string>('60');
  const [creatinine, setCreatinine] = useState<string>('80');
  const [crUnit, setCrUnit] = useState<number>(1); // 1: µmol/L, 0: mg/dL
  const [cystatin, setCystatin] = useState<string>('0.8');
  const [isBlack, setIsBlack] = useState<number>(0); // 0: Không, 1: Có (chỉ dùng cho 2009)

  const calculateResult = () => {
    const a = parseFloat(age);
    let cr = parseFloat(creatinine);
    const cys = parseFloat(cystatin);

    if (isNaN(a)) return null;
    
    // Kiểm tra tính hợp lệ của input dựa trên phương trình
    const needsCr = equation.includes('cr');
    const needsCys = equation.includes('cys');
    if (needsCr && (isNaN(cr) || cr === 0)) return null;
    if (needsCys && (isNaN(cys) || cys === 0)) return null;

    const crMgDl = crUnit === 1 ? cr / 88.4 : cr;
    let egfr = 0;
    let formulaName = "";

    // Hằng số giới tính chung cho hầu hết các phiên bản
    const kappa = gender === 1 ? 0.7 : 0.9;
    const genderConstCr = gender === 1 ? 1.012 : 1.0;

    switch (equation) {
      case '2021_cr': {
        const alpha = gender === 1 ? -0.241 : -0.302;
        egfr = 142 * Math.pow(Math.min(crMgDl / kappa, 1), alpha) * Math.pow(Math.max(crMgDl / kappa, 1), -1.200) * Math.pow(0.9938, a) * genderConstCr;
        formulaName = "2021 CKD-EPI Creatinine";
        break;
      }
      case '2021_cr_cys': {
        const alpha = gender === 1 ? -0.219 : -0.144;
        const genderConstCombined = gender === 1 ? 0.963 : 1.0;
        egfr = 135 * Math.pow(Math.min(crMgDl / kappa, 1), alpha) * Math.pow(Math.max(crMgDl / kappa, 1), -0.544) * 
               Math.pow(Math.min(cys / 0.8, 1), -0.323) * Math.pow(Math.max(cys / 0.8, 1), -0.778) * 
               Math.pow(0.9961, a) * genderConstCombined;
        formulaName = "2021 CKD-EPI Creatinine-Cystatin C";
        break;
      }
      case '2009_cr': {
        const alpha = gender === 1 ? -0.329 : -0.411;
        const genderConst2009 = gender === 1 ? 1.018 : 1.0;
        const raceConst = isBlack === 1 ? 1.159 : 1.0;
        egfr = 141 * Math.pow(Math.min(crMgDl / kappa, 1), alpha) * Math.pow(Math.max(crMgDl / kappa, 1), -1.209) * Math.pow(0.993, a) * genderConst2009 * raceConst;
        formulaName = "2009 CKD-EPI Creatinine";
        break;
      }
      case '2012_cys': {
        const genderConstCys = gender === 1 ? 0.932 : 1.0;
        egfr = 133 * Math.pow(Math.min(cys / 0.8, 1), -0.499) * Math.pow(Math.max(cys / 0.8, 1), -1.328) * Math.pow(0.996, a) * genderConstCys;
        formulaName = "2012 CKD-EPI Cystatin C";
        break;
      }
      case '2012_cr_cys': {
        const alpha = gender === 1 ? -0.248 : -0.207;
        const genderConstCombined2012 = gender === 1 ? 0.969 : 1.0;
        egfr = 135 * Math.pow(Math.min(crMgDl / kappa, 1), alpha) * Math.pow(Math.max(crMgDl / kappa, 1), -0.601) * 
               Math.pow(Math.min(cys / 0.8, 1), -0.375) * Math.pow(Math.max(cys / 0.8, 1), -0.711) * 
               Math.pow(0.995, a) * genderConstCombined2012;
        formulaName = "2012 CKD-EPI Creatinine-Cystatin C";
        break;
      }
    }

    let stage = "";
    let color = "bg-[#1261A6]";
    if (egfr >= 90) { stage = "G1"; color = "bg-[#1261A6]"; }
    else if (egfr >= 60) { stage = "G2"; color = "bg-[#126DA6]"; }
    else if (egfr >= 45) { stage = "G3a"; color = "bg-orange-400"; }
    else if (egfr >= 30) { stage = "G3b"; color = "bg-orange-600"; }
    else if (egfr >= 15) { stage = "G4"; color = "bg-red-600"; }
    else { stage = "G5"; color = "bg-red-800"; }

    return {
      score: Math.round(egfr),
      interpretation: `Giai đoạn ${stage}`,
      details: `Sử dụng: ${formulaName}.`,
      color,
      stage
    };
  };

  const result = calculateResult();

  const EquationBtn = ({ label, type }: { label: string, type: EquationType }) => (
    <button
      onClick={() => setEquation(type)}
      className={`w-full text-left px-4 py-3 text-[10px] sm:text-[11px] font-bold border-b last:border-b-0 transition-all uppercase tracking-tighter leading-tight
        ${equation === type ? 'bg-[#1ab394] text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
    >
      {label}
    </button>
  );

  const OptionBtn = ({ label, value, current, onClick }: any) => (
    <button
      onClick={() => onClick(value)}
      className={`flex-1 py-3 px-4 text-[10px] sm:text-[11px] font-black border-r last:border-r-0 transition-all uppercase tracking-tighter
        ${current === value ? `bg-[#1261A6] text-white` : 'bg-white text-gray-400 hover:bg-gray-50'}`}
    >
      {label}
    </button>
  );

  return (
    <CalculatorLayout 
      calc={calc} 
      onBack={onBack} 
      result={result || { score: 0, interpretation: 'Chờ nhập liệu', color: 'bg-gray-400' }}
    >
      <div className="space-y-0 text-sm">
        {/* Equation Selector - MDCalc Style */}
        <div className="flex border-b border-gray-100 py-4 items-start">
          <div className="w-1/3 pt-1 sm:pt-2 font-black text-[#1261A6] text-[10px] uppercase tracking-widest leading-none">Phương trình</div>
          <div className="w-2/3 border border-gray-200 rounded overflow-hidden shadow-sm">
            <EquationBtn label="2021 CKD-EPI Creatinine" type="2021_cr" />
            <EquationBtn label="2021 CKD-EPI Creatinine-Cystatin C" type="2021_cr_cys" />
            <EquationBtn label="2009 CKD-EPI Creatinine" type="2009_cr" />
            <EquationBtn label="2012 CKD-EPI Cystatin C" type="2012_cys" />
            <EquationBtn label="2012 CKD-EPI Creatinine-Cystatin C" type="2012_cr_cys" />
          </div>
        </div>

        {/* Sex */}
        <div className="flex border-b border-gray-100 py-3.5 items-center">
          <div className="w-1/3 font-black text-[#1261A6] text-[10px] uppercase tracking-widest leading-none">Giới tính</div>
          <div className="w-2/3 flex border border-gray-300 rounded overflow-hidden">
            <OptionBtn label="Nữ" value={1} current={gender} onClick={setGender} />
            <OptionBtn label="Nam" value={0} current={gender} onClick={setGender} />
          </div>
        </div>

        {/* Age */}
        <div className="flex border-b border-gray-100 py-3.5 items-center">
          <div className="w-1/3 font-black text-[#1261A6] text-[10px] uppercase tracking-widest leading-none">Tuổi</div>
          <div className="w-2/3 flex border border-gray-300 rounded overflow-hidden">
            <input type="number" value={age} onChange={e => setAge(e.target.value)} className="flex-1 px-3 py-2 outline-none font-black text-gray-700 text-sm" />
            <div className="bg-gray-50 px-3 py-2 text-[9px] text-gray-400 font-black border-l border-gray-300 min-w-[70px] flex items-center justify-center uppercase tracking-widest">tuổi</div>
          </div>
        </div>

        {/* Creatinine Input (if needed) */}
        {equation.includes('cr') && (
          <div className="flex border-b border-gray-100 py-3.5 items-center">
            <div className="w-1/3 font-black text-[#1261A6] text-[10px] uppercase tracking-widest leading-none">Creatinine HT</div>
            <div className="w-2/3 flex flex-col space-y-2">
              <div className="flex border border-gray-300 rounded overflow-hidden">
                <input type="number" value={creatinine} onChange={e => setCreatinine(e.target.value)} className="flex-1 px-3 py-2 outline-none font-black text-gray-700 text-sm" />
                <div className="bg-gray-50 px-3 py-2 text-[9px] text-[#1261A6] font-black border-l border-gray-300 min-w-[90px] flex items-center justify-center uppercase">
                  {crUnit === 1 ? 'µmol/L' : 'mg/dL'}
                </div>
              </div>
              <div className="flex border border-gray-200 rounded overflow-hidden w-fit shadow-sm">
                <button onClick={() => setCrUnit(1)} className={`px-3 py-1 text-[9px] font-bold ${crUnit === 1 ? 'bg-[#1261A6] text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>µmol/L</button>
                <button onClick={() => setCrUnit(0)} className={`px-3 py-1 text-[9px] font-bold ${crUnit === 0 ? 'bg-[#1261A6] text-white' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>mg/dL</button>
              </div>
            </div>
          </div>
        )}

        {/* Cystatin C Input (if needed) */}
        {equation.includes('cys') && (
          <div className="flex border-b border-gray-100 py-3.5 items-center bg-blue-50/20">
            <div className="w-1/3 font-black text-[#1261A6] text-[10px] uppercase tracking-widest leading-none">Cystatin C HT</div>
            <div className="w-2/3 flex border border-gray-300 rounded overflow-hidden bg-white shadow-sm">
              <input type="number" value={cystatin} onChange={e => setCystatin(e.target.value)} className="flex-1 px-3 py-2 outline-none font-black text-gray-700 text-sm" />
              <div className="bg-gray-50 px-3 py-2 text-[9px] text-[#1261A6] font-black border-l border-gray-300 min-w-[90px] flex items-center justify-center uppercase">mg/L</div>
            </div>
          </div>
        )}

        {/* Race (only for 2009) */}
        {equation === '2009_cr' && (
          <div className="flex border-b border-gray-100 py-3.5 items-center">
            <div className="w-1/3 font-black text-[#1261A6] text-[10px] uppercase tracking-widest leading-none">Chủng tộc (Da đen)</div>
            <div className="w-2/3 flex border border-gray-300 rounded overflow-hidden">
              <OptionBtn label="Không" value={0} current={isBlack} onClick={setIsBlack} />
              <OptionBtn label="Có" value={1} current={isBlack} onClick={setIsBlack} />
            </div>
          </div>
        )}
      </div>

      {result && (
        <div className="mt-8 bg-white border border-gray-200 rounded shadow-lg overflow-hidden animate-fade-in">
           <div className={`p-6 sm:p-8 text-white ${result.color} transition-colors duration-500`}>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl sm:text-6xl font-black tracking-tighter">{result.score}</span>
                <span className="text-sm font-bold opacity-80 uppercase tracking-widest">mL/min/1.73m²</span>
              </div>
              <p className="mt-3 text-2xl font-black uppercase tracking-tight">{result.interpretation}</p>
              <p className="mt-2 text-xs opacity-90 font-medium italic leading-relaxed">{result.details}</p>
           </div>
           
           <div className="p-5 bg-gray-50">
              <div className="grid grid-cols-6 gap-1 h-3 rounded-full overflow-hidden bg-gray-200 mb-4 border border-gray-300">
                 <div className={`h-full ${result.stage === 'G1' ? 'bg-white/70 border-x-2 border-white' : ''} bg-blue-700`}></div>
                 <div className={`h-full ${result.stage === 'G2' ? 'bg-white/70 border-x-2 border-white' : ''} bg-blue-500`}></div>
                 <div className={`h-full ${result.stage === 'G3a' ? 'bg-white/70 border-x-2 border-white' : ''} bg-yellow-400`}></div>
                 <div className={`h-full ${result.stage === 'G3b' ? 'bg-white/70 border-x-2 border-white' : ''} bg-orange-500`}></div>
                 <div className={`h-full ${result.stage === 'G4' ? 'bg-white/70 border-x-2 border-white' : ''} bg-red-600`}></div>
                 <div className={`h-full ${result.stage === 'G5' ? 'bg-white/70 border-x-2 border-white' : ''} bg-red-800`}></div>
              </div>
              <div className="flex justify-between text-[9px] font-black text-gray-500 uppercase tracking-tighter">
                <span className={result.stage === 'G1' ? 'text-blue-700' : ''}>G1 (≥90)</span>
                <span className={result.stage === 'G2' ? 'text-blue-500' : ''}>G2 (60-89)</span>
                <span className={result.stage === 'G3a' ? 'text-yellow-600' : ''}>G3a (45-59)</span>
                <span className={result.stage === 'G3b' ? 'text-orange-600' : ''}>G3b (30-44)</span>
                <span className={result.stage === 'G4' ? 'text-red-600' : ''}>G4 (15-29)</span>
                <span className={result.stage === 'G5' ? 'text-red-800' : ''}>G5 (&lt;15)</span>
              </div>
           </div>
        </div>
      )}
    </CalculatorLayout>
  );
};

export default CKDEPICalculator;
