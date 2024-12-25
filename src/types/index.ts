export interface Subject {
    idAsignatura?: number;
    nombreAsignatura: string;
    descripcion: string;
    nombreCurso: string;
    idCurso: number;
    acron: string;
}

export interface TeacherForm {
    firstName: string;
    lastName: string;
    email: string;
    subjects: Subject[];
}

export interface Student {
    id: number; // ID del estudiante
    recordNumber: number; // Equivalente a "numeroExpediente"
    firstName: string; // "personaDTO.nombre"
    lastName: string; // "personaDTO.apellido1 + personaDTO.apellido2" (concatenar)
    email?: string; // Nuevo campo de "personaDTO.email"
    nationality?: string; // Nuevo campo de "personaDTO.nacionalidad"
    subjects: Subject[]; // Array de asignaturas
    isInternational: boolean; // "extranjero"
    nativeLanguage?: string; // Idioma nativo (basado en "idiomas[nativo=true]")
    languageLevels: {
        idioma: {
            idIdioma: number; // ID del idioma
            nombreIdioma: string; // Nombre del idioma
        };
        nivelIdioma: {
            idNivelIdioma: number; // ID del nivel
            nombreNivelIdioma: string; // Nombre del nivel del idioma
        };
        nativo: boolean; // Indica si es el idioma nativo
    }[]; // Nueva estructura basada en la API
    specialNeeds: NecesidadesEspeciales[]; // Array de necesidades especiales
    academicLevels: {
        [key: string]: {
            idNivelAcademico: number; // ID del nivel académico
            nombreNivelAcademico: string; // Nombre del nivel académico
        };
    }; // Basado en "ambitos"
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
    idNivelIdioma: number;
    nombreNivelIdioma: string;
}


export interface NecesidadesEspeciales {
    idNecesidadEspecial: number
    nombreNecesidadEspecial: string
}
