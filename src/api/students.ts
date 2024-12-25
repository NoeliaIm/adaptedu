import axios from 'axios';
import { Student } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

//const token = localStorage.getItem('token'); TODO cambiar el token por el que se obtenga en el login
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJpZ2xlc2lhc20ubm9lbGlhQGdtYWlsLmNvbSIsImlkX3BlcnNvbmEiOjUsIm5vbWJyZSI6Ik5vZWxpYSIsImFwZWxsaWRvIjoiSWdsZXNpYXMiLCJyb2xlcyI6WyJBZG1pbmlzdHJhZG9yIl0sImlhdCI6MTczNDc4NTMyMywiZXhwIjoxNzM1MzkwMTIzfQ.p9cMvaGLjkRCval4s9cz56tPKvT9BCKXtUUAvPEh8yXEVclUxbKv3jFn_RyIgqcnq-tG2Gen9CoMFpm91LEtrgxxLbDcp7ul4G4vJ6yPrUjOptGTEx_nFn34vNMSTmy7RCzVyyf9MEwpb1Svtqf21tikIENmPKSmHLjqP_RbOLPQH51roiRoev8LLsnr23nAhb9i0_Ga-bLXTVBhHhqIS23X2DIEWL83Dx6Ev-bVtRWWgqPb6DwgnjLGQHzZ446dE265pgirIPWs4RR-nujc12K2pZ0MjGpZmYw3bY1dxZyDnPYcThTQXO06nxmfL-tPiRhn1-B9xUDh3_YwGMlTAw";
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

    getById: async (id: string): Promise<Student> => {
        try {
            const response = await axios.get(`${API_BASE_URL}/alumnos/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching student ${id}:`, error);
            throw error;
        }
    },

    create: async (student: Omit<Student, 'id'>): Promise<Student> => {
        try {
            const response = await axios.post(`${API_BASE_URL}/student`, student);
            return response.data;
        } catch (error) {
            console.error('Error creating student:', error);
            throw error;
        }
    },

    update: async (id: string, student: Omit<Student, 'id'>): Promise<Student> => {
        try {
            const response = await axios.put(`${API_BASE_URL}/alumnos/${id}`, student);
            return response.data;
        } catch (error) {
            console.error(`Error updating student ${id}:`, error);
            throw error;
        }
    },

    delete: async (id: string): Promise<void> => {
        try {
            await axios.delete(`${API_BASE_URL}/alumnos/${id}`);
        } catch (error) {
            console.error(`Error deleting student ${id}:`, error);
            throw error;
        }
    }
};