-- Create table for contact messages
-- Run this in Supabase SQL editor (or via psql) for your project

create extension if not exists "pgcrypto";

create table public.contact_messages (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  company text,
  service text,
  message text not null,
  created_at timestamptz default now()
);

-- NOTES:
-- 1) If you plan to use client-side (anon) key to INSERT, enable RLS and add a policy.
--    Example (NOT recommended for public forms without protections):
--      alter table public.contact_messages enable row level security;
--      create policy "Allow anon insert" on public.contact_messages
--        for insert using (true) with check (true);
-- 2) Recommended: use the Service Role key only on the server (we do that in `app/api/contact/route.js`).
-- 3) After creating the table, re-run `node scripts/test-supabase.js` to verify access.
