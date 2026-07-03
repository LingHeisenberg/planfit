import { CalendarCheck2, Download, Dumbbell, TrendingUp, UserCog, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

const cards = [
  { key: 'total_clients', label: 'Clientes', icon: Users, tone: 'bg-blue-50 text-blue-600' },
  { key: 'total_coaches', label: 'Coaches', icon: UserCog, tone: 'bg-violet-50 text-violet-600' },
  { key: 'total_exercises', label: 'Exercícios', icon: Dumbbell, tone: 'bg-amber-50 text-amber-600' },
  { key: 'active_plans', label: 'Planos ativos', icon: CalendarCheck2, tone: 'bg-emerald-50 text-emerald-600' },
  { key: 'total_downloads', label: 'Downloads', icon: Download, tone: 'bg-rose-50 text-rose-600' },
];

export default function Dashboard() {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/stats').then(({ data }) => setStats(data)).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="mb-7">
        <p className="text-sm font-bold text-blue-600">PAINEL DE CONTROLO</p>
        <h1 className="page-title">A sua operação, num relance</h1>
        <p className="page-subtitle">Acompanhe a atividade e avance rapidamente para o próximo plano.</p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(({ key, label, icon: Icon, tone }) => (
          <article key={key} className="panel p-5">
            <div className={`mb-5 grid h-11 w-11 place-items-center rounded-xl ${tone}`}><Icon size={21} /></div>
            <p className="text-3xl font-extrabold text-slate-950">{loading ? '—' : stats[key] ?? 0}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.25fr_.75fr]">
        <article className="panel overflow-hidden p-7">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-7 text-white">
            <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full border-[35px] border-white/10" />
            <TrendingUp className="mb-8 text-blue-200" size={30} />
            <h2 className="max-w-md text-2xl font-extrabold">Transforme objetivos em semanas bem planeadas.</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-blue-100">Escolha o cliente, combine exercícios e entregue um plano completo em poucos minutos.</p>
            <Link to="/plans/new" className="mt-6 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-blue-700 shadow-lg">Criar novo plano</Link>
          </div>
        </article>
        <article className="panel p-7">
          <h2 className="text-lg font-extrabold text-slate-900">Atalhos</h2>
          <div className="mt-5 space-y-3">
            <Link to="/users" className="flex items-center gap-4 rounded-xl border p-4 font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/40">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-blue-600"><Users size={19} /></span>
              Gerir clientes
            </Link>
            <Link to="/exercises" className="flex items-center gap-4 rounded-xl border p-4 font-bold text-slate-700 hover:border-blue-200 hover:bg-blue-50/40">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-amber-50 text-amber-600"><Dumbbell size={19} /></span>
              Biblioteca de exercícios
            </Link>
          </div>
        </article>
      </section>
    </div>
  );
}
