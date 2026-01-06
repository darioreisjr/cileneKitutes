-- Criar tabela de produtos
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::TEXT,
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
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);
CREATE INDEX IF NOT EXISTS idx_products_tags ON products USING GIN(tags);

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

-- Criar policy para inserção (apenas para usuários autenticados ou service_role)
CREATE POLICY "Apenas usuários autenticados podem inserir produtos"
  ON products
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Criar policy para atualização (apenas para usuários autenticados ou service_role)
CREATE POLICY "Apenas usuários autenticados podem atualizar produtos"
  ON products
  FOR UPDATE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Criar policy para deleção (apenas para usuários autenticados ou service_role)
CREATE POLICY "Apenas usuários autenticados podem deletar produtos"
  ON products
  FOR DELETE
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Comentários na tabela e colunas
COMMENT ON TABLE products IS 'Tabela de produtos do catálogo';
COMMENT ON COLUMN products.id IS 'Identificador único do produto';
COMMENT ON COLUMN products.slug IS 'URL amigável do produto (único)';
COMMENT ON COLUMN products.name IS 'Nome do produto';
COMMENT ON COLUMN products.category IS 'Categoria do produto (doces, salgados, massas, bebidas, combos)';
COMMENT ON COLUMN products.price IS 'Preço unitário do produto';
COMMENT ON COLUMN products.unit IS 'Unidade de medida (un, kg, porção, etc)';
COMMENT ON COLUMN products.image IS 'URL da imagem do produto';
COMMENT ON COLUMN products.description IS 'Descrição detalhada do produto';
COMMENT ON COLUMN products.tags IS 'Tags do produto (mais_vendido, novo, promo)';
COMMENT ON COLUMN products.available IS 'Indica se o produto está disponível para venda';
