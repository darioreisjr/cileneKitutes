import { MapPin } from 'lucide-react';

interface ManualAddressInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ManualAddressInput({ value, onChange }: ManualAddressInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        <MapPin className="w-4 h-4 inline mr-2" />
        Ou digite o endereço completo
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Rua, número, bairro, cidade..."
        className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
    </div>
  );
}
