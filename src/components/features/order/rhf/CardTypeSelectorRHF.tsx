import { Control } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { OrderFormData } from '@/schemas/order.schema';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';

interface CardTypeSelectorRHFProps {
  control: Control<OrderFormData>;
}

export function CardTypeSelectorRHF({ control }: CardTypeSelectorRHFProps) {
  return (
    <FormField
      control={control}
      name="cardType"
      render={({ field }) => (
        <FormItem className="space-y-3 animate-fade-in">
          <label className="block text-sm font-medium text-foreground">Tipo de cartão *</label>
          <FormControl>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => field.onChange('Débito')}
                className={cn(
                  'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
                  field.value === 'Débito'
                    ? 'gradient-primary text-primary-foreground shadow-glow'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                )}
              >
                Débito
              </button>
              <button
                type="button"
                onClick={() => field.onChange('Crédito')}
                className={cn(
                  'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
                  field.value === 'Crédito'
                    ? 'gradient-primary text-primary-foreground shadow-glow'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                )}
              >
                Crédito
              </button>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
