"use server";

import { getDb, saveDb, genId } from "./db";
import type { Equipo } from "./types";

export async function addEquipo(data: Omit<Equipo, "id" | "vidaExtendidaAnios" | "borradoSeguro">) {
  const db = getDb();
  const equipo: Equipo = {
    ...data,
    id: genId(),
    vidaExtendidaAnios: 0,
    borradoSeguro: false,
  };
  db.equipos.push(equipo);
  saveDb(db);
  return equipo;
}

export async function updateEquipoEstado(equipoId: string, nuevoEstado: Equipo["estado"]) {
  const db = getDb();
  const idx = db.equipos.findIndex((e) => e.id === equipoId);
  if (idx === -1) throw new Error("Equipo no encontrado");
  db.equipos[idx].estado = nuevoEstado;
  saveDb(db);
  return db.equipos[idx];
}

export async function aplicarEstrategiaR(
  equipoId: string,
  tipoAccion: string,
  descripcion: string,
  aniosExtendidos: number,
) {
  const db = getDb();
  const idx = db.equipos.findIndex((e) => e.id === equipoId);
  if (idx === -1) throw new Error("Equipo no encontrado");

  const kgCO2Evitados = aniosExtendidos * 65;

  db.acciones.push({
    id: genId(),
    equipoId,
    tipoAccion,
    descripcion,
    aniosExtendidos,
    kgCO2Evitados,
    fecha: new Date().toISOString().slice(0, 10),
  });

  db.equipos[idx].vidaExtendidaAnios += aniosExtendidos;

  saveDb(db);
  return db.equipos[idx];
}

export async function marcarBorradoSeguro(equipoId: string) {
  const db = getDb();
  const idx = db.equipos.findIndex((e) => e.id === equipoId);
  if (idx === -1) throw new Error("Equipo no encontrado");
  db.equipos[idx].borradoSeguro = true;
  db.equipos[idx].borradoFecha = new Date().toISOString().slice(0, 10);
  saveDb(db);
  return db.equipos[idx];
}

export async function generarCertificadoRAEE(
  equipoId: string,
  gestorAutorizado: string,
  metodoDisposicion: string,
  pesoKg: number,
) {
  const db = getDb();
  db.certificadosRAEE.push({
    id: genId(),
    equipoId,
    gestorAutorizado,
    metodoDisposicion,
    metalesPesados: {
      plomo: `${(pesoKg * 6.8).toFixed(1)}g prevenidos en suelo`,
      mercurio: `${(pesoKg * 1.7).toFixed(1)}g prevenidos en fuentes hídricas`,
      cadmio: `${(pesoKg * 3.4).toFixed(1)}g prevenidos en ecosistema`,
    },
    pesoKg,
    fecha: new Date().toISOString().slice(0, 10),
  });
  db.equipos[db.equipos.findIndex((e) => e.id === equipoId)].estado = "Baja RAEE";
  saveDb(db);
}

export async function crearAsignacion(
  equipoId: string,
  tipo: "Reacondicionamiento UCC" | "Donación Institución",
  institucionId?: string,
  estudianteNombre?: string,
  notasLinux?: string,
  diagnostico?: string,
) {
  const db = getDb();
  db.asignaciones.push({
    id: genId(),
    equipoId,
    institucionId,
    estudianteNombre,
    tipo,
    estado: "Pendiente",
    fechaAsignacion: new Date().toISOString().slice(0, 10),
    notasLinux,
    diagnostico,
  });
  saveDb(db);
}

export async function actualizarAsignacion(asignacionId: string, estado: "En Proceso" | "Entregado") {
  const db = getDb();
  const idx = db.asignaciones.findIndex((a) => a.id === asignacionId);
  if (idx === -1) throw new Error("Asignación no encontrada");
  db.asignaciones[idx].estado = estado;
  if (estado === "Entregado") {
    db.asignaciones[idx].fechaEntrega = new Date().toISOString().slice(0, 10);
  }
  saveDb(db);
}

export async function getFullData() {
  return getDb();
}
