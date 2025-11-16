import React from 'react';
import { MealCard } from './MealCard';
import { Coffee, Utensils, Moon } from 'lucide-react';

export const WeekMealCards: React.FC = () => {
  const meals = [
    {
      id: 1,
      mealType: 'Breakfast',
      mealName: 'Coffee with toasts',
      icon: <Coffee className="text-primary" />
    },
    {
      id: 2,
      mealType: 'Lunch',
      mealName: 'Grilled chicken salad',
      icon: <Utensils className="text-primary" />
    },
    {
      id: 3,
      mealType: 'Dinner',
      mealName: 'Pasta with vegetables',
      icon: <Moon className="text-primary" />
    }
  ];

  const handleEdit = (mealId: number) => {
    // TODO: Implement edit functionality
  };

  const handleDelete = (mealId: number) => {
    // TODO: Implement delete functionality
  };

  return (
    <div className="space-y-3">
      {meals.map((meal) => (
        <MealCard
          key={meal.id}
          mealType={meal.mealType}
          mealName={meal.mealName}
          icon={meal.icon}
          onEdit={() => handleEdit(meal.id)}
          onDelete={() => handleDelete(meal.id)}
        />
      ))}
    </div>
  );
};