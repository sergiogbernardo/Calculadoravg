import { useState } from 'react';
import { computeFinancial, type FinancialType } from '../lib/financial';

const TYPES: { id: FinancialType; label: string; fields: ('principal' | 'rate' | 'time' | 'value' | 'percentage')[] }[] = [
  { id: 'simple_interest', label: 'Juros simples', fields: ['principal', 'rate', 'time'] },
  { id: 'compound_interest', label: 'Juros compostos', fields: ['principal', 'rate', 'time'] },
  { id: 'percentage', label: 'Porcentagem de um valor', fields: ['value', 'percentage'] },
  { id: 'percentage_change', label: 'Valor + variação %', fields: ['value', 'percentage'] },
];

const LABELS: Record<string, string> = {
  principal: 'Principal',
  rate: 'Taxa (% por período)',
  time: 'Tempo (períodos)',
  value: 'Valor',
  percentage: 'Porcentagem (%)',
};

export default function FinancialPanel() {
  const [type, setType] = useState<FinancialType>('compound_interest');
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const def = TYPES.find((t) => t.id === type)!;

  const compute = () => {
    setError(null);
    setResult(null);
    const parsed: Record<string, number> = {};
    for (const f of def.fields) {
      const raw = inputs[f];
      if (raw == null || raw === '') {
        setError('Preencha todos os campos');
        return;
      }
      const n = Number(raw);
      if (Number.isNaN(n)) {
        setError(`Valor inválido em ${LABELS[f]}`);
        return;
      }
      parsed[f] = n;
    }
    try {
      setResult(computeFinancial(type, parsed));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro');
    }
  };

  return (
    <div className="mx-auto max-w-lg">
      <div className="panel space-y-4">
        <div>
          <label className="field-label">Cálculo</label>
          <select
            className="input"
            value={type}
            onChange={(e) => {
              setType(e.target.value as FinancialType);
              setResult(null);
              setError(null);
            }}
          >
            {TYPES.map((t) => (
              <option key={t.id} value={t.id} className="bg-slate-900">
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {def.fields.map((f) => (
          <div key={f}>
            <label className="field-label">{LABELS[f]}</label>
            <input
              type="number"
              className="input"
              value={inputs[f] ?? ''}
              onChange={(e) => setInputs((prev) => ({ ...prev, [f]: e.target.value }))}
            />
          </div>
        ))}

        <button type="button" className="btn w-full" onClick={compute}>
          Calcular
        </button>

        {error && <p className="font-mono text-sm text-red-300">{error}</p>}
        {result != null && (
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4 text-center">
            <span className="field-label">Resultado</span>
            <span className="block font-display text-2xl font-bold text-emerald-300">{result}</span>
          </div>
        )}
      </div>
    </div>
  );
}
