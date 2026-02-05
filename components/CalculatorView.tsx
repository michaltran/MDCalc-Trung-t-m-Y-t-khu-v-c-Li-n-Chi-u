
import React, { useState, useEffect } from 'react';
import { Calculator, CalculatorInput } from '../types';
import { getClinicalContext } from '../services/geminiService';
import { CALCULATORS } from '../constants';

interface CalculatorViewProps {
  calc: Calculator;
  onBack: () => void;
  onNavigateToCalc?: (id: string) => void;
}

const CalculatorView: React.FC<CalculatorViewProps> = ({ calc, onBack, onNavigateToCalc }) => {
  const [values, setValues] = useState<Record<string, number>>({});
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [activeTab, setActiveTab] = useState<'when' | 'pearls' | 'why'>('when');

  useEffect(() => {
    const defaults: Record<string, number> = {};
    calc.inputs.forEach(input => {
      if (input.type === 'number') {
        defaults[input.id] = input.defaultValue ?? 0;
      } else if (input.type === 'select' && input.options) {
        defaults[input.id] = input.options[0].value;
      } else {
        defaults[input.id] = 0;
      }
    });
    setValues(defaults);
    setAiAnalysis(null);
    window.scrollTo(0, 0);
  }, [calc]);

  const result = calc.calculate(values);

  const updateValue = (id: string, val: number) => {
    setValues(prev => ({ ...prev, [id]: val }));
  };

  const renderInput = (input: CalculatorInput) => {
    if (input.type === 'number') {
      return (
        <div className="flex items-center space-x-2">
          <input 
            type="number" 
            className="border-2 border-gray-200 rounded-lg p-2.5 text-lg w-full focus:border-blue-500 outline-none transition-all font-semibold"
            value={values[input.id] ?? ''}
            onChange={(e) => updateValue(input.id, parseFloat(e.target.value) || 0)}
          />
          {input.unit && <span className="text-gray-500 font-bold text-sm w-16">{input.unit}</span>}
        </div>
      );
    }

    const options = input.type === 'boolean' 
      ? [{ label: 'Không', value: 0 }, { label: 'Có', value: 1 }]
      : input.options || [];

    return (
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => updateValue(input.id, opt.value)}
            className={`px-4 py-2.5 rounded-lg text-sm font-bold border-2 transition-all flex-1 min-w-[80px]
              ${values[input.id] === opt.value 
                ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}
          >
            {opt.label}
            <span className="ml-1 opacity-50 text-[10px]">
               {opt.displayValue || (opt.value > 0 ? `+${opt.value}` : '')}
            </span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-[#f8fafc] min-h-screen">
      <nav className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center text-blue-600 font-black text-sm uppercase tracking-tighter hover:opacity-80 transition-opacity"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
          DANH SÁCH CÔNG CỤ
        </button>
      </nav>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1 space-y-8">
          <header>
             <h1 className="text-4xl font-black text-gray-900 mb-2 tracking-tight">{calc.name}</h1>
             <p className="text-gray-500 font-medium">{calc.description}</p>
          </header>

          <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm">
            <div className="flex bg-gray-50 border-b-2 border-gray-100">
              <button 
                onClick={() => setActiveTab('when')}
                className={`px-6 py-4 text-xs font-black uppercase tracking-widest border-r-2 border-gray-100 transition-all ${activeTab === 'when' ? 'bg-white text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Chỉ định
              </button>
              <button 
                onClick={() => setActiveTab('pearls')}
                className={`px-6 py-4 text-xs font-black uppercase tracking-widest border-r-2 border-gray-100 transition-all ${activeTab === 'pearls' ? 'bg-white text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Lưu ý
              </button>
              <button 
                onClick={() => setActiveTab('why')}
                className={`px-6 py-4 text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'why' ? 'bg-white text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Cơ sở
              </button>
            </div>
            <div className="p-6 text-gray-700 text-sm leading-relaxed font-medium">
               {activeTab === 'when' && (calc.whenToUse || "Sử dụng để sàng lọc và đánh giá ban đầu trên lâm sàng.")}
               {activeTab === 'pearls' && (calc.pearls || "Kết quả tính toán chỉ mang tính chất tham khảo, không thay thế chẩn đoán của bác sĩ.")}
               {activeTab === 'why' && (calc.whyUse || "Dựa trên các nghiên cứu lâm sàng đã được công bố.")}
            </div>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-3xl shadow-sm p-2">
            <table className="w-full">
              <tbody>
                {calc.inputs.map((input, idx) => (
                  <tr key={input.id} className={`${idx !== calc.inputs.length - 1 ? 'border-b-2 border-gray-50' : ''}`}>
                    <td className="p-5 w-1/2">
                      <label className="font-bold text-gray-900 text-base">{input.label}</label>
                      {input.helpText && <p className="text-xs text-gray-400 mt-1">{input.helpText}</p>}
                    </td>
                    <td className="p-5 w-1/2">
                      {renderInput(input)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`${result.color} rounded-[2rem] p-10 text-white shadow-2xl shadow-blue-200 transition-all`}>
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
               <div className="flex-1">
                  <div className="flex items-baseline mb-4">
                    <span className="text-7xl font-black mr-3">{result.score}</span>
                    <span className="text-2xl font-bold opacity-80 uppercase tracking-widest">Điểm</span>
                  </div>
                  <h2 className="text-3xl font-black leading-tight mb-4">{result.interpretation}</h2>
                  {result.details && <p className="text-white/80 font-semibold border-l-4 border-white/30 pl-4">{result.details}</p>}
               </div>
               
               <div className="flex flex-col gap-3 min-w-[200px]">
                  <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all active:scale-95 flex items-center justify-center">
                    Sao chép KQ <span className="ml-2">📋</span>
                  </button>
                  <button className="bg-white text-blue-800 px-6 py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all hover:bg-gray-100 active:scale-95 flex items-center justify-center shadow-lg">
                    Pháp đồ <span className="ml-2">➔</span>
                  </button>
               </div>
            </div>
          </div>

          <div className="space-y-4">
             <button
               onClick={async () => {
                 setLoadingAi(true);
                 const analysis = await getClinicalContext(calc.name, result.interpretation, result.score);
                 setAiAnalysis(analysis);
                 setLoadingAi(false);
               }}
               className="w-full py-5 bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-black text-lg rounded-2xl hover:shadow-xl transition-all flex items-center justify-center shadow-lg shadow-blue-100 disabled:opacity-50"
               disabled={loadingAi}
             >
               {loadingAi ? (
                 <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    Đang hội chẩn AI...
                 </span>
               ) : (
                 <span className="flex items-center">
                    Tư vấn chuyên sâu Bác sĩ AI ✨
                 </span>
               )}
             </button>

             {aiAnalysis && (
               <div className="bg-white border-2 border-blue-50 rounded-3xl p-8 shadow-sm relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-4">
                    <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-1 rounded uppercase">Clinical AI Advisor</span>
                 </div>
                 <h3 className="text-blue-900 font-black mb-6 text-xl border-b-2 border-blue-50 pb-4">Phân tích từ Đạt Đạt AI Assistant</h3>
                 <div className="text-gray-800 whitespace-pre-line leading-loose font-medium">{aiAnalysis}</div>
               </div>
             )}
          </div>
        </div>

        <aside className="w-full lg:w-96 space-y-8">
          {calc.creator && (
            <div className="bg-white border-2 border-gray-100 rounded-3xl overflow-hidden shadow-sm">
               <div className="bg-gray-50 p-4 text-[10px] font-black uppercase tracking-widest text-gray-400 border-b-2 border-gray-100">
                 Hội đồng chuyên môn
               </div>
               <div className="p-6 flex items-center space-x-5">
                  <img src={calc.creator.image} className="w-20 h-20 rounded-2xl bg-blue-50 object-cover border-2 border-white shadow-sm" alt={calc.creator.name} />
                  <div>
                    <h4 className="font-black text-gray-900 text-lg leading-tight">
                      {calc.creator.name}
                    </h4>
                    <p className="text-xs text-blue-600 font-bold mt-1 uppercase tracking-tighter">{calc.creator.title}</p>
                  </div>
               </div>
            </div>
          )}

          <div className="bg-blue-900 rounded-[2.5rem] overflow-hidden shadow-xl">
             <div className="p-5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-300 bg-blue-950/50">
               Có thể bạn quan tâm
             </div>
             <div className="p-6 space-y-6">
                {calc.relatedIds?.map(id => {
                  const related = CALCULATORS.find(c => c.id === id);
                  if (!related) return null;
                  return (
                    <button 
                      key={id}
                      onClick={() => onNavigateToCalc?.(id)}
                      className="w-full text-left group"
                    >
                      <h4 className="text-white font-black text-sm group-hover:text-blue-300 transition-colors">{related.name}</h4>
                      <p className="text-blue-200/60 text-[11px] mt-1 line-clamp-2 font-medium">{related.description}</p>
                    </button>
                  );
                })}
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CalculatorView;
