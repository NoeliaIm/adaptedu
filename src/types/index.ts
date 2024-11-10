export interface Subject {
    id: string;
    name: string;
    description: string;
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

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type AcademicLevel = 'Bajo' | 'Medio-Bajo' | 'Medio' | 'Medio-Alto' | 'Alto';