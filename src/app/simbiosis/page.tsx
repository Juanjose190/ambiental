import { getDb } from "@/lib/db";
import SimbiosisClient from "./SimbiosisClient";

export const dynamic = "force-dynamic";

export default function SimbiosisPage() {
  const db = getDb();
  const equiposDisponibles = db.equipos.filter((e) => e.estado === "Aprobado para Venta de Garaje");
  return (
    <SimbiosisClient
      equipos={equiposDisponibles}
      ventasGaraje={db.ventasGaraje}
      todosEquipos={db.equipos}
    />
  );
}
