import { GenerateContentResult } from "@google/generative-ai";
import { Gemini_2_0 } from "./geminiConfig";

const handleErr = (err : string) => {
    console.error(`An error took place during Gemini function : ${err}`);
    return err;
}

export const genericGeminiQuery = async (prompt : string) => {
    try {
        const resp: GenerateContentResult = await Gemini_2_0.generateContent(
          prompt
        );
    
        if (!resp) {
          throw new Error("Couldn't generate response...");
        }
    
        const responseText = resp.response.text();
        console.log(responseText);

    } catch (err) {
        return handleErr(err as string);
    }
}