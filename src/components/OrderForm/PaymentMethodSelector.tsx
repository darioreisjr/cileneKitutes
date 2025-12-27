import { Wallet } from 'lucide-react';
import { FaPix, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa6';
import { cn } from '@/lib/utils';

const paymentMethods = [
  { id: 'Pix', label: 'Pix', icon: FaPix },
  { id: 'Dinheiro', label: 'Dinheiro', icon: FaMoneyBillWave },
  { id: 'Cartão', label: 'Cartão', icon: FaCreditCard },
];

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        <Wallet className="w-4 h-4 inline mr-2" />
        Forma de pagamento
      </label>
      <div className="flex gap-2">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <button
              key={method.id}
              onClick={() => onChange(method.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all',
                value === method.id
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
    </div>
  );
}
