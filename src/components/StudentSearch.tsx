import React, { useState } from 'react';
import { Search, UserPlus, PencilIcon, Trash2, Eye, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {Student} from '../types';
import { useSubjects } from "../hooks/useSubjects.ts";
import {useRoleCheck} from "../hooks/useRolCheck.ts";

interface StudentSearchProps {
    filters: {
        name: string;
        lastName: string;
        subject: string;
    };
    onFilterChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    filteredStudents: Student[];
    onAddStudent: () => void;
    onEditStudent: (student: Student) => void;
    deleteStudent: (id: number) => Promise<void>;
}

export default function StudentSearch({
                                          filters,
                                          onFilterChange,
                                          filteredStudents,
                                          onAddStudent,
                                          onEditStudent,
                                          deleteStudent
                                      }: StudentSearchProps) {
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
    const { subjects, loadingSubjects, errorSubjects } = useSubjects();
    const { hasRole } = useRoleCheck();

    const getAvailableSubjects = () => {
        return subjects;
    };

    const handleDelete = async (studentId: number) => {
        console.log('Deleting student:', studentId);
        await deleteStudent(studentId);
        setShowDeleteConfirm(null);
    };

    if (loadingSubjects) {
        return <p>Cargando datos...</p>;
    }

    if (errorSubjects) {
        return <p>Error al cargar los datos. Por favor, inténtalo de nuevo.</p>;
    }
    return (
        <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Búsqueda de Alumnos</h2>
            {hasRole(['ADMIN']) && (
    <button
    onClick={onAddStudent}
    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    >
    <UserPlus className="w-4 h-4 mr-2" />
        Añadir Alumno
    </button>
                )}
    </div>

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
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
    onChange={onFilterChange}
    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
    border p-2 transition duration-150 ease-in-out"
    placeholder="Buscar por nombre"
    />
    </div>
    </div>

    <div>
    <label htmlFor="searchLastName" className="block text-sm font-medium text-gray-700">
        Apellidos
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
    <input
        type="text"
    name="lastName"
    id="searchLastName"
    value={filters.lastName}
    onChange={onFilterChange}
    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
    border p-2 transition duration-150 ease-in-out"
    placeholder="Buscar por apellidos"
    />
    </div>
    </div>

    <div>
    <label htmlFor="searchSubject" className="block text-sm font-medium text-gray-700">
        Asignatura
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
            <select
                name="subject"
                id="searchSubject"
                value={filters.subject}
                onChange={onFilterChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm
                border p-2 transition duration-150 ease-in-out"
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
    </div>

            {filteredStudents.length > 0 ? (
                <div className="overflow-hidden rounded-lg border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Apellidos
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Asignaturas
        </th>
        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
        Acciones
        </th>
        </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
        {filteredStudents.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.firstName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {student.lastName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {student.subjects.map(subject => subject.acron).join(", ")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-3">
                        <button
                            onClick={() => navigate(`/student/${student.id}`)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Ver estadísticas"
                        >
                            <Eye className="w-5 h-5"/>
                        </button>
                        <button
                            onClick={() => onEditStudent(student)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors"
                            title="Editar alumno"
                        >
                            <PencilIcon className="w-5 h-5"/>
                        </button>
                        {hasRole(['ADMIN']) && (
                        <button
                            onClick={() => setShowDeleteConfirm(student.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Eliminar alumno"
                        >
                            <Trash2 className="w-5 h-5"/>
                        </button>
                        )}
                    </div>
                </td>
            </tr>
        ))}
        </tbody>
                    </table>
                </div>
            ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Search className="mx-auto h-12 w-12 text-gray-400"/>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No se encontraron alumnos</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        Prueba con diferentes términos de búsqueda o añade un nuevo alumno.
                    </p>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <div className="flex items-center mb-4">
                            <AlertCircle className="w-6 h-6 text-red-600 mr-2" />
                            <h3 className="text-lg font-medium text-gray-900">Confirmar eliminación</h3>
                        </div>
                        <p className="text-sm text-gray-500 mb-4">
                            ¿Estás seguro de que deseas eliminar este alumno? Esta acción no se puede deshacer y se perderán todos los datos asociados, incluyendo su historial académico y registros de actividad.
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
    );
}