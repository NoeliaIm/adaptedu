import axios from 'axios';
import { Subject } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const token = localStorage.getItem('authToken');

export const subjectsApi = {
    getAll: async (): Promise<Subject[]> => {
        try {
            if (!token) {
                throw new Error('Token no disponible. Por favor, inicia sesión.');
            }

            const response = await axios.get(`${API_BASE_URL}/asignaturas`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching subjects:', error);
            throw error;
        }
    },

    getById: async (id: string): Promise<Subject> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/asignaturas/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching subject ${id}:`, error);
            throw error;
        }
    },

    createOrUpdateSubject: async (subject: Omit<Subject, 'id'>): Promise<Subject> => {
        try {
            const response = await axios.post(`${API_BASE_URL}/asignaturas`, subject, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating subject:', error);
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await axios.delete(`${API_BASE_URL}/asignaturas/${id}`);
        } catch (error) {
            console.error(`Error deleting subject ${id}:`, error);
            throw error;
        }
    }
};