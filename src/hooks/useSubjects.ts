import { useState, useEffect } from 'react';
import { Subject } from '../types';
import { subjectsApi } from '../api/subjects';

interface UseSubjectsReturn {
    subjects: Subject[];
    loading: boolean;
    error: Error | null;
    refetch: () => Promise<void>;
    createSubject: (subject: Omit<Subject, 'id'>) => Promise<Subject>;
    updateSubject: (id: string, subject: Omit<Subject, 'id'>) => Promise<Subject>;
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

    const createSubject = async (subject: Omit<Subject, 'id'>): Promise<Subject> => {
        const newSubject = await subjectsApi.create(subject);
        await fetchSubjects(); // Refresh the list
        return newSubject;
    };

    const updateSubject = async (id: string, subject: Omit<Subject, 'id'>): Promise<Subject> => {
        const updatedSubject = await subjectsApi.update(id, subject);
        await fetchSubjects(); // Refresh the list
        return updatedSubject;
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
        createSubject,
        updateSubject,
        deleteSubject
    };
};