import React, { useEffect, useRef, useState } from 'react';
import { Info } from 'lucide-react';
import { getFieldDerivation, BASIS_LABEL, DerivationBasis } from '../data/fieldDerivations';

interface FieldInfoProps {
  /** key into FIELD_DERIVATIONS */
  field: string;
  /** PDF/print mode renders the explanation inline instead of behind a click */
  forExport?: boolean;
  className?: string;
}

const BASIS_STYLE: Record<DerivationBasis, string> = {
  ganita: 'bg-sky-100 text-sky-800 border-sky-200',
  agama: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  sankalita: 'bg-amber-100 text-amber-900 border-amber-300',
};

/**
 * Small info affordance shown next to a computed value. Explains how the value
 * was derived, the arithmetic behind it, what it means, and — importantly —
 * whether it is astronomically computed, doctrinally given, or a synthesized
 * model value. See src/data/fieldDerivations.ts.
 */
const PANEL_WIDTH = 340;
const MARGIN = 12;

export default function FieldInfo({ field, forExport, className = '' }: FieldInfoProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const ref = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const d = getFieldDerivation(field);

  // The icon can sit anywhere — far left of a card, far right of a badge, or
  // mid-paragraph. A statically anchored panel overflows the viewport in at
  // least one of those cases, so position is measured from the trigger and
  // clamped into the viewport on open.
  const place = () => {
    const b = btnRef.current?.getBoundingClientRect();
    if (!b) return;
    const width = Math.min(PANEL_WIDTH, window.innerWidth - MARGIN * 2);
    let left = b.left + b.width / 2 - width / 2;
    left = Math.max(MARGIN, Math.min(left, window.innerWidth - width - MARGIN));
    setPos({ left, top: b.bottom + 8 });
  };

  useEffect(() => {
    if (!open) return;
    place();
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const onReflow = () => setOpen(false);
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', onReflow);
    window.addEventListener('scroll', onReflow, true);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onReflow);
      window.removeEventListener('scroll', onReflow, true);
    };
  }, [open]);

  if (!d) return null;

  const basis = BASIS_LABEL[d.basis];

  // Print/PDF: no interactivity available, so render the whole explanation.
  if (forExport) {
    return (
      <div className={`mt-2 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs ${className}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="font-bold text-gray-800">{d.label}</span>
          <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold ${BASIS_STYLE[d.basis]}`}>
            {basis.hindi}
          </span>
        </div>
        <p className="text-gray-700 leading-relaxed mb-1">
          <strong>गणना विधि:</strong> {d.derivation}
        </p>
        {d.formula && (
          <p className="text-gray-600 font-mono text-[11px] bg-white border border-gray-100 rounded px-2 py-1 mb-1">
            {d.formula}
          </p>
        )}
        <p className="text-gray-700 leading-relaxed mb-1">
          <strong>विश्लेषण:</strong> {d.analysis}
        </p>
        <p className="text-gray-500 text-[10px]">स्रोत: {d.source} · {basis.note}</p>
      </div>
    );
  }

  return (
    <span ref={ref} className={`relative inline-flex align-middle ${className}`}>
      <button
        ref={btnRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={`${d.label} — गणना विधि जानें`}
        className="text-gray-400 hover:text-indigo-600 focus:text-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-300 rounded-full transition-colors"
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {open && pos && (
        <span
          role="dialog"
          aria-label={d.label}
          className="fixed z-50 max-h-[70vh] overflow-y-auto"
          style={{
            left: pos.left,
            top: pos.top,
            width: Math.min(PANEL_WIDTH, typeof window !== 'undefined' ? window.innerWidth - MARGIN * 2 : PANEL_WIDTH),
          }}
        >
          <span className="block bg-white rounded-xl border border-gray-200 shadow-xl p-4 text-left">
            <span className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
              <span className="font-bold text-gray-900 text-sm">{d.label}</span>
              <span className={`px-1.5 py-0.5 rounded border text-[10px] font-semibold shrink-0 ${BASIS_STYLE[d.basis]}`}>
                {basis.hindi}
              </span>
            </span>

            <span className="block text-xs text-gray-700 leading-relaxed mb-2">
              <strong className="text-gray-900">गणना विधि:</strong> {d.derivation}
            </span>

            {d.formula && (
              <span className="block text-[11px] text-gray-700 bg-gray-50 border border-gray-100 rounded px-2 py-1.5 mb-2 leading-relaxed">
                {d.formula}
              </span>
            )}

            <span className="block text-xs text-gray-700 leading-relaxed mb-2">
              <strong className="text-gray-900">विश्लेषण:</strong> {d.analysis}
            </span>

            <span className="block text-[10px] text-gray-500 border-t border-gray-100 pt-2 leading-relaxed">
              <strong>स्रोत:</strong> {d.source}
              <span className="block mt-0.5 italic">{basis.note}</span>
            </span>
          </span>
        </span>
      )}
    </span>
  );
}
