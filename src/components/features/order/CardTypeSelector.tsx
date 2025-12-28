import { cn } from '@/lib/utils';

interface CardTypeSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function CardTypeSelector({ value, onChange }: CardTypeSelectorProps) {
  return (
    <div className="space-y-3 animate-fade-in">
      <label className="block text-sm font-medium text-foreground">
        Tipo de cartão
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => onChange('Débito')}
          className={cn(
            'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
            value === 'Débito'
              ? 'gradient-primary text-primary-foreground shadow-glow'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          )}
        >
          Débito
        </button>
        <button
          onClick={() => onChange('Crédito')}
          className={cn(
            'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
            value === 'Crédito'
              ? 'gradient-primary text-primary-foreground shadow-glow'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          )}
        >
          Crédito
        </button>
      </div>
    </div>
  );
}
