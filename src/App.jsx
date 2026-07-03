import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import CreatePlan from './pages/CreatePlan';
import Dashboard from './pages/Dashboard';
import Exercises from './pages/Exercises';
import Login from './pages/Login';
import MyPlans from './pages/MyPlans';
import PlanDetails from './pages/PlanDetails';
import Plans from './pages/Plans';
import Users from './pages/Users';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/plans/:id" element={<PlanDetails />} />
          <Route element={<ProtectedRoute roles={['admin', 'coach']} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/exercises" element={<Exercises />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/plans/new" element={<CreatePlan />} />
          </Route>
          <Route element={<ProtectedRoute roles={['client']} />}>
            <Route path="/my-plans" element={<MyPlans />} />
          </Route>
        </Route>
      </Route>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
