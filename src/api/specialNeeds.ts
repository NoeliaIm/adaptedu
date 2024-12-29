import axios from 'axios';
import { NecesidadesEspeciales } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const token = localStorage.getItem('authToken');

export const specialNeedsApi = {
    getAll: async (): Promise<NecesidadesEspeciales[]> => {
        try {
            if (!token) {
                throw new Error('Token no disponible. Por favor, inicia sesión.');
            }

            const response = await axios.get(`${API_BASE_URL}/necesidadesEspeciales`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching especial needs:', error);
            throw error;
        }
    },

};