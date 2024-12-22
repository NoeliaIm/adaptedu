import axios from 'axios';
import { Course } from '../types';

const API_BASE_URL = 'http://localhost:8080/api';

//const token = localStorage.getItem('token'); TODO cambiar el token por el que se obtenga en el login
const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJpZ2xlc2lhc20ubm9lbGlhQGdtYWlsLmNvbSIsImlkX3BlcnNvbmEiOjUsIm5vbWJyZSI6Ik5vZWxpYSIsImFwZWxsaWRvIjoiSWdsZXNpYXMiLCJyb2xlcyI6WyJBZG1pbmlzdHJhZG9yIl0sImlhdCI6MTczNDc4NTMyMywiZXhwIjoxNzM1MzkwMTIzfQ.p9cMvaGLjkRCval4s9cz56tPKvT9BCKXtUUAvPEh8yXEVclUxbKv3jFn_RyIgqcnq-tG2Gen9CoMFpm91LEtrgxxLbDcp7ul4G4vJ6yPrUjOptGTEx_nFn34vNMSTmy7RCzVyyf9MEwpb1Svtqf21tikIENmPKSmHLjqP_RbOLPQH51roiRoev8LLsnr23nAhb9i0_Ga-bLXTVBhHhqIS23X2DIEWL83Dx6Ev-bVtRWWgqPb6DwgnjLGQHzZ446dE265pgirIPWs4RR-nujc12K2pZ0MjGpZmYw3bY1dxZyDnPYcThTQXO06nxmfL-tPiRhn1-B9xUDh3_YwGMlTAw";
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