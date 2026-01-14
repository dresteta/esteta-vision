'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('facial');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = {
    facial: [
      { name: 'Harmonização facial', icon: '✨' },
      { name: 'Rinomodelação', icon: '👃' },
      { name: 'Toxina botulínica', icon: '💉' },
      { name: 'Bioestimuladores', icon: '🌟' },
      { name: 'Skinbooster', icon: '💧' },
      { name: 'Preenchimentos', icon: '💎' }
    ],
    capilar: [
      { name: 'Bioestimuladores capilares', icon: '🌱' },
      { name: 'Drug delivery', icon: '💊' },
      { name: 'Mesoterapia', icon: '💉' },
      { name: 'Microinfusão', icon: '🔬' },
      { name: 'Laser capilar', icon: '⚡' },
      { name: 'Densidade capilar', icon: '📈' }
    ],
    corporal: [
      { name: 'Bioestimulador corporal', icon: '💪' },
      { name: 'Radiofrequência', icon: '📡' },
      { name: 'Ultrassom', icon: '🔊' },
      { name: 'Criolipólise', icon: '❄️' },
      { name: 'Tecnologias avançadas', icon: '🚀' },
      { name: 'Protocolos combinados', icon: '🎯' }
    ]
  };

  const stats = [
    { value: '85%', label: 'Aumento em Conversões' },
    { value: '2-3min', label: 'Tempo de Processamento' },
    { value: '90%', label: 'Satisfação dos Clientes' },
    { value: '100%', label: 'Segurança e Privacidade' }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header com efeito de scroll */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/95 backdrop-blur-lg shadow-lg shadow-[#d4af37]/10' : 'bg-transparent'
      } border-b border-[#d4af37]/20`}>
        <div className="container mx-auto px-4 py-4 sm:py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xl">E</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#d4af37]">Esteta Vision</h1>
          </div>
          <nav className="flex gap-2 sm:gap-4">
            <Link 
              href="/teste-db" 
              className="px-3 sm:px-6 py-2 border border-green-500 text-green-500 rounded-lg hover:bg-green-500 hover:text-black transition-all duration-300 text-sm sm:text-base"
            >
              Teste DB
            </Link>
            <Link 
              href="/login" 
              className="px-3 sm:px-6 py-2 border border-[#d4af37] text-[#d4af37] rounded-lg hover:bg-[#d4af37] hover:text-black transition-all duration-300 text-sm sm:text-base"
            >
              Login
            </Link>
            <Link 
              href="/cadastro" 
              className="px-3 sm:px-6 py-2 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black rounded-lg hover:shadow-lg hover:shadow-[#d4af37]/50 transition-all duration-300 font-semibold text-sm sm:text-base hover:scale-105"
            >
              Cadastrar
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section com animação */}
      <section className="container mx-auto px-4 pt-32 pb-20 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 bg-[#d4af37]/10 border border-[#d4af37]/30 rounded-full">
            <span className="text-[#d4af37] text-sm font-semibold">🚀 Tecnologia de IA Avançada</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#f4e4c1] via-[#d4af37] to-[#b8860b] bg-clip-text text-transparent animate-pulse">
            Prévia Estética 360° com IA
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12">
            Transforme expectativas em realidade. Visualize resultados antes do procedimento.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/cadastro" 
              className="w-full sm:w-auto inline-block px-10 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black text-lg font-bold rounded-lg hover:shadow-2xl hover:shadow-[#d4af37]/50 transition-all duration-300 hover:scale-105"
            >
              Começar Agora Grátis
            </Link>
            <button 
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="w-full sm:w-auto px-10 py-4 border-2 border-[#d4af37] text-[#d4af37] rounded-lg hover:bg-[#d4af37]/10 transition-all duration-300"
            >
              Ver Demonstração
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-2xl p-6 text-center hover:border-[#d4af37] transition-all duration-300 hover:scale-105">
              <div className="text-3xl sm:text-4xl font-bold text-[#d4af37] mb-2">{stat.value}</div>
              <div className="text-sm text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section com Tabs Interativas */}
      <section id="features" className="container mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-[#d4af37]">
          Áreas de Atuação
        </h2>
        <p className="text-center text-gray-400 mb-12 max-w-2xl mx-auto">
          Tecnologia de ponta para todas as especialidades estéticas
        </p>
        
        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <button
            onClick={() => setActiveTab('facial')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'facial'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black'
                : 'bg-gray-900 text-gray-400 hover:text-[#d4af37]'
            }`}
          >
            ✨ Facial
          </button>
          <button
            onClick={() => setActiveTab('capilar')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'capilar'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black'
                : 'bg-gray-900 text-gray-400 hover:text-[#d4af37]'
            }`}
          >
            💇‍♀️ Capilar
          </button>
          <button
            onClick={() => setActiveTab('corporal')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
              activeTab === 'corporal'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black'
                : 'bg-gray-900 text-gray-400 hover:text-[#d4af37]'
            }`}
          >
            💪 Corporal
          </button>
        </div>

        {/* Tab Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features[activeTab as keyof typeof features].map((feature, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-xl p-6 hover:border-[#d4af37] transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-[#d4af37]/20"
              >
                <div className="text-4xl mb-3">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-[#d4af37]">{feature.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-transparent via-[#d4af37]/5 to-transparent">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-[#d4af37]">
          Como Funciona
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-full flex items-center justify-center text-black text-3xl font-bold">
              1
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#d4af37]">Upload da Foto</h3>
            <p className="text-gray-400">
              Faça upload de fotos do paciente em diferentes ângulos. Processo rápido e seguro.
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-full flex items-center justify-center text-black text-3xl font-bold">
              2
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#d4af37]">IA Processa</h3>
            <p className="text-gray-400">
              Nossa IA analisa e gera visualizações realistas dos resultados esperados em 2-3 minutos.
            </p>
          </div>
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-full flex items-center justify-center text-black text-3xl font-bold">
              3
            </div>
            <h3 className="text-xl font-bold mb-4 text-[#d4af37]">Visualize 360°</h3>
            <p className="text-gray-400">
              Apresente ao paciente a prévia completa em 360°. Aumente confiança e conversões.
            </p>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-[#d4af37]">
          O Que Nossos Clientes Dizem
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-2xl p-8 hover:border-[#d4af37] transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-full flex items-center justify-center text-black font-bold text-xl">
                MC
              </div>
              <div className="ml-4">
                <h4 className="font-bold text-[#d4af37]">Dra. Maria Clara</h4>
                <p className="text-sm text-gray-400">Dermatologista</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "A prévia em 360° revolucionou minha clínica. Meus pacientes agora têm total confiança antes de qualquer procedimento. Taxa de conversão aumentou 85%!"
            </p>
            <div className="flex mt-4 text-[#d4af37]">
              ⭐⭐⭐⭐⭐
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-2xl p-8 hover:border-[#d4af37] transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-full flex items-center justify-center text-black font-bold text-xl">
                RS
              </div>
              <div className="ml-4">
                <h4 className="font-bold text-[#d4af37]">Dr. Ricardo Santos</h4>
                <p className="text-sm text-gray-400">Cirurgião Plástico</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "Ferramenta indispensável! A IA gera resultados incrivelmente realistas. Meus pacientes ficam impressionados e seguros com suas escolhas."
            </p>
            <div className="flex mt-4 text-[#d4af37]">
              ⭐⭐⭐⭐⭐
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-2xl p-8 hover:border-[#d4af37] transition-all duration-300 hover:scale-105">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-[#d4af37] to-[#b8860b] rounded-full flex items-center justify-center text-black font-bold text-xl">
                AF
              </div>
              <div className="ml-4">
                <h4 className="font-bold text-[#d4af37]">Ana Ferreira</h4>
                <p className="text-sm text-gray-400">Esteticista</p>
              </div>
            </div>
            <p className="text-gray-300 italic">
              "Simplesmente perfeito! Consigo mostrar aos meus clientes exatamente como ficarão. Reduziu cancelamentos e aumentou satisfação em 90%."
            </p>
            <div className="flex mt-4 text-[#d4af37]">
              ⭐⭐⭐⭐⭐
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section com Accordion */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-16 text-[#d4af37]">
          Perguntas Frequentes
        </h2>
        <div className="max-w-4xl mx-auto space-y-4">
          {[
            {
              q: 'Como funciona a prévia em 360°?',
              a: 'Nossa IA analisa fotos do paciente e gera visualizações realistas dos resultados esperados em diferentes ângulos. O processo é rápido, preciso e totalmente digital.'
            },
            {
              q: 'Quais procedimentos são suportados?',
              a: 'Suportamos harmonização facial, rinomodelação, preenchimentos, toxina botulínica, bioestimuladores capilares e corporais, além de diversos outros procedimentos estéticos.'
            },
            {
              q: 'É seguro e confidencial?',
              a: 'Sim! Todas as imagens são criptografadas e armazenadas com segurança máxima. Seguimos rigorosamente a LGPD e protocolos internacionais de privacidade de dados médicos.'
            },
            {
              q: 'Quanto tempo leva para gerar a prévia?',
              a: 'Em média, 2-3 minutos. Nossa IA processa as imagens rapidamente, permitindo que você mostre os resultados ao paciente durante a própria consulta.'
            },
            {
              q: 'Posso usar no meu celular?',
              a: 'Sim! Nossa plataforma é 100% responsiva e funciona perfeitamente em smartphones, tablets e computadores. Acesse de qualquer lugar, a qualquer momento.'
            }
          ].map((faq, index) => (
            <details key={index} className="bg-gradient-to-br from-gray-900 to-black border border-[#d4af37]/30 rounded-2xl p-6 hover:border-[#d4af37] transition-all duration-300 group">
              <summary className="text-lg font-bold text-[#d4af37] cursor-pointer list-none flex justify-between items-center">
                {faq.q}
                <span className="text-2xl group-open:rotate-180 transition-transform duration-300">▼</span>
              </summary>
              <p className="text-gray-300 mt-4 leading-relaxed">{faq.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#d4af37]/10 to-[#b8860b]/10 border border-[#d4af37]/30 rounded-2xl p-8 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-[#d4af37]">
            Pronto para revolucionar sua prática estética?
          </h2>
          <p className="text-lg sm:text-xl text-gray-300 mb-8">
            Junte-se aos profissionais que já utilizam IA para converter mais clientes.
          </p>
          <Link 
            href="/cadastro" 
            className="inline-block px-10 py-4 bg-gradient-to-r from-[#d4af37] to-[#b8860b] text-black text-lg font-bold rounded-lg hover:shadow-2xl hover:shadow-[#d4af37]/50 transition-all duration-300 hover:scale-105"
          >
            Criar Conta Grátis
          </Link>
          <p className="text-sm text-gray-500 mt-4">Sem cartão de crédito • Teste grátis por 14 dias</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#d4af37]/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-[#d4af37] font-bold mb-4">Esteta Vision</h3>
              <p className="text-gray-400 text-sm">
                Tecnologia de IA para visualização de resultados estéticos em 360°.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#features" className="hover:text-[#d4af37] transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-[#d4af37] transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-[#d4af37] transition-colors">Demonstração</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[#d4af37] transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-[#d4af37] transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-[#d4af37] transition-colors">Contato</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-[#d4af37] transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-[#d4af37] transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-[#d4af37] transition-colors">LGPD</a></li>
              </ul>
            </div>
          </div>
          <div className="text-center text-gray-400 text-sm pt-8 border-t border-[#d4af37]/20">
            <p>&copy; 2024 Esteta Vision. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
