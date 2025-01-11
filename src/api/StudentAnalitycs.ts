import axios from 'axios';
import {EvolucionAcademica} from "../types";


const API_BASE_URL = 'http://localhost:8080/api';
const token = localStorage.getItem('authToken');

export const studentAnalyticsApi = {
    getEvolucionAcademica: async (idAlumno: number): Promise<EvolucionAcademica[]> => {
        try {
            if (!token) {
                throw new Error('Token no disponible. Por favor, inicia sesión.');
            }

            const response = await axios.get<EvolucionAcademica[]>(
                `${API_BASE_URL}/calificaciones/${idAlumno}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error al obtener evolución académica:', error);
            throw error;
        }
    }
};