import React, { useRef } from 'react';
import { Upload, File, X } from 'lucide-react';

interface FileUploadStepProps {
    onFileSelect: (file: File | null) => void;
    selectedFile: File | null;
}

function FileUploadStep({ onFileSelect, selectedFile }: FileUploadStepProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const files = e.dataTransfer.files;
        if (files.length > 0) {
            onFileSelect(files[0]);
        }
    };

    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            onFileSelect(files[0]);
        }
    };

    const handleRemoveFile = () => {
        onFileSelect(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Selecciona tu archivo
            </h2>

            <div
                onClick={() => !selectedFile && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-8 mb-4 ${
                    selectedFile
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-blue-500 cursor-pointer'
                } transition-colors duration-200`}
            >
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileInput}
                    className="hidden"
                />

                {selectedFile ? (
                    <div className="flex items-center justify-center space-x-3 relative">
                        <File className="w-8 h-8 text-blue-500"/>
                        <div className="text-left">
                            <p className="font-medium text-gray-800">{selectedFile.name}</p>
                            <p className="text-sm text-gray-500">
                                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                        </div>
                        <button
                            onClick={handleRemoveFile}
                            className="absolute -top-2 -right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                        >
                            <X className="w-4 h-4 text-gray-500"/>
                        </button>
                    </div>
                ) : (
                    <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4"/>
                        <p className="text-gray-600 mb-2">
                            Arrastra y suelta tu archivo aquí o
                        </p>
                        <button className="text-blue-500 hover:text-blue-600 font-medium">
                            selecciona un archivo
                        </button>
                    </div>
                )}
            </div>

            <p className="text-sm text-gray-500">
                Formatos soportados: PDF, DOC, DOCX, XLS, XLSX
                <br/>
                Tamaño máximo: 10MB
            </p>
        </div>
    );
}

export default FileUploadStep;