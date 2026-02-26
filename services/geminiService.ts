
import { GoogleGenAI } from "@google/genai";
import { ChatMessage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
        systemInstruction: "Eres un asistente experto de Protección Civil de Veracruz, México. Tu tono es institucional, amable y calmado. Tu prioridad es la seguridad ciudadana. Si el usuario reporta una emergencia vital, indícale que llame al 911 de inmediato. Ayuda con dudas sobre: árboles caídos, cables sueltos, inundaciones, refugios temporales y primeros auxilios básicos. Conoces bien la geografía de Veracruz.",
        temperature: 0.7,
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error fetching AI response:", error);
    return "Lo siento, tuve un problema de conexión. Si es una emergencia grave, por favor llama directamente al 911.";
  }
};
