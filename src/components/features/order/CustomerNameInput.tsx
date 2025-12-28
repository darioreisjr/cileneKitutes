import { User, AlertCircle, CheckCircle } from 'lucide-react';

interface CustomerNameInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function CustomerNameInput({ value, onChange }: CustomerNameInputProps) {
  const isValid = value.trim().length >= 3;
  const showValidation = value.length > 0;

  return (
    <div>
      <label className="block text-sm font-medium text-foreground mb-2">
        <User className="w-4 h-4 inline mr-2" />
        Seu nome *
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Como podemos te chamar?"
          className={`w-full px-4 py-3 pr-12 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all ${
            showValidation
              ? isValid
                ? 'focus:ring-green-500/50 border border-green-500/30'
                : 'focus:ring-red-500/50 border border-red-500/30'
              : 'focus:ring-primary/50'
          }`}
        />
        {showValidation && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-500" />
            )}
          </div>
        )}
      </div>
      {showValidation && !isValid && (
        <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
          <AlertCircle className="w-3 h-3" />
          O nome deve ter pelo menos 3 caracteres
        </p>
      )}
    </div>
  );
}
