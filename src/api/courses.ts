import axios from 'axios';
import { Course } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const token = localStorage.getItem('authToken');
export const coursesApi = {
    getAll: async (): Promise<Course[]> => {
        try {
            if (!token) {
                throw new Error('Token no disponible. Por favor, inicia sesión.');
            }

            const response = await axios.get(`${API_BASE_URL}/cursos`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },

    getAllActive: async (): Promise<Course[]> => {
        try {
            if (!token) {
                throw new Error('Token no disponible. Por favor, inicia sesión.');
            }

            const response = await axios.get(`${API_BASE_URL}/cursos/activos`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching courses:', error);
            throw error;
        }
    },

    getById: async (id: string): Promise<Course> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/cursos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching course ${id}:`, error);
            throw error;
        }
    },

};