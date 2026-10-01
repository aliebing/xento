# Expertenmarke Xento + Zweisprachigkeit (EN/DE) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die Seite tritt einheitlich als Expertenmarke auf (Xento = Marke, Alexander Liebing = Senior-Experte) und ist auf Englisch (Standard) mit Umschalter auf Deutsch unter `/en` und `/de` erreichbar.

**Architecture:** Next.js-16-App-Router mit `app/[lang]/…` als Root-Layout, JSON-Wörterbüchern in `lib/i18n/dictionaries/` und `proxy.ts` für Spracherkennung und Redirect. Der Server lädt das Wörterbuch und reicht jeder Sektion ihren Teil als Props; Client-Komponenten bekommen ihre Texte ebenfalls als Props. Reine Logik (Spracherkennung, Pfadwechsel, Formularvalidierung) liegt in kleinen, getesteten Modulen.

**Tech Stack:** Next.js 16.2.11, React 19.2, TypeScript, Tailwind 4, Supabase (nur Spalte `lang` neu), `tsx` als neue devDependency für Tests (Node 20 kann kein TypeScript direkt).

**Spec:** `docs/superpowers/specs/2026-10-01-expert-brand-i18n-design.md`
Inhaltliches Konzept: `explaining.txt` (bleibt unversioniert im Repo-Root liegen).

## Abweichungen von der Spec (in Task 1 in die Spec eingetragen)

- Wörterbücher liegen in `lib/i18n/dictionaries/` statt `app/[lang]/dictionaries/`, damit `app/` nur Routen enthält und Tests die Dateien ohne Next-Kontext laden können.
- `app/admin` bekommt ein eigenes Root-Layout (`app/admin/layout.tsx`, `lang="de"`). Ohne gemeinsames Layout oberhalb von `app/[lang]` und `app/admin` braucht jede der beiden Routen ein eigenes. Die URL `/admin` bleibt unverändert.
- `/fr` führt über den Proxy zu `/en/fr` und endet dort mit 404 (kein Sonderfall im Proxy).

## Global Constraints

- Sprachen: `en` (Standard) und `de`, Unterpfade `/en/…` und `/de/…`. `<html lang>` entspricht dem Pfad.
- Next 16: `params` ist ein `Promise`, Proxy heißt `proxy.ts` und exportiert `proxy`, Proxy läuft standardmäßig auf Node. Vor Abweichungen die Doku in `node_modules/next/dist/docs/01-app/` lesen (AGENTS.md).
- Keine neue Laufzeit-Abhängigkeit. Einzige neue Abhängigkeit: devDependency `tsx`.
- Texte: kein "wir/we/our/uns/us", der Markenname ist überall **Xento IT-Solutions**, kein "Freelance", keine Prozentbalken bei den Technologien.
- Eyebrow lautet "Software Development & IT Consulting · Karlsruhe & Remote" (DE: "Softwareentwicklung & IT-Beratung · Karlsruhe & Remote"), H1 "Complex web applications. / Built cleanly. Maintainable for the long run." (DE: "Komplexe Webanwendungen. / Sauber entwickelt. Langfristig wartbar.").
- Navigation: Services · Experience · Technologies · About me · Contact (DE: Leistungen · Projekterfahrung · Technologien · Über mich · Kontakt). Anker-IDs: `services`, `experience`, `techstack`, `about`, `contact`.
- Impressum und Datenschutz bleiben deutsch; unter `/en/…` steht ein englischer Hinweis.
- Admin-Dashboard bleibt deutsch, URL `/admin` und Basic Auth bleiben unverändert.
- `/api/contact` POST liefert bei Fehlern `{ "code": "<code>" }`; Codes: `missing_fields`, `invalid_email`, `field_too_long`, `rate_limited`, `save_failed`, `server_not_configured`, `internal`.
- Service-Werte im Formular sind die Schlüssel `development`, `architecture`, `support`.
- Jeder Commit endet mit der Trailer-Zeile `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` (zweites `-m`). Nach Task 0 nie `git add -A` benutzen, sondern nur die im Task genannten Dateien stagen. `explaining.txt` wird nie committet.

## Review Focus

Eingaben und Zustände, die die Spec nicht ausdrücklich nennt, die aber echte Besucher treffen. Jede Zeile hat unten im zuständigen Task einen Test oder eine Prüfung.

1. **Alte Deep-Links** wie `/impressum` oder `/datenschutz?utm=1` (Suchmaschinen, E-Mails) müssen auf `/{lang}/impressum` umgeleitet werden, Query bleibt erhalten. → Task 4 (`tests/proxy.test.ts`).
2. **Admin und API dürfen nicht umgeleitet werden:** `/admin` bleibt 401 ohne Zugangsdaten, `/api/contact` bleibt erreichbar, Bilder laden. → Task 4 (Test) und Task 9 (curl).
3. **Kaputte Eingaben am Kontaktformular:** Ungültiges JSON, `null`, Array, String als Body liefern 400 `missing_fields` statt 500. → Task 3 (`tests/contact.test.ts`).
4. **Spalte `lang` fehlt in der Datenbank:** Der Insert würde scheitern und das Formular wäre kaputt. → Task 3, manuelle Sperre vor dem Deploy.
5. **Header auf 375 px Breite:** Logo, Umschalter und Hamburger dürfen nicht überlaufen. → Task 4 (Sichtprüfung) und Task 9.

---

### Task 0: Sauberer Ausgangszustand

Im Arbeitsverzeichnis liegen viele unversionierte Änderungen (Admin, Impressum, Datenschutz, `proxy.ts`, `lib/`). Würden spätere Commits `NavBar.tsx` oder `layout.tsx` stagen, wäre dieser Stand mit drin. Darum wird er zuerst separat committet. **Das ist eine Entscheidung des Nutzers: vorher fragen.**

**Files:** keine Codeänderung.

- [ ] **Step 1: Stand prüfen und Dev-Server stoppen**

Der Dev-Server und `next build` teilen sich `.next/`, deshalb zuerst den Dev-Server beenden.

Run: `pkill -f "next dev" ; git status --short`
Expected: Liste wie `M app/layout.tsx`, `?? lib/`, `?? app/impressum/`, … und `?? explaining.txt`.

- [ ] **Step 2: Baseline-Build, um spätere Fehler richtig zuzuordnen**

Run: `npm run build`
Expected: Build endet ohne Fehler. Bei Fehlern hier stoppen und den Nutzer informieren.

- [ ] **Step 3: Nutzer um Erlaubnis für den Baseline-Commit bitten, dann committen**

```bash
git add -A -- . ':!explaining.txt'
git commit -m "chore: commit pending admin, legal pages and security changes" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
git status --short
```
Expected: `git status --short` zeigt nur `?? explaining.txt`.

---

### Task 1: i18n-Kern (Sprachen, Spracherkennung, Pfadwechsel)

**Files:**
- Create: `lib/i18n/config.ts`
- Create: `tests/i18n-config.test.ts`
- Modify: `package.json` (devDependency `tsx`, Script `test`)
- Modify: `docs/superpowers/specs/2026-10-01-expert-brand-i18n-design.md`

**Interfaces:**
- Produces (`lib/i18n/config.ts`, keine Imports, auch im Client nutzbar):
  - `locales: readonly ['en', 'de']`, `type Locale = 'en' | 'de'`, `defaultLocale: Locale` (`'en'`)
  - `hasLocale(value: unknown): value is Locale`
  - `negotiateLocale(acceptLanguage: string | null | undefined): Locale`
  - `switchLocalePath(pathname: string, target: Locale): string`

- [ ] **Step 1: tsx installieren und Test-Script anlegen**

Run: `npm install --save-dev tsx`
Dann in `package.json` unter `"scripts"` nach `"lint": "eslint"` ergänzen (Komma beachten):

```json
    "lint": "eslint",
    "test": "tsx --test tests/*.test.ts"
```

- [ ] **Step 2: Den fehlschlagenden Test schreiben**

`tests/i18n-config.test.ts`:

```ts
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
```

- [ ] **Step 3: Test laufen lassen, Fehlschlag bestätigen**

Run: `npm test`
Expected: FAIL, Meldung enthält `Cannot find module '../lib/i18n/config'`.

- [ ] **Step 4: Minimale Implementierung**

`lib/i18n/config.ts`:

```ts
export const locales = ['en', 'de'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

export function hasLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/**
 * Wählt die beste unterstützte Sprache aus einem Accept-Language-Header.
 * Unbekannte Sprachen werden übersprungen, ohne brauchbaren Treffer gilt defaultLocale.
 */
export function negotiateLocale(acceptLanguage: string | null | undefined): Locale {
  if (!acceptLanguage) return defaultLocale;

  const ranked = acceptLanguage
    .split(',')
    .map((part, index) => {
      const [tag, ...params] = part.trim().split(';');
      const qParam = params.map((p) => p.trim()).find((p) => p.startsWith('q='));
      const parsed = qParam ? Number.parseFloat(qParam.slice(2)) : 1;
      return {
        primary: tag.trim().toLowerCase().split('-')[0],
        quality: Number.isNaN(parsed) ? 0 : parsed,
        index,
      };
    })
    .filter((entry) => entry.primary !== '' && entry.quality > 0)
    .sort((a, b) => b.quality - a.quality || a.index - b.index);

  for (const { primary } of ranked) {
    if (hasLocale(primary)) return primary;
  }
  return defaultLocale;
}

/** Tauscht das Sprachpräfix eines Pfads aus (oder setzt es, wenn keines da ist). */
export function switchLocalePath(pathname: string, target: Locale): string {
  const parts = pathname.split('/').filter(Boolean);
  if (hasLocale(parts[0])) parts.shift();
  return `/${[target, ...parts].join('/')}`;
}
```

- [ ] **Step 5: Test laufen lassen, Erfolg bestätigen**

Run: `npm test`
Expected: PASS, 5 Tests grün.

- [ ] **Step 6: Spec anpassen (die drei Abweichungen)**

In `docs/superpowers/specs/2026-10-01-expert-brand-i18n-design.md`:

Ersetze
`- Wörterbücher: \`app/[lang]/dictionaries/en.json\` und \`de.json\`.`
durch
`- Wörterbücher: \`lib/i18n/dictionaries/en.json\` und \`de.json\`.`

Ersetze
`\`app/admin\` und \`app/api\` bleiben außerhalb.`
durch
`\`app/api\` bleibt außerhalb. \`app/admin\` bleibt unter derselben URL, bekommt aber ein eigenes Root-Layout (\`app/admin/layout.tsx\`, \`lang="de"\`), weil kein gemeinsames Layout oberhalb von \`app/[lang]\` und \`app/admin\` existiert.`

Ersetze
`\`/fr\` liefert 404.`
durch
`\`/fr\` wird vom Proxy auf \`/en/fr\` umgeleitet und endet dort mit 404.`

- [ ] **Step 7: Commit**

```bash
git add lib/i18n/config.ts tests/i18n-config.test.ts package.json package-lock.json docs/superpowers/specs/2026-10-01-expert-brand-i18n-design.md
git commit -m "feat: add i18n core with locale negotiation and path switching" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 2: Wörterbücher (EN/DE) und Loader

**Files:**
- Create: `tests/dictionaries.test.ts`
- Create: `lib/i18n/dictionaries/en.json`
- Create: `lib/i18n/dictionaries/de.json`
- Create: `lib/i18n/dictionaries.ts`

**Interfaces:**
- Consumes: `Locale` aus `lib/i18n/config.ts`.
- Produces: `type Dictionary = typeof en.json` mit den Abschnitten `meta`, `nav`, `hero`, `services`, `experience`, `technologies`, `about`, `contact`, `footer`, `legal`; `getDictionary(locale: Locale): Promise<Dictionary>` (nur serverseitig; Client-Komponenten importieren nur `import type { Dictionary }`).

**Hinweis für den Nutzer-Review:** Die Texte in diesem Task sind das, was der Nutzer vor dem Einbau gegenlesen soll. Nach Step 4 an dieser Stelle pausieren und die Texte zeigen, falls der Nutzer sie noch nicht freigegeben hat. Gegenüber den Originaltexten sind bewusst korrigiert: "Das Algorithmus" → "Der Algorithmus", du-Form im AI-Movie-Finder → Sie-Form, die Reihenfolge 2001/2003 im About-Text, "(Freelance)" bei den Rollen entfernt.

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`tests/dictionaries.test.ts`:

```ts
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
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npm test`
Expected: `tests/dictionaries.test.ts` FAIL mit `ENOENT … en.json`; die Tests aus Task 1 bleiben grün.

- [ ] **Step 3: `lib/i18n/dictionaries/en.json` anlegen**

```json
{
  "meta": {
    "title": "Xento IT-Solutions | Software Development & IT Consulting",
    "description": "Xento supports companies with PHP/Symfony development, software architecture and the modernisation of business-critical web applications – personally delivered by Alexander Liebing. Karlsruhe, on site & remote.",
    "ogTitle": "Xento IT-Solutions | Software Development & IT Consulting",
    "ogDescription": "Senior software development and IT consulting for PHP/Symfony, architecture and legacy modernisation – personally delivered by Alexander Liebing, Karlsruhe & remote.",
    "ogLocale": "en_US"
  },
  "nav": {
    "services": "Services",
    "experience": "Experience",
    "technologies": "Technologies",
    "about": "About me",
    "contact": "Contact",
    "openMenu": "Open menu",
    "closeMenu": "Close menu",
    "languageLabel": "Language"
  },
  "hero": {
    "eyebrow": "Software Development & IT Consulting · Karlsruhe & Remote",
    "titleLine1": "Complex web applications.",
    "titleHighlight": "Built cleanly. Maintainable for the long run.",
    "text": "Xento supports companies with demanding PHP/Symfony development, software architecture and the modernisation of existing systems. Personally delivered by Alexander Liebing – with more than 20 years of experience in software development.",
    "ctaPrimary": "Discuss a project",
    "ctaSecondary": "View project experience",
    "profile": {
      "name": "Alexander Liebing",
      "imageAlt": "Portrait of Alexander Liebing",
      "role": "Senior Software Engineer & Consultant",
      "yearsLabel": "Years of experience",
      "projectsLabel": "Large-scale projects"
    }
  },
  "services": {
    "title": "Services",
    "intro": "Xento supports companies with the development, modernisation and stabilisation of business-critical web applications.",
    "items": [
      {
        "title": "Software Development",
        "subtitle": "Scalable, secure back-end and front-end applications",
        "points": [
          "Full-stack development with PHP (Symfony, Laravel) and Vue.js",
          "Robust REST and SOAP interfaces",
          "Automated testing (TDD, E2E with Selenium/PHPUnit)",
          "Secure, GDPR-compliant implementation"
        ]
      },
      {
        "title": "Architecture & Modernisation",
        "subtitle": "Future-proof systems built on your existing code",
        "points": [
          "Architecture design (Domain-Driven Design, state machines)",
          "Refactoring and migration of legacy monoliths to services",
          "Technology evaluation and migration concepts",
          "CI/CD pipelines and agile development processes"
        ]
      },
      {
        "title": "Technical Support",
        "subtitle": "Reliable operation and continued development of your applications",
        "points": [
          "Performance tuning and database optimisation",
          "Error analysis with monitoring and log management (Graylog)",
          "Prompt bug-fixing and hotfix service",
          "Framework and PHP version updates (Symfony/Laravel)"
        ]
      }
    ]
  },
  "experience": {
    "title": "Project experience",
    "intro": "A selection from more than 20 years of project work in enterprise and SME environments.",
    "resultsLabel": "Results & responsibilities:",
    "projects": [
      {
        "period": "07/2019 – 03/2026 (6 years)",
        "role": "Lead Backend Developer",
        "title": "Customer portal & ERP architecture (energy utility)",
        "description": "Modernisation and maintenance of the customer and contract portal for a leading service provider in the energy sector. Focus on scalability, performance and modern REST APIs.",
        "tasks": [
          "Refactoring of outdated SOAP interfaces into high-performance REST APIs.",
          "Design and implementation of a flexible dunning module.",
          "Performance tuning of database queries and bulk processing (CSV/cron jobs).",
          "Ensuring GDPR compliance (automated deadline checks and data deletion).",
          "Establishing monitoring and log analysis with Graylog for error detection."
        ],
        "tags": ["PHP 8.x", "Slim", "Idiorm", "REST API", "Docker", "Graylog", "SQL", "Scrum"]
      },
      {
        "period": "01/2017 – 12/2017 (1 year)",
        "role": "Symfony Core Developer",
        "title": "Workflow module for multi-tenancy (shipyard)",
        "description": "Extraction of a complex shipbuilding-processing module from a monolith into a standalone, multi-tenant Symfony workflow module.",
        "tasks": [
          "Extension of the Symfony Workflow core components for tenant-specific logic.",
          "Implementation of complex process chains using pipeline patterns (event dispatcher/subscriber).",
          "Creation of Twig extensions for dynamic sub-templates (permission and role control).",
          "Writing technical specifications and system documentation in Markdown."
        ],
        "tags": ["Symfony 3/4", "Workflow Engine", "Doctrine", "Pipeline Pattern", "Event-Dispatcher"]
      },
      {
        "period": "2016 – 2017",
        "role": "Symfony Core Developer",
        "title": "E-commerce automation & subscriptions (security software)",
        "description": "Development and automation of subscription and contract-change processes within a global e-commerce customer portal.",
        "tasks": [
          "Extension of the Sonata Admin back-end interfaces.",
          "Implementation of automated validation for contract changes.",
          "Creation of Twig extensions for dynamic sub-templates (permission and role control).",
          "Quality assurance through end-to-end testing with Selenium and Cucumber/Gherkin."
        ],
        "tags": ["Symfony 3/4", "Sonata Admin", "Doctrine", "Selenium", "Cucumber", "E-Commerce", "Subscription Management"]
      },
      {
        "period": "2015 – 2016",
        "role": "Symfony Core Developer",
        "title": "Booking funnel migration (web agency)",
        "description": "Development and migration of a business-critical booking funnel from Typo3 to a high-performance, standalone Symfony application.",
        "tasks": [
          "Coupling legacy content systems with the new booking core.",
          "Development of dynamic pricing and booking interfaces."
        ],
        "tags": ["Symfony 3", "Typo3API", "REST", "Bootstrap", "MySQL", "Booking Engine"]
      },
      {
        "period": "2009 – 2014",
        "role": "Magento Developer",
        "title": "White-label travel systems (travel portals)",
        "description": "Development of flexible white-label solutions for well-known travel portals for the dynamic delivery of holiday offers.",
        "tasks": [
          "Creation of jQuery-based plugins for interactive booking elements.",
          "Development of custom shipping and price-update modules for Magento shops.",
          "Execution of complex platform upgrades (Magento 1.5 to 1.7)."
        ],
        "tags": ["Magento", "jQuery", "PHP", "Frontend-Widgets"]
      }
    ],
    "ownProject": {
      "badge": "Own project",
      "title": "AI Movie Finder",
      "descriptionBefore": "An intelligent movie recommendation system with ",
      "descriptionHighlight": "AI-assisted analysis",
      "descriptionAfter": " of your preferences. The algorithm combines weighted genre preferences with IMDB ratings and quality metrics to generate personalised recommendations that fit your taste perfectly.",
      "tags": ["Python", "streamlit", "sqlite"],
      "cta": "Visit project →"
    }
  },
  "technologies": {
    "title": "Technologies",
    "intro": "The tools I work with every day to turn requirements into performant, maintainable code.",
    "focusLabel": "Focus",
    "focusItems": ["PHP 8", "Symfony", "REST APIs", "Software architecture", "Legacy modernisation"],
    "furtherLabel": "Further experience",
    "furtherItems": ["Laravel", "Vue.js", "MySQL/MariaDB", "Docker", "Redis", "Graylog", "CI/CD", "AWS"]
  },
  "about": {
    "badge": "The expert behind Xento",
    "title": "About Alexander Liebing",
    "imageAlt": "Portrait of Alexander Liebing",
    "lead": "I am a passionate software architect and full-stack developer with a strong focus on robustness, clean code and pragmatic solutions.",
    "paragraphs": [
      "Since my IHK certification as an internet software developer (2001) and my apprenticeship as an IT specialist (2003), I have designed and maintained systems for well-known companies such as EnBW (Powercloud) and Lürssen shipyard.",
      "With Xento I bundle my many years of experience from enterprise and SME projects under my own brand. Whether you need additional development capacity (Symfony / Laravel), architectural advice on legacy migrations or professional support for system operations: I work with you directly."
    ],
    "features": [
      { "title": "IHK certified", "description": "Software development 2001 / 2003" },
      { "title": "Architecture focus", "description": "DDD, OOP, state machines, workflows" },
      { "title": "Flexible deployment", "description": "Remote or on site in the Karlsruhe area" }
    ]
  },
  "contact": {
    "title": "Let's start your project",
    "intro": "Need support with development, consulting or maintenance of your applications? Get in touch.",
    "detailsTitle": "Contact details",
    "detailsText": "Feel free to get in touch. I usually reply within 24 hours.",
    "emailLabel": "Email",
    "phoneLabel": "Phone",
    "locationLabel": "Location",
    "locationValue": "Karlsruhe, Germany (on site & remote)",
    "form": {
      "name": "Your name / contact person *",
      "namePlaceholder": "e.g. Jane Doe",
      "email": "Email address *",
      "emailPlaceholder": "you@company.com",
      "company": "Company",
      "companyPlaceholder": "e.g. Example Ltd.",
      "service": "Service of interest *",
      "serviceOptions": {
        "development": "Software development",
        "architecture": "Architecture & modernisation",
        "support": "Technical support"
      },
      "message": "Details of your request *",
      "messagePlaceholder": "Please include all relevant information about your project or request.",
      "sending": "Sending request…",
      "submit": "Send request",
      "success": "Request sent successfully. Thank you!"
    },
    "errors": {
      "missing_fields": "Please fill in all required fields.",
      "invalid_email": "Please enter a valid email address.",
      "field_too_long": "One of the fields is too long.",
      "rate_limited": "Too many requests. Please try again later.",
      "save_failed": "Your request could not be saved. Please try again later.",
      "server_not_configured": "The contact form is currently unavailable. Please email me directly.",
      "internal": "Something went wrong. Please try again later.",
      "network": "Network error. Please check your connection and try again."
    }
  },
  "footer": {
    "copyright": "© {year} Xento IT-Solutions. All rights reserved.",
    "impressum": "Legal notice",
    "privacy": "Privacy policy"
  },
  "legal": {
    "notice": "For legal reasons, this page is only available in German.",
    "impressumTitle": "Legal notice (Impressum) | Xento IT-Solutions",
    "datenschutzTitle": "Privacy policy (Datenschutz) | Xento IT-Solutions"
  }
}
```

- [ ] **Step 4: `lib/i18n/dictionaries/de.json` anlegen**

```json
{
  "meta": {
    "title": "Xento IT-Solutions | Softwareentwicklung & IT-Beratung",
    "description": "Xento unterstützt Unternehmen bei PHP-/Symfony-Entwicklung, Softwarearchitektur und der Modernisierung geschäftskritischer Webanwendungen – persönlich umgesetzt von Alexander Liebing. Karlsruhe, vor Ort & remote.",
    "ogTitle": "Xento IT-Solutions | Softwareentwicklung & IT-Beratung",
    "ogDescription": "Senior-Softwareentwicklung und IT-Beratung für PHP/Symfony, Architektur und Legacy-Modernisierung – persönlich umgesetzt von Alexander Liebing, Karlsruhe & remote.",
    "ogLocale": "de_DE"
  },
  "nav": {
    "services": "Leistungen",
    "experience": "Projekterfahrung",
    "technologies": "Technologien",
    "about": "Über mich",
    "contact": "Kontakt",
    "openMenu": "Menü öffnen",
    "closeMenu": "Menü schließen",
    "languageLabel": "Sprache"
  },
  "hero": {
    "eyebrow": "Softwareentwicklung & IT-Beratung · Karlsruhe & Remote",
    "titleLine1": "Komplexe Webanwendungen.",
    "titleHighlight": "Sauber entwickelt. Langfristig wartbar.",
    "text": "Xento unterstützt Unternehmen bei anspruchsvoller PHP-/Symfony-Entwicklung, Softwarearchitektur und der Modernisierung bestehender Systeme. Persönlich umgesetzt von Alexander Liebing – mit über 20 Jahren Erfahrung in der Softwareentwicklung.",
    "ctaPrimary": "Projekt besprechen",
    "ctaSecondary": "Projekterfahrung ansehen",
    "profile": {
      "name": "Alexander Liebing",
      "imageAlt": "Porträt von Alexander Liebing",
      "role": "Senior Software Engineer & Consultant",
      "yearsLabel": "Jahre Erfahrung",
      "projectsLabel": "Großprojekte"
    }
  },
  "services": {
    "title": "Leistungen",
    "intro": "Xento unterstützt Unternehmen bei der Entwicklung, Modernisierung und Stabilisierung geschäftskritischer Webanwendungen.",
    "items": [
      {
        "title": "Softwareentwicklung",
        "subtitle": "Skalierbare und sichere Backend- und Frontend-Anwendungen",
        "points": [
          "Fullstack-Entwicklung mit PHP (Symfony, Laravel) und Vue.js",
          "Robuste REST- und SOAP-Schnittstellen",
          "Automatisierte Tests (TDD, E2E mit Selenium/PHPUnit)",
          "Sichere, DSGVO-konforme Umsetzung"
        ]
      },
      {
        "title": "Architektur & Modernisierung",
        "subtitle": "Zukunftssichere Systeme auf Basis Ihres bestehenden Codes",
        "points": [
          "Architekturentwürfe (Domain-Driven Design, State-Machines)",
          "Refactoring und Migration von Legacy-Monolithen zu Services",
          "Technologie-Evaluation und Migrationskonzepte",
          "CI/CD-Pipelines und agile Entwicklungsprozesse"
        ]
      },
      {
        "title": "Technische Betreuung",
        "subtitle": "Zuverlässiger Betrieb und Weiterentwicklung Ihrer Anwendungen",
        "points": [
          "Performance-Tuning und Datenbankoptimierung",
          "Fehleranalyse mit Monitoring und Log-Management (Graylog)",
          "Zeitnaher Bugfix- und Hotfix-Service",
          "Updates von Framework- und PHP-Versionen (Symfony/Laravel)"
        ]
      }
    ]
  },
  "experience": {
    "title": "Projekterfahrung",
    "intro": "Ein Auszug aus über 20 Jahren Projektarbeit im Enterprise- und KMU-Umfeld.",
    "resultsLabel": "Ergebnisse & Tätigkeiten:",
    "projects": [
      {
        "period": "07/2019 – 03/2026 (6 Jahre)",
        "role": "Lead Backend Developer",
        "title": "Kundenportal & ERP-Architektur (Energieversorger)",
        "description": "Modernisierung und Betreuung des Kunden- und Vertragsportals für einen führenden Energiewirtschafts-Dienstleister. Fokussiert auf Skalierbarkeit, Performance und moderne REST-APIs.",
        "tasks": [
          "Refactoring veralteter SOAP-Schnittstellen zu hochperformanten REST-APIs.",
          "Konzeption und Implementierung eines flexiblen Mahnverfahren-Moduls.",
          "Performance-Tuning von Datenbankabfragen und Massenverarbeitung (CSV/Cron-Jobs).",
          "Sicherstellung der DSGVO-Konformität (automatisierte Fristenprüfung und Datenlöschung).",
          "Etablierung eines Monitorings und Log-Analysen über Graylog zur Fehlererkennung."
        ],
        "tags": ["PHP 8.x", "Slim", "Idiorm", "REST API", "Docker", "Graylog", "SQL", "Scrum"]
      },
      {
        "period": "01/2017 – 12/2017 (1 Jahr)",
        "role": "Symfony Core Developer",
        "title": "Workflow-Modul für Mehrmandantenfähigkeit (Schiffswerft)",
        "description": "Überführung eines komplexen Bauabwicklungsmoduls aus einem Monolithen in ein eigenständiges, mandantenfähiges Symfony-Workflow-Modul.",
        "tasks": [
          "Erweiterung der Symfony Workflow-Kernkomponenten für mandantenspezifische Logik.",
          "Implementierung komplexer Prozessketten mittels Pipeline-Patterns (Event-Dispatcher/Subscriber).",
          "Erstellung von Twig-Extensions für dynamische Sub-Templates (Rechte- und Rollensteuerung).",
          "Verfassen der technischen Spezifikationen und Systemdokumentation in Markdown."
        ],
        "tags": ["Symfony 3/4", "Workflow Engine", "Doctrine", "Pipeline Pattern", "Event-Dispatcher"]
      },
      {
        "period": "2016 – 2017",
        "role": "Symfony Core Developer",
        "title": "E-Commerce-Automatisierung & Subscription (Security Software)",
        "description": "Entwicklung und Automatisierung von Abo- und Vertragsänderungsprozessen innerhalb des globalen E-Commerce-Kundenportals.",
        "tasks": [
          "Erweiterung der Sonata-Admin Backend-Schnittstellen.",
          "Implementierung automatisierter Validierungen bei Vertragsänderungen.",
          "Erstellung von Twig-Extensions für dynamische Sub-Templates (Rechte- und Rollensteuerung).",
          "Qualitätssicherung durch End-to-End-Testing mit Selenium und Cucumber-Gherkin."
        ],
        "tags": ["Symfony 3/4", "Sonata Admin", "Doctrine", "Selenium", "Cucumber", "E-Commerce", "Subscription Management"]
      },
      {
        "period": "2015 – 2016",
        "role": "Symfony Core Developer",
        "title": "Migration Buchungsstrecke (Internetagentur)",
        "description": "Entwicklung und Migration einer geschäftskritischen Buchungsstrecke von Typo3 in eine performante, eigenständige Symfony-Anwendung.",
        "tasks": [
          "Kopplung von Legacy-Content-Systemen mit dem neuen Buchungskern.",
          "Entwicklung dynamischer Pricing- und Buchungs-Schnittstellen."
        ],
        "tags": ["Symfony 3", "Typo3API", "REST", "Bootstrap", "MySQL", "Booking Engine"]
      },
      {
        "period": "2009 – 2014",
        "role": "Magento Developer",
        "title": "Entwicklung White-Label Reisesysteme (Reiseportale)",
        "description": "Entwicklung von flexiblen White-Label-Lösungen für namhafte Reiseportale zur dynamischen Auslieferung von Urlaubsangeboten.",
        "tasks": [
          "Erstellung von jQuery-basierten Plugins für interaktive Buchungselemente.",
          "Entwicklung von individuellen Versand- und Preis-Update-Modulen für Magento-Shops.",
          "Durchführung komplexer Plattform-Upgrades (Magento 1.5 auf 1.7)."
        ],
        "tags": ["Magento", "jQuery", "PHP", "Frontend-Widgets"]
      }
    ],
    "ownProject": {
      "badge": "Eigenes Projekt",
      "title": "AI Movie Finder",
      "descriptionBefore": "Ein intelligentes Movie-Recommendation-System mit ",
      "descriptionHighlight": "KI-gestützter Analyse",
      "descriptionAfter": " Ihrer Vorlieben. Der Algorithmus kombiniert gewichtete Genre-Präferenzen mit IMDB-Ratings und Qualitätsmetriken, um personalisierte Filmempfehlungen zu generieren, die perfekt zu Ihrem Geschmack passen.",
      "tags": ["Python", "streamlit", "sqlite"],
      "cta": "Projekt ansehen →"
    }
  },
  "technologies": {
    "title": "Technologien",
    "intro": "Die Werkzeuge, mit denen ich täglich arbeite, um Anforderungen in performanten, wartbaren Code zu überführen.",
    "focusLabel": "Schwerpunkt",
    "focusItems": ["PHP 8", "Symfony", "REST-APIs", "Softwarearchitektur", "Legacy-Modernisierung"],
    "furtherLabel": "Weitere Erfahrung",
    "furtherItems": ["Laravel", "Vue.js", "MySQL/MariaDB", "Docker", "Redis", "Graylog", "CI/CD", "AWS"]
  },
  "about": {
    "badge": "Der Experte hinter Xento",
    "title": "Über Alexander Liebing",
    "imageAlt": "Porträt von Alexander Liebing",
    "lead": "Ich bin leidenschaftlicher Softwarearchitekt und Fullstack-Entwickler mit starkem Fokus auf Robustheit, sauberen Code (Clean Code) und pragmatische Lösungen.",
    "paragraphs": [
      "Seit meiner IHK-Zertifizierung als Softwareentwickler im Internet (2001) und meiner Ausbildung zum Fachinformatiker (2003) habe ich Systeme für namhafte Konzerne wie die EnBW (Powercloud) und die Lürssenwerft konzipiert und betreut.",
      "Mit Xento bündele ich meine langjährige Erfahrung aus Enterprise- und KMU-Projekten unter einer eigenen Marke. Ob Sie zusätzliche Entwicklungskapazität (Symfony / Laravel), architektonische Beratung bei Legacy-Migrationen oder professionellen Support für den Systembetrieb suchen: Ich arbeite direkt mit Ihnen zusammen."
    ],
    "features": [
      { "title": "IHK-Zertifiziert", "description": "Softwareentwicklung 2001 / 2003" },
      { "title": "Architekturfokus", "description": "DDD, OOP, State-Machines, Workflows" },
      { "title": "Flexibler Einsatz", "description": "Remote oder vor Ort im Raum Karlsruhe" }
    ]
  },
  "contact": {
    "title": "Starten wir Ihr Projekt",
    "intro": "Sie benötigen Unterstützung bei Entwicklung, Beratung oder Betreuung Ihrer Anwendungen? Schreiben Sie mir.",
    "detailsTitle": "Kontaktdaten",
    "detailsText": "Zögern Sie nicht, Kontakt aufzunehmen. Ich antworte in der Regel innerhalb von 24 Stunden.",
    "emailLabel": "E-Mail",
    "phoneLabel": "Telefon",
    "locationLabel": "Standort",
    "locationValue": "Karlsruhe, Deutschland (vor Ort & Remote)",
    "form": {
      "name": "Ihr Name / Ansprechpartner *",
      "namePlaceholder": "z. B. Max Mustermann",
      "email": "E-Mail-Adresse *",
      "emailPlaceholder": "ihre@mail.de",
      "company": "Firma",
      "companyPlaceholder": "z. B. Muster GmbH",
      "service": "Gewünschte Leistung *",
      "serviceOptions": {
        "development": "Softwareentwicklung",
        "architecture": "Architektur & Modernisierung",
        "support": "Technische Betreuung"
      },
      "message": "Details zu Ihrer Anfrage *",
      "messagePlaceholder": "Bitte geben Sie hier alle relevanten Informationen zu Ihrem Projekt oder Anliegen an.",
      "sending": "Anfrage wird gesendet…",
      "submit": "Anfrage absenden",
      "success": "Anfrage erfolgreich gesendet. Vielen Dank!"
    },
    "errors": {
      "missing_fields": "Bitte füllen Sie alle Pflichtfelder aus.",
      "invalid_email": "Bitte geben Sie eine gültige E-Mail-Adresse an.",
      "field_too_long": "Eines der Felder ist zu lang.",
      "rate_limited": "Zu viele Anfragen. Bitte versuchen Sie es später erneut.",
      "save_failed": "Ihre Anfrage konnte nicht gespeichert werden. Bitte versuchen Sie es später erneut.",
      "server_not_configured": "Das Kontaktformular ist derzeit nicht verfügbar. Bitte schreiben Sie mir direkt eine E-Mail.",
      "internal": "Etwas ist schiefgelaufen. Bitte versuchen Sie es später erneut.",
      "network": "Netzwerkfehler. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut."
    }
  },
  "footer": {
    "copyright": "© {year} Xento IT-Solutions. Alle Rechte vorbehalten.",
    "impressum": "Impressum",
    "privacy": "Datenschutz"
  },
  "legal": {
    "notice": "Aus rechtlichen Gründen nur auf Deutsch verfügbar.",
    "impressumTitle": "Impressum | Xento IT-Solutions",
    "datenschutzTitle": "Datenschutzerklärung | Xento IT-Solutions"
  }
}
```

- [ ] **Step 5: Loader schreiben**

`lib/i18n/dictionaries.ts`:

```ts
import 'server-only';
import type { Locale } from './config';
import type en from './dictionaries/en.json';

export type Dictionary = typeof en;

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  de: () => import('./dictionaries/de.json').then((module) => module.default),
};

export const getDictionary = (locale: Locale): Promise<Dictionary> => dictionaries[locale]();
```

(Weist `de.json` nicht dieselbe Struktur wie `en.json` auf, schlägt hier zusätzlich der TypeScript-Check fehl.)

- [ ] **Step 6: Tests und Typcheck**

Run: `npm test && npx tsc --noEmit`
Expected: Alle Tests PASS; `tsc` ohne Fehler.

- [ ] **Step 7: Commit**

```bash
git add tests/dictionaries.test.ts lib/i18n/dictionaries.ts lib/i18n/dictionaries/en.json lib/i18n/dictionaries/de.json
git commit -m "feat: add English and German dictionaries for the expert brand copy" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 3: Kontaktformular-Backend (Validierung, Fehler-Codes, Sprache)

**Files:**
- Create: `lib/contact.ts`
- Create: `tests/contact.test.ts`
- Create: `db/2026-10-01-add-contact-lang.sql`
- Modify: `db/contact_messages.sql`
- Modify: `app/api/contact/route.ts`
- Modify: `lib/supabase.ts` (Typ `ContactMessage`)
- Modify: `components/admin/ContactDashboard.tsx`

**Interfaces:**
- Consumes: `hasLocale`, `Locale` aus `lib/i18n/config.ts`.
- Produces (`lib/contact.ts`):
  - `type ContactErrorCode = 'missing_fields' | 'invalid_email' | 'field_too_long'`
  - `type ContactInput = { name: string; email: string; company: string | null; service: string; message: string; lang: Locale | null }`
  - `validateContactPayload(body: unknown): { ok: true; value: ContactInput } | { ok: false; code: ContactErrorCode }`
  - `serviceLabelDe(service: string | null): string`
- Produces (HTTP): `POST /api/contact` antwortet bei Fehlern mit `{ code }` und Status 400 / 429 / 500.

- [ ] **Step 1: Den fehlschlagenden Test schreiben**

`tests/contact.test.ts`:

```ts
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
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npm test`
Expected: `tests/contact.test.ts` FAIL mit `Cannot find module '../lib/contact'`.

- [ ] **Step 3: `lib/contact.ts` schreiben**

```ts
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
```

- [ ] **Step 4: Tests laufen lassen, Erfolg bestätigen**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Route auf Validator und Fehler-Codes umstellen**

In `app/api/contact/route.ts` die Importe, die Konstanten `MAX_FIELD_LENGTH`/`EMAIL_REGEX`, den Typ `ContactPayload` und die Funktion `asTrimmedString` entfernen und die ganze `POST`-Funktion ersetzen. Der Kopf der Datei lautet danach:

```ts
import { NextResponse } from 'next/server';
import { fetchRecentContactMessages, getServiceRoleClient, isSupabaseConfigured } from '@/lib/supabase';
import { isAuthorizedAdminRequest, unauthorizedInit } from '@/lib/auth';
import { getClientIp, isRateLimited } from '@/lib/rateLimit';
import { validateContactPayload } from '@/lib/contact';

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      console.error('Supabase env not configured (POST)');
      return NextResponse.json({ code: 'server_not_configured' }, { status: 500 });
    }

    // Einfacher Spam-Schutz: max. 5 Anfragen pro IP und 10 Minuten.
    const ip = getClientIp(request);
    if (isRateLimited(`contact:${ip}`, 5, 10 * 60 * 1000)) {
      return NextResponse.json({ code: 'rate_limited' }, { status: 429 });
    }

    // Ungültiges JSON wird wie ein leerer Body behandelt (400 statt 500).
    const body: unknown = await request.json().catch(() => null);
    const result = validateContactPayload(body);
    if (!result.ok) {
      return NextResponse.json({ code: result.code }, { status: 400 });
    }

    const supabase = getServiceRoleClient();

    // Speichern inklusive Firma, Leistung und Sprache der Anfrage
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([result.value])
      .select();

    if (error) {
      console.error('Supabase DB-Fehler:', error);
      return NextResponse.json({ code: 'save_failed' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data }, { status: 200 });
  } catch (error) {
    console.error('Serverfehler:', error);
    return NextResponse.json({ code: 'internal' }, { status: 500 });
  }
}
```

Die `GET`-Funktion bleibt unverändert unterhalb.

- [ ] **Step 6: SQL-Migration anlegen**

`db/2026-10-01-add-contact-lang.sql`:

```sql
-- Sprache der Kontaktanfrage ('en' oder 'de'), damit klar ist, in welcher Sprache geantwortet wird.
-- Im Supabase SQL-Editor ausführen, BEVOR die neue Version der Seite deployed wird.
alter table public.contact_messages add column if not exists lang text;
```

In `db/contact_messages.sql` nach der Zeile `  service text,` die Zeile `  lang text,` einfügen, damit Neuaufsetzungen die Spalte direkt haben.

- [ ] **Step 7: Typen und Dashboard anpassen**

In `lib/supabase.ts` im Typ `ContactMessage` nach `service: string | null;` die Zeile `lang: string | null;` ergänzen.

In `components/admin/ContactDashboard.tsx`:
1. Im lokalen Interface (um Zeile 10) nach `service: string | null;` die Zeile `lang: string | null;` ergänzen.
2. Import ergänzen: `import { serviceLabelDe } from '@/lib/contact';`
3. Die Zeile
`<span className="rounded-full bg-white/5 px-3 py-1">{entry.service ?? 'Keine Dienstleistung angegeben'}</span>`
ersetzen durch:

```tsx
<span className="rounded-full bg-white/5 px-3 py-1">{serviceLabelDe(entry.service)}</span>
{entry.lang ? (
  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-cyan-300">{entry.lang.toUpperCase()}</span>
) : null}
```

- [ ] **Step 8: Typcheck und Lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: keine Fehler (Warnungen aus vorhandenem Code wie `<img>` sind unverändert).

- [ ] **Step 9: Manuelle Sperre – Migration im Supabase SQL-Editor ausführen (Nutzer)**

Den Inhalt von `db/2026-10-01-add-contact-lang.sql` im Supabase SQL-Editor des Projekts ausführen. Ohne diese Spalte scheitert jeder Formular-Insert mit `save_failed`. **Vor dem Deploy zwingend erledigen und vom Nutzer bestätigen lassen.** Prüfung später in Task 9 (Test-Anfrage).

- [ ] **Step 10: Commit**

```bash
git add lib/contact.ts tests/contact.test.ts db/2026-10-01-add-contact-lang.sql db/contact_messages.sql app/api/contact/route.ts lib/supabase.ts components/admin/ContactDashboard.tsx
git commit -m "feat: return error codes from contact API and store request language" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 4: Zweisprachiges Routing und Seitenrahmen (Proxy, Layouts, Header, Footer, Umschalter)

Nach diesem Task laufen `/en` und `/de` mit Header, Umschalter und Footer in der richtigen Sprache. Die Sektionen dazwischen sind noch deutsch und werden in Task 5–8 umgestellt.

**Files:**
- Create: `tests/proxy.test.ts`
- Create: `lib/fonts.ts`
- Create: `app/admin/layout.tsx`
- Create: `app/[lang]/layout.tsx`
- Create: `app/[lang]/page.tsx`
- Create: `components/ui/LanguageSwitcher.tsx`
- Move: `app/impressum/page.tsx` → `app/[lang]/impressum/page.tsx`, `app/datenschutz/page.tsx` → `app/[lang]/datenschutz/page.tsx`
- Delete: `app/layout.tsx`, `app/page.tsx`
- Modify: `proxy.ts`, `components/ui/NavBar.tsx`, `components/ui/Logo.tsx`, `components/ui/Footer.tsx`, `app/admin/page.tsx`

**Interfaces:**
- Consumes: `Locale`, `hasLocale`, `locales`, `negotiateLocale`, `switchLocalePath` (Task 1); `getDictionary`, `Dictionary` (Task 2).
- Produces:
  - `Navbar({ lang: Locale; dict: Dictionary['nav']; minimal?: boolean; hideSwitcher?: boolean })`
  - `Footer({ lang: Locale; dict: Dictionary['footer'] })`
  - `Logo({ lang: Locale; size?: 'default' | 'small' })`
  - `LanguageSwitcher({ lang: Locale; label: string })`
  - Seiten haben die Signatur `({ params }: { params: Promise<{ lang: string }> })`.

- [ ] **Step 1: Den fehlschlagenden Proxy-Test schreiben (Review Focus 1 und 2)**

`tests/proxy.test.ts`:

```ts
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
```

- [ ] **Step 2: Test laufen lassen, Fehlschlag bestätigen**

Run: `npm test`
Expected: `tests/proxy.test.ts` FAIL (der bisherige `proxy` leitet nicht um, die Redirect-Tests schlagen fehl).
Falls der Import von `next/server` unter `tsx` selbst scheitert, statt dieses Tests die curl-Prüfungen aus Step 12 und Task 9 als Nachweis verwenden und den Test entfernen.

- [ ] **Step 3: `proxy.ts` ersetzen**

```ts
import { NextResponse, type NextRequest } from 'next/server';
import { isAuthorizedAdminRequest, unauthorizedInit } from '@/lib/auth';
import { hasLocale, negotiateLocale, switchLocalePath } from '@/lib/i18n/config';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin: Basic Auth wie bisher, keine Sprachweiche.
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    const authorization = request.headers.get('authorization');
    if (isAuthorizedAdminRequest(authorization)) return NextResponse.next();

    return new NextResponse('Authentication required', unauthorizedInit());
  }

  if (hasLocale(pathname.split('/')[1])) return NextResponse.next();

  const locale = negotiateLocale(request.headers.get('accept-language'));
  const url = request.nextUrl.clone();
  url.pathname = switchLocalePath(pathname, locale);

  const response = NextResponse.redirect(url);
  response.headers.set('Vary', 'Accept-Language');
  return response;
}

export const config = {
  // Alles außer API-Routen, Next-Interna und Dateien mit Endung (Bilder, Favicon, …).
  matcher: ['/((?!api/|_next/|.*\\..*).*)'],
};
```

- [ ] **Step 4: Schriften auslagern und Admin-Root-Layout anlegen**

`lib/fonts.ts`:

```ts
import { Geist, Geist_Mono } from 'next/font/google';

export const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});
```

`app/admin/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { geistMono, geistSans } from '@/lib/fonts';
import '../globals.css';

export const metadata: Metadata = {
  title: 'Admin | Xento IT-Solutions',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

- [ ] **Step 5: Dateien verschieben und neues Root-Layout sowie Startseite anlegen**

```bash
mkdir -p "app/[lang]"
git mv app/impressum "app/[lang]/impressum"
git mv app/datenschutz "app/[lang]/datenschutz"
git rm app/layout.tsx app/page.tsx
```

`app/[lang]/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { geistMono, geistSans } from '@/lib/fonts';
import { hasLocale, locales } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';
import '../globals.css';

// Für absolute URLs in hreflang/OpenGraph. In Vercel auf die echte Domain setzen.
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://xento-phi.vercel.app';

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = await getDictionary(lang);

  return {
    metadataBase: new URL(siteUrl),
    title: meta.title,
    description: meta.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { en: '/en', de: '/de', 'x-default': '/en' },
    },
    openGraph: {
      title: meta.ogTitle,
      description: meta.ogDescription,
      type: 'website',
      locale: meta.ogLocale,
      url: `/${lang}`,
    },
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
```

`app/[lang]/page.tsx` (die Sektionen bleiben vorerst unverändert und ohne Props):

```tsx
import { notFound } from 'next/navigation';
import Navbar from '@/components/ui/NavBar';
import Footer from '@/components/ui/Footer';
import Teaser from '@/components/sections/Teaser';
import Services from '@/components/sections/Services';
import Projects from '@/components/sections/Projects';
import Technologies from '@/components/sections/Technologies';
import About from '@/components/sections/About';
import Contact from '@/components/sections/Contact';
import References from '@/components/sections/References';
import { hasLocale } from '@/lib/i18n/config';
import { getDictionary } from '@/lib/i18n/dictionaries';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="bg-[#060b13] min-h-screen">
      {/* Fixierte, halbtransparente Navigation */}
      <Navbar lang={lang} dict={dict.nav} />

      {/* Hauptinhalt mit Abstand für die Navigation */}
      <main className="pt-20">
        <Teaser />
        <Services />
        <Projects />
        <Technologies />
        <References />
        <About />
        <Contact />
      </main>

      <Footer lang={lang} dict={dict.footer} />
    </div>
  );
}
```

- [ ] **Step 6: Logo und Footer auf Sprache umstellen**

`components/ui/Logo.tsx`: Import `import type { Locale } from '@/lib/i18n/config';` ergänzen, das Interface erweitern und den Link anpassen:

```tsx
interface LogoProps {
  lang: Locale;
  /** 'default' für die Hauptnavigation, 'small' für z. B. den Footer. */
  size?: 'default' | 'small';
}

export default function Logo({ lang, size = 'default' }: LogoProps) {
```

und `<Link href="/" className={`flex items-center …` ersetzen durch `<Link href={`/${lang}`} className={`flex items-center …` (nur das `href`-Attribut ändern).

`components/ui/Footer.tsx` ersetzen durch:

```tsx
import Link from 'next/link';
import Logo from './Logo';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

interface FooterProps {
  lang: Locale;
  dict: Dictionary['footer'];
}

export default function Footer({ lang, dict }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#060b13] border-t border-gray-900 py-8 px-6 text-xs text-gray-500">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Logo-Branding links */}
        <Logo lang={lang} size="small" />

        {/* Copyright Mitte */}
        <div>{dict.copyright.replace('{year}', String(currentYear))}</div>

        {/* Rechtliches rechts */}
        <div className="flex items-center gap-6">
          <Link href={`/${lang}/impressum`} className="hover:text-gray-300 transition-colors">{dict.impressum}</Link>
          <Link href={`/${lang}/datenschutz`} className="hover:text-gray-300 transition-colors">{dict.privacy}</Link>
        </div>

      </div>
    </footer>
  );
}
```

- [ ] **Step 7: Sprachumschalter anlegen**

`components/ui/LanguageSwitcher.tsx`:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, switchLocalePath, type Locale } from "@/lib/i18n/config";

const LANGUAGES: Record<Locale, { code: string; name: string }> = {
  en: { code: "EN", name: "English" },
  de: { code: "DE", name: "Deutsch" },
};

function Flag({ locale }: { locale: Locale }) {
  if (locale === "de") {
    return (
      <svg viewBox="0 0 5 3" className="h-3.5 w-5 rounded-[2px]" aria-hidden="true">
        <rect width="5" height="3" fill="#FFCE00" />
        <rect width="5" height="2" fill="#DD0000" />
        <rect width="5" height="1" fill="#000000" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 60 30" className="h-3.5 w-5 rounded-[2px]" aria-hidden="true">
      <clipPath id="flag-gb-s">
        <path d="M0,0 v30 h60 v-30 z" />
      </clipPath>
      <clipPath id="flag-gb-t">
        <path d="M30,15 h30 v15 z v15 h-30 z h-30 v-15 z v-15 h30 z" />
      </clipPath>
      <g clipPath="url(#flag-gb-s)">
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#ffffff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" clipPath="url(#flag-gb-t)" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#ffffff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

interface LanguageSwitcherProps {
  lang: Locale;
  label: string;
}

export default function LanguageSwitcher({ lang, label }: LanguageSwitcherProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={label}
      className="flex items-center rounded-full border border-gray-800/60 bg-[#0b111e]/60 p-0.5 text-xs font-semibold"
    >
      {locales.map((locale) => {
        const active = locale === lang;
        const { code, name } = LANGUAGES[locale];
        return (
          <Link
            key={locale}
            href={switchLocalePath(pathname, locale)}
            hrefLang={locale}
            lang={locale}
            title={name}
            aria-current={active ? "true" : undefined}
            className={`flex items-center gap-1.5 rounded-full px-2 py-1.5 transition-colors sm:px-2.5 ${
              active ? "bg-cyan-500/20 text-white" : "text-gray-400 hover:text-white"
            }`}
          >
            <Flag locale={locale} />
            <span className="hidden sm:inline">{code}</span>
            <span className="sr-only sm:hidden">{name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
```

- [ ] **Step 8: NavBar ersetzen**

`components/ui/NavBar.tsx`:

```tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

interface NavbarProps {
  lang: Locale;
  dict: Dictionary["nav"];
  /** Nur Logo (und Umschalter), ohne Menü – z. B. für Impressum und Datenschutz. */
  minimal?: boolean;
  /** Umschalter ausblenden, z. B. im deutschsprachigen Admin-Bereich. */
  hideSwitcher?: boolean;
}

const NAV_ANCHORS = [
  { href: "#services", key: "services" },
  { href: "#experience", key: "experience" },
  { href: "#techstack", key: "technologies" },
  { href: "#about", key: "about" },
] as const;

export default function Navbar({ lang, dict, minimal, hideSwitcher }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-[#060b13]/40 backdrop-blur-md border-b border-gray-800/20">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Logo lang={lang} />

        <div className="flex items-center gap-3 md:gap-8">
          {!minimal ? (
            <div className="hidden md:flex items-center gap-10">
              <nav className="flex items-center gap-6">
                {NAV_ANCHORS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-sm font-normal text-gray-400 hover:text-white transition-colors"
                  >
                    {dict[link.key]}
                  </Link>
                ))}
              </nav>

              <Link
                href="#contact"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 rounded-full shadow-lg shadow-cyan-500/20 transition-all duration-200"
              >
                {dict.contact}
              </Link>
            </div>
          ) : null}

          {/* Ganz rechts oben: Sprachumschalter */}
          {!hideSwitcher ? <LanguageSwitcher lang={lang} label={dict.languageLabel} /> : null}

          {!minimal ? (
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((open) => !open)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={isMobileMenuOpen ? dict.closeMenu : dict.openMenu}
              className="md:hidden p-2 text-gray-400 hover:text-white focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          ) : null}
        </div>
      </div>

      {!minimal && isMobileMenuOpen ? (
        <nav
          id="mobile-menu"
          className="md:hidden border-t border-gray-800/40 bg-[#060b13]/95 backdrop-blur-md px-6 py-4 flex flex-col gap-4"
        >
          {NAV_ANCHORS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              {dict[link.key]}
            </Link>
          ))}
          <Link
            href="#contact"
            onClick={() => setIsMobileMenuOpen(false)}
            className="mt-2 px-6 py-2.5 text-sm font-semibold text-center text-white bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full"
          >
            {dict.contact}
          </Link>
        </nav>
      ) : null}
    </header>
  );
}
```

Vor dem Überschreiben die bisherige Datei ab Zeile 80 lesen (`sed -n 78,120p components/ui/NavBar.tsx`) und prüfen, dass der mobile Menü-Block nichts enthält, was oben nicht abgebildet ist (z. B. Zusatz-Links); gegebenenfalls übernehmen.

- [ ] **Step 9: Impressum und Datenschutz an `[lang]` anpassen**

In `app/[lang]/impressum/page.tsx` den Kopf (Importe, `metadata`, Funktionskopf, `<Navbar minimal />`, `<h1>`) ersetzen:

```tsx
import Navbar from "@/components/ui/NavBar";
import Footer from "@/components/ui/Footer";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type PageProps = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { legal } = await getDictionary(lang);
  return {
    title: legal.impressumTitle,
    alternates: {
      canonical: `/${lang}/impressum`,
      languages: { en: "/en/impressum", de: "/de/impressum", "x-default": "/en/impressum" },
    },
  };
}

export default async function ImpressumPage({ params }: PageProps) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = await getDictionary(lang);

  return (
    <div className="bg-[#060b13] min-h-screen text-white">
      <Navbar minimal lang={lang} dict={dict.nav} />
      <main className="pt-28 pb-20">
        <div className="mx-auto max-w-3xl px-6 space-y-8">
          {lang !== "de" ? (
            <p lang="en" className="rounded-xl border border-cyan-800/30 bg-cyan-950/30 px-4 py-3 text-sm text-cyan-200">
              {dict.legal.notice}
            </p>
          ) : null}
          <h1 className="text-4xl font-extrabold tracking-tight">Impressum</h1>
```

Den Rest der Datei (alle `<section>`-Blöcke, Texte bleiben deutsch) nicht ändern, nur `<Footer />` ersetzen durch `<Footer lang={lang} dict={dict.footer} />`.

`app/[lang]/datenschutz/page.tsx` genauso: gleicher Kopf, aber `legal.datenschutzTitle`, Pfade `/datenschutz`, Funktionsname `DatenschutzPage`, `<h1>` bleibt "Datenschutzerklärung", `<Footer />` wie oben ersetzen.

- [ ] **Step 10: Admin-Seite anpassen**

In `app/admin/page.tsx`: Import `import { getDictionary } from '@/lib/i18n/dictionaries';` ergänzen, direkt am Anfang von `AdminPage` (vor dem Supabase-Block) `const dict = await getDictionary('de');` einfügen und ersetzen:
- `<Navbar minimal />` → `<Navbar minimal hideSwitcher lang="de" dict={dict.nav} />`
- `<Footer />` → `<Footer lang="de" dict={dict.footer} />`

- [ ] **Step 11: Tests, Typcheck, Lint**

Run: `npm test && npx tsc --noEmit && npm run lint`
Expected: Tests PASS (inklusive Proxy-Test), `tsc` ohne Fehler, Lint ohne neue Fehler.

- [ ] **Step 12: Dev-Server starten und per curl prüfen**

Run: `npm run dev` (im Hintergrund), dann nach ca. 5 Sekunden:

```bash
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -H "Accept-Language: de-DE,de;q=0.9" http://localhost:3000/
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -H "Accept-Language: fr" "http://localhost:3000/impressum?utm=1"
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/en
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/de/datenschutz
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/admin
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/api/contact
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3000/images/profile_business.jpg
curl -s http://localhost:3000/en | grep -o '<html lang="[a-z]*"'
curl -s http://localhost:3000/de | grep -o '<html lang="[a-z]*"'
```
Expected der Reihe nach: `307 http://localhost:3000/de`, `307 http://localhost:3000/en/impressum?utm=1`, `200`, `200`, `401`, `401`, `200`, `<html lang="en"`, `<html lang="de"`.

- [ ] **Step 13: Sichtprüfung des Headers (Review Focus 5)**

Im Browser `http://localhost:3000/en` und `/de` öffnen: Umschalter ganz oben rechts, aktive Sprache hervorgehoben, Klick wechselt die Sprache und bleibt auf derselben Seite (auch auf `/en/impressum`). Fensterbreite auf 375 px verkleinern: Logo, Umschalter und Hamburger dürfen nicht überlaufen. Falls doch: im `Logo` auf kleinen Breiten den Gap/Text verkleinern (`sm:`-Varianten) oder den Umschalter kompakter machen, bis es passt.

- [ ] **Step 14: Commit**

```bash
git add proxy.ts tests/proxy.test.ts lib/fonts.ts "app/[lang]" app/admin/layout.tsx app/admin/page.tsx components/ui/NavBar.tsx components/ui/Logo.tsx components/ui/Footer.tsx components/ui/LanguageSwitcher.tsx
git add -u app/layout.tsx app/page.tsx app/impressum app/datenschutz
git commit -m "feat: add /en and /de routing with language switcher and bilingual shell" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
git status --short
```
Expected: `git status --short` zeigt nur `?? explaining.txt` (und nichts Unbeabsichtigtes).

---

### Task 5: Hero und Leistungen

**Files:**
- Modify: `components/sections/Teaser.tsx`
- Modify: `components/sections/Services.tsx` (komplett ersetzen)
- Modify: `app/[lang]/page.tsx`

**Interfaces:**
- Consumes: `Dictionary['hero']`, `Dictionary['services']` (Task 2).
- Produces: `Teaser({ dict: Dictionary['hero'] })`, `Services({ dict: Dictionary['services'] })`.

- [ ] **Step 1: `Teaser.tsx` umstellen**

Import und Signatur:

```tsx
import Image from "next/image";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const TECH_BADGES = ["PHP 8", "Symfony", "Laravel", "Vue.js", "Docker"];

export default function Teaser({ dict }: { dict: Dictionary["hero"] }) {
```

Weitere Ersetzungen (alt → neu):

1. `Professional IT Services` → `{dict.eyebrow}`
2. Der gesamte `<h1>…</h1>`-Block →
```tsx
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {dict.titleLine1} <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {dict.titleHighlight}
            </span>
          </h1>
```
(Die größte Stufe `lg:text-6xl` entfällt, weil die neue Überschrift länger ist.)
3. Der gesamte `<p className="text-gray-400 text-base md:text-lg …">…</p>`-Block → `<p className="text-gray-400 text-base md:text-lg leading-relaxed max-w-xl">{dict.text}</p>`
4. Die beiden `<button>`-Elemente → Anker, damit sie ein Ziel haben:
```tsx
            <a
              href="#contact"
              className="px-6 py-3 font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-lg shadow-blue-600/20 transition-all duration-200"
            >
              {dict.ctaPrimary}
            </a>
            <a
              href="#experience"
              className="px-6 py-3 font-semibold text-gray-300 bg-gray-900/60 hover:bg-gray-800 border border-gray-800 hover:border-gray-700 rounded-lg transition-all duration-200"
            >
              {dict.ctaSecondary}
            </a>
```
5. `alt="Alexander Liebing"` → `alt={dict.profile.imageAlt}`
6. `<h3 …>Alexander Liebing</h3>` → `<h3 …>{dict.profile.name}</h3>`
7. `Founder & Lead Engineer` → `{dict.profile.role}`
8. `Jahre Erfahrung` → `{dict.profile.yearsLabel}`; `Großprojekte` → `{dict.profile.projectsLabel}`
9. `{['PHP 8', 'Symfony', 'Laravel', 'Vue.js', 'Docker'].map((tech) => (` → `{TECH_BADGES.map((tech) => (`

- [ ] **Step 2: `Services.tsx` komplett ersetzen**

```tsx
import type { Dictionary } from '@/lib/i18n/dictionaries';

// Reihenfolge entspricht dictionary.services.items: Entwicklung, Architektur, Betreuung.
const serviceStyles = [
  {
    iconColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
  },
  {
    iconColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 002-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    iconColor: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Services({ dict }: { dict: Dictionary['services'] }) {
  return (
    <section id="services" className="w-full bg-[#0c1016] text-white py-30 px-6 relative overflow-hidden border-t border-b border-gray-700/70">
      <div className="max-w-7xl mx-auto relative z-10 w-full">

        {/* Sektions-Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            {dict.title}
          </h2>
          <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {dict.intro}
          </p>
        </div>

        {/* 3-Spalten-Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {dict.items.map((service, index) => {
            const style = serviceStyles[index];
            return (
              <div
                key={service.title}
                className="bg-[#0b111e]/40 border border-gray-800/40 rounded-2xl p-8 md:p-10 flex flex-col backdrop-blur-sm shadow-xl transition-all duration-300 hover:border-gray-700/60"
              >
                {/* Farb-Icon-Badge oben links */}
                <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-6 ${style.iconColor}`}>
                  {style.icon}
                </div>

                {/* Titel & Untertitel */}
                <h3 className="text-xl font-bold text-gray-100 mb-2">{service.title}</h3>
                <p className="text-xs text-gray-400/80 leading-relaxed font-medium mb-8">{service.subtitle}</p>

                {/* Aufzählungspunkte */}
                <ul className="space-y-4 mt-auto">
                  {service.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm text-gray-400/90 leading-relaxed">
                      <span className="text-cyan-400 font-semibold select-none flex-shrink-0 mt-0.5">✓</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Step 3: `app/[lang]/page.tsx` anpassen**

`<Teaser />` → `<Teaser dict={dict.hero} />` und `<Services />` → `<Services dict={dict.services} />`.

- [ ] **Step 4: Prüfen**

Run: `npx tsc --noEmit && npm run lint`
Expected: keine Fehler.

Run (Dev-Server läuft):
```bash
curl -s http://localhost:3000/en | grep -c "Built cleanly. Maintainable for the long run."
curl -s http://localhost:3000/de | grep -c "Sauber entwickelt. Langfristig wartbar."
curl -s http://localhost:3000/en | grep -c "Architecture &amp; Modernisation"
curl -s http://localhost:3000/de | grep -c "Architektur &amp; Modernisierung"
```
Expected: jeweils `1` (oder höher, nie `0`).

- [ ] **Step 5: Commit**

```bash
git add components/sections/Teaser.tsx components/sections/Services.tsx "app/[lang]/page.tsx"
git commit -m "feat: reposition hero and services as expert brand in EN/DE" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 6: Projekterfahrung (inkl. eigenes Projekt)

**Files:**
- Move: `components/sections/Projects.tsx` → `components/sections/Experience.tsx` (danach komplett ersetzen)
- Create: `components/sections/OwnProjectCard.tsx`
- Delete: `components/sections/References.tsx`
- Modify: `app/[lang]/page.tsx`

**Interfaces:**
- Consumes: `Dictionary['experience']`.
- Produces: `Experience({ dict: Dictionary['experience'] })`, `OwnProjectCard({ dict: Dictionary['experience']['ownProject'] })`. Section-ID ist `experience`.

- [ ] **Step 1: Umbenennen**

```bash
git mv components/sections/Projects.tsx components/sections/Experience.tsx
git rm components/sections/References.tsx
```

- [ ] **Step 2: `OwnProjectCard.tsx` anlegen** (übernimmt Optik und Links der bisherigen Referenz-Karte)

```tsx
import type { Dictionary } from '@/lib/i18n/dictionaries';

const PROJECT_URL = 'https://aliebing-moviefinder-app-cj75ca.streamlit.app/';

export default function OwnProjectCard({ dict }: { dict: Dictionary['experience']['ownProject'] }) {
  return (
    <div className="relative group">
      <div className="w-full bg-[#0b111e]/50 border border-gray-800/40 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-xl relative overflow-hidden">

        {/* Glow-Effekte innerhalb der Karte */}
        <div className="absolute top-[15%] left-[-10%] w-[350px] h-[350px] bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen" />
        <div className="absolute bottom-[5%] right-[-15%] w-[300px] h-[300px] bg-blue-500/15 rounded-full blur-[90px] pointer-events-none z-0 mix-blend-screen" />

        <div className="flex flex-col md:flex-row gap-6 items-start relative z-10">

          {/* Linke Seite: Titel & Beschreibung */}
          <div className="flex-1">
            <span className="inline-block mb-3 text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded uppercase tracking-wider">
              {dict.badge}
            </span>

            <h3 className="text-lg md:text-xl font-bold text-gray-100 mb-2">{dict.title}</h3>

            <p className="text-xs md:text-sm text-gray-400 leading-relaxed mb-4">
              {dict.descriptionBefore}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                {dict.descriptionHighlight}
              </span>
              {dict.descriptionAfter}
            </p>

            {/* Tech-Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {dict.tags.map((tag) => (
                <span key={tag} className="text-xs text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2 py-1 rounded">
                  {tag}
                </span>
              ))}
            </div>

            <a
              href={PROJECT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-5 rounded-lg transition-colors"
            >
              {dict.cta}
            </a>
          </div>

          {/* Rechte Seite: Bild */}
          <div className="w-full md:w-100 flex-shrink-0">
            <a href={PROJECT_URL} target="_blank" rel="noopener noreferrer">
              <img
                src="/images/moviefinder-screenshot.png"
                alt={dict.title}
                className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              />
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
```

- [ ] **Step 3: `Experience.tsx` komplett ersetzen**

```tsx
import type { Dictionary } from '@/lib/i18n/dictionaries';
import OwnProjectCard from './OwnProjectCard';

export default function Experience({ dict }: { dict: Dictionary['experience'] }) {
  return (
    <section id="experience" className="w-full bg-[#060b13] text-white py-30 px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header-Bereich */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {dict.title}
          </h2>
          <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            {dict.intro}
          </p>
        </div>

        {/* Projekt-Liste mit Zeitleisten-Effekt */}
        <div className="relative border-l border-gray-800/60 pl-6 md:pl-8 space-y-12">

          {dict.projects.map((project) => (
            <div key={project.title} className="relative group">

              {/* Der blau leuchtende Timeline-Punkt */}
              <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-3.5 h-3.5 rounded-full bg-[#060b13] border-2 border-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.6)]" />

              {/* Projekt-Karte */}
              <div className="w-full bg-[#0b111e]/50 border border-gray-800/40 rounded-xl p-6 md:p-8 backdrop-blur-sm shadow-xl">

                {/* Meta-Zeile (Datum & Rolle) */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800/60 pb-4 mb-5">
                  <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-800/30 px-2.5 py-1 rounded">
                    {project.period}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {project.role}
                  </span>
                </div>

                {/* Titel & Beschreibung */}
                <h3 className="text-xl md:text-2xl font-bold text-gray-100 mb-3">
                  {project.title}
                </h3>
                <p className="text-sm md:text-base text-gray-400 leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Aufgaben / Ergebnisse */}
                <div className="space-y-3 mb-6">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    {dict.resultsLabel}
                  </h4>
                  <ul className="space-y-2 text-xs md:text-sm text-gray-400/90 list-none pl-0">
                    {project.tasks.map((task) => (
                      <li key={task} className="relative pl-5 before:content-['-'] before:absolute before:left-0 before:text-cyan-500 before:font-bold">
                        {task}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Tech-Tags */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-800/40">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-medium text-gray-400 bg-gray-900/80 border border-gray-800/60 rounded transition-colors hover:border-gray-700 hover:text-gray-300"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

              </div>
            </div>
          ))}

        </div>

        {/* Eigenes Projekt (vorher eigene Sektion "Referenzen") */}
        <div className="mt-16">
          <OwnProjectCard dict={dict.ownProject} />
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Step 4: `app/[lang]/page.tsx` anpassen**

Imports: `import Projects from '@/components/sections/Projects';` → `import Experience from '@/components/sections/Experience';`, die Zeile `import References …` entfernen. Im JSX `<Projects />` → `<Experience dict={dict.experience} />` und die Zeile `<References />` entfernen.

- [ ] **Step 5: Prüfen**

Run: `npx tsc --noEmit && npm run lint`
Expected: keine Fehler.

```bash
curl -s http://localhost:3000/en | grep -c 'id="experience"'
curl -s http://localhost:3000/en | grep -c "Lead Backend Developer"
curl -s http://localhost:3000/en | grep -ci "freelance"
curl -s http://localhost:3000/de | grep -c "Eigenes Projekt"
curl -s http://localhost:3000/de | grep -c 'id="references"'
```
Expected: `1`, mindestens `1`, `0`, mindestens `1`, `0`.

- [ ] **Step 6: Commit**

```bash
git add components/sections/Experience.tsx components/sections/OwnProjectCard.tsx "app/[lang]/page.tsx"
git add -u components/sections/Projects.tsx components/sections/References.tsx
git commit -m "feat: turn projects into experience section and fold in own project" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 7: Technologien und Über mich

**Files:**
- Modify: `components/sections/Technologies.tsx` (komplett ersetzen)
- Modify: `components/sections/About.tsx`
- Modify: `app/[lang]/page.tsx`

**Interfaces:**
- Consumes: `Dictionary['technologies']`, `Dictionary['about']`.
- Produces: `Technologies({ dict })`, `About({ dict })`. Section-IDs `techstack` und `about` bleiben.

- [ ] **Step 1: `Technologies.tsx` komplett ersetzen** (keine Prozentbalken mehr)

```tsx
import type { Dictionary } from '@/lib/i18n/dictionaries';

export default function Technologies({ dict }: { dict: Dictionary['technologies'] }) {
  return (
    <section id="techstack" className="w-full bg-[#0c1016] text-white py-30 px-6 relative overflow-hidden border-t border-b border-gray-700/70">
      <div className="max-w-7xl mx-auto relative z-10 w-full">

        {/* Hintergrund-Glows */}
        <div className="absolute top-[35%] left-[0%] w-[400px] h-[400px] bg-cyan-500/12 rounded-full blur-[100px] pointer-events-none z-0 mix-blend-screen" />
        <div className="absolute bottom-[20%] right-[12%] w-[300px] h-[300px] bg-blue-500/15 rounded-full blur-[90px] pointer-events-none z-0 mix-blend-screen" />

        {/* Sektions-Header */}
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {dict.title}
          </h2>
          <div className="w-12 h-1 bg-blue-500 mx-auto rounded-full mt-2"></div>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed pt-2">
            {dict.intro}
          </p>
        </div>

        {/* Zwei Gruppen: Schwerpunkt und weitere Erfahrung */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#0b111e]/40 border border-gray-800/60 rounded-2xl p-8 md:p-10 backdrop-blur-sm shadow-2xl">
            <h3 className="text-lg font-bold text-cyan-400 mb-6">{dict.focusLabel}</h3>
            <ul className="flex flex-wrap gap-3">
              {dict.focusItems.map((item) => (
                <li
                  key={item}
                  className="px-3 py-1.5 text-sm font-medium text-cyan-300 bg-cyan-950/40 border border-cyan-800/40 rounded-lg"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-[#0b111e]/40 border border-gray-800/60 rounded-2xl p-8 md:p-10 backdrop-blur-sm shadow-2xl">
            <h3 className="text-lg font-bold text-gray-300 mb-6">{dict.furtherLabel}</h3>
            <ul className="flex flex-wrap gap-3">
              {dict.furtherItems.map((item) => (
                <li
                  key={item}
                  className="px-3 py-1.5 text-sm font-medium text-gray-400 bg-gray-900/80 border border-gray-800/60 rounded-lg"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </section>
  );
}
```

- [ ] **Step 2: `About.tsx` umstellen**

1. Oben den Block `const features = [ … ];` (drei Einträge mit `title`/`desc`) entfernen und stattdessen den Typ-Import setzen: `import type { Dictionary } from "@/lib/i18n/dictionaries";` (unter dem vorhandenen `import Image from "next/image";`).
2. `export default function About() {` → `export default function About({ dict }: { dict: Dictionary["about"] }) {`
3. `alt="Alexander Liebing"` → `alt={dict.imageAlt}`
4. Badge-Text `Das Gesicht hinter der Firma` → `{dict.badge}`
5. `Über Alexander Liebing` (im `<h2>`) → `{dict.title}`
6. Den Textblock mit den drei `<p>` ersetzen durch:
```tsx
            <p className="text-gray-200 font-medium">{dict.lead}</p>
            {dict.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
```
7. Die Feature-Boxen: `{features.map((feat, idx) => (` → `{dict.features.map((feat) => (`, `key={idx}` → `key={feat.title}`, `{feat.desc}` → `{feat.description}`.

- [ ] **Step 3: `app/[lang]/page.tsx` anpassen**

`<Technologies />` → `<Technologies dict={dict.technologies} />`, `<About />` → `<About dict={dict.about} />`.

- [ ] **Step 4: Prüfen**

Run: `npx tsc --noEmit && npm run lint`
Expected: keine Fehler.

```bash
curl -s http://localhost:3000/en | grep -c "Legacy modernisation"
curl -s http://localhost:3000/de | grep -c "Legacy-Modernisierung"
curl -s http://localhost:3000/en | grep -c "With Xento I bundle my many years"
curl -s http://localhost:3000/de | grep -c "Mit Xento bündele ich"
curl -s http://localhost:3000/de | grep -c "Firmengründung"
```
Expected: jeweils mindestens `1`, die letzte Zeile `0`.

- [ ] **Step 5: Commit**

```bash
git add components/sections/Technologies.tsx components/sections/About.tsx "app/[lang]/page.tsx"
git commit -m "feat: replace skill bars with focus/experience groups and rewrite about me" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 8: Kontaktformular zweisprachig

**Files:**
- Modify: `components/sections/Contact.tsx`
- Modify: `app/[lang]/page.tsx`

**Interfaces:**
- Consumes: `Dictionary['contact']`, `Locale`, API-Fehlercodes aus Task 3.
- Produces: `Contact({ lang: Locale; dict: Dictionary['contact'] })`; sendet `{ name, email, company, service, message, lang }` an `/api/contact`.

- [ ] **Step 1: Kopf der Komponente ersetzen** (alles von `'use client';` bis einschließlich `handleSubmit`, also bis vor `return (`)

```tsx
'use client';
import { ChangeEvent, useState } from 'react';
import type { Locale } from '@/lib/i18n/config';
import type { Dictionary } from '@/lib/i18n/dictionaries';

type ContactProps = {
  lang: Locale;
  dict: Dictionary['contact'];
};

const INITIAL_FORM = {
  name: '',
  email: '',
  company: '',
  service: 'development',
  message: '',
};

export default function Contact({ lang, dict }: ContactProps) {
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [status, setStatus] = useState<{ loading: boolean; success: string | null; error: string | null }>({ loading: false, success: null, error: null });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Der Server liefert nur Fehler-Codes; der Text kommt aus dem Wörterbuch der aktuellen Sprache.
  const errorFor = (code: unknown): string =>
    typeof code === 'string' && code in dict.errors
      ? dict.errors[code as keyof typeof dict.errors]
      : dict.errors.internal;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus({ loading: true, success: null, error: null });

    let response: Response;
    try {
      response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, lang }),
      });
    } catch {
      setStatus({ loading: false, success: null, error: dict.errors.network });
      return;
    }

    const result = await response.json().catch(() => null);

    if (response.ok) {
      setStatus({ loading: false, success: dict.form.success, error: null });
      setFormData(INITIAL_FORM);
    } else {
      setStatus({ loading: false, success: null, error: errorFor(result?.code) });
    }
  };

```

- [ ] **Step 2: Texte im JSX ersetzen (alt → neu)**

1. `Starten wir Ihr Projekt` → `{dict.title}`
2. Den Absatz `Sie benötigen Unterstützung in der Programmierung, Beratung oder beim Support Ihrer Anwendungen? Schreiben Sie uns.` → `{dict.intro}`
3. `Kontaktdaten</h3>` → `{dict.detailsTitle}</h3>`
4. Den Absatz `Zögern Sie nicht, Kontakt aufzunehmen. Wir antworten in der Regel innerhalb von 24 Stunden.` → `{dict.detailsText}`
5. `tracking-wider text-gray-500 block">E-Mail</span>` → `tracking-wider text-gray-500 block">{dict.emailLabel}</span>`
6. `…block">Telefon</span>` → `…block">{dict.phoneLabel}</span>`
7. `…block">Standort</span>` → `…block">{dict.locationLabel}</span>`
8. `Karlsruhe, Deutschland (vor Ort & Remote)` → `{dict.locationValue}`
9. `Ihr Name / Ansprechpartner *` → `{dict.form.name}`; `placeholder="z. B. Max Mustermann"` → `placeholder={dict.form.namePlaceholder}`
10. `E-Mail Adresse *` → `{dict.form.email}`; `placeholder="ihre@mail.de"` → `placeholder={dict.form.emailPlaceholder}`
11. `<label …>Firma</label>` → `{dict.form.company}`; `placeholder="z. B. Muster GmbH"` → `placeholder={dict.form.companyPlaceholder}`
12. `Gewünschte Dienstleistung *` → `{dict.form.service}`
13. Die drei `<option>`-Zeilen ersetzen durch:
```tsx
                  <option value="development" className="bg-[#060b13]">{dict.form.serviceOptions.development}</option>
                  <option value="architecture" className="bg-[#060b13]">{dict.form.serviceOptions.architecture}</option>
                  <option value="support" className="bg-[#060b13]">{dict.form.serviceOptions.support}</option>
```
14. `Details zu Ihrer Anfrage *` → `{dict.form.message}`; den `placeholder="Bitte geben Sie hier alle relevanten Informationen …"` → `placeholder={dict.form.messagePlaceholder}`
15. `Anfrage wird gesendet...` → `{dict.form.sending}`
16. Den Button-Text `Anfrage absenden` → `{dict.form.submit}`

- [ ] **Step 3: `app/[lang]/page.tsx` anpassen**

`<Contact />` → `<Contact lang={lang} dict={dict.contact} />`.

- [ ] **Step 4: Typcheck, Lint, Reste suchen**

Run: `npx tsc --noEmit && npm run lint`
Expected: keine Fehler.

Run: `grep -n "Programmierung\|Anfrage\|Ihr \|Firma" components/sections/Contact.tsx`
Expected: keine Treffer (keine deutschen Reste im Code).

- [ ] **Step 5: Funktionsprüfung im Browser**

`/en`: Formular leer absenden → Browser meldet Pflichtfelder; ungültige E-Mail wie `a@b` trotzdem absenden (Browser-Validierung ggf. mit `novalidate` im DevTools umgehen) → englische Fehlermeldung. `/de`: gleiche Prüfung → deutsche Meldung. Erfolgsfall: siehe Task 9 (DB-Migration nötig).

- [ ] **Step 6: Commit**

```bash
git add components/sections/Contact.tsx "app/[lang]/page.tsx"
git commit -m "feat: localize contact form and send request language to the API" -m "Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>"
```

---

### Task 9: Gesamtprüfung

**Files:** keine Änderungen, nur Prüfung. Fehler hier werden im jeweils zuständigen Task-Bereich behoben und in einem eigenen Commit festgehalten.

- [ ] **Step 1: Alle Tests, Typcheck, Lint**

Run: `npm test && npx tsc --noEmit && npm run lint`
Expected: alle Tests PASS, keine Fehler.

- [ ] **Step 2: Produktions-Build**

Run: `pkill -f "next dev"; npm run build`
Expected: Build endet ohne Fehler; die Routenliste zeigt `/[lang]` statisch (`●`) mit `/en` und `/de`, außerdem `/[lang]/impressum`, `/[lang]/datenschutz`, `/admin` (dynamisch), `/api/contact`.

- [ ] **Step 3: Produktionsserver starten und Matrix prüfen (Review Focus 1, 2)**

Run: `npm run start` (im Hintergrund), dann:

```bash
B=http://localhost:3000
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -H "Accept-Language: de-DE" $B/
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" -H "Accept-Language: fr" $B/
curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" "$B/impressum?utm=1"
for p in /en /de /en/impressum /de/impressum /en/datenschutz /de/datenschutz; do curl -s -o /dev/null -w "$p %{http_code}\n" $B$p; done
curl -s -o /dev/null -w "/fr (follow) %{http_code}\n" -L $B/fr
curl -s -o /dev/null -w "/admin %{http_code}\n" $B/admin
curl -s -o /dev/null -w "GET /api/contact %{http_code}\n" $B/api/contact
curl -s -o /dev/null -w "image %{http_code}\n" $B/images/profile_business.jpg
curl -s $B/en | grep -o 'hrefLang="[a-z-]*"' | sort -u
curl -s $B/en/impressum | grep -c "only available in German"
curl -s $B/de/impressum | grep -c "only available in German"
```
Expected der Reihe nach: `307 …/de`, `307 …/en`, `307 …/en/impressum?utm=1`, sechsmal `200`, `/fr (follow) 404`, `/admin 401`, `GET /api/contact 401`, `image 200`, `hrefLang="de"`, `hrefLang="en"` und `hrefLang="x-default"` (Reihenfolge egal), danach `1` und `0`.

- [ ] **Step 4: Kontaktformular Ende-zu-Ende (setzt Task 3 Step 9 voraus, Review Focus 4)**

```bash
curl -s -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" \
  -d '{"name":"TEST bitte löschen","email":"test@example.com","service":"development","message":"Testanfrage Plan-Verifikation","lang":"de"}'
curl -s -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d 'kein json'
curl -s -X POST http://localhost:3000/api/contact -H "Content-Type: application/json" -d '{"name":"x"}'
```
Expected: erste Antwort `{"success":true,…}`, zweite `{"code":"missing_fields"}`, dritte `{"code":"missing_fields"}`. Schlägt die erste mit `{"code":"save_failed"}` fehl, fehlt die Spalte `lang` (Migration aus Task 3 Step 9 nicht ausgeführt). Danach im Admin-Dashboard `/admin` prüfen, dass der Eintrag mit "Softwareentwicklung" und dem Badge `DE` erscheint, und den Testeintrag in Supabase löschen. Hinweis: das Rate-Limit erlaubt 5 Anfragen pro 10 Minuten und IP.

- [ ] **Step 5: Sichtprüfung in beiden Sprachen (Review Focus 5)**

Server läuft (`npm run start` oder `npm run dev`). In `/en` und `/de` bei Desktopbreite (ca. 1280 px) und 375 px durchgehen: Hero, Leistungen (drei Karten), Projekterfahrung (fünf Projekte plus "Own project"/"Eigenes Projekt"), Technologien (zwei Gruppen), Über mich, Kontakt, Footer. Prüfen: keine Textüberläufe, Header auf 375 px ohne horizontales Scrollen, Hero-Buttons und Navigationsanker springen zum richtigen Abschnitt, der Umschalter wechselt auf dieselbe Seite in der anderen Sprache (auch auf `/en/impressum`), Flaggen sind sichtbar. Quer prüfen, dass nirgends mehr "wir/we", "Freelance" oder Prozentbalken auftauchen:

```bash
curl -s http://localhost:3000/en | grep -oiE "\b(we|our)\b|freelance|[0-9]+ ?%" | sort -u
curl -s http://localhost:3000/de | grep -oiE "\bwir\b|\bunser[a-z]*\b|freelance|[0-9]+ ?%" | sort -u
```
Expected: keine Ausgabe (Treffer innerhalb von Script-/CSS-Inhalten des HTML wie `100%` prüfen und ignorieren, wenn sie nicht im sichtbaren Text stehen).

- [ ] **Step 6: Aufräumen und Übergabe**

Server beenden (`pkill -f "next start"`), `git status --short` prüfen (nur `?? explaining.txt`). Dem Nutzer berichten: was geprüft wurde, ob die Datenbank-Migration lief, und dass in Vercel `NEXT_PUBLIC_SITE_URL` auf die echte Domain gesetzt werden sollte, damit `hreflang`/Canonical-Links stimmen.

---

## Self-Review (gegen die Spec)

- **Routing und Struktur:** Task 1 (Sprachen, Negotiation, Pfadwechsel), Task 4 (`app/[lang]`, `generateStaticParams`, `<html lang>`, hreflang/Metadata, Proxy mit Admin-Auth und Ausnahmen, Umschalter oben rechts mit Flagge + Kürzel, Sprachpräfix in Logo/Footer). Wörterbuch-Ort und Admin-Layout als Abweichung in Task 1 in die Spec eingetragen.
- **Inhalte:** Navigation (Task 4 + Wörterbuch), Hero inkl. funktionierender Buttons (Task 5), Services mit drei Bereichen (Task 5), Experience inkl. "Own project" und ohne "(Freelance)", `References.tsx` entfernt (Task 6), Technologies ohne Prozentbalken (Task 7), About in Ich-Form mit neuem Kernsatz (Task 7), Contact mit Fehler-Codes und Sprache (Task 3 + 8), Marke "Xento IT-Solutions" (Wörterbuch, Footer, Test), Impressum/Datenschutz deutsch mit englischem Hinweis (Task 4).
- **Nicht Teil:** Kein Redesign, keine englischen Rechtstexte, Admin bleibt deutsch (nur `serviceLabelDe` und `lang`-Badge ergänzt, siehe Spec: Feld für die Anfragesprache).
- **Test und Abnahme:** Build/Lint/Typen (Task 9 Step 1–2), Redirect-Matrix und 404 (Task 4 Step 12, Task 9 Step 3), Umschalter (Task 4 Step 13, Task 9 Step 5), Admin-Auth/API (Task 4 Test, Task 9 Step 3), Formular mit Sprache in der DB (Task 9 Step 4), Sichtprüfung (Task 9 Step 5).
- **Typkonsistenz:** `Locale`/`hasLocale`/`switchLocalePath` (Task 1) werden in Proxy, Switcher, Footer, Logo, Contact, `lib/contact.ts` mit denselben Signaturen verwendet; `Dictionary`-Abschnitte (`nav`, `hero`, `services`, `experience`, `technologies`, `about`, `contact`, `footer`, `legal`) stimmen mit den JSON-Dateien und den Komponenten-Props überein; Service-Schlüssel `development`/`architecture`/`support` sind in Wörterbuch, Formular und `serviceLabelDe` identisch.
- **Platzhalter:** Keine. Einzige bewusste Nutzer-Gates: Task 0 (Baseline-Commit), Task 2 (Textfreigabe), Task 3 Step 9 (Supabase-Migration).
