import {EvolucionAcademica} from "../types";
import {studentAnalyticsApi} from "../api/StudentAnalitycs.ts";
import {useEffect, useState} from "react";

interface UseStudentAnalyticsReturn {
    evolucionAcademica: EvolucionAcademica[];
    loadingStudentAnalytics: boolean;
    errorStudentAnalytics: Error | null;
    refetch: () => Promise<void>;
}
interface UseStudentAnalyticsProps {
    idAlumno: number;  // Añadir props para el ID
}

export const useStudentAnalytics = ({ idAlumno }: UseStudentAnalyticsProps): UseStudentAnalyticsReturn => {
    const [evolucionAcademica, setEvolucionAcademica] = useState<EvolucionAcademica[]>([]);
    const [loadingStudentAnalytics, setLoadingStudentAnalytics] = useState<boolean>(true);
    const [errorStudentAnalytics, setErrorStudentAnalytics] = useState<Error | null>(null);

    // Función para cargar la evolución académica del estudiante
    const fetchStudentAnalytics = async () => {
        try {
            setLoadingStudentAnalytics(true);
            const data = await studentAnalyticsApi.getEvolucionAcademica(idAlumno);
            setEvolucionAcademica(data);
        } catch (err) {
            setErrorStudentAnalytics(err instanceof Error ? err : new Error("Error al obtener la evolución académica"));
        } finally {
            setLoadingStudentAnalytics(false);
        }
    };

    // Cargar la evolución académica al montar el componente que usa este hook
    useEffect(() => {
        void fetchStudentAnalytics();
    }, []);

    // Método refetch para recargar la evolución académica manualmente si es necesario
    const refetch = async () => {
        await fetchStudentAnalytics();
    };

    return { evolucionAcademica, loadingStudentAnalytics, errorStudentAnalytics, refetch };
}


