# 🔄 Guia de Migração - Nova Estrutura

## 📋 Visão Geral

Este guia ajuda na transição do código antigo para a nova arquitetura.

## 🗺️ Mapeamento de Imports

### Types

**Antes:**
```tsx
import { Product } from '@/contexts/CartContext';
```

**Depois:**
```tsx
import { Product } from '@/types';
// ou
import { Product } from '@/types/product.types';
```

### Componentes

**Antes:**
```tsx
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ProductCard } from '@/components/ProductCard';
import { CartItemRow } from '@/components/CartItemRow';
import { OrderForm } from '@/components/OrderForm';
```

**Depois:**
```tsx
// Opção 1: Import direto
import { Header, Footer } from '@/components/layout';
import { ProductCard } from '@/components/features/product';
import { CartItemRow } from '@/components/features/cart';
import { OrderForm } from '@/components/features/order';

// Opção 2: Import do barrel
import {
  Header,
  Footer,
  ProductCard,
  CartItemRow,
  OrderForm
} from '@/components';
```

### Services

**Antes:**
```tsx
// Lógica espalhada nos componentes
const fetchProducts = async () => {
  const response = await import('@/data/products.json');
  return response.default;
};
```

**Depois:**
```tsx
import { ProductService } from '@/api/services';

// No componente
const products = await ProductService.getAll();
```

### Utils

**Antes:**
```tsx
import { formatCurrency } from '@/utils/whatsapp';
```

**Depois:**
```tsx
import { formatCurrency } from '@/utils/format';
// ou
import { formatCurrency } from '@/utils';
```

### Hooks

**Antes:**
```tsx
// Hook inline no componente
const [products, setProducts] = useState([]);
useEffect(() => {
  // Buscar produtos
}, []);
```

**Depois:**
```tsx
import { useProducts } from '@/hooks';

const { products, loading, error } = useProducts();
```

### Constantes

**Antes:**
```tsx
const STORAGE_KEY = 'sabor-fome-cart';
const PAYMENT_METHODS = ['Pix', 'Dinheiro', 'Cartão'];
```

**Depois:**
```tsx
import { APP_CONFIG } from '@/config';

const key = APP_CONFIG.STORAGE_KEYS.CART;
const methods = APP_CONFIG.PAYMENT_METHODS;
```

## 📝 Exemplos de Migração Completa

### Exemplo 1: Página de Produtos

**Antes:**
```tsx
import { useState, useEffect } from 'react';
import { Product } from '@/contexts/CartContext';
import { ProductCard } from '@/components/ProductCard';
import products from '@/data/products.json';

const ProductsPage = () => {
  const [productList, setProductList] = useState<Product[]>([]);

  useEffect(() => {
    setProductList(products as Product[]);
  }, []);

  return (
    <div>
      {productList.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

**Depois:**
```tsx
import { ProductCard } from '@/components/features/product';
import { useProducts } from '@/hooks';

const ProductsPage = () => {
  const { products, loading, error } = useProducts();

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};
```

### Exemplo 2: Busca de CEP

**Antes:**
```tsx
const handleCepBlur = async () => {
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    const data = await response.json();
    // Processar dados
  } catch (error) {
    console.error(error);
  }
};
```

**Depois:**
```tsx
import { useCep } from '@/hooks';

const MyComponent = () => {
  const { fetchCep, data, loading, error } = useCep();

  const handleCepBlur = async () => {
    await fetchCep(cep);
  };

  // data já contém os dados formatados
};
```

### Exemplo 3: Formatação de Valores

**Antes:**
```tsx
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// No componente
const total = formatCurrency(100);
```

**Depois:**
```tsx
import { formatCurrency } from '@/utils';

// No componente
const total = formatCurrency(100);
```

## 🔧 Checklist de Migração

### Para cada arquivo:

- [ ] Atualizar imports de types para `@/types`
- [ ] Atualizar imports de componentes para nova estrutura
- [ ] Substituir lógica de API por Services
- [ ] Mover lógica repetida para hooks customizados
- [ ] Usar constantes de `@/config` ao invés de valores hardcoded
- [ ] Atualizar validações para usar `@/utils/validators`
- [ ] Atualizar formatações para usar `@/utils/format`

### Para componentes:

- [ ] Mover para pasta apropriada (`common/`, `features/`, `layout/`)
- [ ] Adicionar ao `index.ts` da pasta
- [ ] Atualizar imports nos arquivos que o usam
- [ ] Testar funcionalidade

### Para novos features:

- [ ] Criar types em `src/types/`
- [ ] Criar service em `src/api/services/`
- [ ] Criar hook personalizado se necessário
- [ ] Criar componentes em `src/components/features/`
- [ ] Adicionar testes (quando disponível)

## 🚨 Pontos de Atenção

### 1. Imports Circulares

**Evite:**
```tsx
// types/index.ts
export * from './product.types';
export * from './cart.types'; // que importa product.types

// cart.types.ts
import { Product } from './index'; // ❌ Circular!
```

**Prefira:**
```tsx
// cart.types.ts
import { Product } from './product.types'; // ✅ Direto
```

### 2. Barrel Exports

Use barrel exports para conveniência, mas importe diretamente se houver problemas de bundle size:

```tsx
// Para componentes grandes
import { Header } from '@/components/layout/Header'; // ✅ Tree-shaking melhor

// Para múltiplos imports pequenos
import { Header, Footer } from '@/components/layout'; // ✅ Mais limpo
```

### 3. Services Assíncronos

Sempre trate erros em services:

```tsx
// ❌ Não fazer
const products = await ProductService.getAll();

// ✅ Fazer
try {
  const products = await ProductService.getAll();
} catch (error) {
  console.error('Erro ao buscar produtos:', error);
  toast.error('Erro ao carregar produtos');
}
```

## 🧪 Como Testar

1. **Verifique imports:**
```bash
npm run lint
```

2. **Verifique tipos:**
```bash
npm run type-check # (adicionar script se não existir)
```

3. **Teste a build:**
```bash
npm run build
```

4. **Teste em desenvolvimento:**
```bash
npm run dev
```

## 📞 Ajuda

Se encontrar problemas durante a migração:

1. Verifique o [ARCHITECTURE.md](./ARCHITECTURE.md) para referência
2. Confira exemplos em arquivos já migrados
3. Revise os tipos em `src/types/`
4. Consulte a documentação dos services em `src/api/services/`

## 🎯 Próximos Passos Após Migração

1. [ ] Implementar validação com Zod (schemas)
2. [ ] Adicionar testes unitários
3. [ ] Implementar error boundaries
4. [ ] Configurar CI/CD
5. [ ] Adicionar Storybook (opcional)
6. [ ] Implementar state management avançado se necessário (Zustand)

---

**Boa migração! 🚀**
