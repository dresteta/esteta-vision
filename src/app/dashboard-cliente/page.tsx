'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut, User, Camera, Image as ImageIcon, Sparkles, Clock, CheckCircle } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  type: string;
}

interface Evaluation {
  id: string;
  area_focus: string;
  sub_area: string;
  concerns: string[];
  photos: string[];
  ai_preview_url: string | null;
  ai_comparison_url: string | null;
  created_at: string;
}

export default function DashboardClientePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Buscar dados do usuário
      const { data: userInfo, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      if (userInfo.type !== 'client') {
        router.push('/dashboard-profissional');
        return;
      }

      setUserData(userInfo);

      // Buscar avaliações do usuário
      const { data: evaluationsData, error: evalError } = await supabase
        .from('evaluations')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (evalError) throw evalError;

      setEvaluations(evaluationsData || []);
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#d4af37] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-[#d4af37]/20 bg-black/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">E</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#d4af37]">Dashboard Cliente</h1>
              <p className="text-xs text-gray-400">Bem-vindo, {userData?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 border border-[#d4af37] text-[#d4af37] rounded-lg hover:bg-[#d4af37] hover:text-black transition-all duration-300"
          >
            <LogOut className="w-4 h-4" />
            Sair
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#d4af37]/10 rounded-lg flex items-center justify-center">
                <Camera className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#d4af37]">{evaluations.length}</div>
                <div className="text-sm text-gray-400">Avaliações</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">
                  {evaluations.filter(e => e.ai_preview_url).length}
                </div>
                <div className="text-sm text-gray-400">Concluídas</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">
                  {evaluations.filter(e => !e.ai_preview_url).length}
                </div>
                <div className="text-sm text-gray-400">Processando</div>
              </div>
            </div>
          </div>
        </div>

        {/* Nova Avaliação */}
        <div className="mb-8">
          <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/50 transition-all duration-300 flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5" />
            Nova Avaliação com IA
          </button>
        </div>

        {/* Lista de Avaliações */}
        <div>
          <h2 className="text-2xl font-bold text-[#d4af37] mb-6">Minhas Avaliações</h2>
          
          {evaluations.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-xl p-12 text-center">
              <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">
                Nenhuma avaliação ainda
              </h3>
              <p className="text-gray-500 mb-6">
                Crie sua primeira avaliação para visualizar resultados com IA
              </p>
              <button className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/50 transition-all duration-300">
                Começar Agora
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evaluations.map((evaluation) => (
                <div
                  key={evaluation.id}
                  className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-xl overflow-hidden hover:border-[#d4af37] transition-all duration-300 hover:scale-105"
                >
                  {/* Preview Image */}
                  <div className="aspect-video bg-gray-800 relative">
                    {evaluation.ai_preview_url ? (
                      <img
                        src={evaluation.ai_preview_url}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-center">
                          <Clock className="w-12 h-12 text-gray-600 mx-auto mb-2 animate-pulse" />
                          <p className="text-sm text-gray-500">Processando...</p>
                        </div>
                      </div>
                    )}
                    {evaluation.ai_preview_url && (
                      <div className="absolute top-2 right-2 px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                        Concluído
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-[#d4af37] mb-2 capitalize">
                      {evaluation.area_focus} - {evaluation.sub_area}
                    </h3>
                    <p className="text-sm text-gray-400 mb-3">
                      {new Date(evaluation.created_at).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}
                    </p>
                    <div className="flex gap-2">
                      <button className="flex-1 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37] text-[#d4af37] rounded-lg hover:bg-[#d4af37] hover:text-black transition-all duration-300 text-sm font-semibold">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-br from-[#d4af37]/10 to-[#b8860b]/10 border border-[#d4af37]/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#d4af37] mb-3">
            💡 Como Funciona
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✅ Faça upload de fotos da área que deseja avaliar</li>
            <li>✅ Nossa IA processa e gera uma prévia em 360° em 2-3 minutos</li>
            <li>✅ Visualize resultados realistas antes de qualquer procedimento</li>
            <li>✅ Profissionais qualificados podem entrar em contato com você</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
