
import { GoogleGenAI } from "@google/genai";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const createPrompt = (selectedMark: string): string => {
    let markInstruction = '';

    switch (selectedMark) {
        case '1':
            markInstruction = 'The questions are worth 1 mark. For "Fill in the blanks" and "True or False" questions, provide a concise answer of only one to two words. Do not provide any explanations or justifications for 1-mark questions.';
            break;
        case '2':
            markInstruction = 'The questions are worth 2 marks. For each question, provide a clear solution approximately 40 words long.';
            break;
        case '5':
            markInstruction = 'The questions are worth 5 marks. For each question, provide a detailed, step-by-step solution that is approximately 60 words long. Show your work clearly.';
            break;
        case '8':
            markInstruction = 'The questions are worth 8 marks. For each question, provide a comprehensive, in-depth solution that is approximately 100 words long, explaining each step thoroughly and mentioning any relevant formulas or theorems.';
            break;
        default:
            // Default case to handle any unexpected values
            markInstruction = 'For each question, provide a clear and correct solution.';
    }

    return `You are an expert math problem solver. You will be given an image of a math exam paper. Your task is to provide detailed, step-by-step solutions for each question on the paper. The solutions should be clear enough for a student to understand.

${markInstruction}

Analyze the entire paper, identify each question, and then generate the appropriate solution based on the instruction above.

Important instructions:
1. Do not repeat or write out the questions from the paper in your answer. Only provide the solutions, numbered to correspond with the questions.
2. Format your final output in a single markdown block.
3. CRITICAL FORMATTING RULE: Absolutely no LaTeX. Do not use underscores.
4. For fractions, you MUST use the forward slash '/' symbol (e.g., 3/4).
5. For variables that would normally have a subscript, like x₁, you MUST write it as x1 (without the underscore).`;
};


export const generateAnswersFromImage = async (
    base64Image: string,
    mimeType: string,
    selectedMark: string
): Promise<string> => {
    const prompt = createPrompt(selectedMark);

    const imagePart = {
        inlineData: {
            mimeType: mimeType,
            data: base64Image,
        },
    };

    const textPart = {
        text: prompt,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
    });

    return response.text;
};
