import { cn } from '@/lib/utils';

const categories = [
  { id: 'todos', label: 'Todos', emoji: '🍽️' },
  { id: 'doces', label: 'Doces', emoji: '🍫' },
  { id: 'salgados', label: 'Salgados', emoji: '🥟' },
  { id: 'massas', label: 'Massas', emoji: '🍝' },
  { id: 'bebidas', label: 'Bebidas', emoji: '🥤' },
  { id: 'combos', label: 'Combos', emoji: '🎁' },
];

interface CategoryChipsProps {
  selected: string;
  onSelect: (category: string) => void;
}

export function CategoryChips({ selected, onSelect }: CategoryChipsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => onSelect(category.id)}
          className={cn(
            'flex items-center gap-2 px-4 py-2.5 rounded-full whitespace-nowrap transition-all duration-300 font-medium text-sm',
            selected === category.id
              ? 'gradient-primary text-primary-foreground shadow-glow'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          )}
        >
          <span>{category.emoji}</span>
          <span>{category.label}</span>
        </button>
      ))}
    </div>
  );
}
