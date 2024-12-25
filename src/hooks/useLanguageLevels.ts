import { useState, useEffect } from "react";
import { languageLevelsApi } from "../api/languageLevels";
import { NivelIdioma } from "../types";

interface UseNivelIdiomaReturn {
    nivelesIdioma: NivelIdioma[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
}

export const useNivelIdioma = (): UseNivelIdiomaReturn => {
    const [nivelesIdioma, setNivelesIdioma] = useState<NivelIdioma[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    // Función para cargar niveles idioma desde la API
    const fetchNivelIdioma = async () => {
        try {
            setLoading(true);
            const data = await languageLevelsApi.getAll(); // Usamos el método de la API para obtener todos los niveles
            setNivelesIdioma(data);
        } catch (err) {
            setError(err instanceof Error ? err : new Error("Error al obtener los niveles del idioma"));
        } finally {
            setLoading(false);
        }
    };

    // Cargar niveles académicos al montar el componente que usa este hook
    useEffect(() => {
        void fetchNivelIdioma();
    }, []);

    // Método refetch para recargar los niveles manualmente si es necesario
    const refetch = async () => {
        await fetchNivelIdioma();
    };

    return { nivelesIdioma, loading, error, refetch };
};