import { Student } from './types';

export const mockStudents: Student[] = [
    {
        id: '1',
        firstName: 'Juan',
        lastName: 'García',
        recordNumber: '2024001',
        subjects: ['GEO', 'BIO', 'MAT'],
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
        subjects: ['HIS', 'LEN', 'ING'],
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