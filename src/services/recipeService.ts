import { GoogleGenAI, Type } from "@google/genai";
import type { RecipeData } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
  console.warn("VITE_GEMINI_API_KEY not found, using mock data");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

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

// Mock data for when API key is not available
const mockRecipes: { [key: string]: RecipeData } = {
  "Pancakes": {
    dishName: "Pancakes",
    ingredients: ["Flour", "Eggs", "Milk", "Sugar", "Baking powder", "Salt", "Butter"],
    instructions: [
      "Mix dry ingredients in a bowl",
      "Whisk eggs and milk in another bowl",
      "Combine wet and dry ingredients",
      "Heat pan and add butter",
      "Pour batter and cook until bubbles form",
      "Flip and cook until golden brown"
    ],
    distractors: ["Yeast", "Vanilla extract", "Cream cheese", "Honey", "Cinnamon", "Chocolate chips"]
  },
  "Spaghetti Carbonara": {
    dishName: "Spaghetti Carbonara",
    ingredients: ["Spaghetti", "Eggs", "Parmesan cheese", "Pancetta", "Black pepper", "Salt"],
    instructions: [
      "Cook spaghetti in salted water",
      "Fry pancetta until crispy",
      "Beat eggs with parmesan and pepper",
      "Drain pasta, reserving some water",
      "Mix hot pasta with egg mixture",
      "Add pancetta and serve immediately"
    ],
    distractors: ["Cream", "Garlic", "Onion", "Tomatoes", "Basil", "Olive oil", "Mushrooms"]
  },
  "Chocolate Chip Cookies": {
    dishName: "Chocolate Chip Cookies",
    ingredients: ["Flour", "Butter", "Brown sugar", "White sugar", "Eggs", "Vanilla", "Baking soda", "Salt", "Chocolate chips"],
    instructions: [
      "Cream butter and sugars",
      "Add eggs and vanilla",
      "Mix in dry ingredients",
      "Fold in chocolate chips",
      "Drop onto baking sheet",
      "Bake at 375°F for 9-11 minutes"
    ],
    distractors: ["Milk", "Baking powder", "Cocoa powder", "Nuts", "Oats", "Coconut"]
  }
};

export const generateRecipeAndDistractors = async (dishName: string): Promise<RecipeData> => {
  // If no API key, use mock data
  if (!ai) {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
    const mockRecipe = mockRecipes[dishName];
    if (mockRecipe) {
      return mockRecipe;
    }
    // Fallback mock recipe
    return {
      dishName,
      ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"],
      instructions: ["Step 1", "Step 2", "Step 3"],
      distractors: ["Wrong 1", "Wrong 2", "Wrong 3", "Wrong 4", "Wrong 5"]
    };
  }

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
    // Fallback to mock data on error
    const mockRecipe = mockRecipes[dishName];
    if (mockRecipe) {
      return mockRecipe;
    }
    throw new Error("Failed to generate a recipe from the API.");
  }
};