import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with your API key
const genAI = new GoogleGenerativeAI("AIzaSyBqVOV8quNcRTp03PgY7IjOmVsjHhDpEd8");

// Function to handle employee queries
export const getChatbotResponse = async (query) => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const prompt = `You are an AI chatbot for a secure workplace management system. 
                        Answer employee queries about attendance, leave balance, company policies, 
                        and related workplace concerns.
                        Employee Query: "${query}"`;

        const result = await model.generateContent(prompt);
        return result.response.text(); // Return AI-generated response
    } catch (error) {
        console.error("Error generating chatbot response:", error);
        return "I'm sorry, but I couldn't process your request. Please try again.";
    }
};
