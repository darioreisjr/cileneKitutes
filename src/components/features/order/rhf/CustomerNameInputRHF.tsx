import { Control } from 'react-hook-form';
import { User, AlertCircle, CheckCircle } from 'lucide-react';
import { OrderFormData } from '@/schemas/order.schema';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';

interface CustomerNameInputRHFProps {
  control: Control<OrderFormData>;
}

export function CustomerNameInputRHF({ control }: CustomerNameInputRHFProps) {
  return (
    <FormField
      control={control}
      name="customerName"
      render={({ field, fieldState }) => {
        const isValid = field.value.trim().length >= 3;
        const showValidation = field.value.length > 0;
        const hasError = !!fieldState.error;

        return (
          <FormItem>
            <label className="block text-sm font-medium text-foreground mb-2">
              <User className="w-4 h-4 inline mr-2" />
              Seu nome *
            </label>
            <FormControl>
              <div className="relative">
                <input
                  {...field}
                  type="text"
                  placeholder="Como podemos te chamar?"
                  className={`w-full px-4 py-3 pr-12 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
                    showValidation
                      ? isValid && !hasError
                        ? 'focus:ring-green-500/50 border border-green-500/30'
                        : 'focus:ring-red-500/50 border border-red-500/30'
                      : 'focus:ring-primary/50'
                  }`}
                />
                {showValidation && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {isValid && !hasError ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                  </div>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
