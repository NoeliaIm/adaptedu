import axios from 'axios';
import { Subject } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

//const token = localStorage.getItem('token'); TODO cambiar el token por el que se obtenga en el login
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJpZ2xlc2lhc20ubm9lbGlhQGdtYWlsLmNvbSIsImlkX3BlcnNvbmEiOjUsIm5vbWJyZSI6Ik5vZWxpYSIsImFwZWxsaWRvIjoiSWdsZXNpYXMiLCJyb2xlcyI6WyJBZG1pbmlzdHJhZG9yIl0sImlhdCI6MTczNDc4NTMyMywiZXhwIjoxNzM1MzkwMTIzfQ.p9cMvaGLjkRCval4s9cz56tPKvT9BCKXtUUAvPEh8yXEVclUxbKv3jFn_RyIgqcnq-tG2Gen9CoMFpm91LEtrgxxLbDcp7ul4G4vJ6yPrUjOptGTEx_nFn34vNMSTmy7RCzVyyf9MEwpb1Svtqf21tikIENmPKSmHLjqP_RbOLPQH51roiRoev8LLsnr23nAhb9i0_Ga-bLXTVBhHhqIS23X2DIEWL83Dx6Ev-bVtRWWgqPb6DwgnjLGQHzZ446dE265pgirIPWs4RR-nujc12K2pZ0MjGpZmYw3bY1dxZyDnPYcThTQXO06nxmfL-tPiRhn1-B9xUDh3_YwGMlTAw";
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