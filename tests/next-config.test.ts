import { test } from 'node:test';
import assert from 'node:assert/strict';
// Next's eigener Abgleich für allowedDevOrigins (gleiche Funktion wie im Dev-Server).
import { isCsrfOriginAllowed } from 'next/dist/server/app-render/csrf-protection';
import nextConfig from '../next.config';

// Regression: Ruft man den Dev-Server vom Handy über die LAN-Adresse auf, blockiert Next
// alle /_next-Skripte (403). Die Seite wird nie hydriert und das mobile Menü bleibt tot.
test('dev server may be opened from a phone on the home network', () => {
  const allowed = nextConfig.allowedDevOrigins ?? [];
  assert.equal(isCsrfOriginAllowed('192.168.178.20', allowed), true);
  assert.equal(isCsrfOriginAllowed('192.168.1.42', allowed), true);
});

test('arbitrary hosts stay blocked in dev', () => {
  const allowed = nextConfig.allowedDevOrigins ?? [];
  for (const host of ['evil.example.com', '8.8.8.8', '10.0.0.5', '192.169.1.1']) {
    assert.equal(isCsrfOriginAllowed(host, allowed), false, host);
  }
});
