import { ArrowLeft, CalendarPlus, ChevronDown, Dumbbell, Plus, Save, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../api/axios';

const dayNames = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'];
const newId = () => globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`;
const makeItem = () => ({ _id: newId(), exercise_id: '', sets: '', reps: '', rest_time: '', duration: '', notes: '' });
const makeDay = (day_name = '') => ({ _id: newId(), day_name, focus: '', notes: '', exercises: [makeItem()] });

const dateValue = (date) => date.toISOString().slice(0, 10);

export default function CreatePlan() {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [saving, setSaving] = useState(false);
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 6);
  const [form, setForm] = useState({
    user_id: '',
    title: '',
    objective: '',
    start_date: dateValue(today),
    end_date: dateValue(nextWeek),
    notes: '',
    status: 'active',
    days: [makeDay('Segunda-feira')],
  });

  useEffect(() => {
    Promise.all([api.get('/users/clients/list'), api.get('/exercises')])
      .then(([clientsResponse, exercisesResponse]) => {
        setClients(clientsResponse.data);
        setExercises(exercisesResponse.data);
      });
  }, []);

  const updateDay = (dayId, field, value) => {
    setForm((current) => ({
      ...current,
      days: current.days.map((day) => day._id === dayId ? { ...day, [field]: value } : day),
    }));
  };

  const updateExercise = (dayId, itemId, field, value) => {
    setForm((current) => ({
      ...current,
      days: current.days.map((day) => day._id === dayId
        ? { ...day, exercises: day.exercises.map((item) => item._id === itemId ? { ...item, [field]: value } : item) }
        : day),
    }));
  };

  const addExercise = (dayId) => {
    setForm((current) => ({
      ...current,
      days: current.days.map((day) => day._id === dayId ? { ...day, exercises: [...day.exercises, makeItem()] } : day),
    }));
  };

  const removeExercise = (dayId, itemId) => {
    setForm((current) => ({
      ...current,
      days: current.days.map((day) => day._id === dayId ? { ...day, exercises: day.exercises.filter((item) => item._id !== itemId) } : day),
    }));
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.days.length) {
      Swal.fire('Adicione um dia', 'O plano precisa de pelo menos um dia de treino.', 'warning');
      return;
    }
    if (form.days.some((day) => !day.day_name || !day.exercises.length || day.exercises.some((item) => !item.exercise_id))) {
      Swal.fire('Plano incompleto', 'Escolha o dia e todos os exercícios antes de guardar.', 'warning');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        days: form.days.map(({ _id, exercises: items, ...day }) => ({
          ...day,
          exercises: items.map(({ _id: itemId, ...item }, index) => ({ ...item, order_number: index + 1 })),
        })),
      };
      const { data } = await api.post('/plans', payload);
      await Swal.fire({ icon: 'success', title: 'Plano criado', text: 'O plano semanal está pronto para o cliente.', confirmButtonColor: '#2563eb' });
      navigate(`/plans/${data.id}`);
    } catch (error) {
      Swal.fire('Não foi possível criar o plano', error.response?.data?.message || 'Reveja os dados e tente novamente.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link to="/plans" className="mb-3 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600"><ArrowLeft size={16} /> Voltar aos planos</Link>
          <h1 className="page-title">Criar plano semanal</h1>
          <p className="page-subtitle">Estruture a semana do cliente, exercício a exercício.</p>
        </div>
        <button disabled={saving} className="btn-success"><Save size={18} /> {saving ? 'A guardar…' : 'Guardar plano'}</button>
      </header>

      <section className="panel p-5 sm:p-7">
        <div className="mb-6 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><CalendarPlus size={20} /></span><div><h2 className="font-extrabold text-slate-900">Informação geral</h2><p className="text-xs text-slate-500">Cliente, objetivo e período do programa</p></div></div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <label className="field xl:col-span-2">Cliente<select value={form.user_id} onChange={(e) => setForm({ ...form, user_id: e.target.value })} required><option value="">Selecionar cliente…</option>{clients.map((client) => <option key={client.id} value={client.id}>{client.name} — {client.objective || 'sem objetivo'}</option>)}</select></label>
          <label className="field">Data inicial<input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })} required /></label>
          <label className="field">Data final<input type="date" min={form.start_date} value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} required /></label>
          <label className="field xl:col-span-2">Título<input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required placeholder="Ex.: Semana de força e mobilidade" /></label>
          <label className="field xl:col-span-2">Objetivo<input value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })} placeholder="Resultado principal desta semana" /></label>
          <label className="field md:col-span-2 xl:col-span-4">Observações gerais<textarea rows="3" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Orientações sobre carga, técnica, recuperação…" /></label>
        </div>
      </section>

      <div className="my-6 flex items-center justify-between">
        <div><h2 className="text-xl font-extrabold text-slate-900">Dias de treino</h2><p className="text-sm text-slate-500">{form.days.length} dia(s) configurado(s)</p></div>
        <button type="button" onClick={() => setForm({ ...form, days: [...form.days, makeDay()] })} className="btn-secondary"><Plus size={17} /> Adicionar dia</button>
      </div>

      <div className="space-y-5">
        {form.days.map((day, dayIndex) => (
          <section key={day._id} className="panel overflow-hidden">
            <div className="flex flex-col gap-4 border-b bg-slate-50/70 p-5 md:flex-row md:items-end">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-sm font-extrabold text-white">{dayIndex + 1}</span>
              <label className="field min-w-52 flex-1">Dia da semana<select value={day.day_name} onChange={(e) => updateDay(day._id, 'day_name', e.target.value)} required><option value="">Escolher dia…</option>{dayNames.map((name) => <option key={name}>{name}</option>)}</select></label>
              <label className="field flex-[2]">Foco do treino<input value={day.focus} onChange={(e) => updateDay(day._id, 'focus', e.target.value)} placeholder="Ex.: Pernas e glúteos" /></label>
              <button type="button" onClick={() => setForm({ ...form, days: form.days.filter((item) => item._id !== day._id) })} className="btn-danger mb-0.5"><Trash2 size={16} /> Remover dia</button>
            </div>

            <div className="p-4 sm:p-5">
              <div className="space-y-3">
                {day.exercises.map((item, itemIndex) => (
                  <div key={item._id} className="rounded-2xl border bg-white p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="flex items-center gap-2 text-sm font-extrabold text-slate-700"><Dumbbell size={16} className="text-blue-600" /> Exercício {itemIndex + 1}</p>
                      <button type="button" onClick={() => removeExercise(day._id, item._id)} className="rounded-lg p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Remover exercício"><Trash2 size={16} /></button>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
                      <label className="field sm:col-span-2 lg:col-span-2">Exercício<span className="relative"><select className="appearance-none pr-9" value={item.exercise_id} onChange={(e) => updateExercise(day._id, item._id, 'exercise_id', e.target.value)} required><option value="">Selecionar…</option>{exercises.map((exercise) => <option key={exercise.id} value={exercise.id}>{exercise.name} · {exercise.muscle_group}</option>)}</select><ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} /></span></label>
                      <label className="field">Séries<input type="number" min="1" value={item.sets} onChange={(e) => updateExercise(day._id, item._id, 'sets', e.target.value)} placeholder="3" /></label>
                      <label className="field">Repetições<input value={item.reps} onChange={(e) => updateExercise(day._id, item._id, 'reps', e.target.value)} placeholder="10-12" /></label>
                      <label className="field">Descanso<input value={item.rest_time} onChange={(e) => updateExercise(day._id, item._id, 'rest_time', e.target.value)} placeholder="60 s" /></label>
                      <label className="field">Duração<input value={item.duration} onChange={(e) => updateExercise(day._id, item._id, 'duration', e.target.value)} placeholder="5 min" /></label>
                      <label className="field sm:col-span-2 lg:col-span-6">Observações<input value={item.notes} onChange={(e) => updateExercise(day._id, item._id, 'notes', e.target.value)} placeholder="Carga, ritmo ou alternativa…" /></label>
                    </div>
                  </div>
                ))}
              </div>
              <button type="button" onClick={() => addExercise(day._id)} className="mt-4 inline-flex items-center gap-2 rounded-xl border border-dashed border-blue-300 px-4 py-2.5 text-sm font-bold text-blue-600 hover:bg-blue-50"><Plus size={17} /> Adicionar exercício</button>
              <label className="field mt-4">Notas do dia<textarea rows="2" value={day.notes} onChange={(e) => updateDay(day._id, 'notes', e.target.value)} placeholder="Aquecimento, alongamentos ou recomendações…" /></label>
            </div>
          </section>
        ))}
      </div>

      <div className="mt-7 flex justify-end gap-3">
        <Link to="/plans" className="btn-secondary">Cancelar</Link>
        <button disabled={saving} className="btn-success"><Save size={18} /> {saving ? 'A guardar…' : 'Guardar plano completo'}</button>
      </div>
    </form>
  );
}
