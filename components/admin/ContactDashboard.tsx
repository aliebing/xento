"use client";

import { useState } from "react";
import { serviceLabelDe } from "@/lib/contact";

type ContactEntry = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  lang: string | null;
  message: string;
  created_at: string;
};

export default function ContactDashboard({ initialEntries }: { initialEntries?: ContactEntry[] }) {
  const [entries, setEntries] = useState<ContactEntry[]>(initialEntries ?? []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lädt die Daten über den (Basic-Auth-geschützten) GET-Endpoint neu, ohne
  // die komplette Seite neu zu laden. Der Browser sendet die beim initialen
  // Seitenaufruf zwischengespeicherten Basic-Auth-Credentials automatisch mit,
  // solange die Anfrage an denselben Origin geht.
  const refresh = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/contact', { method: 'GET' });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? 'Fehler beim Laden der Kontaktanfragen.');
      }

      setEntries(result.data ?? []);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Etwas ist schiefgelaufen.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="rounded-3xl border border-white/10 bg-[#0b111e]/80 p-6 shadow-2xl shadow-cyan-500/10">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white">Admin Dashboard</h2>
          <p className="mt-2 text-sm text-gray-400 max-w-2xl">
            Hier siehst du die zuletzt eingegangenen Kontaktanfragen. Die Daten wurden serverseitig geladen, sodass keine Geheimnisse im Browser liegen.
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={isLoading}
          className="inline-flex items-center justify-center rounded-full bg-cyan-500 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-400 disabled:opacity-50"
        >
          {isLoading ? 'Lädt...' : 'Aktualisieren'}
        </button>
      </div>

      {error ? (
        <div className="mb-5 rounded-2xl border border-red-500/30 bg-[#1d1313] p-4 text-center text-sm text-red-200">
          {error}
        </div>
      ) : null}

      {isLoading && entries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-cyan-500/40 bg-[#060b13] p-8 text-center text-gray-300">
          Lade Kontaktanfragen...
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
                    <span className="rounded-full bg-white/5 px-3 py-1">{serviceLabelDe(entry.service)}</span>
                    {entry.lang ? (
                      <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-300">{entry.lang.toUpperCase()}</span>
                    ) : null}
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
