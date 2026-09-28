import type { KnowledgeItem } from '@/models';

let counter = 0;
function id(): string {
  counter += 1;
  return `knowledge-${counter}`;
}

const now = () => new Date().toISOString();

/**
 * Conocimiento propio de GrillBook para poder probar la knowledge base y el
 * asistente de IA desde el primer momento, sin depender de ningún documento
 * externo. Contenido original y breve, redactado específicamente para este
 * proyecto (no es una copia de ninguna fuente ni libro).
 */
export function buildKnowledgeSeed(): KnowledgeItem[] {
  const timestamp = now();

  const entries: Omit<KnowledgeItem, 'id' | 'createdAt'>[] = [
    {
      title: 'Fuego directo',
      type: 'technique',
      tags: ['direct', 'technique', 'sellado'],
      content:
        'El fuego directo consiste en cocinar el alimento justo encima de las brasas. Es ideal para piezas finas que se cocinan en poco tiempo, como hamburguesas o filetes finos, ya que sella rápidamente el exterior.',
      source: { type: 'grillbook' },
    },
    {
      title: 'Fuego indirecto',
      type: 'technique',
      tags: ['indirect', 'technique'],
      content:
        'El fuego indirecto consiste en colocar el alimento lejos de la fuente de calor directa, cocinándolo por convección con la tapa cerrada. Es la técnica adecuada para piezas gruesas o enteras, como un pollo entero o un costillar.',
      source: { type: 'grillbook' },
    },
    {
      title: 'Dos zonas de calor',
      type: 'fire_management',
      tags: ['two_zone', 'technique'],
      content:
        'Configurar dos zonas consiste en concentrar el combustible en una mitad de la barbacoa y dejar la otra libre. Permite alternar entre calor directo, para sellar, y calor indirecto, para terminar la cocción sin quemar el exterior.',
      source: { type: 'grillbook' },
    },
    {
      title: 'Reverse sear (sellado inverso)',
      type: 'technique',
      tags: ['reverse_sear', 'beef', 'technique'],
      category: 'beef',
      content:
        'El sellado inverso consiste en cocinar primero la pieza en indirecto hasta unos grados por debajo del punto deseado, y terminar con un sellado corto e intenso en directo. Funciona muy bien en piezas gruesas de vacuno.',
      source: { type: 'grillbook' },
    },
    {
      title: 'Low and slow',
      type: 'technique',
      tags: ['low_and_slow', 'smoking', 'pork'],
      category: 'pork',
      content:
        'Low and slow (baja temperatura, larga cocción) mantiene la barbacoa entre 110 y 130 °C durante varias horas. Es la técnica clásica para costillares y otras piezas con colágeno, que se ablandan progresivamente.',
      source: { type: 'grillbook' },
    },
    {
      title: 'Control de temperatura',
      type: 'temperature',
      tags: ['temperature_control', 'vents'],
      content:
        'La temperatura en una barbacoa de carbón se controla principalmente regulando la entrada de aire mediante las rejillas de ventilación. Abrirlas aumenta el flujo de oxígeno y la temperatura; cerrarlas parcialmente la reduce.',
      source: { type: 'grillbook' },
    },
    {
      title: 'Reposo de la carne',
      type: 'tip',
      tags: ['resting', 'juiciness'],
      content:
        'El reposo consiste en dejar la pieza fuera del calor unos minutos antes de cortarla, permitiendo que los jugos concentrados durante la cocción se redistribuyan de forma más uniforme.',
      source: { type: 'grillbook' },
    },
    {
      title: 'Sellado (Maillard)',
      type: 'technique',
      tags: ['searing', 'crust'],
      content:
        'El sellado expone brevemente la superficie del alimento a fuego muy intenso, creando una costra dorada por reacción de Maillard. Puede aplicarse al principio o al final de la cocción según la técnica.',
      source: { type: 'grillbook' },
    },
    {
      title: 'Ahumado ligero',
      type: 'smoking',
      tags: ['smoking', 'wood', 'light'],
      content:
        'Cantidades pequeñas de madera son suficientes para aromatizar un alimento; un exceso de humo puede resultar amargo. El ahumado ligero funciona especialmente bien en cocciones cortas o piezas delicadas.',
      source: { type: 'grillbook' },
    },
    {
      title: 'Maderas suaves para pescado',
      type: 'wood',
      tags: ['wood', 'fish', 'seafood'],
      category: 'fish',
      content:
        'Para pescados y mariscos se recomiendan maderas suaves como el haya o el cerezo, que aportan un aroma delicado sin dominar el sabor natural del producto.',
      source: { type: 'grillbook' },
    },
    {
      title: 'Maderas para vacuno',
      type: 'wood',
      tags: ['wood', 'beef'],
      category: 'beef',
      content:
        'Para vacuno se prefieren maderas de intensidad media o fuerte, como el roble o el nogal americano, que aportan un ahumado presente acorde al sabor intenso de la carne roja.',
      source: { type: 'grillbook' },
    },
    {
      title: 'Carbón vegetal vs briquetas',
      type: 'fuel',
      tags: ['charcoal', 'briquettes'],
      content:
        'El carbón vegetal se enciende más rápido y alcanza temperaturas más altas, pero se consume con mayor rapidez. Las briquetas arden de forma más uniforme y prolongada, ideales para cocciones largas y estables.',
      source: { type: 'grillbook' },
    },
    {
      title: 'Seguridad alimentaria: temperaturas internas',
      type: 'safety',
      tags: ['food_safety', 'internal_temperature'],
      content:
        'Las temperaturas internas mínimas de seguridad varían según el alimento y dependen de la normativa oficial vigente en cada país. Ante cualquier duda, prioriza siempre la fuente oficial sobre cualquier recomendación culinaria.',
      source: { type: 'official' },
    },
  ];

  return entries.map((entry) => ({ ...entry, id: id(), createdAt: timestamp }));
}
