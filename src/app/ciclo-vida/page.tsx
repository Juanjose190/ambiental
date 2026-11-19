import { getDb } from "@/lib/db";
import CicloVidaClient from "./CicloVidaClient";

export const dynamic = "force-dynamic";

export default function CicloVidaPage() {
  const db = getDb();
  return <CicloVidaClient equipos={db.equipos} acciones={db.acciones} certificados={db.certificadosRAEE} />;
}
