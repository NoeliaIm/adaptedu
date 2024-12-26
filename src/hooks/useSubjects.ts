import { useState, useEffect } from 'react';
import { Subject } from '../types';
import { subjectsApi } from '../api/subjects';

interface UseSubjectsReturn {
    subjects: Subject[];
    loadingSubjects: boolean;
    errorSubjects: Error | null;
    refetch: () => Promise<void>;
    createOrUpdateSubject: (subject: Omit<Subject, 'id'>) => Promise<Subject>;
    deleteSubject: (id: string) => Promise<void>;
}

export const useSubjects = (): UseSubjectsReturn => {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loadingSubjects, setLoadingSubjects] = useState(true);
    const [errorSubjects, setErrorSubjects] = useState<Error | null>(null);

    const fetchSubjects = async () => {
        try {
            setLoadingSubjects(true);
            const data = await subjectsApi.getAll();
            setSubjects(data);
            setErrorSubjects(null);
        } catch (err) {
            setErrorSubjects(err instanceof Error ? err : new Error('An error occurred'));
        } finally {
            setLoadingSubjects(false);
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
        loadingSubjects,
        errorSubjects,
        refetch: fetchSubjects,
        createOrUpdateSubject,
        deleteSubject
    };
};