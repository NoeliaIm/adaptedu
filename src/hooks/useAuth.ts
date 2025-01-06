import {useCallback, useEffect, useState} from 'react';
import {sendEmail, verifyEmailToken} from '../services/emailService';
import { jwtDecode } from "jwt-decode";
import { DecodedToken } from '../types';
import { isTokenExpired } from '../utils/auth'

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        const token = localStorage.getItem('authToken');
        return !!token && !isTokenExpired(token);
    });
    const [userData, setUserData] = useState<DecodedToken | null>(() => {
        const token = localStorage.getItem('authToken');
        if (token && !isTokenExpired(token)) {
            try {
                const decoded = jwtDecode<DecodedToken>(token);
                if (decoded.sub && decoded.id_persona && decoded.roles) {
                    return decoded;
                }
            } catch {
                return null;
            }
        }
        return null;
    });


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
        if (!token || isTokenExpired(token)) {
            setIsAuthenticated(false);
            setUserData(null);
            return false;
        }

        try {
            const decoded = jwtDecode<DecodedToken>(token);
            if (!decoded.sub || !decoded.id_persona || !decoded.roles) {
                throw new Error('Invalid token data');
            }

            setUserData(decoded);
            setIsAuthenticated(true);
            return true;
        } catch {
            localStorage.removeItem('authToken');
            setIsAuthenticated(false);
            setUserData(null);
            return false;
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