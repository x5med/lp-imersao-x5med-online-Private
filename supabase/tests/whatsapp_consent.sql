-- Executar após a migration. Nenhum lead ou contato de teste permanece.
begin;
do $$
declare
  v_source text;
  v_phone text;
  v_id uuid;
  v_lead public.imersao_x5med_leads%rowtype;
  v_contact public.crm_contacts%rowtype;
  v_count integer;
  v_i integer := 0;
begin
  foreach v_source in array array[
    'landing_page_imersao_x5med', 'landing_page_secretaria_alta_performance',
    'landing_page_curso_secretaria'
  ] loop
    v_i := v_i + 1;
    v_phone := '11989998' || lpad(v_i::text, 3, '0');
    if exists (select 1 from public.crm_contacts
      where public.crm_whatsapp_phone_key(coalesce(nullif(normalized_phone, ''), phone)) = v_phone)
    then raise exception 'Numero de teste em uso'; end if;

    insert into public.imersao_x5med_leads (
      nome, email, whatsapp, faixa_faturamento, form_submission_id,
      whatsapp_consent, whatsapp_consent_source, whatsapp_consent_evidence
    ) values (
      'Teste Consentimento', 'consent-' || v_i || '@example.invalid', v_phone,
      'ate-30k', gen_random_uuid(), true, v_source,
      '{"page_url":"https://x5med.com.br/teste"}'::jsonb
    ) returning * into v_lead;
    if v_lead.whatsapp_consent_recorded_at is null
      or v_lead.whatsapp_consent_text_version <> 'whatsapp_marketing_v1'
      or v_lead.whatsapp_consent_evidence->>'source_record_id' <> v_lead.id::text
      or v_lead.whatsapp_consent_evidence->>'checked' <> 'true'
    then raise exception 'Lead sem evidencia: %', v_source; end if;
    select * into strict v_contact from public.crm_contacts
      where normalized_phone = v_phone and archived_at is null;
    if v_contact.consent_status <> 'granted'
      or v_contact.consent_scope <> 'whatsapp_marketing'
      or v_contact.consent_source <> v_source
    then raise exception 'Contato nao autorizado: %', v_source; end if;
    v_id := v_lead.form_submission_id;

    begin
      insert into public.imersao_x5med_leads (
        nome, email, whatsapp, faixa_faturamento, form_submission_id,
        whatsapp_consent, whatsapp_consent_source
      ) values ('Repetido', 'repeat@example.invalid', v_phone, 'ate-30k',
        v_id, false, v_source);
      raise exception 'Submissao duplicada aceita';
    exception when unique_violation then null;
    end;

    insert into public.imersao_x5med_leads (
      nome, email, whatsapp, faixa_faturamento, form_submission_id,
      whatsapp_consent, whatsapp_consent_source
    ) values ('Sem Aceite', 'unchecked@example.invalid',
      '+55 (' || left(v_phone, 2) || ') ' || substr(v_phone, 3), 'ate-30k',
      gen_random_uuid(), false, v_source);
    select * into strict v_contact from public.crm_contacts
      where normalized_phone = v_phone and archived_at is null;
    if v_contact.consent_status <> 'granted' then
      raise exception 'Checkbox vazio removeu aceite: %', v_source;
    end if;
    select count(*) into v_count from public.crm_contacts c
      where c.archived_at is null
        and public.crm_whatsapp_phone_key(coalesce(nullif(c.normalized_phone, ''), c.phone)) = v_phone;
    if v_count <> 1 then raise exception 'Contato duplicado: %', v_source; end if;

    update public.crm_contacts set consent_status = 'opted_out',
      consent_opted_out_at = clock_timestamp() + interval '1 hour',
      consent_opt_out_source = 'teste', consent_opt_out_evidence = 'PARAR'
    where id = v_contact.id;
    insert into public.imersao_x5med_leads (
      nome, email, whatsapp, faixa_faturamento, form_submission_id,
      whatsapp_consent, whatsapp_consent_source
    ) values ('Aceite Antigo', 'old@example.invalid', v_phone, 'ate-30k',
      gen_random_uuid(), true, v_source);
    select * into strict v_contact from public.crm_contacts where id = v_contact.id;
    if v_contact.consent_status <> 'opted_out' then
      raise exception 'Aceite antigo reautorizou opt-out: %', v_source; end if;
    update public.crm_contacts set consent_opted_out_at = clock_timestamp() - interval '1 hour'
    where id = v_contact.id;
    insert into public.imersao_x5med_leads (
      nome, email, whatsapp, faixa_faturamento, form_submission_id,
      whatsapp_consent, whatsapp_consent_source
    ) values ('Novo Aceite', 'new@example.invalid', v_phone, 'ate-30k',
      gen_random_uuid(), true, v_source);
    select * into strict v_contact from public.crm_contacts where id = v_contact.id;
    if v_contact.consent_status <> 'granted' then
      raise exception 'Novo aceite explicito nao reautorizou: %', v_source; end if;

    v_phone := '11989997' || lpad(v_i::text, 3, '0');
    insert into public.imersao_x5med_leads (
      nome, email, whatsapp, faixa_faturamento, form_submission_id,
      whatsapp_consent, whatsapp_consent_source
    ) values ('Novo Sem Aceite', 'unknown@example.invalid', v_phone, 'ate-30k',
      gen_random_uuid(), false, v_source);
    select * into strict v_contact from public.crm_contacts
      where normalized_phone = v_phone and archived_at is null;
    if v_contact.consent_status <> 'unknown' then
      raise exception 'Novo sem aceite ficou elegivel: %', v_source; end if;
  end loop;
end;
$$;
rollback;
