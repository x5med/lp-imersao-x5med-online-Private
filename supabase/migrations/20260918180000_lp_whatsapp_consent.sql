begin;

-- Imersão e as duas páginas de Secretaria usam a mesma tabela de leads.
alter table public.imersao_x5med_leads
  add column if not exists form_submission_id uuid,
  add column if not exists whatsapp_consent boolean not null default false,
  add column if not exists whatsapp_consent_text_version text not null default 'whatsapp_marketing_v1',
  add column if not exists whatsapp_consent_recorded_at timestamptz,
  add column if not exists whatsapp_consent_source text,
  add column if not exists whatsapp_consent_evidence jsonb not null default '{}'::jsonb;

drop index if exists public.imersao_x5med_leads_submission_id_key;
create unique index imersao_x5med_leads_submission_id_key
  on public.imersao_x5med_leads (form_submission_id);

create or replace function public.crm_prepare_imersao_lp_consent()
returns trigger language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_text constant text := 'Quero receber pelo WhatsApp informações, conteúdos e ofertas da X5 Med sobre este programa. Posso cancelar a qualquer momento respondendo PARAR.';
begin
  if new.whatsapp_consent_source is null then return new; end if;
  if new.whatsapp_consent_source not in (
    'landing_page_imersao_x5med', 'landing_page_secretaria_alta_performance',
    'landing_page_curso_secretaria'
  ) then raise exception 'Origem LP invalida'; end if;
  if new.form_submission_id is null then raise exception 'ID de submissao ausente'; end if;
  new.whatsapp_consent_text_version := 'whatsapp_marketing_v1';
  new.whatsapp_consent_recorded_at := clock_timestamp();
  new.whatsapp_consent_evidence := jsonb_build_object(
    'version', new.whatsapp_consent_text_version,
    'form_submission_id', new.form_submission_id,
    'page_url', left(coalesce(new.whatsapp_consent_evidence->>'page_url', ''), 500),
    'consent_text', v_text,
    'checked', new.whatsapp_consent,
    'source_table', 'imersao_x5med_leads',
    'source_record_id', new.id
  );
  return new;
end;
$$;

create or replace function public.crm_sync_imersao_lp_consent()
returns trigger language plpgsql security definer set search_path = public, pg_temp
as $$
declare
  v_phone text;
  v_contact_id uuid;
  v_actor text;
begin
  if new.whatsapp_consent_source is null then return new; end if;
  v_phone := public.crm_whatsapp_phone_key(new.whatsapp);
  if length(v_phone) not between 10 and 13 then raise exception 'Telefone LP invalido'; end if;
  v_actor := case new.whatsapp_consent_source
    when 'landing_page_imersao_x5med' then 'LP — Imersão X5 Med'
    when 'landing_page_secretaria_alta_performance' then 'LP — Secretaria de Alta Performance'
    else 'LP — Curso Secretaria' end;

  perform pg_advisory_xact_lock(hashtextextended('crm_contact:' || v_phone, 0));
  insert into public.crm_contacts (
    name, phone, normalized_phone, email, normalized_email, source,
    consent_status, created_at, updated_at
  ) values (
    new.nome, new.whatsapp, v_phone, new.email, lower(btrim(new.email)),
    new.whatsapp_consent_source, 'unknown', now(), now()
  ) on conflict do nothing;

  select c.id into v_contact_id from public.crm_contacts c
  where c.archived_at is null
    and public.crm_whatsapp_phone_key(coalesce(nullif(c.normalized_phone, ''), c.phone)) = v_phone
  order by c.created_at, c.id limit 1 for update;
  if v_contact_id is null then raise exception 'Contato LP nao localizado'; end if;

  if new.whatsapp_consent then
    update public.crm_contacts c set
      consent_status = 'granted', consent_scope = 'whatsapp_marketing',
      consent_source = new.whatsapp_consent_source,
      consent_recorded_at = new.whatsapp_consent_recorded_at,
      consent_updated_by = v_actor,
      consent_evidence = new.whatsapp_consent_evidence::text,
      consent_opted_out_at = null, consent_opt_out_source = '', consent_opt_out_evidence = '',
      updated_at = now()
    where c.id = v_contact_id
      and new.whatsapp_consent_recorded_at > greatest(
        coalesce(c.consent_recorded_at, '-infinity'::timestamptz),
        coalesce(c.consent_opted_out_at, '-infinity'::timestamptz)
      )
      and (c.consent_status <> 'opted_out'
        or (c.consent_opted_out_at is not null
          and new.whatsapp_consent_recorded_at > c.consent_opted_out_at));
  end if;
  return new;
end;
$$;

drop trigger if exists crm_imersao_lp_consent_prepare on public.imersao_x5med_leads;
drop trigger if exists crm_imersao_lp_consent_sync on public.imersao_x5med_leads;
create trigger crm_imersao_lp_consent_prepare before insert on public.imersao_x5med_leads
  for each row execute function public.crm_prepare_imersao_lp_consent();
create trigger crm_imersao_lp_consent_sync after insert on public.imersao_x5med_leads
  for each row execute function public.crm_sync_imersao_lp_consent();

revoke all on function public.crm_prepare_imersao_lp_consent() from public, anon, authenticated;
revoke all on function public.crm_sync_imersao_lp_consent() from public, anon, authenticated;
notify pgrst, 'reload schema';
commit;
