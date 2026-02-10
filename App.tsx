
import React, { useState, useMemo } from 'react';
import { CALCULATORS, SPECIALTIES } from './constants';
import { Specialty } from './types';
import CalculatorCard from './components/CalculatorCard';
import CHADS2Vasc from './components/CHADS2Vasc';
import Leibovich2018 from './components/Leibovich2018';
import BMICalculator from './components/BMICalculator';
import GCSCalculator from './components/GCSCalculator';
import SOFACalculator from './components/SOFACalculator';
import CrClCalculator from './components/CrClCalculator';
import CKDEPICalculator from './components/CKDEPICalculator';

const App: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<Specialty | 'Tất cả'>('Tất cả');
  const [selectedCalcId, setSelectedCalcId] = useState<string | null>(null);

  const filteredCalculators = useMemo(() => {
    return CALCULATORS.filter(c => {
      const searchLower = search.toLowerCase();
      const matchesSearch = c.name.toLowerCase().includes(searchLower) || 
                            c.description.toLowerCase().includes(searchLower) ||
                            c.id.toLowerCase().includes(searchLower);
      const matchesSpecialty = selectedSpecialty === 'Tất cả' || c.specialties.includes(selectedSpecialty as Specialty);
      return matchesSearch && matchesSpecialty;
    });
  }, [search, selectedSpecialty]);

  const selectedCalc = useMemo(() => 
    CALCULATORS.find(c => c.id === selectedCalcId), [selectedCalcId]
  );

  const handleBack = () => {
    setSelectedCalcId(null);
    window.scrollTo(0, 0);
  };

  // Render specific component based on selection
  const renderCalculator = () => {
    if (!selectedCalc) return null;
    
    switch (selectedCalc.id) {
      case 'chads2vasc':
        return <CHADS2Vasc calc={selectedCalc} onBack={handleBack} />;
      case 'leibovich-2018':
        return <Leibovich2018 calc={selectedCalc} onBack={handleBack} />;
      case 'bmi':
        return <BMICalculator calc={selectedCalc} onBack={handleBack} />;
      case 'gcs':
        return <GCSCalculator calc={selectedCalc} onBack={handleBack} />;
      case 'sofa':
        return <SOFACalculator calc={selectedCalc} onBack={handleBack} />;
      case 'crcl':
        return <CrClCalculator calc={selectedCalc} onBack={handleBack} />;
      case 'ckdepi':
        return <CKDEPICalculator calc={selectedCalc} onBack={handleBack} />;
      default:
        return (
          <div className="p-10 text-center">
            <h2 className="text-2xl font-bold">Thang điểm {selectedCalc.name}</h2>
            <p className="mt-4">Đang được chuyển đổi sang cấu trúc component mới...</p>
            <button onClick={handleBack} className="mt-6 bg-[#1261A6] text-white px-6 py-2 rounded-lg">Quay lại</button>
          </div>
        );
    }
  };

  if (selectedCalcId) {
    return renderCalculator();
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f8fafc]">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-[#1261A6] w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 cursor-pointer" onClick={() => setSelectedCalcId(null)}>
              <span className="text-white font-black text-2xl italic tracking-tighter">LC</span>
            </div>
            <div>
               <span className="text-xl font-black text-gray-900 tracking-tight block leading-none">mdcalc</span>
               <span className="text-[10px] font-black text-[#126DA6] uppercase tracking-[0.15em] mt-1 inline-block">TTYT KV Liên Chiểu</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-2xl mx-8 hidden sm:block">
            <div className="relative group">
              <input
                type="text"
                placeholder="Tìm kiếm thang điểm..."
                className="w-full bg-gray-100 border-2 border-transparent rounded-2xl py-3.5 px-12 text-sm focus:bg-white focus:border-[#1261A6] outline-none font-medium"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="w-5 h-5 absolute left-4 top-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          <button className="bg-[#1261A6] text-white px-7 py-3 rounded-xl hover:bg-[#126DA6] transition-all">Đăng nhập</button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-28">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Chuyên khoa</h2>
            <div className="space-y-1.5">
              <button
                onClick={() => setSelectedSpecialty('Tất cả')}
                className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${selectedSpecialty === 'Tất cả' ? 'bg-[#1261A6] text-white' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Tất cả công cụ
              </button>
              {SPECIALTIES.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSpecialty(s)}
                  className={`w-full text-left px-5 py-3.5 rounded-xl text-sm font-bold transition-all ${selectedSpecialty === s ? 'bg-[#1261A6] text-white shadow-xl shadow-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-3">
          <div className="mb-10 bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
             <h1 className="text-4xl font-black text-[#1261A6]">{selectedSpecialty === 'Tất cả' ? 'Thư viện Công cụ Y khoa' : selectedSpecialty}</h1>
             <p className="text-gray-500 mt-2 text-lg">Hệ thống bảng kiểm lâm sàng chuẩn hóa Việt Nam.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCalculators.map(calc => (
              <CalculatorCard key={calc.id} calc={calc} onClick={() => setSelectedCalcId(calc.id)} />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-100 py-12 text-center">
         <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">© Thiết kế & Việt hóa bởi BS. Đạt Đạt - mdcalc TTYT KV Liên Chiểu</p>
      </footer>
    </div>
  );
};

export default App;
