
import { Calculator, Specialty } from './types';

export const CALCULATORS: Calculator[] = [
  {
    id: 'ckdepi',
    name: 'Phương trình CKD-EPI (2021) - Ước tính GFR',
    description: 'Ước tính mức lọc cầu thận (eGFR) bằng 5 phương trình CKD-EPI khác nhau (bao gồm Creatinine và Cystatin C) từ 2009 đến 2021.',
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
      "Sử dụng Cystatin C (nếu có) để tăng độ chính xác trong trường hợp khối lượng cơ không điển hình."
    ],
    pearls: [
      "Phương trình 2021 là ưu tiên hiện nay vì loại bỏ yếu tố chủng tộc, đảm bảo tính công bằng.",
      "Cystatin C là dấu ấn sinh học ít phụ thuộc vào khối lượng cơ hơn creatinine.",
      "Kết hợp cả Creatinine và Cystatin C cho kết quả eGFR chính xác nhất."
    ],
    whyUse: "CKD-EPI cung cấp bộ công cụ toàn diện nhất để đánh giá GFR, từ các phương trình tiêu chuẩn đến các phương trình chuyên sâu sử dụng Cystatin C.",
    nextSteps: {
      advice: [
        "Phân giai đoạn CKD từ G1 đến G5.",
        "Nếu kết quả eGFR từ creatinine và cystatin C chênh lệch lớn, hãy tìm nguyên nhân gây nhiễu (ví dụ: dùng steroid, bệnh tuyến giáp).",
        "Luôn đánh giá albumin niệu kèm theo."
      ],
      management: [
        {
          title: "PHÂN LOẠI CÁC PHƯƠNG TRÌNH",
          content: "Tùy vào dữ liệu cận lâm sàng có sẵn:",
          bullets: [
            "Creatinine: Tiêu chuẩn, chi phí thấp.",
            "Cystatin C: Chính xác hơn ở người già, người gầy hoặc béo phì.",
            "Kết hợp (Cr-Cys): Khuyến cáo để xác nhận kết quả nếu eGFR Cr nằm trong khoảng 45-59."
          ]
        }
      ]
    },
    evidenceContent: {
      formula: [
        { 
          criteria: "CKD-EPI 2021 (Mới nhất)", 
          points: "Loại bỏ hệ số Da đen để tránh sai lệch lâm sàng." 
        },
        { 
          criteria: "Hệ số κ (Kappa) & α (Alpha)", 
          subCriteria: [
            { label: "Nữ", points: "κ = 0.7" },
            { label: "Nam", points: "κ = 0.9" }
          ]
        }
      ],
      factsFigures: [
        { score: 90, ischemicRisk: "Giai đoạn G1", totalRisk: "Bình thường", survival5yr: "eGFR ≥ 90" },
        { score: 60, ischemicRisk: "Giai đoạn G2", totalRisk: "Giảm nhẹ", survival5yr: "eGFR 60-89" },
        { score: 45, ischemicRisk: "Giai đoạn G3a", totalRisk: "Giảm nhẹ-TB", survival5yr: "eGFR 45-59" },
        { score: 30, ischemicRisk: "Giai đoạn G3b", totalRisk: "Giảm TB-nặng", survival5yr: "eGFR 30-44" },
        { score: 15, ischemicRisk: "Giai đoạn G4", totalRisk: "Giảm nặng", survival5yr: "eGFR 15-29" },
        { score: 0, ischemicRisk: "Giai đoạn G5", totalRisk: "Suy thận", survival5yr: "eGFR < 15" }
      ],
      appraisal: ["CKD-EPI 2021 đã được chứng minh là có độ chính xác tương đương phiên bản 2009 nhưng công bằng hơn cho mọi chủng tộc."]
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
    contributors: ["Trần Hữu Tiến Đạt - phòng KHNV"],
    calculate: (v) => ({ score: 0, interpretation: '', color: '' }) 
  },
  {
    id: 'sofa',
    name: 'Thang điểm SOFA (Đánh giá suy chức năng cơ quan)',
    description: 'Đánh giá mức độ suy chức năng cơ quan và dự báo tử vong ở bệnh nhân hồi sức cấp cứu (ICU).',
    specialties: ['Hồi sức cấp cứu', 'Thận học', 'Tim mạch'],
    inputs: [],
    calculate: (v) => ({ score: 0, interpretation: '', color: '' }) 
  },
  {
    id: 'gcs',
    name: 'Thang điểm Hôn mê Glasgow (GCS)',
    description: 'Đánh giá mức độ ý thức dựa trên đáp ứng của Mắt, Lời nói và Vận động.',
    specialties: ['Hồi sức cấp cứu', 'Thần kinh'],
    inputs: [],
    calculate: (v) => ({ score: 0, interpretation: '', color: '' }) 
  },
  {
    id: 'chads2vasc',
    name: 'Thang điểm CHA₂DS₂-VASc',
    description: 'Đánh giá nguy cơ đột quỵ ở bệnh nhân rung nhĩ không do bệnh van tim.',
    specialties: ['Tim mạch', 'Hồi sức cấp cứu'],
    inputs: [],
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
    calculate: (v) => ({ score: 0, interpretation: '', color: '' }) 
  }
];

export const SPECIALTIES: Specialty[] = [
  'Tim mạch', 'Hồi sức cấp cứu', 'Nội tiết', 'Tiêu hóa', 'Thận học', 'Thần kinh', 'Sản phụ khoa', 'Nhi khoa', 'Hô hấp', 'Ung bướu', 'Ngoại tiết niệu'
];
