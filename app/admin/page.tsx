import ContactDashboard from '@/components/admin/ContactDashboard';
import Navbar from '@/components/ui/NavBar';
import Footer from '@/components/ui/Footer';
import { createClient } from '@supabase/supabase-js';

export default async function AdminPage() {
  // Server-side fetch using service role key (never exposed to client)
  const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let entries = [];
  if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY) {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase error on admin page:', error);
    } else {
      entries = data ?? [];
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
