import React from 'react';
import { LoginForm } from './LoginForm';

interface LoginOverlayProps {
    onLogin: (email: string) => Promise<boolean>;
}

export const LoginOverlay: React.FC<LoginOverlayProps> = ({ onLogin }) => {
    return (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full mx-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Bienvenido</h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Inicia sesión para continuar
                    </p>
                </div>
                <LoginForm onLogin={onLogin} />
            </div>
        </div>
    );
};