
import React, { useState } from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Calculator } from '../types';

interface CHADS2VascProps {
  calc: Calculator;
  onBack: () => void;
}

const CHADS2Vasc: React.FC<CHADS2VascProps> = ({ calc, onBack }) => {
  const [values, setValues] = useState<Record<string, number>>({
    age: 0,
    sex: 0,
    chf: 0,
    htn: 0,
    stroke: 0,
    vascular: 0,
    diabetes: 0
  });

  const update = (id: string, val: number) => setValues(prev => ({ ...prev, [id]: val }));

  const calculate = () => {
    const score = (values.age || 0) + 
                  (values.sex || 0) + 
                  (values.chf || 0) + 
                  (values.htn || 0) + 
                  (values.stroke === 1 ? 2 : 0) + 
                  (values.vascular || 0) + 
                  (values.diabetes || 0);

    const risks = [
      { ischemic: "0.2%", total: "0.3%" }, 
      { ischemic: "0.6%", total: "0.9%" }, 
      { ischemic: "2.2%", total: "2.9%" }, 
      { ischemic: "3.2%", total: "4.6%" }, 
      { ischemic: "4.8%", total: "6.7%" }, 
      { ischemic: "7.2%", total: "10.0%" }, 
      { ischemic: "9.7%", total: "13.6%" }, 
      { ischemic: "11.2%", total: "15.7%" }, 
      { ischemic: "10.8%", total: "15.2%" }, 
      { ischemic: "12.2%", total: "17.4%" }  
    ];

    const risk = risks[score] || risks[9];
    
    let interpretation = "";
    let color = "bg-[#1261A6]";
    let details = "";

    if (score === 0 && values.sex === 0) {
      interpretation = "Nguy cơ thấp (Nam 0)";
      details = "Không khuyến cáo chống đông.";
    } else if (score === 1 && values.sex === 1) {
      interpretation = "Nguy cơ thấp (Nữ 1)";
      details = "Không khuyến cáo chống đông.";
    } else if ((score === 1 && values.sex === 0) || (score === 2 && values.sex === 1)) {
      interpretation = "Nguy cơ trung bình";
      color = "bg-orange-500";
      details = "Cân nhắc chống đông (Cá thể hóa).";
    } else {
      interpretation = "Nguy cơ cao";
      color = "bg-red-600";
      details = "Khuyến cáo OAC (Class I).";
    }

    return { 
      score, 
      interpretation, 
      details: `${details} Nguy cơ đột quỵ: ${risk.ischemic}/năm.`, 
      color 
    };
  };

  const getPointBreakdown = () => {
    return [
      { label: 'Tuổi', points: values.age, maxPoints: 2 },
      { label: 'Giới tính', points: values.sex, maxPoints: 1 },
      { label: 'Suy tim', points: values.chf, maxPoints: 1 },
      { label: 'Tăng huyết áp', points: values.htn, maxPoints: 1 },
      { label: 'Đột quỵ', points: values.stroke === 1 ? 2 : 0, maxPoints: 2 },
      { label: 'Bệnh mạch máu', points: values.vascular, maxPoints: 1 },
      { label: 'Tiểu đường', points: values.diabetes, maxPoints: 1 },
    ];
  };

  const OptionBtn = ({ id, label, value, displayValue }: { id: string, label: string, value: number, displayValue?: string }) => (
    <button
      onClick={() => update(id, value)}
      className={`flex-1 py-2 sm:py-3 px-2 sm:px-4 text-[11px] sm:text-sm font-bold border-r last:border-r-0 transition-all flex items-center justify-center
        ${values[id] === value ? 'bg-[#1261A6] text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
    >
      <div className="flex flex-col items-center">
        <span className="whitespace-nowrap">{label}</span>
        <span className={`text-[9px] sm:text-[10px] mt-0.5 opacity-60 ${values[id] === value ? 'text-white' : 'text-gray-400'}`}>
          {displayValue || (value > 0 ? `+${value}` : '0')}
        </span>
      </div>
    </button>
  );

  const Row = ({ label, children, helpText }: { label: string, children: React.ReactNode, helpText?: string }) => (
    <div className="flex flex-col sm:grid sm:grid-cols-2 gap-2 sm:gap-4 items-start sm:items-center py-3 sm:py-4 border-b border-gray-100 last:border-0">
      <div className="w-full">
        <div className="text-xs sm:text-sm font-extrabold text-gray-800">{label}</div>
        {helpText && <div className="text-[9px] sm:text-[10px] text-gray-400 font-medium mt-0.5 hidden sm:block">{helpText}</div>}
      </div>
      <div className="w-full flex border border-gray-200 rounded-lg overflow-hidden shadow-sm shrink-0">
        {children}
      </div>
    </div>
  );

  return (
    <CalculatorLayout calc={calc} onBack={onBack} result={calculate()} pointBreakdown={getPointBreakdown()}>
      <div className="space-y-1">
        <Row label="Tuổi">
          <OptionBtn id="age" label="<65" value={0} />
          <OptionBtn id="age" label="65-74" value={1} />
          <OptionBtn id="age" label="≥75" value={2} />
        </Row>
        
        <Row label="Giới tính">
          <OptionBtn id="sex" label="Nam" value={0} />
          <OptionBtn id="sex" label="Nữ" value={1} />
        </Row>

        <Row label="Suy tim sung huyết">
          <OptionBtn id="chf" label="Không" value={0} />
          <OptionBtn id="chf" label="Có" value={1} />
        </Row>

        <Row label="Tăng huyết áp">
          <OptionBtn id="htn" label="Không" value={0} />
          <OptionBtn id="htn" label="Có" value={1} />
        </Row>

        <Row label="Đột quỵ / TIA / TE">
          <OptionBtn id="stroke" label="Không" value={0} />
          <OptionBtn id="stroke" label="Có" value={1} displayValue="+2" />
        </Row>

        <Row label="Bệnh mạch máu">
          <OptionBtn id="vascular" label="Không" value={0} />
          <OptionBtn id="vascular" label="Có" value={1} />
        </Row>

        <Row label="Đái tháo đường">
          <OptionBtn id="diabetes" label="Không" value={0} />
          <OptionBtn id="diabetes" label="Có" value={1} />
        </Row>
      </div>
    </CalculatorLayout>
  );
};

export default CHADS2Vasc;
