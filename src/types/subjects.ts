export interface Subject {
    id: string;
    name: string;
    description: string;
    course: number;
}

export const AVAILABLE_SUBJECTS: Subject[] = [
    { id: "MAT", name: "Matemáticas", description: "Matemáticas generales y cálculo", course: 1 },
    { id: "LEN", name: "Lengua", description: "Lengua castellana y literatura" , course: 1},
    { id: "ING", name: "Inglés", description: "Inglés como lengua extranjera" , course: 1},
    { id: "FIS", name: "Física", description: "Física y fenómenos naturales", course: 2 },
    { id: "QUI", name: "Química", description: "Química general y orgánica", course: 2 },
    { id: "BIO", name: "Biología", description: "Biología y ciencias naturales", course: 2 },
    { id: "HIS", name: "Historia", description: "Historia universal y de España", course: 3 },
    { id: "GEO", name: "Geografía", description: "Geografía física y política", course: 3 },
    { id: "ART", name: "Arte", description: "Historia del arte y expresión artística", course: 3 },
    { id: "MUS", name: "Música", description: "Educación musical y teoría", course: 4 },
    { id: "EFI", name: "Educación Física", description: "Educación física y deportes" , course: 4},
    { id: "TEC", name: "Tecnología", description: "Tecnología e informática", course: 4 },
];