import axios from 'axios';
import { NivelAmbitoAcademico } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const token = localStorage.getItem('authToken');

export const academicLevelsApi = {
    getAll: async (): Promise<NivelAmbitoAcademico[]> => {
        try {
            if (!token) {
                throw new Error('Token no disponible. Por favor, inicia sesión.');
            }

            const response = await axios.get(`${API_BASE_URL}/ambitoAcademico/niveles`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching academic levels:', error);
            throw error;
        }
    },

};