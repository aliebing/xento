import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Zentrale Fabrik für den serverseitigen Supabase-Client.
 *
 * Wichtig: Diese Datei darf NIEMALS von Client-Components importiert werden,
 * da der Service-Role-Key sämtliche Row-Level-Security-Regeln umgeht.
 * Nur in Server Components, Route Handlern oder Scripts verwenden.
 */

let cachedClient: SupabaseClient | null = null;

export class SupabaseConfigError extends Error {
  constructor() {
    super('Supabase ist nicht konfiguriert: SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY fehlt.');
    this.name = 'SupabaseConfigError';
  }
}

function readConfig() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  return { url, serviceRoleKey };
}

export function isSupabaseConfigured(): boolean {
  const { url, serviceRoleKey } = readConfig();
  return Boolean(url && serviceRoleKey);
}

/**
 * Liefert einen (lazy erzeugten, gecachten) Supabase-Client mit Service-Role-Key.
 * Wirft SupabaseConfigError, wenn die Umgebungsvariablen fehlen, statt eine
 * Client-Instanz mit `undefined`-Werten anzulegen.
 */
export function getServiceRoleClient(): SupabaseClient {
  if (cachedClient) return cachedClient;

  const { url, serviceRoleKey } = readConfig();
  if (!url || !serviceRoleKey) {
    console.error('Supabase env vars missing: SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL oder SUPABASE_SERVICE_ROLE_KEY');
    throw new SupabaseConfigError();
  }

  cachedClient = createClient(url, serviceRoleKey);
  return cachedClient;
}

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  service: string | null;
  message: string;
  created_at: string;
};

/** Lädt die zuletzt eingegangenen Kontaktanfragen (neueste zuerst). */
export async function fetchRecentContactMessages(limit = 50): Promise<ContactMessage[]> {
  const supabase = getServiceRoleClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Supabase DB-Fehler beim Laden der Kontaktanfragen:', error);
    throw error;
  }

  return data ?? [];
}
