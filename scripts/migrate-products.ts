import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// Carregar variáveis de ambiente do .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env.local') });

// Carregar produtos do JSON
const productsData = JSON.parse(
  readFileSync(join(__dirname, '../src/data/products.json'), 'utf-8')
);

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY devem estar definidos no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrateProducts() {
  console.log('🚀 Iniciando migração de produtos para o Supabase...\n');

  try {
    // 1. Limpar tabela existente (opcional - comentar se não quiser limpar)
    console.log('🗑️  Limpando produtos existentes...');
    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Deleta todos

    if (deleteError) {
      console.warn('⚠️  Aviso ao limpar produtos:', deleteError.message);
    } else {
      console.log('✅ Produtos existentes removidos\n');
    }

    // 2. Inserir produtos do JSON
    console.log(`📦 Inserindo ${productsData.length} produtos...\n`);

    for (const product of productsData) {
      const { error } = await supabase
        .from('products')
        .insert({
          id: product.id,
          slug: product.slug,
          name: product.name,
          category: product.category,
          price: product.price,
          unit: product.unit,
          image: product.image,
          description: product.description,
          tags: product.tags,
          available: product.available,
        });

      if (error) {
        console.error(`❌ Erro ao inserir "${product.name}":`, error.message);
      } else {
        console.log(`✅ ${product.name} (${product.category})`);
      }
    }

    // 3. Verificar produtos inseridos
    console.log('\n📊 Verificando produtos inseridos...');
    const { data: insertedProducts, error: countError } = await supabase
      .from('products')
      .select('*', { count: 'exact' });

    if (countError) {
      console.error('❌ Erro ao contar produtos:', countError.message);
    } else {
      console.log(`\n✅ Total de produtos no banco: ${insertedProducts?.length || 0}`);

      // Mostrar resumo por categoria
      const categoryCounts = insertedProducts?.reduce((acc: Record<string, number>, p: any) => {
        acc[p.category] = (acc[p.category] || 0) + 1;
        return acc;
      }, {});

      console.log('\n📈 Produtos por categoria:');
      Object.entries(categoryCounts || {}).forEach(([category, count]) => {
        console.log(`   • ${category}: ${count}`);
      });
    }

    console.log('\n🎉 Migração concluída com sucesso!');
  } catch (error) {
    console.error('\n❌ Erro durante a migração:', error);
    process.exit(1);
  }
}

migrateProducts();
