export interface Equipo {
  id: string;
  nombre: string;
  tipo: "Laptop" | "Monitor" | "Desktop";
  marca: string;
  modelo: string;
  serial: string;
  procesador?: string;
  ram?: string;
  almacenamiento?: string;
  fechaCompra: string;
  vidaUtilAnios: number;
  vidaExtendidaAnios: number;
  certificacion: "EPEAT Gold" | "Energy Star" | "TCO Certified" | "Sin Certificación";
  empaqueSostenible: boolean;
  estado: "En Uso" | "Mantenimiento Preventivo" | "Reparación" | "Listo para Simbiosis UCC" | "Baja RAEE";
  borradoSeguro: boolean;
  borradoFecha?: string;
}

export interface AccionR {
  id: string;
  equipoId: string;
  tipoAccion: string;
  descripcion: string;
  aniosExtendidos: number;
  kgCO2Evitados: number;
  fecha: string;
}

export interface Institucion {
  id: string;
  nombre: string;
  municipio: string;
  departamento: string;
  tipo: "Educativa Rural" | "Urbana" | "Fundación";
  contacto?: string;
}

export interface Asignacion {
  id: string;
  equipoId: string;
  institucionId?: string;
  estudianteNombre?: string;
  tipo: "Reacondicionamiento UCC" | "Donación Institución";
  estado: "Pendiente" | "En Proceso" | "Entregado";
  fechaAsignacion: string;
  fechaEntrega?: string;
  notasLinux?: string;
  diagnostico?: string;
}

export interface CertificadoRAEE {
  id: string;
  equipoId: string;
  gestorAutorizado: string;
  metodoDisposicion: string;
  metalesPesados: { plomo: string; mercurio: string; cadmio: string };
  pesoKg: number;
  fecha: string;
}

export interface RegistroMensual {
  id: string;
  mes: string;
  emisionesLineal: number;
  emisionesCircular: number;
  kgRAEEEvitados: number;
  litrosAguaAhorrados: number;
  equiposReacondicionados: number;
}

export interface ConfigGreenOps {
  ambientesActivos: number;
  apagadoNocturno: boolean;
  regionVerde: boolean;
  colaboradoresRemotos: number;
  colaboradoresOficina: number;
}

export interface Database {
  equipos: Equipo[];
  acciones: AccionR[];
  instituciones: Institucion[];
  asignaciones: Asignacion[];
  certificadosRAEE: CertificadoRAEE[];
  registrosMensuales: RegistroMensual[];
  configGreenOps: ConfigGreenOps;
}
