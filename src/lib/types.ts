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
  estado: "En Uso" | "Mantenimiento Preventivo" | "Reparación" | "Aprobado para Venta de Garaje" | "Baja RAEE";
  borradoSeguro: boolean;
  borradoFecha?: string;
  precioVentaGaraje?: number;
  precioComercialEstimado?: number;
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

export interface VentaGaraje {
  id: string;
  equipoId: string;
  canal: "Colaboradores Ceiba" | "Cupo Preferencial Estudiantes UCC";
  compradorNombre?: string;
  estudianteUCC?: string;
  estado: "Pendiente" | "En Proceso" | "Adjudicado";
  fechaRegistro: string;
  fechaAdjudicacion?: string;
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
  ventasGaraje: VentaGaraje[];
  certificadosRAEE: CertificadoRAEE[];
  registrosMensuales: RegistroMensual[];
  configGreenOps: ConfigGreenOps;
}
