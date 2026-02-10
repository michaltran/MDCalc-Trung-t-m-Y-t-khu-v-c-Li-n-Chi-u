// 1. Hãy chắc chắn bạn đã cài thư viện này: npm install @google/generative-ai
import { GoogleGenAI } from "@google/generative-ai";

export async function getClinicalContext(calculatorName: string, result: string, score: number) {
  try {
    // 2. Lấy API Key đúng cách trong Vite
    const apiKey = import.meta.env.VITE_API_KEY;

    if (!apiKey || apiKey === "") {
      console.warn("API Key is missing. AI features will not work.");
      return "Tính năng tư vấn AI chưa được cấu hình API Key. Vui lòng liên hệ quản trị viên (Đạt Đạt) để kích hoạt.";
    }

    // 3. Khởi tạo SDK đúng cú pháp
    // Lưu ý: Truyền trực tiếp apiKey vào, không cần bọc trong object { apiKey: ... }
    const genAI = new GoogleGenAI(apiKey);

    // 4. Chọn model chính xác (gemini-1.5-flash là bản nhanh và rẻ nhất hiện tại)
    const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
            temperature: 0.2, // Cấu hình nằm trong generationConfig
        }
    });

    const prompt = `
      Bạn là một bác sĩ cố vấn cao cấp chuyên về các thang điểm y khoa. 
      Thông tin bệnh nhân:
      - Công cụ sử dụng: ${calculatorName}
      - Kết quả: ${score} điểm
      - Diễn giải: ${result}

      Hãy cung cấp tư vấn lâm sàng ngắn gọn bằng tiếng Việt bao gồm:
      1. Đánh giá nhanh tình trạng: Mức độ nguy hiểm hiện tại.
      2. Hướng xử trí: Các xét nghiệm hoặc can thiệp cần thực hiện ngay.
      3. Cảnh báo lâm sàng: Những điều dễ nhầm lẫn hoặc cần lưu ý thêm ở bệnh nhân này.

      Yêu cầu: Trình bày súc tích, chuyên nghiệp, định dạng dễ nhìn.
    `;

    // 5. Gọi hàm tạo nội dung
    const resultResponse = await model.generateContent(prompt);
    
    // 6. Lấy text đúng cách (text() là một hàm, không phải thuộc tính)
    const responseText = resultResponse.response.text();
    
    return responseText;

  } catch (error) {
    console.error("Gemini AI error:", error);
    return "Hệ thống AI đang bận hoặc gặp lỗi kết nối. Vui lòng thử lại sau.";
  }
}
