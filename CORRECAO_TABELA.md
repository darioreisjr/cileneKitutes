# 🔧 Correção da Tabela Products

A tabela `products` foi criada incorretamente sem a coluna `category`. Siga estes passos para corrigir:

## Passo 1: Deletar e Recriar a Tabela

1. Acesse o painel do Supabase em [https://supabase.com](https://supabase.com)
2. Vá em **SQL Editor** (ícone </>)
3. Clique em **New Query**
4. Cole o SQL abaixo (ou copie de `supabase/migrations/000_drop_and_recreate.sql`):

```sql
-- Deletar tabela existente e suas dependências
DROP TABLE IF EXISTS products CASCADE;

-- Criar tabela de produtos
CREATE TABLE products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  unit TEXT NOT NULL DEFAULT 'un',
  image TEXT NOT NULL,
  description TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Criar índices para melhor performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_available ON products(available);
CREATE INDEX idx_products_tags ON products USING GIN(tags);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger para atualizar updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Habilitar RLS (Row Level Security)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Criar policy para permitir leitura pública
CREATE POLICY "Produtos são visíveis para todos"
  ON products
  FOR SELECT
  USING (true);

-- Criar policy para inserção (permite sem autenticação para este caso)
CREATE POLICY "Permitir inserção de produtos"
  ON products
  FOR INSERT
  WITH CHECK (true);

-- Criar policy para atualização
CREATE POLICY "Permitir atualização de produtos"
  ON products
  FOR UPDATE
  USING (true);

-- Criar policy para deleção
CREATE POLICY "Permitir deleção de produtos"
  ON products
  FOR DELETE
  USING (true);
```

5. Clique em **Run** (ou pressione Ctrl+Enter)
6. Verifique se não há erros (deve mostrar "Success. No rows returned")

## Passo 2: Verificar a Tabela

1. Vá em **Table Editor**
2. Selecione a tabela `products`
3. Verifique se as colunas estão corretas:
   - ✅ id
   - ✅ slug
   - ✅ name
   - ✅ category ← **Esta coluna deve estar presente!**
   - ✅ price
   - ✅ unit
   - ✅ image
   - ✅ description
   - ✅ tags
   - ✅ available
   - ✅ created_at
   - ✅ updated_at

## Passo 3: Migrar os Produtos

Agora execute o script de migração no terminal:

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
✅ Pudim de Leite (doces)
✅ Coxinha de Frango (salgados)
... (mais produtos)

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

## Passo 4: Verificar no Supabase

1. Vá em **Table Editor** > **products**
2. Deve ver 20 produtos com todas as informações corretas

## Passo 5: Testar a Aplicação

Execute o projeto:

```bash
pnpm dev
```

Acesse `http://localhost:5173` e verifique se os produtos aparecem!

---

## ❓ Problemas?

Se ainda houver erros, verifique:
- ✅ As credenciais no `.env.local` estão corretas
- ✅ A tabela foi criada com todas as colunas
- ✅ As policies estão ativas (veja em **Authentication** > **Policies**)
