import React from 'react';

interface IngredientCardProps {
  name: string;
  isSelected: boolean;
  onSelect: (name: string) => void;
}

const IngredientCard: React.FC<IngredientCardProps> = ({ name, isSelected, onSelect }) => {
  const baseClasses = "p-4 rounded-lg shadow-md cursor-pointer transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:shadow-lg flex items-center justify-center text-center min-h-[80px]";
  const selectedClasses = "bg-green-500 text-white ring-4 ring-green-300 scale-105";
  const unselectedClasses = "bg-white text-gray-700 hover:bg-amber-100 hover:shadow-xl";

  return (
    <div
      onClick={() => onSelect(name)}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      <span className="font-semibold text-sm md:text-base">{name}</span>
    </div>
  );
};

export default IngredientCard;