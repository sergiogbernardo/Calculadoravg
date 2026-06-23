import { useEffect, useMemo, useState } from 'react';
import { evaluate } from '../lib/engine';

const STORAGE_KEY = 'calculadoravg.history';

interface HistoryItem {
  expr: string;
  result: string;
}

function pretty(expr: string): string {
  return expr.replace(/\*/g, '×').replace(/\//g, '÷').replace(/sqrt/g, '√').replace(/pi\b/g, 'π');
}

const FUNCTIONS = ['sin(', 'cos(', 'tan(', 'sqrt(', 'ln(', 'log10(', 'pi', 'e'];

export default function KeypadPanel() {
  const [expr, setExpr] = useState('');
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 30)));
  }, [history]);

  const preview = useMemo(() => evaluate(expr), [expr]);

  const append = (token: string) => setExpr((p) => p + token);
  const clear = () => setExpr('');
  const backspace = () => setExpr((p) => p.slice(0, -1));

  const equals = () => {
    const out = evaluate(expr);
    if (out.result != null && out.result !== '') {
      setHistory((h) => [{ expr, result: out.result! }, ...h].slice(0, 30));
      setExpr(out.result);
    }
  };

  const memoryAction = (action: 'MC' | 'MR' | 'M+' | 'M-') => {
    if (action === 'MC') return setMemory(0);
    if (action === 'MR') return append(String(memory));
    const current = Number(evaluate(expr).result);
    if (!Number.isNaN(current)) setMemory((m) => (action === 'M+' ? m + current : m - current));
  };

  const Btn = ({
    label,
    onClick,
    variant = 'num',
  }: {
    label: string;
    onClick: () => void;
    variant?: 'num' | 'op' | 'fn' | 'eq';
  }) => {
    const styles = {
      num: 'border-emerald-500/15 bg-black/40 text-slate-100 hover:border-emerald-400/40',
      op: 'border-emerald-500/20 bg-emerald-500/5 text-emerald-200 hover:border-emerald-400/50',
      fn: 'border-emerald-500/10 bg-black/30 text-slate-300 hover:border-emerald-400/40',
      eq: 'border-emerald-400/60 bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30',
    }[variant];
    return (
      <button
        type="button"
        onClick={onClick}
        className={`rounded-lg border py-3 font-mono text-sm transition ${styles}`}
      >
        {label}
      </button>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_15rem]">
      <div className="panel space-y-4">
        <div className="rounded-xl border border-emerald-500/10 bg-black/60 p-4">
          <div className="min-h-[1.5rem] break-all text-right font-mono text-lg text-slate-200">
            {pretty(expr) || '0'}
          </div>
          <div className="mt-1 min-h-[1.25rem] text-right font-mono text-sm text-emerald-300/80">
            {expr && (preview.error ? '—' : preview.result && `= ${preview.result}`)}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {FUNCTIONS.map((f) => (
            <Btn key={f} label={f.replace('(', '').replace('log10', 'log')} onClick={() => append(f)} variant="fn" />
          ))}
          <Btn label="^" onClick={() => append('^')} variant="fn" />
        </div>

        <div className="grid grid-cols-4 gap-2">
          {(['MC', 'MR', 'M+', 'M-'] as const).map((m) => (
            <Btn key={m} label={m} onClick={() => memoryAction(m)} variant="fn" />
          ))}

          <Btn label="C" onClick={clear} variant="op" />
          <Btn label="⌫" onClick={backspace} variant="op" />
          <Btn label="(" onClick={() => append('(')} variant="op" />
          <Btn label=")" onClick={() => append(')')} variant="op" />

          <Btn label="7" onClick={() => append('7')} />
          <Btn label="8" onClick={() => append('8')} />
          <Btn label="9" onClick={() => append('9')} />
          <Btn label="÷" onClick={() => append('/')} variant="op" />

          <Btn label="4" onClick={() => append('4')} />
          <Btn label="5" onClick={() => append('5')} />
          <Btn label="6" onClick={() => append('6')} />
          <Btn label="×" onClick={() => append('*')} variant="op" />

          <Btn label="1" onClick={() => append('1')} />
          <Btn label="2" onClick={() => append('2')} />
          <Btn label="3" onClick={() => append('3')} />
          <Btn label="−" onClick={() => append('-')} variant="op" />

          <Btn label="0" onClick={() => append('0')} />
          <Btn label="." onClick={() => append('.')} />
          <Btn label="%" onClick={() => append('%')} variant="op" />
          <Btn label="+" onClick={() => append('+')} variant="op" />

          <div className="col-span-3">
            <button
              type="button"
              onClick={equals}
              className="w-full rounded-lg border border-emerald-400/60 bg-emerald-500/20 py-3 font-mono text-sm text-emerald-100 transition hover:bg-emerald-500/30"
            >
              =
            </button>
          </div>
          <Btn label="π" onClick={() => append('pi')} variant="fn" />
        </div>
        {memory !== 0 && (
          <p className="font-mono text-[11px] text-slate-500">memória: {memory}</p>
        )}
      </div>

      <div className="panel">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="panel-title mb-0">Histórico</h2>
          {history.length > 0 && (
            <button
              type="button"
              onClick={() => setHistory([])}
              className="font-mono text-[10px] uppercase tracking-wider text-slate-500 hover:text-emerald-300"
            >
              limpar
            </button>
          )}
        </div>
        <div className="space-y-1.5">
          {history.length === 0 && <p className="font-mono text-xs text-slate-600">vazio</p>}
          {history.map((h, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setExpr(h.result)}
              className="block w-full rounded-lg border border-emerald-500/10 px-3 py-1.5 text-left font-mono text-xs transition hover:border-emerald-400/40"
            >
              <span className="block truncate text-slate-500">{pretty(h.expr)}</span>
              <span className="block truncate text-emerald-300">= {h.result}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
