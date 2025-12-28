# Validação de Formulários com React Hook Form + Zod

## 📋 Visão Geral

Este documento descreve a implementação de validação de formulários usando **React Hook Form** e **Zod** no projeto Doces Cilene.

## 🎯 Problema Resolvido

**Antes:**
- Validação manual com múltiplos `if` statements no componente
- Código difícil de manter e testar
- Validações espalhadas entre componente e página
- Falta de type safety nas validações
- Mensagens de erro inconsistentes

**Depois:**
- Validação declarativa com schema Zod
- Type safety completo com TypeScript
- Validação em tempo real (onChange)
- Mensagens de erro centralizadas e consistentes
- Código mais limpo e manutenível

## 🏗️ Estrutura Implementada

### 1. Schema de Validação (Zod)

**Arquivo:** `src/schemas/order.schema.ts`

```typescript
import { z } from 'zod';

export const orderSchema = z
  .object({
    customerName: z
      .string()
      .min(3, 'Nome deve ter pelo menos 3 caracteres')
      .max(100, 'Nome muito longo')
      .trim(),

    paymentMethod: z.enum(['Dinheiro', 'Cartão', 'PIX'], {
      required_error: 'Selecione um método de pagamento',
    }),

    // ... outros campos
  })
  .refine(
    (data) => {
      // Validações condicionais complexas
      if (data.residenceType === 'Apartamento') {
        return !!data.apartmentNumber;
      }
      return true;
    },
    {
      message: 'Número do apartamento é obrigatório',
      path: ['apartmentNumber'],
    }
  );

export type OrderFormData = z.infer<typeof orderSchema>;
```

### 2. Componentes de Formulário Reutilizáveis

**Arquivo:** `src/components/ui/form/index.tsx`

Componentes criados:
- `Form` - Wrapper do FormProvider
- `FormField` - Wrapper do Controller com contexto
- `FormItem` - Container para campo
- `FormLabel` - Label com estado de erro
- `FormControl` - Wrapper para input com acessibilidade
- `FormMessage` - Mensagem de erro automática
- `FormDescription` - Descrição/dica do campo

**Benefícios:**
- Acessibilidade (ARIA) automática
- Gerenciamento de estado de erro
- Estilização consistente
- Reutilização em todo o projeto

### 3. Componentes Adaptados (RHF)

**Diretório:** `src/components/features/order/rhf/`

Componentes criados:
- `CustomerNameInputRHF.tsx`
- `PaymentMethodSelectorRHF.tsx`
- `ChangeSectionRHF.tsx`
- `CardTypeSelectorRHF.tsx`
- `CepInputRHF.tsx`
- `AddressFieldsRHF.tsx`
- `ManualAddressInputRHF.tsx`
- `ObservationsInputRHF.tsx`

**Padrão de Implementação:**

```typescript
import { Control } from 'react-hook-form';
import { FormField, FormItem, FormControl, FormMessage } from '@/components/ui/form';
import { OrderFormData } from '@/schemas/order.schema';

interface ComponentRHFProps {
  control: Control<OrderFormData>;
}

export function ComponentRHF({ control }: ComponentRHFProps) {
  return (
    <FormField
      control={control}
      name="fieldName"
      render={({ field, fieldState }) => (
        <FormItem>
          <FormControl>
            <input {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
```

### 4. OrderForm Refatorado

**Arquivo:** `src/components/features/order/OrderForm.tsx`

**Características:**
- Usa `useForm` com `zodResolver`
- Modo de validação: `onChange` (valida enquanto digita)
- Sincronização automática com Zustand store
- Persistência no localStorage
- Busca de CEP integrada

**Exemplo de uso:**

```typescript
const form = useForm<OrderFormData>({
  resolver: zodResolver(orderSchema),
  defaultValues: orderFormDefaults,
  mode: 'onChange',
});

// Sincronizar com Zustand
useEffect(() => {
  const subscription = watch((values) => {
    if (values.customerName !== undefined) {
      setCustomerName(values.customerName);
    }
    // ... outros campos
  });
  return () => subscription.unsubscribe();
}, [watch, setCustomerName]);
```

## ✅ Validações Implementadas

### Campos Obrigatórios
- ✅ Nome do cliente (mín. 3 caracteres)
- ✅ Método de pagamento
- ✅ Endereço completo (mín. 10 caracteres)
- ✅ Número da residência
- ✅ Tipo de residência

### Validações Condicionais
- ✅ **Apartamento:** Número do apartamento obrigatório
- ✅ **Dinheiro + Precisa troco:** Valor do troco obrigatório
- ✅ **Cartão:** Tipo do cartão obrigatório

### Validações de Formato
- ✅ CEP: 8 dígitos (formato: 00000-000)
- ✅ Nome: 3-100 caracteres
- ✅ Observações: máximo 500 caracteres

## 🎨 UX/UI Melhorias

### Feedback Visual em Tempo Real
- ✅ Borda verde quando campo válido
- ✅ Borda vermelha quando campo inválido
- ✅ Ícones de validação (check/alert)
- ✅ Mensagens de erro abaixo do campo

### Acessibilidade
- ✅ ARIA labels automáticos
- ✅ Associação label-input
- ✅ Descrições para screen readers
- ✅ Estados de erro acessíveis

## 📦 Dependências Instaladas

```json
{
  "dependencies": {
    "react-hook-form": "^7.69.0",
    "zod": "^4.2.1",
    "@hookform/resolvers": "^5.2.2"
  }
}
```

## 🔄 Migração de Código Legado

### Antes (Validação Manual)

```typescript
// Em Cart.tsx
const handleFinalize = () => {
  if (!customerName.trim()) {
    toast.error('Por favor, informe seu nome');
    return;
  }
  if (!address.trim()) {
    toast.error('Por favor, informe seu endereço completo');
    return;
  }
  // ... mais validações manuais
};
```

### Depois (Com Zod)

```typescript
// No schema
export const orderSchema = z.object({
  customerName: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  address: z.string().min(10, 'Endereço muito curto'),
  // ... validação declarativa
});

// Validação automática no formulário
// Não precisa de código manual!
```

## 🧪 Testando as Validações

### Teste Manual
1. Acesse a página do carrinho
2. Tente submeter o formulário vazio
3. Observe as mensagens de erro em cada campo
4. Preencha os campos e veja a validação em tempo real
5. Teste cenários condicionais:
   - Selecione "Apartamento" → campo de número aparece
   - Selecione "Dinheiro" + "Precisa troco" → campo de valor aparece
   - Selecione "Cartão" → tipo de cartão aparece

### Casos de Teste
- [ ] Nome com menos de 3 caracteres
- [ ] Endereço com menos de 10 caracteres
- [ ] Apartamento sem número
- [ ] Dinheiro + troco sem valor
- [ ] Cartão sem tipo selecionado
- [ ] CEP inválido (menos de 8 dígitos)
- [ ] Observações com mais de 500 caracteres

## 📚 Recursos Adicionais

- [React Hook Form Docs](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [ShadCN UI Form](https://ui.shadcn.com/docs/components/form)

## 🚀 Próximos Passos

Possíveis melhorias futuras:
1. Adicionar testes unitários com Vitest
2. Validação assíncrona (verificar CEP na API)
3. Debounce na validação de campos
4. Mensagens de erro personalizadas por campo
5. Validação de telefone/e-mail (se adicionados)

## 💡 Boas Práticas

1. **Sempre use type-safe schemas** - Zod garante type safety
2. **Mensagens em português** - Melhor UX para usuários
3. **Validações declarativas** - Mais fácil de manter
4. **Feedback em tempo real** - Melhor experiência do usuário
5. **Acessibilidade** - Use os componentes Form para ARIA automático
