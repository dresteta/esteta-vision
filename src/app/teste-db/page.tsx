'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Database, CheckCircle, XCircle, Loader2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

interface TestResult {
  name: string;
  status: 'success' | 'error' | 'loading' | 'warning';
  message: string;
  data?: any;
  solution?: string;
}

export default function TesteDatabasePage() {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const updateTest = (name: string, status: TestResult['status'], message: string, data?: any, solution?: string) => {
    setTests(prev => {
      const existing = prev.find(t => t.name === name);
      if (existing) {
        return prev.map(t => t.name === name ? { name, status, message, data, solution } : t);
      }
      return [...prev, { name, status, message, data, solution }];
    });
  };

  const runTests = async () => {
    setIsRunning(true);
    setTests([]);

    // Teste 1: Conexão com Supabase
    updateTest('Conexão Supabase', 'loading', 'Testando conexão...');
    try {
      const { data, error } = await supabase.from('users').select('count');
      if (error) throw error;
      updateTest('Conexão Supabase', 'success', 'Conexão estabelecida com sucesso!');
    } catch (error: any) {
      updateTest(
        'Conexão Supabase', 
        'error', 
        `Erro: ${error.message}`,
        null,
        'Verifique se as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão configuradas corretamente.'
      );
    }

    // Teste 2: Verificar tabelas
    updateTest('Verificar Tabelas', 'loading', 'Verificando estrutura do banco...');
    try {
      const tables = ['users', 'professionals', 'evaluations', 'leads'];
      const results = await Promise.all(
        tables.map(async (table) => {
          const { error } = await supabase.from(table).select('*').limit(1);
          return { table, exists: !error };
        })
      );
      
      const allExist = results.every(r => r.exists);
      if (allExist) {
        updateTest('Verificar Tabelas', 'success', `Todas as 4 tabelas encontradas: ${tables.join(', ')}`, results);
      } else {
        const missing = results.filter(r => !r.exists).map(r => r.table);
        updateTest(
          'Verificar Tabelas', 
          'error', 
          `Tabelas faltando: ${missing.join(', ')}`,
          results,
          'Execute o arquivo schema-9.sql no SQL Editor do Supabase para criar as tabelas. Veja INSTRUCOES_SUPABASE.md'
        );
      }
    } catch (error: any) {
      updateTest(
        'Verificar Tabelas', 
        'error', 
        `Erro ao verificar tabelas: ${error.message}`,
        null,
        'Execute o arquivo schema-9.sql no SQL Editor do Supabase.'
      );
    }

    // Teste 3: Inserir usuário de teste
    updateTest('Inserir Usuário Teste', 'loading', 'Criando usuário de teste...');
    try {
      const testUser = {
        id: crypto.randomUUID(),
        name: 'Usuário Teste',
        email: `teste_${Date.now()}@example.com`,
        type: 'client'
      };

      const { data, error } = await supabase
        .from('users')
        .insert([testUser])
        .select();

      if (error) {
        // Verificar se é erro de RLS
        if (error.message.includes('row-level security') || error.code === '42501') {
          updateTest(
            'Inserir Usuário Teste', 
            'warning', 
            'Políticas RLS estão restritivas. Isso é esperado se você não executou o schema completo.',
            error,
            'Execute o arquivo schema-9.sql COMPLETO no SQL Editor do Supabase. Ele contém políticas permissivas para desenvolvimento: CREATE POLICY "Allow all operations on users" ON users FOR ALL USING (true) WITH CHECK (true);'
          );
        } else {
          throw error;
        }
      } else {
        updateTest('Inserir Usuário Teste', 'success', 'Usuário criado com sucesso!', data);
      }
    } catch (error: any) {
      updateTest(
        'Inserir Usuário Teste', 
        'error', 
        `Erro: ${error.message}`,
        error,
        'Verifique se as políticas RLS estão configuradas corretamente. Execute o schema-9.sql completo.'
      );
    }

    // Teste 4: Ler dados
    updateTest('Ler Dados', 'loading', 'Lendo usuários do banco...');
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(5);

      if (error) throw error;
      
      if (data && data.length > 0) {
        updateTest('Ler Dados', 'success', `${data.length} usuários encontrados`, data);
      } else {
        updateTest(
          'Ler Dados', 
          'warning', 
          '0 usuários encontrados',
          null,
          'Isso é normal se você acabou de criar o banco. Tente cadastrar um usuário em /cadastro'
        );
      }
    } catch (error: any) {
      updateTest(
        'Ler Dados', 
        'error', 
        `Erro: ${error.message}`,
        error,
        'Verifique se a tabela users existe e se as políticas RLS permitem leitura.'
      );
    }

    // Teste 5: Verificar Storage
    updateTest('Verificar Storage', 'loading', 'Verificando bucket de fotos...');
    try {
      const { data, error } = await supabase.storage.getBucket('evaluation-photos');
      if (error) {
        updateTest(
          'Verificar Storage', 
          'warning', 
          'Bucket "evaluation-photos" não encontrado',
          error,
          'Execute o comando no SQL Editor do Supabase: INSERT INTO storage.buckets (id, name, public) VALUES (\'evaluation-photos\', \'evaluation-photos\', true) ON CONFLICT (id) DO NOTHING;'
        );
      } else {
        updateTest('Verificar Storage', 'success', 'Bucket "evaluation-photos" encontrado!', data);
      }
    } catch (error: any) {
      updateTest(
        'Verificar Storage', 
        'warning', 
        `Bucket não encontrado: ${error.message}`,
        error,
        'Crie o bucket manualmente no Supabase Storage ou execute o schema-9.sql completo.'
      );
    }

    // Teste 6: Verificar RLS
    updateTest('Verificar RLS', 'loading', 'Testando Row Level Security...');
    try {
      // Tenta acessar sem autenticação
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(1);

      if (error && (error.message.includes('row-level security') || error.code === '42501')) {
        updateTest(
          'Verificar RLS', 
          'warning', 
          'RLS está ativo mas restritivo',
          null,
          'Para desenvolvimento, execute o schema-9.sql que contém políticas permissivas.'
        );
      } else if (!error) {
        updateTest('Verificar RLS', 'success', 'RLS configurado com políticas permissivas (ideal para desenvolvimento)');
      } else {
        throw error;
      }
    } catch (error: any) {
      updateTest(
        'Verificar RLS', 
        'error', 
        `Erro: ${error.message}`,
        error,
        'Verifique as políticas RLS no Supabase Dashboard > Database > Policies'
      );
    }

    setIsRunning(false);
  };

  useEffect(() => {
    runTests();
  }, []);

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'error':
        return <XCircle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'loading':
        return <Loader2 className="w-6 h-6 text-[#d4af37] animate-spin" />;
    }
  };

  const successCount = tests.filter(t => t.status === 'success').length;
  const errorCount = tests.filter(t => t.status === 'error').length;
  const warningCount = tests.filter(t => t.status === 'warning').length;
  const totalTests = tests.length;

  return (
    <div className="min-h-screen bg-black text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#b8860b] transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar para Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <Database className="w-10 h-10 text-[#d4af37]" />
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#d4af37]">
                Teste de Conexão com Banco de Dados
              </h1>
              <p className="text-gray-400 mt-2">
                Verificando integração com Supabase
              </p>
            </div>
          </div>

          {/* Status Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-[#d4af37]">{totalTests}</div>
              <div className="text-sm text-gray-400">Total</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-green-500">{successCount}</div>
              <div className="text-sm text-gray-400">Sucessos</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-yellow-500">{warningCount}</div>
              <div className="text-sm text-gray-400">Avisos</div>
            </div>
            <div className="bg-gradient-to-br from-gray-900 to-black border border-red-500/30 rounded-xl p-4 text-center">
              <div className="text-2xl font-bold text-red-500">{errorCount}</div>
              <div className="text-sm text-gray-400">Erros</div>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="space-y-4">
          {tests.map((test, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br from-gray-900 to-black border rounded-xl p-6 hover:border-[#d4af37] transition-all duration-300 ${
                test.status === 'success' ? 'border-green-500/30' :
                test.status === 'error' ? 'border-red-500/30' :
                test.status === 'warning' ? 'border-yellow-500/30' :
                'border-[#d4af37]/30'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1">
                  {getStatusIcon(test.status)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#d4af37] mb-2">
                    {test.name}
                  </h3>
                  <p className={`text-sm mb-3 ${
                    test.status === 'success' ? 'text-green-400' :
                    test.status === 'error' ? 'text-red-400' :
                    test.status === 'warning' ? 'text-yellow-400' :
                    'text-gray-400'
                  }`}>
                    {test.message}
                  </p>
                  
                  {test.solution && (
                    <div className="mt-3 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                      <p className="text-sm text-blue-300 font-semibold mb-2">💡 Solução:</p>
                      <p className="text-sm text-blue-200">{test.solution}</p>
                    </div>
                  )}
                  
                  {test.data && (
                    <details className="mt-3">
                      <summary className="text-sm text-gray-500 cursor-pointer hover:text-[#d4af37] transition-colors">
                        Ver detalhes técnicos
                      </summary>
                      <pre className="mt-2 p-4 bg-black/50 rounded-lg text-xs text-gray-300 overflow-x-auto">
                        {JSON.stringify(test.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <button
            onClick={runTests}
            disabled={isRunning}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Executando Testes...
              </span>
            ) : (
              'Executar Testes Novamente'
            )}
          </button>
          <Link
            href="/cadastro"
            className="flex-1 px-6 py-3 border-2 border-[#d4af37] text-[#d4af37] font-bold rounded-lg hover:bg-[#d4af37]/10 transition-all duration-300 text-center"
          >
            Ir para Cadastro
          </Link>
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-br from-[#d4af37]/10 to-[#b8860b]/10 border border-[#d4af37]/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#d4af37] mb-3">
            📋 Checklist de Configuração
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>1️⃣ Acesse o Dashboard do Supabase</li>
            <li>2️⃣ Vá em SQL Editor e crie uma nova query</li>
            <li>3️⃣ Copie TODO o conteúdo do arquivo <code className="text-[#d4af37]">schema-9.sql</code></li>
            <li>4️⃣ Cole no SQL Editor e clique em Run</li>
            <li>5️⃣ Aguarde a execução completa</li>
            <li>6️⃣ Volte aqui e execute os testes novamente</li>
          </ul>
          <p className="mt-4 text-xs text-gray-500">
            ⚠️ É importante executar o SQL COMPLETO, incluindo as políticas RLS permissivas para desenvolvimento.
          </p>
          <Link
            href="/INSTRUCOES_SUPABASE.md"
            className="mt-4 inline-block text-sm text-[#d4af37] hover:text-[#b8860b] underline"
          >
            📖 Ver instruções detalhadas
          </Link>
        </div>
      </div>
    </div>
  );
}
