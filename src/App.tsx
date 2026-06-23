import { useState } from 'react';
import MatrixRain from './components/MatrixRain';
import TopBar from './components/TopBar';
import NotepadPanel from './components/NotepadPanel';
import KeypadPanel from './components/KeypadPanel';
import FinancialPanel from './components/FinancialPanel';
import PlotPanel from './components/PlotPanel';

const TABS = [
  { id: 'notepad', label: 'Notepad' },
  { id: 'keypad', label: 'Teclado' },
  { id: 'financial', label: 'Financeira' },
  { id: 'plot', label: 'Gráfico' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function App() {
  const [tab, setTab] = useState<TabId>('notepad');

  return (
    <div className="relative min-h-screen bg-grid-glow">
      <MatrixRain />
      <div className="relative z-10">
        <TopBar />

      <nav className="sticky top-[57px] z-10 border-b border-emerald-500/10 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 lg:px-6">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap border-b-2 px-3 py-3 font-display text-sm font-semibold transition ${
                tab === t.id
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="mx-auto w-full max-w-5xl px-4 py-8 lg:px-6">
        {tab === 'notepad' && <NotepadPanel />}
        {tab === 'keypad' && <KeypadPanel />}
        {tab === 'financial' && <FinancialPanel />}
        {tab === 'plot' && <PlotPanel />}
      </main>

        <footer className="border-t border-emerald-500/10 py-6 text-center font-mono text-xs text-slate-600">
          © 2026 Sergio Bernardo
        </footer>
      </div>
    </div>
  );
}
