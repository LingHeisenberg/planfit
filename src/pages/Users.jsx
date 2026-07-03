import { Pencil, Plus, Search, Trash2, UserRound, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import Swal from 'sweetalert2';
import api from '../api/axios';

const initial = { name: '', email: '', password: '', phone: '', gender: '', age: '', objective: '' };

function UserModal({ open, user, onClose, onSaved }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(user ? { ...initial, ...user, password: '' } : initial);
  }, [user, open]);
  if (!open) return null;

  const submit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, role: 'client' };
      if (user && !payload.password) delete payload.password;
      if (user) await api.put(`/users/${user.id}`, payload);
      else await api.post('/users', payload);
      onSaved();
      onClose();
      Swal.fire({ icon: 'success', title: 'Cliente guardado', timer: 1400, showConfirmButton: false });
    } catch (error) {
      Swal.fire('Não foi possível guardar', error.response?.data?.message || 'Verifique os dados.', 'error');
    } finally {
      setSaving(false);
    }
  };
  const change = (event) => setForm({ ...form, [event.target.name]: event.target.value });

  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-slate-950/40 p-4 backdrop-blur-sm">
      <form onSubmit={submit} className="my-4 w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
        <div className="mb-6 flex items-center justify-between">
          <div><p className="text-xs font-bold uppercase tracking-widest text-blue-600">Clientes</p><h2 className="text-xl font-extrabold">{user ? 'Editar cliente' : 'Novo cliente'}</h2></div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X /></button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="field sm:col-span-2">Nome completo<input name="name" value={form.name} onChange={change} required /></label>
          <label className="field">Email<input type="email" name="email" value={form.email} onChange={change} required /></label>
          <label className="field">{user ? 'Nova senha (opcional)' : 'Senha'}<input type="password" name="password" value={form.password} onChange={change} required={!user} minLength="6" /></label>
          <label className="field">Telefone<input name="phone" value={form.phone || ''} onChange={change} /></label>
          <label className="field">Género<select name="gender" value={form.gender || ''} onChange={change}><option value="">Não especificado</option><option>Feminino</option><option>Masculino</option><option>Outro</option></select></label>
          <label className="field">Idade<input type="number" min="12" max="120" name="age" value={form.age || ''} onChange={change} /></label>
          <label className="field sm:col-span-2">Objetivo<textarea name="objective" value={form.objective || ''} onChange={change} rows="3" placeholder="Ex.: melhorar força e condição física" /></label>
        </div>
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button disabled={saving} className="btn-primary">{saving ? 'A guardar…' : 'Guardar cliente'}</button>
        </div>
      </form>
    </div>
  );
}

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [modal, setModal] = useState({ open: false, user: null });
  const load = () => api.get('/users/clients/list').then(({ data }) => setUsers(data));
  useEffect(() => { load(); }, []);

  const filtered = useMemo(() => {
    const term = search.toLowerCase();
    return users.filter((user) => [user.name, user.email, user.objective].some((value) => value?.toLowerCase().includes(term)));
  }, [users, search]);

  const remove = async (user) => {
    const result = await Swal.fire({
      icon: 'warning',
      title: `Remover ${user.name}?`,
      text: 'Os planos associados também serão removidos.',
      showCancelButton: true,
      confirmButtonText: 'Remover cliente',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/users/${user.id}`);
      setUsers((items) => items.filter((item) => item.id !== user.id));
    } catch (error) {
      Swal.fire('Não foi possível remover', error.response?.data?.message || 'Tente novamente.', 'error');
    }
  };

  return (
    <div>
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div><p className="text-sm font-bold text-blue-600">PESSOAS</p><h1 className="page-title">Clientes</h1><p className="page-subtitle">Perfis, objetivos e dados de contacto num só lugar.</p></div>
        <button onClick={() => setModal({ open: true, user: null })} className="btn-primary"><Plus size={18} /> Novo cliente</button>
      </header>
      <section className="panel overflow-hidden">
        <div className="border-b p-4">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-xl border py-2.5 pl-10 pr-4 text-sm focus:border-blue-400 focus:ring-4 focus:ring-blue-50" placeholder="Pesquisar clientes…" />
          </div>
        </div>
        <div className="table-wrap">
          <table className="data-table">
            <thead><tr><th>Cliente</th><th>Contacto</th><th>Idade</th><th>Objetivo</th><th className="text-right">Ações</th></tr></thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id}>
                  <td><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 font-extrabold text-blue-700"><UserRound size={18} /></span><div><p className="font-bold text-slate-800">{user.name}</p><p className="text-xs text-slate-400">{user.gender || 'Perfil de cliente'}</p></div></div></td>
                  <td><p>{user.email}</p><p className="text-xs text-slate-400">{user.phone || 'Sem telefone'}</p></td>
                  <td>{user.age || '—'}</td>
                  <td><span className="line-clamp-2 max-w-xs">{user.objective || '—'}</span></td>
                  <td><div className="flex justify-end gap-2"><button onClick={() => setModal({ open: true, user })} className="rounded-lg border p-2 text-slate-500 hover:text-blue-600"><Pencil size={16} /></button><button onClick={() => remove(user)} className="rounded-lg border p-2 text-slate-500 hover:border-red-200 hover:text-red-600"><Trash2 size={16} /></button></div></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filtered.length && <div className="p-12 text-center text-slate-500">Ainda não existem clientes com estes critérios.</div>}
        </div>
      </section>
      <UserModal {...modal} onClose={() => setModal({ open: false, user: null })} onSaved={load} />
    </div>
  );
}
