-- Multilingual PDFs: the contractor picks a language per estimate; the PDF's
-- labels come from a static dictionary and the typed content is AI-translated
-- and cached here so each language is only translated once.
alter table public.estimates
  add column if not exists pdf_language text not null default 'en';
alter table public.estimates
  add column if not exists pdf_translation jsonb;
