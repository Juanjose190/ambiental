"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  GraduationCap, School, Laptop, UserPlus, FileText, CheckCircle, Clock, Package, X, MapPin,
} from "lucide-react";
import type { Equipo, Institucion, Asignacion } from "@/lib/types";
import { crearAsignacion, actualizarAsignacion } from "@/lib/actions";
import ConceptTooltip from "@/components/ConceptTooltip";
import { toast } from "@/components/Toast";

const ESTADO_ASIGNACION_COLORS: Record<string, string> = {
  Pendiente: "bg-amber-100 text-amber-800",
  "En Proceso": "bg-blue-100 text-blue-800",
  Entregado: "bg-emerald-100 text-emerald-800",
};

interface Props {
  equipos: Equipo[];
  instituciones: Institucion[];
  asignaciones: Asignacion[];
  todosEquipos: Equipo[];
}

export default function SimbiosisClient({ equipos, instituciones, asignaciones, todosEquipos }: Props) {
  const [showAssign, setShowAssign] = useState(false);
  const [showActa, setShowActa] = useState<Asignacion | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleAssign(formData: FormData) {
    startTransition(async () => {
      await crearAsignacion(
        formData.get("equipoId") as string,
        formData.get("tipo") as "Reacondicionamiento UCC" | "Donación Institución",
        (formData.get("institucionId") as string) || undefined,
        (formData.get("estudianteNombre") as string) || undefined,
        (formData.get("notasLinux") as string) || undefined,
        (formData.get("diagnostico") as string) || undefined,
      );
      setShowAssign(false);
      router.refresh();
      toast("Asignación creada exitosamente");
    });
  }

  function handleUpdateEstado(asignacionId: string, estado: "En Proceso" | "Entregado") {
    startTransition(async () => {
      await actualizarAsignacion(asignacionId, estado);
      router.refresh();
      toast(estado === "En Proceso" ? "Proceso iniciado" : "Entrega registrada exitosamente");
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Portal de Simbiosis Académica
            <ConceptTooltip concepto="Simbiosis Industrial/Académica" explicacion="La simbiosis académica aplica el concepto de simbiosis industrial: los residuos de una organización (Ceiba) se convierten en recursos para otra (UCC/instituciones educativas), creando un ciclo virtuoso de valor compartido." />
          </h1>
          <p className="text-sm text-gray-500 mt-1">Ceiba Software + Universidad Cooperativa de Colombia &mdash; Campus Pasto</p>
        </div>
        <button onClick={() => setShowAssign(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <UserPlus className="w-4 h-4" /> Nueva Asignación
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="kpi-card border-l-4 border-l-purple-500">
          <Laptop className="w-5 h-5 text-purple-500 mb-1" />
          <p className="text-xs text-gray-500">Equipos Disponibles</p>
          <p className="text-2xl font-bold text-gray-900">{equipos.length}</p>
        </div>
        <div className="kpi-card border-l-4 border-l-blue-500">
          <GraduationCap className="w-5 h-5 text-blue-500 mb-1" />
          <p className="text-xs text-gray-500">Reacondicionamientos UCC</p>
          <p className="text-2xl font-bold text-gray-900">{asignaciones.filter((a) => a.tipo === "Reacondicionamiento UCC").length}</p>
        </div>
        <div className="kpi-card border-l-4 border-l-emerald-500">
          <School className="w-5 h-5 text-emerald-500 mb-1" />
          <p className="text-xs text-gray-500">Instituciones Beneficiadas</p>
          <p className="text-2xl font-bold text-gray-900">{new Set(asignaciones.filter((a) => a.institucionId).map((a) => a.institucionId)).size}</p>
        </div>
        <div className="kpi-card border-l-4 border-l-amber-500">
          <CheckCircle className="w-5 h-5 text-amber-500 mb-1" />
          <p className="text-xs text-gray-500">Entregas Completadas</p>
          <p className="text-2xl font-bold text-gray-900">{asignaciones.filter((a) => a.estado === "Entregado").length}</p>
        </div>
      </div>

      {/* Available Equipment Catalog */}
      <div className="card">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Package className="w-4 h-4 text-purple-600" />
          Catálogo de Equipos Disponibles para Proyección Social
        </h3>
        {equipos.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No hay equipos disponibles. Avance equipos a &quot;Listo para Simbiosis UCC&quot; desde el Gestor de Ciclo de Vida.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {equipos.map((eq) => (
              <div key={eq.id} className="p-3 rounded-lg border border-purple-100 bg-purple-50/30">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{eq.nombre}</p>
                    <p className="text-xs text-gray-500">{eq.procesador} &middot; {eq.ram}</p>
                    <p className="text-xs text-gray-500">{eq.almacenamiento}</p>
                  </div>
                  <span className="badge bg-emerald-100 text-emerald-700">
                    <CheckCircle className="w-3 h-3" /> Borrado NIST
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Institutions */}
      <div className="card">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <School className="w-4 h-4 text-blue-600" />
          Instituciones Educativas Destinatarias &mdash; Nariño
          <ConceptTooltip concepto="Economía del Bien Común" explicacion="El cierre de brecha digital mediante la donación de equipos a comunidades rurales es un ejemplo de Economía del Bien Común: el valor generado se mide por el bienestar social, no solo por el beneficio económico." />
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {instituciones.map((inst) => (
            <div key={inst.id} className="p-3 rounded-lg border hover:shadow-sm transition-shadow">
              <p className="text-sm font-medium text-gray-900">{inst.nombre}</p>
              <div className="flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3 text-gray-500" />
                <p className="text-xs text-gray-500">{inst.municipio}, {inst.departamento}</p>
              </div>
              <span className="badge bg-blue-100 text-blue-700 mt-2">{inst.tipo}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Assignments Timeline */}
      <div className="card">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          Registro de Asignaciones y Entregas
        </h3>
        {asignaciones.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No hay asignaciones registradas.</p>
        ) : (
          <div className="space-y-3">
            {asignaciones.map((asig) => {
              const eq = todosEquipos.find((e) => e.id === asig.equipoId);
              const inst = instituciones.find((i) => i.id === asig.institucionId);
              return (
                <div key={asig.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`badge ${ESTADO_ASIGNACION_COLORS[asig.estado]}`}>{asig.estado}</span>
                        <span className="badge bg-gray-100 text-gray-700">{asig.tipo}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-1">{eq?.nombre || asig.equipoId}</p>
                      {inst && <p className="text-xs text-gray-500">Destino: {inst.nombre} ({inst.municipio})</p>}
                      {asig.estudianteNombre && (
                        <p className="text-xs text-blue-600 mt-1 flex items-center gap-1">
                          <GraduationCap className="w-3 h-3" /> Practicante UCC: {asig.estudianteNombre}
                        </p>
                      )}
                      {asig.notasLinux && <p className="text-xs text-gray-500 mt-1">Linux: {asig.notasLinux}</p>}
                      {asig.diagnostico && <p className="text-xs text-gray-500 mt-1">Diagnóstico: {asig.diagnostico}</p>}
                      <p className="text-xs text-gray-500 mt-1">Asignado: {asig.fechaAsignacion}{asig.fechaEntrega && ` · Entregado: ${asig.fechaEntrega}`}</p>
                    </div>
                    <div className="flex gap-2">
                      {asig.estado === "Pendiente" && (
                        <button onClick={() => handleUpdateEstado(asig.id, "En Proceso")} disabled={isPending}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">Iniciar</button>
                      )}
                      {asig.estado === "En Proceso" && (
                        <button onClick={() => handleUpdateEstado(asig.id, "Entregado")} disabled={isPending}
                          className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors">Marcar Entregado</button>
                      )}
                      {asig.estado === "Entregado" && (
                        <button onClick={() => setShowActa(asig)}
                          className="px-3 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors flex items-center gap-1">
                          <FileText className="w-3 h-3" /> Ver Acta
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Assignment Modal */}
      {showAssign && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowAssign(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Nueva Asignación</h2>
              <button onClick={() => setShowAssign(false)}><X className="w-5 h-5" /></button>
            </div>
            <form action={handleAssign} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Equipo</label>
                <select name="equipoId" required className="w-full mt-1 px-3 py-2 rounded-lg border text-sm">
                  {equipos.map((eq) => (
                    <option key={eq.id} value={eq.id}>{eq.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Tipo de Asignación</label>
                <select name="tipo" required className="w-full mt-1 px-3 py-2 rounded-lg border text-sm">
                  <option value="Reacondicionamiento UCC">Reacondicionamiento UCC (Practicante)</option>
                  <option value="Donación Institución">Donación a Institución Educativa</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Institución Destino</label>
                <select name="institucionId" className="w-full mt-1 px-3 py-2 rounded-lg border text-sm">
                  <option value="">Sin asignar aún</option>
                  {instituciones.map((inst) => (
                    <option key={inst.id} value={inst.id}>{inst.nombre} ({inst.municipio})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Estudiante Practicante UCC (opcional)</label>
                <input name="estudianteNombre" className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" placeholder="Nombre del estudiante de Ingeniería de Software" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Distribución Linux a instalar</label>
                <input name="notasLinux" className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" placeholder="Ubuntu 22.04 LTS educativo" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Diagnóstico del equipo</label>
                <textarea name="diagnostico" rows={2} className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" placeholder="Estado general, batería, pantalla..." />
              </div>
              <button type="submit" disabled={isPending} className="w-full py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium disabled:opacity-50">
                {isPending ? "Asignando..." : "Crear Asignación"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Digital Delivery Act Modal */}
      {showActa && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowActa(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Acta Digital de Entrega</h2>
              <button onClick={() => setShowActa(null)}><X className="w-5 h-5" /></button>
            </div>
            {(() => {
              const eq = todosEquipos.find((e) => e.id === showActa.equipoId);
              const inst = instituciones.find((i) => i.id === showActa.institucionId);
              return (
                <div className="space-y-3 text-sm">
                  <div className="p-4 rounded-lg bg-purple-50 border border-purple-200 text-center">
                    <p className="text-xs text-purple-600 uppercase tracking-wide font-bold">Certificado de Entrega</p>
                    <p className="text-lg font-bold text-purple-900 mt-1">Programa de Simbiosis Académica</p>
                    <p className="text-xs text-purple-700">Ceiba Software + UCC Campus Pasto</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-500">Equipo</p>
                      <p className="font-medium">{eq?.nombre}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Serial</p>
                      <p className="font-medium font-mono text-xs">{eq?.serial}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Institución Destino</p>
                      <p className="font-medium">{inst?.nombre || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Municipio</p>
                      <p className="font-medium">{inst?.municipio || "N/A"}, Nariño</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Fecha Entrega</p>
                      <p className="font-medium">{showActa.fechaEntrega}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Borrado Seguro</p>
                      <p className="font-medium text-emerald-700">NIST 800-88 Certificado</p>
                    </div>
                  </div>
                  {showActa.diagnostico && (
                    <div>
                      <p className="text-xs text-gray-500">Diagnóstico</p>
                      <p className="text-sm">{showActa.diagnostico}</p>
                    </div>
                  )}
                  <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-center text-xs text-emerald-700">
                    <p className="font-bold">Contribución al cierre de brecha digital en Nariño</p>
                    <p>Economía del Bien Común &middot; Economía Circular TI</p>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}
