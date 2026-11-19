import { getDb } from "@/lib/db";
import DashboardClient from "./DashboardClient";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const db = getDb();

  const totalRAEEEvitados = db.registrosMensuales.reduce((s, r) => s + r.kgRAEEEvitados, 0);
  const totalCO2Mitigado = db.registrosMensuales.reduce((s, r) => s + (r.emisionesLineal - r.emisionesCircular), 0);
  const totalAguaAhorrada = db.registrosMensuales.reduce((s, r) => s + r.litrosAguaAhorrados, 0);
  const totalReacondicionados = db.registrosMensuales.reduce((s, r) => s + r.equiposReacondicionados, 0);

  const estadosFlota = {
    "En Uso": db.equipos.filter((e) => e.estado === "En Uso").length,
    "Mantenimiento": db.equipos.filter((e) => e.estado === "Mantenimiento Preventivo").length,
    "Reparación": db.equipos.filter((e) => e.estado === "Reparación").length,
    "Venta de Garaje": db.equipos.filter((e) => e.estado === "Aprobado para Venta de Garaje").length,
    "Baja RAEE": db.equipos.filter((e) => e.estado === "Baja RAEE").length,
  };

  const chartData = db.registrosMensuales.map((r) => ({
    mes: r.mes,
    lineal: r.emisionesLineal,
    circular: r.emisionesCircular,
  }));

  const flotaData = Object.entries(estadosFlota).map(([name, value]) => ({ name, value }));

  const hectareasProtegidas = (totalCO2Mitigado / 1000) * 0.12;

  return (
    <DashboardClient
      totalRAEEEvitados={totalRAEEEvitados}
      totalCO2Mitigado={totalCO2Mitigado}
      totalAguaAhorrada={totalAguaAhorrada}
      totalReacondicionados={totalReacondicionados}
      chartData={chartData}
      flotaData={flotaData}
      hectareasProtegidas={hectareasProtegidas}
    />
  );
}
