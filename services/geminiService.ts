import { GoogleGenAI } from "@google/genai";
import { TRANSLATIONS } from "../constants";
import { KNOWLEDGE_BASE } from "../data/knowledge";
import { Language } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateAIResponse = async (prompt: string, language: Language): Promise<string> => {
  const t = TRANSLATIONS[language];
  const k = KNOWLEDGE_BASE[language];
  
  const SYSTEM_INSTRUCTION = `
You are the AI assistant for RueHan's Portfolio.
Your interface is a Sci-Fi terminal ("RueHan's Portfolio Terminal").
Tone: Robotic, efficient, yet helpful. Mix "Jarvis" with "Cyberpunk Hacker".
Language: You must respond in **${language === 'ko' ? 'Korean' : 'English'}**.

Developer Info:
${t.ABOUT_TEXT}

Detailed Bio & Knowledge Base:
${JSON.stringify(k, null, 2)}

Projects:
${JSON.stringify(t.PROJECTS)}

Rules:
1. Keep answers concise (max 3 sentences) to fit the terminal aesthetic.
2. Summarize skills if asked.
3. Brief mentions of projects if asked.
4. Do NOT use Markdown (bold, headers). Use simple ASCII decorators (>, -) if needed.
5. If the question is off-topic, politely redirect to the portfolio.
6. Use the provided Context to answer personal questions (goals, hobbies, philosophy, etc.).
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        maxOutputTokens: 200,
        thinkingConfig: { thinkingBudget: 0 },
      }
    });

    return response.text || (language === 'ko' ? "데이터 수신 실패." : "Data retrieval failed.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};