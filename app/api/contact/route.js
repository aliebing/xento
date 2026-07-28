import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Supabase env vars missing: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

export async function POST(request) {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase env not configured (POST)')
      return NextResponse.json({ error: 'Server not configured: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing' }, { status: 500 })
    }
    const body = await request.json();
    const { name, email, company, service, message } = body;

    // Pflichtfelder prüfen
    if (!name || !email || !service || !message) {
      return NextResponse.json({ error: 'Bitte füllen Sie alle Pflichtfelder aus.' }, { status: 400 });
    }

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

export async function GET() {
  try {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Supabase env not configured (GET)')
      return NextResponse.json({ error: 'Server not configured: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY missing' }, { status: 500 })
    }

    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      console.error('Supabase DB-Fehler (GET):', error);
      return NextResponse.json({ error: 'Fehler beim Laden der Formulardaten.' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Serverfehler (GET):', error);
    return NextResponse.json({ error: 'Interner Server-Verarbeitungsfehler.' }, { status: 500 });
  }
}