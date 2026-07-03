import {
  BarChart3,
  Dumbbell,
  Users,
  CalendarRange,
  X,
  LogOut,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const staffLinks = [
  { to: '/dashboard', label: 'Visão geral', icon: BarChart3 },
  { to: '/users', label: 'Clientes', icon: Users },
  { to: '/exercises', label: 'Exercícios', icon: Dumbbell },
  { to: '/plans', label: 'Planos semanais', icon: CalendarRange },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth();
  const links = user?.role === 'client'
    ? [{ to: '/my-plans', label: 'Os meus planos', icon: CalendarRange }]
    : staffLinks;

  return (
    <>
      {open && <button className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-sm lg:hidden" onClick={onClose} aria-label="Fechar menu" />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col bg-ink px-5 py-6 text-white transition-transform lg:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="mb-9 flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-500 shadow-lg shadow-blue-900/30">
              <Dumbbell size={24} />
            </span>
            <div>
              <p className="text-xl font-extrabold tracking-tight">PlanFit</p>
              <p className="text-xs text-blue-200">Treinar com intenção</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-300 hover:bg-white/10 lg:hidden" aria-label="Fechar">
            <X size={20} />
          </button>
        </div>

        <nav className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                  isActive ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/30' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={19} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl bg-white/5 p-4">
          <p className="truncate text-sm font-semibold">{user?.name}</p>
          <p className="mb-3 truncate text-xs text-slate-400">{user?.email}</p>
          <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg py-2 text-sm font-semibold text-slate-300 hover:text-white">
            <LogOut size={17} />
            Terminar sessão
          </button>
        </div>
      </aside>
    </>
  );
}
