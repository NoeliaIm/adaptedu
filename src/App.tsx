import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chat from './pages/ChatRoom';
import Files from './pages/Files';
import StudentAnalytics from './pages/StudentAnalytics';
import SubjectForm from './pages/SubjectForm';


function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="chat" element={<Chat />} />
                <Route path="files" element={<Files />} />
                <Route path="student/:id" element={<StudentAnalytics />} />
                <Route path="subject/new" element={<SubjectForm />} />
                <Route path="subject/:id" element={<SubjectForm />} />
            </Route>
        </Routes>
    );
}

export default App;