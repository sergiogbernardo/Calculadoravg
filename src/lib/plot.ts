import { math } from './engine';

export interface PlotPoint {
  x: number;
  y: number;
}

export interface PlotData {
  points: PlotPoint[];
  yMin: number;
  yMax: number;
}

// Sample f(x) across [xMin, xMax]. Non-finite values (asymptotes, domain gaps)
// are dropped so the caller can break the line cleanly.
export function samplePlot(
  expression: string,
  xMin: number,
  xMax: number,
  samples = 400,
): PlotData {
  const compiled = math.compile(expression);
  const points: PlotPoint[] = [];
  let yMin = Infinity;
  let yMax = -Infinity;

  for (let i = 0; i <= samples; i++) {
    const x = xMin + ((xMax - xMin) * i) / samples;
    let y: number;
    try {
      y = compiled.evaluate({ x });
    } catch {
      continue;
    }
    if (typeof y !== 'number' || !Number.isFinite(y)) {
      points.push({ x, y: NaN });
      continue;
    }
    points.push({ x, y });
    if (y < yMin) yMin = y;
    if (y > yMax) yMax = y;
  }

  if (!Number.isFinite(yMin) || !Number.isFinite(yMax)) {
    yMin = -1;
    yMax = 1;
  } else if (yMin === yMax) {
    yMin -= 1;
    yMax += 1;
  }

  return { points, yMin, yMax };
}
