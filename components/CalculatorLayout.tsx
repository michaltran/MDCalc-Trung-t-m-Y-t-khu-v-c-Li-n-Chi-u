
import React, { useState } from 'react';
import { Calculator } from '../types';
import { getClinicalContext } from '../services/geminiService';
import { CALCULATORS } from '../constants';

interface PointBreakdown {
  label: string;
  points: number;
  maxPoints: number;
}

interface CalculatorLayoutProps {
  calc: Calculator;
  onBack: () => void;
  children: React.ReactNode; 
  result: {
    score: number | string;
    interpretation: string;
    details?: string;
    color: string;
  };
  pointBreakdown?: PointBreakdown[]; 
}

const CalculatorLayout: React.FC<CalculatorLayoutProps> = ({ calc, onBack, children, result, pointBreakdown }) => {
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [upperTab, setUpperTab] = useState<'when' | 'pearls' | 'why'>('when');
  const [lowerTab, setLowerTab] = useState<'next' | 'evidence' | 'creator'>('next');

  const handleAiConsult = async () => {
    setLoadingAi(true);
    const analysis = await getClinicalContext(calc.name, result.interpretation, typeof result.score === 'number' ? result.score : 0);
    setAiAnalysis(analysis);
    setLoadingAi(false);
  };

  const relatedCalcs = calc.relatedIds?.map(id => CALCULATORS.find(c => c.id === id)).filter(Boolean) || [];
  const isBMICalc = calc.id === 'bmi';

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 bg-[#f3f4f6] min-h-screen font-sans">
      <nav className="mb-4">
        <button onClick={onBack} className="text-[#1261A6] font-bold text-xs sm:text-sm flex items-center hover:underline uppercase tracking-tighter">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
          Quay lại danh sách
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        <div className="lg:col-span-8 space-y-4 sm:space-y-6">
          <header>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1261A6] leading-tight mb-2 uppercase">{calc.name}</h1>
            <p className="text-gray-600 text-sm sm:text-lg">{calc.description}</p>
          </header>

          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            <div className="flex bg-gray-50 border-b border-gray-200 overflow-x-auto scrollbar-hide">
              {[
                {id: 'when', label: 'CHỈ ĐỊNH'},
                {id: 'pearls', label: 'LƯU Ý'},
                {id: 'why', label: 'TẠI SAO DÙNG'}
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setUpperTab(t.id as any)}
                  className={`flex-1 px-4 sm:px-6 py-3 text-xs sm:text-sm font-bold border-r border-gray-200 whitespace-nowrap
                    ${upperTab === t.id ? 'bg-[#1261A6] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="p-4 sm:p-6 bg-[#f8fafc] text-[#4a4a4a] text-xs sm:text-sm leading-relaxed min-h-[100px]">
              {upperTab === 'when' && <ul className="list-disc pl-5 space-y-1 sm:space-y-2">{calc.whenToUse?.map((p, i) => <li key={i}>{p}</li>)}</ul>}
              {upperTab === 'pearls' && <ul className="list-disc pl-5 space-y-1 sm:space-y-2 font-medium">{calc.pearls?.map((p, i) => <li key={i}>{p}</li>)}</ul>}
              {upperTab === 'why' && <p className="font-medium whitespace-pre-line">{calc.whyUse}</p>}
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded border border-gray-200 shadow-sm overflow-x-hidden">
            {children}
          </div>

          {/* Chỉ hiển thị dải giải thích điểm số nếu không phải CrCl (vì CrCl có khung kết quả riêng ở trên) */}
          {calc.id !== 'crcl' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`${result.color} p-6 sm:p-8 text-white rounded shadow-lg flex flex-col justify-center transition-colors duration-500`}>
                <div>
                  <div className="text-4xl sm:text-5xl font-black mb-1 sm:mb-2">{result.score} <span className="text-base sm:text-xl font-normal opacity-80">{isBMICalc ? 'kg/m²' : 'điểm'}</span></div>
                  <div className="text-xl sm:text-2xl font-bold leading-tight">{result.interpretation}</div>
                  {result.details && <div className="mt-2 text-white/90 italic text-xs sm:text-sm">{result.details}</div>}
                </div>
              </div>

              {pointBreakdown && (
                <div className="bg-white p-5 sm:p-6 rounded border border-gray-200 shadow-sm flex flex-col justify-center">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Phân bổ chỉ số</h4>
                  <div className="space-y-3">
                    {pointBreakdown.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-[11px] font-bold text-gray-600">
                          <span className="truncate pr-2">{item.label}</span>
                          <span className="shrink-0 text-[#1261A6]">{item.points}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div className="bg-[#1261A6] h-full transition-all duration-700" style={{ width: `${Math.min((item.points / item.maxPoints) * 100, 100)}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button onClick={handleAiConsult} disabled={loadingAi} className="w-full py-3 sm:py-4 bg-[#1261A6] text-white font-bold rounded hover:bg-[#126DA6] transition-all flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 text-sm sm:text-base uppercase tracking-tighter">
            {loadingAi ? 'AI ĐANG PHÂN TÍCH...' : 'NHẬN TƯ VẤN AI LÂM SÀNG'}
          </button>
          
          {aiAnalysis && (
            <div className="p-4 sm:p-6 bg-blue-50 border border-blue-100 rounded text-gray-800 leading-relaxed shadow-sm animate-fade-in">
               <div className="text-xs sm:text-sm font-black text-[#1261A6] uppercase mb-2">CỐ VẤN AI LÂM SÀNG</div>
               <div className="whitespace-pre-line text-xs sm:text-sm font-medium">{aiAnalysis}</div>
            </div>
          )}

          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            <div className="flex bg-gray-50 border-b border-gray-200 overflow-x-auto scrollbar-hide">
              {[
                {id: 'next', label: 'HƯỚNG XỬ TRÍ'},
                {id: 'evidence', label: 'BẰNG CHỨNG'},
                {id: 'creator', label: 'TÁC GIẢ'}
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setLowerTab(t.id as any)}
                  className={`flex-1 px-4 py-3 text-xs sm:text-sm font-bold border-r border-gray-200 whitespace-nowrap
                    ${lowerTab === t.id ? 'bg-[#1261A6] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="p-6 sm:p-8">
              {lowerTab === 'next' && (
                <div className="space-y-6">
                  {calc.nextSteps?.advice && (
                    <section>
                      <h4 className="font-black text-[#1261A6] uppercase text-[10px] tracking-widest mb-3">LỜI KHUYÊN LÂM SÀNG</h4>
                      <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm font-medium">{calc.nextSteps.advice.map((a, i) => <li key={i}>{a}</li>)}</ul>
                    </section>
                  )}
                  {calc.nextSteps?.management?.map((m, i) => (
                    <section key={i} className="border-t border-gray-100 pt-4 first:border-t-0 first:pt-0">
                      <h4 className="font-black text-[#1261A6] uppercase text-[10px] tracking-widest mb-3">{m.title}</h4>
                      <p className="text-xs sm:text-sm font-medium mb-3">{m.content}</p>
                      <ul className="list-disc pl-5 space-y-2 text-xs sm:text-sm font-medium">{m.bullets?.map((b, bi) => <li key={bi}>{b}</li>)}</ul>
                    </section>
                  ))}
                </div>
              )}
              {lowerTab === 'evidence' && (
                <div className="space-y-10">
                  <section>
                    <h3 className="text-[#1261A6] font-black text-sm uppercase mb-4 tracking-tight">CÔNG THỨC (FORMULA)</h3>
                    <div className="space-y-4">
                      {calc.evidenceContent?.formula?.map((f, i) => (
                        <div key={i} className="bg-white p-5 border border-gray-200 rounded shadow-sm">
                          <p className="text-[13px] font-black text-gray-800 mb-2">{f.criteria}</p>
                          {f.points && <p className="text-sm font-medium text-[#1261A6] italic">{f.points}</p>}
                          {f.subCriteria && (
                            <div className="mt-4 pl-4 border-l-2 border-gray-100 space-y-3">
                              {f.subCriteria.map((s, si) => (
                                <div key={si} className="flex justify-between items-center text-[12px]">
                                  <span className="text-gray-500 font-medium">{s.label}</span>
                                  <span className="font-bold text-gray-400">{s.points}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </section>
                  {calc.evidenceContent?.factsFigures && (
                    <section>
                      <h3 className="text-[#1261A6] font-black text-sm uppercase mb-4 tracking-tight">SỐ LIỆU & Ý NGHĨA</h3>
                      <div className="bg-white rounded overflow-x-auto border border-gray-200 shadow-sm">
                        <table className="w-full text-xs border-collapse">
                          <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                              <th className="px-4 py-3 text-left font-black text-gray-700 uppercase tracking-tighter">Mô tả</th>
                              <th className="px-4 py-3 text-left font-black text-gray-700 uppercase tracking-tighter">Chỉ số</th>
                              <th className="px-4 py-3 text-left font-black text-gray-700 uppercase tracking-tighter">Ý nghĩa</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {calc.evidenceContent.factsFigures.map((row, i) => (
                              <tr key={i} className="hover:bg-blue-50/20 transition-colors">
                                <td className="px-4 py-3 font-bold text-gray-800">{row.ischemicRisk}</td>
                                <td className="px-4 py-3 text-gray-500 font-bold">{row.totalRisk}</td>
                                <td className="px-4 py-3 text-gray-600 font-medium leading-tight">{row.survival5yr}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}
                </div>
              )}
              {lowerTab === 'creator' && (
                <div className="text-xs sm:text-sm italic text-gray-600 bg-gray-50 p-6 rounded border border-gray-100 shadow-inner">
                  {calc.creatorInsights || "Nội dung đang được cập nhật."}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
            <div className="bg-[#1261A6] px-4 py-2.5"><h4 className="text-[10px] font-black text-white uppercase tracking-widest">TÁC GIẢ</h4></div>
            <div className="p-4 flex items-center space-x-4 bg-white">
               <img src={calc.creator?.image} className="w-14 h-14 rounded border border-gray-200 object-cover" alt={calc.creator?.name} />
               <div>
                  <span className="font-black text-[#1261A6] text-sm block leading-none mb-1">{calc.creator?.name}</span>
                  <p className="text-[10px] text-gray-400 font-bold leading-tight uppercase">{calc.creator?.title}</p>
               </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
             <div className="bg-[#4b5563] px-4 py-2.5"><h4 className="text-[10px] font-black text-white uppercase tracking-widest">ĐÓNG GÓP</h4></div>
             <div className="p-4">
                <ul className="space-y-1">{calc.contributors?.map(c => <li key={c} className="text-[11px] font-bold text-gray-700 flex items-center"><span className="w-1 h-1 bg-[#1261A6] rounded-full mr-2"></span> {c}</li>)}</ul>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorLayout;
