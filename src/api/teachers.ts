import axios from 'axios';
import {TeacherForm} from '../types';


const API_BASE_URL = 'http://localhost:8080/api';

const token = localStorage.getItem('authToken');

export const teachersApi = {

    create: async (teacher: {
        persona: { nombre: string; apellido1: string; apellido2: string; email: string };
        asignaturas: {
            idAsignatura: number | undefined;
            nombreAsignatura: string;
            idCurso: number;
            nombreCurso: string;
            descripcion: string;
            acron: string
        }[]
    }): Promise<TeacherForm> => {
        try {
            if (!token) {
                throw new Error('Token no disponible. Por favor, inicia sesión.');
            }

            const response = await axios.post(`${API_BASE_URL}/profesores`, teacher, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error creating teacher:', error);
            throw error;
        }
    }

};