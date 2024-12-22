import { FileText, Calendar, HardDrive } from 'lucide-react';
import { useSubjects } from "../hooks/useSubjects.ts";

interface ReviewStepProps {
    selectedFile: File | null;
    selectedSubject: string;
    onSubjectChange: (subjectId: string) => void;
}

function ReviewStep({ selectedFile, selectedSubject, onSubjectChange }: ReviewStepProps) {
    const { subjects, loading, error } = useSubjects();

    if (!selectedFile) return null;

    const getAvailableSubjects = () => {
        return subjects;
    };

    if (loading) {
        return <p>Cargando asignaturas...</p>;
    }

    if (error) {
        return <p>Error al cargar asignaturas. Por favor, inténtalo de nuevo.</p>;
    }
    return (
        <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Revisa tu archivo
            </h2>

            <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid gap-6">
                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FileText className="w-6 h-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Nombre del archivo</p>
                            <p className="text-gray-600">{selectedFile.name}</p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <HardDrive className="w-6 h-6 text-green-500" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Tamaño</p>
                            <p className="text-gray-600">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start space-x-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Calendar className="w-6 h-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="font-medium text-gray-800">Última modificación</p>
                            <p className="text-gray-600">
                                {selectedFile.lastModifiedDate?.toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="block font-medium text-gray-800">
                            Asignatura
                        </label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => onSubjectChange(e.target.value)}
                            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                            required
                        >
                            <option value="">Selecciona una asignatura</option>
                            {getAvailableSubjects().map((subject) => (
                                <option key={subject.idAsignatura} value={subject.idAsignatura}>
                                    {subject.nombreAsignatura}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                    ℹ️ Verifica que la información sea correcta antes de continuar. Una
                    vez iniciada la subida, no podrás cancelar el proceso.
                </p>
            </div>
        </div>
    );
}

export default ReviewStep;