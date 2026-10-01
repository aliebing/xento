import { timingSafeEqual } from 'crypto';

/**
 * Zentrale Basic-Auth-Prüfung für den Admin-Bereich.
 *
 * Wird sowohl von der Middleware (schützt /admin/*) als auch vom
 * /api/contact-Route-Handler (schützt GET) verwendet, damit es nur eine
 * Implementierung gibt, die im Fall einer Änderung nicht auseinanderlaufen
 * kann.
 *
 * Es gibt bewusst KEINEN Fallback auf Standard-Zugangsdaten: Fehlen
 * ADMIN_USER/ADMIN_PASS, gilt jede Anfrage als nicht autorisiert, statt sich
 * gegen ein bekanntes Default-Passwort ("admin"/"admin") authentifizieren zu
 * lassen.
 */

const REALM = 'Xento Admin';

function timingSafeStringEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  // Unterschiedliche Länge sofort im Zeitverhalten zu erkennen ist hier nicht
  // sicherheitsrelevant (Nutzername/Passwortlänge sind kein Geheimnis-relevantes
  // Leck) - wichtig ist nur, dass der Byte-Vergleich selbst timing-safe ist.
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function expectedAuthHeader(): string | null {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;
  if (!user || !pass) return null;
  return `Basic ${Buffer.from(`${user}:${pass}`).toString('base64')}`;
}

export function isAuthorizedAdminRequest(authorizationHeader: string | null): boolean {
  const expected = expectedAuthHeader();
  if (!expected) {
    console.error('ADMIN_USER/ADMIN_PASS ist nicht gesetzt – Admin-Bereich bleibt für alle gesperrt.');
    return false;
  }
  if (!authorizationHeader) return false;
  return timingSafeStringEqual(authorizationHeader, expected);
}

/** Response-Init für eine 401-Antwort mit korrektem WWW-Authenticate-Header. */
export function unauthorizedInit(): ResponseInit {
  return {
    status: 401,
    headers: { 'WWW-Authenticate': `Basic realm="${REALM}"` },
  };
}
