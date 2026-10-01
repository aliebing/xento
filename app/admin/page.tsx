import ContactDashboard from '@/components/admin/ContactDashboard';
import Navbar from '@/components/ui/NavBar';
import Footer from '@/components/ui/Footer';
import { fetchRecentContactMessages, isSupabaseConfigured } from '@/lib/supabase';
import type { ContactMessage } from '@/lib/supabase';

export default async function AdminPage() {
  // Server-side fetch using service role key (never exposed to client)
  let entries: ContactMessage[] = [];
  if (isSupabaseConfigured()) {
    try {
      entries = await fetchRecentContactMessages(50);
    } catch {
      // Fehler ist bereits in fetchRecentContactMessages geloggt; Seite bleibt
      // trotzdem nutzbar und zeigt den leeren Zustand an.
    }
  }

  return (
    <div className="bg-[#060b13] min-h-screen text-white">
      <Navbar minimal />
      <main className="pt-28 pb-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 rounded-3xl border border-white/10 bg-[#0d1420]/80 p-8 shadow-2xl shadow-black/20">
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.24em] text-cyan-300/80">Admin Dashboard</p>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">Kontaktanfragen verwalten</h1>
              <p className="max-w-3xl text-base text-gray-400">
                Hier siehst du die zuletzt eingegangenen Kontaktanfragen und kannst die Daten jederzeit aktualisieren.
              </p>
            </div>
          </div>

          <ContactDashboard initialEntries={entries} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
