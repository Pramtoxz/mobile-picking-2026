import { useGulirKeInput } from '@/hooks/use-gulir-ke-input';
import DoList from '@/pages/DoList';
import Login from '@/pages/Login';
import WorkItem from '@/pages/WorkItem';
import RedirectIfAuthed from '@/routes/RedirectIfAuthed';
import RequireAuth from '@/routes/RequireAuth';
import { useAuthStore } from '@/store/auth';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'sonner';

function Beranda() {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    return <Navigate to={isAuthenticated ? '/do' : '/login'} replace />;
}

export default function App() {
    useGulirKeInput();

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Beranda />} />

                <Route element={<RedirectIfAuthed />}>
                    <Route path="/login" element={<Login />} />
                </Route>

                <Route element={<RequireAuth />}>
                    <Route path="/do" element={<DoList />} />
                    <Route path="/kerja/*" element={<WorkItem />} />
                </Route>
            </Routes>
            <Toaster
                position="bottom-right"
                toastOptions={{
                    className: 'font-mono text-xs border-2 border-ink rounded-xs shadow-[2px_2px_0_0_#17150f]',
                }}
            />
        </BrowserRouter>
    );
}
