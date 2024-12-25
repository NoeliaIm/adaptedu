import { useState, useEffect } from 'react';
import { Subject } from '../types';
import { subjectsApi } from '../api/subjects';

interface UseSubjectsReturn {
    subjects: Subject[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    createOrUpdateSubject: (subject: Omit<Subject, 'id'>) => Promise<Subject>;
    deleteSubject: (id: string) => Promise<void>;
}

export const useSubjects = (): UseSubjectsReturn => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const fetchSubjects = async () => {
        try {
            setLoading(true);
            const data = await subjectsApi.getAll();
            setSubjects(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubjects();
    }, []);

    const createOrUpdateSubject = async (subject: Omit<Subject, 'id'>): Promise<Subject> => {
        const newSubject = await subjectsApi.createOrUpdateSubject(subject);
        await fetchSubjects(); // Refresh the list
        return newSubject;
    };

    const deleteSubject = async (id: string): Promise<void> => {
        await subjectsApi.delete(id);
        await fetchSubjects(); // Refresh the list
    };

    return {
        subjects,
        loading,
        error,
        refetch: fetchSubjects,
        createOrUpdateSubject,
        deleteSubject
    };
};