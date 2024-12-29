import {useCallback, useEffect, useState} from 'react';
import {sendEmail, verifyEmailToken} from '../services/emailService';
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from '../types';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState<DecodedToken | null>(null);

    const login = async (email: string)  => {
        try {
            const response = await sendEmail(email);
            return response.success;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const verifyToken = async (token: string, email: string) => {
        try {
            const response = await verifyEmailToken(token, email);
            if (response.success && response.token) {
                localStorage.setItem('authToken', response.token);
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token verification failed:', error);
            return false;
        }
    };


    const verifyStoredToken = useCallback(async () => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            setIsAuthenticated(false);
            return false;
        }

        try {
            const decodedToken = jwtDecode<DecodedToken>(token);

            // Verificar que todos los campos necesarios existan
            if (!decodedToken.sub || !decodedToken.id_persona || !decodedToken.roles) {
                setIsAuthenticated(false);
                setUserData(null);
                return false;
            }

            // Verificar expiración
            if (decodedToken.exp * 1000 < Date.now()) {
                setIsAuthenticated(false);
                setUserData(null);
                return false; // No borramos el token, solo reportamos que no es válido
            }

            setUserData(decodedToken);
            setIsAuthenticated(true);
            return true;
        } catch (error) {
            console.error('Error decodificando token:', error);
            setIsAuthenticated(false);
            setUserData(null);
            return false; // No borramos el token automáticamente
        }
    }, []);

    // Solo en desarrollo
    if (import.meta.env.NODE_ENV === 'development') {
        (window as any).auth = {
            userData,
            isAuthenticated,
            verifyStoredToken
        };
    }

// Verificar token al montar el componente
    useEffect(() => {
        verifyStoredToken();
    }, [verifyStoredToken]);


    const logout = () => {
        localStorage.removeItem('authToken');
        setIsAuthenticated(false);
        setUserData(null);
    };

    return {
        isAuthenticated,
        userData,
        login,
        verifyToken,
        verifyStoredToken,
        setUserData,
        logout
    };
};