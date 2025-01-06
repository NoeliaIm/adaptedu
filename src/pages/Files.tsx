import React, { useState } from 'react';
import { Search, Trash2, AlertCircle } from 'lucide-react';
import FileUploadStep from '../components/FileUploadStep';
import ReviewStep from '../components/ReviewStep';
import ConfirmationStep from '../components/ConfirmationStep';
import {Subject} from "../types";
import { useSubjects } from "../hooks/useSubjects.ts";
import axios from "axios";

interface FileRecord {
    id: string;
    name: string;
    subject: Subject;
    uploadDate: Date;
    size: number;
}

// Mock data for demonstration
const mockFiles: FileRecord[] = [
    {
        id: '1',
        name: 'Examen_Matematicas_1T.pdf',
        subject: {
            idAsignatura: 1,
            nombreAsignatura: 'Matemáticas',
            nombreCurso: '1º ESO',
            descripcion: 'Matemáticas generales y cálculo',
            acron: 'MAT',
            idCurso: 1
        },
        uploadDate: new Date('2024-03-15'),
        size: 1500000,
    },
    {
        id: '2',
        name: 'Trabajo_Literatura.docx',
        subject: {
            idAsignatura: 2,
            nombreAsignatura: 'Lengua',
            nombreCurso: '1º ESO',
            descripcion: 'Lengua castellana y literatura',
            acron: 'LEN',
            idCurso: 1
        },
        uploadDate: new Date('2024-03-14'),
        size: 2500000,
    },
];

function Files() {
    const [showUpload, setShowUpload] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
    const [files, setFiles] = useState<FileRecord[]>(mockFiles);
    const [filters, setFilters] = useState({ name: '', subject: '' });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
    const { subjects, loadingSubjects, errorSubjects } = useSubjects();

    const handleFileSelect = (file: File | null) => {
        setSelectedFile(file);
    };

    const getAvailableSubjects = () => {
        return subjects;
    };

    if (loadingSubjects) {
        return <p>Cargando asignaturas...</p>;
    }
    if (errorSubjects) {
        return <p>Error al cargar asignaturas. Por favor, inténtalo de nuevo.</p>;
    }

    const handleNext = () => {
        if (currentStep === 3) {
            uploadFile();
        } else {
            setCurrentStep((prev) => Math.min(prev + 1, 3));
        }
    };

    const handleBack = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const uploadFile = async () => {
        if (!selectedFile || !selectedSubject) return;
        setUploadStatus('uploading');
        setUploadProgress(0);

        const formData = new FormData();
        formData.append('file', selectedFile, selectedFile.name);
        formData.append('subjectId', selectedSubject);

        const token = localStorage.getItem('authToken');


        try {
            const response = await axios.post('http://localhost:8080/api/edu-assistant/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                onUploadProgress: (progressEvent) => {
                    const progress = Math.round(
                        (progressEvent.loaded * 100) / (progressEvent.total ?? 100)
                    );
                    setUploadProgress(progress);
                }
            });

            if (response.status === 200) {
                setUploadStatus('success');
            }

        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus('error');
        }
    };

    const handleReset = () => {
        setCurrentStep(1);
        setSelectedFile(null);
        setSelectedSubject('');
        setUploadProgress(0);
        setUploadStatus('idle');
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const filteredFiles = files.filter(file => {
        const nameMatch = file.name.toLowerCase().includes(filters.name.toLowerCase());
        const subjectMatch = !filters.subject || file.subject.idAsignatura === parseInt(filters.subject);
        return nameMatch && subjectMatch;
    });

    const handleDelete = (fileId: string) => {
        setFiles(prev => prev.filter(file => file.id !== fileId));
        setShowDeleteConfirm(null);
    };

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Gestión de Archivos</h1>
                    <button
                        onClick={() => setShowUpload(!showUpload)}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                        {showUpload ? 'Ver archivos' : 'Subir archivo'}
                    </button>
                </div>

                {showUpload ? (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="max-w-2xl mx-auto">
                            {/* Progress Steps */}
                            <div className="flex justify-between mb-8 relative">
                                <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 z-0" />
                                <div
                                    className="absolute top-1/2 left-0 right-0 h-1 bg-blue-500 -translate-y-1/2 z-0"
                                    style={{ width: `${((currentStep - 1) / 2) * 100}%` }}
                                />
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="relative z-10 flex flex-col items-center">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                                step <= currentStep ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-500'
                                            }`}
                                        >
                                            {step}
                                        </div>
                                        <span className={`mt-2 text-sm ${step <= currentStep ? 'text-blue-500' : 'text-gray-500'}`}>
                      {step === 1 ? 'Selección' : step === 2 ? 'Revisión' : 'Confirmación'}
                    </span>
                                    </div>
                                ))}
                            </div>

                            {currentStep === 1 && (
                                <FileUploadStep onFileSelect={handleFileSelect} selectedFile={selectedFile} />
                            )}
                            {currentStep === 2 && (
                                <ReviewStep
                                    selectedFile={selectedFile}
                                    selectedSubject={selectedSubject}
                                    onSubjectChange={setSelectedSubject}
                                />
                            )}
                            {currentStep === 3 && (
                                <ConfirmationStep
                                    uploadProgress={uploadProgress}
                                    uploadStatus={uploadStatus}
                                    selectedSubject={selectedSubject}
                                />
                            )}

                            <div className="flex justify-between mt-6">
                                {currentStep > 1 && uploadStatus !== 'success' && (
                                    <button
                                        onClick={handleBack}
                                        className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                    >
                                        Atrás
                                    </button>
                                )}
                                {uploadStatus === 'success' ? (
                                    <button
                                        onClick={handleReset}
                                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ml-auto"
                                    >
                                        Subir otro archivo
                                    </button>
                                ) : (
                                    <button
                                        onClick={handleNext}
                                        disabled={!selectedFile || (currentStep === 2 && !selectedSubject)}
                                        className={`px-4 py-2 rounded-md ml-auto ${
                                            !selectedFile || (currentStep === 2 && !selectedSubject) || (currentStep === 3 && uploadStatus === 'uploading')
                                                ? 'bg-gray-300 cursor-not-allowed'
                                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                                        }`}
                                    >
                                        {currentStep === 3 ? 'Subir archivo' : 'Siguiente'}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="mb-6 grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Buscar por nombre
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={filters.name}
                                    onChange={handleFilterChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="Nombre del archivo..."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Filtrar por asignatura
                                </label>
                                <select
                                    name="subject"
                                    value={filters.subject}
                                    onChange={handleFilterChange}
                                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    <option value="">Todas las asignaturas</option>
                                    {getAvailableSubjects().map((availableSubject) => (
                                        <option key={availableSubject.idAsignatura} value={availableSubject.idAsignatura}>
                                            {availableSubject.nombreAsignatura} - {availableSubject.descripcion}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {filteredFiles.length > 0 ? (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Nombre
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Asignatura
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Fecha
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tamaño
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Acciones
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredFiles.map((file) => (
                                        <tr key={file.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {file.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {file.subject.nombreAsignatura}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {file.uploadDate.toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {(file.size / 1024 / 1024).toFixed(2)} MB
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <button
                                                    onClick={() => setShowDeleteConfirm(file.id)}
                                                    className="text-red-600 hover:text-red-900"
                                                    title="Eliminar archivo"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <Search className="mx-auto h-12 w-12 text-gray-400" />
                                <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron archivos</h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Comienza subiendo algunos archivos o ajusta los filtros de búsqueda.
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {showDeleteConfirm && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg max-w-md w-full p-6">
                            <div className="flex items-center mb-4">
                                <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
                                <h3 className="text-lg font-medium text-gray-900">Confirmar eliminación</h3>
                            </div>
                            <p className="text-sm text-gray-500 mb-4">
                                ¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer.
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowDeleteConfirm(null)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-500"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => handleDelete(showDeleteConfirm)}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Files;