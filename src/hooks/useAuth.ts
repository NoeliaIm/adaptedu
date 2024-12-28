import { useState } from 'react';
import {sendEmail, verifyEmailToken} from '../services/emailService';

export const useAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userData, setUserData] = useState(null);

    const login = async (email: string)  => {
        try {
            const response = await sendEmail(email);
            return response.success;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    };

    const verifyToken = async (token: string) => {
        try {
            const response = await verifyEmailToken(token);
            if (response.success && response.token) {
                localStorage.setItem('authToken', response.token);
                if (response.userData) {
                    setUserData(response.userData);
                }
                setIsAuthenticated(true);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Token verification failed:', error);
            return false;
        }
    };

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
        logout
    };
};