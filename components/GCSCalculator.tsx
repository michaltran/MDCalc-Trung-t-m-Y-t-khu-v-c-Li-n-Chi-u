
import React, { useState } from 'react';
import CalculatorLayout from './CalculatorLayout';
import { Calculator } from '../types';

interface GCSCalculatorProps {
  calc: Calculator;
  onBack: () => void;
}

const GCSCalculator: React.FC<GCSCalculatorProps> = ({ calc, onBack }) => {
  // -1 đại diện cho "NT" (Not Testable)
  const [values, setValues] = useState<Record<string, number>>({
    eye: 4,
    verbal: 5,
    motor: 6
  });

  const update = (id: string, val: number) => setValues(prev => ({ ...prev, [id]: val }));

  const calculate = () => {
    const isUntestable = values.eye === -1 || values.verbal === -1 || values.motor === -1;
    
    if (isUntestable) {
      const eStr = values.eye === -1 ? 'NT' : values.eye;
      const vStr = values.verbal === -1 ? 'NT' : values.verbal;
      const mStr = values.motor === -1 ? 'NT' : values.motor;
      
      return {
        score: 0, // Không dùng score số học
        isNT: true,
        interpretation: "Không thể tính tổng điểm (NT)",
        color: "bg-gray-500",
        details: `Kết quả thành phần: E${eStr} V${vStr} M${mStr}. Tổng điểm GCS không hợp lệ khi có thành phần NT.`
      };
    }

    const score = values.eye + values.verbal + values.motor;
    let interpretation = "";
    let color = "bg-[#1261A6]";
    let details = "";

    if (score >= 13) {
      interpretation = "Chấn thương sọ não Nhẹ";
      color = "bg-green-600";
      details = "Nguy cơ thấp, cần theo dõi lâm sàng.";
    } else if (score >= 9) {
      interpretation = "Chấn thương sọ não Trung bình";
      color = "bg-orange-500";
      details = "Nguy cơ diễn tiến nặng, cần đánh giá hình ảnh học.";
    } else {
      interpretation = "Hôn mê / Chấn thương sọ não Nặng";
      color = "bg-red-600";
      details = "Cần bảo vệ đường thở khẩn cấp (GCS ≤ 8).";
    }

    return { 
      score, 
      interpretation, 
      details: `E${values.eye} V${values.verbal} M${values.motor} = ${score}. ${details}`, 
      color 
    };
  };

  const calcResult = calculate();

  const getPointBreakdown = () => {
    return [
      { label: 'Đáp ứng Mắt (E)', points: values.eye === -1 ? 0 : values.eye, maxPoints: 4 },
      { label: 'Đáp ứng Lời nói (V)', points: values.verbal === -1 ? 0 : values.verbal, maxPoints: 5 },
      { label: 'Đáp ứng Vận động (M)', points: values.motor === -1 ? 0 : values.motor, maxPoints: 6 },
    ];
  };

  const OptionBtn = ({ id, label, value, subtext }: { id: string, label: string, value: number, subtext?: string }) => (
    <button
      onClick={() => update(id, value)}
      className={`flex-1 py-3 px-1 text-[10px] sm:text-[11px] font-bold border-r last:border-r-0 transition-all flex flex-col items-center justify-center min-h-[50px]
        ${values[id] === value ? 'bg-[#1261A6] text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
    >
      <span className="text-center leading-tight mb-0.5">{label}</span>
      {subtext && <span className={`text-[8px] font-medium opacity-70 mb-0.5`}>{subtext}</span>}
      <span className={`text-[10px] font-black ${values[id] === value ? 'text-white/70' : 'text-gray-300'}`}>
        {value === -1 ? 'NT' : `+${value}`}
      </span>
    </button>
  );

  const Row = ({ label, children }: { label: string, children: React.ReactNode }) => (
    <div className="flex flex-col space-y-2 py-4 border-b border-gray-100 last:border-0">
      <div className="text-xs font-black text-gray-800 uppercase tracking-tight ml-1">{label}</div>
      <div className="w-full flex border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {children}
      </div>
    </div>
  );

  // Override score display for NT
  const resultToPass = {
    ...calcResult,
    score: (calcResult as any).isNT ? "NT" : calcResult.score
  };

  return (
    <CalculatorLayout calc={calc} onBack={onBack} result={resultToPass as any} pointBreakdown={getPointBreakdown()}>
      <div className="space-y-1">
        <Row label="Đáp ứng Mắt (Eye Opening)">
          <OptionBtn id="eye" label="Tự nhiên" value={4} />
          <OptionBtn id="eye" label="Lời nói" value={3} />
          <OptionBtn id="eye" label="Áp lực" value={2} />
          <OptionBtn id="eye" label="Không" value={1} />
          <OptionBtn id="eye" label="NT*" value={-1} subtext="Phù nề/Chấn thương" />
        </Row>
        
        <Row label="Đáp ứng Lời nói (Verbal)">
          <OptionBtn id="verbal" label="Tỉnh táo" value={5} />
          <OptionBtn id="verbal" label="Lú lẫn" value={4} />
          <OptionBtn id="verbal" label="Từ đơn" value={3} />
          <OptionBtn id="verbal" label="Vô nghĩa" value={2} />
          <OptionBtn id="verbal" label="Không" value={1} />
          <OptionBtn id="verbal" label="NT*" value={-1} subtext="NKQ/Mở KQ" />
        </Row>

        <Row label="Đáp ứng Vận động (Motor)">
          <OptionBtn id="motor" label="Theo lệnh" value={6} />
          <OptionBtn id="motor" label="Khu trú" value={5} />
          <OptionBtn id="motor" label="Co bình thường" value={4} />
          <OptionBtn id="motor" label="Gồng mất vỏ" value={3} />
          <OptionBtn id="motor" label="Duỗi mất não" value={2} />
          <OptionBtn id="motor" label="Không" value={1} />
          <OptionBtn id="motor" label="NT*" value={-1} subtext="Liệt/An thần" />
        </Row>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
        <p className="text-[10px] text-gray-500 leading-tight">
          * <span className="font-bold">NT (Not Testable):</span> Thành phần không thể đánh giá được do các yếu tố cản trở (phù nề, nội khí quản, thuốc giãn cơ). Khi có NT, tổng điểm GCS không được tính mà phải báo cáo từng thành phần riêng lẻ.
        </p>
      </div>
    </CalculatorLayout>
  );
};

export default GCSCalculator;
