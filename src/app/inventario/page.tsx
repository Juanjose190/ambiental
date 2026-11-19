import { getDb } from "@/lib/db";
import InventarioClient from "./InventarioClient";

export const dynamic = "force-dynamic";

export default function InventarioPage() {
  const db = getDb();
  return <InventarioClient equipos={db.equipos} />;
}
