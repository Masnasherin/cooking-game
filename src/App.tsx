import React, { useState, useEffect, useCallback } from 'react';
import { GameState, RecipeData } from './types';
import { generateRecipeAndDistractors } from './services/recipeService';
import IngredientCard from './components/IngredientCard';
import LoadingSpinner from './components/LoadingSpinner';
import RecipeModal from './components/RecipeModal';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const DISHES = [
  "Pancakes",
  "Spaghetti Carbonara",
  "Chocolate Chip Cookies",
  "Classic Omelette",
  "Guacamole",
  "Margarita Pizza",
  "Caesar Salad",
  "French Toast"
];

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.LOADING);
  const [recipe, setRecipe] = useState<RecipeData | null>(null);
  const [allIngredients, setAllIngredients] = useState<string[]>([]);
  const [selectedIngredients, setSelectedIngredients] = useState<Set<string>>(new Set());
  const [feedbackMessage, setFeedbackMessage] = useState<string>('');
  const [currentDishIndex, setCurrentDishIndex] = useState(0);

  const fetchNewRecipe = useCallback(() => {
    setGameState(GameState.LOADING);
    setFeedbackMessage('');
    setSelectedIngredients(new Set());
    
    const dishName = DISHES[currentDishIndex % DISHES.length];
    
    generateRecipeAndDistractors(dishName)
      .then(data => {
        setRecipe(data);
        const combinedIngredients = [...data.ingredients, ...data.distractors];
        setAllIngredients(shuffleArray(combinedIngredients));
        setGameState(GameState.READY_TO_PLAY);
      })
      .catch(err => {
        console.error(err);
        setFeedbackMessage('Oops! The chef is busy. Please try refreshing.');
        setGameState(GameState.ERROR);
      });
  }, [currentDishIndex]);

  useEffect(() => {
    fetchNewRecipe();
  }, [fetchNewRecipe]);

  const handleSelectIngredient = (ingredient: string) => {
    if (gameState !== GameState.READY_TO_PLAY) return;

    setSelectedIngredients(prev => {
      const newSelection = new Set(prev);
      if (newSelection.has(ingredient)) {
        newSelection.delete(ingredient);
      } else {
        newSelection.add(ingredient);
      }
      return newSelection;
    });
    setFeedbackMessage('');
  };

  const handleCheckRecipe = () => {
    if (!recipe) return;

    setGameState(GameState.CHECKING);
    const correctIngredientsSet = new Set(recipe.ingredients);
    
    const isCorrect = selectedIngredients.size === correctIngredientsSet.size &&
                      [...selectedIngredients].every(ing => correctIngredientsSet.has(ing));

    setTimeout(() => {
      if (isCorrect) {
        setGameState(GameState.SUCCESS);
        setFeedbackMessage('');
      } else {
        setFeedbackMessage("That's not quite right. Give it another try!");
        setGameState(GameState.READY_TO_PLAY);
      }
    }, 1000);
  };
  
  const handlePlayAgain = () => {
    setCurrentDishIndex(prev => prev + 1);
  };

  const renderContent = () => {
    switch (gameState) {
      case GameState.LOADING:
        return <LoadingSpinner />;
      case GameState.ERROR:
        return (
          <div className="text-center">
            <p className="text-red-500 font-semibold mb-4">{feedbackMessage}</p>
            <button
              onClick={fetchNewRecipe}
              className="bg-orange-500 text-white font-bold py-3 px-6 rounded-full hover:bg-orange-600 transition-all"
            >
              Try Again
            </button>
          </div>
        );
      case GameState.READY_TO_PLAY:
      case GameState.CHECKING:
      case GameState.SUCCESS:
        if (!recipe) return <LoadingSpinner />;
        return (
          <>
            <div className="text-center mb-8">
              <p className="text-xl text-orange-800 mb-2">Your challenge is...</p>
              <h2 className="text-4xl md:text-5xl font-bold text-orange-600 font-brand mb-4">{recipe.dishName}</h2>
              <p className="text-gray-600 max-w-xl mx-auto">Select all the ingredients you think are needed for this recipe from the list below.</p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
              {allIngredients.map(ing => (
                <IngredientCard 
                  key={ing}
                  name={ing}
                  isSelected={selectedIngredients.has(ing)}
                  onSelect={handleSelectIngredient}
                />
              ))}
            </div>

            {feedbackMessage && (
              <p className="text-center text-red-500 font-semibold mb-4 animate-pulse">{feedbackMessage}</p>
            )}

            <div className="text-center">
              <button
                onClick={handleCheckRecipe}
                disabled={gameState === GameState.CHECKING || selectedIngredients.size === 0}
                className="bg-green-600 text-white font-bold py-4 px-10 rounded-full hover:bg-green-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-300 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100"
              >
                {gameState === GameState.CHECKING ? 'Checking...' : 'Check My Recipe!'}
              </button>
            </div>
            
            {gameState === GameState.SUCCESS && recipe && (
              <RecipeModal recipe={recipe} onPlayAgain={handlePlayAgain} />
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 text-gray-800 flex flex-col items-center justify-center p-4">
      <header className="text-center mb-6">
        <h1 className="text-4xl md:text-6xl font-bold text-orange-900 font-brand">Gemini's Gourmet Gauntlet</h1>
        <p className="text-orange-700 mt-2">Test your culinary knowledge!</p>
      </header>
      
      <main className="bg-amber-100/60 p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-4xl border-2 border-amber-200">
        {renderContent()}
      </main>
      
      <footer className="text-center mt-6 text-sm text-gray-500">
        <p>Recipes and game challenges generated by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;