import { useEffect, useRef, useState } from 'react';
import { samplePlot } from '../lib/plot';

export default function PlotPanel() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fn, setFn] = useState('sin(x)');
  const [xMin, setXMin] = useState('-10');
  const [xMax, setXMax] = useState('10');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const lo = Number(xMin);
    const hi = Number(xMax);
    if (!Number.isFinite(lo) || !Number.isFinite(hi) || lo >= hi) {
      setError('Intervalo de x inválido');
      return;
    }

    let data;
    try {
      data = samplePlot(fn, lo, hi);
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Função inválida');
      return;
    }

    const pad = 28;
    const { yMin, yMax } = data;
    const toX = (x: number) => pad + ((x - lo) / (hi - lo)) * (w - 2 * pad);
    const toY = (y: number) => h - pad - ((y - yMin) / (yMax - yMin)) * (h - 2 * pad);

    // Axes
    ctx.strokeStyle = 'rgba(148,163,184,0.25)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (yMin <= 0 && yMax >= 0) {
      ctx.moveTo(pad, toY(0));
      ctx.lineTo(w - pad, toY(0));
    }
    if (lo <= 0 && hi >= 0) {
      ctx.moveTo(toX(0), pad);
      ctx.lineTo(toX(0), h - pad);
    }
    ctx.stroke();

    // Curve
    ctx.strokeStyle = '#34d399';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let pen = false;
    for (const p of data.points) {
      if (Number.isNaN(p.y)) {
        pen = false;
        continue;
      }
      const px = toX(p.x);
      const py = toY(p.y);
      if (!pen) {
        ctx.moveTo(px, py);
        pen = true;
      } else {
        ctx.lineTo(px, py);
      }
    }
    ctx.stroke();
  }, [fn, xMin, xMax]);

  return (
    <div className="panel space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[12rem] flex-1">
          <label className="field-label">f(x)</label>
          <input className="input" value={fn} onChange={(e) => setFn(e.target.value)} placeholder="sin(x)" />
        </div>
        <div className="w-24">
          <label className="field-label">x mín</label>
          <input className="input" value={xMin} onChange={(e) => setXMin(e.target.value)} />
        </div>
        <div className="w-24">
          <label className="field-label">x máx</label>
          <input className="input" value={xMax} onChange={(e) => setXMax(e.target.value)} />
        </div>
      </div>

      {error && <p className="font-mono text-sm text-red-300">{error}</p>}

      <canvas
        ref={canvasRef}
        width={840}
        height={420}
        className="w-full rounded-xl border border-emerald-500/10 bg-black/60"
      />
    </div>
  );
}
