import { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { PageHeader, EmptyState } from '@/components/ui';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { RecipeService } from '@/services/RecipeService';
import type { Recipe } from '@/models';
import { clsx } from '@/utils/clsx';

type Filter = 'all' | 'favorites' | 'ai' | 'user';

export function SavedPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filter, setFilter] = useState<Filter>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    RecipeService.listAll().then((all: Recipe[]) => {
      setRecipes(all.filter((r: Recipe) => r.isFavorite || r.source !== 'builtin'));
      setIsLoading(false);
    });
  }, []);

  const filtered = recipes.filter((r) => {
    if (filter === 'favorites') return r.isFavorite;
    if (filter === 'ai') return r.source === 'ai';
    if (filter === 'user') return r.source === 'user';
    return true;
  });

  return (
    <div className="flex flex-col gap-4 pb-8">
      <PageHeader title="Guardados" />

      <div className="px-4 flex gap-2 overflow-x-auto pb-1">
        <FilterChip label="Todo" active={filter === 'all'} onClick={() => setFilter('all')} />
        <FilterChip label="Favoritas" active={filter === 'favorites'} onClick={() => setFilter('favorites')} />
        <FilterChip label="Generadas por IA" active={filter === 'ai'} onClick={() => setFilter('ai')} />
        <FilterChip label="Mías" active={filter === 'user'} onClick={() => setFilter('user')} />
      </div>

      <div className="px-4">
        {!isLoading && filtered.length === 0 ? (
          <EmptyState
            icon={<Bookmark size={26} />}
            title="Nada guardado todavía"
            description="Marca recetas como favoritas o genera nuevas con IA para verlas aquí."
          />
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'shrink-0 h-9 px-3 rounded-full text-xs border',
        active ? 'bg-ember text-carbon border-ember' : 'bg-transparent text-ashMuted border-border',
      )}
    >
      {label}
    </button>
  );
}
