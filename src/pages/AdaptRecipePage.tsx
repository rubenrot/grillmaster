import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { useRecipe } from '@/hooks/useRecipes';
import { useGrills } from '@/hooks/useGrills';
import { PageHeader, FormField, Select, Button } from '@/components/ui';
import { RecipeService } from '@/services/RecipeService';
import { FUEL_TYPES, WOOD_TYPES, COOKING_METHODS, DONENESS_OPTIONS } from '@/constants/cookOptions';
import type { CookingMethod, Doneness, FuelType, WoodType } from '@/models';

export function AdaptRecipePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recipe, isLoading } = useRecipe(id);
  const { grills } = useGrills();

  const [weight, setWeight] = useState('');
  const [thickness, setThickness] = useState('');
  const [grillId, setGrillId] = useState('');
  const [doneness, setDoneness] = useState<Doneness | ''>('');
  const [fuel, setFuel] = useState<FuelType | ''>('');
  const [wood, setWood] = useState<WoodType | ''>('');
  const [cookingMethod, setCookingMethod] = useState<CookingMethod | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isLoading) return <div className="px-4 pt-8 text-ashMuted">Cargando…</div>;
  if (!recipe) return <div className="px-4 pt-8 text-ashMuted">Receta no encontrada.</div>;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const variant = await RecipeService.adaptRecipe(recipe, {
        weight: weight ? Number(weight) : undefined,
        thickness: thickness ? Number(thickness) : undefined,
        grillId: grillId || undefined,
        doneness: doneness || undefined,
        fuel: fuel || undefined,
        wood: wood ? [wood] : undefined,
        cookingMethod: cookingMethod || undefined,
      });
      navigate(`/recipes/${recipe.id}/cook?variant=${variant.id}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <PageHeader title="Adaptar receta" subtitle={recipe.name} showBack />

      <div className="px-4 flex flex-col gap-4">
        <FormField label="Peso" type="number" inputMode="decimal" suffix="g" value={weight} onChange={(e) => setWeight(e.target.value)} />
        <FormField label="Grosor" type="number" inputMode="decimal" suffix="cm" value={thickness} onChange={(e) => setThickness(e.target.value)} />
        <Select
          label="Barbacoa"
          placeholder="Selecciona una barbacoa"
          options={grills.map((g) => ({ value: g.id, label: g.name }))}
          value={grillId}
          onChange={(e) => setGrillId(e.target.value)}
        />
        <Select
          label="Punto de cocción"
          placeholder="Selecciona un punto"
          options={DONENESS_OPTIONS}
          value={doneness}
          onChange={(e) => setDoneness(e.target.value as Doneness)}
        />
        <Select
          label="Combustible"
          placeholder="Selecciona un combustible"
          options={FUEL_TYPES}
          value={fuel}
          onChange={(e) => setFuel(e.target.value as FuelType)}
        />
        <Select
          label="Madera"
          placeholder="Selecciona una madera"
          options={WOOD_TYPES}
          value={wood}
          onChange={(e) => setWood(e.target.value as WoodType)}
        />
        <Select
          label="Método disponible"
          placeholder="Selecciona un método"
          options={COOKING_METHODS}
          value={cookingMethod}
          onChange={(e) => setCookingMethod(e.target.value as CookingMethod)}
        />

        <Button size="lg" fullWidth onClick={handleSubmit} disabled={isSubmitting}>
          <Sparkles size={18} />
          {isSubmitting ? 'Adaptando…' : 'Adaptar con IA'}
        </Button>
      </div>
    </div>
  );
}
