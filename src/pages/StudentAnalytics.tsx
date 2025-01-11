import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { BarChart, BookOpen,  ArrowLeft } from 'lucide-react';
import { useStudentAnalytics } from '../hooks/useStudentAnalytics';
import AppUsageAnalytics from "../components/AppUsageAnalytics.tsx";

export default function StudentAnalytics() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const student = location.state?.studentData;

    const {
        evolucionAcademica,
        loadingStudentAnalytics,
        errorStudentAnalytics
    } = useStudentAnalytics({
        idAlumno: Number(id)
    });

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

    if (!evolucionAcademica || evolucionAcademica.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">No hay datos disponibles</h2>
                    <p className="mt-2 text-gray-600">No se encontraron datos académicos para este estudiante.</p>
                </div>
            </div>
        );
    }

    if (loadingStudentAnalytics) {
        return <p>Cargando datos...</p>;
    }

    if (errorStudentAnalytics)  {
        return <p>Error al cargar los datos. Por favor, inténtalo de nuevo.</p>;
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
                    <AppUsageAnalytics evolucionAcademica={evolucionAcademica} />

                    {/* Subject Usage */}
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-gray-900">Consultas por Asignatura</h2>
                            <BookOpen className="w-5 h-5 text-indigo-600"/>
                        </div>
                        <div className="h-64">
                            {evolucionAcademica.map((evolucion) => {
                                const maxConsultas = Math.max(...evolucionAcademica.map(e => e.consultasPorAsignatura || 0));
                                return (
                                    <div key={evolucion.asignatura} className="mb-4">
                                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium text-gray-600">
                                {evolucion.asignatura}
                            </span>
                                            <span className="text-sm text-gray-500">
                                {evolucion.consultasPorAsignatura || 0} consultas
                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-indigo-600 h-2 rounded-full"
                                                style={{
                                                    width: maxConsultas === 0 ? '0%' :
                                                        `${((evolucion.consultasPorAsignatura || 0) / maxConsultas) * 100}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
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
                                    {/* Obtener todos los años únicos de todas las asignaturas */}
                                    {Array.from(new Set(
                                        evolucionAcademica.flatMap(ea => Object.keys(ea.calificacionesPorAnio))
                                    )).sort().map((anio) => (
                                        <th key={anio}
                                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            {anio}
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Evolución
                                    </th>
                                </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                {evolucionAcademica.map((evolucion) => {
                                    const todosLosAnios = Array.from(new Set(
                                        evolucionAcademica.flatMap(ea => Object.keys(ea.calificacionesPorAnio))
                                    )).sort();

                                    // Encontrar la primera y última nota disponible
                                    const notasDisponibles = todosLosAnios
                                        .map(anio => evolucion.calificacionesPorAnio[anio])
                                        .filter(nota => nota !== undefined);
                                    const primeraNota = notasDisponibles[0];
                                    const ultimaNota = notasDisponibles[notasDisponibles.length - 1];
                                    const diferencia = ultimaNota - primeraNota;

                                    return (
                                        <tr key={evolucion.asignatura}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {evolucion.asignatura}
                                            </td>
                                            {todosLosAnios.map(anio => (
                                                <td key={anio}
                                                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {evolucion.calificacionesPorAnio[anio] || '-'}
                                                </td>
                                            ))}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {notasDisponibles.length > 1 && (
                                                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                        diferencia > 0
                                                            ? 'bg-green-100 text-green-800'
                                                            : diferencia < 0
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                    {diferencia > 0 ? '↑' : diferencia < 0 ? '↓' : '→'}
                                                        {Math.abs(diferencia).toFixed(1)} puntos
                                </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}