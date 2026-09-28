import { useNavigate, useParams, Link } from 'react-router-dom';
import { ChefHat, Star, Bookmark, Play } from 'lucide-react';
import { useRecipe } from '@/hooks/useRecipes';
import { PageHeader, Card, Button } from '@/components/ui';
import { RecipeService } from '@/services/RecipeService';
import { FOOD_CATEGORIES, WOOD_TYPES, FUEL_TYPES } from '@/constants/cookOptions';
import { DIFFICULTY_LEVELS } from '@/constants/recipeOptions';
import { formatTemperature } from '@/utils/format';

function findLabel(list: { value: string; label: string }[], value?: string) {
  return list.find((item) => item.value === value)?.label ?? '—';
}

export function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipe, isLoading, refresh } = useRecipe(id);

  if (isLoading) {
    return <div className="px-4 pt-8 text-ashMuted">Cargando…</div>;
  }

  if (!recipe) {
    return <div className="px-4 pt-8 text-ashMuted">Receta no encontrada.</div>;
  }

  const handleToggleFavorite = async () => {
    await RecipeService.toggleFavorite(recipe.id);
    await refresh();
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <PageHeader
        title={recipe.name}
        subtitle={findLabel(FOOD_CATEGORIES, recipe.category)}
        showBack
        action={
          <button
            type="button"
            aria-label={recipe.isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            onClick={handleToggleFavorite}
            className="p-2"
          >
            <Star size={20} className={recipe.isFavorite ? 'fill-ember text-ember' : 'text-ashMuted'} />
          </button>
        }
      />

      <div className="px-4 flex flex-col gap-4">
        {recipe.description && <p className="text-sm text-ash">{recipe.description}</p>}

        <Card className="grid grid-cols-2 gap-4">
          <Info label="Corte" value={recipe.cut ?? '—'} />
          <Info label="Dificultad" value={findLabel(DIFFICULTY_LEVELS, recipe.difficulty)} />
          <Info label="Prep." value={recipe.prepTime ? `${recipe.prepTime} min` : '—'} />
          <Info label="Cocción" value={recipe.cookingTime ? `${recipe.cookingTime} min` : '—'} />
        </Card>

        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-ashMuted uppercase tracking-wide">Setup BBQ</h2>
          <Card className="grid grid-cols-2 gap-4">
            <Info
              label="Método"
              value={recipe.grillSetup.cookingMethod === 'indirect' ? 'Indirecto' : recipe.grillSetup.cookingMethod === 'direct' ? 'Directo' : 'Mixto'}
            />
            <Info
              label="Temp. BBQ"
              value={
                recipe.grillSetup.grillTemperature
                  ? `${recipe.grillSetup.grillTemperature.min}–${recipe.grillSetup.grillTemperature.max} °C`
                  : '—'
              }
            />
            <Info label="Combustible" value={findLabel(FUEL_TYPES, recipe.grillSetup.fuel)} />
            <Info
              label="Madera"
              value={
                recipe.recommendedWoods?.length
                  ? recipe.recommendedWoods.map((w) => findLabel(WOOD_TYPES, w)).join(', ')
                  : '—'
              }
            />
            <Info label="Temp. interna objetivo" value={formatTemperature(recipe.targetInternalTemperature)} />
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-ashMuted uppercase tracking-wide">Ingredientes</h2>
          <Card className="flex flex-col divide-y divide-border p-0">
            {recipe.ingredients.map((ing) => (
              <div key={ing.id} className="flex items-center justify-between p-3 text-sm">
                <span className="text-ash">
                  {ing.name}
                  {ing.optional && <span className="text-ashMuted text-xs"> (opcional)</span>}
                </span>
                {ing.quantity !== undefined && (
                  <span className="text-ashMuted">
                    {ing.quantity} {ing.unit ?? ''}
                  </span>
                )}
              </div>
            ))}
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-sm font-medium text-ashMuted uppercase tracking-wide">Pasos</h2>
          <div className="flex flex-col gap-2">
            {recipe.steps
              .sort((a, b) => a.order - b.order)
              .map((step) => (
                <Card key={step.id} className="flex gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ember/15 text-ember text-sm font-semibold">
                    {step.order}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-medium text-ash">{step.title}</span>
                    <span className="text-sm text-ashMuted">{step.instruction}</span>
                  </div>
                </Card>
              ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 mt-2">
          <Button size="lg" fullWidth onClick={() => navigate(`/recipes/${recipe.id}/cook`)}>
            <Play size={18} />
            Empezar cocinado
          </Button>
          <div className="grid grid-cols-2 gap-3">
            <Link to={`/recipes/${recipe.id}/adapt`}>
              <Button variant="secondary" fullWidth>
                <ChefHat size={18} />
                Adaptar receta
              </Button>
            </Link>
            <Button variant="secondary" fullWidth onClick={handleToggleFavorite}>
              <Bookmark size={18} className={recipe.isFavorite ? 'fill-ember text-ember' : ''} />
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-xs text-ashMuted">{label}</span>
      <span className="text-sm text-ash font-medium">{value}</span>
    </div>
  );
}
