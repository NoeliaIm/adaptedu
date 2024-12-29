import {useEffect} from "react";
import {useAuth} from "../hooks/useAuth.ts";
import {useNavigate, useSearchParams} from "react-router-dom";

const VerifyAuth = () => {
    const navigate = useNavigate();
    const { verifyToken } = useAuth();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const token = searchParams.get('token');
        const email = searchParams.get('email');
        if (!token || !email) {
            navigate('/');
            return;
        }

        let isMounted = true;

        verifyToken(token, email)
            .then(success => {
                if (!isMounted) return;
                if (success) {
                    navigate('/', { replace: true });
                } else {
                    navigate('', { replace: true });
                }
            })
            .catch(error => {
                if (!isMounted) return;
                console.error('Error en verificación:', error);
                navigate('', { replace: true });
            });

        return () => {
            isMounted = false;
        };
    }, [verifyToken, navigate, searchParams]);

    return <div>Verificando...</div>;
};

export default VerifyAuth;