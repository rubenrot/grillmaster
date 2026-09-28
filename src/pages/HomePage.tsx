import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, Sparkles, ChefHat, Utensils, Flame } from 'lucide-react';
import { useRecipes } from '@/hooks/useRecipes';
import { RecipeCard } from '@/components/recipes/RecipeCard';
import { RecommendationService } from '@/services/RecommendationService';
import { CookSessionRepository } from '@/repositories';
import type { CookSession, Recipe } from '@/models';
import { EmptyState } from '@/components/ui';

const QUICK_ACTIONS = [
  { to: '/generate', label: 'Generar receta', icon: Sparkles },
  { to: '/cook-with-what-i-have', label: 'Tengo estos ingredientes', icon: Utensils },
  { to: '/recipes', label: 'Recomiéndame algo', icon: ChefHat },
  { to: '/ai', label: 'Preguntar a GrillBook AI', icon: Sparkles },
];

export function HomePage() {
  const navigate = useNavigate();
  const { recipes, isLoading } = useRecipes();
  const [query, setQuery] = useState('');
  const [recommended, setRecommended] = useState<Recipe[]>([]);
  const [popular, setPopular] = useState<Recipe[]>([]);
  const [recentSessions, setRecentSessions] = useState<CookSession[]>([]);

  useEffect(() => {
    RecommendationService.recommendedForYou(6).then(setRecommended);
    RecommendationService.popular(6).then(setPopular);
    CookSessionRepository.listRecent(3).then(setRecentSessions);
  }, [recipes.length]);

  const favorites = recipes.filter((r) => r.isFavorite).slice(0, 6);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/recipes?q=${encodeURIComponent(query.trim())}`);
    }
  };

  if (!isLoading && recipes.length === 0) {
    return (
      <div className="flex flex-col min-h-[80vh]">
        <div className="px-4 pt-8">
          <h1 className="text-2xl font-semibold text-ash">GrillBook</h1>
          <p className="text-sm text-ashMuted">¿Qué quieres cocinar hoy?</p>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <EmptyState
            icon={<Flame size={28} />}
            title="Tu asistente de brasa está listo"
            description="Genera tu primera receta con IA o explora el catálogo para empezar."
            action={
              <Link to="/generate" className="text-sm text-ember font-medium">
                Generar receta
              </Link>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-4 pt-8 pb-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold text-ash">GrillBook</h1>
        <p className="text-sm text-ashMuted">¿Qué quieres cocinar hoy?</p>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ashMuted" />
        <input
          type="search"
          aria-label="¿Qué quieres cocinar?"
          placeholder="¿Qué quieres cocinar?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full h-14 rounded-xl2 border border-border bg-graphite2 pl-11 pr-4 text-base text-ash placeholder:text-ashMuted/60 focus:outline-none focus:ring-2 focus:ring-ember/50"
        />
      </form>

      <div className="grid grid-cols-2 gap-3">
        {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex flex-col gap-2 rounded-xl2 border border-border bg-graphite p-4 active:scale-[0.98] transition-transform"
          >
            <Icon size={20} className="text-ember" />
            <span className="text-sm text-ash font-medium">{label}</span>
          </Link>
        ))}
      </div>

      <RecipeSection title="Recomendados para ti" recipes={recommended} />
      <RecipeSection title="Recetas populares" recipes={popular} />
      <RecipeSection title="Tus favoritos" recipes={favorites} />

      {recentSessions.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-medium text-ashMuted uppercase tracking-wide">
            Últimos cocinados
          </h2>
          <p className="text-xs text-ashMuted">
            {recentSessions.length} preparación{recentSessions.length > 1 ? 'es' : ''} reciente
            {recentSessions.length > 1 ? 's' : ''}.
          </p>
        </section>
      )}
    </div>
  );
}

function RecipeSection({ title, recipes }: { title: string; recipes: Recipe[] }) {
  if (recipes.length === 0) return null;
  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-xs font-medium text-ashMuted uppercase tracking-wide">{title}</h2>
      <div
        className="
          flex gap-3
          overflow-x-auto
          -mx-4 px-4
          scroll-px-4
          snap-x snap-mandatory
          scroll-smooth
          overscroll-x-contain
          touch-pan-x
          scrollbar-hide
        "
      >
        {recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            className="shrink-0 w-[78vw] max-w-[240px] snap-start"
          />
        ))}
      </div>
    </section>
  );
}
