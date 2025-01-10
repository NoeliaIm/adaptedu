import axios from 'axios';
import {Archivo} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const token = localStorage.getItem('authToken');

export const archivoApi = {
    getAll: async (): Promise<Archivo[]> => {
        try {
            if (!token) {
                throw new Error('Token no disponible. Por favor, inicia sesión.');
            }

            const response = await axios.get(`${API_BASE_URL}/archivos`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching archivos:', error);
            throw error;
        }
    },


    delete: async (id: number): Promise<void> => {
        try {
            if (!token) {
                throw new Error('Token no disponible. Por favor, inicia sesión.');
            }
            await axios.delete(`${API_BASE_URL}/archivos/${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error(`Error deleting archivo ${id}:`, error);
            throw error;
        }
    }

};