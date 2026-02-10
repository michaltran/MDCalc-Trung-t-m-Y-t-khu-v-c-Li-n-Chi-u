
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
  
  const [upperTab, setUpperTab] = useState<'when' | 'pearls' | 'why'>('when');
  const [lowerTab, setLowerTab] = useState<'next' | 'evidence' | 'creator'>('next');

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

  // Helper to get points for visualization
  const getPointBreakdown = () => {
    return calc.inputs.map(input => {
      let points = 0;
      if (input.id === 'stroke' && values[input.id] === 1) {
        points = 2; // Specific logic for stroke in CHA2DS2-VASc
      } else {
        points = values[input.id] || 0;
      }
      return {
        label: input.label.split('(')[0].trim(), // Clean labels for the chart
        points: points
      };
    }).filter(item => item.points > 0);
  };

  const pointBreakdown = getPointBreakdown();
  
  // Calculate dynamic max points for the chart based on current calculator inputs
  const maxPointsPossible = Math.max(
    ...calc.inputs.flatMap(i => 
      i.type === 'select' ? (i.options?.map(o => Math.abs(o.value)) || [1]) : [1]
    ), 1
  );

  const renderInput = (input: CalculatorInput) => {
    const options = input.type === 'boolean' 
      ? [{ label: 'Không', value: 0 }, { label: 'Có', value: 1 }]
      : input.options || [];

    return (
      <div className="flex border border-gray-300 rounded overflow-hidden">
        {options.map((opt) => {
          const isSelected = values[input.id] === opt.value;
          return (
            <button
              key={opt.label}
              onClick={() => updateValue(input.id, opt.value)}
              className={`flex-1 px-4 py-2.5 text-sm font-medium transition-all flex items-center justify-between border-r last:border-r-0 border-gray-300
                ${isSelected 
                  ? 'bg-[#1261A6] text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'}`}
            >
              <span className="font-bold">{opt.label}</span>
              <span className={`text-[11px] ml-2 ${isSelected ? 'text-white/80' : 'text-gray-400'}`}>
                {opt.displayValue || (opt.value > 0 ? `+${opt.value}` : '0')}
              </span>
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 bg-[#f3f4f6] min-h-screen font-sans">
      <nav className="mb-4">
        <button onClick={onBack} className="text-[#1261A6] font-bold text-sm flex items-center hover:underline uppercase tracking-tighter">
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
          Quay lại danh sách
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <header>
            <h1 className="text-3xl font-extrabold text-[#1261A6] leading-tight mb-2">{calc.name}</h1>
            <p className="text-gray-600 text-lg">{calc.description}</p>
          </header>

          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
            <div className="flex bg-gray-50 border-b border-gray-200">
              {[
                {id: 'when', label: 'Chỉ định'},
                {id: 'pearls', label: 'Lưu ý lâm sàng'},
                {id: 'why', label: 'Tại sao sử dụng'}
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setUpperTab(t.id as any)}
                  className={`px-8 py-3 text-sm font-bold border-r border-gray-200 flex items-center
                    ${upperTab === t.id ? 'bg-[#1261A6] text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  {t.label}
                  <svg className={`ml-2 w-3 h-3 transform transition-transform ${upperTab === t.id ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7"></path></svg>
                </button>
              ))}
            </div>
            <div className="p-6 bg-[#f8fafc] text-[#4a4a4a] text-sm leading-relaxed border-b border-gray-100">
              {upperTab === 'when' && (
                <ul className="list-disc pl-5 space-y-2">
                  {calc.whenToUse?.map((p, i) => <li key={i}>{p}</li>) || <li>Không có thông tin.</li>}
                </ul>
              )}
              {upperTab === 'pearls' && (
                <ul className="list-disc pl-5 space-y-2 font-medium">
                  {calc.pearls?.map((p, i) => <li key={i}>{p}</li>) || <li>Không có ghi chú.</li>}
                </ul>
              )}
              {upperTab === 'why' && <p className="font-medium">{calc.whyUse || "Sử dụng cho thực hành dựa trên bằng chứng."}</p>}
            </div>
          </div>

          <div className="bg-white p-6 rounded border border-gray-200 shadow-sm space-y-4">
            {calc.inputs.map((input) => (
              <div key={input.id} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center py-3 border-b border-gray-50 last:border-0">
                <div className="text-gray-700 font-bold text-sm">
                  {input.label}
                </div>
                <div>{renderInput(input)}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`${result.color} p-8 text-white rounded-xl shadow-lg flex flex-col justify-center`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-5xl font-black mb-2">{result.score} <span className="text-xl font-normal opacity-80">điểm</span></div>
                  <div className="text-2xl font-bold">{result.interpretation}</div>
                  {result.details && <div className="mt-2 text-white/90 italic text-sm">{result.details}</div>}
                </div>
                <div className="bg-white/20 p-4 rounded-full">
                   <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
              </div>
            </div>

            {/* Visual Point Breakdown Bar Chart */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-center">
              <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Phân bổ điểm số</h4>
              {pointBreakdown.length > 0 ? (
                <div className="space-y-3">
                  {pointBreakdown.map((item, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-[11px] font-bold text-gray-600">
                        <span>{item.label}</span>
                        <span>+{item.points}</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-[#1261A6] h-full transition-all duration-500 ease-out"
                          style={{ width: `${(item.points / maxPointsPossible) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-gray-400 text-sm italic">
                  Chưa có tiêu chí nào được tính điểm.
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden mt-8">
            <div className="flex bg-gray-50 border-b border-gray-200">
              {[
                {id: 'next', label: 'Hướng xử trí', icon: 'M13 5l7 7-7 7M5 5l7 7-7 7'},
                {id: 'evidence', label: 'Bằng chứng khoa học', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'},
                {id: 'creator', label: 'Góc nhìn tác giả', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'}
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setLowerTab(t.id as any)}
                  className={`flex-1 px-4 py-3 text-sm font-bold border-r border-gray-200 flex items-center justify-center
                    ${lowerTab === t.id ? 'bg-[#1261A6] text-white' : 'text-gray-500 hover:bg-gray-100'}`}
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={t.icon}></path></svg>
                  {t.label}
                </button>
              ))}
            </div>
            <div className="p-8 bg-white text-[#4a4a4a]">
              {lowerTab === 'next' && (
                <div className="space-y-6">
                  {calc.nextSteps?.advice && (
                    <section>
                      <h4 className="font-black text-[#1261A6] uppercase text-xs tracking-widest mb-3">LỜI KHUYÊN LÂM SÀNG</h4>
                      <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
                        {calc.nextSteps.advice.map((a, i) => <li key={i}>{a}</li>)}
                      </ul>
                    </section>
                  )}
                  {calc.nextSteps?.management?.map((m, i) => (
                    <section key={i}>
                      <h4 className="font-black text-[#1261A6] uppercase text-xs tracking-widest mb-3">{m.title}</h4>
                      <p className="text-sm font-medium mb-3">{m.content}</p>
                      <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
                        {m.bullets?.map((b, bi) => <li key={bi}>{b}</li>)}
                      </ul>
                    </section>
                  ))}
                  {calc.nextSteps?.criticalActions && (
                    <section className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                      <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">HÀNH ĐỘNG KHẨN CẤP</h4>
                      <p className="text-sm font-medium">{calc.nextSteps.criticalActions}</p>
                    </section>
                  )}
                </div>
              )}
              {lowerTab === 'evidence' && (
                <div className="space-y-12">
                  <section>
                    <h3 className="font-black text-[#1261A6] uppercase text-lg mb-2">CÔNG THỨC (FORMULA)</h3>
                    <p className="text-xs text-gray-500 mb-4 italic">Cộng các điểm tương ứng với các tiêu chí sau:</p>
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="border-b-2 border-gray-200">
                          <th className="text-left py-2 font-black text-gray-800">Tiêu chí</th>
                          <th className="text-right py-2 font-black text-gray-800">Điểm</th>
                        </tr>
                      </thead>
                      <tbody>
                        {calc.evidenceContent?.formula?.map((f, i) => (
                          <React.Fragment key={i}>
                            <tr className="border-b border-gray-100">
                              <td className="py-2.5 font-bold text-gray-700">{f.criteria}</td>
                              <td className="py-2.5 text-right font-bold text-gray-700">{f.points || ''}</td>
                            </tr>
                            {f.subCriteria?.map((s, si) => (
                              <tr key={`${i}-${si}`} className="border-b border-gray-50 bg-gray-50/30">
                                <td className="py-2 pl-8 text-gray-600">{s.label}</td>
                                <td className="py-2 text-right text-gray-600">{s.points}</td>
                              </tr>
                            ))}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </section>

                  {calc.evidenceContent?.factsFigures && (
                    <section>
                      <h3 className="font-black text-[#1261A6] uppercase text-lg mb-4">SỐ LIỆU & Ý NGHĨA (FACTS & FIGURES)</h3>
                      <div className="overflow-x-auto rounded-lg border border-gray-200">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="bg-gray-50 text-[#126DA6] border-b border-gray-200">
                              <th className="text-left p-3">Điểm số</th>
                              {calc.evidenceContent.factsFigures[0].ischemicRisk && <th className="text-left p-3">Rủi ro/Biến cố 1</th>}
                              {calc.evidenceContent.factsFigures[0].totalRisk && <th className="text-left p-3">Rủi ro/Biến cố 2</th>}
                              {calc.evidenceContent.factsFigures[0].survival5yr && <th className="text-left p-3">Sống sót 5 năm</th>}
                              {calc.evidenceContent.factsFigures[0].survival10yr && <th className="text-left p-3">Sống sót 10 năm</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {calc.evidenceContent.factsFigures.map((row, i) => (
                              <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                                <td className="p-3 font-bold">{row.score}</td>
                                {row.ischemicRisk && <td className="p-3">{row.ischemicRisk}</td>}
                                {row.totalRisk && <td className="p-3">{row.totalRisk}</td>}
                                {row.survival5yr && <td className="p-3">{row.survival5yr}</td>}
                                {row.survival10yr && <td className="p-3">{row.survival10yr}</td>}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </section>
                  )}

                  <section>
                    <h3 className="font-black text-[#1261A6] uppercase text-lg mb-4">ĐÁNH GIÁ BẰNG CHỨNG</h3>
                    <div className="space-y-4 text-sm leading-relaxed text-gray-700">
                      {calc.evidenceContent?.appraisal?.map((p, i) => (
                        <p key={i} className="bg-blue-50/30 p-3 rounded border-l-2 border-[#1261A6]">{p}</p>
                      ))}
                    </div>
                  </section>

                  <section>
                    <h3 className="font-black text-[#1261A6] uppercase text-lg mb-4">TÀI LIỆU THAM KHẢO</h3>
                    <div className="space-y-6">
                       {[
                         { id: 'original', label: 'THAM CHIẾU GỐC / CHÍNH' },
                         { id: 'validation', label: 'NGHIÊN CỨU XÁC THỰC' },
                         { id: 'guideline', label: 'HƯỚNG DẪN THỰC HÀNH LÂM SÀNG' }
                       ].map(cat => (
                         <div key={cat.id}>
                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">{cat.label}</h4>
                            <div className="space-y-3">
                              {calc.evidenceContent?.literature?.filter(l => l.type === cat.id).map((l, li) => (
                                <div key={li} className="bg-white border border-gray-100 p-4 rounded-lg flex items-start space-x-4 shadow-sm">
                                   <div className="bg-[#1261A6] p-2 rounded shadow-sm">
                                      <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
                                   </div>
                                   <div className="flex-1 text-xs">
                                      <p className="font-bold text-[#126DA6] text-sm mb-1">{l.citation}</p>
                                      {l.pubmedId && <p className="text-gray-500">Mã PubMed (PMID): <span className="text-[#126DA6] font-bold">{l.pubmedId}</span></p>}
                                   </div>
                                </div>
                              ))}
                            </div>
                         </div>
                       ))}
                    </div>
                  </section>
                </div>
              )}
              {lowerTab === 'creator' && (
                <div className="bg-gray-50 p-6 rounded-lg text-sm italic font-medium text-gray-600 border border-gray-100">
                  {calc.creatorInsights || "Đang cập nhật nội dung từ tác giả..."}
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={async () => {
              setLoadingAi(true);
              const analysis = await getClinicalContext(calc.name, result.interpretation, result.score);
              setAiAnalysis(analysis);
              setLoadingAi(false);
            }}
            className="w-full mt-6 py-4 bg-[#1261A6] text-white font-bold rounded-xl hover:bg-[#126DA6] transition-all flex items-center justify-center space-x-2 shadow-lg active:scale-[0.98]"
          >
            {loadingAi ? 'AI đang phân tích...' : 'Nhận phân tích từ Cố vấn AI cho ca lâm sàng này'}
          </button>
          
          {aiAnalysis && (
            <div className="mt-4 p-6 bg-blue-50 border border-blue-100 rounded-xl text-gray-800 leading-relaxed shadow-sm animate-fade-in">
               <div className="flex items-center space-x-2 mb-3">
                  <div className="bg-[#1261A6] p-1.5 rounded-full">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                  </div>
                  <div className="text-sm font-black text-[#1261A6] uppercase tracking-wider">CỐ VẤN AI LÂM SÀNG</div>
               </div>
               <div className="whitespace-pre-line text-sm font-medium">{aiAnalysis}</div>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <div className="bg-[#1261A6] p-3 text-[10px] font-black uppercase tracking-widest text-white">
              Về Tác giả
            </div>
            <div className="p-5 flex items-start space-x-4">
              <img src={calc.creator?.image} className="w-20 h-20 rounded-xl border-2 border-gray-50 shadow-sm object-cover" alt={calc.creator?.name} />
              <div className="flex-1">
                <div className="flex items-center">
                  <h4 className="font-bold text-gray-800 text-lg">{calc.creator?.name}</h4>
                  <svg className="ml-1.5 w-4 h-4 text-[#1261A6]" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                </div>
                <p className="text-xs text-gray-500 mt-1 font-medium">{calc.creator?.title}</p>
              </div>
            </div>
          </div>

          <div className="bg-[#126DA6] text-white rounded-xl shadow-md overflow-hidden">
             <div className="p-3 text-[10px] font-black uppercase tracking-widest opacity-80 border-b border-white/10">
               Công cụ liên quan
             </div>
             <div className="p-4 space-y-4">
                {calc.relatedIds?.map(id => {
                  const related = CALCULATORS.find(c => c.id === id);
                  return (
                    <button key={id} onClick={() => onNavigateToCalc?.(id)} className="w-full text-left group flex items-start space-x-3">
                      <div className="mt-1 bg-white/10 p-1 rounded group-hover:bg-white/20 transition-all">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm text-blue-100 group-hover:underline">{related?.name}</div>
                        <div className="text-[11px] opacity-70 leading-tight mt-1">{related?.description}</div>
                      </div>
                    </button>
                  );
                })}
             </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
             <div className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4">Người đóng góp</div>
             <ul className="space-y-3">
                {calc.contributors?.map(c => (
                  <li key={c} className="flex items-center space-x-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#1261A6]"></div>
                    <span className="text-sm font-bold text-gray-700">{c}</span>
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalculatorView;
