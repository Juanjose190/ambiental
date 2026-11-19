"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import {
  Server, Moon, Sun, Leaf, TreePine, Zap, DollarSign, Car, Users,
} from "lucide-react";
import ConceptTooltip from "@/components/ConceptTooltip";

export default function GreenOpsClient() {
  const [ambientes, setAmbientes] = useState(15);
  const [apagadoNocturno, setApagadoNocturno] = useState(true);
  const [regionVerde, setRegionVerde] = useState(false);
  const [remotos, setRemotos] = useState(80);
  const [oficina, setOficina] = useState(20);

  // Calculations
  const kwhPorInstancia = 0.5; // kWh per instance per hour
  const horasAnuales = 8760;
  const horasSinApagado = horasAnuales;
  const horasConApagado = horasAnuales - (14 * 365); // 14h off per day
  const horasEfectivas = apagadoNocturno ? horasConApagado : horasSinApagado;

  const consumoBase = ambientes * kwhPorInstancia * horasSinApagado;
  const consumoOptimizado = ambientes * kwhPorInstancia * horasEfectivas;
  const ahorroKwh = consumoBase - consumoOptimizado;

  const factorEmision = regionVerde ? 0.02 : 0.42; // kg CO2/kWh
  const factorEmisionBase = 0.42;
  const co2Base = consumoBase * factorEmisionBase;
  const co2Optimizado = consumoOptimizado * factorEmision;
  const co2Ahorrado = co2Base - co2Optimizado;

  // Remote work savings
  const kmDiarioPromedio = 25;
  const diasLaborales = 240;
  const co2PorKm = 0.21; // kg CO2/km
  const co2TransporteEvitado = remotos * kmDiarioPromedio * diasLaborales * co2PorKm / 1000;

  const totalCO2Ahorrado = co2Ahorrado / 1000 + co2TransporteEvitado;
  const arboles = totalCO2Ahorrado * 1000 / 22; // 1 tree absorbs ~22kg CO2/year
  const ahorroCostoUSD = ahorroKwh * 0.12 + (regionVerde ? -ahorroKwh * 0.02 : 0);

  const comparisonData = [
    { name: "Operación Estándar", cloud: co2Base / 1000, transporte: (oficina + remotos) * kmDiarioPromedio * diasLaborales * co2PorKm / 1000 },
    { name: "GreenOps Ceiba", cloud: co2Optimizado / 1000, transporte: oficina * kmDiarioPromedio * diasLaborales * co2PorKm / 1000 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Calculadora GreenOps &amp; Ecoeficiencia Cloud
          <ConceptTooltip concepto="GreenOps y Cambio Climático" explicacion="GreenOps aplica principios de sostenibilidad a las operaciones de TI en la nube, reduciendo el consumo energético y las emisiones de CO₂ de los centros de datos para mitigar el cambio climático." />
        </h1>
        <p className="text-sm text-gray-500 mt-1">Simulador interactivo de huella de carbono en infraestructura cloud y operación remota</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="space-y-4">
          <div className="card">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-blue-600" /> Infraestructura Cloud
            </h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-600">Ambientes Dev/QA activos</label>
                  <span className="text-sm font-bold text-blue-600">{ambientes}</span>
                </div>
                <input type="range" min={5} max={50} value={ambientes} onChange={(e) => setAmbientes(Number(e.target.value))} className="w-full accent-blue-600" />
                <div className="flex justify-between text-[10px] text-gray-400"><span>5</span><span>50</span></div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  {apagadoNocturno ? <Moon className="w-4 h-4 text-indigo-500" /> : <Sun className="w-4 h-4 text-amber-500" />}
                  <div>
                    <p className="text-xs font-medium text-gray-700">Apagado nocturno/fines de semana</p>
                    <p className="text-[10px] text-gray-500">14h/día de ahorro energético</p>
                  </div>
                </div>
                <button onClick={() => setApagadoNocturno(!apagadoNocturno)}
                  className={`w-11 h-6 rounded-full transition-colors ${apagadoNocturno ? "bg-emerald-500" : "bg-gray-300"} relative`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${apagadoNocturno ? "left-5.5" : "left-0.5"}`} />
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                <div className="flex items-center gap-2">
                  <Leaf className="w-4 h-4 text-emerald-500" />
                  <div>
                    <p className="text-xs font-medium text-gray-700">
                      Región Cloud Verde
                      <ConceptTooltip concepto="Energía Renovable / Inagotable" explicacion="Las regiones cloud verdes usan 100% energía renovable (solar, eólica). Estos son recursos inagotables que no generan emisiones directas de CO₂, a diferencia de los combustibles fósiles (no renovables)." />
                    </p>
                    <p className="text-[10px] text-gray-500">100% energía renovable (solar/eólica)</p>
                  </div>
                </div>
                <button onClick={() => setRegionVerde(!regionVerde)}
                  className={`w-11 h-6 rounded-full transition-colors ${regionVerde ? "bg-emerald-500" : "bg-gray-300"} relative`}>
                  <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all ${regionVerde ? "left-5.5" : "left-0.5"}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" /> Modalidad de Trabajo
            </h3>
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-600">Colaboradores remotos</label>
                  <span className="text-sm font-bold text-purple-600">{remotos}</span>
                </div>
                <input type="range" min={0} max={100} value={remotos} onChange={(e) => { setRemotos(Number(e.target.value)); setOficina(100 - Number(e.target.value)); }} className="w-full accent-purple-600" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-gray-600">Colaboradores en oficina</label>
                  <span className="text-sm font-bold text-amber-600">{oficina}</span>
                </div>
                <input type="range" min={0} max={100} value={oficina} onChange={(e) => { setOficina(Number(e.target.value)); setRemotos(100 - Number(e.target.value)); }} className="w-full accent-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="kpi-card border-l-4 border-l-yellow-500">
              <Zap className="w-5 h-5 text-yellow-500 mb-1" />
              <p className="text-xs text-gray-500">Ahorro Energético</p>
              <p className="text-lg font-bold text-gray-900">{(ahorroKwh / 1000).toFixed(1)}k</p>
              <p className="text-[10px] text-gray-500">kWh/año</p>
            </div>
            <div className="kpi-card border-l-4 border-l-emerald-500">
              <Leaf className="w-5 h-5 text-emerald-500 mb-1" />
              <p className="text-xs text-gray-500">CO₂ Reducido</p>
              <p className="text-lg font-bold text-gray-900">{totalCO2Ahorrado.toFixed(1)}</p>
              <p className="text-[10px] text-gray-500">ton CO₂/año</p>
            </div>
            <div className="kpi-card border-l-4 border-l-green-600">
              <DollarSign className="w-5 h-5 text-green-600 mb-1" />
              <p className="text-xs text-gray-500">Ahorro Costos</p>
              <p className="text-lg font-bold text-gray-900">${ahorroCostoUSD.toFixed(0)}</p>
              <p className="text-[10px] text-gray-500">USD/año</p>
            </div>
            <div className="kpi-card border-l-4 border-l-green-700">
              <TreePine className="w-5 h-5 text-green-700 mb-1" />
              <p className="text-xs text-gray-500">Equivale a</p>
              <p className="text-lg font-bold text-gray-900">{Math.round(arboles)}</p>
              <p className="text-[10px] text-gray-500">árboles sembrados</p>
            </div>
          </div>

          <div className="card">
            <h3 className="text-sm font-bold text-gray-900 mb-1">Comparativa de Emisiones: Estándar vs. GreenOps</h3>
            <p className="text-xs text-gray-500 mb-4">Toneladas de CO₂ anuales por categoría</p>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ borderRadius: "8px", fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="cloud" name="Emisiones Cloud (ton CO₂)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="transporte" name="Emisiones Transporte (ton CO₂)" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="card" style={{ background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)" }}>
            <div className="flex items-start gap-3">
              <Car className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-sm font-bold text-blue-900">Impacto del Trabajo Remoto</h3>
                <p className="text-xs text-blue-700 mt-1">
                  Con <strong>{remotos} colaboradores remotos</strong>, Ceiba evita <strong>{(co2TransporteEvitado).toFixed(1)} toneladas de CO₂/año</strong> en emisiones vehiculares.
                  Esto equivale a retirar <strong>{Math.round(co2TransporteEvitado * 1000 / (4600 * 0.21))} vehículos</strong> de las calles de Pasto durante un año.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
