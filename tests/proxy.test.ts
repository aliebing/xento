import { test } from 'node:test';
import assert from 'node:assert/strict';
import { NextRequest } from 'next/server';
import { proxy } from '../proxy';

const req = (path: string, headers: Record<string, string> = {}) =>
  new NextRequest(`http://localhost:3000${path}`, { headers });

test('redirects the root by Accept-Language and falls back to en', () => {
  const de = proxy(req('/', { 'accept-language': 'de-DE,de;q=0.9' }));
  assert.equal(de.status, 307);
  assert.equal(de.headers.get('location'), 'http://localhost:3000/de');

  const fr = proxy(req('/', { 'accept-language': 'fr-FR' }));
  assert.equal(fr.headers.get('location'), 'http://localhost:3000/en');

  const none = proxy(req('/'));
  assert.equal(none.headers.get('location'), 'http://localhost:3000/en');
});

test('keeps path and query when redirecting old deep links', () => {
  const res = proxy(req('/impressum?utm=1', { 'accept-language': 'de' }));
  assert.equal(res.headers.get('location'), 'http://localhost:3000/de/impressum?utm=1');
  const res2 = proxy(req('/datenschutz'));
  assert.equal(res2.headers.get('location'), 'http://localhost:3000/en/datenschutz');
});

test('redirects vary by Accept-Language', () => {
  const res = proxy(req('/'));
  assert.equal(res.headers.get('vary'), 'Accept-Language');
});

test('does not redirect paths that already have a locale', () => {
  for (const path of ['/en', '/de', '/en/impressum', '/de/datenschutz']) {
    const res = proxy(req(path));
    assert.equal(res.headers.get('x-middleware-next'), '1', path);
    assert.equal(res.headers.get('location'), null, path);
  }
});

test('admin is never redirected and still requires basic auth', () => {
  process.env.ADMIN_USER = 'user';
  process.env.ADMIN_PASS = 'secret';

  for (const path of ['/admin', '/admin/anything']) {
    const denied = proxy(req(path, { 'accept-language': 'de' }));
    assert.equal(denied.status, 401, path);
    assert.equal(denied.headers.get('location'), null, path);
    assert.ok(denied.headers.get('www-authenticate'));
  }

  const credentials = Buffer.from('user:secret').toString('base64');
  const ok = proxy(req('/admin', { authorization: `Basic ${credentials}` }));
  assert.equal(ok.headers.get('x-middleware-next'), '1');
});
