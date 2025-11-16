import React from 'react';
import { Trash2, Edit3 } from 'lucide-react';
import { AnimatedChef } from '@/components/AnimatedChef';

interface MealCardProps {
  mealType: string;
  mealName: string;
  icon: React.ReactNode;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  mealType,
  mealName,
  icon,
  onEdit,
  onDelete
}) => {
  return (
    <div className="bg-white border border-border rounded-[1.25rem] p-4 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 animate-fade-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-2xl hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-primary text-primary-foreground font-heading font-bold text-xs px-2 py-1 rounded-md">
                {mealType}
              </span>
            </div>
            <p className="font-sans text-sm text-gray-700">
              {mealName}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-destructive transition-colors duration-200"
          >
            <Trash2 size={16} />
          </button>
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-primary transition-colors duration-200"
          >
            <Edit3 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};