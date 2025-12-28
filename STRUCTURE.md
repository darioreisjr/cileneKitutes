# 📂 Estrutura do Projeto - Referência Rápida

## 🎯 Diretórios Principais

### `/src/api` - Camada de Serviços
Contém toda a lógica de integração com APIs e serviços externos.

```
api/
├── services/           # Serviços organizados por domínio
│   ├── product.service.ts    # CRUD e lógica de produtos
│   ├── cep.service.ts        # Integração ViaCEP
│   ├── whatsapp.service.ts   # Integração WhatsApp
│   └── index.ts              # Barrel export
└── types/             # Types específicos de API (futuro)
```

**Quando usar:**
- Chamadas a APIs externas
- Lógica de negócio complexa
- Transformação de dados
- Integrações de terceiros

### `/src/components` - Componentes React
Todos os componentes da UI organizados por propósito.

```
components/
├── common/            # Componentes reutilizáveis genéricos
│   ├── NavLink.tsx
│   └── index.ts
├── features/          # Componentes específicos por funcionalidade
│   ├── cart/         # Feature de carrinho
│   │   ├── CartItemRow.tsx
│   │   ├── OrderConfirmationModal.tsx
│   │   └── index.ts
│   ├── order/        # Feature de pedidos
│   │   ├── OrderForm.tsx
│   │   ├── AddressFields.tsx
│   │   ├── PaymentMethodSelector.tsx
│   │   └── index.ts
│   └── product/      # Feature de produtos
│       ├── ProductCard.tsx
│       ├── CategoryChips.tsx
│       ├── ProductCardSkeleton.tsx
│       └── index.ts
├── layout/           # Componentes estruturais
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── index.ts
├── ui/               # Biblioteca shadcn/ui
│   ├── button.tsx
│   ├── toast.tsx
│   └── ...
└── index.ts          # Barrel export geral
```

**Quando criar novo componente:**
- `common/`: Se é reutilizável em múltiplas features
- `features/`: Se é específico de uma funcionalidade
- `layout/`: Se é estrutural (header, sidebar, etc)

### `/src/config` - Configurações
Centraliza todas as configurações da aplicação.

```
config/
├── constants.ts      # Constantes globais (categorias, métodos de pagamento)
├── env.ts           # Variáveis de ambiente tipadas
├── routes.config.ts # Configuração de rotas
└── index.ts
```

**Usar para:**
```tsx
import { APP_CONFIG, ROUTES, MESSAGES } from '@/config';

// Constantes
const key = APP_CONFIG.STORAGE_KEYS.CART;
const categories = APP_CONFIG.CATEGORIES;

// Rotas
navigate(ROUTES.CART);

// Mensagens
toast.success(MESSAGES.SUCCESS.ORDER_SENT);
```

### `/src/contexts` - Context API
Gerenciamento de estado global com Context API.

```
contexts/
└── CartContext.tsx   # Estado do carrinho e pedido
```

**Usado para:**
- Estado compartilhado entre múltiplos componentes
- Dados que precisam persistir durante navegação

### `/src/hooks` - Custom Hooks
Hooks personalizados para lógica reutilizável.

```
hooks/
├── useProducts.ts      # Gerenciamento de produtos
├── useDebounce.ts      # Debounce de valores
├── useLocalStorage.ts  # Sincronização com localStorage
├── useCep.ts          # Consulta de CEP
├── use-mobile.tsx     # Detecção de dispositivo móvel
├── use-toast.ts       # Gerenciamento de toasts
└── index.ts
```

**Quando criar hook:**
- Lógica repetida em múltiplos componentes
- Side effects complexos
- Integrações que precisam de estado

**Exemplo:**
```tsx
const { products, loading, error } = useProducts();
const debouncedSearch = useDebounce(searchTerm, 500);
const [cart, setCart] = useLocalStorage('cart', []);
```

### `/src/pages` - Páginas
Componentes de página (rotas).

```
pages/
├── Index.tsx          # Página inicial (catálogo)
├── Cart.tsx          # Página do carrinho
├── ProductDetails.tsx # Detalhes do produto
└── NotFound.tsx      # Página 404
```

**Características:**
- Um arquivo = uma rota
- Orquestra componentes menores
- Usa hooks e services
- Geralmente não contém lógica complexa

### `/src/types` - TypeScript Types
Definições de tipos centralizadas.

```
types/
├── product.types.ts  # Types relacionados a produtos
├── cart.types.ts     # Types do carrinho
├── order.types.ts    # Types de pedidos
└── index.ts          # Barrel export
```

**Importar:**
```tsx
import { Product, CartItem, OrderData } from '@/types';
// ou específico
import { Product } from '@/types/product.types';
```

### `/src/utils` - Utilitários
Funções auxiliares puras.

```
utils/
├── format.ts         # Formatação (moeda, CEP, telefone)
├── validators.ts     # Validações (CPF, email, CEP)
├── whatsapp.ts       # Utils WhatsApp (legado)
├── cep.ts           # Utils CEP (legado)
└── index.ts
```

**Usar para:**
```tsx
import { formatCurrency, formatCep, isValidCep } from '@/utils';

const price = formatCurrency(19.99); // R$ 19,99
const cep = formatCep('12345678');   // 12345-678
const valid = isValidCep('12345-678'); // true
```

## 📋 Arquivos na Raiz do Projeto

```
doces-cilene/
├── ARCHITECTURE.md      # 📖 Documentação da arquitetura
├── MIGRATION_GUIDE.md   # 🔄 Guia de migração
├── STRUCTURE.md         # 📂 Esta documentação
├── README.md           # 📝 Informações gerais
├── package.json        # 📦 Dependências
├── tsconfig.json       # ⚙️ Configuração TypeScript
├── vite.config.ts      # ⚙️ Configuração Vite
├── tailwind.config.ts  # 🎨 Configuração Tailwind
└── ...
```

## 🎨 Convenções

### Naming

| Tipo | Convenção | Exemplo |
|------|-----------|---------|
| Componente | PascalCase | `ProductCard.tsx` |
| Hook | camelCase com 'use' | `useProducts.ts` |
| Service | PascalCase + Service | `ProductService` |
| Type/Interface | PascalCase | `Product`, `CartItem` |
| Função | camelCase | `formatCurrency` |
| Constante | SCREAMING_SNAKE | `MAX_ITEMS` |
| Arquivo tipo | camelCase.types.ts | `product.types.ts` |
| Arquivo service | camelCase.service.ts | `product.service.ts` |

### Imports

**Sempre use alias `@/`:**
```tsx
// ✅ Correto
import { Product } from '@/types';
import { ProductService } from '@/api/services';
import { Header } from '@/components/layout';

// ❌ Evite
import { Product } from '../../../types';
```

### Exports

**Use barrel exports (`index.ts`):**
```tsx
// components/features/product/index.ts
export { ProductCard } from './ProductCard';
export { CategoryChips } from './CategoryChips';
```

```tsx
// Importar
import { ProductCard, CategoryChips } from '@/components/features/product';
```

## 🔍 Como Encontrar o que Precisa

### "Preciso de dados de produtos"
→ `src/api/services/product.service.ts`

### "Preciso formatar um valor"
→ `src/utils/format.ts`

### "Preciso de um hook para buscar dados"
→ `src/hooks/use[Nome].ts`

### "Preciso de types"
→ `src/types/[dominio].types.ts`

### "Preciso de uma constante"
→ `src/config/constants.ts`

### "Preciso criar um componente de produto"
→ `src/components/features/product/`

### "Preciso criar um componente reutilizável"
→ `src/components/common/`

## 🚀 Fluxo de Trabalho

### Adicionar Nova Feature

1. **Criar types** em `src/types/newFeature.types.ts`
2. **Criar service** em `src/api/services/newFeature.service.ts`
3. **Criar hook** (opcional) em `src/hooks/useNewFeature.ts`
4. **Criar componentes** em `src/components/features/newFeature/`
5. **Criar página** (se necessário) em `src/pages/NewFeature.tsx`
6. **Adicionar rota** em `src/config/routes.config.ts`

### Adicionar Novo Componente

1. **Decidir categoria**: common, feature, ou layout?
2. **Criar arquivo** na pasta apropriada
3. **Adicionar ao index.ts** da pasta
4. **Importar** onde necessário usando barrel export

### Adicionar Nova Constante

1. **Abrir** `src/config/constants.ts`
2. **Adicionar** ao objeto `APP_CONFIG`
3. **Usar** via `import { APP_CONFIG } from '@/config'`

## 📚 Leitura Adicional

- [ARCHITECTURE.md](./ARCHITECTURE.md) - Documentação completa da arquitetura
- [MIGRATION_GUIDE.md](./MIGRATION_GUIDE.md) - Como migrar código antigo
- [README.md](./README.md) - Como rodar o projeto

---

💡 **Dica:** Mantenha esta estrutura! Ela facilita escalabilidade e manutenção.
