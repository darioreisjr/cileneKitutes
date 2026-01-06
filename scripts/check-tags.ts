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

async function checkTags() {
  console.log('🔍 Verificando tags no Supabase...\n');

  try {
    // Verificar se existe tabela de tags
    const { data: tags, error: tagError } = await supabase
      .from('tags')
      .select('*');

    if (!tagError && tags && tags.length > 0) {
      console.log('✅ Tabela de tags encontrada!\n');
      console.log('📋 Tags:');
      tags.forEach((tag: any) => {
        console.log(JSON.stringify(tag, null, 2));
      });
      console.log(`\n📦 Total de tags: ${tags.length}`);
    } else if (tagError) {
      console.log('⚠️  Não há tabela "tags" separada');
      console.log('   Erro:', tagError.message, '\n');
    }

    // Verificar se existe tabela product_tags (relação many-to-many)
    const { data: productTags, error: ptError } = await supabase
      .from('product_tags')
      .select('*')
      .limit(5);

    if (!ptError && productTags && productTags.length > 0) {
      console.log('\n✅ Tabela product_tags encontrada (relação many-to-many)!\n');
      console.log('📋 Primeiras relações:');
      productTags.forEach((pt: any) => {
        console.log(JSON.stringify(pt, null, 2));
      });
    } else if (ptError) {
      console.log('\n⚠️  Não há tabela "product_tags"');
      console.log('   Erro:', ptError.message);
    }

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

checkTags();
