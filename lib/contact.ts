import { hasLocale, type Locale } from './i18n/config';

export const MAX_FIELD_LENGTH = 5000;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ContactErrorCode = 'missing_fields' | 'invalid_email' | 'field_too_long';

export type ContactInput = {
  name: string;
  email: string;
  company: string | null;
  service: string;
  message: string;
  lang: Locale | null;
};

export type ContactValidation =
  | { ok: true; value: ContactInput }
  | { ok: false; code: ContactErrorCode };

function asTrimmedString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export function validateContactPayload(body: unknown): ContactValidation {
  if (typeof body !== 'object' || body === null || Array.isArray(body)) {
    return { ok: false, code: 'missing_fields' };
  }
  const payload = body as Record<string, unknown>;

  const name = asTrimmedString(payload.name);
  const email = asTrimmedString(payload.email);
  const company = asTrimmedString(payload.company);
  const service = asTrimmedString(payload.service);
  const message = asTrimmedString(payload.message);

  if (!name || !email || !service || !message) return { ok: false, code: 'missing_fields' };
  if (!EMAIL_REGEX.test(email)) return { ok: false, code: 'invalid_email' };

  for (const value of [name, email, company, service, message]) {
    if (value && value.length > MAX_FIELD_LENGTH) return { ok: false, code: 'field_too_long' };
  }

  const lang = hasLocale(payload.lang) ? payload.lang : null;
  return { ok: true, value: { name, email, company, service, message, lang } };
}

// Das Admin-Dashboard ist deutsch. Ältere Einträge enthalten noch den deutschen Klartext
// statt eines Schlüssels; unbekannte Werte werden unverändert angezeigt.
const SERVICE_LABELS_DE: Record<string, string> = {
  development: 'Softwareentwicklung',
  architecture: 'Architektur & Modernisierung',
  support: 'Technische Betreuung',
};

export function serviceLabelDe(service: string | null): string {
  if (!service) return 'Keine Dienstleistung angegeben';
  return SERVICE_LABELS_DE[service] ?? service;
}
