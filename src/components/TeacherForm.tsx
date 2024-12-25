import React, {useState} from 'react';
import { PlusCircle, MinusCircle, GraduationCap, Save, X } from 'lucide-react';
import { TeacherForm, Subject } from '../types';
import {useSubjects} from "../hooks/useSubjects.ts";

interface TeacherFormProps {
    formData: TeacherForm;
    onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubjectChange: (id: number | undefined, subject: Subject) => void;
    onAddSubject: () => void;
    onRemoveSubject: (id: number) => void;
    onSubmit: (e: React.FormEvent) => void;
    isFormValid: () => boolean;
    submitted: boolean;
}

export default function TeacherFormComponent({
                                                 formData,
                                                 onInputChange,
                                                 onSubjectChange,
                                                 onAddSubject,
                                                 onRemoveSubject,
                                                 onSubmit,
                                                 isFormValid,
                                                 submitted,
                                             }: TeacherFormProps) {
    const [showSummary, setShowSummary] = useState(true);
    const { subjects, loading, error } = useSubjects();

    const getAvailableSubjects = () => {
        return subjects.filter(
            (subject) => !formData.subjects.some((s) => s.idAsignatura === subject.idAsignatura)
        );
    };

    if (loading) {
        return <p>Cargando asignaturas...</p>;
    }

    if (error) {
        return <p>Error al cargar asignaturas. Por favor, inténtalo de nuevo.</p>;
    }
    return (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-8">
                <GraduationCap className="w-8 h-8 text-indigo-600" />
                <h1 className="text-3xl font-bold text-gray-900">Registro de Profesor</h1>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={onInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                border p-2 transition duration-150 ease-in-out"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                            Apellidos
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={onInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                border p-2 transition duration-150 ease-in-out"
                            required
                        />
                    </div>
                </div>

                {/*div para email*/}

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={onInputChange}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                border p-2 transition duration-150 ease-in-out"
                            required
                        />
                    </div>

                </div>


                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="block text-sm font-medium text-gray-700">
                            Asignaturas
                        </label>
                        <button
                            type="button"
                            onClick={onAddSubject}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={getAvailableSubjects().length === 0}
                        >
                            <PlusCircle className="w-4 h-4 mr-1" />
                            Añadir Asignatura
                        </button>
                    </div>

                    {formData.subjects.map((subject) => (
                        <div key={subject.idAsignatura} className="flex items-center gap-2">
                            <select
                                value={subject.idAsignatura}
                                onChange={(e) => {
                                    const selectedSubject = subjects.find(s => s.idAsignatura === parseInt(e.target.value));
                                    if (selectedSubject) {
                                        onSubjectChange(subject.idAsignatura, selectedSubject);
                                    }
                                }}
                                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                  border p-2 transition duration-150 ease-in-out"
                                required
                            >
                                <option value={subject.idAsignatura}>{subject.nombreAsignatura} - {subject.descripcion}</option>
                                {getAvailableSubjects().map((availableSubject) => (
                                    <option key={availableSubject.idAsignatura} value={availableSubject.idAsignatura}>
                                        {availableSubject.nombreAsignatura} - {availableSubject.descripcion}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={() => subject.idAsignatura !== undefined && onRemoveSubject(subject.idAsignatura)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                disabled={formData.subjects.length === 1}
                            >
                                <MinusCircle className="w-5 h-5" />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={!isFormValid()}
                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                    >
                        <Save className="w-4 h-4 mr-2" />
                        Guardar Profesor
                    </button>
                </div>
            </form>

            {submitted && showSummary && (
                <div className="mt-6 p-4 bg-green-50 rounded-md relative">
                    <button
                        onClick={() => setShowSummary(false)}
                        className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="w-4 h-4" />
                    </button>
                    <h2 className="text-lg font-semibold text-green-800 mb-2">Datos Registrados:</h2>
                    <p><strong>Nombre:</strong> {formData.firstName}</p>
                    <p><strong>Apellidos:</strong> {formData.lastName}</p>
                    <p><strong>Email:</strong> {formData.email}</p>
                    <p><strong>Asignaturas:</strong></p>
                    <ul className="list-disc list-inside ml-4">
                        {formData.subjects.map((subject) => (
                            <li key={subject.idAsignatura}>{subject.nombreAsignatura} - {subject.descripcion}</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}