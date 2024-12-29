import { useAuth } from '../hooks/useAuth';

const DevTools = () => {
    const { userData, isAuthenticated } = useAuth();

    // Solo mostrar en desarrollo
    if (import.meta.env.MODE !== 'development') return null;

    return (
        <div style={{
            position: 'fixed',
            bottom: 10,
            right: 10,
            background: '#333',
            color: 'white',
            padding: 10,
            borderRadius: 5,
            fontSize: '12px'
        }}>
            <pre>
                {JSON.stringify({
                    isAuthenticated,
                    userData
                }, null, 2)}
            </pre>
        </div>
    );
};

export default DevTools;