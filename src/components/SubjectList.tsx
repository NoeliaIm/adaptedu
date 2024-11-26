import React, { useState } from 'react';
import { PlusCircle, Pencil, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Subject } from '../types';
import { AVAILABLE_SUBJECTS } from '../types/subjects';

export default function SubjectList() {
    const navigate = useNavigate();
    const [filters, setFilters] = useState({
        name: '',
        description: ''
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredSubjects = AVAILABLE_SUBJECTS.filter(subject => {
        const nameMatch = subject.name.toLowerCase().includes(filters.name.toLowerCase());
        const descriptionMatch = subject.description.toLowerCase().includes(filters.description.toLowerCase());
        return nameMatch && descriptionMatch;
    });

    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Asignaturas</h2>
                <button
                    onClick={() => navigate('/subject/new')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Añadir Asignatura
                </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-6">
                <div>
                    <label htmlFor="searchName" className="block text-sm font-medium text-gray-700">
                        Nombre
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="text"
                            name="name"
                            id="searchName"
                            value={filters.name}
                            onChange={handleFilterChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                border p-2 transition duration-150 ease-in-out"
                            placeholder="Buscar por nombre"
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="searchDescription" className="block text-sm font-medium text-gray-700">
                        Descripción
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <input
                            type="text"
                            name="description"
                            id="searchDescription"
                            value={filters.description}
                            onChange={handleFilterChange}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                border p-2 transition duration-150 ease-in-out"
                            placeholder="Buscar por descripción"
                        />
                    </div>
                </div>
            </div>

            {filteredSubjects.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Descripción
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Acciones
                            </th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSubjects.map((subject) => (
                            <tr key={subject.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {subject.id}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {subject.name}
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500">
                                    {subject.description}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <button
                                        onClick={() => navigate(`/subject/${subject.id}`)}
                                        className="text-indigo-600 hover:text-indigo-900 transition-colors"
                                        title="Editar asignatura"
                                    >
                                        <Pencil className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Search className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron asignaturas</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Prueba con diferentes términos de búsqueda o añade una nueva asignatura.
                    </p>
                </div>
            )}
        </div>
    );
}