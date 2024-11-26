import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LineChart, BarChart, Activity, BookOpen,  ArrowLeft } from 'lucide-react';
import { Student } from '../types';
import { mockStudents } from '../mockData';
import { AVAILABLE_SUBJECTS } from '../types/subjects';

// Mock data for analytics
const mockAnalytics = {
    appUsage: [
        { month: 'Enero', visits: 23 },
        { month: 'Febrero', visits: 45 },
        { month: 'Marzo', visits: 32 },
        { month: 'Abril', visits: 67 },
        { month: 'Mayo', visits: 89 },
    ],
    subjectUsage: [
        { subject: 'MAT', queries: 156 },
        { subject: 'LEN', queries: 89 },
        { subject: 'ING', queries: 134 },
        { subject: 'FIS', queries: 45 },
    ],
    grades: [
        { subject: 'MAT', ev1: 7.5, ev2: 8.0, ev3: 8.5 },
        { subject: 'LEN', ev1: 6.5, ev2: 7.0, ev3: 7.5 },
        { subject: 'ING', ev1: 8.0, ev2: 8.5, ev3: 9.0 },
        { subject: 'FIS', ev1: 7.0, ev2: 7.5, ev3: 8.0 },
    ]
};

export default function StudentAnalytics() {
    const { id } = useParams();
    const navigate = useNavigate();
    const student = mockStudents.find(s => s.id === id);

    if (!student) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Estudiante no encontrado</h2>
                    <p className="mt-2 text-gray-600">El estudiante que buscas no existe en el sistema.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-2">
                                {student.firstName} {student.lastName}
                            </h1>
                            <p className="text-gray-600">Expediente: {student.recordNumber}</p>
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2"/>
                            Volver
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* App Usage Analytics */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Uso de la Aplicación</h2>
                            <Activity className="w-5 h-5 text-indigo-600"/>
                        </div>
                        <div className="h-64 flex items-center justify-center">
                            <LineChart className="w-12 h-12 text-gray-400"/>
                            <span className="ml-2 text-gray-500">Gráfico de uso temporal</span>
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-gray-600">
                                Total de visitas: {mockAnalytics.appUsage.reduce((acc, curr) => acc + curr.visits, 0)}
                            </p>
                        </div>
                    </div>

                    {/* Subject Usage */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Consultas por Asignatura</h2>
                            <BookOpen className="w-5 h-5 text-indigo-600"/>
                        </div>
                        <div className="h-64">
                            {mockAnalytics.subjectUsage.map(({subject, queries}) => (
                                <div key={subject} className="mb-4">
                                    <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-600">
                      {AVAILABLE_SUBJECTS.find(s => s.id === subject)?.name}
                    </span>
                                        <span className="text-sm text-gray-500">{queries} consultas</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-indigo-600 h-2 rounded-full"
                                            style={{
                                                width: `${(queries / Math.max(...mockAnalytics.subjectUsage.map(s => s.queries))) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Academic Progress */}
                    <div className="bg-white rounded-lg shadow-sm p-6 md:col-span-2">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Evolución Académica</h2>
                            <BarChart className="w-5 h-5 text-indigo-600"/>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Asignatura
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        1ª Evaluación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        2ª Evaluación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        3ª Evaluación
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Evolución
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {mockAnalytics.grades.map((grade) => (
                                    <tr key={grade.subject}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {AVAILABLE_SUBJECTS.find(s => s.id === grade.subject)?.name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {grade.ev1}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {grade.ev2}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {grade.ev3}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            grade.ev3 > grade.ev1
                                ? 'bg-green-100 text-green-800'
                                : grade.ev3 < grade.ev1
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {grade.ev3 > grade.ev1 ? '↑' : grade.ev3 < grade.ev1 ? '↓' : '→'}
                            {Math.abs(grade.ev3 - grade.ev1).toFixed(1)} puntos
                        </span>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}