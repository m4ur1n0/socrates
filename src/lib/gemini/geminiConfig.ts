import { GoogleGenerativeAI } from "@google/generative-ai"

const gemini_key = process.env.NEXT_GEMINI_KEY

export const GeminiObject = new GoogleGenerativeAI(gemini_key as string);
export const Gemini_2_0 = GeminiObject.getGenerativeModel({
  model: "gemini-2.0-flash",
})
