"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Plus, Shield, Package, Leaf, Award, X, Gem,
} from "lucide-react";
import type { Equipo } from "@/lib/types";
import { getMinerals, MINERAL_INFO, type MineralContent } from "@/lib/minerals";
import { addEquipo } from "@/lib/actions";
import ConceptTooltip from "@/components/ConceptTooltip";

const CERT_COLORS: Record<string, string> = {
  "EPEAT Gold": "bg-emerald-100 text-emerald-800",
  "Energy Star": "bg-blue-100 text-blue-800",
  "TCO Certified": "bg-purple-100 text-purple-800",
  "Sin Certificación": "bg-gray-100 text-gray-500",
};

const ESTADO_COLORS: Record<string, string> = {
  "En Uso": "bg-emerald-100 text-emerald-800",
  "Mantenimiento Preventivo": "bg-blue-100 text-blue-800",
  "Reparación": "bg-amber-100 text-amber-800",
  "Listo para Simbiosis UCC": "bg-purple-100 text-purple-800",
  "Baja RAEE": "bg-red-100 text-red-800",
};

export default function InventarioClient({ equipos }: { equipos: Equipo[] }) {
  const [filter, setFilter] = useState("");
  const [certFilter, setCertFilter] = useState("Todos");
  const [showForm, setShowForm] = useState(false);
  const [passport, setPassport] = useState<Equipo | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const filtered = equipos.filter((e) => {
    const matchText = `${e.nombre} ${e.marca} ${e.modelo} ${e.serial}`.toLowerCase().includes(filter.toLowerCase());
    const matchCert = certFilter === "Todos" || e.certificacion === certFilter;
    return matchText && matchCert;
  });

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      await addEquipo({
        nombre: formData.get("nombre") as string,
        tipo: formData.get("tipo") as Equipo["tipo"],
        marca: formData.get("marca") as string,
        modelo: formData.get("modelo") as string,
        serial: formData.get("serial") as string,
        procesador: (formData.get("procesador") as string) || undefined,
        ram: (formData.get("ram") as string) || undefined,
        almacenamiento: (formData.get("almacenamiento") as string) || undefined,
        fechaCompra: formData.get("fechaCompra") as string,
        vidaUtilAnios: Number(formData.get("vidaUtilAnios")),
        certificacion: formData.get("certificacion") as Equipo["certificacion"],
        empaqueSostenible: formData.get("empaqueSostenible") === "on",
        estado: "En Uso",
      });
      setShowForm(false);
      router.refresh();
    });
  }

  const minerals = passport ? getMinerals(passport.tipo) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Inventario Circular & Pasaporte Digital
            <ConceptTooltip concepto="Compras Verdes" explicacion="Las compras verdes priorizan productos con certificaciones ambientales (EPEAT, Energy Star, TCO) que garantizan menor impacto en su fabricación y uso, promoviendo el uso responsable de recursos naturales." />
          </h1>
          <p className="text-sm text-gray-500 mt-1">Gestión de activos TI con ecoetiquetaje y trazabilidad de minerales críticos</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Registrar Equipo
        </button>
      </div>

      {/* Filters */}
      <div className="card flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Buscar por nombre, marca, modelo o serial..." value={filter} onChange={(e) => setFilter(e.target.value)} className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
        </div>
        <select value={certFilter} onChange={(e) => setCertFilter(e.target.value)} className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20">
          <option value="Todos">Todas las certificaciones</option>
          <option value="EPEAT Gold">EPEAT Gold</option>
          <option value="Energy Star">Energy Star</option>
          <option value="TCO Certified">TCO Certified</option>
          <option value="Sin Certificación">Sin Certificación</option>
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left p-3 font-medium text-gray-600">Equipo</th>
              <th className="text-left p-3 font-medium text-gray-600">Serial</th>
              <th className="text-left p-3 font-medium text-gray-600">Certificación</th>
              <th className="text-left p-3 font-medium text-gray-600">Empaque</th>
              <th className="text-left p-3 font-medium text-gray-600">Estado</th>
              <th className="text-left p-3 font-medium text-gray-600">Vida Útil</th>
              <th className="text-center p-3 font-medium text-gray-600">Pasaporte</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((e) => (
              <tr key={e.id} className="hover:bg-gray-50 transition-colors">
                <td className="p-3">
                  <div>
                    <p className="font-medium text-gray-900">{e.nombre}</p>
                    <p className="text-xs text-gray-500">{e.marca} {e.modelo}</p>
                  </div>
                </td>
                <td className="p-3 font-mono text-xs text-gray-600">{e.serial}</td>
                <td className="p-3">
                  <span className={`badge ${CERT_COLORS[e.certificacion]}`}>
                    {e.certificacion !== "Sin Certificación" && <Award className="w-3 h-3" />}
                    {e.certificacion}
                  </span>
                </td>
                <td className="p-3">
                  {e.empaqueSostenible ? (
                    <span className="badge bg-emerald-100 text-emerald-800"><Leaf className="w-3 h-3" /> Sostenible</span>
                  ) : (
                    <span className="badge bg-gray-100 text-gray-500">Convencional</span>
                  )}
                </td>
                <td className="p-3">
                  <span className={`badge ${ESTADO_COLORS[e.estado]}`}>{e.estado}</span>
                </td>
                <td className="p-3 text-xs text-gray-600">
                  {e.vidaUtilAnios}a {e.vidaExtendidaAnios > 0 && <span className="text-emerald-600">+{e.vidaExtendidaAnios}a</span>}
                </td>
                <td className="p-3 text-center">
                  <button onClick={() => setPassport(e)} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600 transition-colors" title="Ver Pasaporte Digital">
                    <Gem className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Equipment Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setShowForm(false)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">Registrar Nuevo Equipo</h2>
              <button onClick={() => setShowForm(false)} className="p-1 rounded hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <form action={handleSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-600">Nombre</label>
                  <input name="nombre" required className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" placeholder="MacBook Pro 14&quot; - Dev" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Tipo</label>
                  <select name="tipo" required className="w-full mt-1 px-3 py-2 rounded-lg border text-sm">
                    <option value="Laptop">Laptop</option>
                    <option value="Monitor">Monitor</option>
                    <option value="Desktop">Desktop</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Marca</label>
                  <input name="marca" required className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Modelo</label>
                  <input name="modelo" required className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Serial</label>
                  <input name="serial" required className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Fecha Compra</label>
                  <input name="fechaCompra" type="date" required className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Procesador</label>
                  <input name="procesador" className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">RAM</label>
                  <input name="ram" className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" placeholder="16 GB DDR5" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Almacenamiento</label>
                  <input name="almacenamiento" className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" placeholder="512 GB SSD" />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-600">Vida Útil (años)</label>
                  <input name="vidaUtilAnios" type="number" step="0.5" defaultValue="5" required className="w-full mt-1 px-3 py-2 rounded-lg border text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600">
                  Ecoetiquetaje / Certificación
                  <ConceptTooltip concepto="Ecoetiquetaje" explicacion="Las ecoetiquetas certifican que un producto cumple estándares ambientales en su ciclo de vida: desde la extracción de materias primas hasta su disposición final. Son herramientas clave de las Compras Verdes." />
                </label>
                <select name="certificacion" required className="w-full mt-1 px-3 py-2 rounded-lg border text-sm">
                  <option value="EPEAT Gold">EPEAT Gold</option>
                  <option value="Energy Star">Energy Star</option>
                  <option value="TCO Certified">TCO Certified</option>
                  <option value="Sin Certificación">Sin Certificación</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input name="empaqueSostenible" type="checkbox" id="empaque" className="rounded border-gray-300" />
                <label htmlFor="empaque" className="text-sm text-gray-700">
                  <Package className="w-4 h-4 inline mr-1" />
                  Empaque sostenible (cartón biodegradable, libre de plásticos de un solo uso e icopor)
                </label>
              </div>
              <button type="submit" disabled={isPending} className="w-full py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium disabled:opacity-50">
                {isPending ? "Registrando..." : "Registrar Equipo"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Digital Passport Modal */}
      {passport && minerals && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4" onClick={() => setPassport(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-emerald-700" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900">Pasaporte Digital</h2>
                  <p className="text-xs text-gray-500">{passport.nombre}</p>
                </div>
              </div>
              <button onClick={() => setPassport(null)} className="p-1 rounded hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200">
                <p className="text-xs font-bold text-amber-800 mb-1">
                  Recursos Naturales No Renovables
                  <ConceptTooltip concepto="Minerales Críticos No Renovables" explicacion="Los dispositivos electrónicos contienen minerales que tardan millones de años en formarse. Su extracción tiene alto impacto ambiental: contaminación de agua, deforestación y emisiones. Reciclarlos es fundamental." />
                </p>
                <p className="text-xs text-amber-700">Estimación de minerales críticos en este {passport.tipo.toLowerCase()}</p>
              </div>

              {(Object.entries(minerals) as [keyof MineralContent, number][]).map(([key, grams]) => {
                const info = MINERAL_INFO[key];
                return (
                  <div key={key} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${info.color}15` }}>
                      <Gem className="w-4 h-4" style={{ color: info.color }} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">{info.nombre}</p>
                        <p className="text-sm font-bold" style={{ color: info.color }}>{grams}g</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">{info.impacto}</p>
                    </div>
                  </div>
                );
              })}

              <div className="pt-2 border-t text-center">
                <p className="text-xs text-gray-500">Reciclar estos materiales evita nuevas extracciones mineras</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
