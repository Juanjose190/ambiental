import { getDb } from "@/lib/db";
import SimbiosisClient from "./SimbiosisClient";

export const dynamic = "force-dynamic";

export default function SimbiosisPage() {
  const db = getDb();
  const equiposDisponibles = db.equipos.filter((e) => e.estado === "Listo para Simbiosis UCC");
  return (
    <SimbiosisClient
      equipos={equiposDisponibles}
      instituciones={db.instituciones}
      asignaciones={db.asignaciones}
      todosEquipos={db.equipos}
    />
  );
}
