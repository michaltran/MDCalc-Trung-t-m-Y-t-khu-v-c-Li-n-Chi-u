
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
    relatedIds: ['has-bled', 'wells-dvt'],
    whenToUse: "Sử dụng cho bệnh nhân rung nhĩ không do bệnh van tim để quyết định điều trị chống đông.",
    pearls: "Giới tính nữ chỉ được tính 1 điểm nếu có ít nhất một yếu tố nguy cơ khác.",
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
      const score = (v.age || 0) + (v.sex || 0) + (v.chf || 0) + (v.htn || 0) + (v.stroke === 1 ? 2 : 0) + (v.vascular || 0) + (v.diabetes || 0);
      let risk = score === 0 ? "0%" : score === 1 ? "1.3%" : score === 2 ? "2.2%" : "Cao (>3.2%)";
      return { 
        score, 
        interpretation: `Nguy cơ đột quỵ hàng năm: ${risk}.`, 
        details: score >= 2 ? "Khuyến cáo dùng thuốc chống đông đường uống." : "Cân nhắc chống đông nếu score = 1.",
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'gcs',
    name: 'Thang điểm Glasgow (GCS)',
    description: 'Đánh giá mức độ tri giác sau chấn thương sọ não.',
    specialties: ['Hồi sức cấp cứu', 'Thần kinh'],
    inputs: [
      { id: 'eye', label: 'Mở mắt (Eye)', type: 'select', options: [
        {label: 'Tự nhiên', value: 4}, {label: 'Khi gọi', value: 3}, {label: 'Khi gây đau', value: 2}, {label: 'Không đáp ứng', value: 1}
      ]},
      { id: 'verbal', label: 'Lời nói (Verbal)', type: 'select', options: [
        {label: 'Đúng hướng', value: 5}, {label: 'Lẫn lộn', value: 4}, {label: 'Vô nghĩa', value: 3}, {label: 'Âm vô nghĩa', value: 2}, {label: 'Không đáp ứng', value: 1}
      ]},
      { id: 'motor', label: 'Vận động (Motor)', type: 'select', options: [
        {label: 'Làm theo lệnh', value: 6}, {label: 'Khu trú đau', value: 5}, {label: 'Đáp ứng lùi tránh', value: 4}, {label: 'Gập cứng', value: 3}, {label: 'Duỗi cứng', value: 2}, {label: 'Không đáp ứng', value: 1}
      ]},
    ],
    calculate: (v) => {
      const score = (v.eye || 1) + (v.verbal || 1) + (v.motor || 1);
      return {
        score,
        interpretation: score <= 8 ? "Hôn mê nặng (Cần đặt NKQ)." : score <= 12 ? "Mức độ trung bình." : "Mức độ nhẹ.",
        color: score <= 8 ? "bg-red-700" : "bg-blue-700"
      };
    }
  },
  {
    id: 'qsofa',
    name: 'Thang điểm qSOFA',
    description: 'Nhận diện nhanh bệnh nhân có nguy cơ nhiễm khuẩn huyết.',
    specialties: ['Hồi sức cấp cứu', 'Hô hấp'],
    inputs: [
      { id: 'rr', label: 'Nhịp thở ≥ 22 lần/phút', type: 'boolean' },
      { id: 'mentation', label: 'Thay đổi ý thức (GCS < 15)', type: 'boolean' },
      { id: 'sbp', label: 'Huyết áp tâm thu ≤ 100 mmHg', type: 'boolean' },
    ],
    calculate: (v) => {
      const score = Object.values(v).reduce((a, b) => a + (b === 1 ? 1 : 0), 0);
      return {
        score,
        interpretation: score >= 2 ? "Nguy cơ cao tử vong hoặc nằm hồi sức kéo dài." : "Nguy cơ thấp.",
        details: "Nếu ≥ 2 điểm, cần đánh giá thang điểm SOFA đầy đủ và tìm ổ nhiễm khuẩn.",
        color: score >= 2 ? "bg-orange-700" : "bg-blue-700"
      };
    }
  },
  {
    id: 'has-bled',
    name: 'Thang điểm HAS-BLED',
    description: 'Đánh giá nguy cơ chảy máu lớn ở bệnh nhân đang dùng chống đông.',
    specialties: ['Tim mạch'],
    inputs: [
      { id: 'h', label: 'Tăng huyết áp (HA tâm thu >160)', type: 'boolean' },
      { id: 'a', label: 'Bất thường chức năng Thận hoặc Gan (+1 mỗi cơ quan)', type: 'select', options: [{label: 'Không', value: 0}, {label: 'Có (1 cơ quan)', value: 1}, {label: 'Có (Cả 2)', value: 2}] },
      { id: 's', label: 'Tiền sử Đột quỵ', type: 'boolean' },
      { id: 'b', label: 'Tiền sử Chảy máu hoặc Xuất huyết', type: 'boolean' },
      { id: 'l', label: 'INR dao động (nếu dùng Warfarin)', type: 'boolean' },
      { id: 'e', label: 'Người già (Tuổi > 65)', type: 'boolean' },
      { id: 'd', label: 'Thuốc kháng tiểu cầu hoặc Rượu (+1 mỗi loại)', type: 'select', options: [{label: 'Không', value: 0}, {label: 'Có (1 loại)', value: 1}, {label: 'Có (Cả 2)', value: 2}] },
    ],
    calculate: (v) => {
      const score = (v.h || 0) + (v.a || 0) + (v.s || 0) + (v.b || 0) + (v.l || 0) + (v.e || 0) + (v.d || 0);
      return {
        score,
        interpretation: score >= 3 ? "Nguy cơ chảy máu CAO." : "Nguy cơ chảy máu thấp/trung bình.",
        details: "Cần thận trọng và theo dõi sát khi dùng chống đông.",
        color: score >= 3 ? "bg-red-800" : "bg-blue-700"
      };
    }
  },
  {
    id: 'anion-gap',
    name: 'Khoảng trống Anion (Anion Gap)',
    description: 'Phân loại toan chuyển hóa.',
    specialties: ['Thận học', 'Hồi sức cấp cứu'],
    inputs: [
      { id: 'na', label: 'Natri (Na+)', type: 'number', defaultValue: 140, unit: 'mEq/L' },
      { id: 'cl', label: 'Clo (Cl-)', type: 'number', defaultValue: 104, unit: 'mEq/L' },
      { id: 'hco3', label: 'Bicarbonate (HCO3-)', type: 'number', defaultValue: 24, unit: 'mEq/L' },
    ],
    calculate: (v) => {
      const score = Math.round((v.na || 0) - ((v.cl || 0) + (v.hco3 || 0)));
      return {
        score,
        interpretation: score > 12 ? "Khoảng trống Anion TĂNG." : "Khoảng trống Anion bình thường.",
        details: "Bình thường: 8-12 mEq/L (nếu không hiệu chỉnh albumin).",
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'bmi',
    name: 'Chỉ số khối cơ thể (BMI)',
    description: 'Phân loại tình trạng dinh dưỡng (Châu Á).',
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
    description: 'Mức độ nặng viêm phổi cộng đồng.',
    specialties: ['Hô hấp', 'Hồi sức cấp cứu'],
    inputs: [
      { id: 'c', label: 'Lú lẫn (Confusion)', type: 'boolean' },
      { id: 'u', label: 'BUN > 19 mg/dL (7 mmol/L)', type: 'boolean' },
      { id: 'r', label: 'Nhịp thở ≥ 30 lần/phút', type: 'boolean' },
      { id: 'b', label: 'Huyết áp < 90/60 mmHg', type: 'boolean' },
      { id: '65', label: 'Tuổi ≥ 65', type: 'boolean' },
    ],
    calculate: (v) => {
      const score = Object.values(v).reduce((a, b) => a + (b === 1 ? 1 : 0), 0);
      return {
        score,
        interpretation: score >= 3 ? "Nặng: Nhập viện/ICU." : score >= 2 ? "Trung bình: Cân nhắc nhập viện." : "Nhẹ: Điều trị ngoại trú.",
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'parkland',
    name: 'Công thức Parkland',
    description: 'Tính lượng dịch truyền trong 24h đầu cho bệnh nhân bỏng.',
    specialties: ['Hồi sức cấp cứu'],
    inputs: [
      { id: 'weight', label: 'Cân nặng (kg)', type: 'number', defaultValue: 70 },
      { id: 'tbsa', label: 'Diện tích bỏng (TBSA %)', type: 'number', defaultValue: 20 },
    ],
    calculate: (v) => {
      const score = 4 * (v.weight || 0) * (v.tbsa || 0);
      return {
        score,
        interpretation: `Tổng dịch truyền (Lactate Ringer): ${score} mL trong 24h.`,
        details: `8h đầu truyền: ${score / 2} mL. 16h tiếp theo truyền: ${score / 2} mL.`,
        color: "bg-blue-700"
      };
    }
  }
];

export const SPECIALTIES: Specialty[] = [
  'Tim mạch', 'Hồi sức cấp cứu', 'Nội tiết', 'Tiêu hóa', 'Thận học', 'Thần kinh', 'Sản phụ khoa', 'Nhi khoa', 'Hô hấp'
];
