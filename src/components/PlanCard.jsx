import { ArrowRight, CalendarDays, UserRound } from 'lucide-react';
import { Link } from 'react-router-dom';

const statusStyles = {
  active: 'bg-emerald-50 text-emerald-700',
  completed: 'bg-blue-50 text-blue-700',
  cancelled: 'bg-red-50 text-red-700',
};

const statusLabels = { active: 'Ativo', completed: 'Concluído', cancelled: 'Cancelado' };
const formatDate = (value) => value ? new Intl.DateTimeFormat('pt-PT').format(new Date(`${value}T00:00:00`)) : '—';

export default function PlanCard({ plan }) {
  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-blue-200">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600">
          <CalendarDays size={21} />
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyles[plan.status] || statusStyles.active}`}>
          {statusLabels[plan.status] || plan.status}
        </span>
      </div>
      <h3 className="mb-1 text-lg font-bold text-slate-900">{plan.title}</h3>
      <p className="mb-4 line-clamp-2 min-h-10 text-sm text-slate-500">{plan.objective || 'Plano semanal personalizado'}</p>
      <div className="space-y-2 border-t border-slate-100 pt-4 text-sm text-slate-500">
        {plan.client_name && (
          <p className="flex items-center gap-2"><UserRound size={15} /> {plan.client_name}</p>
        )}
        <p className="flex items-center gap-2"><CalendarDays size={15} /> {formatDate(plan.start_date)} — {formatDate(plan.end_date)}</p>
      </div>
      <Link to={`/plans/${plan.id}`} className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm font-bold text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white">
        Ver plano
        <ArrowRight size={17} />
      </Link>
    </article>
  );
}
