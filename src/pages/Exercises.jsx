import { Dumbbell, ExternalLink, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../api/axios';
import ExerciseModal from '../components/ExerciseModal';

export default function Exercises() {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ open: false, exercise: null });
  const [saving, setSaving] = useState(false);

  const load = () => api.get('/exercises').then(({ data }) => setExercises(data));
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return exercises.filter((item) => [item.name, item.category, item.muscle_group].some((value) => value?.toLowerCase().includes(term)));
  }, [exercises, search]);

  const save = async (form) => {
    setSaving(true);
    try {
      if (modal.exercise) await api.put(`/exercises/${modal.exercise.id}`, form);
      else await api.post('/exercises', form);
      setModal({ open: false, exercise: null });
      await load();
      Swal.fire({ icon: 'success', title: 'Exercício guardado', timer: 1400, showConfirmButton: false });
    } catch (error) {
      Swal.fire('Não foi possível guardar', error.response?.data?.message || 'Tente novamente.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (exercise) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: `Apagar “${exercise.name}”?`,
      text: 'Esta ação não pode ser anulada.',
      showCancelButton: true,
      confirmButtonText: 'Sim, apagar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/exercises/${exercise.id}`);
      setExercises((items) => items.filter((item) => item.id !== exercise.id));
    } catch (error) {
      Swal.fire('Não foi possível apagar', error.response?.data?.message || 'Tente novamente.', 'error');
    }
  };

  return (
    <div>
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-bold text-blue-600">CONTEÚDO</p>
          <h1 className="page-title">Biblioteca de exercícios</h1>
          <p className="page-subtitle">{exercises.length} exercícios disponíveis para os seus planos.</p>
        </div>
        <button onClick={() => setModal({ open: true, exercise: null })} className="btn-primary"><Plus size={18} /> Novo exercício</button>
      </header>

      <section className="panel overflow-hidden">
        <div className="flex flex-col justify-between gap-3 border-b p-4 sm:flex-row sm:items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50" placeholder="Pesquisar por nome, categoria ou músculo…" />
          </div>
          <p className="text-sm text-slate-500">{filtered.length} resultado(s)</p>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Exercício</th><th>Categoria</th><th>Grupo muscular</th><th>Vídeo</th><th className="text-right">Ações</th></tr></thead>
            <tbody>
              {filtered.map((exercise) => (
                <tr key={exercise.id}>
                  <td><div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-lg bg-blue-50 text-blue-600"><Dumbbell size={17} /></span><span className="font-bold text-slate-800">{exercise.name}</span></div></td>
                  <td><span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold">{exercise.category}</span></td>
                  <td>{exercise.muscle_group}</td>
                  <td>{exercise.video_url ? <a href={exercise.video_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-bold text-blue-600">Abrir <ExternalLink size={14} /></a> : '—'}</td>
                  <td><div className="flex justify-end gap-2"><button onClick={() => setModal({ open: true, exercise })} className="rounded-lg border p-2 text-slate-500 hover:text-blue-600" aria-label="Editar"><Pencil size={16} /></button><button onClick={() => remove(exercise)} className="rounded-lg border p-2 text-slate-500 hover:border-red-200 hover:text-red-600" aria-label="Apagar"><Trash2 size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <div className="p-12 text-center text-slate-500">Nenhum exercício encontrado.</div>}
        </div>
      </section>
      <ExerciseModal {...modal} onClose={() => setModal({ open: false, exercise: null })} onSave={save} saving={saving} />
    </div>
  );
}
