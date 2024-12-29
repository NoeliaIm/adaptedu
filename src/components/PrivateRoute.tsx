import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import {useEffect, useState} from "react";

interface PrivateRouteProps {
    children: React.ReactNode;
    roles?: string[];
}

const PrivateRoute = ({ children, roles }: PrivateRouteProps) => {
    const { isAuthenticated, userData, verifyStoredToken } = useAuth();
    const location = useLocation();
    const [isVerifying, setIsVerifying] = useState(true);

    useEffect(() => {
        const verify = async () => {
            try {
                await verifyStoredToken();
            } finally {
                setIsVerifying(false);
            }
        };
        verify();
    }, []);

    if (isVerifying) {
        return <div>Cargando...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (roles && userData?.roles) {
        console.log('Roles requeridos:', roles); // Logs los roles necesarios
        console.log('Roles del usuario:', userData.roles); // Logs los roles del usuario

        const hasRequiredRole = roles.some(role =>
            userData.roles.includes(role)
        );

        console.log('¿Usuario tiene rol requerido?', hasRequiredRole);

        if (!hasRequiredRole) {
            console.warn('Acceso denegado. Usuario no tiene el rol requerido.');
            return <Navigate to="/" replace />;
        }
    }

    return <>{children}</>;
};

export default PrivateRoute;