
import { GoogleGenAI, Type } from "@google/genai";
import type { RecipeData } from "../types";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    dishName: {
      type: Type.STRING,
      description: "The name of the dish."
    },
    ingredients: {
      type: Type.ARRAY,
      description: "An array of strings, where each string is a correct ingredient for the recipe.",
      items: { type: Type.STRING }
    },
    instructions: {
      type: Type.ARRAY,
      description: "An array of strings, where each string is a step in the cooking instructions.",
      items: { type: Type.STRING }
    },
    distractors: {
      type: Type.ARRAY,
      description: "An array of strings, where each string is a plausible but incorrect ingredient for the recipe. Should have at least 5 items.",
      items: { type: Type.STRING }
    }
  },
  required: ["dishName", "ingredients", "instructions", "distractors"],
};

export const generateRecipeAndDistractors = async (dishName: string): Promise<RecipeData> => {
  try {
    const prompt = `Generate a simple, classic recipe for ${dishName}. Provide the list of correct ingredients, the cooking instructions, and a separate list of plausible but incorrect 'distractor' ingredients someone might mistakenly use. The recipe should be suitable for a beginner cook.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: recipeSchema,
      },
    });
    
    const text = response.text.trim();
    return JSON.parse(text) as RecipeData;
  } catch (error) {
    console.error("Error generating recipe:", error);
    throw new Error("Failed to generate a recipe from the API.");
  }
};
