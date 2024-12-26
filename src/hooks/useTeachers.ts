import { teachersApi } from "../api/teachers";
import {Subject, TeacherForm} from "../types";


interface UseTeachersReturn {
    createTeacher : (teacher: Omit<TeacherForm, 'id'>) => Promise<TeacherForm>;
}

export const useTeachers = (): UseTeachersReturn => {

    // mapear de teacherForm a una estructura que acepte la api
    const mapearTeacherForm = (teacher: Omit<TeacherForm, 'id'>) => {
        return {
            persona: {
                nombre: teacher.firstName,
                apellido1: teacher.lastName.split(' ')[0],
                apellido2: teacher.lastName.split(' ').slice(1).join(' ') || '',
                email: teacher.email,
            },
            asignaturas: teacher.subjects.map((subject: Subject) => ({
                idAsignatura: subject.idAsignatura,
                nombreAsignatura: subject.nombreAsignatura,
                idCurso: subject.idCurso,
                nombreCurso: subject.nombreCurso,
                descripcion: subject.descripcion,
                acron: subject.acron,
            })),
        };
    };

    const createTeacher = async (teacher: Omit<TeacherForm, 'id'>): Promise<TeacherForm> => {

        const profesorDTO = mapearTeacherForm(teacher);
        const newTeacher = await teachersApi.create(profesorDTO);

        return newTeacher;
    };

    return {  createTeacher };
};
