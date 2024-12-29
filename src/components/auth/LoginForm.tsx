import React, { useState } from 'react';
import { User } from 'lucide-react';
import { validateEmail } from '../../utils/validations';

interface LoginFormProps {
    onLogin: (email: string)  => Promise<boolean>;
    onClose?: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin , onClose }) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const validationError = validateEmail(email);
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const result = await onLogin(email);
            if (result) {
                setSuccessMessage('Email enviado');
                setEmail('');
                if (onClose) {
                    setTimeout(() => {
                        onClose();
                        setSuccessMessage('');
                    }, 2000);
                }
            } else {
                setError('Error al enviar el email');
            }
        } catch (err) {
            setError('Error al enviar el email');
            console.error('Error sending email:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email institucional
                </label>
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-11 w-full h-12 border border-gray-200 rounded-lg
                                 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                 text-gray-900 placeholder:text-gray-400"
                        placeholder="tu@email.com"
                    />
                </div>
            </div>

            {error && (
                <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    {successMessage}
                </div>
            )}

            <button
                type="submit"
                className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white font-medium
                         rounded-lg transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                         disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
            >
                {isLoading ? 'Enviando...' : 'Iniciar sesión'}
            </button>
        </form>
    );
};