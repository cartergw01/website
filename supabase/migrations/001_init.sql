create extension if not exists vector;

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  rss_url text not null unique,
  reliability_score float not null default 0.7
);

create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references sources(id) on delete cascade,
  url text not null unique,
  title text not null,
  published_at timestamptz not null,
  cleaned_text text,
  content_hash text,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

create unique index if not exists articles_content_hash_key on articles(content_hash);

create table if not exists clusters (
  id uuid primary key default gen_random_uuid(),
  canonical_article_id uuid references articles(id) on delete set null,
  summary_bullets jsonb,
  why_it_matters text,
  cluster_embedding vector(1536),
  created_at timestamptz not null default now()
);

create table if not exists cluster_members (
  cluster_id uuid not null references clusters(id) on delete cascade,
  article_id uuid not null references articles(id) on delete cascade,
  primary key (cluster_id, article_id)
);

create table if not exists user_interests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  interest_text text not null,
  embedding vector(1536)
);

create type feedback_action as enum ('more_like_this', 'less_like_this', 'hide_cluster');

create table if not exists user_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  cluster_id uuid not null references clusters(id) on delete cascade,
  action feedback_action not null,
  created_at timestamptz not null default now()
);

create table if not exists user_hidden_sources (
  user_id uuid not null references auth.users(id) on delete cascade,
  source_id uuid not null references sources(id) on delete cascade,
  primary key (user_id, source_id)
);

alter table sources enable row level security;
alter table articles enable row level security;
alter table clusters enable row level security;
alter table cluster_members enable row level security;
alter table user_interests enable row level security;
alter table user_feedback enable row level security;
alter table user_hidden_sources enable row level security;

create policy "read feed tables" on sources for select to authenticated using (true);
create policy "read articles" on articles for select to authenticated using (true);
create policy "read clusters" on clusters for select to authenticated using (true);
create policy "read cluster_members" on cluster_members for select to authenticated using (true);

create policy "user interests own" on user_interests for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "user feedback own" on user_feedback for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "hidden sources own" on user_hidden_sources for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
