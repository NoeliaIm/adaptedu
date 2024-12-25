import { useState, useEffect } from "react";
import { specialNeedsApi } from "../api/specialNeeds";
import { NecesidadesEspeciales } from "../types";

interface UseNecesidadEspecialesReturn {
    necesidadesEspeciales: NecesidadesEspeciales[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export const useNecesidadesEspeciales = (): UseNecesidadEspecialesReturn => {
    const [necesidadesEspeciales, setNecesidadesEspeciales] = useState<NecesidadesEspeciales[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Función para cargar niveles idioma desde la API
    const fetchNecesidadEspecial = async () => {
        try {
            setLoading(true);
            const data = await specialNeedsApi.getAll();
            setNecesidadesEspeciales(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Error al obtener las necesidades especiales"));
        } finally {
            setLoading(false);
        }
    };

    // Cargar niveles académicos al montar el componente que usa este hook
    useEffect(() => {
        void fetchNecesidadEspecial();
    }, []);

    // Método refetch para recargar los niveles manualmente si es necesario
    const refetch = async () => {
        await fetchNecesidadEspecial();
    };

    return { necesidadesEspeciales, loading, error, refetch };
};