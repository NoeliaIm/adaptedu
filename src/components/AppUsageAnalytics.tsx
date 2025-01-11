import { useState } from "react";
import { Activity, ChevronLeft, ChevronRight } from "lucide-react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

interface EvolucionAcademica {
    asignatura: string;
    consultasPorAsignatura: number;
    calificacionesPorAnio: Record<string, number>;
}

interface AppUsageAnalyticsProps {
    evolucionAcademica: EvolucionAcademica[];
}

export default function AppUsageAnalytics({ evolucionAcademica }: AppUsageAnalyticsProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const datos = evolucionAcademica.map(evolucion => ({
        nombre: evolucion.asignatura,
        consultas: evolucion.consultasPorAsignatura || 0,
        ultimaNota: Object.values(evolucion.calificacionesPorAnio).pop() || 0
    }));

    const nextAsignatura = () => {
        setCurrentIndex((prev) =>
            prev === datos.length - 1 ? 0 : prev + 1
        );
    };

    const prevAsignatura = () => {
        setCurrentIndex((prev) =>
            prev === 0 ? datos.length - 1 : prev - 1
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Uso de la Aplicación</h2>
                <Activity className="w-5 h-5 text-indigo-600"/>
            </div>

            <div className="flex items-center justify-between mb-4 px-4">
                <button
                    onClick={prevAsignatura}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600"/>
                </button>
                <h3 className="text-sm font-medium text-gray-700">
                    {datos[currentIndex].nombre}
                    <span className="text-xs text-gray-500 ml-2">
                        {currentIndex + 1} de {datos.length}
                    </span>
                </h3>
                <button
                    onClick={nextAsignatura}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600"/>
                </button>
            </div>

            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={[datos[currentIndex]]}
                        margin={{top: 20, right: 30, left: 20, bottom: 20}}
                    >
                        <CartesianGrid strokeDasharray="3 3"/>
                        <XAxis dataKey="nombre"/>
                        <YAxis/>
                        <Tooltip/>
                        <Legend/>
                        <Bar
                            dataKey="consultas"
                            fill="#818cf8"
                            name="Consultas"
                        />
                        <Bar
                            dataKey="ultimaNota"
                            fill="#34d399"
                            name="Última nota"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className="mt-4">
                <p className="text-sm text-gray-600">
                    Total de visitas: {evolucionAcademica.reduce((acc, curr) => acc + (curr.consultasPorAsignatura || 0), 0)}
                </p>
            </div>
        </div>
    );
}