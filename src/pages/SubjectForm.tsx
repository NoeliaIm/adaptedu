import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import { Subject } from '../types';
import { AVAILABLE_SUBJECTS } from '../types/subjects';

export default function SubjectForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState<Omit<Subject, 'id'>>({
        name: '',
        description: '',
    });

    useEffect(() => {
        if (id) {
            const subject = AVAILABLE_SUBJECTS.find(s => s.id === id);
            if (subject) {
                setFormData({
                    name: subject.name,
                    description: subject.description,
                });
            }
        }
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí iría la lógica para guardar la asignatura
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
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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
                                value={formData.description}
                                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                {id ? 'Guardar cambios' : 'Crear asignatura'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}