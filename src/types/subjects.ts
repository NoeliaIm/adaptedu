export interface Subject {
    id: string;
    name: string;
    description: string;
}

export const AVAILABLE_SUBJECTS: Subject[] = [
    { id: "MAT", name: "Matemáticas", description: "Matemáticas generales y cálculo" },
    { id: "LEN", name: "Lengua", description: "Lengua castellana y literatura" },
    { id: "ING", name: "Inglés", description: "Inglés como lengua extranjera" },
    { id: "FIS", name: "Física", description: "Física y fenómenos naturales" },
    { id: "QUI", name: "Química", description: "Química general y orgánica" },
    { id: "BIO", name: "Biología", description: "Biología y ciencias naturales" },
    { id: "HIS", name: "Historia", description: "Historia universal y de España" },
    { id: "GEO", name: "Geografía", description: "Geografía física y política" },
    { id: "ART", name: "Arte", description: "Historia del arte y expresión artística" },
    { id: "MUS", name: "Música", description: "Educación musical y teoría" },
    { id: "EFI", name: "Educación Física", description: "Educación física y deportes" },
    { id: "TEC", name: "Tecnología", description: "Tecnología e informática" }
];