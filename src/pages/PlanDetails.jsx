import { ArrowLeft, CalendarDays, CheckCircle2, Clock3, Download, Dumbbell, PlayCircle, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const formatDate = (value) => value ? new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`)) : '—';

export default function PlanDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const backPath = user?.role === 'client' ? '/my-plans' : '/plans';
  const planRef = useRef(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    api.get(`/plans/${id}`)
      .then(({ data }) => setPlan(data))
      .catch((error) => Swal.fire('Plano indisponível', error.response?.data?.message || 'Não foi possível carregar o plano.', 'error'))
      .finally(() => setLoading(false));
  }, [id]);

  const downloadPdf = async () => {
    setDownloading(true);
    try {
      await api.post(`/plans/${id}/download`);
      const html2pdf = (await import('html2pdf.js')).default;
      await html2pdf()
        .set({
          margin: [8, 8, 8, 8],
          filename: `planfit-${plan.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2, useCORS: true, backgroundColor: '#ffffff' },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
          pagebreak: { mode: ['css', 'legacy'], avoid: ['.pdf-day'] },
        })
        .from(planRef.current)
        .save();
    } catch (error) {
      Swal.fire('PDF não gerado', error.response?.data?.message || 'Tente novamente dentro de instantes.', 'error');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) return <div className="grid min-h-[60vh] place-items-center"><div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" /></div>;
  if (!plan) return <div className="panel p-12 text-center"><h1 className="text-xl font-bold">Plano não encontrado</h1><Link to={backPath} className="btn-primary mt-5">Voltar</Link></div>;

  return (
    <div>
      <header className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link to={backPath} className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"><ArrowLeft size={16} /> Voltar aos planos</Link>
          <h1 className="page-title">Detalhes do plano</h1>
          <p className="page-subtitle">Revise a semana completa ou entregue-a em PDF.</p>
        </div>
        <button onClick={downloadPdf} disabled={downloading} className="btn-success"><Download size={18} /> {downloading ? 'A preparar PDF…' : 'Baixar PDF'}</button>
      </header>

      <div ref={planRef} className="rounded-3xl bg-white p-5 sm:p-8">
        <section className="relative overflow-hidden rounded-2xl bg-ink p-6 text-white sm:p-8">
          <div className="absolute -right-10 -top-20 h-60 w-60 rounded-full bg-blue-500/20" />
          <div className="relative flex flex-col justify-between gap-7 sm:flex-row sm:items-end">
            <div>
              <div className="mb-5 flex items-center gap-2 text-sm font-bold text-blue-300"><Dumbbell size={18} /> PLANFIT · PLANO SEMANAL</div>
              <h2 className="max-w-2xl text-3xl font-extrabold tracking-tight">{plan.title}</h2>
              <p className="mt-2 max-w-2xl text-slate-300">{plan.objective || 'Plano de treino personalizado'}</p>
            </div>
            <span className="w-fit rounded-full bg-emerald-400/15 px-4 py-2 text-sm font-bold text-emerald-300"><CheckCircle2 className="mr-1.5 inline" size={16} /> {plan.status === 'active' ? 'Plano ativo' : plan.status}</span>
          </div>
        </section>

        <section className="grid gap-3 border-b py-6 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"><span className="grid h-10 w-10 place-items-center rounded-lg bg-blue-100 text-blue-600"><UserRound size={18} /></span><div><p className="text-xs font-bold uppercase text-slate-400">Cliente</p><p className="font-bold text-slate-800">{plan.client_name}</p></div></div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"><span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-100 text-violet-600"><Dumbbell size={18} /></span><div><p className="text-xs font-bold uppercase text-slate-400">Coach</p><p className="font-bold text-slate-800">{plan.coach_name}</p></div></div>
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"><span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-100 text-emerald-600"><CalendarDays size={18} /></span><div><p className="text-xs font-bold uppercase text-slate-400">Período</p><p className="text-sm font-bold text-slate-800">{formatDate(plan.start_date)} — {formatDate(plan.end_date)}</p></div></div>
        </section>

        {plan.notes && <aside className="my-6 rounded-xl border-l-4 border-blue-500 bg-blue-50 p-4 text-sm text-blue-950"><strong>Orientações gerais:</strong> {plan.notes}</aside>}

        <section className="space-y-5">
          {plan.days.map((day, index) => (
            <article key={day.id} className="pdf-day overflow-hidden rounded-2xl border border-slate-200">
              <header className="flex flex-col justify-between gap-2 bg-slate-50 px-5 py-4 sm:flex-row sm:items-center">
                <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-sm font-extrabold text-white">{index + 1}</span><div><h3 className="font-extrabold text-slate-900">{day.day_name}</h3><p className="text-xs text-slate-500">{day.focus || 'Treino programado'}</p></div></div>
                {day.notes && <p className="max-w-md text-xs italic text-slate-500">{day.notes}</p>}
              </header>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px] text-left text-sm">
                  <thead><tr className="text-xs uppercase tracking-wider text-slate-400"><th className="px-5 py-3">Exercício</th><th className="px-3 py-3">Séries</th><th className="px-3 py-3">Reps</th><th className="px-3 py-3">Descanso</th><th className="px-3 py-3">Duração</th><th className="px-5 py-3">Notas</th></tr></thead>
                  <tbody>{day.exercises.map((item) => (
                    <tr key={item.id} className="border-t">
                      <td className="px-5 py-4"><p className="font-bold text-slate-800">{item.exercise_name}</p><p className="text-xs text-slate-400">{item.muscle_group}</p></td>
                      <td className="px-3 py-4 font-semibold">{item.sets || '—'}</td>
                      <td className="px-3 py-4 font-semibold">{item.reps || '—'}</td>
                      <td className="px-3 py-4"><span className="inline-flex items-center gap-1"><Clock3 size={14} /> {item.rest_time || '—'}</span></td>
                      <td className="px-3 py-4">{item.duration || '—'}</td>
                      <td className="px-5 py-4 text-xs text-slate-500">{item.notes || '—'}{item.video_url && <a href={item.video_url} target="_blank" rel="noreferrer" className="ml-2 inline-flex items-center gap-1 font-bold text-blue-600"><PlayCircle size={13} /> Vídeo</a>}</td>
                    </tr>
                  ))}</tbody>
                </table>
                {!day.exercises.length && <p className="p-5 text-sm text-slate-500">Sem exercícios neste dia.</p>}
              </div>
            </article>
          ))}
        </section>
        <footer className="mt-7 border-t pt-5 text-center text-xs text-slate-400">PlanFit · Consistência transforma objetivos em resultados</footer>
      </div>
    </div>
  );
}
