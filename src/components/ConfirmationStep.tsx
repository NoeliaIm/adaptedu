import { CheckCircle2, FileWarning, Upload } from 'lucide-react';
import { AVAILABLE_SUBJECTS } from '../types/subjects';

interface ConfirmationStepProps {
    uploadProgress: number;
    uploadStatus: 'idle' | 'uploading' | 'success' | 'error';
    selectedSubject: string;
}

function ConfirmationStep({
                              uploadProgress,
                              uploadStatus,
                              selectedSubject,
                          }: ConfirmationStepProps) {
    const subject = AVAILABLE_SUBJECTS.find(s => s.id === selectedSubject);

    return (
        <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                {uploadStatus === 'success'
                    ? '¡Archivo subido con éxito!'
                    : uploadStatus === 'error'
                        ? 'Error al subir el archivo'
                        : `Se subirá el archivo a la carpeta de la asignatura de ${subject?.name}`}
            </h2>

            <div className="mb-8">
                {uploadStatus === 'uploading' && (
                    <>
                        <div className="flex justify-center mb-4">
                            <Upload className="w-16 h-16 text-blue-500 animate-bounce" />
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
                            <div
                                className="bg-blue-500 h-4 rounded-full transition-all duration-300"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                        <p className="text-gray-600">Subiendo... {uploadProgress}%</p>
                    </>
                )}

                {uploadStatus === 'success' && (
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                        </div>
                        <p className="text-gray-600">
                            Tu archivo se ha subido correctamente al servidor
                            {subject && (
                                <span className="block mt-2 font-medium">
                  Asignatura: {subject.name}
                </span>
                            )}
                        </p>
                    </div>
                )}

                {uploadStatus === 'error' && (
                    <div className="text-center">
                        <div className="flex justify-center mb-4">
                            <FileWarning className="w-16 h-16 text-red-500" />
                        </div>
                        <p className="text-red-600">
                            Ha ocurrido un error al subir el archivo. Por favor, inténtalo de
                            nuevo.
                        </p>
                    </div>
                )}
            </div>

            {uploadStatus === 'success' && (
                <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-800">
                        ✨ ¡Listo! Tu archivo está disponible en el servidor. Puedes subir
                        otro archivo cuando lo necesites.
                    </p>
                </div>
            )}
        </div>
    );
}

export default ConfirmationStep;