import { cn } from '@/lib/utils';

interface ChangeSectionProps {
  needsChange: boolean;
  changeFor: string;
  onNeedsChangeToggle: (value: boolean) => void;
  onChangeForUpdate: (value: string) => void;
}

export function ChangeSection({
  needsChange,
  changeFor,
  onNeedsChangeToggle,
  onChangeForUpdate,
}: ChangeSectionProps) {
  return (
    <div className="space-y-3 animate-fade-in">
      <label className="block text-sm font-medium text-foreground">
        Precisa de troco?
      </label>
      <div className="flex gap-2">
        <button
          onClick={() => {
            onNeedsChangeToggle(false);
            onChangeForUpdate('');
          }}
          className={cn(
            'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
            !needsChange
              ? 'gradient-primary text-primary-foreground shadow-glow'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          )}
        >
          Não
        </button>
        <button
          onClick={() => onNeedsChangeToggle(true)}
          className={cn(
            'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
            needsChange
              ? 'gradient-primary text-primary-foreground shadow-glow'
              : 'bg-secondary text-secondary-foreground hover:bg-muted'
          )}
        >
          Sim
        </button>
      </div>

      {needsChange && (
        <div className="animate-fade-in">
          <label className="block text-xs text-muted-foreground mb-1">
            Troco para quanto?
          </label>
          <input
            type="text"
            value={changeFor}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, '');
              const formatted = value ? `R$ ${(Number(value) / 100).toFixed(2)}` : '';
              onChangeForUpdate(formatted);
            }}
            placeholder="R$ 0,00"
            className={cn(
              "w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all",
              changeFor.length > 0
                ? "focus:ring-green-500/50 border border-green-500/30"
                : "focus:ring-primary/50"
            )}
          />
          {changeFor.length === 0 && (
            <p className="text-xs text-muted-foreground mt-1">Campo obrigatório</p>
          )}
        </div>
      )}
    </div>
  );
}
