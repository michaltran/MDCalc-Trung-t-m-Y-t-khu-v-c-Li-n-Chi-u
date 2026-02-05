
import React, { useState, useMemo } from 'react';
import { CALCULATORS, SPECIALTIES } from './constants';
import { Calculator, Specialty } from './types';
import CalculatorCard from './components/CalculatorCard';
import CalculatorView from './components/CalculatorView';

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

  if (selectedCalc) {
    return (
      <CalculatorView 
        calc={selectedCalc} 
        onBack={() => setSelectedCalcId(null)} 
        onNavigateToCalc={(id) => setSelectedCalcId(id)}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfe]">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-600 w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <span className="text-white font-black text-xl italic tracking-tighter">LC</span>
            </div>
            <div>
               <span className="text-xl font-black text-gray-900 tracking-tight block leading-none">mdcalc</span>
               <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest leading-none">TTYT KV Liên Chiểu</span>
            </div>
          </div>
          
          <div className="flex-1 max-w-2xl mx-8 hidden sm:block">
            <div className="relative group">
              <input
                type="text"
                placeholder="Tìm bảng kiểm y khoa..."
                className="w-full bg-gray-50 border-2 border-transparent rounded-2xl py-3 px-12 text-sm focus:bg-white focus:border-blue-500 transition-all shadow-inner outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <svg className="w-5 h-5 absolute left-4 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm font-bold text-gray-600">
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">Đăng nhập</button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-10 grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm sticky top-28">
            <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6 flex items-center">
              Chuyên khoa
            </h2>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedSpecialty('Tất cả')}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedSpecialty === 'Tất cả' ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}
              >
                Tất cả công cụ
              </button>
              {SPECIALTIES.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedSpecialty(s)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${selectedSpecialty === s ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section className="lg:col-span-3">
          <div className="mb-10">
             <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                {selectedSpecialty === 'Tất cả' ? 'Thư viện Bảng kiểm' : selectedSpecialty}
             </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredCalculators.map(calc => (
              <CalculatorCard 
                key={calc.id} 
                calc={calc} 
                onClick={() => setSelectedCalcId(calc.id)} 
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="bg-white border-t border-gray-100 py-10 px-4 mt-20">
        <div className="max-w-7xl mx-auto text-center">
           <p className="text-gray-900 font-bold mb-2">mdcalc TTYT KV Liên Chiểu</p>
           <p className="text-gray-400 text-xs uppercase tracking-widest font-bold">
             ©Copyright Việt hóa và Design bởi Đạt Đạt
           </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
