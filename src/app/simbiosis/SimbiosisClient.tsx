"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ShoppingBag, Laptop, Tag, Users, CheckCircle, Clock, X, Leaf,
} from "lucide-react";
import type { Equipo, VentaGaraje } from "@/lib/types";
import { crearVentaGaraje, actualizarVentaGaraje } from "@/lib/actions";
import { getMinerals } from "@/lib/minerals";
import ConceptTooltip from "@/components/ConceptTooltip";
import { toast } from "@/components/Toast";

const ESTADO_VENTA_COLORS: Record<string, string> = {
  Pendiente: "bg-amber-100 text-amber-800",
  "En Proceso": "bg-blue-100 text-blue-800",
  Adjudicado: "bg-emerald-100 text-emerald-800",
};

function formatCOP(value: number) {
  return new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);
}

function calcAhorro(precioVenta: number, precioComercial: number) {
  return Math.round(((precioComercial - precioVenta) / precioComercial) * 100);
}

interface Props {
  equipos: Equipo[];
  ventasGaraje: VentaGaraje[];
  todosEquipos: Equipo[];
}

export default function SimbiosisClient({ equipos, ventasGaraje, todosEquipos }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleVenta(formData: FormData) {
    startTransition(async () => {
      await crearVentaGaraje(
        formData.get("equipoId") as string,
        formData.get("canal") as "Colaboradores Ceiba" | "Comunidad Ceiba",
        (formData.get("compradorNombre") as string) || undefined,
        (formData.get("diagnostico") as string) || undefined,
      );
      setShowForm(false);
      router.refresh();
      toast("Equipo adjudicado en venta de garaje");
    });
  }

  function handleUpdateEstado(ventaId: string, estado: "En Proceso" | "Adjudicado") {
    startTransition(async () => {
      await actualizarVentaGaraje(ventaId, estado);
      router.refresh();
      toast(estado === "En Proceso" ? "Diagnóstico en proceso" : "Venta adjudicada exitosamente");
    });
  }

  const totalAdjudicados = ventasGaraje.filter((v) => v.estado === "Adjudicado").length;
  const totalEnProceso = ventasGaraje.filter((v) => v.estado === "En Proceso").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Ventas de Garaje Circulares
            <ConceptTooltip concepto="Reutilización y Economía del Bien Común" explicacion="Las ventas de garaje circulares de Ceiba Software ofrecen hardware corporativo usado a precios muy por debajo del mercado, extendiendo la vida útil de los equipos y cerrando la brecha digital." />
          </h1>
          <p className="text-sm text-gray-500 mt-1">Reutilización de Hardware Corporativo Ceiba Software</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">
          <ShoppingBag className="w-4 h-4" /> Adjudicar en Venta de Garaje
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="kpi-card border-l-4 border-l-purple-500">
          <Laptop className="w-5 h-5 text-purple-500 mb-1" />
          <p className="text-xs text-gray-500">Equipos Disponibles</p>
          <p className="text-2xl font-bold text-gray-900">{equipos.length}</p>
        </div>
        <div className="kpi-card border-l-4 border-l-emerald-500">
          <Tag className="w-5 h-5 text-emerald-500 mb-1" />
          <p className="text-xs text-gray-500">Ventas Adjudicadas</p>
          <p className="text-2xl font-bold text-gray-900">{totalAdjudicados}</p>
        </div>
        <div className="kpi-card border-l-4 border-l-blue-500">
          <Clock className="w-5 h-5 text-blue-500 mb-1" />
          <p className="text-xs text-gray-500">En Proceso</p>
          <p className="text-2xl font-bold text-gray-900">{totalEnProceso}</p>
        </div>
      </div>

      {/* Available Equipment Catalog */}
      <div className="card">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <ShoppingBag className="w-4 h-4 text-purple-600" />
          Catálogo Venta de Garaje Bimensual &mdash; Equipos con Borrado NIST Certificado
        </h3>
        {equipos.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No hay equipos disponibles. Avance equipos a &quot;Aprobado para Venta de Garaje&quot; desde el Gestor de Ciclo de Vida.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {equipos.map((eq) => {
              const minerals = getMinerals(eq.tipo);
              const co2Saved = (eq.vidaExtendidaAnios + 2) * 65;
              const mineralsSaved = minerals.litio + minerals.cobalto + minerals.cobre + minerals.tierrasRaras;
              return (
                <div key={eq.id} className="p-4 rounded-lg border border-purple-100 bg-purple-50/30 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">{eq.nombre}</p>
                      <p className="text-xs text-gray-600">{eq.procesador} · {eq.ram} · {eq.almacenamiento}</p>
                    </div>
                    {eq.precioVentaGaraje && eq.precioComercialEstimado && (
                      <span className="badge bg-emerald-100 text-emerald-700 font-bold">
                        -{calcAhorro(eq.precioVentaGaraje, eq.precioComercialEstimado)}% ahorro
                      </span>
                    )}
                  </div>

                  {eq.precioVentaGaraje && eq.precioComercialEstimado && (
                    <div className="flex items-baseline gap-3">
                      <p className="text-lg font-bold text-purple-700">{formatCOP(eq.precioVentaGaraje)}</p>
                      <p className="text-xs text-gray-400 line-through">{formatCOP(eq.precioComercialEstimado)}</p>
                      <span className="text-xs text-gray-500">comercial</span>
                    </div>
                  )}

                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="badge bg-blue-100 text-blue-700">
                      <CheckCircle className="w-3 h-3" /> Borrado NIST 800-88
                    </span>
                    <span className="badge bg-emerald-50 text-emerald-700">
                      <Leaf className="w-3 h-3" /> {co2Saved} kg CO₂ evitados
                    </span>
                    <span className="badge bg-amber-50 text-amber-700">
                      {mineralsSaved.toFixed(1)}g minerales salvados
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Users className="w-3 h-3" />
                    <span>Colaboradores Ceiba</span>
                    <span className="mx-1">·</span>
                    <span>Comunidad Ceiba</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sales Timeline */}
      <div className="card">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          Registro de Ventas de Garaje
        </h3>
        {ventasGaraje.length === 0 ? (
          <p className="text-sm text-gray-500 py-4 text-center">No hay ventas registradas.</p>
        ) : (
          <div className="space-y-3">
            {ventasGaraje.map((venta) => {
              const eq = todosEquipos.find((e) => e.id === venta.equipoId);
              return (
                <div key={venta.id} className="p-4 rounded-lg border hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`badge ${ESTADO_VENTA_COLORS[venta.estado]}`}>{venta.estado}</span>
                        <span className="badge bg-gray-100 text-gray-700">{venta.canal}</span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 mt-1">{eq?.nombre || venta.equipoId}</p>
                      {eq?.precioVentaGaraje && (
                        <p className="text-xs text-purple-600 font-semibold mt-1">{formatCOP(eq.precioVentaGaraje)}</p>
                      )}
                      {venta.compradorNombre && (
                        <p className="text-xs text-gray-600 mt-1 flex items-center gap-1">
                          <Users className="w-3 h-3" /> Comprador: {venta.compradorNombre}
                        </p>
                      )}
                      {venta.diagnostico && <p className="text-xs text-gray-500 mt-1">Diagnóstico: {venta.diagnostico}</p>}
                      <p className="text-xs text-gray-500 mt-1">Registrado: {venta.fechaRegistro}{venta.fechaAdjudicacion && ` · Adjudicado: ${venta.fechaAdjudicacion}`}</p>
                    </div>
                    <div className="flex gap-2">
                      {venta.estado === "Pendiente" && (
                        <button onClick={() => handleUpdateEstado(venta.id, "En Proceso")} disabled={isPending}
                          className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors">Iniciar Diagnóstico</button>
                      )}
                      {venta.estado === "En Proceso" && (
                        <button onClick={() => handleUpdateEstado(venta.id, "Adjudicado")} disabled={isPending}
                          className="px-3 py-1 text-xs bg-emerald-100 text-emerald-700 rounded hover:bg-emerald-200 transition-colors">Adjudicar Venta</button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* New Sale Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Adjudicar en Venta de Garaje</h2>
              <button onClick={() => setShowForm(false)}><X className="w-5 h-5" /></button>
            </div>
            <form action={handleVenta} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600">Equipo</label>
                <select name="equipoId" required className="w-full mt-1 px-3 py-2 rounded-lg border text-sm">
                  {equipos.map((eq) => (
                    <option key={eq.id} value={eq.id}>
                      {eq.nombre} {eq.precioVentaGaraje ? `- ${formatCOP(eq.precioVentaGaraje)}` : ""}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Canal de Acceso</label>
                <select name="canal" required className="w-full mt-1 px-3 py-2 rounded-lg border text-sm">
                  <option value="Colaboradores Ceiba">Colaboradores Ceiba</option>
                  <option value="Comunidad Ceiba">Comunidad Ceiba</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Nombre del Comprador</label>
                <input name="compradorNombre" className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" placeholder="Nombre completo" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">Diagnóstico técnico</label>
                <textarea name="diagnostico" rows={2} className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" placeholder="Estado general, batería, pantalla..." />
              </div>
              <button type="submit" disabled={isPending} className="w-full py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium disabled:opacity-50">
                {isPending ? "Adjudicando..." : "Adjudicar en Venta de Garaje"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
