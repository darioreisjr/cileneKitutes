# 🚀 Guia de Configuração do Supabase

Este guia explica como configurar o Supabase para substituir os produtos estáticos por dados dinâmicos do banco de dados.

## 📋 Pré-requisitos

- Conta no [Supabase](https://supabase.com/)
- Node.js e pnpm instalados
- Projeto clonado e dependências instaladas

## 🔧 Passo 1: Criar Projeto no Supabase

1. Acesse [https://supabase.com/](https://supabase.com/) e faça login
2. Clique em "New Project"
3. Preencha os dados:
   - **Nome do projeto**: doces-cilene (ou nome de sua escolha)
   - **Database Password**: Crie uma senha forte e guarde-a
   - **Region**: Escolha a região mais próxima (ex: South America - São Paulo)
4. Aguarde a criação do projeto (pode levar alguns minutos)

## 🔑 Passo 2: Obter Credenciais

1. No painel do Supabase, vá em **Settings** (ícone de engrenagem) > **API**
2. Copie as seguintes informações:
   - **Project URL** (ex: `https://xxxxx.supabase.co`)
   - **anon public** key (chave pública, é seguro expor no frontend)

## ⚙️ Passo 3: Configurar Variáveis de Ambiente

1. Abra o arquivo `.env.local` na raiz do projeto
2. Substitua os valores das variáveis do Supabase:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=sua_chave_anon_aqui
```

3. Salve o arquivo

## 🗄️ Passo 4: Criar Tabela de Produtos

Você tem duas opções para criar a tabela:

### Opção A: Usar o SQL Editor do Supabase (Recomendado)

1. No painel do Supabase, vá em **SQL Editor**
2. Clique em "New Query"
3. Cole todo o conteúdo do arquivo `supabase/migrations/001_create_products_table.sql`
4. Clique em "Run" para executar
5. Verifique se não há erros

### Opção B: Usar a CLI do Supabase

```bash
# Instalar CLI do Supabase (se ainda não tiver)
npm install -g supabase

# Login
supabase login

# Linkar projeto
supabase link --project-ref seu-project-ref

# Aplicar migração
supabase db push
```

## 📦 Passo 5: Migrar Produtos do JSON para Supabase

Execute o script de migração que irá inserir todos os produtos do arquivo `src/data/products.json` no banco de dados:

```bash
pnpm migrate:products
```

**Saída esperada:**
```
🚀 Iniciando migração de produtos para o Supabase...

🗑️  Limpando produtos existentes...
✅ Produtos existentes removidos

📦 Inserindo 20 produtos...

✅ Brigadeiro Gourmet (doces)
✅ Beijinho de Coco (doces)
✅ Brownie de Chocolate (doces)
...

📊 Verificando produtos inseridos...

✅ Total de produtos no banco: 20

📈 Produtos por categoria:
   • doces: 4
   • salgados: 5
   • massas: 5
   • bebidas: 3
   • combos: 3

🎉 Migração concluída com sucesso!
```

## ✅ Passo 6: Verificar no Supabase

1. No painel do Supabase, vá em **Table Editor**
2. Selecione a tabela `products`
3. Verifique se todos os 20 produtos foram inseridos corretamente

## 🚀 Passo 7: Executar o Projeto

Agora você pode executar o projeto normalmente:

```bash
pnpm dev
```

Acesse `http://localhost:5173` e veja os produtos sendo carregados do Supabase!

## 🔍 Verificação de Funcionamento

Para garantir que tudo está funcionando:

1. ✅ Os produtos devem aparecer na página inicial
2. ✅ A busca deve funcionar
3. ✅ Os filtros por categoria devem funcionar
4. ✅ Ao clicar em um produto, a página de detalhes deve carregar
5. ✅ Os produtos relacionados devem aparecer
6. ✅ Adicionar ao carrinho deve funcionar normalmente

## 🛠️ Comandos Úteis

### Visualizar todos os produtos no banco
Vá para **Table Editor** > **products** no painel do Supabase

### Executar queries personalizadas
Vá para **SQL Editor** e execute, por exemplo:

```sql
-- Ver total de produtos
SELECT COUNT(*) FROM products;

-- Ver produtos por categoria
SELECT category, COUNT(*)
FROM products
GROUP BY category;

-- Ver apenas produtos disponíveis
SELECT * FROM products WHERE available = true;
```

### Re-executar migração (limpa e reinsere tudo)
```bash
pnpm migrate:products
```

## 📁 Arquivos Criados/Modificados

- ✅ `src/lib/supabase.ts` - Cliente Supabase
- ✅ `src/types/database.types.ts` - Tipos do banco de dados
- ✅ `src/api/services/product.service.ts` - Atualizado para usar Supabase
- ✅ `src/hooks/useProducts.ts` - Hooks com React Query
- ✅ `src/pages/Index.tsx` - Atualizado para usar hooks
- ✅ `src/pages/ProductDetails.tsx` - Atualizado para usar hooks
- ✅ `supabase/migrations/001_create_products_table.sql` - Schema SQL
- ✅ `scripts/migrate-products.ts` - Script de migração
- ✅ `.env.local` - Variáveis de ambiente (já existia)

## 🎯 Benefícios da Migração

✅ **Dados dinâmicos** - Produtos podem ser atualizados sem deploy
✅ **Cache inteligente** - React Query gerencia cache automaticamente
✅ **Performance** - Queries otimizadas e índices no banco
✅ **Escalabilidade** - Pronto para milhares de produtos
✅ **Busca poderosa** - Busca case-insensitive e por múltiplos campos
✅ **Tempo real** - Possibilidade de adicionar updates em tempo real no futuro

## 🆘 Problemas Comuns

### Erro: "Invalid API key"
- Verifique se copiou corretamente a `anon key` do Supabase
- Certifique-se de estar usando a chave **anon** e não a **service_role**

### Erro: "relation products does not exist"
- A tabela não foi criada. Execute o SQL do Passo 4 novamente

### Produtos não aparecem
- Execute `pnpm migrate:products` para popular o banco
- Verifique se as variáveis de ambiente estão corretas
- Abra o console do navegador e veja se há erros

### Erro de CORS
- Verifique se a URL do Supabase está correta no `.env.local`
- O Supabase permite CORS por padrão, mas verifique as configurações em **Authentication** > **URL Configuration**

## 🔐 Segurança

- ✅ RLS (Row Level Security) está habilitado
- ✅ Leitura pública está permitida (produtos são públicos)
- ✅ Escrita requer autenticação (quando implementar painel admin)
- ✅ A chave `anon` é segura para uso no frontend

## 📚 Próximos Passos

Agora que os produtos estão no Supabase, você pode:

1. 📱 Criar um painel administrativo para gerenciar produtos
2. 🔐 Implementar autenticação de administradores
3. 📸 Fazer upload de imagens diretamente no Supabase Storage
4. 🔄 Adicionar sincronização em tempo real com Supabase Realtime
5. 📊 Criar analytics e relatórios
6. 🛒 Salvar pedidos no banco de dados

## 💡 Dicas

- Use o **SQL Editor** do Supabase para testar queries
- Ative **Database Logs** em **Settings** > **Database** para debugar
- Use **Table Editor** para editar produtos manualmente
- Consulte a [documentação oficial do Supabase](https://supabase.com/docs)

---

✨ **Parabéns!** Seu projeto agora usa Supabase como backend! 🎉
