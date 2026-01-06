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
