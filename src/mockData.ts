import { Student } from './types';

export const mockStudents: Student[] = [
    {
        id: 1,
        firstName: 'Juan',
        lastName: 'García',
        recordNumber: 2024001,
        email: 'juan.garcia@example.com',
        subjects: [
            {
                idAsignatura: 1,
                nombreAsignatura: 'Matemáticas',
                nombreCurso: '1º ESO',
                descripcion: 'Matemáticas generales y cálculo',
                acron: 'MAT'
            },
            {
                idAsignatura: 3,
                nombreAsignatura: 'Inglés',
                nombreCurso: '1º ESO',
                descripcion: 'Inglés como lengua extranjera',
                acron: 'ING'
            }
        ],
        isInternational: false,
        nativeLanguage: 'Español',
        nationality: 'Español',
        languageLevels: [
            {
                idioma: {
                    idIdioma: 1,
                    nombreIdioma: 'Inglés'
                },
                nivelIdioma: {
                    idNivelIdioma: 3,
                    nombreNivelIdioma: 'B2'
                },
                nativo: false
            },
            {
                idioma: {
                    idIdioma: 3,
                    nombreIdioma: 'Español'
                },
                nivelIdioma: {
                    idNivelIdioma: 5,
                    nombreNivelIdioma: 'C1'
                },
                nativo: true
            }
        ],
        specialNeeds: [
            {
                idNecesidadEspecial: 1,
                nombreNecesidadEspecial: 'Altas Capacidades'
            }
        ],
        academicLevels: {
            mathematics: {
                idNivelAcademico: 2,
                nombreNivelAcademico: 'Medio'
            },
            literature: {
                idNivelAcademico: 3,
                nombreNivelAcademico: 'Alto'
            },
            english: {
                idNivelAcademico: 4,
                nombreNivelAcademico: 'Alto'
            },
            history: {
                idNivelAcademico: 2,
                nombreNivelAcademico: 'Medio'
            }
        }
    },
    {
        id: 2,
        firstName: 'María',
        lastName: 'López',
        recordNumber: 2024002,
        email: 'maria.lopez@example.com',
        subjects: [
            {
                idAsignatura: 1,
                nombreAsignatura: 'Matemáticas',
                nombreCurso: '1º ESO',
                descripcion: 'Matemáticas generales y cálculo',
                acron: 'MAT'
            },
            {
                idAsignatura: 3,
                nombreAsignatura: 'Inglés',
                nombreCurso: '1º ESO',
                descripcion: 'Inglés como lengua extranjera',
                acron: 'ING'
            },
            {
                idAsignatura: 4,
                nombreAsignatura: 'Historia',
                nombreCurso: '1º ESO',
                descripcion: 'Historia universal y de España',
                acron: 'HIS'
            },
            {
                idAsignatura: 2,
                nombreAsignatura: 'Lengua',
                nombreCurso: '1º ESO',
                descripcion: 'Lengua castellana y literatura',
                acron: 'LEN'
            }
        ],
        isInternational: true,
        nativeLanguage: 'Francés',
        nationality: 'Francesa',
        languageLevels: [
            {
                idioma: {
                    idIdioma: 2,
                    nombreIdioma: 'Francés'
                },
                nivelIdioma: {
                    idNivelIdioma: 4,
                    nombreNivelIdioma: 'C1'
                },
                nativo: true
            },
            {
                idioma: {
                    idIdioma: 1,
                    nombreIdioma: 'Inglés'
                },
                nivelIdioma: {
                    idNivelIdioma: 3,
                    nombreNivelIdioma: 'B2'
                },
                nativo: false
            }
        ],
        specialNeeds: [
            {
                idNecesidadEspecial: 2,
                nombreNecesidadEspecial: 'TDAH'
            }
        ],
        academicLevels: {
            mathematics: {
                idNivelAcademico: 3,
                nombreNivelAcademico: 'Alto'
            },
            literature: {
                idNivelAcademico: 4,
                nombreNivelAcademico: 'Muy Alto'
            },
            english: {
                idNivelAcademico: 3,
                nombreNivelAcademico: 'Alto'
            },
            history: {
                idNivelAcademico: 3,
                nombreNivelAcademico: 'Alto'
            }
        }
    }
];