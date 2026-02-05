
import { GoogleGenAI } from "@google/genai";

export async function getClinicalContext(calculatorName: string, result: string, score: number) {
  try {
    const apiKey = "AIzaSyBc50Xv4IzEoFEN-WeCaYm1FQ2yAaX41ks";
    if (!apiKey || apiKey === "") {
      console.warn("API Key is missing. AI features will not work.");
      return "Tính năng tư vấn AI chưa được cấu hình API Key. Vui lòng liên hệ quản trị viên (Đạt Đạt) để kích hoạt.";
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bạn là một bác sĩ cố vấn cao cấp chuyên về các thang điểm y khoa. 
      Thông tin bệnh nhân:
      - Công cụ sử dụng: ${calculatorName}
      - Kết quả: ${score} điểm
      - Diễn giải: ${result}

      Hãy cung cấp tư vấn lâm sàng ngắn gọn bằng tiếng Việt bao gồm:
      1. Đánh giá nhanh tình trạng: Mức độ nguy hiểm hiện tại.
      2. Hướng xử trí: Các xét nghiệm hoặc can thiệp cần thực hiện ngay.
      3. Cảnh báo lâm sàng: Những điều dễ nhầm lẫn hoặc cần lưu ý thêm ở bệnh nhân này.

      Yêu cầu: Trình bày súc tích, chuyên nghiệp, định dạng dễ nhìn.`,
      config: {
        temperature: 0.2,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini AI error:", error);
    return "Hệ thống AI đang bận hoặc gặp lỗi kết nối. Vui lòng thử lại sau.";
  }
}
