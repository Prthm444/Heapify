import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function GetAiResposne(code, problem) {
	console.log("problem given to ai : ", problem);
	const prompt = `
You are an expert coding assistant your job is understanding the problem json that i give u and reviewing user-submitted code .

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



You are talking to the user keep in mind. make sure you use markdown in the response to add extra extra spacing between points .

`;

	try {
		const response = await ai.models.generateContent({
			model: "gemini-2.5-flash",
			contents: [
				{
					role: "user",
					parts: [
						{
							text: `
You are an expert coding assistant. Your task is to analyze the provided problem and the user-submitted code.

Please generate a clear and structured markdown response with properly spaced paragraphs.

---

### Problem:

\`\`\`json
${problem}
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
`,
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
