import { MessageSquare } from 'lucide-react';

interface ObservationsInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ObservationsInput({ value, onChange }: ObservationsInputProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        <MessageSquare className="w-4 h-4 inline mr-2" />
        Observações (opcional)
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Alguma preferência especial?"
        rows={3}
        className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
      />
    </div>
  );
}
