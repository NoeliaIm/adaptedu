import {LoginForm} from "../components/auth/LoginForm.tsx";
import {useAuth} from "../hooks/useAuth.ts";

export const LoginPage = () => {
    const { login } = useAuth();

    const handleLogin = async (email: string) => {
        return await login(email);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[url('/images/education-bg.jpg')] bg-cover bg-center">
            <div className="w-full max-w-md p-8 bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl">
                <h2 className="text-3xl font-bold text-gray-900 text-center mb-2">Bienvenido</h2>
                <p className="text-center text-gray-600 mb-8">Accede a tu portal educativo</p>
                <LoginForm onLogin={handleLogin} />
            </div>
        </div>
    );
};