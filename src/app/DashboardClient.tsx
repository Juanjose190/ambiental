"use client";

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { Trash2, Wind, Droplets, Monitor, TreePine, Mountain } from "lucide-react";
import ConceptTooltip from "@/components/ConceptTooltip";

const FLOTA_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];

const mesLabels: Record<string, string> = {
  "2024-05": "May", "2024-06": "Jun", "2024-07": "Jul",
  "2024-08": "Ago", "2024-09": "Sep", "2024-10": "Oct",
};

interface Props {
  totalRAEEEvitados: number;
  totalCO2Mitigado: number;
  totalAguaAhorrada: number;
  totalReacondicionados: number;
  chartData: { mes: string; lineal: number; circular: number }[];
  flotaData: { name: string; value: number }[];
  hectareasProtegidas: number;
}

export default function DashboardClient({
  totalRAEEEvitados, totalCO2Mitigado, totalAguaAhorrada,
  totalReacondicionados, chartData, flotaData, hectareasProtegidas,
}: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Ejecutivo de Impacto Circular</h1>
        <p className="text-sm text-gray-500 mt-1">Ceiba Software &mdash; Modelo de Economía Circular TI en alianza con UCC Campus Pasto</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="kpi-card border-l-4 border-l-red-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                RAEE Evitados
                <ConceptTooltip concepto="RAEE - Residuos de Aparatos Eléctricos y Electrónicos" explicacion="Los RAEE contienen sustancias tóxicas como plomo, mercurio y cadmio. Su correcta gestión previene la contaminación de suelos y fuentes hídricas (Saneamiento Ambiental)." />
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalRAEEEvitados} kg</p>
              <p className="text-xs text-emerald-600 mt-1">Dispositivos desviados del vertedero</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
              <Trash2 className="w-6 h-6 text-red-500" />
            </div>
          </div>
        </div>

        <div className="kpi-card border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                CO₂e Mitigado
                <ConceptTooltip concepto="Ciclo del Carbono y Cambio Climático" explicacion="El CO₂ es el principal gas de efecto invernadero. Extender la vida útil de equipos TI reduce las emisiones asociadas a la manufactura de nuevos dispositivos, mitigando el cambio climático." />
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{(totalCO2Mitigado / 1000).toFixed(1)} ton</p>
              <p className="text-xs text-emerald-600 mt-1">Modelo circular vs. lineal</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Wind className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
        </div>

        <div className="kpi-card border-l-4 border-l-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Agua Ahorrada
                <ConceptTooltip concepto="Ciclo del Agua y Data Centers" explicacion="Los centros de datos consumen enormes cantidades de agua para refrigeración. Las prácticas GreenOps y la optimización de infraestructura cloud reducen este consumo, protegiendo el ciclo hidrológico." />
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{(totalAguaAhorrada / 1000).toFixed(1)}k L</p>
              <p className="text-xs text-blue-600 mt-1">Refrigeración Data Centers</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <Droplets className="w-6 h-6 text-blue-500" />
            </div>
          </div>
        </div>

        <div className="kpi-card border-l-4 border-l-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                Equipos Reacondicionados
                <ConceptTooltip concepto="Economía del Bien Común" explicacion="La donación de equipos reacondicionados a instituciones educativas rurales de Nariño cierra la brecha digital y genera impacto social positivo, alineado con los principios de la Economía del Bien Común." />
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{totalReacondicionados}</p>
              <p className="text-xs text-purple-600 mt-1">Entregados a instituciones Nariño</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <Monitor className="w-6 h-6 text-purple-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Emissions Comparison */}
        <div className="card lg:col-span-2">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Emisiones Mensuales: Modelo Lineal vs. Circular
            <ConceptTooltip concepto="Economía Lineal vs. Circular" explicacion="El modelo lineal (extraer-fabricar-desechar) genera más emisiones. El modelo circular (reducir-reutilizar-reciclar) minimiza el impacto ambiental al mantener los recursos en uso el mayor tiempo posible." />
          </h3>
          <p className="text-xs text-gray-500 mb-4">kg CO₂e por mes &mdash; comparativa de modelos</p>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData.map(d => ({ ...d, mes: mesLabels[d.mes] || d.mes }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="mes" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar dataKey="lineal" name="Modelo Lineal Tradicional" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="circular" name="Modelo Circular Ceiba" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Fleet Distribution */}
        <div className="card">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Estado de Flota Tecnológica</h3>
          <p className="text-xs text-gray-500 mb-4">Distribución actual de {flotaData.reduce((s, d) => s + d.value, 0)} activos</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={flotaData} cx="50%" cy="50%" innerRadius={45} outerRadius={80} dataKey="value" label={({ name, value }) => `${name} (${value})`} labelLine={false}>
                {flotaData.map((_, i) => (
                  <Cell key={i} fill={FLOTA_COLORS[i % FLOTA_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-2 space-y-1">
            {flotaData.map((d, i) => (
              <div key={d.name} className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 rounded-sm" style={{ background: FLOTA_COLORS[i] }} />
                <span className="text-gray-600">{d.name}: <strong>{d.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Biocentric Compensation Widget */}
      <div className="card" style={{ background: "linear-gradient(135deg, #ecfdf5 0%, #d1fae5 50%, #eff6ff 100%)" }}>
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-emerald-600 flex items-center justify-center flex-shrink-0">
            <Mountain className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-bold text-emerald-900 flex items-center gap-1">
              Compensación Biocentrista &mdash; Soluciones Basadas en la Naturaleza (SbN)
              <ConceptTooltip concepto="Biocentrismo y SbN" explicacion="El biocentrismo reconoce el valor intrínseco de todos los seres vivos. Las Soluciones Basadas en la Naturaleza (SbN) utilizan ecosistemas naturales para mitigar el cambio climático y proteger la biodiversidad." />
            </h3>
            <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
              La huella de carbono residual del modelo circular de Ceiba se compensa mediante la protección de ecosistemas de páramo en Nariño.
              Estos ecosistemas son <strong>recursos naturales inagotables</strong> si se conservan adecuadamente, y actúan como sumideros de carbono y reguladores del ciclo del agua.
            </p>
            <div className="mt-3 flex items-center gap-6">
              <div className="flex items-center gap-2">
                <TreePine className="w-5 h-5 text-emerald-600" />
                <div>
                  <p className="text-lg font-bold text-emerald-800">{hectareasProtegidas.toFixed(2)} ha</p>
                  <p className="text-xs text-emerald-600">Páramos protegidos</p>
                </div>
              </div>
              <div className="text-xs text-emerald-700">
                <p className="font-semibold">Páramo de Bordoncillo / Volcán Galeras</p>
                <p>Nariño, Colombia &mdash; Ecosistema de alta montaña</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
