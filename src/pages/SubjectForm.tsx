import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { Subject } from '../types';
import { useSubjects } from "../hooks/useSubjects.ts";
import { useCourses } from "../hooks/useCourses.ts";

export default function SubjectForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { subjects, loading, error } = useSubjects();
    const { courses } = useCourses();
    const [formData, setFormData] = useState<Omit<Subject, 'id'>>({
        nombreAsignatura: '',
        descripcion: '',
        nombreCurso: '',
        acron: '',
    });

    const getAvailableCourses = () => {
        return courses;
    };

    useEffect(() => {
        if (id && subjects.length > 0) {
            const subject = subjects.find(s => s.idAsignatura === Number(id));
            if (subject) {
                setFormData({
                    nombreAsignatura: subject.nombreAsignatura,
                    descripcion: subject.descripcion,
                    nombreCurso: subject.nombreCurso.toString(),
                    acron: subject.acron,
                });
            }
        }
    }, [id, subjects]);

    if (loading) {
        return <p>Cargando asignaturas...</p>;
    }

    if (error) {
        return <p>Error al cargar asignaturas: {error.message}</p>;
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // TODO llamada para guardar la asignatura
        console.log('Saving subject:', { id, ...formData });
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">
                        {id ? 'Editar Asignatura' : 'Nueva Asignatura'}
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
                    <div className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Nombre de la asignatura
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.nombreAsignatura}
                                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Acrónimo de la asignatura
                            </label>
                            <input
                                type="text"
                                id="acron"
                                name="acron"
                                value={formData.acron}
                                onChange={(e) => setFormData(prev => ({...prev, name: e.target.value}))}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Descripción
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                rows={4}
                                value={formData.descripcion}
                                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="course" className="block text-sm font-medium text-gray-700">
                                Curso
                            </label>
                            <select
                                id="course"
                                name="course"
                                value={formData.nombreCurso}
                                onChange={(e) => setFormData(prev => ({...prev, course: e.target.value}))}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                required
                            >
                                <option value="">Selecciona un curso</option>
                                {getAvailableCourses().map((course) => (
                                    <option key={course.idCurso} value={course.idCurso}>
                                        {course.nombreCurso}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Save className="w-4 h-4 mr-2"/>
                                {id ? 'Guardar cambios' : 'Crear asignatura'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}