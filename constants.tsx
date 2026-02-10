
import { Calculator, Specialty } from './types';

export const CALCULATORS: Calculator[] = [
  {
    id: 'ckdepi',
    name: 'Phương trình CKD-EPI (2021) - Ước tính GFR',
    description: 'Ước tính mức lọc cầu thận (eGFR) bằng phương trình CKD-EPI 2021 (không dùng chủng tộc) để chẩn đoán và quản lý bệnh thận mạn.',
    specialties: ['Thận học', 'Hồi sức cấp cứu', 'Tim mạch', 'Nội tiết'],
    inputs: [],
    creator: {
      name: "Andrew S. Levey",
      title: "Trưởng khoa Thận, Trung tâm Y tế Tufts",
      image: "https://www.mdcalc.com/images/creator-portraits/andrew-levey.jpg"
    },
    contributors: ["Trần Hữu Tiến Đạt - phòng KHNV"],
    relatedIds: ['crcl', 'bmi', 'sofa'],
    whenToUse: [
      "Đánh giá chức năng thận ở bệnh nhân có nghi ngờ bệnh thận mạn (CKD).",
      "Sử dụng cho người trưởng thành (≥18 tuổi).",
      "Đây là phương trình ưu tiên hiện nay vì không phụ thuộc vào yếu tố chủng tộc."
    ],
    pearls: [
      "Phương trình 2021 (Creatinine) được khuyến cáo bởi NKF và ASN vì tính công bằng và chính xác cao.",
      "Đối với bệnh nhân có khối lượng cơ cực đoan (quá gầy hoặc quá béo), CrCl hoặc thu thập nước tiểu 24h có thể chính xác hơn.",
      "eGFR có thể không chính xác trong tình trạng suy thận cấp (AKI)."
    ],
    whyUse: "CKD-EPI 2021 là tiêu chuẩn mới nhất giúp loại bỏ sai số liên quan đến chủng tộc trong khi vẫn duy trì độ chính xác cao trong việc phân giai đoạn bệnh thận mạn.",
    nextSteps: {
      advice: [
        "Xác định giai đoạn CKD (G1-G5) dựa trên kết quả.",
        "Kiểm tra albumin niệu để đánh giá đầy đủ nguy cơ tiến triển thận.",
        "Điều chỉnh liều thuốc dựa trên eGFR nếu cần."
      ],
      management: [
        {
          title: "PHÂN ĐỘ BỆNH THẬN MẠN (KDIGO)",
          content: "Dựa trên mức lọc cầu thận (eGFR, mL/min/1.73m²):",
          bullets: [
            "G1: ≥ 90 (Bình thường hoặc cao)",
            "G2: 60-89 (Giảm nhẹ)",
            "G3a: 45-59 (Giảm nhẹ đến trung bình)",
            "G3b: 30-44 (Giảm trung bình đến nặng)",
            "G4: 15-29 (Giảm nặng)",
            "G5: < 15 (Suy thận)"
          ]
        }
      ]
    },
    evidenceContent: {
      formula: [
        { 
          criteria: "Phương trình CKD-EPI 2021 (Creatinine)", 
          points: "eGFR = 142 × min(Scr/κ, 1)ᵅ × max(Scr/κ, 1)⁻¹·²⁰⁰ × 0.9938ᵀᵘổⁱ [× 1.012 nếu là Nữ]" 
        },
        { 
          criteria: "Hằng số (κ, α)", 
          subCriteria: [
            { label: "Nữ", points: "κ = 0.7, α = -0.241" },
            { label: "Nam", points: "κ = 0.9, α = -0.302" }
          ]
        }
      ],
      factsFigures: [
        { score: 90, ischemicRisk: "Giai đoạn G1", totalRisk: "eGFR ≥ 90", survival5yr: "Bình thường hoặc cao" },
        { score: 60, ischemicRisk: "Giai đoạn G2", totalRisk: "eGFR 60-89", survival5yr: "Giảm chức năng nhẹ" },
        { score: 45, ischemicRisk: "Giai đoạn G3a", totalRisk: "eGFR 45-59", survival5yr: "Giảm nhẹ - trung bình" },
        { score: 30, ischemicRisk: "Giai đoạn G3b", totalRisk: "eGFR 30-44", survival5yr: "Giảm trung bình - nặng" },
        { score: 15, ischemicRisk: "Giai đoạn G4", totalRisk: "eGFR 15-29", survival5yr: "Giảm chức năng nặng" },
        { score: 0, ischemicRisk: "Giai đoạn G5", totalRisk: "eGFR < 15", survival5yr: "Suy thận giai đoạn cuối" }
      ],
      appraisal: ["Phương trình 2021 khắc phục được sự đánh giá thấp chức năng thận ở một số nhóm quần thể so với phiên bản 2009."]
    },
    calculate: (v) => ({ score: 0, interpretation: '', color: '' }) 
  },
  {
    id: 'crcl',
    name: 'Độ thanh thải Creatinine (Công thức Cockcroft-Gault)',
    description: 'Ước tính độ thanh thải creatinine để hiệu chỉnh liều thuốc và đánh giá chức năng thận.',
    specialties: ['Thận học', 'Hồi sức cấp cứu', 'Tim mạch', 'Ung bướu'],
    inputs: [],
    creator: {
      name: "Donald W. Cockcroft",
      title: "Giáo sư Y khoa, Đại học Saskatchewan",
      image: "https://www.mdcalc.com/images/creator-portraits/donald-croft.jpg"
    },
    contributors: ["Trần Hữu Tiến Đạt - phòng KHNV", "Calvin Hwang, MD"],
    relatedIds: ['bmi', 'sofa', 'gcs'],
    whenToUse: [
      "Ước tính chức năng thận ổn định để điều chỉnh liều lượng thuốc.",
      "Đánh giá mức lọc cầu thận (eGFR) lâm sàng ở người trưởng thành.",
      "Lưu ý: Không sử dụng nếu chức năng thận thay đổi nhanh (Suy thận cấp)."
    ],
    pearls: [
      "Công thức Cockcroft-Gault ước tính độ thanh thải creatinine (CrCl), xấp xỉ mức lọc cầu thận (GFR).",
      "QUY TẮC CHỌN TRỌNG LƯỢNG (Brown & Winter):",
      "• BMI < 18.5: Sử dụng cân nặng thực tế/tổng.",
      "• BMI 18.5-24.9: Sử dụng cân nặng lý tưởng (IBW).",
      "• BMI ≥ 25: Sử dụng cân nặng hiệu chỉnh (ABW)."
    ],
    whyUse: "Đây là phương trình tiêu chuẩn được FDA và các nhà sản xuất dược phẩm sử dụng để xác định liều lượng thuốc.",
    nextSteps: {
      advice: ["Sử dụng kết quả CrCl để tra cứu liều lượng thuốc.", "Cân nhắc sử dụng CKD-EPI nếu mục tiêu là chẩn đoán bệnh thận mạn."],
      management: [
        {
          title: "HƯỚNG DẪN CHỌN TRỌNG LƯỢNG",
          content: "Dựa trên bảng phân loại BMI:",
          bullets: [
            "Gầy (BMI < 18.5): Dùng Actual BW.",
            "Bình thường (BMI 18.5-24.9): Dùng IBW.",
            "Béo phì (BMI ≥ 25): Dùng Adjusted BW."
          ]
        }
      ]
    },
    evidenceContent: {
      formula: [
        { 
          criteria: "Cockcroft-Gault CrCl (mL/min)", 
          points: "(140 – tuổi) × (cân nặng, kg) × (0.85 nếu là Nữ) / (72 × Cr, mg/dL)" 
        },
        { 
          criteria: "Cân nặng lý tưởng (IBW), phương trình Devine", 
          subCriteria: [
            { label: "Nam (kg)", points: "50 + [ 2.3 × (chiều cao, inches – 60) ]" },
            { label: "Nữ (kg)", points: "45.5 + [ 2.3 × (chiều cao, inches – 60) ]" }
          ]
        },
        { 
          criteria: "Cân nặng hiệu chỉnh (ABW), kg", 
          points: "IBW, kg + 0.4 × (cân nặng thực tế, kg – IBW, kg)" 
        }
      ],
      factsFigures: [
        { score: 1, ischemicRisk: "Nhẹ cân (Underweight)", totalRisk: "BMI < 18.5", survival5yr: "Tính toán sử dụng cân nặng thực tế/tổng (không hiệu chỉnh)." },
        { score: 2, ischemicRisk: "Cân nặng bình thường", totalRisk: "BMI 18.5-24.9", survival5yr: "Tính toán sử dụng cân nặng lý tưởng (IBW), dải kết quả sử dụng cân nặng thực tế." },
        { score: 3, ischemicRisk: "Thừa cân / Béo phì", totalRisk: "BMI ≥ 25", survival5yr: "Tính toán sử dụng cân nặng hiệu chỉnh (ABW), dải kết quả sử dụng cân nặng lý tưởng." }
      ],
      appraisal: ["Công thức này kém chính xác ở các thái cực cân nặng (quá gầy hoặc quá béo) nếu không được chọn trọng lượng phù hợp."]
    },
    calculate: (v) => ({ score: 0, interpretation: '', color: '' }) 
  },
  {
    id: 'sofa',
    name: 'Thang điểm SOFA (Đánh giá suy chức năng cơ quan)',
    description: 'Đánh giá mức độ suy chức năng cơ quan và dự báo tử vong ở bệnh nhân hồi sức cấp cứu (ICU).',
    specialties: ['Hồi sức cấp cứu', 'Thận học', 'Tim mạch'],
    inputs: [],
    creator: {
      name: "Jean-Louis Vincent",
      title: "Giáo sư Y học Hồi sức",
      image: "https://www.mdcalc.com/images/creator-portraits/jean-louis-vincent.jpg"
    },
    contributors: ["Trần Hữu Tiến Đạt - phòng KHNV"],
    relatedIds: ['gcs', 'crcl'],
    calculate: (v) => ({ score: 0, interpretation: '', color: '' }) 
  },
  {
    id: 'gcs',
    name: 'Thang điểm Hôn mê Glasgow (GCS)',
    description: 'Đánh giá mức độ ý thức dựa trên đáp ứng của Mắt, Lời nói và Vận động.',
    specialties: ['Hồi sức cấp cứu', 'Thần kinh'],
    inputs: [],
    creator: {
      name: "Sir Graham Teasdale",
      title: "Giáo sư Phẫu thuật thần kinh",
      image: "https://www.mdcalc.com/images/creator-portraits/graham-teasdale.jpg"
    },
    calculate: (v) => ({ score: 0, interpretation: '', color: '' }) 
  },
  {
    id: 'chads2vasc',
    name: 'Thang điểm CHA₂DS₂-VASc',
    description: 'Đánh giá nguy cơ đột quỵ ở bệnh nhân rung nhĩ không do bệnh van tim.',
    specialties: ['Tim mạch', 'Hồi sức cấp cứu'],
    inputs: [],
    creator: {
      name: "BS. Gregory Lip",
      title: "Giáo sư Y học Tim mạch",
      image: "https://www.mdcalc.com/images/creator-portraits/gregory-lip.jpg"
    },
    calculate: (v) => ({ score: 0, interpretation: '', color: '' }) 
  },
  {
    id: 'bmi',
    name: 'Chỉ số khối cơ thể (BMI) & Diện tích bề mặt (BSA)',
    description: 'Phân loại tình trạng dinh dưỡng và tính toán diện tích bề mặt cơ thể.',
    specialties: ['Nội tiết', 'Tim mạch', 'Ung bướu'],
    inputs: [],
    calculate: (v) => ({ score: 0, interpretation: '', color: '' }) 
  },
  {
    id: 'leibovich-2018',
    name: 'Thang điểm Leibovich 2018 (RCC)',
    description: 'Dự báo tỷ lệ sống sót đặc hiệu cho ung thư tế bào thận (RCC) sau phẫu thuật.',
    specialties: ['Ung bướu', 'Ngoại tiết niệu'],
    inputs: [],
    creator: {
      name: "Bradley Leibovich",
      title: "Bác sĩ Tiết niệu, Mayo Clinic",
      image: "https://www.mdcalc.com/images/creator-portraits/bradley-leibovich.jpg"
    },
    calculate: (v) => ({ score: 0, interpretation: '', color: '' }) 
  }
];

export const SPECIALTIES: Specialty[] = [
  'Tim mạch', 'Hồi sức cấp cứu', 'Nội tiết', 'Tiêu hóa', 'Thận học', 'Thần kinh', 'Sản phụ khoa', 'Nhi khoa', 'Hô hấp', 'Ung bướu', 'Ngoại tiết niệu'
];
