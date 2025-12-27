import { User } from 'lucide-react';

interface CustomerNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomerNameInput({ value, onChange }: CustomerNameInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        <User className="w-4 h-4 inline mr-2" />
        Seu nome *
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Como podemos te chamar?"
        className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
      />
    </div>
  );
}
