/**
 * The languages a contractor can render a PDF in. Latin-script only — all
 * render with the embedded Poppins font (no extra fonts needed). Client-safe:
 * the editor's selector imports this; the heavy string tables live separately.
 */
export interface PdfLanguage {
  code: string;
  /** Endonym + English name, e.g. "Español (Spanish)". */
  label: string;
  /** BCP-47 locale for date formatting. */
  locale: string;
}

export const PDF_LANGUAGES: PdfLanguage[] = [
  { code: 'en', label: 'English', locale: 'en-US' },
  { code: 'ro', label: 'Română (Romanian)', locale: 'ro-RO' },
  { code: 'es', label: 'Español (Spanish)', locale: 'es-ES' },
  { code: 'fr', label: 'Français (French)', locale: 'fr-FR' },
  { code: 'de', label: 'Deutsch (German)', locale: 'de-DE' },
  { code: 'it', label: 'Italiano (Italian)', locale: 'it-IT' },
  { code: 'pt', label: 'Português (Portuguese)', locale: 'pt-PT' },
  { code: 'nl', label: 'Nederlands (Dutch)', locale: 'nl-NL' },
  { code: 'pl', label: 'Polski (Polish)', locale: 'pl-PL' },
  { code: 'cs', label: 'Čeština (Czech)', locale: 'cs-CZ' },
  { code: 'sk', label: 'Slovenčina (Slovak)', locale: 'sk-SK' },
  { code: 'hu', label: 'Magyar (Hungarian)', locale: 'hu-HU' },
  { code: 'hr', label: 'Hrvatski (Croatian)', locale: 'hr-HR' },
  { code: 'tr', label: 'Türkçe (Turkish)', locale: 'tr-TR' },
  { code: 'sv', label: 'Svenska (Swedish)', locale: 'sv-SE' },
  { code: 'da', label: 'Dansk (Danish)', locale: 'da-DK' },
  { code: 'nb', label: 'Norsk (Norwegian)', locale: 'nb-NO' },
  { code: 'fi', label: 'Suomi (Finnish)', locale: 'fi-FI' },
  { code: 'id', label: 'Bahasa Indonesia (Indonesian)', locale: 'id-ID' },
  { code: 'tl', label: 'Filipino (Tagalog)', locale: 'fil-PH' },
  { code: 'vi', label: 'Tiếng Việt (Vietnamese)', locale: 'vi-VN' },
  { code: 'ca', label: 'Català (Catalan)', locale: 'ca-ES' },
];

const CODES = new Set(PDF_LANGUAGES.map((l) => l.code));

/** Fall back to English for anything unknown. */
export function normalizeLang(code: string | null | undefined): string {
  return code && CODES.has(code) ? code : 'en';
}

export function localeFor(code: string): string {
  return PDF_LANGUAGES.find((l) => l.code === code)?.locale ?? 'en-US';
}
