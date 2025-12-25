import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { MapPin, User, MessageSquare, Loader2, Check, Wallet } from 'lucide-react';
import { FaPix, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { fetchAddressByCep, formatCep, formatFullAddress } from '@/utils/cep';
import { toast } from 'sonner';

const paymentMethods = [
  { id: 'Pix', label: 'Pix', icon: FaPix },
  { id: 'Dinheiro', label: 'Dinheiro', icon: FaMoneyBillWave },
  { id: 'Cartão', label: 'Cartão', icon: FaCreditCard },
];

const STORAGE_KEY = 'sabor-fome-address-data';

export function OrderForm() {
  const { state, setCustomerName, setPaymentMethod, setObservations, setAddress, setNeedsChange, setChangeFor, setCardType, setResidenceType, setApartmentNumber, setStreetNumber } = useCart();

  // Load saved address data from localStorage
  const loadSavedAddressData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  const savedData = loadSavedAddressData();

  const [cep, setCep] = useState(savedData?.cep || '');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepFound, setCepFound] = useState(!!savedData?.addressData);
  const [addressData, setAddressData] = useState<{
    logradouro: string;
    bairro: string;
    cidade: string;
  } | null>(savedData?.addressData || null);

  // Load saved residence type, apartment number and street number on mount
  useEffect(() => {
    if (savedData?.residenceType) {
      setResidenceType(savedData.residenceType);
    }
    if (savedData?.apartmentNumber) {
      setApartmentNumber(savedData.apartmentNumber);
    }
    if (savedData?.numero) {
      setStreetNumber(savedData.numero);
    }
  }, []);

  // Save address data to localStorage whenever it changes
  useEffect(() => {
    const dataToSave = {
      cep,
      numero: state.streetNumber,
      addressData,
      residenceType: state.residenceType,
      apartmentNumber: state.apartmentNumber,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [cep, state.streetNumber, addressData, state.residenceType, state.apartmentNumber]);

  // Update full address when components change
  useEffect(() => {
    if (addressData) {
      const parts = [
        addressData.logradouro,
        state.streetNumber ? `nº ${state.streetNumber}` : '',
        state.residenceType === 'Apartamento' && state.apartmentNumber ? `Apto ${state.apartmentNumber}` : '',
        addressData.bairro,
        addressData.cidade,
      ].filter(Boolean);
      setAddress(parts.join(', '));
    }
  }, [addressData, state.streetNumber, state.residenceType, state.apartmentNumber, setAddress]);

  const handleCepChange = async (value: string) => {
    const formatted = formatCep(value);
    setCep(formatted);
    setCepFound(false);
    setAddressData(null);

    const cleanCep = value.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      const data = await fetchAddressByCep(cleanCep);
      setIsLoadingCep(false);

      if (data) {
        setCepFound(true);
        setAddressData({
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: `${data.localidade} - ${data.uf}`,
        });
        toast.success('Endereço encontrado!');
      } else {
        toast.error('CEP não encontrado');
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Customer Name */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <User className="w-4 h-4 inline mr-2" />
          Seu nome *
        </label>
        <input
          type="text"
          value={state.customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          placeholder="Como podemos te chamar?"
          className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Payment Method */}
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
                onClick={() => setPaymentMethod(method.id)}
                className={cn(
                  'flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all',
                  state.paymentMethod === method.id
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

      {/* Change Section - Only show when Dinheiro is selected */}
      {state.paymentMethod === 'Dinheiro' && (
        <div className="space-y-3 animate-fade-in">
          <label className="block text-sm font-medium text-foreground">
            Precisa de troco?
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setNeedsChange(false);
                setChangeFor('');
              }}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
                !state.needsChange
                  ? 'gradient-primary text-primary-foreground shadow-glow'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              )}
            >
              Não
            </button>
            <button
              onClick={() => setNeedsChange(true)}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
                state.needsChange
                  ? 'gradient-primary text-primary-foreground shadow-glow'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              )}
            >
              Sim
            </button>
          </div>

          {/* Change For Amount - Only show when needsChange is true */}
          {state.needsChange && (
            <div className="animate-fade-in">
              <label className="block text-xs text-muted-foreground mb-1">
                Troco para quanto?
              </label>
              <input
                type="text"
                value={state.changeFor}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  const formatted = value ? `R$ ${(Number(value) / 100).toFixed(2)}` : '';
                  setChangeFor(formatted);
                }}
                placeholder="R$ 0,00"
                className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          )}
        </div>
      )}

      {/* Card Type Section - Only show when Cartão is selected */}
      {state.paymentMethod === 'Cartão' && (
        <div className="space-y-3 animate-fade-in">
          <label className="block text-sm font-medium text-foreground">
            Tipo de cartão
          </label>
          <div className="flex gap-2">
            <button
              onClick={() => setCardType('Débito')}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
                state.cardType === 'Débito'
                  ? 'gradient-primary text-primary-foreground shadow-glow'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              )}
            >
              Débito
            </button>
            <button
              onClick={() => setCardType('Crédito')}
              className={cn(
                'flex-1 px-4 py-3 rounded-lg font-medium transition-all',
                state.cardType === 'Crédito'
                  ? 'gradient-primary text-primary-foreground shadow-glow'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              )}
            >
              Crédito
            </button>
          </div>
        </div>
      )}

      {/* CEP Field - Always visible and required */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <MapPin className="w-4 h-4 inline mr-2" />
          CEP *
        </label>
        <div className="relative">
          <input
            type="text"
            value={cep}
            onChange={(e) => handleCepChange(e.target.value)}
            placeholder="00000-000"
            maxLength={9}
            className="w-full px-4 py-3 pr-12 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isLoadingCep && (
              <Loader2 className="w-5 h-5 text-primary animate-spin" />
            )}
            {cepFound && !isLoadingCep && (
              <Check className="w-5 h-5 text-success" />
            )}
          </div>
        </div>
        {!addressData && cep.length === 0 && (
          <p className="text-xs text-muted-foreground mt-2">
            Digite seu CEP para continuar com o endereço
          </p>
        )}
      </div>

      {/* Address Fields - Only show when CEP is found */}
      {addressData && (
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
              value={state.streetNumber}
              onChange={(e) => setStreetNumber(e.target.value)}
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
                  setResidenceType('Casa');
                  setApartmentNumber('');
                }}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm',
                  state.residenceType === 'Casa'
                    ? 'gradient-primary text-primary-foreground shadow-glow'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                )}
              >
                Casa
              </button>
              <button
                onClick={() => setResidenceType('Apartamento')}
                className={cn(
                  'flex-1 px-4 py-2.5 rounded-lg font-medium transition-all text-sm',
                  state.residenceType === 'Apartamento'
                    ? 'gradient-primary text-primary-foreground shadow-glow'
                    : 'bg-secondary text-secondary-foreground hover:bg-muted'
                )}
              >
                Apartamento
              </button>
            </div>
          </div>

          {/* Apartment Number - Only show when Apartamento is selected */}
          {state.residenceType === 'Apartamento' && (
            <div className="animate-fade-in">
              <label className="block text-xs text-muted-foreground mb-1">Número do apartamento *</label>
              <input
                type="text"
                value={state.apartmentNumber}
                onChange={(e) => setApartmentNumber(e.target.value)}
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
      )}

      {/* Manual Address (when no CEP) */}
      {!addressData && (
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">
            <MapPin className="w-4 h-4 inline mr-2" />
            Ou digite o endereço completo
          </label>
          <input
            type="text"
            value={state.address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Rua, número, bairro, cidade..."
            className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>
      )}

      {/* Observations */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <MessageSquare className="w-4 h-4 inline mr-2" />
          Observações (opcional)
        </label>
        <textarea
          value={state.observations}
          onChange={(e) => setObservations(e.target.value)}
          placeholder="Alguma preferência especial?"
          rows={3}
          className="w-full px-4 py-3 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
        />
      </div>
    </div>
  );
}
