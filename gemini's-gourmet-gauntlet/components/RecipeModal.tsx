
import React from 'react';
import { RecipeData } from '../types';

interface RecipeModalProps {
  recipe: RecipeData;
  onPlayAgain: () => void;
}

const RecipeModal: React.FC<RecipeModalProps> = ({ recipe, onPlayAgain }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8 animate-fade-in-up">
        <h2 className="text-4xl font-bold text-green-600 font-brand mb-2 text-center">Success!</h2>
        <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">{recipe.dishName}</h3>

        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <h4 className="text-xl font-bold text-orange-600 mb-3 border-b-2 border-orange-200 pb-2">Ingredients</h4>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>{ingredient}</li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold text-orange-600 mb-3 border-b-2 border-orange-200 pb-2">Instructions</h4>
            <ol className="list-decimal list-inside space-y-3 text-gray-700">
              {recipe.instructions.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={onPlayAgain}
            className="bg-orange-500 text-white font-bold py-3 px-8 rounded-full hover:bg-orange-600 transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-orange-300"
          >
            Cook Another Dish!
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default RecipeModal;
