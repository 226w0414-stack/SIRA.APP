
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY });

export const getAiResponse = async (history: ChatMessage[]) => {
  try {
    // Convertimos nuestro formato de mensajes al formato que espera el SDK de Gemini
    const contents = history.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: "Eres el asistente de Protección Civil de Veracruz. REGLA DE ORO: Tus respuestas no deben superar las 3 líneas. Sé ultra-conciso. Si hay peligro vital, empieza con '¡LLAME AL 911!'. Da pasos de acción directos (ej. 'Aléjese de la zona', 'Corte la energía'). Usa frases cortas. Evita introducciones como 'Entiendo tu preocupación' o saludos largos.",
        temperature: 0.7,
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Lo siento, tuve un problema de conexión. Si es una emergencia grave, por favor llama directamente al 911.";
  }
};
