import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import { PageHeader, FormField, Select, Button } from '@/components/ui';
import { useGrills } from '@/hooks/useGrills';
import { AIService } from '@/services/AIService';
import { RecipeService } from '@/services/RecipeService';
import { FOOD_CATEGORIES, FUEL_TYPES, WOOD_TYPES, COOKING_METHODS, DONENESS_OPTIONS } from '@/constants/cookOptions';
import { DIFFICULTY_LEVELS } from '@/constants/recipeOptions';
import type { CookingMethod, Difficulty, Doneness, FoodCategory, FuelType, WoodType } from '@/models';

export function GenerateRecipePage() {
  const navigate = useNavigate();
  const { grills } = useGrills();

  const [foodName, setFoodName] = useState('');
  const [cut, setCut] = useState('');
  const [weight, setWeight] = useState('');
  const [thickness, setThickness] = useState('');
  const [servings, setServings] = useState('');
  const [category, setCategory] = useState<FoodCategory | ''>('');

  const [ingredients, setIngredients] = useState('');
  const [condiments, setCondiments] = useState('');
  const [fuel, setFuel] = useState<FuelType | ''>('');
  const [wood, setWood] = useState<WoodType | ''>('');

  const [grillId, setGrillId] = useState('');
  const [doneness, setDoneness] = useState<Doneness | ''>('');
  const [cookingMethod, setCookingMethod] = useState<CookingMethod | ''>('');
  const [difficulty, setDifficulty] = useState<Difficulty | ''>('');

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!foodName.trim()) return;
    setIsGenerating(true);
    try {
      const recipe = await AIService.generateRecipe({
        foodName: foodName.trim(),
        cut: cut.trim() || undefined,
        weight: weight ? Number(weight) : undefined,
        thickness: thickness ? Number(thickness) : undefined,
        servings: servings ? Number(servings) : undefined,
        category: category || undefined,
        ingredients: ingredients ? ingredients.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
        condiments: condiments ? condiments.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
        fuel: fuel || undefined,
        wood: wood || undefined,
        grillId: grillId || undefined,
        doneness: doneness || undefined,
        cookingMethod: cookingMethod || undefined,
        difficulty: difficulty || undefined,
      });
      const saved = await RecipeService.saveAIRecipe(recipe);
      navigate(`/recipes/${saved.id}`);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <PageHeader title="Generar receta" subtitle="Con IA" showBack />

      <div className="px-4 flex flex-col gap-6">
        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-medium text-ashMuted uppercase tracking-wide">Qué quieres cocinar</h2>
          <FormField label="Alimento" placeholder="Ej. Chuletón" value={foodName} onChange={(e) => setFoodName(e.target.value)} required />
          <FormField label="Corte (opcional)" value={cut} onChange={(e) => setCut(e.target.value)} />
          <FormField label="Peso" type="number" suffix="g" value={weight} onChange={(e) => setWeight(e.target.value)} />
          <FormField label="Grosor" type="number" suffix="cm" value={thickness} onChange={(e) => setThickness(e.target.value)} />
          <FormField label="Nº personas" type="number" value={servings} onChange={(e) => setServings(e.target.value)} />
          <Select
            label="Categoría"
            placeholder="Selecciona una categoría"
            options={FOOD_CATEGORIES}
            value={category}
            onChange={(e) => setCategory(e.target.value as FoodCategory)}
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-medium text-ashMuted uppercase tracking-wide">Qué tienes</h2>
          <FormField label="Ingredientes (separados por coma)" value={ingredients} onChange={(e) => setIngredients(e.target.value)} />
          <FormField label="Condimentos (separados por coma)" value={condiments} onChange={(e) => setCondiments(e.target.value)} />
          <Select label="Combustible" placeholder="Selecciona" options={FUEL_TYPES} value={fuel} onChange={(e) => setFuel(e.target.value as FuelType)} />
          <Select label="Madera" placeholder="Selecciona" options={WOOD_TYPES} value={wood} onChange={(e) => setWood(e.target.value as WoodType)} />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xs font-medium text-ashMuted uppercase tracking-wide">Cómo quieres cocinar</h2>
          <Select
            label="Barbacoa"
            placeholder="Selecciona una barbacoa"
            options={grills.map((g) => ({ value: g.id, label: g.name }))}
            value={grillId}
            onChange={(e) => setGrillId(e.target.value)}
          />
          <Select label="Punto" placeholder="Selecciona" options={DONENESS_OPTIONS} value={doneness} onChange={(e) => setDoneness(e.target.value as Doneness)} />
          <Select label="Método" placeholder="Selecciona" options={COOKING_METHODS} value={cookingMethod} onChange={(e) => setCookingMethod(e.target.value as CookingMethod)} />
          <Select label="Dificultad" placeholder="Selecciona" options={DIFFICULTY_LEVELS} value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} />
        </section>

        <Button size="lg" fullWidth onClick={handleGenerate} disabled={isGenerating || !foodName.trim()}>
          <Sparkles size={18} />
          {isGenerating ? 'Generando…' : 'Generar receta'}
        </Button>
      </div>
    </div>
  );
}
