export interface MineralContent {
  litio: number;
  cobalto: number;
  oro: number;
  cobre: number;
  tierrasRaras: number;
}

const MINERAL_PROFILES: Record<string, MineralContent> = {
  Laptop: { litio: 5.8, cobalto: 8.2, oro: 0.034, cobre: 25.6, tierrasRaras: 1.2 },
  Monitor: { litio: 0.5, cobalto: 0.3, oro: 0.012, cobre: 18.4, tierrasRaras: 3.8 },
  Desktop: { litio: 2.1, cobalto: 3.5, oro: 0.045, cobre: 42.0, tierrasRaras: 2.5 },
};

export function getMinerals(tipo: string): MineralContent {
  return MINERAL_PROFILES[tipo] || MINERAL_PROFILES.Laptop;
}

export const MINERAL_INFO: Record<keyof MineralContent, { nombre: string; color: string; impacto: string }> = {
  litio: {
    nombre: "Litio (Li)",
    color: "#ef4444",
    impacto: "Extracción consume 2.2M litros de agua por tonelada. Principal componente de baterías de iones de litio.",
  },
  cobalto: {
    nombre: "Cobalto (Co)",
    color: "#3b82f6",
    impacto: "60% de la producción mundial proviene de la República Democrática del Congo, con alto costo social y ambiental.",
  },
  oro: {
    nombre: "Oro (Au)",
    color: "#f59e0b",
    impacto: "Se necesitan 20 toneladas de roca para obtener una onza. Usado en conectores y circuitos por su conductividad.",
  },
  cobre: {
    nombre: "Cobre (Cu)",
    color: "#f97316",
    impacto: "Mineral no renovable esencial para cableado y circuitos. Su extracción genera relaves tóxicos.",
  },
  tierrasRaras: {
    nombre: "Tierras Raras (REE)",
    color: "#8b5cf6",
    impacto: "17 elementos críticos para pantallas y componentes electrónicos. Extracción genera residuos radiactivos.",
  },
};
