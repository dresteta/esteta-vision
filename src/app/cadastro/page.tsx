'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ArrowLeft, User, Mail, Lock, Loader2, CheckCircle, Building2, MapPin, Briefcase } from 'lucide-react';

type UserType = 'client' | 'professional';

export default function CadastroPage() {
  const router = useRouter();
  const [userType, setUserType] = useState<UserType>('client');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Dados comuns
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Dados específicos de profissional
  const [specialty, setSpecialty] = useState('');
  const [city, setCity] = useState('');
  const [clinicName, setClinicName] = useState('');
  const [focus, setFocus] = useState<string[]>([]);

  const focusOptions = ['Facial', 'Capilar', 'Corporal'];

  const handleFocusToggle = (option: string) => {
    setFocus(prev => 
      prev.includes(option) 
        ? prev.filter(f => f !== option)
        : [...prev, option]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validações
    if (!name || !email || !password) {
      setError('Preencha todos os campos obrigatórios');
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres');
      setLoading(false);
      return;
    }

    if (userType === 'professional' && (!specialty || !city || !clinicName || focus.length === 0)) {
      setError('Profissionais devem preencher todos os campos específicos');
      setLoading(false);
      return;
    }

    try {
      // 1. Criar usuário no Supabase Auth (com autoConfirm para desenvolvimento)
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            user_type: userType
          },
          emailRedirectTo: undefined // Desabilita confirmação de email para desenvolvimento
        }
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Erro ao criar usuário');
      }

      // 2. Fazer login automático para estabelecer sessão autenticada
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (signInError) {
        console.warn('Aviso: Login automático falhou, mas usuário foi criado:', signInError);
        // Continua mesmo se login falhar - usuário pode fazer login manual
      }

      // 3. Aguardar um momento para garantir que a sessão foi estabelecida
      await new Promise(resolve => setTimeout(resolve, 500));

      // 4. Inserir dados na tabela users (agora com sessão autenticada)
      const { error: userError } = await supabase
        .from('users')
        .insert([{
          id: authData.user.id,
          name,
          email,
          type: userType
        }]);

      if (userError) {
        console.error('Erro ao inserir na tabela users:', userError);
        throw new Error(`Erro ao salvar dados do usuário: ${userError.message}`);
      }

      // 5. Se for profissional, inserir dados na tabela professionals
      if (userType === 'professional') {
        const { error: professionalError } = await supabase
          .from('professionals')
          .insert([{
            user_id: authData.user.id,
            specialty,
            city,
            clinic_name: clinicName,
            focus
          }]);

        if (professionalError) {
          console.error('Erro ao inserir na tabela professionals:', professionalError);
          throw new Error(`Erro ao salvar dados profissionais: ${professionalError.message}`);
        }
      }

      setSuccess(true);
      
      // Redirecionar após 2 segundos
      setTimeout(() => {
        if (userType === 'client') {
          router.push('/dashboard-cliente');
        } else {
          router.push('/dashboard-profissional');
        }
      }, 2000);

    } catch (err: any) {
      console.error('Erro no cadastro:', err);
      setError(err.message || 'Erro ao criar conta. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-[#d4af37] mb-4">
            Conta Criada com Sucesso!
          </h2>
          <p className="text-gray-400 mb-6">
            Redirecionando para seu dashboard...
          </p>
          <Loader2 className="w-8 h-8 text-[#d4af37] animate-spin mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-[#d4af37] hover:text-[#b8860b] transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          Voltar para Home
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#d4af37] mb-2">
            Criar Conta
          </h1>
          <p className="text-gray-400">
            Junte-se à revolução da estética com IA
          </p>
        </div>

        {/* Seleção de Tipo de Usuário */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button
            type="button"
            onClick={() => setUserType('client')}
            className={`p-6 rounded-xl border-2 transition-all duration-300 ${
              userType === 'client'
                ? 'border-[#d4af37] bg-[#d4af37]/10'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <User className={`w-8 h-8 mx-auto mb-3 ${
              userType === 'client' ? 'text-[#d4af37]' : 'text-gray-400'
            }`} />
            <h3 className={`font-bold mb-1 ${
              userType === 'client' ? 'text-[#d4af37]' : 'text-gray-400'
            }`}>
              Sou Cliente
            </h3>
            <p className="text-xs text-gray-500">
              Quero visualizar resultados
            </p>
          </button>

          <button
            type="button"
            onClick={() => setUserType('professional')}
            className={`p-6 rounded-xl border-2 transition-all duration-300 ${
              userType === 'professional'
                ? 'border-[#d4af37] bg-[#d4af37]/10'
                : 'border-gray-700 hover:border-gray-600'
            }`}
          >
            <Briefcase className={`w-8 h-8 mx-auto mb-3 ${
              userType === 'professional' ? 'text-[#d4af37]' : 'text-gray-400'
            }`} />
            <h3 className={`font-bold mb-1 ${
              userType === 'professional' ? 'text-[#d4af37]' : 'text-gray-400'
            }`}>
              Sou Profissional
            </h3>
            <p className="text-xs text-gray-500">
              Quero captar clientes
            </p>
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Dados Comuns */}
          <div className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-xl p-6">
            <h3 className="text-lg font-bold text-[#d4af37] mb-4">Dados Pessoais</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="Seu nome completo"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email *
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
                  Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="Mínimo 6 caracteres"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Confirmar Senha *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                    placeholder="Digite a senha novamente"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Dados Específicos de Profissional */}
          {userType === 'professional' && (
            <div className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#d4af37] mb-4">Dados Profissionais</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Especialidade *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                      placeholder="Ex: Dermatologista, Esteticista"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome da Clínica *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={clinicName}
                      onChange={(e) => setClinicName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                      placeholder="Nome da sua clínica"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Cidade *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 rounded-lg text-white focus:border-[#d4af37] focus:outline-none transition-colors"
                      placeholder="Cidade onde atua"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Áreas de Foco * (selecione pelo menos uma)
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {focusOptions.map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => handleFocusToggle(option)}
                        className={`py-3 px-4 rounded-lg border-2 transition-all duration-300 ${
                          focus.includes(option)
                            ? 'border-[#d4af37] bg-[#d4af37]/10 text-[#d4af37]'
                            : 'border-gray-700 text-gray-400 hover:border-gray-600'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

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
                Criando conta...
              </span>
            ) : (
              'Criar Conta'
            )}
          </button>

          {/* Link para Login */}
          <p className="text-center text-gray-400 text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="text-[#d4af37] hover:text-[#b8860b] transition-colors">
              Fazer login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
