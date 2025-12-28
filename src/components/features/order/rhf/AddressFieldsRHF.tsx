import { Control, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { cn } from '@/lib/utils';
import { OrderFormData } from '@/schemas/order.schema';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';

interface AddressData {
  logradouro: string;
  bairro: string;
  cidade: string;
}

interface AddressFieldsRHFProps {
  addressData: AddressData;
  control: Control<OrderFormData>;
  watch: UseFormWatch<OrderFormData>;
  setValue: UseFormSetValue<OrderFormData>;
}

export function AddressFieldsRHF({
  addressData,
  control,
  watch,
  setValue,
}: AddressFieldsRHFProps) {
  const residenceType = watch('residenceType');

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
      <FormField
        control={control}
        name="streetNumber"
        render={({ field, fieldState }) => (
          <FormItem>
            <label className="block text-xs text-muted-foreground mb-1">Número *</label>
            <FormControl>
              <input
                {...field}
                type="text"
                placeholder="123"
                className={cn(
                  'w-full px-4 py-2.5 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all text-sm',
                  field.value.length > 0 && !fieldState.error
                    ? 'focus:ring-green-500/50 border border-green-500/30'
                    : fieldState.error
                      ? 'focus:ring-red-500/50 border border-red-500/30'
                      : 'focus:ring-primary/50'
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Residence Type */}
      <FormField
        control={control}
        name="residenceType"
        render={({ field }) => (
          <FormItem>
            <label className="block text-xs text-muted-foreground mb-1">
              Tipo de residência *
            </label>
            <FormControl>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    field.onChange('Casa');
                    setValue('apartmentNumber', '');
                  }}
                  className={cn(
                    'flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm',
                    field.value === 'Casa'
                      ? 'gradient-primary text-primary-foreground shadow-glow'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  )}
                >
                  Casa
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange('Apartamento')}
                  className={cn(
                    'flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm',
                    field.value === 'Apartamento'
                      ? 'gradient-primary text-primary-foreground shadow-glow'
                      : 'bg-secondary text-secondary-foreground hover:bg-muted'
                  )}
                >
                  Apartamento
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Apartment Number - Only show when Apartamento is selected */}
      {residenceType === 'Apartamento' && (
        <FormField
          control={control}
          name="apartmentNumber"
          render={({ field, fieldState }) => (
            <FormItem className="animate-fade-in">
              <label className="block text-xs text-muted-foreground mb-1">
                Número do apartamento *
              </label>
              <FormControl>
                <input
                  {...field}
                  value={field.value || ''}
                  type="text"
                  placeholder="101, 202, etc."
                  className={cn(
                    'w-full px-4 py-2.5 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 transition-all text-sm',
                    field.value && field.value.length > 0 && !fieldState.error
                      ? 'focus:ring-green-500/50 border border-green-500/30'
                      : fieldState.error
                        ? 'focus:ring-red-500/50 border border-red-500/30'
                        : 'focus:ring-primary/50'
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
