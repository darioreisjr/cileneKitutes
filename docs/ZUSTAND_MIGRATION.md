# Migração para Zustand - Gerenciamento de Estado

## Resumo da Implementação

Este projeto foi migrado de Context API para Zustand para melhorar a performance e separar as responsabilidades do estado.

## Estrutura Implementada

### Stores Criados

#### 1. Cart Store (`src/stores/cart.store.ts`)
Gerencia o estado do carrinho de compras:
- **Estados**: `items` (array de CartItem)
- **Ações**:
  - `addItem(product, quantity)` - Adiciona ou incrementa produto
  - `removeItem(productId)` - Remove produto do carrinho
  - `updateQuantity(productId, quantity)` - Atualiza quantidade
  - `clearCart()` - Limpa o carrinho
  - `totalItems()` - Retorna total de itens
  - `subtotal()` - Calcula subtotal
  - `total()` - Calcula total final
- **Persistência**: LocalStorage automático via middleware `persist`

#### 2. Order Store (`src/stores/order.store.ts`)
Gerencia dados do pedido e informações do cliente:
- **Estados**:
  - `customerName`, `paymentMethod`, `observations`
  - `address`, `needsChange`, `changeFor`, `cardType`
  - `residenceType`, `apartmentNumber`, `streetNumber`
- **Ações**: Setters para cada campo + `clearOrder()`
- **Persistência**: LocalStorage automático

## Vantagens da Migração

### 1. Separação de Responsabilidades
- **Antes**: Um único `CartContext` com estado de carrinho E pedido
- **Depois**: Dois stores especializados (`cart.store` e `order.store`)

### 2. Performance Melhorada
```tsx
// Antes - rerenderiza mesmo quando só o nome do cliente muda
const { state, addItem } = useCart();

// Depois - só rerenderiza quando items muda
const addItem = useCartStore((state) => state.addItem);
```

### 3. Código Mais Limpo
```tsx
// Antes
const { state } = useCart();
<input value={state.customerName} />

// Depois
const customerName = useOrderStore((state) => state.customerName);
<input value={customerName} />
```

### 4. Sem Provider Wrapping
- **Antes**: Precisa de `<CartProvider>` no App.tsx
- **Depois**: Stores globais, sem wrapper necessário

## Componentes Migrados

✅ `src/components/layout/Header.tsx`
✅ `src/components/features/product/ProductCard.tsx`
✅ `src/components/features/cart/CartItemRow.tsx`
✅ `src/components/features/order/OrderForm.tsx`
✅ `src/pages/Cart.tsx`
✅ `src/pages/ProductDetails.tsx`
✅ `src/components/Header.tsx`
✅ `src/components/CartItemRow.tsx`
✅ `src/components/ProductCard.tsx`
✅ `src/components/OrderForm/OrderForm.tsx`

## Arquivos Removidos

❌ `src/contexts/CartContext.tsx` - Substituído pelos stores

## Como Usar os Stores

### Acessar Estado do Carrinho
```tsx
import { useCartStore } from '@/stores';

function MyComponent() {
  // Seleciona apenas o que precisa
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.totalItems());
  const addItem = useCartStore((state) => state.addItem);

  return (
    <button onClick={() => addItem(product, 1)}>
      Adicionar ({totalItems})
    </button>
  );
}
```

### Acessar Estado do Pedido
```tsx
import { useOrderStore } from '@/stores';

function OrderForm() {
  const customerName = useOrderStore((state) => state.customerName);
  const setCustomerName = useOrderStore((state) => state.setCustomerName);

  return (
    <input
      value={customerName}
      onChange={(e) => setCustomerName(e.target.value)}
    />
  );
}
```

### Acessar Múltiplos Estados
```tsx
// ✅ Bom - seletores específicos
const items = useCartStore((state) => state.items);
const addItem = useCartStore((state) => state.addItem);

// ❌ Evitar - rerenderiza para qualquer mudança
const cart = useCartStore();
```

## Persistência Automática

Ambos os stores usam o middleware `persist` do Zustand:
- **Cart Store**: Salvo em `sabor-fome-cart`
- **Order Store**: Salvo em `sabor-fome-cart-order`

Os dados são automaticamente:
- Salvos no LocalStorage quando o estado muda
- Carregados quando a aplicação inicia

## Considerações de Performance

### Re-renderização Otimizada
Zustand usa seletores que evitam re-renderizações desnecessárias:

```tsx
// Componente só rerenderiza quando totalItems() muda
const totalItems = useCartStore((state) => state.totalItems());

// Não quando outros campos do carrinho mudam
```

### Funções Computadas
As funções `totalItems()`, `subtotal()` e `total()` são recalculadas on-demand:

```tsx
totalItems: () => {
  return get().items.reduce((sum, item) => sum + item.quantity, 0);
}
```

## Debugging

### DevTools
Para usar o Zustand DevTools, instale a extensão Redux DevTools e adicione:

```tsx
import { devtools } from 'zustand/middleware';

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      // ... store
    )
  )
);
```

### Acessar Store Diretamente (Debug)
```tsx
// No console do navegador
useCartStore.getState().items
useOrderStore.getState().customerName
```

## Testes

Para testar componentes que usam os stores:

```tsx
import { useCartStore } from '@/stores';

// Reset store antes de cada teste
beforeEach(() => {
  useCartStore.setState({ items: [] });
});

// Ou mockar
vi.mock('@/stores', () => ({
  useCartStore: vi.fn(),
}));
```

## Próximos Passos Sugeridos

1. **Adicionar DevTools** para melhor debug
2. **Criar hooks customizados** para lógica complexa:
   ```tsx
   // hooks/useCartOperations.ts
   export function useCartOperations() {
     const addItem = useCartStore((state) => state.addItem);
     const clearCart = useCartStore((state) => state.clearCart);

     const addMultipleItems = (items) => {
       items.forEach(item => addItem(item.product, item.quantity));
     };

     return { addMultipleItems };
   }
   ```

3. **Adicionar middleware de logging** para rastrear mudanças:
   ```tsx
   import { logger } from 'zustand/middleware';

   export const useCartStore = create<CartStore>()(
     logger(
       persist(/* ... */)
     )
   );
   ```

## Referências

- [Zustand Documentation](https://docs.pmnd.rs/zustand)
- [Zustand Best Practices](https://docs.pmnd.rs/zustand/guides/practice-with-no-store-actions)
- [Persist Middleware](https://docs.pmnd.rs/zustand/integrations/persisting-store-data)
