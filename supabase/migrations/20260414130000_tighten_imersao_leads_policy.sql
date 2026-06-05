-- Tightening leve da policy de INSERT da tabela imersao_x5med_leads.
-- Substitui `to public` por `to anon` e adiciona validações básicas no WITH CHECK
-- para reduzir lixo (strings vazias, e-mails malformados, whatsapp fora de formato).
-- Rate limiting de spam real deve ser feito em outra camada (edge function / Turnstile).

drop policy if exists leads_insert_policy on public.imersao_x5med_leads;

create policy leads_insert_policy
  on public.imersao_x5med_leads
  for insert
  to anon
  with check (
    length(nome) between 2 and 200
    and length(email) between 5 and 200
    and email ~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    and length(whatsapp) between 8 and 20
    and whatsapp ~ '^[0-9]+$'
    and length(faixa_faturamento) between 1 and 50
    and (instagram is null or length(instagram) <= 100)
  );
