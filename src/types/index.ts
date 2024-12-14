export interface Subject {
    id: string;
    name: string;
    description: string;
    course: string;
}

export interface TeacherForm {
    firstName: string;
    lastName: string;
    subjects: Subject[];
}

export interface Student {
    id: string;
    firstName: string;
    lastName: string;
    recordNumber: string;
    subjects: string[];
    isInternational: boolean;
    nationality?: string;
    nativeLanguage: string;
    languageLevels: {
        language: string;
        level: LanguageLevel;
    }[];
    hasASD: boolean;
    academicLevels: {
        mathematics: AcademicLevel;
        literature: AcademicLevel;
        english: AcademicLevel;
        history: AcademicLevel;
    };
    specialNeeds: {
        adhd: boolean;
        highAbilities: boolean;
        pas: boolean;
    };
}

export interface Course {
    id: number;
    name: string;
}

export const AVAILABLE_COURSES: Course[] = [
    { id: 1, name: '1º ESO' },
    { id: 2, name: '2º ESO' },
    { id: 3, name: '3º ESO' },
    { id: 4, name: '4º ESO' }
];

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type AcademicLevel = 'Bajo' | 'Medio-Bajo' | 'Medio' | 'Medio-Alto' | 'Alto';