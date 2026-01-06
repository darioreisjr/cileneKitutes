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

async function checkTable() {
  console.log('🔍 Verificando estrutura da tabela products...\n');

  try {
    // Tentar buscar um produto para ver a estrutura
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erro ao acessar tabela:', error);
      return;
    }

    if (data && data.length > 0) {
      console.log('✅ Tabela encontrada!\n');
      console.log('📋 Estrutura do primeiro produto:');
      console.log(JSON.stringify(data[0], null, 2));
      console.log('\n📊 Colunas disponíveis:');
      Object.keys(data[0]).forEach(key => {
        console.log(`   • ${key}: ${typeof data[0][key]}`);
      });
    } else {
      console.log('⚠️  Tabela existe mas está vazia');
    }

    // Contar total de produtos
    const { count } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true });

    console.log(`\n📦 Total de produtos no banco: ${count || 0}`);

  } catch (error) {
    console.error('❌ Erro:', error);
  }
}

checkTable();
