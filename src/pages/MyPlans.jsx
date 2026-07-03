import { CalendarHeart } from 'lucide-react';
import { useEffect, useState } from 'react';
import api from '../api/axios';
import PlanCard from '../components/PlanCard';
import { useAuth } from '../context/AuthContext';

export default function MyPlans() {
  const { user } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/plans/user/${user.id}`).then(({ data }) => setPlans(data)).finally(() => setLoading(false));
  }, [user.id]);

  return (
    <div>
      <header className="mb-7">
        <p className="text-sm font-bold text-blue-600">A MINHA SEMANA</p>
        <h1 className="page-title">Os meus planos</h1>
        <p className="page-subtitle">Tudo o que precisa para treinar, dia após dia.</p>
      </header>
      {loading ? (
        <div className="grid min-h-72 place-items-center"><div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" /></div>
      ) : plans.length ? (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{plans.map((plan) => <PlanCard key={plan.id} plan={plan} />)}</section>
      ) : (
        <div className="panel grid min-h-80 place-items-center p-8 text-center">
          <div><span className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-blue-50 text-blue-600"><CalendarHeart size={28} /></span><h2 className="mt-4 text-xl font-extrabold">Ainda não tem planos</h2><p className="mt-2 text-sm text-slate-500">Quando o seu coach publicar um plano, irá encontrá-lo aqui.</p></div>
        </div>
      )}
    </div>
  );
}
