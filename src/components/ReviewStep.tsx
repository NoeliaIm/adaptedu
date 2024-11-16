import { FileText, Calendar, HardDrive } from 'lucide-react';

interface ReviewStepProps {
    selectedFile: File | null;
}

function ReviewStep({ selectedFile }: ReviewStepProps) {
    if (!selectedFile) return null;

    // @ts-ignore
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
                                    minute: '2-digit'
                                })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                    ℹ️ Verifica que la información sea correcta antes de continuar.
                    Una vez iniciada la subida, no podrás cancelar el proceso.
                </p>
            </div>
        </div>
    );
}

export default ReviewStep;