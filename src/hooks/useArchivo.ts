import { useState, useEffect } from "react";
import { archivoApi } from "../api/archivos";
import {Archivo} from "../types";

interface UseArchivoReturn {
    archivos: Archivo[];
    loadingArchivos: boolean;
    errorArchivos: Error | null;
    refetch: () => Promise<void>;
    deleteArchivo: (id: number) => Promise<void>;
}

export const useArchivo = (): UseArchivoReturn => {
    const [archivos, setArchivos] = useState<Archivo[]>([]);
    const [loadingArchivos, setLoadingArchivos] = useState<boolean>(true);
    const [errorArchivos, setErrorArchivos] = useState<Error | null>(null);

    // Función para cargar archivos desde la API
    const fetchArchivo = async () => {
        try {
            setLoadingArchivos(true);
            const data = await archivoApi.getAll(); // Usamos el método de la API para obtener todos los archivos
            setArchivos(data);
        } catch (err) {
            setErrorArchivos(err instanceof Error ? err : new Error("Error al obtener los archivos"));
        } finally {
            setLoadingArchivos(false);
        }
    };

    const deleteArchivo = async (id: number): Promise<void> => {
        console.log('Deleting student:', id);
        try {
            await archivoApi.delete(id);
            console.log('Student deleted from API');
            await fetchArchivo();
        } catch (err) {
            console.error('Error in deleteStudent:', err);
        }
    };

    // Cargar archivos al montar el componente que usa este hook
    useEffect(() => {
        void fetchArchivo();
    }, []);

    // Método refetch para recargar los archivos manualmente si es necesario
    const refetch = async () => {
        await fetchArchivo();
    };

    return { archivos, deleteArchivo, loadingArchivos, errorArchivos, refetch };
};