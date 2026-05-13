import { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';

const ProtectedRoute = () => {
  const location = useLocation();
  const [status, setStatus] = useState<'checking' | 'allowed' | 'denied'>('checking');

  useEffect(() => {
    let isMounted = true;

    const verifySession = async () => {
      try {
        await authService.getCurrentUser();

        if (isMounted) {
          setStatus('allowed');
        }
      } catch {
        await authService.logout();

        if (isMounted) {
          setStatus('denied');
        }
      }
    };

    void verifySession();

    return () => {
      isMounted = false;
    };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen bg-[#16171d] text-[#f3f4f6] flex items-center justify-center">
        <div className="inline-flex items-center gap-3 text-[#9ca3af]">
          <div className="w-4 h-4 border-2 border-[#c084fc]/30 border-t-[#c084fc] rounded-full animate-spin" />
          Checking session...
        </div>
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
