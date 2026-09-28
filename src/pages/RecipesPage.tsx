import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, BookOpen } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { PageHeader, EmptyState } from '@/components/ui';
import { FOOD_CATEGORIES } from '@/constants/cookOptions';
import { DIFFICULTY_LEVELS } from '@/constants/recipeOptions';
import { clsx } from '@/utils/clsx';

export function RecipesPage() {
  const { recipes, isLoading } = useRecipes();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [category, setCategory] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [onlyAI, setOnlyAI] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return recipes.filter((recipe) => {
      const matchesQuery =
        !q || recipe.name.toLowerCase().includes(q) || (recipe.cut ?? '').toLowerCase().includes(q);
      const matchesCategory = !category || recipe.category === category;
      const matchesDifficulty = !difficulty || recipe.difficulty === difficulty;
      const matchesFavorite = !onlyFavorites || recipe.isFavorite;
      const matchesAI = !onlyAI || recipe.source === 'ai';
      return matchesQuery && matchesCategory && matchesDifficulty && matchesFavorite && matchesAI;
    });
  }, [recipes, query, category, difficulty, onlyFavorites, onlyAI]);

  return (
    <div className="flex flex-col gap-4 pb-8">
      <PageHeader title="Recetas" />

      <div className="px-4 flex flex-col gap-3">
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ashMuted" />
          <input
            type="search"
            aria-label="Buscar recetas"
            placeholder="Buscar por nombre o corte"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-11 rounded-xl2 border border-border bg-graphite2 pl-10 pr-4 text-ash placeholder:text-ashMuted/60 focus:outline-none focus:ring-2 focus:ring-ember/50"
          />
        </div>

        <div
          className="
            flex gap-2
            overflow-x-auto
            -mx-4 px-4
            scroll-px-4
            scrollbar-hide
            overscroll-x-contain
            touch-pan-x
          "
          role="group"
          aria-label="Filtrar por categoría"
        >
          <FilterChip label="Todas" active={category === null} onClick={() => setCategory(null)} />
          {FOOD_CATEGORIES.map((cat) => (
            <FilterChip
              key={cat.value}
              label={cat.label}
              active={category === cat.value}
              onClick={() => setCategory(cat.value)}
            />
          ))}
        </div>

        <div
          className="
            flex gap-2
            overflow-x-auto
            -mx-4 px-4
            scroll-px-4
            scrollbar-hide
            overscroll-x-contain
            touch-pan-x
          "
          role="group"
          aria-label="Filtrar por dificultad"
        >
          <FilterChip label="Cualquier dificultad" active={difficulty === null} onClick={() => setDifficulty(null)} />
          {DIFFICULTY_LEVELS.map((d) => (
            <FilterChip
              key={d.value}
              label={d.label}
              active={difficulty === d.value}
              onClick={() => setDifficulty(d.value)}
            />
          ))}
        </div>

        <div className="flex gap-2">
          <FilterChip label="Favoritas" active={onlyFavorites} onClick={() => setOnlyFavorites((v) => !v)} />
          <FilterChip label="Generadas por IA" active={onlyAI} onClick={() => setOnlyAI((v) => !v)} />
        </div>
      </div>

      <div className="px-4">
        {!isLoading && filtered.length === 0 ? (
          <EmptyState
            icon={<BookOpen size={26} />}
            title="Sin resultados"
            description="No se han encontrado recetas con esos criterios."
          />
        ) : (
          <div className="grid grid-cols-1 gap-3">
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
