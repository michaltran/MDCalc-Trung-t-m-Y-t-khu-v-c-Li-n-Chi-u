import { GoogleGenAI } from "@google/genai";

export async function getClinicalContext(calculatorName: string, result: string, score: number) {
  try {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      return "Cấu hình AI chưa sẵn sàng. Vui lòng kiểm tra API Key.";
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Bạn là một bác sĩ cố vấn chuyên môn. Một bệnh nhân có kết quả từ công cụ "${calculatorName}" với số điểm là ${score} (${result}). 
      Hãy giải thích ngắn gọn bằng tiếng Việt:
      1. Ý nghĩa lâm sàng của điểm số này là gì?
      2. Các bước xử trí tiếp theo khuyến cáo (Next steps)?
      3. Những lưu ý quan trọng hoặc cạm bẫy (pitfalls) khi sử dụng thang điểm này?
      
      Trả lời súc tích, chuyên nghiệp theo phong cách y khoa.`,
      config: {
        temperature: 0.7,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Không thể tải phân tích lâm sàng lúc này. Vui lòng thử lại sau.";
  }
}