import { LayoutGrid, List, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axios';
import PlanCard from '../components/PlanCard';

export default function Plans() {
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');
  const navigate = useNavigate();
  useEffect(() => { api.get('/plans').then(({ data }) => setPlans(data)); }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return plans.filter((plan) => [plan.title, plan.client_name, plan.objective].some((value) => value?.toLowerCase().includes(term)));
  }, [plans, search]);

  const remove = async (plan) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Apagar este plano?',
      text: `${plan.title} será removido definitivamente.`,
      showCancelButton: true,
      confirmButtonText: 'Apagar plano',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/plans/${plan.id}`);
      setPlans((items) => items.filter((item) => item.id !== plan.id));
    } catch (error) {
      Swal.fire('Não foi possível apagar', error.response?.data?.message || 'Tente novamente.', 'error');
    }
  };

  return (
    <div>
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-bold text-blue-600">PLANEAMENTO</p><h1 className="page-title">Planos semanais</h1><p className="page-subtitle">Crie, consulte e acompanhe todos os programas ativos.</p></div>
        <Link to="/plans/new" className="btn-primary"><Plus size={18} /> Criar plano</Link>
      </header>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border bg-white py-2.5 pl-10 pr-4 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50" placeholder="Pesquisar planos ou clientes…" />
        </div>
        <div className="flex rounded-xl border bg-white p-1">
          <button onClick={() => setView('grid')} className={`rounded-lg p-2 ${view === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}><LayoutGrid size={18} /></button>
          <button onClick={() => setView('list')} className={`rounded-lg p-2 ${view === 'list' ? 'bg-blue-50 text-blue-600' : 'text-slate-400'}`}><List size={18} /></button>
        </div>
      </div>

      {view === 'grid' ? (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((plan) => <div key={plan.id} className="relative"><PlanCard plan={plan} /><button onClick={() => remove(plan)} className="absolute bottom-5 right-16 rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Apagar"><Trash2 size={16} /></button></div>)}
        </section>
      ) : (
        <section className="panel table-wrap">
          <table className="data-table"><thead><tr><th>Plano</th><th>Cliente</th><th>Período</th><th>Estado</th><th></th></tr></thead>
            <tbody>{filtered.map((plan) => <tr key={plan.id} className="cursor-pointer" onClick={() => navigate(`/plans/${plan.id}`)}><td className="font-bold text-slate-800">{plan.title}</td><td>{plan.client_name}</td><td>{plan.start_date} — {plan.end_date}</td><td><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{plan.status}</span></td><td><button onClick={(e) => { e.stopPropagation(); remove(plan); }} className="btn-danger"><Trash2 size={15} /></button></td></tr>)}</tbody>
          </table>
        </section>
      )}
      {!filtered.length && <div className="panel p-14 text-center text-slate-500">Nenhum plano encontrado. Comece por criar o primeiro.</div>}
    </div>
  );
}
