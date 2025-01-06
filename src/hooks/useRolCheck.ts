import { useAuth } from './useAuth';

export const useRoleCheck = () => {
    const { userData } = useAuth();

    const hasRole = (roles: string[]) => {
        if (!userData) return false;
        if (userData.roles.includes('ADMIN')) return true;
        return roles.some(role => userData.roles.includes(role));
    };

    return { hasRole };
};