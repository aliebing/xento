import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';
import assert from 'node:assert/strict';

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const load = (name: 'en' | 'de'): Json =>
  JSON.parse(readFileSync(join(process.cwd(), 'lib/i18n/dictionaries', `${name}.json`), 'utf8'));

const en = load('en');
const de = load('de');

function shape(value: Json): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([key, inner]) => [key, shape(inner)]),
    );
  }
  return typeof value;
}

function strings(value: Json): string[] {
  if (typeof value === 'string') return [value];
  if (Array.isArray(value)) return value.flatMap(strings);
  if (value !== null && typeof value === 'object') return Object.values(value).flatMap(strings);
  return [];
}

type Dict = {
  services: { items: unknown[] };
  experience: { projects: { tags: string[] }[]; ownProject: { tags: string[] } };
  technologies: { furtherItems: string[] };
  about: { features: unknown[] };
  footer: { copyright: string };
};

test('en and de have identical structure', () => {
  assert.deepEqual(shape(de), shape(en));
});

test('no empty strings', () => {
  for (const [name, dict] of [['en', en], ['de', de]] as const) {
    for (const text of strings(dict)) {
      assert.notEqual(text.trim(), '', `empty string in ${name}`);
    }
  }
});

test('list lengths match the components', () => {
  for (const dict of [en, de] as unknown as Dict[]) {
    assert.equal(dict.services.items.length, 3);
    assert.equal(dict.experience.projects.length, 5);
    assert.equal(dict.about.features.length, 3);
  }
});

test('technology names are language-neutral', () => {
  const a = en as unknown as Dict;
  const b = de as unknown as Dict;
  assert.deepEqual(
    a.experience.projects.map((p) => p.tags),
    b.experience.projects.map((p) => p.tags),
  );
  assert.deepEqual(a.experience.ownProject.tags, b.experience.ownProject.tags);
  assert.deepEqual(a.technologies.furtherItems, b.technologies.furtherItems);
});

test('footer copyright keeps the year placeholder', () => {
  assert.ok((en as unknown as Dict).footer.copyright.includes('{year}'));
  assert.ok((de as unknown as Dict).footer.copyright.includes('{year}'));
});

test('copy rules: expert voice, one brand name, no freelance wording', () => {
  const enText = strings(en).join('\n');
  const deText = strings(de).join('\n');
  assert.doesNotMatch(enText, /\b(we|our|ours|us)\b/i);
  assert.doesNotMatch(deText, /\b(wir|unser\w*|uns)\b/i);
  for (const text of [enText, deText]) {
    assert.doesNotMatch(text, /IT-Services/);
    assert.doesNotMatch(text, /freelance/i);
    assert.doesNotMatch(text, /\d+\s?%/);
  }
});
