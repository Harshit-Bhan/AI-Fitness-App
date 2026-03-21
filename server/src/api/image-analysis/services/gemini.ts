import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export const analyseImage = async (filePath: string) => {

    try {
        const base64ImageFile = fs.readFileSync(filePath,{
        encoding: "base64",
    });

    const contents = [
        {
            inlineData:{
                mimeType: "image/jpeg",
                data: base64ImageFile,
            },
        },
        { text: "Extract the food name and estimated calories from thos image in a JSON object." },
    ];

    const config = {
        responseMimeType: "application/json",
        responseJsonSchema: {
            type: "object",
            properties: {
                name: { type: "string"},
                calories: { type: "number"},
            }
        }
    }

    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: contents,
        config
    });

    // response.text should be valid JSON matching the schema
    return JSON.parse(response.text)

    } catch (error) {
        console.error("Error analysing image:", error);
        throw new Error("Failed to analyse image");
    }

}
