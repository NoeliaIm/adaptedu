interface SendEmailResponse {
    success: boolean;
    message: string;
}

interface VerifyTokenResponse {
    success: boolean;
    message: string;
    token?: string;
    userData?: any;
}

export const sendEmail = async (email: string): Promise<SendEmailResponse> => {
    try {
        // Replace with your actual API endpoint
        const response = await fetch('http://localhost:8080/auth/solicitar-acceso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });

        const data = await response.json();
        return {
            success: response.ok,
            message: data.message || 'Email enviado correctamente',
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error al enviar el email' + error,
        };
    }
};

export const verifyEmailToken = async (token: string, email: string): Promise<VerifyTokenResponse> => {
    try {
        const response = await fetch('http://localhost:8080/auth/validar-acceso', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token, email }),
        });

        const data = await response.json();
        return {
            success: response.ok,
            message: data.message,
            token: data.token,
            userData: data.userData
        };
    } catch (error) {
        return {
            success: false,
            message: 'Error al verificar el token' + error,
        };
    }
};