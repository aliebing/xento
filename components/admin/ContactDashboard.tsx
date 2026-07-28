'use client';

import { useEffect, useState } from 'react';

type ContactEntry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  message: string;
  created_at: string;
};

export default function ContactDashboard() {
  const [entries, setEntries] = useState<ContactEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadEntries = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/contact');
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Daten konnten nicht geladen werden.');
      }

      setEntries(result.data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadEntries();
  }, []);

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0b111e]/80 p-6 shadow-2xl shadow-cyan-500/10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Admin Dashboard</h2>
          <p className="mt-2 text-sm text-gray-400 max-w-2xl">
            Hier siehst du die zuletzt eingegangenen Kontaktanfragen. Die Daten kommen direkt aus der Supabase-Datenbank.
          </p>
        </div>
        <button
          type="button"
          onClick={loadEntries}
          className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-400"
        >
          Aktualisieren
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-dashed border-cyan-500/40 bg-[#060b13] p-8 text-center text-gray-300">
          Lade Kontaktanfragen...
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-red-500/30 bg-[#1d1313] p-8 text-center text-red-200">
          {error}
        </div>
      ) : entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-500/40 bg-[#060b13] p-8 text-center text-gray-300">
          Es sind noch keine Kontaktanfragen eingegangen.
        </div>
      ) : (
        <div className="space-y-5">
          {entries.map((entry) => (
            <div key={entry.id} className="rounded-3xl border border-white/10 bg-[#09101a] p-6 shadow-xl shadow-slate-900/20">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                    <span className="rounded-full bg-white/5 px-3 py-1">{entry.service ?? 'Keine Dienstleistung angegeben'}</span>
                    <span className="rounded-full bg-white/5 px-3 py-1">{new Date(entry.created_at).toLocaleString('de-DE')}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white">{entry.name}</h3>
                  <p className="text-sm text-gray-300">{entry.email}</p>
                </div>
                <div className="space-y-2 text-right text-sm text-gray-400">
                  <p>{entry.company ?? 'Keine Firma angegeben'}</p>
                </div>
              </div>

              <div className="mt-5 rounded-3xl border border-white/10 bg-[#060b13] p-4 text-sm leading-7 text-gray-200">
                {entry.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
