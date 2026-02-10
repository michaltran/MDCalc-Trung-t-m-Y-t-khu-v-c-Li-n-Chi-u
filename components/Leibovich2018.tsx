
import React, { useState } from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Calculator } from '../types';

interface Leibovich2018Props {
  calc: Calculator;
  onBack: () => void;
}

const Leibovich2018: React.FC<Leibovich2018Props> = ({ calc, onBack }) => {
  const [values, setValues] = useState<Record<string, number>>({
    rccType: 1, age: 0, ecog: 0, symptoms: 0, adrenal: 0, margins: 0, 
    grade: 1, necrosis: 0, sarcomatoid: 0, size: 1, fat: 0, thrombus: 0, 
    extension: 0, nodal: 0
  });

  const update = (id: string, val: number) => setValues(prev => ({ ...prev, [id]: val }));

  const calculate = () => {
    let score = 0;
    if (values.rccType === 1) score += 2; 
    if (values.age === 1) score += 1; 
    if (values.ecog === 1) score += 1; 
    if (values.symptoms === 1) score += 1; 
    if (values.adrenal === 1) score += 1; 
    if (values.margins === 1) score += 1; 
    score += (values.grade - 1); 
    if (values.necrosis === 1) score += 1;
    if (values.sarcomatoid === 1) score += 2;
    score += (values.size - 1); 
    if (values.fat === 1) score += 2;
    if (values.thrombus >= 1) score += values.thrombus === 1 ? 1 : 2;
    if (values.extension === 1) score += 2;
    if (values.nodal === 2) score += 3;

    let interpretation = "Nguy cơ Thấp";
    let color = "bg-[#1261A6]";
    if (score >= 9) { interpretation = "Nguy cơ Cao"; color = "bg-red-600"; }
    else if (score >= 5) { interpretation = "Nguy cơ Trung bình"; color = "bg-orange-500"; }

    return { score, interpretation, color, details: "Ước tính tỷ lệ sống sót đặc hiệu ung thư (CSS)." };
  };

  const OptionBtn = ({ id, label, value }: { id: string, label: string, value: number }) => (
    <button
      onClick={() => update(id, value)}
      className={`flex-1 py-2 px-2 text-[10px] sm:text-xs font-bold border-r last:border-r-0 transition-all
        ${values[id] === value ? 'bg-[#1261A6] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
    >
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );

  const Row = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-4 items-start sm:items-center py-3 border-b border-gray-50 last:border-0">
      <div className="text-[11px] sm:text-sm font-bold text-gray-700">{label}</div>
      <div className="w-full flex border border-gray-200 rounded overflow-hidden">{children}</div>
    </div>
  );

  return (
    <CalculatorLayout calc={calc} onBack={onBack} result={calculate()}>
      <div className="space-y-0">
        <Row label="Loại mô học RCC">
          <OptionBtn id="rccType" label="ccRCC" value={1} />
          <OptionBtn id="rccType" label="papRCC" value={2} />
          <OptionBtn id="rccType" label="chrRCC" value={3} />
        </Row>
        <Row label="Tuổi phẫu thuật">
          <OptionBtn id="age" label="<60" value={0} />
          <OptionBtn id="age" label="≥60" value={1} />
        </Row>
        <Row label="Tình trạng ECOG">
          <OptionBtn id="ecog" label="0" value={0} />
          <OptionBtn id="ecog" label="≥1" value={1} />
        </Row>
        <Row label="Triệu chứng thực thể">
          <OptionBtn id="symptoms" label="Không" value={0} />
          <OptionBtn id="symptoms" label="Có" value={1} />
        </Row>
        <Row label="Diện cắt phẫu thuật">
          <OptionBtn id="margins" label="Âm tính" value={0} />
          <OptionBtn id="margins" label="Dương tính" value={1} />
        </Row>
        <Row label="Độ mô học (ISUP)">
          <OptionBtn id="grade" label="1" value={1} />
          <OptionBtn id="grade" label="2" value={2} />
          <OptionBtn id="grade" label="3" value={3} />
          <OptionBtn id="grade" label="4" value={4} />
        </Row>
        <Row label="Hoại tử đông">
          <OptionBtn id="necrosis" label="Không" value={0} />
          <OptionBtn id="necrosis" label="Có" value={1} />
        </Row>
        <Row label="Sarcomatoid">
          <OptionBtn id="sarcomatoid" label="Không" value={0} />
          <OptionBtn id="sarcomatoid" label="Có" value={1} />
        </Row>
        <Row label="Kích thước u (cm)">
          <OptionBtn id="size" label="≤4" value={1} />
          <OptionBtn id="size" label="4-7" value={2} />
          <OptionBtn id="size" label="7-10" value={3} />
          <OptionBtn id="size" label=">10" value={4} />
        </Row>
        <Row label="Xâm lấn mỡ">
          <OptionBtn id="fat" label="Không" value={0} />
          <OptionBtn id="fat" label="Có" value={1} />
        </Row>
        <Row label="Huyết khối tĩnh mạch">
          <OptionBtn id="thrombus" label="K" value={0} />
          <OptionBtn id="thrombus" label="Nhánh" value={1} />
          <OptionBtn id="thrombus" label="VCI" value={2} />
        </Row>
        <Row label="Di căn hạch">
          <OptionBtn id="nodal" label="NX/N0" value={0} />
          <OptionBtn id="nodal" label="N1 (+)" value={2} />
        </Row>
      </div>
    </CalculatorLayout>
  );
};

export default Leibovich2018;
