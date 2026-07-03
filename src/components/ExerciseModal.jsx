import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

const initial = { name: '', category: '', muscle_group: '', description: '', video_url: '' };

export default function ExerciseModal({ exercise, open, onClose, onSave, saving }) {
  const [form, setForm] = useState(initial);

  useEffect(() => {
    setForm(exercise ? { ...initial, ...exercise } : initial);
  }, [exercise, open]);

  if (!open) return null;
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm">
      <form onSubmit={(event) => { event.preventDefault(); onSave(form); }} className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Biblioteca</p>
            <h2 className="text-xl font-extrabold text-slate-900">{exercise ? 'Editar exercício' : 'Novo exercício'}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100" aria-label="Fechar"><X /></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field sm:col-span-2">Nome<input name="name" value={form.name} onChange={change} required /></label>
          <label className="field">Categoria<input name="category" value={form.category} onChange={change} required placeholder="Ex.: Força" /></label>
          <label className="field">Grupo muscular<input name="muscle_group" value={form.muscle_group} onChange={change} required /></label>
          <label className="field sm:col-span-2">Descrição<textarea name="description" value={form.description || ''} onChange={change} rows="3" /></label>
          <label className="field sm:col-span-2">URL do vídeo<input name="video_url" type="url" value={form.video_url || ''} onChange={change} placeholder="https://..." /></label>
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button disabled={saving} className="btn-primary">{saving ? 'A guardar…' : 'Guardar exercício'}</button>
        </div>
      </form>
    </div>
  );
}
