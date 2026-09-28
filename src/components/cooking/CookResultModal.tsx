import { useState } from 'react';
import { Modal, Button, Rating, FormField } from '@/components/ui';
import { COOK_SESSION_RESULT_TAGS } from '@/constants/recipeOptions';
import { clsx } from '@/utils/clsx';

interface CookResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (result: {
    rating: number;
    resultTags: string[];
    notes: string;
    finalInternalTemperature?: number;
  }) => void;
}

export function CookResultModal({ isOpen, onClose, onSubmit }: CookResultModalProps) {
  const [rating, setRating] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [temperature, setTemperature] = useState('');

  const toggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const handleSubmit = () => {
    onSubmit({
      rating,
      resultTags: tags,
      notes,
      finalInternalTemperature: temperature ? Number(temperature) : undefined,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="¿Cómo ha quedado?">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <span className="text-sm text-ashMuted">Valoración</span>
          <Rating value={rating} onChange={setRating} />
        </div>

        <div className="flex flex-col gap-2">
          <span className="text-sm text-ashMuted">Resultado</span>
          <div className="flex flex-wrap gap-2">
            {COOK_SESSION_RESULT_TAGS.map((tag) => (
              <button
                key={tag.value}
                type="button"
                onClick={() => toggleTag(tag.value)}
                className={clsx(
                  'text-xs px-3 py-2 rounded-full border',
                  tags.includes(tag.value)
                    ? 'bg-ember text-carbon border-ember'
                    : 'bg-transparent text-ashMuted border-border',
                )}
              >
                {tag.label}
              </button>
            ))}
          </div>
        </div>

        <FormField
          label="Temperatura interna final"
          type="number"
          suffix="°C"
          value={temperature}
          onChange={(e) => setTemperature(e.target.value)}
        />

        <FormField label="Notas" value={notes} onChange={(e) => setNotes(e.target.value)} />

        <Button size="lg" fullWidth onClick={handleSubmit}>
          Guardar resultado
        </Button>
      </div>
    </Modal>
  );
}
