import { cn } from '@/lib/utils';

interface AddressData {
  logradouro: string;
  bairro: string;
  cidade: string;
}

interface AddressFieldsProps {
  addressData: AddressData;
  streetNumber: string;
  residenceType: string;
  apartmentNumber: string;
  onStreetNumberChange: (value: string) => void;
  onResidenceTypeChange: (value: string) => void;
  onApartmentNumberChange: (value: string) => void;
}

export function AddressFields({
  addressData,
  streetNumber,
  residenceType,
  apartmentNumber,
  onStreetNumberChange,
  onResidenceTypeChange,
  onApartmentNumberChange,
}: AddressFieldsProps) {
  return (
    <div className="space-y-3 animate-fade-in">
      {/* Street (readonly from CEP) */}
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Rua</label>
        <input
          type="text"
          value={addressData.logradouro}
          readOnly
          className="w-full px-4 py-2.5 bg-muted rounded-lg text-foreground text-sm"
        />
      </div>

      {/* Number */}
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Número *</label>
        <input
          type="text"
          value={streetNumber}
          onChange={(e) => onStreetNumberChange(e.target.value)}
          placeholder="123"
          className="w-full px-4 py-2.5 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
        />
      </div>

      {/* Residence Type */}
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Tipo de residência</label>
        <div className="flex gap-2">
          <button
            onClick={() => {
              onResidenceTypeChange('Casa');
              onApartmentNumberChange('');
            }}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm',
              residenceType === 'Casa'
                ? 'gradient-primary text-primary-foreground shadow-glow'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            )}
          >
            Casa
          </button>
          <button
            onClick={() => onResidenceTypeChange('Apartamento')}
            className={cn(
              'flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm',
              residenceType === 'Apartamento'
                ? 'gradient-primary text-primary-foreground shadow-glow'
                : 'bg-secondary text-secondary-foreground hover:bg-muted'
            )}
          >
            Apartamento
          </button>
        </div>
      </div>

      {/* Apartment Number - Only show when Apartamento is selected */}
      {residenceType === 'Apartamento' && (
        <div className="animate-fade-in">
          <label className="block text-xs text-muted-foreground mb-1">Número do apartamento *</label>
          <input
            type="text"
            value={apartmentNumber}
            onChange={(e) => onApartmentNumberChange(e.target.value)}
            placeholder="101, 202, etc."
            className="w-full px-4 py-2.5 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          />
        </div>
      )}

      {/* Neighborhood */}
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Bairro</label>
        <input
          type="text"
          value={addressData.bairro}
          readOnly
          className="w-full px-4 py-2.5 bg-muted rounded-lg text-foreground text-sm"
        />
      </div>

      {/* City */}
      <div>
        <label className="block text-xs text-muted-foreground mb-1">Cidade</label>
        <input
          type="text"
          value={addressData.cidade}
          readOnly
          className="w-full px-4 py-2.5 bg-muted rounded-lg text-foreground text-sm"
        />
      </div>
    </div>
  );
}
