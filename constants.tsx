
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
        details: score >= 2 ? "Khuyến cáo dùng thuốc chống đông đường uống mạnh." : "Cân nhắc chống đông nếu score = 1.",
        color: "bg-blue-700"
      };
    },
    evidence: "Lip GY, et al. Chest. 2010."
  },
  {
    id: 'has-bled',
    name: 'Thang điểm HAS-BLED',
    description: 'Đánh giá nguy cơ chảy máu lớn khi dùng chống đông.',
    specialties: ['Tim mạch'],
    inputs: [
      { id: 'htn', label: 'Tăng huyết áp (Tâm thu > 160)', type: 'boolean' },
      { id: 'renal', label: 'Chức năng thận bất thường (Creatinine > 200 µmol/L)', type: 'boolean' },
      { id: 'liver', label: 'Chức năng gan bất thường', type: 'boolean' },
      { id: 'stroke', label: 'Tiền sử đột quỵ', type: 'boolean' },
      { id: 'bleeding', label: 'Tiền sử chảy máu hoặc cơ địa dễ chảy máu', type: 'boolean' },
      { id: 'inr', label: 'INR không ổn định (nếu dùng Warfarin)', type: 'boolean' },
      { id: 'elderly', label: 'Người già (Tuổi > 65)', type: 'boolean' },
      { id: 'drugs', label: 'Dùng thuốc đi kèm (NSAIDs, Kháng tiểu cầu)', type: 'boolean' },
      { id: 'alcohol', label: 'Lạm dụng rượu (>8 ly/tuần)', type: 'boolean' },
    ],
    calculate: (v) => {
      const score = Object.values(v).reduce((a, b) => a + (b === 1 ? 1 : 0), 0);
      return {
        score,
        interpretation: score >= 3 ? "Nguy cơ chảy máu cao. Theo dõi sát." : "Nguy cơ chảy máu thấp/trung bình.",
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'wells-pe',
    name: 'Tiêu chuẩn Wells (Thuyên tắc phổi)',
    description: 'Đánh giá xác suất lâm sàng của Thuyên tắc phổi (PE).',
    specialties: ['Hô hấp', 'Hồi sức cấp cứu'],
    inputs: [
      { id: 'clinical_signs', label: 'Dấu hiệu lâm sàng của DVT', type: 'boolean' },
      { id: 'alt_diagnosis', label: 'Chẩn đoán khác ít khả năng hơn PE', type: 'boolean' },
      { id: 'hr', label: 'Nhịp tim > 100 lần/phút', type: 'boolean' },
      { id: 'immobilization', label: 'Bất động (>3 ngày) hoặc Phẫu thuật lớn trong 4 tuần', type: 'boolean' },
      { id: 'prior_pe_dvt', label: 'Tiền sử PE hoặc DVT', type: 'boolean' },
      { id: 'hemoptysis', label: 'Ho ra máu', type: 'boolean' },
      { id: 'malignancy', label: 'Ung thư đang điều trị hoặc < 6 tháng', type: 'boolean' },
    ],
    calculate: (v) => {
      let score = (v.clinical_signs ? 3 : 0) + (v.alt_diagnosis ? 3 : 0) + (v.hr ? 1.5 : 0) + (v.immobilization ? 1.5 : 0) + (v.prior_pe_dvt ? 1.5 : 0) + (v.hemoptysis ? 1 : 0) + (v.malignancy ? 1 : 0);
      return {
        score,
        interpretation: score > 6 ? "Xác suất cao (>50%)." : score >= 2 ? "Xác suất trung bình (~16%)." : "Xác suất thấp (~1%).",
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'gcs',
    name: 'Thang điểm Hôn mê Glasgow (GCS)',
    description: 'Đánh giá mức độ ý thức ở bệnh nhân chấn thương đầu.',
    specialties: ['Thần kinh', 'Hồi sức cấp cứu'],
    inputs: [
      { id: 'eyes', label: 'Mở mắt', type: 'select', options: [{label: 'Tự nhiên', value: 4}, {label: 'Khi gọi', value: 3}, {label: 'Khi gây đau', value: 2}, {label: 'Không mở', value: 1}] },
      { id: 'verbal', label: 'Lời nói', type: 'select', options: [{label: 'Định hướng đúng', value: 5}, {label: 'Lẫn lộn', value: 4}, {label: 'Từ ngữ sai', value: 3}, {label: 'Âm vô nghĩa', value: 2}, {label: 'Không đáp ứng', value: 1}] },
      { id: 'motor', label: 'Vận động', type: 'select', options: [{label: 'Làm theo lệnh', value: 6}, {label: 'Đúng vị trí đau', value: 5}, {label: 'Rút lui khi đau', value: 4}, {label: 'Gồng cứng', value: 3}, {label: 'Duỗi cứng', value: 2}, {label: 'Không đáp ứng', value: 1}] },
    ],
    calculate: (v) => {
      const score = (v.eyes || 4) + (v.verbal || 5) + (v.motor || 6);
      return {
        score,
        interpretation: score <= 8 ? "Hôn mê nặng (Severe TBI)." : score <= 12 ? "Hôn mê trung bình." : "Bình thường/Nhẹ.",
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'qsofa',
    name: 'Tiêu chuẩn qSOFA',
    description: 'Nhận diện nhanh bệnh nhân có nguy cơ nhiễm khuẩn huyết cao.',
    specialties: ['Hồi sức cấp cứu'],
    inputs: [
      { id: 'mental', label: 'Thay đổi trạng thái tinh thần (GCS < 15)', type: 'boolean' },
      { id: 'rr', label: 'Nhịp thở ≥ 22 lần/phút', type: 'boolean' },
      { id: 'sbp', label: 'Huyết áp tâm thu ≤ 100 mmHg', type: 'boolean' },
    ],
    calculate: (v) => {
      const score = Object.values(v).reduce((a, b) => a + (b === 1 ? 1 : 0), 0);
      return {
        score,
        interpretation: score >= 2 ? "Nguy cơ cao kết cục xấu. Cần đánh giá nhiễm khuẩn huyết." : "Nguy cơ thấp.",
        color: "bg-blue-700"
      };
    }
  },
  {
    id: 'curb-65',
    name: 'Thang điểm CURB-65 (Viêm phổi)',
    description: 'Đánh giá độ nặng của viêm phổi cộng đồng.',
    specialties: ['Hô hấp', 'Hồi sức cấp cứu'],
    inputs: [
      { id: 'c', label: 'Lú lẫn (Confusion)', type: 'boolean' },
      { id: 'u', label: 'BUN > 19 mg/dL (>7 mmol/L)', type: 'boolean' },
      { id: 'r', label: 'Nhịp thở ≥ 30 lần/phút', type: 'boolean' },
      { id: 'b', label: 'HA Tâm thu < 90 hoặc Tâm trương ≤ 60 mmHg', type: 'boolean' },
      { id: '65', label: 'Tuổi ≥ 65', type: 'boolean' },
    ],
    calculate: (v) => {
      const score = Object.values(v).reduce((a, b) => a + (b === 1 ? 1 : 0), 0);
      return {
        score,
        interpretation: score >= 3 ? "Nặng. Cân nhắc nhập ICU." : score >= 2 ? "Trung bình. Nhập viện." : "Nhẹ. Điều trị ngoại trú.",
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
  }
];

export const SPECIALTIES: Specialty[] = [
  'Tim mạch', 'Hồi sức cấp cứu', 'Nội tiết', 'Tiêu hóa', 'Thận học', 'Thần kinh', 'Sản phụ khoa', 'Nhi khoa', 'Hô hấp'
];
