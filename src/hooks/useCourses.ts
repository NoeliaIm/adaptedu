import { useState, useEffect } from "react";
import { coursesApi } from "../api/courses"; // Importa la API existente
import { Course } from "../types"; // Importa el tipo Course

interface UseCoursesReturn {
    courses: Course[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export const useCourses = (): UseCoursesReturn => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Función para cargar los cursos desde la API usando subjectsApi.getAll
    const fetchCourses = async () => {
        try {
            setLoading(true);
            const data = await coursesApi.getAllActive();
            setCourses(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Error al obtener los cursos"));
        } finally {
            setLoading(false);
        }
    };

    // Cargar cursos al montar el componente que usa este hook
    useEffect(() => {
        void fetchCourses();
    }, []);

    // Método refetch para recargar los cursos manualmente si es necesario
    const refetch = async () => {
        await fetchCourses();
    };

    return { courses, loading, error, refetch };
};