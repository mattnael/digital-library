import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function FullScreenMessage({ children }) {
  return (
    <div className="min-h-screen bg-[#f7f5ef] flex items-center justify-center text-xs text-stone-500">
      {children}
    </div>
  );
}

export default function ProtectedRoute({ adminOnly = false, children }) {
  const { status, user } = useAuth();
  const location = useLocation();

  if (status === 'loading') {
    return <FullScreenMessage>Memuat sesi...</FullScreenMessage>;
  }

  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (adminOnly && user?.role !== 'ADMIN') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
