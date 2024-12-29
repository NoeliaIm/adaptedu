import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chat from './pages/ChatRoom';
import Files from './pages/Files';
import StudentAnalytics from './pages/StudentAnalytics';
import SubjectForm from './pages/SubjectForm';
import VerifyAuth from './pages/VerifyAuth';
import {LoginPage} from "./pages/LoginPage.tsx";
import PrivateRoute from './components/PrivateRoute';


function App() {
    return (
        <Routes>
            {/* Rutas públicas */}

            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/verify" element={<VerifyAuth />} />

            {/* Rutas protegidas */}

            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="chat" element={<Chat />} />
                <Route path="files" element={<Files />} />
                <Route path="student/:id" element={<StudentAnalytics />} />
                <Route path="subject/new" element={<SubjectForm />} />
                <Route path="subject/:id" element={<SubjectForm />} />
            </Route>
        </Routes>
        /*<Routes>
            {/!* Rutas públicas *!/}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/verify" element={<VerifyAuth />} />

            {/!* Rutas protegidas *!/}
            <Route
                path="/"
                element={
                    <PrivateRoute roles={['Profesor', 'Estudiante']}>
                        <Layout />
                    </PrivateRoute>
                }
            >
                <Route index element={<Home />} />
                <Route path="chat" element={
                    <PrivateRoute roles={['Profesor', 'Estudiante']}>
                        <Chat />
                    </PrivateRoute>
                } />
                <Route path="files" element={
                    <PrivateRoute roles={['Profesor']}>
                        <Files />
                    </PrivateRoute>
                } />
                <Route path="student/:id" element={
                    <PrivateRoute roles={['Profesor']}>
                        <StudentAnalytics />
                    </PrivateRoute>
                } />
                <Route path="subject/new" element={
                    <PrivateRoute roles={['Profesor']}>
                        <SubjectForm />
                    </PrivateRoute>
                } />
                <Route path="subject/:id" element={
                    <PrivateRoute roles={['Profesor']}>
                        <SubjectForm />
                    </PrivateRoute>
                } />
            </Route>
        </Routes>*/

    );
}

export default App;