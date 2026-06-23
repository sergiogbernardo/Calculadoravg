import { all, create, type MathJsInstance } from 'mathjs';

// One configured math.js instance powers every mode: numeric eval, units,
// user-defined variables/functions and symbolic algebra (derivative/simplify).
export const math: MathJsInstance = create(all, { number: 'number' });

// math.js knows `mile`, `hour`, `km`, etc. but not the common abbreviation
// `mph`; define it so expressions like "60 mph to m/s" work as expected.
try {
  math.createUnit('mph', { definition: '1 mile/hour' });
} catch {
  // Already defined — ignore.
}

export interface EvalResult {
  result: string | null;
  error: string | null;
}

// Light natural-language sugar for percentages, kept intentionally small:
//   "10% de 1290" -> "(10/100)*1290"
//   standalone "20%" -> "(20/100)"
// Note: this repurposes `%`, so use `mod(a, b)` for modulo.
function preprocess(expr: string): string {
  return expr
    .replace(/(\d+(?:\.\d+)?)\s*%\s+de\s+/gi, '($1/100)*')
    .replace(/(\d+(?:\.\d+)?)\s*%/g, '($1/100)');
}

function formatValue(value: unknown): string {
  if (value === undefined || value === null) return '';
  if (typeof value === 'function') return 'ƒ definida';
  if (typeof value === 'boolean') return value ? 'verdadeiro' : 'falso';

  // Symbolic results (derivative/simplify) come back as expression nodes.
  if (typeof value === 'object' && value !== null && 'isNode' in value) {
    return (value as { toString: () => string }).toString();
  }

  if (typeof value === 'number') {
    if (Number.isInteger(value)) return String(value);
    return parseFloat(value.toFixed(10)).toString();
  }

  try {
    return math.format(value, { precision: 10 });
  } catch {
    return String(value);
  }
}

function toMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Expressão inválida';
}

// Evaluate a single, self-contained expression (used by the keypad).
export function evaluate(expression: string): EvalResult {
  const expr = expression.trim();
  if (!expr) return { result: null, error: null };
  try {
    return { result: formatValue(math.evaluate(preprocess(expr))), error: null };
  } catch (e) {
    return { result: null, error: toMessage(e) };
  }
}

export interface NotepadLine {
  text: string;
  result: string | null;
  error: string | null;
}

// Evaluate a notepad: every line shares one parser scope, so variables and
// functions defined on earlier lines are available later. Blank lines and
// comments (`#` or `//`) produce no result.
export function evaluateNotepad(source: string): NotepadLine[] {
  const parser = math.parser();
  return source.split('\n').map((text) => {
    const trimmed = text.trim();
    if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) {
      return { text, result: null, error: null };
    }
    try {
      return { text, result: formatValue(parser.evaluate(preprocess(trimmed))), error: null };
    } catch (e) {
      return { text, result: null, error: toMessage(e) };
    }
  });
}
