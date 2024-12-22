import React, { useState, useEffect } from 'react';
import { Save, Plus, Minus } from 'lucide-react';
import type {Student, LanguageLevel, AcademicLevel, Subject} from '../types';
import { useSubjects } from "../hooks/useSubjects.ts";

const LANGUAGE_LEVELS: LanguageLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const ACADEMIC_LEVELS: AcademicLevel[] = ['Bajo', 'Medio-Bajo', 'Medio', 'Medio-Alto', 'Alto'];

interface StudentFormProps {
    onSubmit: (student: Omit<Student, 'id'>) => void;
    onCancel: () => void;
    availableSubjects: Subject[];
    initialData?: Student;
}

const defaultFormData: Omit<Student, 'id'> = {
    firstName: '',
    lastName: '',
    recordNumber: '',
    subjects: [],
    isInternational: false,
    nationality: '',
    nativeLanguage: '',
    languageLevels: [],
    hasASD: false,
    academicLevels: {
        mathematics: 'Medio',
        literature: 'Medio',
        english: 'Medio',
        history: 'Medio',
    },
    specialNeeds: {
        adhd: false,
        highAbilities: false,
        pas: false,
    },
};

export default function StudentForm({
                                        onSubmit,
                                        onCancel,
                                        initialData,
                                    }: StudentFormProps) {
    const [formData, setFormData] = useState<Omit<Student, 'id'>>(defaultFormData);
    const { subjects, loading, error } = useSubjects();

    const availableSubjects = () => {
        return subjects.filter(
            (subject) => !formData.subjects.some((s) => s.idAsignatura === subject.idAsignatura)
        );
    };

    // Cargar datos iniciales cuando se edita un estudiante existente
    useEffect(() => {
        if (initialData) {
            const { id, ...studentData } = initialData;
            setFormData(studentData);
        }
    }, [initialData]);

    if (loading) {
        return <p>Cargando asignaturas...</p>;
    }

    if (error) {
        return <p>Error al cargar asignaturas. Por favor, inténtalo de nuevo.</p>;
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target as HTMLInputElement;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleSubjectAdd = () => {
        const availableSubjectsList = availableSubjects();
        if (availableSubjectsList.length > 0) {
            setFormData((prev) => ({
                ...prev,
                subjects: [...prev.subjects, availableSubjectsList[0]],
            }));
        }
    };

    const handleSubjectChange = (id: number | undefined, newSubject: Subject) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.map((subject) =>
                subject.idAsignatura === id ? newSubject : subject
            ),
        }));
    };
    const removeSubject = (id: number | undefined) => {
        setFormData((prev) => ({
            ...prev,
            subjects: prev.subjects.filter((subject) => subject.idAsignatura !== id),
        }));
    };

    const getAvailableSubjects = () => {
        return subjects.filter(
            (subject) => !formData.subjects.some((s) => s.idAsignatura === subject.idAsignatura)
        );
    };

    const handleLanguageLevelChange = (index: number, field: 'language' | 'level', value: string) => {
        setFormData((prev) => ({
            ...prev,
            languageLevels: prev.languageLevels.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            ),
        }));
    };

    const addLanguage = () => {
        setFormData((prev) => ({
            ...prev,
            languageLevels: [...prev.languageLevels, { language: '', level: 'A1' }],
        }));
    };

    const removeLanguage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            languageLevels: prev.languageLevels.filter((_, i) => i !== index),
        }));
    };

    const handleAcademicLevelChange = (subject: keyof Student['academicLevels'], level: AcademicLevel) => {
        setFormData((prev) => ({
            ...prev,
            academicLevels: {
                ...prev.academicLevels,
                [subject]: level,
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Datos del Alumno</h2>

                {/* Basic Information */}
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            required
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
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
                            required
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="recordNumber" className="block text-sm font-medium text-gray-700">
                            Número de Expediente
                        </label>
                        <input
                            type="text"
                            id="recordNumber"
                            name="recordNumber"
                            required
                            value={formData.recordNumber}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Subjects */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Asignaturas</h3>
                        <button
                            type="button"
                            onClick={handleSubjectAdd}
                            disabled={getAvailableSubjects().length === 0}
                            className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Plus className="w-4 h-4 mr-1"/>
                            Añadir Asignatura
                        </button>
                    </div>
                    <div className="space-y-3">
                        {formData.subjects.map((subject) => (
                            <div key={subject.idAsignatura} className="flex gap-4 items-center">
                                <select
                                    value={subject.idAsignatura}
                                    onChange={(e) => {
                                        const selectedSubject = subjects.find(s => s.idAsignatura === parseInt(e.target.value));
                                        if (selectedSubject) {
                                            handleSubjectChange(subject.idAsignatura, selectedSubject);
                                        }
                                    }}
                                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                  border p-2 transition duration-150 ease-in-out"
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
                                    onClick={() => subject.idAsignatura !== undefined && removeSubject(subject.idAsignatura)}
                                    className="p-2 text-gray-400 hover:text-red-500"
                                >
                                    <Minus className="w-5 h-5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* International Student */}
                <div className="space-y-4">
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="isInternational"
                            name="isInternational"
                            checked={formData.isInternational}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="isInternational" className="ml-2 text-sm font-medium text-gray-700">
                            Estudiante Extranjero
                        </label>
                    </div>

                    {formData.isInternational && (
                        <div>
                            <label htmlFor="nationality" className="block text-sm font-medium text-gray-700">
                                Nacionalidad
                            </label>
                            <input
                                type="text"
                                id="nationality"
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleInputChange}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                            />
                        </div>
                    )}
                </div>

                {/* Languages */}
                <div className="space-y-4">
                    <div>
                        <label htmlFor="nativeLanguage" className="block text-sm font-medium text-gray-700">
                            Idioma Nativo
                        </label>
                        <input
                            type="text"
                            id="nativeLanguage"
                            name="nativeLanguage"
                            required
                            value={formData.nativeLanguage}
                            onChange={handleInputChange}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-gray-900">Otros Idiomas</h4>
                            <button
                                type="button"
                                onClick={addLanguage}
                                className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
                            >
                                <Plus className="w-4 h-4 mr-1"/>
                                Añadir Idioma
                            </button>
                        </div>

                        {formData.languageLevels.map((lang, index) => (
                            <div key={index} className="flex gap-4 items-center mb-4">
                                <input
                                    type="text"
                                    value={lang.language}
                                    onChange={(e) => handleLanguageLevelChange(index, 'language', e.target.value)}
                                    placeholder="Idioma"
                                    className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                />
                                <select
                                    value={lang.level}
                                    onChange={(e) => handleLanguageLevelChange(index, 'level', e.target.value as LanguageLevel)}
                                    className="rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {LANGUAGE_LEVELS.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => removeLanguage(index)}
                                    className="p-2 text-gray-400 hover:text-red-500"
                                >
                                    <Minus className="w-5 h-5"/>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Special Needs */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Necesidades Especiales</h3>

                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="hasASD"
                            name="hasASD"
                            checked={formData.hasASD}
                            onChange={handleInputChange}
                            className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="hasASD" className="ml-2 text-sm font-medium text-gray-700">
                            TEA
                        </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                name="adhd"
                                checked={formData.specialNeeds.adhd}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        specialNeeds: {...prev.specialNeeds, adhd: e.target.checked},
                                    }))
                                }
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">TDAH</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                name="highAbilities"
                                checked={formData.specialNeeds.highAbilities}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        specialNeeds: {...prev.specialNeeds, highAbilities: e.target.checked},
                                    }))
                                }
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">Altas Capacidades</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="checkbox"
                                name="pas"
                                checked={formData.specialNeeds.pas}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        specialNeeds: {...prev.specialNeeds, pas: e.target.checked},
                                    }))
                                }
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <span className="ml-2 text-sm text-gray-700">PAS</span>
                        </label>
                    </div>
                </div>

                {/* Academic Levels */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">Nivel Académico</h3>

                    {Object.entries(formData.academicLevels).map(([subject, level]) => (
                        <div key={subject} className="grid grid-cols-1 sm:grid-cols-6 gap-4 items-center">
                            <label className="sm:col-span-2 text-sm font-medium text-gray-700 capitalize">
                                {subject}
                            </label>
                            <div className="sm:col-span-4">
                                <select
                                    value={level}
                                    onChange={(e) =>
                                        handleAcademicLevelChange(
                                            subject as keyof Student['academicLevels'],
                                            e.target.value as AcademicLevel
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                >
                                    {ACADEMIC_LEVELS.map((level) => (
                                        <option key={level} value={level}>
                                            {level}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <Save className="w-4 h-4 mr-2"/>
                    Guardar Alumno
                </button>
            </div>
        </form>
    );
}