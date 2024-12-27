import { useState, useEffect } from 'react';
import { Student, StudentApi } from '../types';
import { studentsApi } from '../api/students';

interface UsestudentsReturn {
    students: Student[];
    loadingStudents: boolean;
    errorStudents: Error | null;
    refetch: () => Promise<void>;
    createOrUpdateStudent: (subject: Omit<Student, 'id'>) => Promise<Student>;
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
            idPersona: item.persona.id,
            firstName: item.persona.nombre,
            lastName: setLastName(item.persona),
            email: item.persona.email,
            nationality: item.nacionalidad,
            subjects: item.asignaturas,
            isInternational: item.extranjero,
            nativeLanguage: findNativeLanguage(item.idiomas),
            languageLevels: item.idiomas,
            specialNeeds: item.necesidadesEspeciales,
            academicLevels: setAcademicLevels(item.ambitos),
        }));
    };

    const mapStudentToApi = (student: Student | Omit<Student, 'id'>): StudentApi => {
        const splitLastName = (lastName: string): { apellido1: string; apellido2: string | null } => {
            const [apellido1, ...rest] = lastName.split(' ');
            const apellido2 = rest.join(' ') || null;
            return { apellido1, apellido2 };
        };

        const { apellido1, apellido2 } = splitLastName(student.lastName);

        // debo convertir el idioma nativa en un idioma más, y marcarlo como nativo
        const mapNativeLanguage = (idioma: string): { idioma: { idIdioma: number; nombreIdioma: string }, nivelIdioma: { idNivelIdioma: number; nombreNivelIdioma: string }, nativo: boolean }[] => {
            // debo crear un idioma con nivel C1 y marcarlo como nativo, luego añadirlo a la lista de idiomas
            return [{
                idioma: {
                    idIdioma: 1,
                    nombreIdioma: idioma,
                },
                nivelIdioma: {
                    idNivelIdioma: 3,
                    nombreNivelIdioma: 'C1',
                },
                nativo: true,
            }];
        };

        // hacer un array de student.languageLevels con el idioma nativo y los demás idiomas
        const languageLevels = (): { idioma: { idIdioma: number; nombreIdioma: string }, nivelIdioma: { idNivelIdioma: number; nombreNivelIdioma: string }, nativo: boolean }[] => {
            return [...student.languageLevels, ...mapNativeLanguage(student.nativeLanguage ?? '')];
        };

        const establecerIdAmbito = (nombreAmbito: string): number => {
            switch (nombreAmbito) {
                case 'Matemáticas':
                    return 1;
                case 'Lengua':
                    return 2;
                case 'Inglés':
                    return 3;
                case 'Historia':
                    return 4;
                default:
                    return 0;
            }
        };

        return {
            id: 'id' in student ? student.id : null,
            numeroExpediente: student.recordNumber,
            persona: {
                id: student.idPersona ? student.idPersona : null,
                nombre: student.firstName,
                apellido1: apellido1,
                apellido2: apellido2 ?? '',
                email: student.email,
            },
            asignaturas: student.subjects,
            necesidadesEspeciales: student.specialNeeds,
            idiomas: languageLevels(),
            ambitos: Object.keys(student.academicLevels).map(key => ({
                ambito: {
                    idAmbito: establecerIdAmbito(key),
                    nombreAmbito: key,
                },
                nivelAcademico: student.academicLevels[key],
            })),
            extranjero: student.isInternational,
            nacionalidad: student.nationality ? student.nationality : '',
        };
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

    const createOrUpdateStudent = async (student: Omit<Student, 'id'>): Promise<Student> => {
        const studentApiFormat = mapStudentToApi(student);

        const newStudent = await studentsApi.create(studentApiFormat);
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
        createOrUpdateStudent,
        updateStudent,
        deleteStudent
    };
};