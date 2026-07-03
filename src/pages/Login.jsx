import { Dumbbell, Eye, EyeOff, ShieldCheck, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: 'coach@planfit.pt', password: 'password' });

  if (user) return <Navigate to={user.role === 'client' ? '/my-plans' : '/dashboard'} replace />;

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const loggedUser = await login(form.email, form.password);
      navigate(loggedUser.role === 'client' ? '/my-plans' : '/dashboard', { replace: true });
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Não foi possível entrar',
        text: error.response?.data?.message || 'Verifique a ligação à API e tente novamente.',
        confirmButtonColor: '#2563eb',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1.05fr_.95fr]">
      <section className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-24 top-1/3 h-80 w-80 rounded-full bg-blue-500/20 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-500"><Dumbbell /></span>
          <span className="text-2xl font-extrabold">PlanFit</span>
        </div>
        <div className="relative max-w-xl">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-blue-100">
            <Sparkles size={16} /> Planeamento que gera consistência
          </span>
          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight">Planos melhores.<br />Clientes mais fortes.</h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-300">
            Organize treinos semanais, acompanhe clientes e entregue cada plano numa experiência clara e profissional.
          </p>
        </div>
        <div className="relative flex items-center gap-3 text-sm text-slate-400">
          <ShieldCheck size={18} className="text-emerald-400" />
          Dados protegidos e acesso personalizado por perfil
        </div>
      </section>

      <section className="flex items-center justify-center bg-canvas px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-9 flex items-center gap-3 lg:hidden">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white"><Dumbbell size={22} /></span>
            <span className="text-2xl font-extrabold text-ink">PlanFit</span>
          </div>
          <p className="mb-2 text-sm font-bold uppercase tracking-[.18em] text-blue-600">Bem-vindo</p>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950">Entre na sua conta</h2>
          <p className="mt-2 text-slate-500">O seu próximo treino começa com um bom plano.</p>

          <form onSubmit={submit} className="mt-8 space-y-5">
            <label className="field">
              Email
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="nome@exemplo.pt"
                autoComplete="email"
                required
              />
            </label>
            <label className="field">
              Senha
              <span className="relative">
                <input
                  className="pr-12"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" aria-label="Mostrar senha">
                  {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
                </button>
              </span>
            </label>
            <button disabled={loading} className="btn-primary h-12 w-full">
              {loading ? 'A entrar…' : 'Entrar no PlanFit'}
            </button>
          </form>

          <div className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/70 p-4 text-sm text-slate-600">
            <p className="font-bold text-blue-800">Acesso de demonstração</p>
            <p className="mt-1">coach@planfit.pt · senha: password</p>
          </div>
        </div>
      </section>
    </main>
  );
}
