import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/auth';

export default function RedirectIfAuthed() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Navigate to="/do" replace />;
    }

    return <Outlet />;
}
