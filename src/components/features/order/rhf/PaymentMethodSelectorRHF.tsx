import { Control } from 'react-hook-form';
import { Wallet } from 'lucide-react';
import { FaPix, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { OrderFormData } from '@/schemas/order.schema';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';

const paymentMethods = [
  { id: 'PIX' as const, label: 'Pix', icon: FaPix },
  { id: 'Dinheiro' as const, label: 'Dinheiro', icon: FaMoneyBillWave },
  { id: 'Cartão' as const, label: 'Cartão', icon: FaCreditCard },
];

interface PaymentMethodSelectorRHFProps {
  control: Control<OrderFormData>;
}

export function PaymentMethodSelectorRHF({ control }: PaymentMethodSelectorRHFProps) {
  return (
    <FormField
      control={control}
      name="paymentMethod"
      render={({ field }) => (
        <FormItem>
          <label className="block text-sm font-medium text-foreground mb-2">
            <Wallet className="w-4 h-4 inline mr-2" />
            Forma de pagamento *
          </label>
          <FormControl>
            <div className="flex gap-2">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => field.onChange(method.id)}
                    className={cn(
                      'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all',
                      field.value === method.id
                        ? 'gradient-primary text-primary-foreground shadow-glow'
                        : 'bg-secondary text-secondary-foreground hover:bg-muted'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{method.label}</span>
                  </button>
                );
              })}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
