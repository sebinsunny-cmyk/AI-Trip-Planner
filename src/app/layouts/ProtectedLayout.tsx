import { Outlet, Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export function ProtectedLayout() {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) return <Navigate to="/signin" replace />;
  return <Outlet />;
}
