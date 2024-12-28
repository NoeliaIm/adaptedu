export const validateEmail = (email: string): string | undefined => {
    if (!email) {
        return 'El email es requerido';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'El formato del email no es válido';
    }

    return undefined;
};