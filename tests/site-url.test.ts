import { test } from 'node:test';
import assert from 'node:assert/strict';
import { siteOrigin } from '../lib/siteUrl';

// Regression: In Vercel stand NEXT_PUBLIC_SITE_URL mit Sprachpfad; og:url wurde zu /de/de (404 bei LinkedIn).
test('a path in NEXT_PUBLIC_SITE_URL is dropped', () => {
  assert.equal(siteOrigin('https://xento-phi.vercel.app/de').href, 'https://xento-phi.vercel.app/');
  assert.equal(siteOrigin('https://xento.de/en/').href, 'https://xento.de/');
});

test('missing or broken values fall back to the default domain', () => {
  assert.equal(siteOrigin(undefined).href, 'https://xento-phi.vercel.app/');
  assert.equal(siteOrigin('').href, 'https://xento-phi.vercel.app/');
  assert.equal(siteOrigin('not a url').href, 'https://xento-phi.vercel.app/');
});

test('relative metadata paths resolve without a doubled locale', () => {
  assert.equal(new URL('/de', siteOrigin('https://xento-phi.vercel.app/de')).href, 'https://xento-phi.vercel.app/de');
});
