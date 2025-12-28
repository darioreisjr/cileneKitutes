import { Control, UseFormWatch } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { OrderFormData } from '@/schemas/order.schema';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';

interface ChangeSectionRHFProps {
  control: Control<OrderFormData>;
  watch: UseFormWatch<OrderFormData>;
}

export function ChangeSectionRHF({ control, watch }: ChangeSectionRHFProps) {
  const needsChange = watch('needsChange');

  return (
    <div className="space-y-3 animate-fade-in">
      <FormField
        control={control}
        name="needsChange"
        render={({ field }) => (
          <FormItem>
            <label className="block text-sm font-medium text-foreground">
              Precisa de troco?
            </label>
            <FormControl>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    field.onChange(false);
                  }}
                  className={cn(
                    'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
                    !field.value
                      ? 'gradient-primary text-primary-foreground shadow-glow'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  )}
                >
                  Não
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange(true)}
                  className={cn(
                    'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
                    field.value
                      ? 'gradient-primary text-primary-foreground shadow-glow'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  )}
                >
                  Sim
                </button>
              </div>
            </FormControl>
          </FormItem>
        )}
      />

      {needsChange && (
        <FormField
          control={control}
          name="changeFor"
          render={({ field, fieldState }) => (
            <FormItem className="animate-fade-in">
              <label className="block text-xs text-muted-foreground mb-1">
                Troco para quanto? *
              </label>
              <FormControl>
                <input
                  type="text"
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    const formatted = value ? `R$ ${(Number(value) / 100).toFixed(2)}` : '';
                    field.onChange(formatted);
                  }}
                  placeholder="R$ 0,00"
                  className={cn(
                    'w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all',
                    field.value && field.value.length > 0 && !fieldState.error
                      ? 'focus:ring-green-500/50 border border-green-500/30'
                      : fieldState.error
                        ? 'focus:ring-red-500/50 border border-red-500/30'
                        : 'focus:ring-primary/50'
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
}
