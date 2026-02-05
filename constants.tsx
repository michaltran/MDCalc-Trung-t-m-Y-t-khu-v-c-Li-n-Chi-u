
import { Calculator, Specialty } from './types';

export const CALCULATORS: Calculator[] = [
  {
    id: 'chads2vasc',
    name: 'Thang điểm CHA₂DS₂-VASc',
    description: 'Đánh giá nguy cơ đột quỵ ở bệnh nhân rung nhĩ.',
    specialties: ['Tim mạch', 'Hồi sức cấp cứu'],
    creator: {
      name: "BS. Gregory Lip",
      title: "Giáo sư Tim mạch học tại Đại học Liverpool",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Gregory"
    },
    relatedIds: ['has-bled', 'wells-pe'],
    whenToUse: "Sử dụng cho bệnh nhân rung nhĩ không do bệnh van tim để quyết định điều trị chống đông.",
    pearls: "Đừng quên rằng giới tính nữ chỉ được tính 1 điểm nếu có ít nhất một yếu tố nguy cơ khác.",
    whyUse: "Thang điểm này nhạy hơn CHADS2 cũ trong việc xác định các bệnh nhân 'nguy cơ thực sự thấp'.",
    inputs: [
      { id: 'age', label: 'Tuổi', type: 'select', options: [{label: '<65', value: 0}, {label: '65-74', value: 1, displayValue: '+1'}, {label: '≥75', value: 2, displayValue: '+2'}] },
      { id: 'sex', label: 'Giới tính', type: 'select', options: [{label: 'Nữ', value: 1, displayValue: '+1'}, {label: 'Nam', value: 0}] },
      { id: 'chf', label: 'Tiền sử Suy tim sung huyết', type: 'boolean' },
      { id: 'htn', label: 'Tiền sử Tăng huyết áp', type: 'boolean' },
      { id: 'stroke', label: 'Tiền sử Đột quỵ/TIA/Thuyên tắc (x2)', type: 'boolean' },
      { id: 'vascular', label: 'Bệnh mạch máu (NMCT, Bệnh mạch ngoại vi)', type: 'boolean' },
      { id: 'diabetes', label: 'Tiểu đường', type: 'boolean' },
    ],
    calculate: (v) => {
      const ageScore = v.age ?? 0;
      const sexScore = v.sex ?? 1;
      const chf = v.chf === 1 ? 1 : 0;
      const htn = v.htn === 1 ? 1 : 0;
      const stroke = v.stroke === 1 ? 2 : 0;
      const vascular = v.vascular === 1 ? 1 : 0;
      const diabetes = v.diabetes === 1 ? 1 : 0;
      const score = ageScore + sexScore + chf + htn + stroke + vascular + diabetes;
      
      let risk = "0%";
      if (score === 1) risk = "1.3%";
      if (score === 2) risk = "2.2%";
      if (score === 3) risk = "3.2%";
      if (score === 4) risk = "4.0%";
      if (score === 5) risk = "6.7%";
      if (score === 6) risk = "9.8%";
      if (score === 7) risk = "9.6%";
      if (score === 8) risk = "6.7%";
      if (score === 9) risk = "12.2%";

      return { 
        score, 
        interpretation: `Nguy cơ đột quỵ hàng năm là ${risk}.`, 
        details: score >= 2 ? "Khuyến cáo dùng thuốc chống đông đường uống." : "Cân nhắc chống đông nếu score = 1.",
        color: "bg-blue-700"
      };
    },
    evidence: "Lip GY, et al. Chest. 2010."
  },
  {
    id: 'meld',
    name: 'Thang điểm MELD',
    description: 'Dự đoán tỉ lệ tử vong ở bệnh nhân bệnh gan giai đoạn cuối.',
    specialties: ['Tiêu hóa', 'Hồi sức cấp cứu'],
    inputs: [
      { id: 'bilirubin', label: 'Bilirubin (mg/dL)', type: 'number', defaultValue: 1.2 },
      { id: 'inr', label: 'INR', type: 'number', defaultValue: 1.0 },
      { id: 'creatinine', label: 'Creatinine (mg/dL)', type: 'number', defaultValue: 1.0 },
      { id: 'sodium', label: 'Natri (mEq/L)', type: 'number', defaultValue: 140 },
    ],
    calculate: (v) => {
      const b = Math.max(v.bilirubin || 1, 1);
      const i = Math.max(v.inr || 1, 1);
      const c = Math.max(Math.min(v.creatinine || 1, 4), 1);
      const na = Math.max(Math.min(v.sodium || 137, 137), 125);
      
      let meld = 0.378 * Math.log(b) + 1.120 * Math.log(i) + 0.957 * Math.log(c) + 0.643;
      meld = Math.round(meld * 10);
      
      return {
        score: meld,
        interpretation: `Tỉ lệ tử vong trong 3 tháng dự đoán khoảng ${meld > 40 ? '>71%' : meld > 30 ? '52%' : '1.9-6%'}.`,
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'cockcroft-gault',
    name: 'Công thức Cockcroft-Gault',
    description: 'Ước tính độ thanh thải Creatinine (CrCl).',
    specialties: ['Thận học', 'Nội tiết'],
    inputs: [
      { id: 'age', label: 'Tuổi', type: 'number', defaultValue: 60 },
      { id: 'weight', label: 'Cân nặng (kg)', type: 'number', defaultValue: 70 },
      { id: 'creatinine', label: 'Creatinine (mg/dL)', type: 'number', defaultValue: 1.0 },
      { id: 'sex', label: 'Giới tính', type: 'select', options: [{label: 'Nam', value: 1}, {label: 'Nữ', value: 0.85}] },
    ],
    calculate: (v) => {
      const score = Math.round(((140 - (v.age || 0)) * (v.weight || 0) * (v.sex || 1)) / (72 * (v.creatinine || 1)));
      return {
        score,
        interpretation: `CrCl ước tính: ${score} mL/min.`,
        details: score < 60 ? "Cần điều chỉnh liều thuốc đào thải qua thận." : "Chức năng thận trong giới hạn bình thường.",
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'apgar',
    name: 'Chỉ số APGAR',
    description: 'Đánh giá sức khỏe trẻ sơ sinh ngay sau sinh.',
    specialties: ['Nhi khoa', 'Sản phụ khoa'],
    inputs: [
      { id: 'hr', label: 'Nhịp tim', type: 'select', options: [{label: '>100', value: 2}, {label: '<100', value: 1}, {label: 'Không có', value: 0}] },
      { id: 'rr', label: 'Hô hấp', type: 'select', options: [{label: 'Khóc to', value: 2}, {label: 'Yếu/Rên', value: 1}, {label: 'Không có', value: 0}] },
      { id: 'tone', label: 'Trương lực cơ', type: 'select', options: [{label: 'Cử động tốt', value: 2}, {label: 'Gập nhẹ chi', value: 1}, {label: 'Nhão', value: 0}] },
      { id: 'reflex', label: 'Kích thích', type: 'select', options: [{label: 'Hắt hơi/Khóc', value: 2}, {label: 'Nhăn mặt', value: 1}, {label: 'Không đáp ứng', value: 0}] },
      { id: 'color', label: 'Màu sắc', type: 'select', options: [{label: 'Hồng toàn thân', value: 2}, {label: 'Chi xanh', value: 1}, {label: 'Xanh tái/Trắng', value: 0}] },
    ],
    calculate: (v) => {
      const score = Object.values(v).reduce((a, b) => a + b, 0);
      return {
        score,
        interpretation: score >= 7 ? "Trẻ ổn định." : score >= 4 ? "Cần hỗ trợ hô hấp." : "Cần hồi sức cấp cứu ngay lập tức.",
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'centor',
    name: 'Thang điểm Centor (Viêm họng)',
    description: 'Ước tính khả năng viêm họng do liên cầu khuẩn.',
    specialties: ['Hô hấp', 'Nhi khoa'],
    inputs: [
      { id: 'fever', label: 'Sốt (> 38°C)', type: 'boolean' },
      { id: 'cough', label: 'Không ho', type: 'boolean' },
      { id: 'nodes', label: 'Hạch cổ trước sưng/đau', type: 'boolean' },
      { id: 'exudate', label: 'Sưng/giả mạc amidan', type: 'boolean' },
      { id: 'age', label: 'Tuổi', type: 'select', options: [{label: '3-14 tuổi (+1)', value: 1}, {label: '15-44 tuổi (0)', value: 0}, {label: '≥45 tuổi (-1)', value: -1}] },
    ],
    calculate: (v) => {
      const score = (v.fever || 0) + (v.cough || 0) + (v.nodes || 0) + (v.exudate || 0) + (v.age || 0);
      return {
        score,
        interpretation: score >= 4 ? "Khả năng cao do vi khuẩn. Cân nhắc kháng sinh." : score >= 2 ? "Cần test nhanh liên cầu." : "Nguy cơ thấp.",
        color: "bg-blue-700"
      };
    }
  }
];

export const SPECIALTIES: Specialty[] = [
  'Tim mạch', 'Hồi sức cấp cứu', 'Nội tiết', 'Tiêu hóa', 'Thận học', 'Thần kinh', 'Sản phụ khoa', 'Nhi khoa', 'Hô hấp'
];
