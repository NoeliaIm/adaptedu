import {Routes, Route, Navigate} from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chat from './pages/ChatRoom';
import Files from './pages/Files';
import StudentAnalytics from './pages/StudentAnalytics';
import SubjectForm from './pages/SubjectForm';
import VerifyAuth from './pages/VerifyAuth';
import {LoginPage} from "./pages/LoginPage.tsx";
import PrivateRoute from './components/PrivateRoute';
import {useEffect, useState} from "react";
import {useAuth} from "./hooks/useAuth.ts";


function App() {
    const { verifyStoredToken } = useAuth();
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const verify = async () => {
            setIsVerifying(true);
            await verifyStoredToken();
            setIsVerifying(false);
        };
        verify();
    }, [verifyStoredToken]);

    if (isVerifying) {
        return <p>Cargando datos...</p>;
    }

    return (
        <Routes>
            {/* Rutas públicas */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/verify" element={<VerifyAuth />} />

            {/* Rutas protegidas */}
            <Route
                path="/"
                element={
                    <PrivateRoute roles={['PROF', 'ALUM', 'ADMIN']}>
                        <Layout />
                    </PrivateRoute>
                }
            >
                <Route
                    index
                    element={
                        <PrivateRoute roles={['PROF', 'ADMIN']}>
                            <Home />
                        </PrivateRoute>
                    }
                />

                <Route path="chat" element={
                    <PrivateRoute roles={['PROF', 'ALUM', 'ADMIN']}>
                        <Chat />
                    </PrivateRoute>
                } />
                <Route path="files" element={
                    <PrivateRoute roles={['PROF', 'ADMIN']}>
                        <Files />
                    </PrivateRoute>
                } />
                <Route path="student/:id" element={
                    <PrivateRoute roles={['PROF', 'ADMIN']}>
                        <StudentAnalytics />
                    </PrivateRoute>
                } />
                <Route path="subject/new" element={
                    <PrivateRoute roles={['PROF', 'ADMIN']}>
                        <SubjectForm />
                    </PrivateRoute>
                } />
                <Route path="subject/:id" element={
                    <PrivateRoute roles={['PROF', 'ADMIN']}>
                        <SubjectForm />
                    </PrivateRoute>
                } />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

    );
}

export default App;