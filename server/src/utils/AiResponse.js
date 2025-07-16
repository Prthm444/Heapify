import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GetAiResposne(code, problem) {
	//console.log("problem given to ai : ", problem);
	const prompt = `
You are an expert coding assistant. Your task is to analyze the provided problem and the user-submitted code.

Please generate a clear and structured markdown response with properly spaced paragraphs.

---

### Problem:

\`\`\`json
${JSON.stringify(problem, null, 2)}
\`\`\`
---

### Code:

\`\`\`
${code}
\`\`\`

---

### AI Code Review

Please follow this exact structure in your response:

1. Start each numbered point with a **bold title** followed by a colon.  
   Then add your explanation in a new paragraph, **not on the same line**.

2. Add **a blank line between every paragraph** (two \n s in raw text).

3. Do not use nested lists. Avoid putting multiple sentences in a single paragraph unless necessary.

4. End the review with a **short, motivating message** in its own paragraph.

---

Use markdown formatting with clean, readable output. Do **not** use HTML. Paragraph spacing is important.
`;
	//console.log("prompt is ", prompt);

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: [
				{
					role: "user",
					parts: [
						{
							text: prompt,
						},
					],
				},
			],
		});

		//console.log(response.text);
		return response.text;
	} catch (error) {
		//console.log("got error while generating response :", error);
	}
}
