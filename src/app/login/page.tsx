'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, Mail, Lock, Loader2, LogIn } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Preencha todos os campos');
      setLoading(false);
      return;
    }

    try {
      // 1. Fazer login no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Erro ao fazer login');
      }

      // 2. Buscar dados do usuário na tabela users
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (userError) throw userError;

      // 3. Redirecionar baseado no tipo de usuário
      if (userData.type === 'client') {
        router.push('/dashboard-cliente');
      } else if (userData.type === 'professional') {
        router.push('/dashboard-profissional');
      } else {
        throw new Error('Tipo de usuário inválido');
      }

    } catch (err: any) {
      console.error('Erro no login:', err);
      if (err.message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos');
      } else {
        setError(err.message || 'Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#b8860b] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Home
        </Link>

        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-full flex items-center justify-center">
            <LogIn className="w-8 h-8 text-black" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-[#d4af37] mb-2">
            Bem-vindo de Volta
          </h1>
          <p className="text-gray-400">
            Faça login para continuar
          </p>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-xl p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="seu@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="Sua senha"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-700 bg-black text-[#d4af37] focus:ring-[#d4af37] focus:ring-offset-0"
                  />
                  Lembrar de mim
                </label>
                <a href="#" className="text-[#d4af37] hover:text-[#b8860b] transition-colors">
                  Esqueceu a senha?
                </a>
              </div>
            </div>
          </div>

          {/* Mensagem de Erro */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Botão de Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Entrando...
              </span>
            ) : (
              'Entrar'
            )}
          </button>

          {/* Link para Cadastro */}
          <p className="text-center text-gray-400 text-sm">
            Não tem uma conta?{' '}
            <Link href="/cadastro" className="text-[#d4af37] hover:text-[#b8860b] transition-colors">
              Criar conta grátis
            </Link>
          </p>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-800"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-black text-gray-500">ou</span>
          </div>
        </div>

        {/* Link para Teste */}
        <Link
          href="/teste-db"
          className="block w-full py-3 border-2 border-[#d4af37]/30 text-[#d4af37] text-center rounded-lg hover:bg-[#d4af37]/10 transition-all duration-300"
        >
          Testar Conexão com Banco de Dados
        </Link>
      </div>
    </div>
  );
}
