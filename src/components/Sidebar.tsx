"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PackageSearch,
  RefreshCw,
  Cloud,
  ShoppingBag,
  Leaf,
  Recycle,
} from "lucide-react";

const links = [
  { href: "/", label: "Dashboard Ejecutivo", sub: "KPIs e impacto", icon: LayoutDashboard },
  { href: "/inventario", label: "Inventario Circular", sub: "Flota de equipos", icon: PackageSearch },
  { href: "/ciclo-vida", label: "Ciclo de Vida & R's", sub: "Gestión de estados", icon: RefreshCw },
  { href: "/greenops", label: "Calculadora GreenOps", sub: "Huella de carbono", icon: Cloud },
  { href: "/simbiosis", label: "Ventas de Garaje", sub: "Reutilización Hardware", icon: ShoppingBag },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col z-50"
      style={{ background: "linear-gradient(180deg, #0f2440 0%, #0a1929 100%)" }}>
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)" }}>
            <Recycle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-base leading-tight">CeibaCircular</h1>
            <p className="text-xs" style={{ color: "#94a3b8" }}>Economía Circular TI</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {links.map(({ href, label, sub, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link key={href} href={href}
              className={`sidebar-link ${active ? "active" : ""}`}>
              <Icon className="w-5 h-5 flex-shrink-0" />
              <div className="min-w-0">
                <span className="block truncate">{label}</span>
                <span className="block text-[11px] opacity-60 truncate">{sub}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2 text-xs" style={{ color: "#94a3b8" }}>
          <Leaf className="w-4 h-4 text-emerald-400" />
          <div>
            <p className="font-medium text-slate-200">Ceiba Software</p>
            <p>Pasto, Nariño</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
