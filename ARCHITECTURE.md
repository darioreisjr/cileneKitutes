# 🏗️ Arquitetura do Projeto - Sabor Fome

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Camadas da Aplicação](#camadas-da-aplicação)
- [Padrões de Código](#padrões-de-código)
- [Convenções de Nomenclatura](#convenções-de-nomenclatura)
- [Como Adicionar Novas Features](#como-adicionar-novas-features)

## 🎯 Visão Geral

Este projeto segue uma arquitetura modular e escalável baseada em:

- **Separação de responsabilidades**: Cada camada tem uma função específica
- **Reutilização de código**: Componentes e hooks compartilhados
- **Facilidade de manutenção**: Código organizado e bem documentado
- **Escalabilidade**: Estrutura preparada para crescimento

## 📁 Estrutura de Pastas

```
src/
├── api/                         # Camada de serviços e API
│   ├── services/               # Serviços de integração
│   │   ├── product.service.ts  # Lógica de produtos
│   │   ├── cep.service.ts      # Integração com ViaCEP
│   │   └── whatsapp.service.ts # Integração com WhatsApp
│   └── types/                  # Types específicos de API
│
├── assets/                     # Recursos estáticos
│   ├── images/                # Imagens
│   └── icons/                 # Ícones
│
├── components/                 # Componentes React
│   ├── common/                # Componentes reutilizáveis
│   │   └── NavLink.tsx        # Link de navegação
│   ├── features/              # Componentes por feature
│   │   ├── cart/             # Feature de carrinho
│   │   │   ├── CartItemRow.tsx
│   │   │   ├── OrderConfirmationModal.tsx
│   │   │   └── index.ts
│   │   ├── order/            # Feature de pedidos
│   │   │   ├── OrderForm.tsx
│   │   │   ├── AddressFields.tsx
│   │   │   └── index.ts
│   │   └── product/          # Feature de produtos
│   │       ├── ProductCard.tsx
│   │       ├── CategoryChips.tsx
│   │       └── index.ts
│   ├── layout/               # Componentes de layout
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── index.ts
│   ├── ui/                   # Componentes shadcn/ui
│   └── index.ts              # Barrel export
│
├── config/                    # Configurações da aplicação
│   ├── constants.ts          # Constantes globais
│   ├── env.ts                # Variáveis de ambiente
│   ├── routes.config.ts      # Configuração de rotas
│   └── index.ts
│
├── contexts/                  # Context API providers
│   └── CartContext.tsx       # Contexto do carrinho
│
├── data/                      # Dados estáticos
│   └── products.json         # Catálogo de produtos
│
├── hooks/                     # Custom React hooks
│   ├── useProducts.ts        # Hook para produtos
│   ├── useDebounce.ts        # Hook de debounce
│   ├── useLocalStorage.ts    # Hook de localStorage
│   ├── useCep.ts             # Hook para CEP
│   └── index.ts
│
├── lib/                       # Bibliotecas e utilitários
│   └── utils.ts              # Utilitários do shadcn
│
├── pages/                     # Páginas da aplicação
│   ├── Index.tsx             # Página inicial
│   ├── Cart.tsx              # Página do carrinho
│   ├── ProductDetails.tsx    # Detalhes do produto
│   └── NotFound.tsx          # Página 404
│
├── schemas/                   # Schemas de validação (Zod)
│   └── (futuro)
│
├── stores/                    # State management (Zustand)
│   └── (futuro)
│
├── styles/                    # Estilos globais
│   └── index.css
│
├── types/                     # TypeScript types
│   ├── product.types.ts      # Types de produtos
│   ├── cart.types.ts         # Types do carrinho
│   ├── order.types.ts        # Types de pedidos
│   └── index.ts              # Barrel export
│
├── utils/                     # Funções utilitárias
│   ├── format.ts             # Formatação (moeda, CEP, etc)
│   ├── validators.ts         # Validações
│   ├── whatsapp.ts           # Utils do WhatsApp (legado)
│   ├── cep.ts                # Utils do CEP (legado)
│   └── index.ts
│
├── App.tsx                    # Componente principal
└── main.tsx                   # Entry point
```

## 🎨 Camadas da Aplicação

### 1. **Camada de Apresentação** (Components)

Responsável pela interface do usuário.

**Organização:**
- `common/`: Componentes reutilizáveis (botões, inputs, cards)
- `features/`: Componentes específicos por funcionalidade
- `layout/`: Componentes estruturais (header, footer, sidebar)
- `ui/`: Componentes de UI library (shadcn)

**Exemplo:**
```tsx
// src/components/features/product/ProductCard.tsx
import { Product } from '@/types';

export const ProductCard = ({ product }: { product: Product }) => {
  // ...
};
```

### 2. **Camada de Lógica de Negócio** (Services)

Contém a lógica de negócio e integrações externas.

**Responsabilidades:**
- Chamadas a APIs externas
- Transformação de dados
- Regras de negócio

**Exemplo:**
```tsx
// src/api/services/product.service.ts
export class ProductService {
  static async getAll(): Promise<Product[]> {
    // Lógica de busca
  }
}
```

### 3. **Camada de Estado** (Contexts/Stores)

Gerencia o estado global da aplicação.

**Tecnologias:**
- Context API (atual)
- Zustand (futuro, se necessário)

**Exemplo:**
```tsx
// src/contexts/CartContext.tsx
export const CartProvider = ({ children }) => {
  // Estado e lógica do carrinho
};
```

### 4. **Camada de Utilidades** (Utils/Hooks)

Funções auxiliares e hooks reutilizáveis.

**Categorias:**
- `utils/`: Funções puras (formatação, validação)
- `hooks/`: Custom React hooks

**Exemplo:**
```tsx
// src/hooks/useDebounce.ts
export const useDebounce = <T>(value: T, delay: number) => {
  // Lógica de debounce
};
```

## 📐 Padrões de Código

### Imports

Sempre use imports absolutos com alias `@/`:

```tsx
// ✅ Correto
import { Product } from '@/types';
import { ProductService } from '@/api/services';
import { APP_CONFIG } from '@/config';

// ❌ Evite
import { Product } from '../../../types';
```

### Barrel Exports

Use `index.ts` para exportar múltiplos módulos:

```tsx
// src/components/features/product/index.ts
export { ProductCard } from './ProductCard';
export { CategoryChips } from './CategoryChips';
export { ProductCardSkeleton } from './ProductCardSkeleton';
```

### Componentes

```tsx
// Sempre tipados
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  return (
    // JSX
  );
};
```

### Services

```tsx
// Use classes estáticas para services
export class ProductService {
  private static readonly BASE_URL = '/api/products';

  static async getAll(): Promise<Product[]> {
    // Implementação
  }

  static async getById(id: string): Promise<Product> {
    // Implementação
  }
}
```

### Hooks

```tsx
// Sempre comece com 'use'
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Lógica

  return { products, loading };
};
```

## 🏷️ Convenções de Nomenclatura

### Arquivos

- Componentes: `PascalCase.tsx` (ex: `ProductCard.tsx`)
- Hooks: `camelCase.ts` (ex: `useProducts.ts`)
- Services: `camelCase.service.ts` (ex: `product.service.ts`)
- Types: `camelCase.types.ts` (ex: `product.types.ts`)
- Utils: `camelCase.ts` (ex: `format.ts`)
- Constants: `camelCase.ts` ou `SCREAMING_SNAKE_CASE.ts`

### Variáveis e Funções

```tsx
// Componentes e Types: PascalCase
const ProductCard = () => {};
interface ProductCardProps {}

// Variáveis e funções: camelCase
const productList = [];
const handleAddToCart = () => {};

// Constantes: SCREAMING_SNAKE_CASE
const MAX_ITEMS = 100;
const API_URL = 'https://api.example.com';

// Componentes de arquivo: PascalCase
export const ProductService = {};
```

## ➕ Como Adicionar Novas Features

### 1. Criar Types

```tsx
// src/types/newFeature.types.ts
export interface NewFeature {
  id: string;
  name: string;
}
```

### 2. Criar Service

```tsx
// src/api/services/newFeature.service.ts
export class NewFeatureService {
  static async getAll(): Promise<NewFeature[]> {
    // Implementação
  }
}
```

### 3. Criar Hook (se necessário)

```tsx
// src/hooks/useNewFeature.ts
export const useNewFeature = () => {
  // Lógica
};
```

### 4. Criar Componentes

```tsx
// src/components/features/newFeature/NewFeatureCard.tsx
export const NewFeatureCard = () => {
  // Implementação
};

// src/components/features/newFeature/index.ts
export { NewFeatureCard } from './NewFeatureCard';
```

### 5. Adicionar à Página

```tsx
// src/pages/NewFeaturePage.tsx
import { NewFeatureCard } from '@/components/features/newFeature';

export const NewFeaturePage = () => {
  return <NewFeatureCard />;
};
```

## 🔄 Fluxo de Dados

```
User Interaction
       ↓
  Component
       ↓
    Hook/Context
       ↓
    Service
       ↓
  External API
       ↓
    Service
       ↓
  Hook/Context
       ↓
   Component
       ↓
   UI Update
```

## 🧪 Testes (Futuro)

```
src/
├── __tests__/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── utils/
```

## 📚 Recursos Adicionais

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [shadcn/ui](https://ui.shadcn.com)

---

**Última atualização:** 2025-01-28
