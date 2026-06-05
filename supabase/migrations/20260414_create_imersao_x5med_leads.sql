-- Migration: Tabela de leads da Imersão X5 Med Online
-- Projeto Supabase: Leads Magnet (azxmienpmmkddmvyujbm)
-- Data: 2026-04-14
-- Separada da tabela `leads` do EndoMax

create extension if not exists pgcrypto;

create table if not exists public.imersao_x5med_leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  whatsapp text not null,
  instagram text,
  faixa_faturamento text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  utm_term text,
  ref text,
  created_at timestamptz not null default now()
);

alter table public.imersao_x5med_leads enable row level security;

-- Policy de INSERT para qualquer role (anon inclusive).
-- Sem policies de SELECT/UPDATE/DELETE, a RLS bloqueia leitura/alteração por anon —
-- apenas service_role (bypass RLS) consegue ler os leads.
-- OBS: não usar `Prefer: return=representation` no insert feito pelo frontend,
-- pois isso exigiria SELECT e a RLS recusaria. O supabase-js, sem `.select()`, já faz isso.
drop policy if exists leads_insert_policy on public.imersao_x5med_leads;
create policy leads_insert_policy
  on public.imersao_x5med_leads
  for insert
  to public
  with check (true);

create index if not exists imersao_x5med_leads_created_at_idx
  on public.imersao_x5med_leads (created_at desc);
create index if not exists imersao_x5med_leads_email_idx
  on public.imersao_x5med_leads (email);
create index if not exists imersao_x5med_leads_utm_source_idx
  on public.imersao_x5med_leads (utm_source);

comment on table public.imersao_x5med_leads is 'Leads capturados pela LP da Imersão X5 Med Online (abril/2026)';
