
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
      if (input.type === 'number' && input.defaultValue !== undefined) {
        defaults[input.id] = input.defaultValue;
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

  const renderSegmentedControl = (input: CalculatorInput) => {
    const options = input.type === 'boolean' 
      ? [{ label: 'Không', value: 0, displayValue: '0' }, { label: 'Có', value: 1, displayValue: '+1' }]
      : input.options || [];

    const finalOptions = options.map(opt => {
      if (input.id === 'stroke' && opt.value === 1) return { ...opt, displayValue: '+2' };
      return opt;
    });

    return (
      <div className="flex w-full bg-[#f1f3f4] rounded-md p-1 border border-[#e0e4e7]">
        {finalOptions.map((opt) => (
          <button
            key={opt.label}
            onClick={() => updateValue(input.id, opt.value)}
            className={`flex-1 flex justify-center items-center py-2 px-4 rounded transition-all text-sm font-semibold
              ${values[input.id] === opt.value 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-[#5f6368] hover:bg-[#e8eaed]'}`}
          >
            <span className="mr-2">{opt.label}</span>
            <span className={`text-[11px] opacity-70 ${values[input.id] === opt.value ? 'text-white' : 'text-gray-400'}`}>
              {opt.displayValue || (opt.value > 0 ? `+${opt.value}` : '0')}
            </span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-[#f8f9fa] min-h-screen">
      <button 
        onClick={onBack}
        className="mb-6 flex items-center text-blue-600 font-bold hover:underline"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
        QUAY LẠI DANH SÁCH
      </button>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="flex justify-between items-start">
             <div>
                <h1 className="text-3xl font-bold text-[#3c4043] mb-2">{calc.name}</h1>
                <p className="text-[#5f6368] text-sm">{calc.description}</p>
             </div>
             <div className="flex gap-4 text-[#5f6368] text-sm">
                <button className="flex items-center hover:text-blue-600"><span className="mr-1">☆</span> Lưu</button>
                <button className="flex items-center hover:text-blue-600"><span className="mr-1">⎋</span> Chia sẻ</button>
             </div>
          </div>

          <div className="bg-[#f1f3f4] rounded-lg border border-[#e0e4e7] overflow-hidden">
            <div className="flex border-b border-[#e0e4e7]">
              <button 
                onClick={() => setActiveTab('when')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-r border-[#e0e4e7] ${activeTab === 'when' ? 'bg-white text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Khi nào dùng
              </button>
              <button 
                onClick={() => setActiveTab('pearls')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors border-r border-[#e0e4e7] ${activeTab === 'pearls' ? 'bg-white text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Lưu ý/Cạm bẫy
              </button>
              <button 
                onClick={() => setActiveTab('why')}
                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider transition-colors ${activeTab === 'why' ? 'bg-white text-blue-600' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                Tại sao dùng
              </button>
            </div>
            <div className="p-4 bg-white text-sm text-[#3c4043] leading-relaxed">
               {activeTab === 'when' && (calc.whenToUse || "Sử dụng trong đánh giá lâm sàng thường quy.")}
               {activeTab === 'pearls' && (calc.pearls || "Kết quả phải được đối chiếu với tình trạng lâm sàng thực tế.")}
               {activeTab === 'why' && (calc.whyUse || "Dựa trên các nghiên cứu và bằng chứng y học hiện hành.")}
            </div>
          </div>

          <div className="bg-white border border-[#e0e4e7] rounded-lg overflow-hidden">
            <table className="w-full">
              <tbody>
                {calc.inputs.map((input, idx) => (
                  <tr key={input.id} className={`${idx !== calc.inputs.length - 1 ? 'border-b border-[#f1f3f4]' : ''}`}>
                    <td className="p-4 w-1/3">
                      <div className="flex flex-col">
                        <span className="font-semibold text-[#3c4043] text-sm">{input.label}</span>
                        {input.helpText && <span className="text-xs text-gray-400 mt-1">{input.helpText}</span>}
                      </div>
                    </td>
                    <td className="p-4 w-2/3">
                      {input.type === 'number' ? (
                        <div className="flex items-center">
                          <input 
                            type="number" 
                            className="border border-[#e0e4e7] rounded p-2 text-sm w-full focus:ring-1 focus:ring-blue-500 outline-none"
                            value={values[input.id] ?? ''}
                            onChange={(e) => updateValue(input.id, parseFloat(e.target.value))}
                          />
                          {input.unit && <span className="ml-2 text-xs text-gray-500">{input.unit}</span>}
                        </div>
                      ) : renderSegmentedControl(input)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className={`${result.color} rounded-lg p-6 text-white shadow-lg`}>
            <div className="flex items-baseline mb-2">
              <span className="text-4xl font-bold mr-2">{result.score}</span>
              <span className="text-xl font-medium opacity-90">điểm</span>
            </div>
            <p className="text-lg font-bold mb-4">{result.interpretation}</p>
            {result.details && <p className="text-sm opacity-90 border-t border-white/20 pt-4 mb-6">{result.details}</p>}
            
            <div className="flex flex-wrap gap-3">
               <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded font-bold text-sm flex items-center transition-colors">
                 Sao chép <span className="ml-2">⎙</span>
               </button>
               <button className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded font-bold text-sm flex items-center transition-colors">
                 Bước tiếp theo <span className="ml-2">⋙</span>
               </button>
            </div>
          </div>

          <button
            onClick={async () => {
              setLoadingAi(true);
              const analysis = await getClinicalContext(calc.name, result.interpretation, result.score);
              setAiAnalysis(analysis);
              setLoadingAi(false);
            }}
            className="w-full py-4 bg-blue-50 border border-blue-200 text-blue-700 font-bold rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center"
          >
            {loadingAi ? 'Đang phân tích AI...' : 'Tư vấn Chuyên sâu từ AI'}
          </button>

          {aiAnalysis && (
            <div className="bg-white border border-blue-100 rounded-lg p-6 prose prose-sm max-w-none shadow-sm">
              <h3 className="text-blue-800 font-bold mb-2 italic underline text-lg">Phân tích từ Bác sĩ AI (Đạt Đạt AI)</h3>
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">{aiAnalysis}</div>
            </div>
          )}

          <div className="pt-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest">Tài liệu tham khảo</h3>
            <div className="bg-white border border-[#e0e4e7] rounded-lg p-6 text-sm text-[#3c4043] leading-relaxed italic">
              {calc.evidence || "Thông tin đang được cập nhật từ các nguồn uy tín."}
            </div>
          </div>
        </div>

        <aside className="w-full lg:w-80 space-y-6">
          {calc.creator && (
            <div className="bg-white border border-[#e0e4e7] rounded-lg overflow-hidden">
               <div className="bg-[#f1f3f4] p-3 text-xs font-bold uppercase tracking-wider text-gray-600 border-b border-[#e0e4e7]">
                 Tác giả
               </div>
               <div className="p-4 flex gap-4 items-center">
                  <img src={calc.creator.image} className="w-16 h-16 rounded bg-gray-100" alt={calc.creator.name} />
                  <div>
                    <h4 className="font-bold text-[#3c4043] text-sm flex items-center">
                      {calc.creator.name} <span className="ml-1 text-blue-500">✔</span>
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1 leading-snug">{calc.creator.title}</p>
                  </div>
               </div>
            </div>
          )}

          <div className="bg-blue-900 rounded-lg overflow-hidden">
             <div className="p-3 text-xs font-bold uppercase tracking-wider text-white bg-blue-950">
               Cùng chuyên mục
             </div>
             <div className="p-4 space-y-4">
                <ul className="space-y-4">
                   {calc.relatedIds?.map(id => {
                      const related = CALCULATORS.find(c => c.id === id);
                      if (!related) return null;
                      return (
                        <li key={id} className="group">
                           <button 
                            onClick={() => onNavigateToCalc?.(id)}
                            className="text-left"
                           >
                             <div className="text-sm font-bold text-blue-300 group-hover:underline">{related.name}</div>
                             <div className="text-[11px] text-[#b8c5d1] mt-1 leading-snug line-clamp-2">{related.description}</div>
                           </button>
                        </li>
                      );
                   })}
                </ul>
             </div>
          </div>

          <div className="bg-[#f1f3f4] rounded-lg p-4 border border-[#e0e4e7]">
             <h5 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Người đóng góp</h5>
             <ul className="text-xs text-[#3c4043] space-y-2 font-semibold">
                <li>• Đạt Đạt (Designer & Translator)</li>
                <li>• TTYT KV Liên Chiểu</li>
             </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CalculatorView;
