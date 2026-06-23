import { useEffect, useMemo, useState } from 'react';
import { evaluateNotepad } from '../lib/engine';

const STORAGE_KEY = 'calculadoravg.notepad';

const SAMPLE = `# Calculadoravg — escreva uma conta por linha
preco = 1200
desc = 10% de preco
preco - desc
parcelas = 12
(preco - desc) / parcelas

# unidades
5 km + 300 m in miles
60 mph to m/s

# funções e símbolos
f(x) = x^2 + 1
f(3)
derivative("x^2", "x")`;

export default function NotepadPanel() {
  const [source, setSource] = useState(() => localStorage.getItem(STORAGE_KEY) ?? SAMPLE);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, source);
  }, [source]);

  const lines = useMemo(() => evaluateNotepad(source), [source]);
  const rowCount = Math.max(lines.length, 14);

  const copy = (value: string) => {
    navigator.clipboard?.writeText(value).catch(() => {});
  };

  return (
    <div className="panel overflow-hidden p-0">
      <div className="grid grid-cols-[1fr_13rem]">
        {/* Editor */}
        <textarea
          value={source}
          onChange={(e) => setSource(e.target.value)}
          wrap="off"
          spellCheck={false}
          rows={rowCount}
          className="resize-none whitespace-pre overflow-auto border-r border-emerald-500/10 bg-transparent p-4 font-mono text-sm leading-7 text-slate-100 outline-none"
        />

        {/* Results margin */}
        <div className="overflow-hidden bg-black/40 p-4 font-mono text-sm leading-7">
          {Array.from({ length: rowCount }).map((_, i) => {
            const line = lines[i];
            if (!line) return <div key={i} className="h-7" />;
            if (line.error) {
              return (
                <div key={i} className="h-7 truncate text-red-400/70" title={line.error}>
                  ⚠ {line.error}
                </div>
              );
            }
            if (line.result == null || line.result === '') return <div key={i} className="h-7" />;
            return (
              <button
                key={i}
                type="button"
                onClick={() => copy(line.result!)}
                title="clique para copiar"
                className="block h-7 w-full truncate text-right text-emerald-300 transition hover:text-emerald-200"
              >
                {line.result}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-emerald-500/10 px-4 py-2 font-mono text-[11px] text-slate-500">
        variáveis e funções persistem entre as linhas · suporta unidades (km, mph, GB…), derivative, simplify · salvo localmente
      </div>
    </div>
  );
}
