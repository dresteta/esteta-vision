'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { LogOut, Briefcase, Users, TrendingUp, Eye, MapPin, Building2, Star } from 'lucide-react';

interface UserData {
  id: string;
  name: string;
  email: string;
  type: string;
}

interface ProfessionalData {
  id: string;
  specialty: string;
  city: string;
  clinic_name: string;
  focus: string[];
}

interface Lead {
  id: string;
  status: string;
  created_at: string;
  evaluation: {
    area_focus: string;
    sub_area: string;
    user: {
      name: string;
      email: string;
    };
  };
}

export default function DashboardProfissionalPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [professionalData, setProfessionalData] = useState<ProfessionalData | null>(null);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [evaluations, setEvaluations] = useState<any[]>([]);

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

      if (userInfo.type !== 'professional') {
        router.push('/dashboard-cliente');
        return;
      }

      setUserData(userInfo);

      // Buscar dados profissionais
      const { data: profInfo, error: profError } = await supabase
        .from('professionals')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (profError) throw profError;

      setProfessionalData(profInfo);

      // Buscar leads do profissional
      const { data: leadsData, error: leadsError } = await supabase
        .from('leads')
        .select(`
          *,
          evaluation:evaluations(
            area_focus,
            sub_area,
            user:users(name, email)
          )
        `)
        .eq('professional_id', profInfo.id)
        .order('created_at', { ascending: false });

      if (leadsError) throw leadsError;

      setLeads(leadsData || []);

      // Buscar todas as avaliações disponíveis
      const { data: evalData, error: evalError } = await supabase
        .from('evaluations')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (evalError) throw evalError;

      setEvaluations(evalData || []);

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

  const handleInterest = async (evaluationId: string) => {
    if (!professionalData) return;

    try {
      const { error } = await supabase
        .from('leads')
        .insert([{
          evaluation_id: evaluationId,
          professional_id: professionalData.id,
          status: 'interessado'
        }]);

      if (error) throw error;

      alert('Interesse registrado com sucesso!');
      checkAuth(); // Recarregar dados
    } catch (error: any) {
      console.error('Erro ao registrar interesse:', error);
      alert('Erro ao registrar interesse: ' + error.message);
    }
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

  const leadsInteressados = leads.filter(l => l.status === 'interessado').length;
  const leadsProspect = leads.filter(l => l.status === 'prospect').length;
  const leadsConvertidos = leads.filter(l => l.status === 'convertido').length;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-[#d4af37]/20 bg-black/95 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#d4af37]">Dashboard Profissional</h1>
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
        {/* Profile Card */}
        <div className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-20 h-20 bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-full flex items-center justify-center text-black text-3xl font-bold">
              {userData?.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#d4af37] mb-2">{professionalData?.clinic_name}</h2>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Briefcase className="w-4 h-4" />
                  {professionalData?.specialty}
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {professionalData?.city}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {professionalData?.focus.map((f, i) => (
                  <span key={i} className="px-3 py-1 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full text-xs text-[#d4af37]">
                    {f}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#d4af37]/10 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-[#d4af37]" />
              </div>
              <div>
                <div className="text-2xl font-bold text-[#d4af37]">{leads.length}</div>
                <div className="text-sm text-gray-400">Total Leads</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-500">{leadsInteressados}</div>
                <div className="text-sm text-gray-400">Interessados</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-yellow-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-500">{leadsProspect}</div>
                <div className="text-sm text-gray-400">Prospects</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-green-500/30 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/10 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold text-green-500">{leadsConvertidos}</div>
                <div className="text-sm text-gray-400">Convertidos</div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-gray-800">
            <button className="px-6 py-3 border-b-2 border-[#d4af37] text-[#d4af37] font-semibold">
              Novas Oportunidades
            </button>
            <button className="px-6 py-3 text-gray-400 hover:text-[#d4af37] transition-colors">
              Meus Leads
            </button>
          </div>
        </div>

        {/* Avaliações Disponíveis */}
        <div>
          <h2 className="text-2xl font-bold text-[#d4af37] mb-6">Novas Avaliações</h2>
          
          {evaluations.length === 0 ? (
            <div className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-xl p-12 text-center">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-400 mb-2">
                Nenhuma avaliação disponível
              </h3>
              <p className="text-gray-500">
                Novas oportunidades aparecerão aqui
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {evaluations.map((evaluation) => {
                const alreadyInterested = leads.some(l => l.evaluation.id === evaluation.id);
                
                return (
                  <div
                    key={evaluation.id}
                    className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-xl p-6 hover:border-[#d4af37] transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-[#d4af37] mb-1 capitalize">
                          {evaluation.area_focus}
                        </h3>
                        <p className="text-sm text-gray-400">{evaluation.sub_area}</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-xs text-blue-400">
                        Novo
                      </span>
                    </div>

                    <div className="space-y-2 mb-4 text-sm text-gray-400">
                      <div>📸 {evaluation.photos?.length || 0} fotos</div>
                      <div>📅 {new Date(evaluation.created_at).toLocaleDateString('pt-BR')}</div>
                    </div>

                    {alreadyInterested ? (
                      <button
                        disabled
                        className="w-full px-4 py-2 bg-gray-800 text-gray-500 rounded-lg cursor-not-allowed"
                      >
                        Já Demonstrou Interesse
                      </button>
                    ) : (
                      <button
                        onClick={() => handleInterest(evaluation.id)}
                        className="w-full px-4 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black font-bold rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/50 transition-all duration-300"
                      >
                        Demonstrar Interesse
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-8 bg-gradient-to-br from-[#d4af37]/10 to-[#b8860b]/10 border border-[#d4af37]/30 rounded-xl p-6">
          <h3 className="text-lg font-bold text-[#d4af37] mb-3">
            💡 Como Captar Clientes
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✅ Visualize avaliações de potenciais clientes em tempo real</li>
            <li>✅ Demonstre interesse em casos que correspondam à sua especialidade</li>
            <li>✅ Entre em contato direto com leads qualificados</li>
            <li>✅ Acompanhe o status de cada lead até a conversão</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
