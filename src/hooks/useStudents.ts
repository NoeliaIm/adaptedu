import { useState, useEffect } from 'react';
import { Student } from '../types';
import { studentsApi } from '../api/students';

interface UsestudentsReturn {
    students: Student[];
    loadingStudents: boolean;
    errorStudents: Error | null;
    refetch: () => Promise<void>;
    createStudent: (subject: Omit<Student, 'id'>) => Promise<Student>;
    updateStudent: (id: string, subject: Omit<Student, 'id'>) => Promise<Student>;
    deleteStudent: (id: string) => Promise<void>;
}

export const useStudents = (): UsestudentsReturn => {
    const [students, setStudents] = useState<Student[]>([]);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [errorStudents, setErrorStudents] = useState<Error | null>(null);

    const mapStudentData = (data: any[]): Student[] => {

        const findNativeLanguage = (idiomas: any[]): string | undefined => {
            const nativeLanguage = idiomas.find(idioma => idioma.nativo);
            return nativeLanguage ? nativeLanguage.idioma.nombreIdioma : undefined;
        };
        const setLastName = (personaDTO: any): string => {
            if (!personaDTO.apellido2) {
                return personaDTO.apellido1;
            }
            return personaDTO.apellido1 + ' ' + personaDTO.apellido2;
        }

        const setAcademicLevels = (ambitos: { ambito: { nombreAmbito: string }, nivelAcademico: { idNivelAcademico: number, nombreNivelAcademico: string } }[]): { [key: string]: { idNivelAcademico: number, nombreNivelAcademico: string } } => {
            return ambitos.reduce((acc, { ambito, nivelAcademico }) => {
                acc[ambito.nombreAmbito] = {
                    idNivelAcademico: nivelAcademico.idNivelAcademico,
                    nombreNivelAcademico: nivelAcademico.nombreNivelAcademico
                };
                return acc;
            }, {} as { [key: string]: { idNivelAcademico: number, nombreNivelAcademico: string } });
        };

        return data.map(item => ({
            id: item.id,
            recordNumber: item.numeroExpediente,
            firstName: item.personaDTO.nombre,
            lastName: setLastName(item.personaDTO),
            email: item.personaDTO.email,
            nationality: item.nacionalidad,
            subjects: item.asignaturas,
            isInternational: item.extranjero,
            nativeLanguage: findNativeLanguage(item.idiomas),
            languageLevels: item.idiomas,
            specialNeeds: item.necesidadesEspeciales,
            academicLevels: setAcademicLevels(item.ambitos),
        }));
    };


    const fetchStudents = async () => {
        try {
            setLoadingStudents(true);
            const data = await studentsApi.getAll();
            const mappedData = mapStudentData(data);
            setStudents(mappedData);
            setErrorStudents(null);
        } catch (err) {
            setErrorStudents(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoadingStudents(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const createStudent = async (subject: Omit<Student, 'id'>): Promise<Student> => {
        const newStudent = await studentsApi.create(subject);
        await fetchStudents(); // Refresh the list
        return newStudent;
    };

    const updateStudent = async (id: string, subject: Omit<Student, 'id'>): Promise<Student> => {
        const updatedStudent = await studentsApi.update(id, subject);
        await fetchStudents(); // Refresh the list
        return updatedStudent;
    };

    const deleteStudent = async (id: string): Promise<void> => {
        await studentsApi.delete(id);
        await fetchStudents(); // Refresh the list
    };

    return {
        students,
        loadingStudents,
        errorStudents,
        refetch: fetchStudents,
        createStudent,
        updateStudent,
        deleteStudent
    };
};