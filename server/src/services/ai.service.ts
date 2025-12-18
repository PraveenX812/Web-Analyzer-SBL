import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function askAI(context: string, question: string): Promise<string> {
    if (!genAI) throw new Error("key error");

    const models = ["gemini-1.5-flash", "gemini-pro", "gemini-flash-latest"];

    const prompt = `You are a helpful assistant. I will provide you with the text content of a website and a question.
    Please answer the question based strictly on the provided context.
    
    Context: ${context}

    Question: ${question}
    
    Answer:
    `;

    for (const modelName of models) {
        try {
            console.log(`Attempting to use AI model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(prompt);
            const response = await result.response;
            return response.text();
        } catch (error: any) {
            console.warn(`Model ${modelName} failed: ${error.message.split(' ')[0]}...`); 
            if (modelName === models[models.length - 1]) {
                throw error;
            }
        }
    }

    throw new Error("All AI models failed.");
}
