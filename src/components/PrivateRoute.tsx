import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import React, {useEffect, useState} from "react";

interface PrivateRouteProps {
    children: React.ReactNode;
    roles: string[];
}

const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
    const { isAuthenticated, userData, verifyStoredToken } = useAuth();
    const location = useLocation();
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const verify = async () => {
            setIsVerifying(true);
            await verifyStoredToken();
            setIsVerifying(false);
        };
        verify();
    }, [verifyStoredToken]);


    const getDefaultRoute = () => {
        if (!userData) return '/login';

        // Definir rutas por defecto según el rol
        if (userData.roles.includes('ALUM')) return '/chat';
        if (userData.roles.includes('PROF')) return '/';
        if (userData.roles.includes('ADMIN')) return '/';

        return '/login';
    };

    if (isVerifying) {
        return null;
    }

    if (!isAuthenticated || !userData) {
        console.log('No autenticado, redirigiendo a login');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }


    // Si el usuario es ADMIN, permitir acceso sin importar los roles requeridos
    if (userData.roles.includes('ADMIN')) {
        return <>{children}</>;
    }

    const hasRequiredRole = roles.some(role =>
        userData.roles.includes(role)
    );


    if (!hasRequiredRole) {
        console.warn('Acceso denegado. Usuario no tiene el rol requerido.');
        return <Navigate to={getDefaultRoute()} replace />;
    }

    return <>{children}</>;
};

export default PrivateRoute;