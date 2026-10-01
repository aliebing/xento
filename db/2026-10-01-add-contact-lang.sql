-- Sprache der Kontaktanfrage ('en' oder 'de'), damit klar ist, in welcher Sprache geantwortet wird.
-- Im Supabase SQL-Editor ausführen, BEVOR die neue Version der Seite deployed wird.
alter table public.contact_messages add column if not exists lang text;
