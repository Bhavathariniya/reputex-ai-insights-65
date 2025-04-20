
-- Create token assessments table
create table public.token_assessments (
  id uuid primary key default uuid_generate_v4(),
  address text not null,
  network text not null,
  token_name text,
  symbol text,
  contract_creator text,
  creation_date timestamptz,
  total_supply numeric(78, 0),
  holder_count integer,
  market_cap numeric,
  current_price numeric,
  all_time_high numeric,
  all_time_low numeric,
  total_score integer,
  percentage_score numeric,
  risk_category text,
  checks_passed integer,
  total_checks integer default 11,
  ai_analysis text,
  metadata jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(address, network)
);

-- Add RLS policies
alter table public.token_assessments enable row level security;

-- Allow public read access
create policy "Allow public read access on token_assessments"
  on public.token_assessments
  for select
  to anon, authenticated
  using (true);

-- Only allow service role to insert/update/delete
create policy "Allow service role to manage token_assessments"
  on public.token_assessments
  using (auth.role() = 'service_role');

-- Add a stored function to calculate risk category based on percentage score
create or replace function public.get_risk_category(percentage_score numeric)
returns text as $$
begin
  if percentage_score >= 90 then
    return 'Great';
  elsif percentage_score >= 80 then
    return 'Good';
  elsif percentage_score >= 70 then
    return 'Neutral';
  elsif percentage_score >= 60 then
    return 'Medium Risk';
  elsif percentage_score >= 40 then
    return 'Risky';
  elsif percentage_score >= 0 then
    return 'Critical';
  else
    return 'Unavailable';
  end if;
end;
$$ language plpgsql;

-- Function to refresh token assessment
create or replace function public.refresh_token_assessment(token_address text, chain_network text)
returns uuid as $$
declare
  assessment_id uuid;
begin
  -- Delete existing assessment if it exists
  delete from public.token_assessments 
  where address = token_address and network = chain_network
  returning id into assessment_id;
  
  -- Return the deleted ID or null (actual assessment will be created by the backend)
  return assessment_id;
end;
$$ language plpgsql;
