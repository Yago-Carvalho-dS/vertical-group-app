import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, Users, FileText, LogOut, CheckCircle2, 
  AlertTriangle, XCircle, Calculator, HardHat, Anchor, 
  Building2, ChevronRight, Save, Briefcase, User
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';

// --- CONFIGURAÇÃO DOS CRITÉRIOS DE AVALIAÇÃO (Regra de Negócio Precisa) ---

const CRITERIA_RULES = {
  // --- ETAPA 1: BORDO (Avaliação 360º) ---
  
  // 1. Supervisor -> Liderado
  'sup_to_liderado': {
    stage: 'etapa_1',
    criteria: [
      { id: 'tec', label: 'Qualidade Técnica (Executar bem)', peso: 0.45 },
      { id: 'hor', label: 'Cumprimento de Horário', peso: 0.20 },
      { id: 'sms', label: 'Atenção às Exigências de SMS', peso: 0.20 },
      { id: 'rel', label: 'Relacionamento Interpessoal', peso: 0.15 },
    ]
  },
  
  // 2. Liderado -> Supervisor
  'liderado_to_sup': {
    stage: 'etapa_1',
    criteria: [
      { id: 'tec_ens', label: 'Conhecimento Técnico (Saber ensinar)', peso: 0.35 },
      { id: 'sms', label: 'Atenção às Exigências de SMS', peso: 0.25 },
      { id: 'lid', label: 'Liderança da Equipe', peso: 0.20 },
      { id: 'rel', label: 'Relacionamento Interpessoal', peso: 0.20 },
    ]
  },

  // 3. Supervisor -> Coord. Terra
  'sup_to_coord': {
    stage: 'etapa_1',
    criteria: [
      { id: 'esc', label: 'Esclarecimento Trabalho a Ser Executado', peso: 0.30 },
      { id: 'tec', label: 'Conhecimento Técnico', peso: 0.30 },
      { id: 'sup', label: 'Suporte / Acompanhamento e Comunicação', peso: 0.25 },
      { id: 'rel', label: 'Relacionamento Interpessoal', peso: 0.15 },
    ]
  },

  // 4. Coord. Terra -> Supervisor
  'coord_to_sup': {
    stage: 'etapa_1',
    criteria: [
      { id: 'tec', label: 'Qualidade Técnica (Executar bem)', peso: 0.25 },
      { id: 'sms', label: 'Atenção às Exigências de SMS', peso: 0.25 },
      { id: 'cli', label: 'Relacionamento/Comunicação Cliente', peso: 0.25 },
      { id: 'lid', label: 'Liderança', peso: 0.25 },
    ]
  },

  // --- ETAPA 2: BASE (Avaliação Departamental) ---
  
  // 5. Base (Departamentos)
  'base_depts': {
    stage: 'etapa_2',
    criteria: [
      { id: 'sms_epi', label: 'SMS - Cuidados com EPI', peso: 0.20 },
      { id: 'sms_stop', label: 'SMS - Entrega Stop Card', peso: 0.10 },
      { id: 'treinamento', label: 'Treinamento - Prazos', peso: 0.15 },
      { id: 'saude', label: 'Saúde (ASO) - Prazos', peso: 0.15 },
      { id: 'suprimentos', label: 'Suprimentos - Cuidados/Materiais', peso: 0.15 },
      { id: 'ti', label: 'TI - Cuidados Equipamentos', peso: 0.15 },
      { id: 'frentes', label: 'Frentes Ops - Documentos', peso: 0.10 },
    ]
  }
};

// --- DADOS MOCKADOS (Pendências) ---

const PENDING_EVALUATIONS = {
  'supervisor': [
    { id: '1', name: 'João Silva (Soldador)', type: 'liderado', context: 'sup_to_liderado' },
    { id: '99', name: 'Coordenação Onshore (Projeto Alpha)', type: 'coordenacao', context: 'sup_to_coord' },
  ],
  'liderado': [
    { id: '50', name: 'Carlos (Supervisor)', type: 'supervisor', context: 'liderado_to_sup' }
  ],
  'coord_terra': [
    { id: '50', name: 'Carlos (Supervisor de Bordo)', type: 'supervisor', context: 'coord_to_sup' }
  ],
  'gestor_base': [
    { id: '1', name: 'João Silva (Fechamento)', type: 'colaborador', context: 'base_depts' }
  ]
};

// --- COMPONENTES ---

const Sidebar = ({ activeTab, setActiveTab, userRole, onLogout }) => (
  <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 z-50 transition-all">
    <div className="p-6 border-b border-slate-700">
      <h1 className="text-xl font-bold tracking-wider text-yellow-500">VERTICAL</h1>
      <span className="text-xs text-slate-400 tracking-widest uppercase">Group System</span>
    </div>
    <nav className="flex-1 p-4 space-y-2">
      <button onClick={() => setActiveTab('list')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'list' ? 'bg-yellow-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}>
        <Users size={20} /><span>Minhas Pendências</span>
      </button>
      <button onClick={() => setActiveTab('dashboard')} className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-yellow-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}>
        <LayoutDashboard size={20} /><span>Dashboard</span>
      </button>
    </nav>
    <div className="p-4 border-t border-slate-700">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-yellow-500">
          {userRole ? userRole.substring(0,2).toUpperCase() : 'GS'}
        </div>
        <div>
          <p className="text-sm font-medium">Logado como:</p>
          <p className="text-xs text-slate-400 capitalize">{userRole?.replace('_', ' ')}</p>
        </div>
      </div>
      <button onClick={onLogout} className="flex items-center space-x-2 text-red-400 hover:text-red-300 text-sm w-full">
        <LogOut size={16} /><span>Sair</span>
      </button>
    </div>
  </div>
);

const EvaluationForm = ({ target, onBack }) => {
  const [scores, setScores] = useState({});
  const [totalScore, setTotalScore] = useState(0);
  
  // Recupera as regras baseadas no contexto (ex: sup_to_liderado)
  const ruleSet = CRITERIA_RULES[target.context];
  const criteriaList = ruleSet.criteria;
  const stage = ruleSet.stage;

  const handleScore = (id, value) => setScores(prev => ({ ...prev, [id]: value }));

  useEffect(() => {
    let acc = 0;
    criteriaList.forEach(c => {
      const score = scores[c.id] || 0;
      acc += score * c.peso;
    });
    setTotalScore(Math.round(acc * 100) / 100);
  }, [scores, criteriaList]);

  // Lógica de Conformidade Diferenciada por Etapa
  const getConformity = (score, currentStage) => {
    if (currentStage === 'etapa_2') {
      // Regra da BASE (Mais rigorosa)
      // 98-100: Satisfatória | 75-97: Regular | 50-74: Insuficiente | 0-49: Crítica
      if (score >= 98) return { label: 'Satisfatória', color: 'text-green-600 bg-green-100', icon: <CheckCircle2 size={20} /> };
      if (score >= 75) return { label: 'Regular', color: 'text-yellow-600 bg-yellow-100', icon: <AlertTriangle size={20} /> };
      if (score >= 50) return { label: 'Insuficiente', color: 'text-orange-600 bg-orange-100', icon: <XCircle size={20} /> };
      return { label: 'Crítica', color: 'text-red-600 bg-red-100', icon: <XCircle size={20} /> };
    } else {
      // Regra de BORDO (Etapa 1)
      // 80-100: Bom | 60-79: Regular | 50-59: Insuficiente | 0-49: Crítica
      if (score >= 80) return { label: 'Bom', color: 'text-green-600 bg-green-100', icon: <CheckCircle2 size={20} /> };
      if (score >= 60) return { label: 'Regular', color: 'text-yellow-600 bg-yellow-100', icon: <AlertTriangle size={20} /> };
      if (score >= 50) return { label: 'Insuficiente', color: 'text-orange-600 bg-orange-100', icon: <XCircle size={20} /> };
      return { label: 'Crítica', color: 'text-red-600 bg-red-100', icon: <XCircle size={20} /> };
    }
  };

  const status = getConformity(totalScore, stage);

  // Escala de notas para os botões (Etapa 2 usa Excelente/Bom..., Etapa 1 pode usar o mesmo ou adaptar)
  // Assumindo a escala numérica padrão de input: Excelente=100, Bom=85, Regular=60, Ruim=30
  // para alimentar o cálculo.
  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center">
        <div>
          <button onClick={onBack} className="text-xs text-blue-600 hover:underline mb-1 flex items-center gap-1">← Voltar para lista</button>
          <h2 className="text-xl font-bold text-slate-800">Avaliação de Desempenho</h2>
          <p className="text-sm text-slate-500">
            Avaliando: <span className="font-bold text-slate-700">{target.name}</span>
            <span className="ml-2 text-xs bg-slate-200 px-2 py-0.5 rounded uppercase">{stage.replace('_', ' ')}</span>
          </p>
        </div>
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 font-bold ${status.color}`}>
          {status.icon} {totalScore > 0 ? `${totalScore}%` : '---'}
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {criteriaList.map((crit) => (
            <div key={crit.id} className="bg-white p-4 rounded-lg border border-slate-100 hover:border-blue-200 shadow-sm transition-all">
              <div className="flex justify-between mb-3">
                <label className="font-medium text-slate-800">{crit.label}</label>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono font-bold">Peso: {(crit.peso * 100).toFixed(0)}%</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[
                   { l: 'Excelente', v: 100 }, { l: 'Bom', v: 85 }, 
                   { l: 'Regular', v: 60 }, { l: 'Ruim', v: 30 }
                ].map((opt) => (
                  <button
                    key={opt.l}
                    onClick={() => handleScore(crit.id, opt.v)}
                    className={`py-2 text-xs font-bold rounded border transition-all 
                      ${scores[crit.id] === opt.v 
                        ? 'bg-slate-800 text-white border-slate-800 ring-2 ring-offset-1 ring-slate-400' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'}`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {/* Resumo Lateral */}
        <div className="bg-slate-50 p-6 rounded-xl h-fit border border-slate-200 sticky top-6">
          <h3 className="text-xs font-bold uppercase text-slate-400 mb-4 flex items-center gap-2"><Calculator size={14}/> Extrato de Cálculo</h3>
          <div className="space-y-2 text-xs mb-6">
            {criteriaList.map(crit => (
              <div key={crit.id} className="flex justify-between border-b border-slate-200 pb-1 border-dashed">
                <span className="text-slate-500 truncate w-40">{crit.label}</span>
                <span className="font-mono text-slate-700">{(scores[crit.id] ? (scores[crit.id] * crit.peso).toFixed(1) : '0.0')}%</span>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-end border-t border-slate-300 pt-4">
            <span className="font-bold text-slate-700">Nota Final</span>
            <span className="text-4xl font-black text-slate-900">{totalScore}%</span>
          </div>
          <div className="mt-2 text-center text-xs text-slate-400 font-bold uppercase">{status.label}</div>
          
          <div className="mt-4 p-3 bg-white rounded border border-slate-200 text-[10px] text-slate-500">
            <p className="font-bold mb-1">Legenda desta Etapa:</p>
            {stage === 'etapa_2' ? (
              <>
                <p>98-100: Satisfatória</p>
                <p>75-97: Regular</p>
                <p>50-74: Insuficiente</p>
                <p>0-49: Crítica</p>
              </>
            ) : (
              <>
                <p>80-100: Bom</p>
                <p>60-79: Regular</p>
                <p>50-59: Insuficiente</p>
                <p>0-49: Crítica</p>
              </>
            )}
          </div>

          <button className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-yellow-500/20">
            <Save size={18} /> Finalizar e Assinar
          </button>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [userRole, setUserRole] = useState(null);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);

  if (!userRole) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">VERTICAL <span className="text-yellow-500">GROUP</span></h1>
            <p className="text-slate-500 mt-2">Sistema Integrado de Controle de Frequência (SICF-AD)</p>
          </div>
          
          <p className="text-sm font-bold text-slate-700 mb-4 text-center uppercase tracking-wide">Selecione seu Perfil de Acesso</p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => setUserRole('supervisor')} className="p-4 border border-slate-200 rounded-xl hover:bg-yellow-50 hover:border-yellow-500 hover:shadow-md transition-all text-left flex items-center gap-4 group">
              <div className="bg-yellow-100 p-3 rounded-full text-yellow-700 group-hover:bg-yellow-500 group-hover:text-white transition-colors"><HardHat size={24}/></div>
              <div>
                <p className="font-bold text-slate-800">Supervisor de Bordo</p>
                <p className="text-xs text-slate-500">Avalia Liderados e Coordenação</p>
              </div>
            </button>

            <button onClick={() => setUserRole('liderado')} className="p-4 border border-slate-200 rounded-xl hover:bg-blue-50 hover:border-blue-500 hover:shadow-md transition-all text-left flex items-center gap-4 group">
              <div className="bg-blue-100 p-3 rounded-full text-blue-700 group-hover:bg-blue-500 group-hover:text-white transition-colors"><User size={24}/></div>
              <div>
                <p className="font-bold text-slate-800">Liderado (Offshore)</p>
                <p className="text-xs text-slate-500">Avalia Supervisor de Bordo</p>
              </div>
            </button>

            <button onClick={() => setUserRole('coord_terra')} className="p-4 border border-slate-200 rounded-xl hover:bg-green-50 hover:border-green-500 hover:shadow-md transition-all text-left flex items-center gap-4 group">
              <div className="bg-green-100 p-3 rounded-full text-green-700 group-hover:bg-green-500 group-hover:text-white transition-colors"><Briefcase size={24}/></div>
              <div>
                <p className="font-bold text-slate-800">Coordenação de Terra</p>
                <p className="text-xs text-slate-500">Avalia Supervisor de Bordo</p>
              </div>
            </button>

            <button onClick={() => setUserRole('gestor_base')} className="p-4 border border-slate-200 rounded-xl hover:bg-slate-100 hover:border-slate-500 hover:shadow-md transition-all text-left flex items-center gap-4 group">
              <div className="bg-slate-200 p-3 rounded-full text-slate-700 group-hover:bg-slate-800 group-hover:text-white transition-colors"><Building2 size={24}/></div>
              <div>
                <p className="font-bold text-slate-800">Gestor de Base</p>
                <p className="text-xs text-slate-500">Avaliação Departamental (Etapa 2)</p>
              </div>
            </button>
          </div>
          <p className="text-center text-xs text-slate-400 mt-8">© 2025 Vertical Group Engineering. v3.1 Beta</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen font-sans flex text-slate-800">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} userRole={userRole} onLogout={() => { setUserRole(null); setSelectedEvaluation(null); }} />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 animate-in slide-in-from-left-4 duration-500">
              {activeTab === 'dashboard' ? 'Dashboard Gerencial' : 'Minhas Avaliações Pendentes'}
            </h1>
            <p className="text-slate-500 text-sm">Bem-vindo, {userRole.replace('_', ' ').toUpperCase()}</p>
          </div>
          <div className="flex items-center space-x-4">
             <span className="text-xs font-mono bg-white px-3 py-1 rounded border border-slate-200 text-slate-500">{new Date().toLocaleDateString('pt-BR')}</span>
             <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-slate-900 font-bold border-2 border-white shadow-sm">VG</div>
          </div>
        </header>

        {activeTab === 'dashboard' ? (
           <div className="bg-white p-10 rounded-xl text-center shadow-sm">
             <PieChart className="mx-auto text-slate-300 mb-4" size={48}/>
             <h3 className="text-lg font-bold text-slate-700">Dashboard em Construção</h3>
             <p className="text-slate-500">Esta visão será personalizada para o perfil {userRole}.</p>
           </div>
        ) : selectedEvaluation ? (
           <EvaluationForm target={selectedEvaluation} onBack={() => setSelectedEvaluation(null)} />
        ) : (
           <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300">
             <div className="p-6 border-b border-slate-100"><h3 className="font-bold text-slate-700">Selecione uma pendência para iniciar:</h3></div>
             <div className="divide-y divide-slate-100">
               {PENDING_EVALUATIONS[userRole]?.map((item) => (
                 <div key={item.id} className="p-4 hover:bg-slate-50 flex justify-between items-center group transition-colors cursor-pointer" onClick={() => setSelectedEvaluation(item)}>
                   <div className="flex items-center gap-4">
                     <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white 
                       ${item.type === 'liderado' ? 'bg-blue-500' : item.type === 'supervisor' ? 'bg-yellow-500' : 'bg-green-500'}`}>
                       {item.name.charAt(0)}
                     </div>
                     <div>
                       <p className="font-bold text-slate-800">{item.name}</p>
                       <p className="text-xs text-slate-500 uppercase tracking-wider">{item.type} • Avaliação {item.context === 'base_depts' ? 'Etapa 2' : 'Etapa 1'}</p>
                     </div>
                   </div>
                   <button className="text-sm font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                     Iniciar <ChevronRight size={16}/>
                   </button>
                 </div>
               ))}
               {!PENDING_EVALUATIONS[userRole] && <div className="p-8 text-center text-slate-400">Nenhuma pendência encontrada.</div>}
             </div>
           </div>
        )}
      </main>
    </div>
  );
}