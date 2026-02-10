
import React, { useState } from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Calculator } from '../types';

interface SOFACalculatorProps {
  calc: Calculator;
  onBack: () => void;
}

const SOFACalculator: React.FC<SOFACalculatorProps> = ({ calc, onBack }) => {
  const [values, setValues] = useState<Record<string, number>>({
    pf_ratio: 0, // 0: >=400, 1: 300-399, 2: 200-299, 3: 100-199, 4: <100
    isVentilated: 0, // 0: No, 1: Yes
    coagulation: 0, // 0: >=150, 1: 100-149, 2: 50-99, 3: 20-49, 4: <20
    liver: 0, // Bilirubin 0: <1.2, 1: 1.2-1.9, 2: 2.0-5.9, 3: 6.0-11.9, 4: >=12.0
    cardio: 0, // 0: MAP >=70, 1: MAP <70, 2: Dopa <=5/Dobu, 3: Dopa >5/Epi<=0.1, 4: Dopa >15/Epi>0.1
    cns: 0, // GCS 0: 15, 1: 13-14, 2: 10-12, 3: 6-9, 4: <6
    renal: 0 // Creatinine/UO
  });

  const [showFiO2Helper, setShowFiO2Helper] = useState(false);

  const update = (id: string, val: number) => setValues(prev => ({ ...prev, [id]: val }));

  const calculate = () => {
    // Logic Hô hấp đặc thù
    let respScore = values.pf_ratio;
    if (values.isVentilated === 0) {
      if (respScore >= 3) respScore = 2; // Nếu không thở máy, tối đa chỉ là 2 điểm cho P/F < 200
    }

    const score = respScore + values.coagulation + values.liver + values.cardio + values.cns + values.renal;
    
    let interpretation = "";
    let color = "bg-[#1261A6]";
    let details = "";

    if (score >= 15) {
      interpretation = "Nguy kịch cực độ (Tử vong >80-90%)";
      color = "bg-red-900";
    } else if (score >= 10) {
      interpretation = "Nguy kịch nặng (Tử vong 45-50%)";
      color = "bg-red-600";
    } else if (score >= 7) {
      interpretation = "Nguy kịch trung bình (Tử vong 18-26%)";
      color = "bg-orange-600";
    } else if (score >= 2) {
      interpretation = "Nguy kịch nhẹ (Tử vong 1-10%)";
      color = "bg-orange-400";
    } else {
      interpretation = "Tình trạng ổn định (Tử vong 0%)";
      color = "bg-green-600";
    }

    details = `Tổng điểm SOFA: ${score}. Điểm cao nhất ghi nhận được tương ứng với tỷ lệ tử vong ước tính. Ở bệnh nhân an thần, GCS được tính theo trạng thái nền.`;

    return { score, interpretation, details, color };
  };

  const OptionBtn = ({ id, label, value, subtext }: { id: string, label: string, value: number, subtext?: string }) => (
    <button
      onClick={() => update(id, value)}
      className={`flex-1 py-3 px-1 text-[10px] sm:text-[11px] font-bold border-r last:border-r-0 transition-all flex flex-col items-center justify-center min-h-[65px]
        ${values[id] === value ? 'bg-[#1261A6] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
    >
      <span className="text-center leading-tight mb-1">{label}</span>
      {subtext && <span className={`text-[8px] font-medium opacity-70 mb-1 leading-tight text-center`}>{subtext}</span>}
      <span className={`text-[10px] font-black ${values[id] === value ? 'text-white/70' : 'text-gray-300'}`}>+{value}</span>
    </button>
  );

  const Row = ({ label, children, extra }: { label: string, children: React.ReactNode, extra?: React.ReactNode }) => (
    <div className="flex flex-col space-y-2 py-4 border-b border-gray-100 last:border-0">
      <div className="flex justify-between items-center px-1">
        <div className="text-xs font-black text-gray-800 uppercase tracking-tight">{label}</div>
        {extra}
      </div>
      <div className="w-full flex border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  );

  return (
    <CalculatorLayout 
      calc={calc} 
      onBack={onBack} 
      result={calculate()}
      pointBreakdown={[
        { label: 'Hô hấp', points: values.pf_ratio, maxPoints: 4 },
        { label: 'Đông máu', points: values.coagulation, maxPoints: 4 },
        { label: 'Gan', points: values.liver, maxPoints: 4 },
        { label: 'Tim mạch', points: values.cardio, maxPoints: 4 },
        { label: 'Thần kinh', points: values.cns, maxPoints: 4 },
        { label: 'Thận', points: values.renal, maxPoints: 4 },
      ]}
    >
      <div className="space-y-1">
        {/* Hô hấp */}
        <Row 
          label="Hệ Hô hấp (PaO2/FiO2 [mmHg])" 
          extra={
            <button 
              onClick={() => setShowFiO2Helper(!showFiO2Helper)}
              className="text-[10px] bg-blue-50 text-[#1261A6] px-2 py-1 rounded font-bold hover:bg-blue-100 transition-colors"
            >
              Tra cứu FiO2 {showFiO2Helper ? '▲' : '▼'}
            </button>
          }
        >
          <OptionBtn id="pf_ratio" label="≥ 400" value={0} />
          <OptionBtn id="pf_ratio" label="300–399" value={1} />
          <OptionBtn id="pf_ratio" label="200–299" value={2} />
          <OptionBtn id="pf_ratio" label="100–199" value={3} />
          <OptionBtn id="pf_ratio" label="< 100" value={4} />
        </Row>

        {showFiO2Helper && (
          <div className="p-3 bg-blue-50 border-x-2 border-blue-100 animate-fade-in text-[10px] space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="font-bold text-[#1261A6]">Canuyn mũi (L/min):</span>
                <ul className="mt-1">
                  <li>Room air: 21% | 1L: 25% | 2L: 29%</li>
                  <li>3L: 33% | 4L: 37% | 5L: 41% | 6L: 45%</li>
                </ul>
              </div>
              <div>
                <span className="font-bold text-[#1261A6]">Dụng cụ khác:</span>
                <ul className="mt-1">
                  <li>Simple mask: 35–60%</li>
                  <li>Non-rebreather: 70–90%</li>
                  <li>HFNC: 30–100%</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center space-x-3 py-2 px-2 bg-gray-50 border-x-2 border-gray-200">
          <input 
            type="checkbox" 
            id="vent" 
            checked={values.isVentilated === 1}
            onChange={(e) => update('isVentilated', e.target.checked ? 1 : 0)}
            className="w-4 h-4 text-[#1261A6] rounded focus:ring-[#1261A6]"
          />
          <label htmlFor="vent" className="text-xs font-bold text-gray-700">Bệnh nhân CÓ hỗ trợ hô hấp (Thở máy hoặc CPAP/BiPAP)</label>
        </div>

        {/* Đông máu */}
        <Row label="Đông máu (Tiểu cầu [x10³/µL])">
          <OptionBtn id="coagulation" label="≥ 150" value={0} />
          <OptionBtn id="coagulation" label="100–149" value={1} />
          <OptionBtn id="coagulation" label="50–99" value={2} />
          <OptionBtn id="coagulation" label="20–49" value={3} />
          <OptionBtn id="coagulation" label="< 20" value={4} />
        </Row>

        {/* Gan */}
        <Row label="Gan (Bilirubin [mg/dL])">
          <OptionBtn id="liver" label="< 1.2" value={0} subtext="< 20 µmol/L" />
          <OptionBtn id="liver" label="1.2–1.9" value={1} subtext="20–32 µmol/L" />
          <OptionBtn id="liver" label="2.0–5.9" value={2} subtext="33–101 µmol/L" />
          <OptionBtn id="liver" label="6.0–11.9" value={3} subtext="102–204 µmol/L" />
          <OptionBtn id="liver" label="≥ 12.0" value={4} subtext="> 204 µmol/L" />
        </Row>

        {/* Tim mạch */}
        <Row label="Tim mạch (Huyết áp & Vận mạch [mcg/kg/min])">
          <OptionBtn id="cardio" label="MAP ≥ 70" value={0} />
          <OptionBtn id="cardio" label="MAP < 70" value={1} />
          <OptionBtn id="cardio" label="Dopa ≤ 5" value={2} subtext="Hoặc Dobu (bất kỳ)" />
          <OptionBtn id="cardio" label="Dopa > 5" value={3} subtext="Epi/Nor ≤ 0.1" />
          <OptionBtn id="cardio" label="Dopa > 15" value={4} subtext="Epi/Nor > 0.1" />
        </Row>

        {/* Thần kinh */}
        <Row label="Thần kinh (Thang điểm Glasgow - GCS)">
          <OptionBtn id="cns" label="15" value={0} />
          <OptionBtn id="cns" label="13–14" value={1} />
          <OptionBtn id="cns" label="10–12" value={2} />
          <OptionBtn id="cns" label="6–9" value={3} />
          <OptionBtn id="cns" label="< 6" value={4} />
        </Row>

        {/* Thận */}
        <Row label="Thận (Creatinine [mg/dL] hoặc Nước tiểu)">
          <OptionBtn id="renal" label="< 1.2" value={0} subtext="< 110 µmol/L" />
          <OptionBtn id="renal" label="1.2–1.9" value={1} subtext="110–170 µmol/L" />
          <OptionBtn id="renal" label="2.0–3.4" value={2} subtext="171–299 µmol/L" />
          <OptionBtn id="renal" label="3.5–4.9" value={3} subtext="UO < 500 mL/ngày" />
          <OptionBtn id="renal" label="≥ 5.0" value={4} subtext="UO < 200 mL/ngày" />
        </Row>
      </div>
      
      <div className="mt-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100 space-y-2">
        <h5 className="text-[10px] font-black text-yellow-800 uppercase tracking-widest">Ghi chú lâm sàng đặc biệt:</h5>
        <p className="text-[10px] text-yellow-700 leading-tight">
          • <span className="font-bold">Đơn vị:</span> Vận mạch tính bằng mcg/kg/min. Quy đổi Creatinine: 1 mg/dL ≈ 88.4 µmol/L. Bilirubin: 1 mg/dL ≈ 17.1 µmol/L.
        </p>
        <p className="text-[10px] text-yellow-700 leading-tight italic">
          • <span className="font-bold">GS. Vincent:</span> Điểm hô hấp 3-4 chỉ gán cho bệnh nhân có hỗ trợ hô hấp. Ở bệnh nhân an thần, sử dụng GCS nền (trước khi dùng thuốc) để đánh giá thực chất suy chức năng thần kinh.
        </p>
      </div>
    </CalculatorLayout>
  );
};

export default SOFACalculator;
