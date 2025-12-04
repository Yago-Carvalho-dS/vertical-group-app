import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  LogOut, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Calculator,
  HardHat,
  Anchor,
  Building2,
  ChevronRight,
  Save
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';

// --- TIPOS E DADOS MOCKADOS ---

const MOCK_EMPLOYEES = [
  { id: '1', name: 'João Silva', role: 'Soldador N1', matricula: '8820', status: 'concluido', conformidade: 'Regular', notaFinal: 84 },
  { id: '2', name: 'Maria Costa', role: 'Eng. Segurança', matricula: '9910', status: 'pendente', conformidade: undefined },
  { id: '3', name: 'Pedro Santos', role: 'Eletricista', matricula: '4421', status: 'em_analise', conformidade: 'Satisfatória', notaFinal: 99 },
  { id: '4', name: 'Carlos Oliveira', role: 'Pintor Ind.', matricula: '3320', status: 'concluido', conformidade: 'Insuficiente', notaFinal: 65 },
];

const DATA_DASHBOARD = [
  { name: 'Satisfatória', value: 65, color: '#22c55e' },
  { name: 'Regular', value: 25, color: '#eab308' },
  { name: 'Insuficiente', value: 8, color: '#f97316' },
  { name: 'Crítica', value: 2, color: '#ef4444' },
];

// --- COMPONENTES AUXILIARES ---

const Sidebar = ({ activeTab, setActiveTab, userRole, onLogout }) => (
  <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col fixed left-0 top-0 z-50 transition-all">
    <div className="p-6 border-b border-slate-700">
      <h1 className="text-xl font-bold tracking-wider text-yellow-500">VERTICAL</h1>
      <span className="text-xs text-slate-400 tracking-widest uppercase">Group System</span>
    </div>
    
    <nav className="flex-1 p-4 space-y-2">
      <button 
        onClick={() => setActiveTab('dashboard')}
        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'dashboard' ? 'bg-yellow-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
      >
        <LayoutDashboard size={20} />
        <span>Visão Geral</span>
      </button>

      <button 
        onClick={() => setActiveTab('evaluations')}
        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'evaluations' ? 'bg-yellow-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
      >
        <Users size={20} />
        <span>Avaliações</span>
      </button>

      <button 
        onClick={() => setActiveTab('reports')}
        className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${activeTab === 'reports' ? 'bg-yellow-500 text-slate-900 font-bold' : 'hover:bg-slate-800 text-slate-300'}`}
      >
        <FileText size={20} />
        <span>Relatórios</span>
      </button>
    </nav>

    <div className="p-4 border-t border-slate-700">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold">
          {userRole === 'admin' ? 'AD' : 'GS'}
        </div>
        <div>
          <p className="text-sm font-medium">Usuário Logado</p>
          <p className="text-xs text-slate-400 capitalize">{userRole === 'admin' ? 'Administrador' : 'Gestor Base'}</p>
        </div>
      </div>
      <button onClick={onLogout} className="flex items-center space-x-2 text-red-400 hover:text-red-300 text-sm w-full">
        <LogOut size={16} />
        <span>Sair do Sistema</span>
      </button>
    </div>
  </div>
);

const EvaluationScreen = () => {
  const [scores, setScores] = useState({});
  const [totalScore, setTotalScore] = useState(0);

  const criteriaBase = [
    { id: 'sms_epi', label: 'SMS - Cuidados com EPI', peso: 0.20 },
    { id: 'sms_stop', label: 'SMS - Cartões Stop Card', peso: 0.10 },
    { id: 'treinamento', label: 'Treinamento - Prazos', peso: 0.15 },
    { id: 'saude', label: 'Saúde (ASO) - Prazos', peso: 0.15 },
    { id: 'suprimentos', label: 'Suprimentos - Materiais', peso: 0.15 },
    { id: 'ti', label: 'TI - Equipamentos', peso: 0.15 },
    { id: 'frentes', label: 'Frentes Ops - Documentos', peso: 0.10 },
  ];

  const handleScore = (id, value) => {
    setScores(prev => ({ ...prev, [id]: value }));
  };

  useEffect(() => {
    let acc = 0;
    criteriaBase.forEach(c => {
      const score = scores[c.id] || 0;
      acc += score * c.peso;
    });
    setTotalScore(Math.round(acc * 100) / 100);
  }, [scores]);

  const getConformity = (score) => {
    if (score >= 98) return { label: 'Satisfatória', color: 'text-green-600 bg-green-100', icon: <CheckCircle2 size={20} /> };
    if (score >= 75) return { label: 'Regular', color: 'text-yellow-600 bg-yellow-100', icon: <AlertTriangle size={20} /> };
    if (score >= 50) return { label: 'Insuficiente', color: 'text-orange-600 bg-orange-100', icon: <XCircle size={20} /> };
    return { label: 'Crítica', color: 'text-red-600 bg-red-100', icon: <XCircle size={20} /> };
  };

  const status = getConformity(totalScore);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-in fade-in zoom-in duration-300">
      <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Avaliação de Base (Etapa 2)</h2>
          <p className="text-sm text-slate-500">Colaborador: João Silva (Matrícula: 8820)</p>
        </div>
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 font-bold ${status.color}`}>
          {status.icon}
          {totalScore > 0 ? `${totalScore}% - ${status.label}` : 'Aguardando Início'}
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          {criteriaBase.map((crit) => (
            <div key={crit.id} className="bg-white p-4 rounded-lg border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="flex justify-between mb-2">
                <label className="font-medium text-slate-700 text-sm">{crit.label}</label>
                <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500 font-mono">Peso: {(crit.peso * 100).toFixed(0)}%</span>
              </div>
              <div className="flex gap-2">
                {[
                  { l: 'Excelente', v: 100, c: 'hover:bg-green-100 hover:text-green-700' },
                  { l: 'Bom', v: 85, c: 'hover:bg-blue-100 hover:text-blue-700' },
                  { l: 'Regular', v: 60, c: 'hover:bg-yellow-100 hover:text-yellow-700' },
                  { l: 'Ruim', v: 30, c: 'hover:bg-red-100 hover:text-red-700' }
                ].map((opt) => (
                  <button
                    key={opt.l}
                    onClick={() => handleScore(crit.id, opt.v)}
                    className={`flex-1 py-1.5 text-xs font-medium rounded border transition-all ${scores[crit.id] === opt.v ? 'bg-slate-800 text-white border-slate-800 shadow-lg' : `bg-white text-slate-600 border-slate-200 ${opt.c}`}`}
                  >
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-50 p-6 rounded-xl h-fit sticky top-6 border border-slate-200">
          <h3 className="text-sm font-bold uppercase text-slate-400 mb-4 flex items-center gap-2">
            <Calculator size={16}/> Simulação de Nota
          </h3>
          <div className="space-y-2 text-sm">
            {criteriaBase.map(crit => (
              <div key={crit.id} className="flex justify-between border-b border-slate-200 pb-1 border-dashed">
                <span className="text-slate-500 truncate w-40">{crit.label}</span>
                <span className="font-mono">
                  {scores[crit.id] ? (scores[crit.id] * crit.peso).toFixed(2) : '0.00'}%
                </span>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-slate-300">
            <div className="flex justify-between items-end">
              <span className="font-bold text-slate-700">Nota Final Calculada</span>
              <span className="text-3xl font-black text-slate-900">{totalScore}%</span>
            </div>
            <button className="w-full mt-6 bg-yellow-500 hover:bg-yellow-600 text-slate-900 font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-yellow-500/20 active:scale-95 transform">
              <Save size={18} />
              Finalizar Avaliação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => (
  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Total Colaboradores</p>
            <p className="text-2xl font-bold text-slate-800">1,240</p>
          </div>
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600"><Users size={24} /></div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Embarcados Hoje</p>
            <p className="text-2xl font-bold text-slate-800">85</p>
          </div>
          <div className="p-2 bg-yellow-50 rounded-lg text-yellow-600"><Anchor size={24} /></div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Avaliações Pendentes</p>
            <p className="text-2xl font-bold text-slate-800">12</p>
          </div>
          <div className="p-2 bg-orange-50 rounded-lg text-orange-600"><FileText size={24} /></div>
        </div>
      </div>
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 uppercase font-bold">Índice Conformidade</p>
            <p className="text-2xl font-bold text-green-600">92.4%</p>
          </div>
          <div className="p-2 bg-green-50 rounded-lg text-green-600"><CheckCircle2 size={24} /></div>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h3 className="font-bold text-slate-800 mb-4">Lista de Pendências de Base</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 font-medium">
              <tr>
                <th className="p-3 rounded-l-lg">Colaborador</th>
                <th className="p-3">Matrícula</th>
                <th className="p-3">Status</th>
                <th className="p-3 rounded-r-lg">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_EMPLOYEES.map(emp => (
                <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-medium text-slate-700">{emp.name}</td>
                  <td className="p-3 text-slate-500">{emp.matricula}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold 
                      ${emp.status === 'concluido' ? 'bg-green-100 text-green-700' : 
                      emp.status === 'pendente' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                      {emp.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="p-3">
                    <button className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center group">
                      Avaliar <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col">
        <h3 className="font-bold text-slate-800 mb-4">Conformidade (Últimos 30 dias)</h3>
        <div className="flex-1 min-h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={DATA_DASHBOARD}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {DATA_DASHBOARD.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36}/>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </div>
);

// --- APP PRINCIPAL ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userRole, setUserRole] = useState('admin');

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-800">VERTICAL <span className="text-yellow-500">GROUP</span></h1>
            <p className="text-slate-500 mt-2">Sistema Integrado de Controle de Frequência</p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Selecione seu Perfil (Simulação)</label>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setUserRole('supervisor_bordo')} className="p-3 border rounded-lg hover:bg-yellow-50 hover:border-yellow-500 transition-all text-sm flex flex-col items-center gap-2 text-slate-600 focus:ring-2 focus:ring-yellow-500 focus:outline-none">
                  <HardHat size={24} className="text-yellow-600"/>
                  Supervisor Bordo
                </button>
                <button onClick={() => setUserRole('gestor_base')} className="p-3 border rounded-lg hover:bg-blue-50 hover:border-blue-500 transition-all text-sm flex flex-col items-center gap-2 text-slate-600 focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <Building2 size={24} className="text-blue-600"/>
                  Gestor de Base
                </button>
              </div>
            </div>

            <button 
              onClick={() => setIsLoggedIn(true)}
              className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition-colors mt-6 shadow-lg"
            >
              Acessar Sistema
            </button>
          </div>
          
          <p className="text-center text-xs text-slate-400 mt-8">
            © 2025 Vertical Group Engineering. Acesso Restrito.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-100 min-h-screen font-sans flex text-slate-800">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        userRole={userRole}
        onLogout={() => setIsLoggedIn(false)}
      />
      
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 animate-in slide-in-from-left-4 duration-500">
              {activeTab === 'dashboard' ? 'Visão Geral' : 
               activeTab === 'evaluations' ? 'Central de Avaliações' : 'Relatórios e Auditoria'}
            </h1>
            <p className="text-slate-500 text-sm">Bem-vindo ao portal SICF-AD v2.0</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-xs font-mono bg-white px-3 py-1 rounded border border-slate-200 text-slate-500">
              {new Date().toLocaleDateString('pt-BR')}
            </span>
            <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center text-slate-900 font-bold border-2 border-white shadow-sm">
              VG
            </div>
          </div>
        </header>

        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'evaluations' && (
          (userRole === 'gestor_base' || userRole === 'admin')
          ? <EvaluationScreen /> 
          : <div className="text-center py-20 bg-white rounded-xl shadow-sm"><p className="text-slate-500">Visão de Supervisor de Bordo (Módulo Offshore em desenvolvimento)</p></div>
        )}
        {activeTab === 'reports' && (
          <div className="flex flex-col items-center justify-center h-96 bg-white rounded-xl border border-slate-200 border-dashed">
            <FileText size={48} className="text-slate-300 mb-4"/>
            <p className="text-slate-500">Módulo de Exportação de PDF em construção</p>
            <button className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium">
              Baixar Modelo Timbrado (.pdf)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}