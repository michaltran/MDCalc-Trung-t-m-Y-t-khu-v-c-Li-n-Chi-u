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
      const ageScore = (v.age || 0);
      const sexScore = (v.sex || 0);
      const chf = v.chf === 1 ? 1 : 0;
      const htn = v.htn === 1 ? 1 : 0;
      const stroke = v.stroke === 1 ? 2 : 0;
      const vascular = v.vascular === 1 ? 1 : 0;
      const diabetes = v.diabetes === 1 ? 1 : 0;
      const score = ageScore + sexScore + chf + htn + stroke + vascular + diabetes;
      
      let risk = score === 0 ? "0%" : score === 1 ? "1.3%" : score === 2 ? "2.2%" : score === 3 ? "3.2%" : "Cao (>4.0%)";

      return { 
        score, 
        interpretation: `Nguy cơ đột quỵ hàng năm: ${risk}.`, 
        details: score >= 2 ? "Khuyến cáo dùng thuốc chống đông đường uống mạnh." : "Cân nhắc chống đông nếu score = 1.",
        color: "bg-blue-700"
      };
    },
    evidence: "Lip GY, et al. Chest. 2010."
  },
  {
    id: 'gfr-ckdepi',
    name: 'Độ lọc cầu thận (CKD-EPI)',
    description: 'Ước tính mức lọc cầu thận eGFR chính xác hơn Cockcroft-Gault.',
    specialties: ['Thận học', 'Nội tiết'],
    inputs: [
      { id: 'age', label: 'Tuổi', type: 'number', defaultValue: 60 },
      { id: 'sex', label: 'Giới tính', type: 'select', options: [{label: 'Nam', value: 1}, {label: 'Nữ', value: 0.742}] },
      { id: 'race', label: 'Chủng tộc', type: 'select', options: [{label: 'Khác', value: 1}, {label: 'Da đen', value: 1.212}] },
      { id: 'creatinine', label: 'Creatinine (mg/dL)', type: 'number', defaultValue: 1.0 },
    ],
    calculate: (v) => {
      const cr = v.creatinine || 1.0;
      const age = v.age || 60;
      const sex = v.sex || 1;
      const race = v.race || 1;
      // Công thức đơn giản hóa cho mục đích học tập
      const score = Math.round(175 * Math.pow(cr, -1.154) * Math.pow(age, -0.203) * sex * race);
      return {
        score,
        interpretation: `eGFR: ${score} mL/min/1.73m².`,
        details: score < 60 ? "Có dấu hiệu suy thận mạn." : "Chức năng thận bình thường.",
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'wells-dvt',
    name: 'Tiêu chuẩn Wells (DVT)',
    description: 'Đánh giá xác suất lâm sàng của huyết khối tĩnh mạch sâu.',
    specialties: ['Tim mạch', 'Hồi sức cấp cứu'],
    inputs: [
      { id: 'cancer', label: 'Ung thư đang tiến triển', type: 'boolean' },
      { id: 'paralysis', label: 'Liệt hoặc mới bó bột chi dưới', type: 'boolean' },
      { id: 'bedridden', label: 'Nằm liệt giường >3 ngày hoặc PT lớn <12 tuần', type: 'boolean' },
      { id: 'tenderness', label: 'Ấn đau dọc hệ tĩnh mạch sâu', type: 'boolean' },
      { id: 'swelling_whole', label: 'Sưng toàn bộ chân', type: 'boolean' },
      { id: 'swelling_calf', label: 'Sưng bắp chân >3cm so với bên kia', type: 'boolean' },
      { id: 'pitting', label: 'Phù ấn lõm bên chân sưng', type: 'boolean' },
      { id: 'collateral', label: 'Tuần hoàn bàng hệ tĩnh mạch nông', type: 'boolean' },
      { id: 'alt_diag', label: 'Chẩn đoán khác có khả năng hơn DVT (-2)', type: 'boolean' },
    ],
    calculate: (v) => {
      let score = Object.values(v).reduce((a, b) => a + (b === 1 ? 1 : 0), 0);
      if (v.alt_diag === 1) score -= 3; // Trừ đi 2 điểm + 1 điểm đã cộng ở reduce = -2
      return {
        score,
        interpretation: score >= 3 ? "Xác suất cao (75%)." : score >= 1 ? "Xác suất trung bình (17%)." : "Xác suất thấp (3%).",
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'nihss',
    name: 'Thang điểm NIHSS (Đột quỵ)',
    description: 'Đánh giá mức độ nặng của đột quỵ cấp.',
    specialties: ['Thần kinh', 'Hồi sức cấp cứu'],
    inputs: [
      { id: 'loc', label: 'Ý thức (Level of Consciousness)', type: 'select', options: [{label: 'Tỉnh táo', value: 0}, {label: 'Lơ mơ', value: 1}, {label: 'U ám', value: 2}, {label: 'Hôn mê', value: 3}] },
      { id: 'gaze', label: 'Vận nhãn', type: 'select', options: [{label: 'Bình thường', value: 0}, {label: 'Liệt liếc một phần', value: 1}, {label: 'Liệt liếc hoàn toàn', value: 2}] },
      { id: 'visual', label: 'Thị trường', type: 'select', options: [{label: 'Bình thường', value: 0}, {label: 'Bán manh một phần', value: 1}, {label: 'Bán manh hoàn toàn', value: 2}, {label: 'Mù hoàn toàn', value: 3}] },
      { id: 'facial', label: 'Liệt mặt', type: 'select', options: [{label: 'Bình thường', value: 0}, {label: 'Liệt nhẹ', value: 1}, {label: 'Liệt trung bình', value: 2}, {label: 'Liệt hoàn toàn', value: 3}] },
      { id: 'motor_arm', label: 'Vận động tay (Bên yếu nhất)', type: 'select', options: [{label: 'Không yếu', value: 0}, {label: 'Rơi tay chậm', value: 1}, {label: 'Không kháng được trọng lực', value: 2}, {label: 'Không cử động được', value: 3}] },
    ],
    calculate: (v) => {
      const score = Object.values(v).reduce((a, b) => a + b, 0);
      return {
        score,
        interpretation: score > 20 ? "Đột quỵ rất nặng." : score >= 15 ? "Đột quỵ nặng." : score >= 5 ? "Đột quỵ trung bình." : "Đột quỵ nhẹ.",
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'lights-criteria',
    name: 'Tiêu chuẩn Light (Dịch màng phổi)',
    description: 'Phân biệt dịch thấm và dịch tiết màng phổi.',
    specialties: ['Hô hấp', 'Hồi sức cấp cứu'],
    inputs: [
      { id: 'prot_ratio', label: 'Protein dịch/máu > 0.5', type: 'boolean' },
      { id: 'ldh_ratio', label: 'LDH dịch/máu > 0.6', type: 'boolean' },
      { id: 'ldh_upper', label: 'LDH dịch > 2/3 giới hạn trên máu', type: 'boolean' },
    ],
    calculate: (v) => {
      const isExudate = v.prot_ratio || v.ldh_ratio || v.ldh_upper;
      return {
        score: isExudate ? 1 : 0,
        interpretation: isExudate ? "DỊCH TIẾT (Exudate)" : "DỊCH THẤM (Transudate)",
        details: "Chỉ cần 1 trong 3 tiêu chuẩn dương tính để chẩn đoán dịch tiết.",
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'sirs',
    name: 'Tiêu chuẩn SIRS',
    description: 'Hội chứng đáp ứng viêm hệ thống.',
    specialties: ['Hồi sức cấp cứu'],
    inputs: [
      { id: 'temp', label: 'Nhiệt độ >38°C hoặc <36°C', type: 'boolean' },
      { id: 'hr', label: 'Nhịp tim >90 lần/phút', type: 'boolean' },
      { id: 'rr', label: 'Nhịp thở >20 hoặc PaCO2 <32 mmHg', type: 'boolean' },
      { id: 'wbc', label: 'Bạch cầu >12k, <4k hoặc >10% dạng non', type: 'boolean' },
    ],
    calculate: (v) => {
      const score = Object.values(v).reduce((a, b) => a + (b === 1 ? 1 : 0), 0);
      return {
        score,
        interpretation: score >= 2 ? "Dương tính với SIRS." : "Âm tính.",
        details: "Cần tìm ổ nhiễm khuẩn nếu SIRS dương tính.",
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'bmi',
    name: 'Chỉ số khối cơ thể (BMI)',
    description: 'Phân loại tình trạng dinh dưỡng (Tiêu chuẩn Châu Á).',
    specialties: ['Nội tiết', 'Nhi khoa'],
    inputs: [
      { id: 'w', label: 'Cân nặng (kg)', type: 'number', defaultValue: 60 },
      { id: 'h', label: 'Chiều cao (cm)', type: 'number', defaultValue: 165 },
    ],
    calculate: (v) => {
      const hM = (v.h || 1) / 100;
      const score = parseFloat(((v.w || 0) / (hM * hM)).toFixed(1));
      let inter = "Bình thường";
      if (score < 18.5) inter = "Thiếu cân";
      else if (score >= 23 && score < 25) inter = "Thừa cân";
      else if (score >= 25) inter = "Béo phì";
      return { score, interpretation: inter, color: "bg-blue-700" };
    }
  },
  {
    id: 'curb-65',
    name: 'Thang điểm CURB-65',
    description: 'Đánh giá độ nặng của viêm phổi cộng đồng.',
    specialties: ['Hô hấp', 'Hồi sức cấp cứu'],
    inputs: [
      { id: 'c', label: 'Lú lẫn', type: 'boolean' },
      { id: 'u', label: 'BUN > 19 mg/dL', type: 'boolean' },
      { id: 'r', label: 'Nhịp thở ≥ 30 lần/phút', type: 'boolean' },
      { id: 'b', label: 'HA < 90/60 mmHg', type: 'boolean' },
      { id: '65', label: 'Tuổi ≥ 65', type: 'boolean' },
    ],
    calculate: (v) => {
      const score = Object.values(v).reduce((a, b) => a + (b === 1 ? 1 : 0), 0);
      return {
        score,
        interpretation: score >= 3 ? "Nặng. Cần nhập viện điều trị tích cực." : score >= 2 ? "Trung bình. Cần nhập viện." : "Nhẹ. Ngoại trú.",
        color: "bg-blue-700"
      };
    }
  }
];

export const SPECIALTIES: Specialty[] = [
  'Tim mạch', 'Hồi sức cấp cứu', 'Nội tiết', 'Tiêu hóa', 'Thận học', 'Thần kinh', 'Sản phụ khoa', 'Nhi khoa', 'Hô hấp'
];