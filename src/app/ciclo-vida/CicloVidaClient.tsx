"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight, Wrench, ShieldCheck, FileWarning, X, CheckCircle2, AlertTriangle,
} from "lucide-react";
import type { Equipo, AccionR, CertificadoRAEE } from "@/lib/types";
import { updateEquipoEstado, aplicarEstrategiaR, marcarBorradoSeguro, generarCertificadoRAEE } from "@/lib/actions";
import ConceptTooltip from "@/components/ConceptTooltip";

const ESTADOS: Equipo["estado"][] = ["En Uso", "Mantenimiento Preventivo", "Reparación", "Listo para Simbiosis UCC", "Baja RAEE"];

const ESTADO_COLORS: Record<string, string> = {
  "En Uso": "bg-emerald-500",
  "Mantenimiento Preventivo": "bg-blue-500",
  "Reparación": "bg-amber-500",
  "Listo para Simbiosis UCC": "bg-purple-500",
  "Baja RAEE": "bg-red-500",
};

const ESTADO_BG: Record<string, string> = {
  "En Uso": "bg-emerald-50 border-emerald-200",
  "Mantenimiento Preventivo": "bg-blue-50 border-blue-200",
  "Reparación": "bg-amber-50 border-amber-200",
  "Listo para Simbiosis UCC": "bg-purple-50 border-purple-200",
  "Baja RAEE": "bg-red-50 border-red-200",
};

interface Props {
  equipos: Equipo[];
  acciones: AccionR[];
  certificados: CertificadoRAEE[];
}

export default function CicloVidaClient({ equipos, acciones, certificados }: Props) {
  const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null);
  const [showRModal, setShowRModal] = useState(false);
  const [showBorrado, setShowBorrado] = useState(false);
  const [showRAEE, setShowRAEE] = useState(false);
  const [borradoChecks, setBorradoChecks] = useState<boolean[]>([false, false, false, false]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAdvance(equipo: Equipo) {
    const idx = ESTADOS.indexOf(equipo.estado);
    if (idx < ESTADOS.length - 1) {
      const next = ESTADOS[idx + 1];
      if (next === "Listo para Simbiosis UCC" && !equipo.borradoSeguro) {
        setSelectedEquipo(equipo);
        setShowBorrado(true);
        return;
      }
      startTransition(async () => {
        await updateEquipoEstado(equipo.id, next);
        router.refresh();
      });
    }
  }

  function handleApplyR(formData: FormData) {
    if (!selectedEquipo) return;
    startTransition(async () => {
      await aplicarEstrategiaR(
        selectedEquipo.id,
        formData.get("tipoAccion") as string,
        formData.get("descripcion") as string,
        Number(formData.get("aniosExtendidos")),
      );
      setShowRModal(false);
      setSelectedEquipo(null);
      router.refresh();
    });
  }

  function handleBorrado() {
    if (!selectedEquipo || !borradoChecks.every(Boolean)) return;
    startTransition(async () => {
      await marcarBorradoSeguro(selectedEquipo.id);
      await updateEquipoEstado(selectedEquipo.id, "Listo para Simbiosis UCC");
      setShowBorrado(false);
      setBorradoChecks([false, false, false, false]);
      setSelectedEquipo(null);
      router.refresh();
    });
  }

  function handleRAEE(formData: FormData) {
    if (!selectedEquipo) return;
    startTransition(async () => {
      await generarCertificadoRAEE(
        selectedEquipo.id,
        formData.get("gestor") as string,
        formData.get("metodo") as string,
        Number(formData.get("peso")),
      );
      setShowRAEE(false);
      setSelectedEquipo(null);
      router.refresh();
    });
  }

  const NIST_CHECKS = [
    "Verificación de identidad del equipo (serial y asset tag)",
    "Borrado criptográfico (AES-256) de todas las unidades de almacenamiento",
    "Verificación post-borrado: escritura de patrones aleatorios y lectura de verificación",
    "Generación de certificado digital de borrado con hash SHA-256",
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Gestor de Ciclo de Vida &amp; Las &quot;R&quot;
          <ConceptTooltip concepto="Reparabilidad y Las R de la Economía Circular" explicacion="Las estrategias R (Reutilizar, Reparar, Remanufacturar, Reciclar) buscan mantener los productos y materiales en uso el mayor tiempo posible, reduciendo la necesidad de extraer nuevos recursos naturales." />
        </h1>
        <p className="text-sm text-gray-500 mt-1">Flujo de estados, estrategias R, borrado seguro NIST 800-88 y disposición RAEE certificada</p>
      </div>

      {/* Lifecycle Flow Header */}
      <div className="card">
        <div className="flex items-center justify-between flex-wrap gap-2">
          {ESTADOS.map((estado, i) => (
            <div key={estado} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${ESTADO_COLORS[estado]}`} />
                <span className="text-xs font-medium text-gray-700">{estado}</span>
                <span className="badge bg-gray-100 text-gray-600">{equipos.filter((e) => e.estado === estado).length}</span>
              </div>
              {i < ESTADOS.length - 1 && <ArrowRight className="w-4 h-4 text-gray-300" />}
            </div>
          ))}
        </div>
      </div>

      {/* Kanban Columns */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {ESTADOS.map((estado) => (
          <div key={estado} className="space-y-2">
            <div className={`p-2 rounded-lg border ${ESTADO_BG[estado]}`}>
              <h3 className="text-xs font-bold text-gray-800 text-center">{estado}</h3>
            </div>
            {equipos
              .filter((e) => e.estado === estado)
              .map((equipo) => (
                <div key={equipo.id} className="card p-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-900 leading-tight">{equipo.nombre}</p>
                  <p className="text-[10px] text-gray-500">{equipo.marca} &middot; {equipo.serial}</p>

                  {equipo.vidaExtendidaAnios > 0 && (
                    <span className="badge bg-emerald-100 text-emerald-700 text-[10px]">+{equipo.vidaExtendidaAnios}a vida extendida</span>
                  )}

                  {equipo.borradoSeguro && (
                    <span className="badge bg-blue-100 text-blue-700 text-[10px]">
                      <ShieldCheck className="w-3 h-3" /> NIST 800-88
                    </span>
                  )}

                  <div className="flex gap-1 flex-wrap">
                    {estado !== "Baja RAEE" && estado !== "Listo para Simbiosis UCC" && (
                      <button onClick={() => { setSelectedEquipo(equipo); setShowRModal(true); }}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors">
                        <Wrench className="w-3 h-3" /> Estrategia R
                      </button>
                    )}
                    {estado !== "Baja RAEE" && (
                      <button onClick={() => handleAdvance(equipo)}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors" disabled={isPending}>
                        <ArrowRight className="w-3 h-3" /> Avanzar
                      </button>
                    )}
                    {estado === "Reparación" && (
                      <button onClick={() => { setSelectedEquipo(equipo); setShowRAEE(true); }}
                        className="flex items-center gap-1 px-2 py-1 text-[10px] font-medium bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors">
                        <FileWarning className="w-3 h-3" /> Baja RAEE
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* R Strategy Modal */}
      {showRModal && selectedEquipo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => { setShowRModal(false); setSelectedEquipo(null); }}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Aplicar Estrategia R</h2>
              <button onClick={() => { setShowRModal(false); setSelectedEquipo(null); }}><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">{selectedEquipo.nombre}</p>
            <form action={handleApplyR} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Tipo de Acción</label>
                <select name="tipoAccion" className="w-full mt-1 px-3 py-2 rounded-lg border text-sm">
                  <option value="Reutilizar">Reutilizar</option>
                  <option value="Reparar">Reparar</option>
                  <option value="Upgrade RAM">Upgrade RAM</option>
                  <option value="Upgrade SSD">Upgrade SSD</option>
                  <option value="Upgrade Batería">Upgrade Batería</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Descripción</label>
                <textarea name="descripcion" required rows={2} className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" placeholder="Describa la acción realizada..." />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Años de Vida Extendida</label>
                <input name="aniosExtendidos" type="number" step="0.5" min="0.5" defaultValue="1" required className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" />
              </div>
              <button type="submit" disabled={isPending} className="w-full py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 text-sm font-medium disabled:opacity-50">
                {isPending ? "Aplicando..." : "Aplicar Estrategia R"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* NIST Secure Erase Modal */}
      {showBorrado && selectedEquipo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => { setShowBorrado(false); setSelectedEquipo(null); setBorradoChecks([false, false, false, false]); }}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-bold text-gray-900">
                Protocolo de Ciberseguridad NIST 800-88
                <ConceptTooltip concepto="Mitigación de Riesgo (DOFA)" explicacion="Antes de donar un equipo, es obligatorio realizar un borrado seguro certificado para prevenir fugas de información. Esto mitiga el riesgo identificado en el análisis DOFA de la operación circular." />
              </h2>
            </div>
            <p className="text-sm text-gray-500 mb-4">Checklist obligatorio antes de transferir: <strong>{selectedEquipo.nombre}</strong></p>
            <div className="space-y-2">
              {NIST_CHECKS.map((check, i) => (
                <label key={i} className="flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <input type="checkbox" checked={borradoChecks[i]}
                    onChange={(e) => {
                      const next = [...borradoChecks];
                      next[i] = e.target.checked;
                      setBorradoChecks(next);
                    }}
                    className="mt-0.5 rounded border-gray-300" />
                  <span className="text-sm text-gray-700">{check}</span>
                </label>
              ))}
            </div>
            <button onClick={handleBorrado}
              disabled={!borradoChecks.every(Boolean) || isPending}
              className="w-full mt-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {isPending ? "Certificando..." : "Certificar Borrado y Avanzar a Simbiosis"}
            </button>
          </div>
        </div>
      )}

      {/* RAEE Disposal Modal */}
      {showRAEE && selectedEquipo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => { setShowRAEE(false); setSelectedEquipo(null); }}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">
                Disposición RAEE Certificada
                <ConceptTooltip concepto="Saneamiento Ambiental y RAEE" explicacion="La disposición certificada de RAEE previene la contaminación por metales pesados (plomo, mercurio, cadmio) en suelos y fuentes hídricas, protegiendo el saneamiento ambiental de la región." />
              </h2>
              <button onClick={() => { setShowRAEE(false); setSelectedEquipo(null); }}><X className="w-5 h-5" /></button>
            </div>
            <form action={handleRAEE} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Gestor Autorizado</label>
                <select name="gestor" className="w-full mt-1 px-3 py-2 rounded-lg border text-sm">
                  <option value="Lito S.A.S.">Lito S.A.S.</option>
                  <option value="Full Circle Recycling">Full Circle Recycling</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Método de Disposición</label>
                <select name="metodo" className="w-full mt-1 px-3 py-2 rounded-lg border text-sm">
                  <option value="Desensamblaje controlado y recuperación de materiales">Desensamblaje controlado y recuperación de materiales</option>
                  <option value="Trituración certificada y recuperación de metales preciosos">Trituración certificada y recuperación de metales preciosos</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Peso del equipo (kg)</label>
                <input name="peso" type="number" step="0.01" defaultValue="1.8" required className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" />
              </div>
              <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                <p className="text-xs font-bold text-red-800 mb-1">Prevención de Contaminación</p>
                <p className="text-xs text-red-700">Este certificado documenta la prevención de filtración de metales pesados (Pb, Hg, Cd) en suelos y fuentes hídricas de Nariño.</p>
              </div>
              <button type="submit" disabled={isPending} className="w-full py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium disabled:opacity-50">
                {isPending ? "Generando..." : "Generar Certificado de Disposición"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Certificates list */}
      {certificados.length > 0 && (
        <div className="card">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Certificados RAEE Emitidos</h3>
          <div className="space-y-2">
            {certificados.map((cert) => {
              const eq = equipos.find((e) => e.id === cert.equipoId);
              return (
                <div key={cert.id} className="p-3 rounded-lg border border-red-100 bg-red-50/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{eq?.nombre || cert.equipoId}</p>
                      <p className="text-xs text-gray-500">{cert.gestorAutorizado} &middot; {cert.metodoDisposicion}</p>
                    </div>
                    <span className="badge bg-red-100 text-red-700">{cert.pesoKg} kg</span>
                  </div>
                  <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-1 rounded bg-white">
                      <p className="font-bold text-red-700">Pb</p>
                      <p className="text-gray-600">{cert.metalesPesados.plomo}</p>
                    </div>
                    <div className="text-center p-1 rounded bg-white">
                      <p className="font-bold text-red-700">Hg</p>
                      <p className="text-gray-600">{cert.metalesPesados.mercurio}</p>
                    </div>
                    <div className="text-center p-1 rounded bg-white">
                      <p className="font-bold text-red-700">Cd</p>
                      <p className="text-gray-600">{cert.metalesPesados.cadmio}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
