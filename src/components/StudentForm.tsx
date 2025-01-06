import React, { useState, useEffect } from 'react';
import { Save, Plus, Minus } from 'lucide-react';
import type {Student, NivelIdioma, NivelAmbitoAcademico, Subject} from '../types';
import { useSubjects } from "../hooks/useSubjects.ts";
import { useNivelAmbitoAcademico } from "../hooks/useAcademicLevels.ts";
import { useNivelIdioma } from "../hooks/useLanguageLevels.ts";
import { useNecesidadesEspeciales} from "../hooks/useSpecialNeeds.ts";
import {useRoleCheck} from "../hooks/useRolCheck.ts";


interface StudentFormProps {
    onSubmit: (student: Omit<Student, 'id' | 'idPersona'>) => void;
    onCancel: () => void;
    availableSubjects: Subject[];
    initialData?: Student;
}

const defaultFormData: Omit<Student, 'id' | 'idPersona'> = {
    firstName: '',
    lastName: '',
    email: '',
    recordNumber: 0,
    subjects: [],
    nationality: '',
    languageLevels: [],
    isInternational: false,
    nativeLanguage: '',
    academicLevels: {
        Matemáticas: {  idNivelAcademico: 3, nombreNivelAcademico: 'Medio' },
        Lengua: {  idNivelAcademico: 3, nombreNivelAcademico: 'Medio' },
        Inglés: {  idNivelAcademico: 3, nombreNivelAcademico: 'Medio' } ,
        Historia: {  idNivelAcademico: 3, nombreNivelAcademico: 'Medio' } ,
    },
    specialNeeds:[]
};

export default function StudentForm({
                                        onSubmit,
                                        onCancel,
                                        initialData,
                                    }: StudentFormProps) {
    const [formData, setFormData] = useState<Omit<Student, 'id' | 'idPersona'>>(defaultFormData);
    const { subjects, loadingSubjects: subjectsLoading, errorSubjects: subjectsError } = useSubjects();
    const { nivelesAcademicos, loading: nivelesAcademicosLoading, error: nivelesAcademicosError } = useNivelAmbitoAcademico();
    const { nivelesIdioma, loading: nivelesIdiomaLoading, error: nivelesIdiomaError } = useNivelIdioma();
    const { necesidadesEspeciales, loading: necesidadesEspecialesLoading, error: necesidadesEspecialesError } = useNecesidadesEspeciales();
    const { hasRole } = useRoleCheck();
    const isReadOnly = !hasRole(['ADMIN']);

    const availableSubjects = () => {
        return subjects.filter(
            (subject) => !formData.subjects.some((s) => s.idAsignatura === subject.idAsignatura)
        );
    };

    // Cargar datos iniciales cuando se edita un estudiante existente
    useEffect(() => {
        if (initialData) {
            const { ...studentData } = initialData;
            setFormData(studentData);
        }
    }, [initialData]);

    if (subjectsLoading || nivelesAcademicosLoading || nivelesIdiomaLoading || necesidadesEspecialesLoading) {
        return <p>Cargando datos...</p>;
    }

    if (subjectsError || nivelesAcademicosError || nivelesIdiomaError || necesidadesEspecialesError) {
        return <p>Error al cargar los datos. Por favor, inténtalo de nuevo.</p>;
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
                subject.idAsignatura === id ? { ...subject, ...newSubject } : subject
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

    const handleLanguageLevelInputChange = (index: number, value: string) => {
        setFormData((prev) => ({
            ...prev,
            languageLevels: prev.languageLevels.map((lang, i) =>
                i === index ? { ...lang, idioma: { ...lang.idioma, nombreIdioma: value.toString() } } : lang
            ),
        }));
    };

    const handleLanguageLevelChange = (index: number, value: number) => {
        setFormData((prev) => ({
            ...prev,
            languageLevels: prev.languageLevels.map((lang, i) =>
                i === index ? { ...lang, nivelIdioma: nivelesIdioma.find((level) => level.idNivelIdioma === value) || lang.nivelIdioma } : lang
            ),
        }));
    };

    const addLanguage = () => {
        // Validamos que existan niveles cargados
        if (!nivelesIdioma || nivelesIdioma.length === 0) {
            alert('No hay niveles de idioma disponibles para añadir.');
            return;
        }

        // Validamos que no haya un idioma sin completar
        const hasEmptyLanguage = formData.languageLevels.some(
            (item) => !item.idioma.nombreIdioma.trim()
        );

        if (hasEmptyLanguage) {
            alert('Por favor, completa el idioma pendiente antes de añadir uno nuevo.');
            return;
        }

 // Añadimos un nuevo idioma con el primer nivel disponible
setFormData((prev) => ({
    ...prev,
    languageLevels: [
        ...prev.languageLevels,
        {
            idioma: { idIdioma: 0, nombreIdioma: '' },
            nivelIdioma: { idNivelIdioma: nivelesIdioma[0].idNivelIdioma, nombreNivelIdioma: nivelesIdioma[0].nombreNivelIdioma },
            nativo: false
        },
    ],
}));
    };

    const removeLanguage = (index: number) => {
        setFormData((prev) => ({
            ...prev,
            languageLevels: prev.languageLevels.filter((_, i) => i !== index),
        }));
    };

    const handleAcademicLevelChange =(field: keyof typeof formData.academicLevels, value: number) => {
        setFormData((prev) => ({
            ...prev,
            academicLevels: {
                ...prev.academicLevels,
                [field]: nivelesAcademicos.find((level) => level.idNivelAcademico === value) || prev.academicLevels[field],
            },
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.subjects.length === 0) {
            alert('Debe añadir al menos una asignatura.');
            return;
        }
        onSubmit(formData);
    };

    const handleSpecialNeedChange = (id: number) => {
        setFormData((prev) => {
            const exists = prev.specialNeeds.some((need) => need.idNecesidadEspecial === id);
            return {
                ...prev,
                specialNeeds: exists
                    ? prev.specialNeeds.filter((need) => need.idNecesidadEspecial !== id)
                    : [...prev.specialNeeds, necesidadesEspeciales.find((need) => need.idNecesidadEspecial === id)!],
            };
        });
    };

    function handleInputInternational() {
        setFormData((prev) => ({
            ...prev,
            isInternational: !prev.isInternational,
        }));
        if(!formData.isInternational && formData.nationality === "España") {
            formData.nationality = "";
        }
    }

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
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </label>
                            <input
                                type="email"
                                pattern="^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$"
                                id="email"
                                name="email"
                                required
                                value={formData.email}
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
                                value={formData.recordNumber != 0 ? formData.recordNumber : ''}
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
                                        <option
                                            value={subject.idAsignatura}>{subject.nombreAsignatura} - {subject.descripcion}</option>
                                        {getAvailableSubjects().map((availableSubject) => (
                                            <option key={availableSubject.idAsignatura}
                                                    value={availableSubject.idAsignatura}>
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
                                onChange={handleInputInternational}
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
                                        value={lang.idioma.nombreIdioma}
                                        onChange={(e) => handleLanguageLevelInputChange(index, e.target.value)}
                                        placeholder="Idioma"
                                        className="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                    />
                                    <select
                                        value={lang.nivelIdioma.idNivelIdioma}
                                        onChange={(e) => handleLanguageLevelChange(index,
                                            parseInt(e.target.value))}
                                        className="rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {nivelesIdioma.map((level: NivelIdioma) => (
                                            <option key={level.idNivelIdioma} value={level.idNivelIdioma}>
                                                {level.nombreNivelIdioma}
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
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            {necesidadesEspeciales.map((need) => (
                                <label key={need.idNecesidadEspecial} className="inline-flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={formData.specialNeeds.some((sn) => sn.idNecesidadEspecial === need.idNecesidadEspecial)}
                                        onChange={() => handleSpecialNeedChange(need.idNecesidadEspecial)}
                                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">{need.nombreNecesidadEspecial}</span>
                                </label>
                            ))}
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
                                        value={level.idNivelAcademico}
                                        onChange={(e) =>
                                            handleAcademicLevelChange(
                                                subject as keyof Student['academicLevels'],
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:ring-indigo-500"
                                    >
                                        {nivelesAcademicos.map((nivel: NivelAmbitoAcademico) => (
                                            <option key={nivel.idNivelAcademico} value={nivel.idNivelAcademico}>
                                                {nivel.nombreNivelAcademico}
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