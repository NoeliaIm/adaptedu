
export const isTokenExpired = (token: string): boolean => {
    if (!token) return true;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const expirationTime = payload.exp * 1000; // Convertir a milisegundos
        return Date.now() >= expirationTime;
    } catch {
        return true;
    }
};