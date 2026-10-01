import { NextResponse } from 'next/server';
import { fetchRecentContactMessages, getServiceRoleClient, isSupabaseConfigured } from '@/lib/supabase';
import { isAuthorizedAdminRequest, unauthorizedInit } from '@/lib/auth';
import { getClientIp, isRateLimited } from '@/lib/rateLimit';
import { validateContactPayload } from '@/lib/contact';

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      console.error('Supabase env not configured (POST)');
      return NextResponse.json({ code: 'server_not_configured' }, { status: 500 });
    }

    // Einfacher Spam-Schutz: max. 5 Anfragen pro IP und 10 Minuten.
    const ip = getClientIp(request);
    if (isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ code: 'rate_limited' }, { status: 429 });
    }

    // Ungültiges JSON wird wie ein leerer Body behandelt (400 statt 500).
    const body: unknown = await request.json().catch(() => null);
    const result = validateContactPayload(body);
    if (!result.ok) {
      return NextResponse.json({ code: result.code }, { status: 400 });
    }

    const supabase = getServiceRoleClient();

    // Speichern inklusive Firma, Leistung und Sprache der Anfrage
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([result.value])
      .select();

    if (error) {
      console.error('Supabase DB-Fehler:', error);
      return NextResponse.json({ code: 'save_failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Serverfehler:', error);
    return NextResponse.json({ code: 'internal' }, { status: 500 });
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
