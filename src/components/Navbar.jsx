import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onMenu }) {
  const { user } = useAuth();
  const today = new Intl.DateTimeFormat('pt-PT', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200/70 bg-white/90 px-4 backdrop-blur lg:px-8">
      <div className="flex items-center gap-3">
        <button onClick={onMenu} className="rounded-xl border border-slate-200 p-2.5 text-slate-600 lg:hidden" aria-label="Abrir menu">
          <Menu size={21} />
        </button>
        <div>
          <p className="text-sm font-semibold text-slate-900">Olá, {user?.name?.split(' ')[0]}</p>
          <p className="hidden text-xs capitalize text-slate-500 sm:block">{today}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button className="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 hover:bg-slate-50" aria-label="Notificações">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-500 ring-2 ring-white" />
        </button>
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-sm font-extrabold text-blue-700">
          {user?.name?.split(' ').map((part) => part[0]).slice(0, 2).join('')}
        </span>
      </div>
    </header>
  );
}
