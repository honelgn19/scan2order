import { Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <Outlet />
    </div>
  );
}