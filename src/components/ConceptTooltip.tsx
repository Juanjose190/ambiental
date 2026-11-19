"use client";

import { useState } from "react";
import { Info } from "lucide-react";

export default function ConceptTooltip({ concepto, explicacion }: { concepto: string; explicacion: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative inline-flex items-center ml-1">
      <button
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200 transition-colors cursor-help"
        aria-label={`Concepto: ${concepto}`}
      >
        <Info className="w-3 h-3" />
      </button>
      {open && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-72 p-3 rounded-lg shadow-lg border border-emerald-200 bg-white z-50 text-left">
          <p className="text-xs font-bold text-emerald-800 mb-1">{concepto}</p>
          <p className="text-xs text-gray-600 leading-relaxed">{explicacion}</p>
          <div className="absolute top-full left-1/2 -translate-x-1/2 w-2 h-2 bg-white border-b border-r border-emerald-200 -rotate-45 -mt-1" />
        </div>
      )}
    </span>
  );
}
