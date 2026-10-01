/**
 * Sehr einfaches In-Memory Rate-Limiting pro IP-Adresse.
 *
 * Bewusster Trade-off: Für ein Kontaktformular auf einem einzelnen Node-Prozess
 * reicht das, um simple Spam-Bots zu bremsen. In einer horizontal skalierten
 * Serverless-Umgebung mit mehreren Instanzen wird der Zähler NICHT geteilt
 * (jede Instanz zählt für sich) - für einen echten, instanzübergreifenden
 * Schutz müsste ein externer Store (z. B. Redis/Upstash) angebunden werden.
 * Für den aktuellen Umfang dieser Seite ist das jedoch eine bewusste,
 * dokumentierte Vereinfachung statt eines stillschweigenden Fehlens.
 */

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

export function isRateLimited(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > windowMs) {
    buckets.set(key, { count: 1, windowStart: now });
    return false;
  }

  bucket.count += 1;
  return bucket.count > limit;
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) return forwardedFor.split(',')[0].trim();
  return request.headers.get('x-real-ip') ?? 'unknown';
}
