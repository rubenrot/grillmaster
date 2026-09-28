import { Link } from 'react-router-dom';
import { Clock, Sparkles, Star } from 'lucide-react';
import type { Recipe } from '@/models';
import { Card } from '@/components/ui';
import { FOOD_CATEGORIES } from '@/constants/cookOptions';
import { DIFFICULTY_LEVELS } from '@/constants/recipeOptions';
import { formatTemperature } from '@/utils/format';

interface RecipeCardProps {
  recipe: Recipe;
  className?: string;
}

export function RecipeCard({ recipe, className }: RecipeCardProps) {
  const categoryLabel = FOOD_CATEGORIES.find((c) => c.value === recipe.category)?.label ?? recipe.category;
  const difficultyLabel = DIFFICULTY_LEVELS.find((d) => d.value === recipe.difficulty)?.label;
  const totalTime = (recipe.prepTime ?? 0) + (recipe.cookingTime ?? 0);

  return (
    <Link to={`/recipes/${recipe.id}`} className={className}>
      <Card className="flex flex-col gap-2 h-full active:scale-[0.99] transition-transform">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="font-semibold text-ash truncate">{recipe.name}</h3>
            <p className="text-xs text-ashMuted">{categoryLabel}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 mt-0.5">
            {recipe.source === 'ai' && (
              <Sparkles size={15} className="text-ember" aria-label="Generada por IA" />
            )}
            {recipe.isFavorite && (
              <Star size={15} className="fill-ember text-ember" aria-label="Favorito" />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-ashMuted">
          {totalTime > 0 && (
            <span className="inline-flex items-center gap-1">
              <Clock size={13} /> {totalTime} min
            </span>
          )}
          {difficultyLabel && <span>{difficultyLabel}</span>}
          <span>{recipe.grillSetup.cookingMethod === 'indirect' ? 'Indirecto' : recipe.grillSetup.cookingMethod === 'direct' ? 'Directo' : 'Mixto'}</span>
          {recipe.targetInternalTemperature !== undefined && (
            <span>{formatTemperature(recipe.targetInternalTemperature)} interior</span>
          )}
        </div>
      </Card>
    </Link>
  );
}
