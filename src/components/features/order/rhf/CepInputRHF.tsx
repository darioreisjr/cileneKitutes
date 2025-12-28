import { Control } from 'react-hook-form';
import { MapPin, Loader2, Check } from 'lucide-react';
import { OrderFormData } from '@/schemas/order.schema';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';

interface CepInputRHFProps {
  value: string;
  isLoading: boolean;
  found: boolean;
  onChange: (value: string) => void;
  control: Control<OrderFormData>;
}

export function CepInputRHF({ value, isLoading, found, onChange, control }: CepInputRHFProps) {
  return (
    <FormField
      control={control}
      name="cep"
      render={({ fieldState }) => (
        <FormItem>
          <label className="block text-sm font-medium text-foreground mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            CEP
          </label>
          <FormControl>
            <div className="relative">
              <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder="00000-000"
                maxLength={9}
                className="w-full px-4 py-3 pr-12 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {isLoading && <Loader2 className="w-5 h-5 text-primary animate-spin" />}
                {found && !isLoading && <Check className="w-5 h-5 text-success" />}
              </div>
            </div>
          </FormControl>
          {!fieldState.error && value.length === 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Digite seu CEP para continuar com o endereço
            </p>
          )}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
