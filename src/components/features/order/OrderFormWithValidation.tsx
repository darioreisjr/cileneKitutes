import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useOrderStore } from '@/stores';
import { orderSchema, OrderFormData, orderFormDefaults } from '@/schemas/order.schema';
import { fetchAddressByCep, formatCep } from '@/utils/cep';
import { toast } from 'sonner';
import { Form } from '@/components/ui/form';
import { useState } from 'react';

// Importar componentes existentes (adaptados para React Hook Form)
import { CustomerNameInputRHF } from './rhf/CustomerNameInputRHF';
import { PaymentMethodSelectorRHF } from './rhf/PaymentMethodSelectorRHF';
import { ChangeSectionRHF } from './rhf/ChangeSectionRHF';
import { CardTypeSelectorRHF } from './rhf/CardTypeSelectorRHF';
import { CepInputRHF } from './rhf/CepInputRHF';
import { AddressFieldsRHF } from './rhf/AddressFieldsRHF';
import { ManualAddressInputRHF } from './rhf/ManualAddressInputRHF';
import { ObservationsInputRHF } from './rhf/ObservationsInputRHF';

const STORAGE_KEY = 'sabor-fome-address-data';

interface AddressData {
  logradouro: string;
  bairro: string;
  cidade: string;
}

interface SavedData {
  cep?: string;
  numero?: string;
  addressData?: AddressData;
  residenceType?: string;
  apartmentNumber?: string;
}

export function OrderFormWithValidation() {
  // Estado local para dados de endereço
  const [cep, setCep] = useState('');
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  const [cepFound, setCepFound] = useState(false);
  const [addressData, setAddressData] = useState<AddressData | null>(null);

  // Zustand store
  const setCustomerName = useOrderStore((state) => state.setCustomerName);
  const setPaymentMethod = useOrderStore((state) => state.setPaymentMethod);
  const setObservations = useOrderStore((state) => state.setObservations);
  const setAddress = useOrderStore((state) => state.setAddress);
  const setNeedsChange = useOrderStore((state) => state.setNeedsChange);
  const setChangeFor = useOrderStore((state) => state.setChangeFor);
  const setCardType = useOrderStore((state) => state.setCardType);
  const setResidenceType = useOrderStore((state) => state.setResidenceType);
  const setApartmentNumber = useOrderStore((state) => state.setApartmentNumber);
  const setStreetNumber = useOrderStore((state) => state.setStreetNumber);

  // Carregar dados salvos
  const loadSavedAddressData = (): SavedData | null => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  };

  // Inicializar React Hook Form com Zod
  const form = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    defaultValues: orderFormDefaults,
    mode: 'onChange', // Validar enquanto o usuário digita
  });

  const { watch, setValue } = form;

  // Carregar dados salvos no mount
  useEffect(() => {
    const savedData = loadSavedAddressData();
    if (savedData) {
      if (savedData.cep) {
        setCep(savedData.cep);
      }
      if (savedData.addressData) {
        setAddressData(savedData.addressData);
        setCepFound(true);
      }
      if (savedData.residenceType) {
        setValue('residenceType', savedData.residenceType as 'Casa' | 'Apartamento');
        setResidenceType(savedData.residenceType);
      }
      if (savedData.apartmentNumber) {
        setValue('apartmentNumber', savedData.apartmentNumber);
        setApartmentNumber(savedData.apartmentNumber);
      }
      if (savedData.numero) {
        setValue('streetNumber', savedData.numero);
        setStreetNumber(savedData.numero);
      }
    }
  }, [setValue, setResidenceType, setApartmentNumber, setStreetNumber]);

  // Sincronizar com Zustand store
  useEffect(() => {
    const subscription = watch((values) => {
      if (values.customerName !== undefined) setCustomerName(values.customerName);
      if (values.paymentMethod) setPaymentMethod(values.paymentMethod);
      if (values.observations !== undefined) setObservations(values.observations || '');
      if (values.address !== undefined) setAddress(values.address);
      if (values.needsChange !== undefined) setNeedsChange(values.needsChange);
      if (values.changeFor !== undefined) setChangeFor(values.changeFor || '');
      if (values.cardType) setCardType(values.cardType);
      if (values.residenceType) setResidenceType(values.residenceType);
      if (values.apartmentNumber !== undefined)
        setApartmentNumber(values.apartmentNumber || '');
      if (values.streetNumber !== undefined) setStreetNumber(values.streetNumber);
    });
    return () => subscription.unsubscribe();
  }, [
    watch,
    setCustomerName,
    setPaymentMethod,
    setObservations,
    setAddress,
    setNeedsChange,
    setChangeFor,
    setCardType,
    setResidenceType,
    setApartmentNumber,
    setStreetNumber,
  ]);

  // Salvar no localStorage
  useEffect(() => {
    const streetNumber = watch('streetNumber');
    const residenceType = watch('residenceType');
    const apartmentNumber = watch('apartmentNumber');

    const dataToSave = {
      cep,
      numero: streetNumber,
      addressData,
      residenceType,
      apartmentNumber,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [cep, addressData, watch]);

  // Atualizar endereço completo quando dados mudarem
  useEffect(() => {
    const streetNumber = watch('streetNumber');
    const residenceType = watch('residenceType');
    const apartmentNumber = watch('apartmentNumber');

    if (addressData) {
      const parts = [
        addressData.logradouro,
        streetNumber ? `nº ${streetNumber}` : '',
        residenceType === 'Apartamento' && apartmentNumber
          ? `Apto ${apartmentNumber}`
          : '',
        addressData.bairro,
        addressData.cidade,
      ].filter(Boolean);

      const fullAddress = parts.join(', ');
      setValue('address', fullAddress);
      setAddress(fullAddress);
    }
  }, [addressData, watch, setValue, setAddress]);

  // Handler para buscar CEP
  const handleCepChange = async (value: string) => {
    const formatted = formatCep(value);
    setCep(formatted);
    setCepFound(false);
    setAddressData(null);
    setValue('cep', formatted);

    const cleanCep = value.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setIsLoadingCep(true);
      const data = await fetchAddressByCep(cleanCep);
      setIsLoadingCep(false);

      if (data) {
        setCepFound(true);
        const newAddressData = {
          logradouro: data.logradouro,
          bairro: data.bairro,
          cidade: `${data.localidade} - ${data.uf}`,
        };
        setAddressData(newAddressData);
        toast.success('Endereço encontrado!');
      } else {
        toast.error('CEP não encontrado');
      }
    }
  };

  const paymentMethod = watch('paymentMethod');

  return (
    <Form {...form}>
      <div className="space-y-4">
        <CustomerNameInputRHF control={form.control} />

        <PaymentMethodSelectorRHF control={form.control} />

        {paymentMethod === 'Dinheiro' && (
          <ChangeSectionRHF control={form.control} watch={watch} />
        )}

        {paymentMethod === 'Cartão' && <CardTypeSelectorRHF control={form.control} />}

        <CepInputRHF
          value={cep}
          isLoading={isLoadingCep}
          found={cepFound}
          onChange={handleCepChange}
          control={form.control}
        />

        {addressData && (
          <AddressFieldsRHF
            addressData={addressData}
            control={form.control}
            watch={watch}
            setValue={setValue}
          />
        )}

        {!addressData && <ManualAddressInputRHF control={form.control} />}

        <ObservationsInputRHF control={form.control} />
      </div>
    </Form>
  );
}
