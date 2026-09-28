import { useEffect, useState } from 'react';
import { Flame, Download, Upload, Trash2, ChevronRight } from 'lucide-react';
import { PageHeader, Card, Select } from '@/components/ui';
import { useGrills } from '@/hooks/useGrills';
import { usePreferences } from '@/hooks/usePreferences';
import { PreferencesRepository } from '@/repositories';
import { WOOD_TYPES, FUEL_TYPES } from '@/constants/cookOptions';
import { EXPERIENCE_LEVELS, SMOKE_PREFERENCES } from '@/constants/recipeOptions';
import { exportAllData, importAllData, deleteAllData } from '@/services/dataService';
import type { WoodType, FuelType } from '@/models';
import { clsx } from '@/utils/clsx';

export function ProfilePage() {
  const { grills } = useGrills();
  const { preferences, update } = usePreferences();
  const [availableWoods, setAvailableWoods] = useState<WoodType[]>([]);
  const [availableFuels, setAvailableFuels] = useState<FuelType[]>([]);

  useEffect(() => {
    PreferencesRepository.listAvailableWoods().then((list) => setAvailableWoods(list.map((w) => w.wood)));
    PreferencesRepository.listAvailableFuels().then((list) => setAvailableFuels(list.map((f) => f.fuel)));
  }, []);

  const toggleWood = async (wood: WoodType) => {
    if (availableWoods.includes(wood)) {
      await PreferencesRepository.removeAvailableWood(wood);
      setAvailableWoods((prev) => prev.filter((w) => w !== wood));
    } else {
      await PreferencesRepository.addAvailableWood(wood);
      setAvailableWoods((prev) => [...prev, wood]);
    }
  };

  const toggleFuel = async (fuel: FuelType) => {
    if (availableFuels.includes(fuel)) {
      await PreferencesRepository.removeAvailableFuel(fuel);
      setAvailableFuels((prev) => prev.filter((f) => f !== fuel));
    } else {
      await PreferencesRepository.addAvailableFuel(fuel);
      setAvailableFuels((prev) => [...prev, fuel]);
    }
  };

  const handleExport = async () => {
    const data = await exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `grillbook-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;
      const text = await file.text();
      await importAllData(JSON.parse(text));
      window.location.reload();
    };
    input.click();
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('¿Eliminar todos los datos locales? Esta acción no se puede deshacer.')) return;
    await deleteAllData();
    window.location.reload();
  };

  return (
    <div className="flex flex-col gap-6 pb-8">
      <PageHeader title="Perfil" />

      <div className="px-4 flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-ashMuted uppercase tracking-wide">Mis barbacoas</h2>
          <Card className="flex flex-col divide-y divide-border p-0">
            {grills.length === 0 ? (
              <div className="p-4 text-sm text-ashMuted">No hay barbacoas registradas.</div>
            ) : (
              grills.map((grill) => (
                <div key={grill.id} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Flame size={18} className="text-ember" />
                    <span className="text-sm text-ash">{grill.name}</span>
                  </div>
                  <ChevronRight size={16} className="text-ashMuted" />
                </div>
              ))
            )}
          </Card>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-ashMuted uppercase tracking-wide">Mis maderas</h2>
          <div className="flex flex-wrap gap-2">
            {WOOD_TYPES.map((wood) => (
              <Chip
                key={wood.value}
                label={wood.label}
                active={availableWoods.includes(wood.value)}
                onClick={() => toggleWood(wood.value)}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-ashMuted uppercase tracking-wide">Mis combustibles</h2>
          <div className="flex flex-wrap gap-2">
            {FUEL_TYPES.map((fuel) => (
              <Chip
                key={fuel.value}
                label={fuel.label}
                active={availableFuels.includes(fuel.value)}
                onClick={() => toggleFuel(fuel.value)}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-ashMuted uppercase tracking-wide">Preferencias</h2>
          <Card className="flex flex-col gap-4">
            <Select
              label="Unidad de temperatura"
              options={[
                { value: 'C', label: 'Celsius (°C)' },
                { value: 'F', label: 'Fahrenheit (°F)' },
              ]}
              value={preferences?.temperatureUnit ?? 'C'}
              onChange={(e) => update({ temperatureUnit: e.target.value as 'C' | 'F' })}
            />
            <Select
              label="Unidad de peso"
              options={[
                { value: 'metric', label: 'Métrico (g/kg)' },
                { value: 'imperial', label: 'Imperial (oz/lb)' },
              ]}
              value={preferences?.weightUnit ?? 'metric'}
              onChange={(e) => update({ weightUnit: e.target.value as 'metric' | 'imperial' })}
            />
            <Select
              label="Nivel de experiencia"
              options={EXPERIENCE_LEVELS}
              value={preferences?.experienceLevel ?? 'beginner'}
              onChange={(e) => update({ experienceLevel: e.target.value as never })}
            />
            <Select
              label="Intensidad de ahumado"
              options={SMOKE_PREFERENCES}
              value={preferences?.smokePreference ?? 'medium'}
              onChange={(e) => update({ smokePreference: e.target.value as never })}
            />
          </Card>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-ashMuted uppercase tracking-wide">Datos</h2>
          <Card className="flex flex-col divide-y divide-border p-0">
            <SettingsAction icon={<Download size={18} />} label="Exportar datos" onClick={handleExport} />
            <SettingsAction icon={<Upload size={18} />} label="Importar datos" onClick={handleImport} />
            <SettingsAction icon={<Trash2 size={18} />} label="Eliminar todos los datos" onClick={handleDeleteAll} danger />
          </Card>
        </section>
      </div>
    </div>
  );
}

function Chip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'h-9 px-3 rounded-full text-xs border',
        active ? 'bg-ember text-carbon border-ember' : 'bg-transparent text-ashMuted border-border',
      )}
    >
      {label}
    </button>
  );
}

interface SettingsActionProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

function SettingsAction({ icon, label, onClick, danger }: SettingsActionProps) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-3 p-4 text-left active:bg-graphite2">
      <span className={danger ? 'text-red-400' : 'text-ashMuted'}>{icon}</span>
      <span className={danger ? 'text-red-400 text-sm' : 'text-ash text-sm'}>{label}</span>
    </button>
  );
}
