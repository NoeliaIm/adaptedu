import { useState, useEffect } from "react";
import { academicLevelsApi } from "../api/academicLevels"; // Importa la API adecuada
import { NivelAmbitoAcademico } from "../types"; // Importa el tipo adecuado

interface UseNivelAmbitoAcademicoReturn {
    nivelesAcademicos: NivelAmbitoAcademico[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export const useNivelAmbitoAcademico = (): UseNivelAmbitoAcademicoReturn => {
    const [nivelesAcademicos, setNivelesAcademicos] = useState<NivelAmbitoAcademico[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Función para cargar niveles académicos desde la API
    const fetchNivelAmbitoAcademico = async () => {
        try {
            setLoading(true);
            const data = await academicLevelsApi.getAll(); // Usamos el método de la API para obtener todos los niveles
            setNivelesAcademicos(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Error al obtener los niveles académicos"));
        } finally {
            setLoading(false);
        }
    };

    // Cargar niveles académicos al montar el componente que usa este hook
    useEffect(() => {
        void fetchNivelAmbitoAcademico();
    }, []);

    // Método refetch para recargar los niveles manualmente si es necesario
    const refetch = async () => {
        await fetchNivelAmbitoAcademico();
    };

    return { nivelesAcademicos, loading, error, refetch };
};