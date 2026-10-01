# Expertenmarke Xento + Zweisprachigkeit (EN/DE) – Design

Stand: 2026-10-01 · Status: zur Freigabe

## Ziel

Das Online-Profil mischt Agentur ("wir", "Ihr Partner", "Founder & Lead Engineer") und Freelancer ("Freelance", "ich"). Es soll einheitlich als **Expertenmarke** auftreten:

- **Xento** = die professionelle Marke (Angebot, Leistungen, Kontakt).
- **Alexander Liebing** = der Senior-Experte dahinter (Erfahrung, Kompetenz, Projekte).
- Kein "wir". Erfahrung und Kompetenz in der Ich-Form.

Die Seite wird **auf Englisch** angeboten (Standardsprache) mit **Umschalter auf Deutsch**.

Erfolgskriterien:

1. Ein Besucher erkennt in wenigen Sekunden: Was bekomme ich, für wen, und wer macht es.
2. Kein Text spricht mehr abwechselnd als Agentur und als Einzelperson.
3. Jede Seite ist in beiden Sprachen unter eigener URL erreichbar (`/en/…`, `/de/…`).
4. Das Admin-Dashboard und die Basic-Auth funktionieren unverändert.

Das inhaltliche Konzept steht in `explaining.txt` und wird vollständig übernommen.

## Routing und Struktur

- `app/layout.tsx`, `app/page.tsx`, `app/impressum/`, `app/datenschutz/` ziehen nach `app/[lang]/`. `app/admin` und `app/api` bleiben außerhalb.
- Sprachen: `en` (Standard) und `de`. `generateStaticParams` erzeugt beide statisch. Unbekannte `lang`-Werte führen über `hasLocale` zu 404.
- `<html lang>` entspricht dem Pfad. Titel, Beschreibung und OpenGraph-Daten kommen pro Sprache aus dem Wörterbuch. `alternates.languages` setzt `hreflang` für `en` und `de`.
- `proxy.ts`:
  - Der Admin-Zweig (Basic Auth für `/admin/:path*`) bleibt unverändert.
  - Neu: Pfade ohne Sprachpräfix werden auf `/en/…` oder `/de/…` umgeleitet. Gewählt wird nach `Accept-Language`, Fallback `en`.
  - Ausgenommen: `/api`, `/admin`, `/_next` und Dateien mit Endung (Bilder, Favicon).
- Wörterbücher: `app/[lang]/dictionaries/en.json` und `de.json`. `en.json` ist die Typquelle, `de.json` muss dieselbe Struktur haben. Die Seite lädt das Wörterbuch auf dem Server und reicht jeder Sektion ihren Teil als Props. Client-Komponenten (`NavBar`, `Contact`, Umschalter) erhalten ihre Texte ebenfalls als Props, es wird kein Wörterbuch an den Client ausgeliefert.
- **Sprachumschalter** oben rechts im Header als Client-Komponente: Flagge plus Kürzel (🇬🇧 EN / 🇩🇪 DE). Er verlinkt auf dieselbe Seite in der anderen Sprache (`/en/impressum` ↔ `/de/impressum`). Auf dem Handy steht er neben dem Hamburger-Menü.
- Interne Links (Logo, Footer) enthalten das Sprachpräfix.

## Inhalte pro Sektion

**Navigation** (Anker-IDs sprachunabhängig): Services (`#services`) · Experience (`#experience`) · Technologies (`#techstack`) · About me (`#about`) · Contact (`#contact`), dazu der Kontakt-Button. Deutsch: Leistungen · Projekterfahrung · Technologien · Über mich · Kontakt.

**Hero**

- Eyebrow: "Software Development & IT Consulting · Karlsruhe & Remote".
- H1: "Complex web applications. Built cleanly. Maintainable for the long run."
- Text: Xento unterstützt Unternehmen bei anspruchsvoller PHP-/Symfony-Entwicklung, Softwarearchitektur und der Modernisierung bestehender Systeme; persönlich umgesetzt von Alexander Liebing mit über 20 Jahren Erfahrung.
- Buttons "Discuss a project" (→ `#contact`) und "View project experience" (→ `#experience`). Bisher haben die Buttons kein Ziel.
- Profilkarte: Alexander Liebing · Senior Software Engineer & Consultant · 20+ Jahre Erfahrung · 15+ Großprojekte. Tech-Badges bleiben.

**Services:** drei Bereiche – *Software Development* (Symfony/PHP, APIs), *Architecture & Modernisation* (Legacy, Refactoring, Migration), *Technical Support* (Performance, Fehleranalyse, Updates, Weiterentwicklung). Die bisherigen Stichpunkte werden darauf verteilt, DSGVO, CI/CD und Cloud erscheinen als Stichpunkte.

**Experience:** Die Projekthistorie wird zum Kern der Seite. Alle bisherigen Projekte bleiben inhaltlich erhalten. Zeiträume werden lokalisiert ("6 years" / "6 Jahre"). Der Zusatz "(Freelance)" bei den Rollen entfällt. Die Referenz *AI Movie Finder* wird als kleine Karte "Own project" ans Ende der Sektion verschoben; `References.tsx` und der Abschnitt "Referenzen" entfallen.

**Technologies:** Keine Prozentbalken. Zwei Gruppen: *Focus* (PHP 8 · Symfony · REST APIs · Software architecture · Legacy modernisation) und *Further experience* (Laravel · Vue.js · MySQL/MariaDB · Docker · Redis · Graylog · CI/CD · AWS). Technologienamen werden nicht übersetzt.

**About me:** Durchgehend Ich-Form. Statt "Mit der Firmengründung…" lautet der Kernsatz: "With Xento I bundle my many years of experience from enterprise and SME projects under my own brand." Die drei Feature-Boxen bleiben.

**Contact:** Labels, Platzhalter und Dropdown (die drei neuen Bereiche) sind übersetzt. Die API `/api/contact` liefert bei Fehlern künftig einen **Fehler-Code** statt eines deutschen Satzes, der Client zeigt die Meldung in der aktuellen Sprache. Gespeichert wird zusätzlich die Sprache der Anfrage. Das Admin-Dashboard bleibt auf Deutsch.

**Footer und Marke:** Einheitlicher Name **Xento IT-Solutions** (bisher teils "IT-Services"). Footer-Links führen auf `/{lang}/impressum` und `/{lang}/datenschutz`.

**Impressum und Datenschutz:** Nur auf Deutsch, da rechtlich verbindlich und noch mit Platzhaltern (Adresse). Unter `/en/…` steht ein kurzer englischer Hinweis, dass die Seite aus rechtlichen Gründen nur auf Deutsch vorliegt. Eine englische Fassung ist nicht Teil dieses Vorhabens.

## Nicht Teil dieses Vorhabens

- Visuelles Redesign, neue Farben oder neues Logo.
- Englische Rechtstexte.
- Übersetzung des Admin-Dashboards.
- Änderungen an Supabase-Schema über das Feld für die Anfragesprache hinaus.

## Texte

Alle Texte entstehen auf Basis von `explaining.txt` in beiden Sprachen. Vor dem Einbau legt Claude die vollständigen Wörterbuchtexte (`en` und `de`) zum Gegenlesen vor.

## Test und Abnahme

- `npm run build` und `npm run lint` laufen ohne Fehler; `en.json` und `de.json` haben identische Schlüssel (Typcheck).
- `/` leitet je nach `Accept-Language` auf `/en` oder `/de` um; unbekannte Sprachen landen auf `/en`.
- `/en`, `/de`, `/en/impressum`, `/de/datenschutz` liefern 200; `/fr` liefert 404.
- Der Umschalter wechselt auf dieselbe Seite in der anderen Sprache, auch mobil.
- `/admin` verlangt weiterhin Basic Auth, `/api/contact` bleibt erreichbar.
- Kontaktformular: Erfolg und Fehler erscheinen in der richtigen Sprache, die Anfrage landet mit Sprachangabe in der Datenbank.
- Sichtprüfung beider Sprachen auf Desktop und Handybreite: keine Textüberläufe, Anker-Navigation funktioniert.
