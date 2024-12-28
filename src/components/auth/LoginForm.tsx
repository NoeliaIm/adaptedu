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
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                </label>
                <div className="mt-1 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        placeholder="tu@email.com"
                    />
                </div>
            </div>

            {error && (
                <div className="text-sm text-red-600">
                    {error}
                </div>
            )}

            {successMessage && (
                <div className="text-sm text-green-600">
                    {successMessage}
                </div>
            )}

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {isLoading ? 'Enviando...' : 'Iniciar sesión'}
            </button>
        </form>
    );
};