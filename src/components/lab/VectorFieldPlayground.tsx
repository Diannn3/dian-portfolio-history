import React, { useEffect, useRef, useState } from 'react';
import { fieldComponents } from '../../lib/math/fieldCore';

const TMP = { x: 0, y: 0, z: 0 };

/**
 * L01 — the site's field, exposed. Trajectories are integrated with RK4 on a 2D
 * canvas: the same equations as the hero, drawn once per parameter change rather
 * than animated, so an open experiment costs nothing per frame.
 */
export function VectorFieldPlayground() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [seeds, setSeeds] = useState(90);
  const [step, setStep] = useState(0.06);
  const [depth, setDepth] = useState(0.4);
  const [length, setLength] = useState(120);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const w = Math.max(1, el.clientWidth);
      const h = Math.max(1, el.clientHeight);
      el.width = Math.round(w * dpr);
      el.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const scale = Math.min(w, h) / 7.2;
      const toScreen = (x: number, y: number) => [w / 2 + x * scale, h / 2 - y * scale] as const;

      /* lattice */
      ctx.strokeStyle = 'rgba(17,17,17,0.09)';
      ctx.lineWidth = 1;
      for (let i = -3; i <= 3; i++) {
        const [sx] = toScreen(i, 0);
        const [, sy] = toScreen(0, i);
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(w, sy);
        ctx.stroke();
      }

      /* deterministic seeding: identical parameters redraw identically */
      let s = 20260318;
      const rnd = () => {
        s = (s * 1664525 + 1013904223) >>> 0;
        return s / 4294967296;
      };

      for (let i = 0; i < seeds; i++) {
        let px = (rnd() - 0.5) * 6.4;
        let py = (rnd() - 0.5) * 4.6;
        const accent = i % 4 === 0;
        ctx.strokeStyle = accent ? 'rgba(217,79,43,0.55)' : 'rgba(17,17,17,0.3)';
        ctx.lineWidth = accent ? 1.1 : 0.8;
        ctx.beginPath();
        const [x0, y0] = toScreen(px, py);
        ctx.moveTo(x0, y0);

        for (let k = 0; k < length; k++) {
          /* RK4 in the z = depth slice */
          fieldComponents(px, py, depth, 0, TMP);
          const k1x = TMP.x;
          const k1y = TMP.y;
          fieldComponents(px + (k1x * step) / 2, py + (k1y * step) / 2, depth, 0, TMP);
          const k2x = TMP.x;
          const k2y = TMP.y;
          fieldComponents(px + (k2x * step) / 2, py + (k2y * step) / 2, depth, 0, TMP);
          const k3x = TMP.x;
          const k3y = TMP.y;
          fieldComponents(px + k3x * step, py + k3y * step, depth, 0, TMP);
          px += ((k1x + 2 * k2x + 2 * k3x + TMP.x) * step) / 6;
          py += ((k1y + 2 * k2y + 2 * k3y + TMP.y) * step) / 6;
          if (Math.abs(px) > 4 || Math.abs(py) > 3.2) break;
          const [sx, sy] = toScreen(px, py);
          ctx.lineTo(sx, sy);
        }
        ctx.stroke();
      }
    };

    draw();
    const observer = new ResizeObserver(draw);
    observer.observe(el);
    return () => observer.disconnect();
  }, [seeds, step, depth, length]);

  return (
    <div>
      <div className="border border-hairline bg-surface/30">
        <div className="flex items-baseline justify-between border-b border-hairline px-3 py-2">
          <span className="mono-label">FIG / F(x,y,z) — RK4 TRAJECTORIES</span>
          <span className="mono-label">z = {depth.toFixed(2)}</span>
        </div>
        <canvas ref={canvas} className="block aspect-[16/10] w-full" aria-hidden="true" />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Control label="SEEDS" value={seeds} min={10} max={220} step={10} onChange={setSeeds} />
        <Control label="STEP h" value={step} min={0.01} max={0.14} step={0.01} onChange={setStep} format={(v) => v.toFixed(2)} />
        <Control label="SLICE z" value={depth} min={-1.5} max={1.5} step={0.1} onChange={setDepth} format={(v) => v.toFixed(1)} />
        <Control label="LENGTH" value={length} min={20} max={260} step={20} onChange={setLength} />
      </div>

      <p className="mt-4 max-w-[62ch] text-read-sm text-graphite">
        F(x,y,z) = ⟨A·sin(z+p) + C·cos(1.15y), B·sin(1.1x) + A·cos(z+0.6p), C·sin(0.95y−p) +
        B·cos(x)⟩ with A = 1.0, B = 0.72, C = 0.58. Trajectories are integrated in a single z-slice;
        the drawing is deterministic, so the same parameters always produce the same plate.
      </p>
    </div>);

}

interface ControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: (value: number) => string;
}

function Control({ label, value, min, max, step, onChange, format }: ControlProps) {
  const id = `lab-${label.replace(/\s/g, '-').toLowerCase()}`;
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="mono-label">
          {label}
        </label>
        <span className="mono-label text-ink">{format ? format(value) : value}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full cursor-pointer accent-accent" />

    </div>);

}