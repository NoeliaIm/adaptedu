import { Student } from './types';

export const mockStudents: Student[] = [
    {
        id: '1',
        firstName: 'Juan',
        lastName: 'García',
        recordNumber: '2024001',
        subjects: [{
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
        nationality: 'España',
        nativeLanguage: 'Español',
        languageLevels: [
            { language: 'Inglés', level: 'B2' }
        ],
        hasASD: false,
        academicLevels: {
            mathematics: 'Alto',
            literature: 'Medio',
            english: 'Alto',
            history: 'Medio'
        },
        specialNeeds: {
            adhd: false,
            highAbilities: true,
            pas: false
        }
    },
    {
        id: '2',
        firstName: 'María',
        lastName: 'López',
        recordNumber: '2024002',
        subjects:  [{
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
        nationality: 'Francia',
        nativeLanguage: 'Francés',
        languageLevels: [
            { language: 'Español', level: 'B1' },
            { language: 'Inglés', level: 'C1' }
        ],
        hasASD: false,
        academicLevels: {
            mathematics: 'Medio',
            literature: 'Alto',
            english: 'Alto',
            history: 'Alto'
        },
        specialNeeds: {
            adhd: false,
            highAbilities: false,
            pas: false
        }
    }
];