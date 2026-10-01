import { test } from 'node:test';
import assert from 'node:assert/strict';
import { MAX_FIELD_LENGTH, serviceLabelDe, validateContactPayload } from '../lib/contact';

const valid = {
  name: ' Jane Doe ',
  email: 'jane@example.com',
  company: ' Example Ltd. ',
  service: 'development',
  message: 'Hello',
  lang: 'de',
};

test('accepts a valid payload and trims values', () => {
  const result = validateContactPayload(valid);
  assert.deepEqual(result, {
    ok: true,
    value: {
      name: 'Jane Doe',
      email: 'jane@example.com',
      company: 'Example Ltd.',
      service: 'development',
      message: 'Hello',
      lang: 'de',
    },
  });
});

test('company is optional and becomes null', () => {
  const result = validateContactPayload({ ...valid, company: '   ' });
  assert.equal(result.ok && result.value.company, null);
});

test('lang is stored only when supported', () => {
  for (const lang of ['fr', 'EN', 42, undefined, null]) {
    const result = validateContactPayload({ ...valid, lang });
    assert.equal(result.ok && result.value.lang, null, `lang ${String(lang)}`);
  }
  const en = validateContactPayload({ ...valid, lang: 'en' });
  assert.equal(en.ok && en.value.lang, 'en');
});

test('rejects missing required fields', () => {
  for (const field of ['name', 'email', 'service', 'message'] as const) {
    assert.deepEqual(validateContactPayload({ ...valid, [field]: '  ' }), {
      ok: false,
      code: 'missing_fields',
    });
    assert.deepEqual(validateContactPayload({ ...valid, [field]: 42 }), {
      ok: false,
      code: 'missing_fields',
    });
  }
});

test('rejects bodies that are not objects (malformed JSON becomes null)', () => {
  for (const body of [null, undefined, [], 'text', 42]) {
    assert.deepEqual(validateContactPayload(body), { ok: false, code: 'missing_fields' });
  }
});

test('rejects invalid email addresses', () => {
  for (const email of ['jane', 'jane@', '@example.com', 'jane example@x.de']) {
    assert.deepEqual(validateContactPayload({ ...valid, email }), {
      ok: false,
      code: 'invalid_email',
    });
  }
});

test('rejects fields longer than the limit', () => {
  const tooLong = 'x'.repeat(MAX_FIELD_LENGTH + 1);
  assert.deepEqual(validateContactPayload({ ...valid, message: tooLong }), {
    ok: false,
    code: 'field_too_long',
  });
  const atLimit = validateContactPayload({ ...valid, message: 'x'.repeat(MAX_FIELD_LENGTH) });
  assert.equal(atLimit.ok, true);
});

test('serviceLabelDe maps keys and keeps legacy German labels', () => {
  assert.equal(serviceLabelDe('development'), 'Softwareentwicklung');
  assert.equal(serviceLabelDe('architecture'), 'Architektur & Modernisierung');
  assert.equal(serviceLabelDe('support'), 'Technische Betreuung');
  assert.equal(serviceLabelDe('Beratung & Konzeption'), 'Beratung & Konzeption');
  assert.equal(serviceLabelDe(null), 'Keine Dienstleistung angegeben');
});
