import { NextResponse } from 'next/server';
import { fetchRecentContactMessages, getServiceRoleClient, isSupabaseConfigured } from '@/lib/supabase';
import { isAuthorizedAdminRequest, unauthorizedInit } from '@/lib/auth';
import { getClientIp, isRateLimited } from '@/lib/rateLimit';

const MAX_FIELD_LENGTH = 5000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type ContactPayload = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  service?: unknown;
  message?: unknown;
};

function asTrimmedString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      console.error('Supabase env not configured (POST)');
      return NextResponse.json(
        { error: 'Server not configured: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing' },
        { status: 500 },
      );
    }

    // Einfacher Spam-Schutz: max. 5 Anfragen pro IP und 10 Minuten.
    const ip = getClientIp(request);
    if (isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json(
        { error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' },
        { status: 429 },
      );
    }

    const body = (await request.json()) as ContactPayload;

    const name = asTrimmedString(body.name);
    const email = asTrimmedString(body.email);
    const company = asTrimmedString(body.company);
    const service = asTrimmedString(body.service);
    const message = asTrimmedString(body.message);

    // Pflichtfelder prüfen
    if (!name || !email || !service || !message) {
      return NextResponse.json({ error: 'Bitte füllen Sie alle Pflichtfelder aus.' }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Bitte geben Sie eine gültige E-Mail-Adresse an.' }, { status: 400 });
    }

    for (const [field, value] of Object.entries({ name, email, company, service, message })) {
      if (value && value.length > MAX_FIELD_LENGTH) {
        return NextResponse.json({ error: `Feld "${field}" ist zu lang.` }, { status: 400 });
      }
    }

    const supabase = getServiceRoleClient();

    // Speichern inklusive Firma und Dienstleistungstyp
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([{ name, email, company, service, message }])
      .select();

    if (error) {
      console.error('Supabase DB-Fehler:', error);
      return NextResponse.json({ error: 'Fehler beim Sichern der Formulardaten.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Serverfehler:', error);
    return NextResponse.json({ error: 'Interner Server-Verarbeitungsfehler.' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const auth = request.headers.get('authorization');
    if (!isAuthorizedAdminRequest(auth)) {
      return NextResponse.json({ error: 'Unauthorized' }, unauthorizedInit());
    }

    if (!isSupabaseConfigured()) {
      console.error('Supabase env not configured (GET)');
      return NextResponse.json(
        { error: 'Server not configured: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing' },
        { status: 500 },
      );
    }

    const data = await fetchRecentContactMessages(50);
    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Serverfehler (GET):', error);
    return NextResponse.json({ error: 'Interner Server-Verarbeitungsfehler.' }, { status: 500 });
  }
}
