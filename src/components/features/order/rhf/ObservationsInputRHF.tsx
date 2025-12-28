import { Control } from 'react-hook-form';
import { MessageSquare } from 'lucide-react';
import { OrderFormData } from '@/schemas/order.schema';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';

interface ObservationsInputRHFProps {
  control: Control<OrderFormData>;
}

export function ObservationsInputRHF({ control }: ObservationsInputRHFProps) {
  return (
    <FormField
      control={control}
      name="observations"
      render={({ field }) => (
        <FormItem>
          <label className="block text-sm font-medium text-foreground mb-2">
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Observações (opcional)
          </label>
          <FormControl>
            <textarea
              {...field}
              value={field.value || ''}
              placeholder="Alguma preferência especial?"
              rows={3}
              className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
