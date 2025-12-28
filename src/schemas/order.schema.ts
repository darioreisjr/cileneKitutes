import { z } from 'zod';

/**
 * Schema de validação para o formulário de pedido
 * Utiliza Zod para validação type-safe com mensagens em português
 */
export const orderSchema = z
  .object({
    // Informações do cliente
    customerName: z
      .string()
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .max(100, 'Nome muito longo')
      .trim(),

    // Informações de pagamento
    paymentMethod: z.enum(['Dinheiro', 'Cartão', 'PIX'], {
      required_error: 'Selecione um método de pagamento',
    }),

    needsChange: z.boolean(),

    changeFor: z
      .string()
      .optional()
      .transform((val) => (val === '' ? undefined : val)),

    cardType: z
      .enum(['Débito', 'Crédito'], {
        required_error: 'Selecione o tipo de cartão',
      })
      .optional(),

    // Informações de endereço
    cep: z
      .string()
      .optional()
      .refine(
        (val) => {
          if (!val) return true;
          const cleanCep = val.replace(/\D/g, '');
          return cleanCep.length === 8;
        },
        { message: 'CEP deve ter 8 dígitos' }
      ),

    address: z
      .string()
      .min(10, 'Endereço muito curto')
      .max(500, 'Endereço muito longo')
      .trim(),

    streetNumber: z.string().min(1, 'Número obrigatório').trim(),

    residenceType: z.enum(['Casa', 'Apartamento'], {
      required_error: 'Selecione o tipo de residência',
    }),

    apartmentNumber: z
      .string()
      .optional()
      .transform((val) => (val === '' ? undefined : val)),

    // Observações
    observations: z
      .string()
      .max(500, 'Observações muito longas')
      .optional()
      .transform((val) => (val === '' ? undefined : val)),
  })
  .refine(
    (data) => {
      // Se residência é Apartamento, número do apartamento é obrigatório
      if (data.residenceType === 'Apartamento') {
        return !!data.apartmentNumber && data.apartmentNumber.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Número do apartamento é obrigatório',
      path: ['apartmentNumber'],
    }
  )
  .refine(
    (data) => {
      // Se pagamento é Dinheiro e precisa de troco, valor do troco é obrigatório
      if (data.paymentMethod === 'Dinheiro' && data.needsChange) {
        return !!data.changeFor && data.changeFor.trim().length > 0;
      }
      return true;
    },
    {
      message: 'Informe o valor para o troco',
      path: ['changeFor'],
    }
  )
  .refine(
    (data) => {
      // Se pagamento é Cartão, tipo do cartão é obrigatório
      if (data.paymentMethod === 'Cartão') {
        return !!data.cardType;
      }
      return true;
    },
    {
      message: 'Selecione o tipo de cartão',
      path: ['cardType'],
    }
  );

/**
 * Tipo TypeScript inferido do schema
 */
export type OrderFormData = z.infer<typeof orderSchema>;

/**
 * Valores padrão para o formulário
 */
export const orderFormDefaults: OrderFormData = {
  customerName: '',
  paymentMethod: 'PIX',
  needsChange: false,
  changeFor: undefined,
  cardType: undefined,
  cep: '',
  address: '',
  streetNumber: '',
  residenceType: 'Casa',
  apartmentNumber: undefined,
  observations: undefined,
};
