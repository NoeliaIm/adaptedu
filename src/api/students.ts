import axios from 'axios';
import {Student, StudentApi} from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

const token = localStorage.getItem('authToken');

    export const studentsApi = {
    getAll: async (): Promise<Student[]> => {
        try {
            if (!token) {
                throw new Error('Token no disponible. Por favor, inicia sesión.');
            }

            const response = await axios.get(`${API_BASE_URL}/alumnos`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching students:', error);
            throw error;
        }
    },

    create: async (student: StudentApi): Promise<Student> => {
        try {

            if (!token) {
                throw new Error('Token no disponible. Por favor, inicia sesión.');
            }
            const response = await axios.post(`${API_BASE_URL}/alumnos`, student,  {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating student:', error);
            throw error;
        }
    },

    delete: async (id: number): Promise<void> => {
        try {
            if (!token) {
                throw new Error('Token no disponible. Por favor, inicia sesión.');
            }
            await axios.delete(`${API_BASE_URL}/alumnos/${id}`,{
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
        } catch (error) {
            console.error(`Error deleting student ${id}:`, error);
            throw error;
        }
    }
};