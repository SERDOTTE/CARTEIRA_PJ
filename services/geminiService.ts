
import { GoogleGenAI } from "@google/genai";
import { Interaction } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("Gemini API key not found. Summarization feature will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const summarizeInteractions = async (interactions: Interaction[]): Promise<string> => {
  if (!API_KEY) {
    return "A chave da API Gemini não está configurada. Não é possível gerar o resumo.";
  }
  
  if (interactions.length === 0) {
    return "Nenhuma interação registrada para resumir.";
  }

  const formattedInteractions = interactions.map(i => 
    `- Data do Contato: ${i.contactDate}\n  Anotações: ${i.notes}\n  Acompanhamento: ${i.followUpDate}`
  ).join('\n\n');

  const prompt = `
    Resuma as seguintes interações com um cliente de forma concisa e objetiva. 
    Destaque os pontos principais e o sentimento geral das conversas.
    O resumo deve ser em português.

    Histórico de Interações:
    ${formattedInteractions}
  `;

  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Ocorreu um erro ao tentar gerar o resumo. Por favor, tente novamente.";
  }
};
