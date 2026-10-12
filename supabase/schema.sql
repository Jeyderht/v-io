-- =========================================================
--  V-IO · Base de datos (pegar completo en Supabase → SQL Editor → Run)
-- =========================================================
create extension if not exists pgcrypto with schema extensions;

create table if not exists public.admins (
  user_id uuid primary key references auth.users on delete cascade
);

create table if not exists public.visuales (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  cat text not null default 'vj',
  len text not null default '',
  premium boolean not null default true,
  kind text not null default 'video',
  drive_id text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.miembros (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  plan text not null default 'pro',
  expira timestamptz not null,
  code_hash text not null unique,
  disp text,
  disps text[] not null default '{}',
  usado timestamptz,
  creado timestamptz not null default now()
);

alter table public.miembros add column if not exists disps text[] not null default '{}';
update public.miembros set disps = array[disp] where disp is not null and cardinality(disps) = 0;

create or replace function public.max_disp(p_plan text) returns int
language sql immutable as $$ select case p_plan when 'prod' then 5 when 'pro' then 2 else 1 end $$;

alter table public.admins   enable row level security;
alter table public.visuales enable row level security;
alter table public.miembros enable row level security;

create or replace function public.es_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

drop policy if exists "admin visuales" on public.visuales;
create policy "admin visuales" on public.visuales for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

drop policy if exists "admin miembros" on public.miembros;
create policy "admin miembros" on public.miembros for all to authenticated
  using (public.es_admin()) with check (public.es_admin());

drop policy if exists "ver mi admin" on public.admins;
create policy "ver mi admin" on public.admins for select to authenticated
  using (user_id = auth.uid());

-- Catálogo público: los premium van SIN enlace de Drive
create or replace function public.catalogo()
returns table (id uuid, title text, cat text, len text, premium boolean, kind text, drive_id text, created_at timestamptz)
language sql stable security definer set search_path = public as $$
  select v.id, v.title, v.cat, v.len, v.premium, v.kind,
         case when v.premium then null else v.drive_id end, v.created_at
  from public.visuales v order by v.created_at desc;
$$;

-- Activar código: se vincula a los dispositivos que incluye el plan (1, 2 o 5)
create or replace function public.canjear(p_code text, p_disp text)
returns json language plpgsql security definer set search_path = public, extensions as $$
declare m public.miembros;
begin
  if p_code is null or length(p_code) <> 11 or p_disp is null or length(p_disp) < 16 then
    return json_build_object('ok', false, 'error', 'invalido');
  end if;
  select * into m from public.miembros
   where code_hash = encode(extensions.digest('v-io:' || upper(p_code), 'sha256'), 'hex');
  if not found then return json_build_object('ok', false, 'error', 'invalido'); end if;
  if m.expira < now() then return json_build_object('ok', false, 'error', 'vencido'); end if;
  if not (p_disp = any(m.disps)) then
    if cardinality(m.disps) >= public.max_disp(m.plan) then
      return json_build_object('ok', false, 'error', 'otro');
    end if;
    update public.miembros set disps = array_append(disps, p_disp), usado = coalesce(usado, now()) where id = m.id;
  end if;
  return json_build_object('ok', true, 'nombre', m.nombre, 'plan', m.plan, 'expira', m.expira);
end $$;

-- Catálogo completo (con enlaces) solo para un miembro válido en SU dispositivo
create or replace function public.catalogo_miembro(p_code text, p_disp text)
returns table (id uuid, title text, cat text, len text, premium boolean, kind text, drive_id text, created_at timestamptz)
language plpgsql stable security definer set search_path = public, extensions as $$
begin
  if not exists (
    select 1 from public.miembros
     where code_hash = encode(extensions.digest('v-io:' || upper(coalesce(p_code, '')), 'sha256'), 'hex')
       and p_disp = any(disps) and expira > now()
  ) then return; end if;
  return query select v.id, v.title, v.cat, v.len, v.premium, v.kind, v.drive_id, v.created_at
               from public.visuales v order by v.created_at desc;
end $$;

revoke all on function public.catalogo(), public.canjear(text, text), public.catalogo_miembro(text, text), public.es_admin() from public;
grant execute on function public.catalogo(), public.canjear(text, text), public.catalogo_miembro(text, text) to anon, authenticated;
grant execute on function public.es_admin() to authenticated;

-- Permisos explícitos (funciona aunque desactives "Automatically expose new tables")
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.visuales, public.miembros to authenticated;
grant select on public.admins to authenticated;
revoke all on public.visuales, public.miembros, public.admins from anon;

-- =========================================================
--  PASO FINAL: hazte administradora.
--  1) Crea tu usuario en Authentication → Users → Add user
--  2) Cambia el correo de abajo por el tuyo y ejecuta SOLO esta línea:
-- =========================================================
-- insert into public.admins (user_id) select id from auth.users where email = 'TU_CORREO@ejemplo.com';
