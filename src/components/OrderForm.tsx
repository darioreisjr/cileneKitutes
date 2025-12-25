import { useState, useEffect } from 'react';
import { useCart } from '@/contexts/CartContext';
import { MapPin, User, MessageSquare, Search, Loader2, Check, Wallet } from 'lucide-react';
import { FaPix, FaMoneyBillWave, FaCreditCard } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { fetchAddressByCep, formatCep, formatFullAddress } from '@/utils/cep';
import { toast } from 'sonner';

const paymentMethods = [
  { id: 'Pix', label: 'Pix', icon: FaPix },
  { id: 'Dinheiro', label: 'Dinheiro', icon: FaMoneyBillWave },
  { id: 'Cartão', label: 'Cartão', icon: FaCreditCard },
];

export function OrderForm() {
  const { state, setCustomerName, setPaymentMethod, setObservations, setAddress, setNeedsChange, setChangeFor, setCardType } = useCart();
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepFound, setCepFound] = useState(false);
  const [addressData, setAddressData] = useState<{
    logradouro: string;
    bairro: string;
    cidade: string;
  } | null>(null);

  // Update full address when components change
  useEffect(() => {
    if (addressData) {
      const parts = [
        addressData.logradouro,
        numero ? `nº ${numero}` : '',
        complemento,
        addressData.bairro,
        addressData.cidade,
      ].filter(Boolean);
      setAddress(parts.join(', '));
    }
  }, [addressData, numero, complemento, setAddress]);

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

      {/* CEP Field */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          <Search className="w-4 h-4 inline mr-2" />
          CEP
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
      </div>

      {/* Address Fields - Show when CEP is found */}
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

          {/* Number and Complement */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Número *</label>
              <input
                type="text"
                value={numero}
                onChange={(e) => setNumero(e.target.value)}
                placeholder="123"
                className="w-full px-4 py-2.5 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>
            <div>
              <label className="block text-xs text-muted-foreground mb-1">Complemento</label>
              <input
                type="text"
                value={complemento}
                onChange={(e) => setComplemento(e.target.value)}
                placeholder="Apto 101"
                className="w-full px-4 py-2.5 bg-secondary rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
              />
            </div>
          </div>

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
