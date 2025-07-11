import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GetAiResposne(code, problem) {
	const prompt = `
You are an expert coding assistant reviewing user-submitted code .

Review the following code:

${code}

Your response should  may include - you can skip some points if you feel they are obvious:

1. Any potential issues or bugs in the logic or edge cases.
2.  Suggestions for improving the code's performance, readability, or structure.

3. If applicable, mention the language used and any language-specific improvements.
4. be encouraging 

Keep the feedback concise and clear. Do not include explanations for trivial or obvious parts.

this was the question :

${problem}



You are talking to the user keep in mind. ake sure u have proper spacing between points

`;

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: prompt,
		});
		console.log(response.text);
		return response.text;
	} catch (error) {
		console.log("got error while generating response :", error);
	}
}
