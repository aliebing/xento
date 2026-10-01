import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  defaultLocale,
  hasLocale,
  locales,
  negotiateLocale,
  switchLocalePath,
} from '../lib/i18n/config';

test('locales and default locale', () => {
  assert.deepEqual([...locales], ['en', 'de']);
  assert.equal(defaultLocale, 'en');
});

test('hasLocale accepts only supported locales', () => {
  assert.equal(hasLocale('en'), true);
  assert.equal(hasLocale('de'), true);
  for (const bad of ['fr', 'EN', 'de-DE', '', 'admin', undefined, null, 42]) {
    assert.equal(hasLocale(bad), false, `expected ${String(bad)} to be rejected`);
  }
});

test('negotiateLocale picks the best supported language', () => {
  assert.equal(negotiateLocale('de-DE,de;q=0.9,en;q=0.8'), 'de');
  assert.equal(negotiateLocale('en-US,en;q=0.9,de;q=0.8'), 'en');
  assert.equal(negotiateLocale('de;q=0.4,en;q=0.9'), 'en');
  assert.equal(negotiateLocale('fr-FR,fr;q=0.9,de;q=0.5'), 'de');
});

test('negotiateLocale falls back to en for missing, empty or unusable headers', () => {
  for (const header of [null, undefined, '', '*', 'fr-FR,fr;q=0.9', 'de;q=0', ';;;', 'de;q=abc']) {
    assert.equal(negotiateLocale(header), 'en', `header ${JSON.stringify(header)}`);
  }
});

test('switchLocalePath swaps or adds the locale prefix', () => {
  assert.equal(switchLocalePath('/en', 'de'), '/de');
  assert.equal(switchLocalePath('/en/impressum', 'de'), '/de/impressum');
  assert.equal(switchLocalePath('/de/datenschutz', 'en'), '/en/datenschutz');
  assert.equal(switchLocalePath('/', 'de'), '/de');
  assert.equal(switchLocalePath('/impressum', 'en'), '/en/impressum');
  assert.equal(switchLocalePath('/fr/impressum', 'en'), '/en/fr/impressum');
});
