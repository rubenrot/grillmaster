import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { useRecipe } from '@/hooks/useRecipes';
import { RecipeVariantRepository } from '@/repositories';
import { CookingGuideService, buildGuideSteps } from '@/services/CookingGuideService';
import { PageHeader, Card, Button, TemperatureDisplay } from '@/components/ui';
import { CookResultModal } from '@/components/cooking/CookResultModal';
import type { RecipeStep, RecipeVariant } from '@/models';

export function CookingPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const variantId = searchParams.get('variant') ?? undefined;
  const navigate = useNavigate();

  const { recipe, isLoading } = useRecipe(id);
  const [variant, setVariant] = useState<RecipeVariant | undefined>(undefined);
  const [steps, setSteps] = useState<RecipeStep[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    if (variantId) {
      RecipeVariantRepository.getById(variantId).then((v) => setVariant(v));
    }
  }, [variantId]);

  useEffect(() => {
    if (!recipe) return;
    setSteps(buildGuideSteps(recipe, variant));
  }, [recipe, variant]);

  useEffect(() => {
    if (!recipe || sessionId) return;
    CookingGuideService.startSession(recipe.id, variantId).then((session) => setSessionId(session.id));
  }, [recipe, variantId, sessionId]);

  if (isLoading) return <div className="px-4 pt-8 text-ashMuted">Cargando…</div>;
  if (!recipe) return <div className="px-4 pt-8 text-ashMuted">Receta no encontrada.</div>;
  if (steps.length === 0) return <div className="px-4 pt-8 text-ashMuted">Esta receta no tiene pasos definidos.</div>;

  const step = steps[currentIndex];
  const isLastStep = currentIndex === steps.length - 1;
  const grillTemp = recipe.grillSetup.grillTemperature;

  const handleNext = () => {
    if (isLastStep) {
      setShowResultModal(true);
      return;
    }
    setCurrentIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentIndex((i) => Math.max(i - 1, 0));
  };

  const handleFinish = async (result: {
    rating: number;
    resultTags: string[];
    notes: string;
    finalInternalTemperature?: number;
  }) => {
    if (sessionId) {
      await CookingGuideService.finishSession(sessionId, {
        rating: result.rating,
        resultTags: result.resultTags as never,
        notes: result.notes || undefined,
        finalInternalTemperature: result.finalInternalTemperature,
      });
    }
    navigate(`/recipes/${recipe.id}`, { replace: true });
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <PageHeader title={recipe.name} subtitle={`Paso ${currentIndex + 1} de ${steps.length}`} showBack />

      <div className="px-4 flex flex-col gap-6">
        <Card className="flex flex-col gap-3 py-6">
          <span className="text-xs uppercase tracking-wide text-ashMuted">
            Paso {currentIndex + 1} de {steps.length}
          </span>
          <h2 className="text-lg font-semibold text-ash">{step.title}</h2>
          <p className="text-sm text-ash">{step.instruction}</p>
        </Card>

        <Card className="flex items-center justify-around py-6">
          {grillTemp && (
            <TemperatureDisplay label="BBQ" target={(grillTemp.min + grillTemp.max) / 2} size="lg" />
          )}
          <TemperatureDisplay label="Objetivo" value={step.targetInternalTemperature} size="lg" />
        </Card>

        {step.duration && (
          <Card className="flex flex-col items-center gap-1 py-4">
            <span className="text-xs uppercase tracking-wide text-ashMuted">Duración estimada</span>
            <span className="text-2xl font-semibold text-ash tabular-nums">
              {Math.round(step.duration / 60)} min
            </span>
          </Card>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="lg" onClick={handlePrevious} disabled={currentIndex === 0}>
            <ChevronLeft size={18} />
            Anterior
          </Button>
          <Button size="lg" onClick={handleNext}>
            {isLastStep ? <Flag size={18} /> : <ChevronRight size={18} />}
            {isLastStep ? 'Finalizar' : 'Siguiente'}
          </Button>
        </div>
      </div>

      <CookResultModal isOpen={showResultModal} onClose={() => setShowResultModal(false)} onSubmit={handleFinish} />
    </div>
  );
}
