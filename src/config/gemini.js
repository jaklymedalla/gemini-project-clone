import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
});

const runGeminiChat = async (prompt) => {
    // Switching to standard generateContent reduces hidden multi-step API calls
    const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite', // Flash has much higher free limits than Pro Preview
        contents: prompt,
        config: {
            temperature: 1,
            // If you want Google Search, you can uncomment below:
            // tools: [{ googleSearch: {} }] 
        }
    });

    return response.text;
};

export default runGeminiChat;




