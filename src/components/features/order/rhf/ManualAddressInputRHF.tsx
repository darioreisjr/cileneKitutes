import { Control } from 'react-hook-form';
import { MapPin } from 'lucide-react';
import { OrderFormData } from '@/schemas/order.schema';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';

interface ManualAddressInputRHFProps {
  control: Control<OrderFormData>;
}

export function ManualAddressInputRHF({ control }: ManualAddressInputRHFProps) {
  return (
    <FormField
      control={control}
      name="address"
      render={({ field }) => (
        <FormItem>
          <label className="block text-sm font-medium text-foreground mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Ou digite o endereço completo *
          </label>
          <FormControl>
            <input
              {...field}
              type="text"
              placeholder="Rua, número, bairro, cidade..."
              className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
