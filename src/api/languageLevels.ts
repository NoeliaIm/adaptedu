import axios from 'axios';
import { NivelIdioma } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const token = localStorage.getItem('authToken');

export const languageLevelsApi = {
    getAll: async (): Promise<NivelIdioma[]> => {
        try {
            if (!token) {
                throw new Error('Token no disponible. Por favor, inicia sesión.');
            }

            const response = await axios.get(`${API_BASE_URL}/idiomas/niveles`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching languages levels:', error);
            throw error;
        }
    },

};