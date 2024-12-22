export interface Subject {
    idAsignatura?: number;
    nombreAsignatura: string;
    descripcion: string;
    nombreCurso: string;
    acron: string;
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
    subjects: Subject[];
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
    idCurso: number;
    nombreCurso: string;
    annio: string;
    active: boolean;
}

export interface AmbitoAcademico {
    idAmbito: number;
    nombreAmbito: string;
    nivelAmbito: NivelAmbitoAcademico;
}

export interface NivelAmbitoAcademico {
    idNivelAcademico: number;
    nombreNivelAcademico: string;
}

export interface Idioma {
    idIdioma: number;
    nombreIdioma: string;
}

export interface NivelIdioma {
    idNivel: number;
    nombreNivel: string;
}

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
export type AcademicLevel = 'Bajo' | 'Medio-Bajo' | 'Medio' | 'Medio-Alto' | 'Alto';