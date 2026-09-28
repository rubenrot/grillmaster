import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { PageHeader, FormField, Button } from '@/components/ui';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { AIService } from '@/services/AIService';
import type { Recipe } from '@/models';

export function CookWithWhatIHavePage() {
  const [ingredients, setIngredients] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<Recipe[]>([]);

  const handleSubmit = async () => {
    const list = ingredients.split(',').map((s) => s.trim()).filter(Boolean);
    if (list.length === 0) return;
    setIsLoading(true);
    try {
      const recipes = await AIService.cookWithWhatIHave(list);
      setResults(recipes);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <PageHeader title="Cocina con lo que tengo" showBack />

      <div className="px-4 flex flex-col gap-4">
        <FormField
          label="Ingredientes disponibles"
          placeholder="Ej. pollo, limón, ajo, romero"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
        />
        <Button size="lg" fullWidth onClick={handleSubmit} disabled={isLoading || !ingredients.trim()}>
          <Sparkles size={18} />
          {isLoading ? 'Buscando ideas…' : 'Dame ideas'}
        </Button>

        {results.length > 0 && (
          <div className="flex flex-col gap-3 mt-2">
            <h2 className="text-xs font-medium text-ashMuted uppercase tracking-wide">Ideas para ti</h2>
            {results.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
