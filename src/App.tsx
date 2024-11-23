import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Chat from './pages/ChatRoom';
import Files from './pages/Files';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="chat" element={<Chat />} />
                <Route path="files" element={<Files />} />
            </Route>
        </Routes>
    );
}

export default App;