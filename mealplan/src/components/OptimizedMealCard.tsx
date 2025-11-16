import { memo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MealCardProps {
  id: string;
  name: string;
  time?: string;
  servings?: number;
  image?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}

export const OptimizedMealCard = memo(({ 
  id, 
  name, 
  time = '30 min', 
  servings = 1, 
  image = '🍽️',
  onEdit,
  onDelete 
}: MealCardProps) => (
  <Card className="p-3 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-3">
      <div className="text-2xl">{image}</div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium truncate">{name}</h3>
        <p className="text-sm text-muted-foreground">{time} • {servings} serving{servings > 1 ? 's' : ''}</p>
      </div>
      <div className="flex gap-1">
        {onEdit && <Button size="sm" variant="ghost" onClick={onEdit}>Edit</Button>}
        {onDelete && <Button size="sm" variant="ghost" onClick={onDelete}>Delete</Button>}
      </div>
    </div>
  </Card>
));

OptimizedMealCard.displayName = 'OptimizedMealCard';