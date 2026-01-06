import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, '../.env.local') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Erro: Variáveis de ambiente não configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCategories() {
  console.log('🔍 Verificando categorias no Supabase...\n');

  try {
    // Verificar se existe tabela de categorias
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*');

    if (!catError && categories && categories.length > 0) {
      console.log('✅ Tabela de categorias encontrada!\n');
      console.log('📋 Categorias:');
      categories.forEach((cat: any) => {
        console.log(JSON.stringify(cat, null, 2));
      });
      console.log(`\n📦 Total de categorias: ${categories.length}`);
    } else if (catError) {
      console.log('⚠️  Não há tabela "categories" separada');
      console.log('   Erro:', catError.message, '\n');
    }

    // Buscar categorias únicas dos produtos
    console.log('📊 Buscando categorias dos produtos...\n');
    const { data: products, error: prodError } = await supabase
      .from('products')
      .select('category_slug');

    if (prodError) {
      console.error('❌ Erro ao buscar produtos:', prodError);
      return;
    }

    const uniqueCategories = new Set(products?.map((p: any) => p.category_slug) || []);
    console.log('✅ Categorias únicas encontradas nos produtos:');
    Array.from(uniqueCategories).forEach(cat => {
      console.log(`   • ${cat}`);
    });

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

checkCategories();
