/**
 * PDF smoke test — renders a sample estimate to a real PDF buffer so we know
 * the @react-pdf document, Poppins embedding, and layout all compile. No cloud
 * services needed. Run: npm run pdf:smoke
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';

import { renderEstimatePdfSync } from '@/lib/pdf/render';
import { PDF_STRINGS } from '@/lib/pdf/i18n';
import { localeFor } from '@/lib/pdf/languages';
import type { Business, EstimateWithItems } from '@/lib/types';

const business: Business = {
  id: 'b1',
  user_id: 'u1',
  trade: 'electrical', // exercise the amber "navy text on amber" rule
  name: 'Bright Spark Electric',
  logo_url: null,
  license: 'C-10 998877',
  phone: '(555) 867-5309',
  email: 'office@brightspark.example',
  address: '42 Volt Ave, Sparksville, CA',
  default_tax_rate: 8.25,
  default_labor_rate: 110,
  review_link: null,
  payment_link: null,
  payment_instructions: null,
  auto_invoice: false,
  auto_review_request: false,
  lead_token: 'lead-token',
  stripe_account_id: null,
  stripe_charges_enabled: false,
  stripe_customer_id: null,
  stripe_subscription_id: null,
  plan: 'free',
  subscription_status: null,
  created_at: new Date().toISOString(),
};

const estimate: EstimateWithItems = {
  id: 'e1',
  user_id: 'u1',
  kind: 'estimate',
  customer_name: 'Dana Homeowner',
  customer_address: '7 Maple St, Sparksville, CA',
  customer_phone: '(555) 222-1111',
  customer_email: 'dana@example.com',
  // exercise the e-sign block on the PDF
  status: 'accepted',
  signed_name: 'Dana Homeowner',
  accepted_at: new Date().toISOString(),
  declined_at: null,
  decline_reason: null,
  due_date: null,
  paid_at: null,
  source_estimate_id: null,
  deposit_paid_at: null,
  sent_at: null,
  reminders_enabled: true,
  last_reminder_at: null,
  reminder_count: 0,
  review_requested_at: null,
  pdf_language: 'en',
  pdf_translation: null,
  scope_of_work:
    'Replace the main electrical panel with a 200-amp service and bring the grounding up to code. Includes permit coordination and a final inspection walkthrough.',
  subtotal: 0,
  tax_rate: 8.25,
  tax_amount: 0,
  deposit: 500,
  total: 0,
  notes: '50% deposit to schedule. Balance due on completion. Work warrantied for 1 year.',
  public_token: 'token',
  viewed_at: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  line_items: [
    { id: 'l1', estimate_id: 'e1', category: 'labor', description: 'Panel swap & rewire', quantity: 8, unit: 'hr', unit_price: 110, line_total: 880, sort_order: 0 },
    { id: 'l2', estimate_id: 'e1', category: 'labor', description: 'Permit & inspection coordination', quantity: 2, unit: 'hr', unit_price: 110, line_total: 220, sort_order: 1 },
    { id: 'l3', estimate_id: 'e1', category: 'materials', description: '200A main panel', quantity: 1, unit: 'ea', unit_price: 420, line_total: 420, sort_order: 2 },
    { id: 'l4', estimate_id: 'e1', category: 'materials', description: 'Breakers & grounding kit', quantity: 1, unit: 'ea', unit_price: 180, line_total: 180, sort_order: 3 },
  ],
};

// The same job as a paid invoice — exercises the INVOICE header, due date,
// PAID stamp, and "Deposit received" labels.
const invoice: EstimateWithItems = {
  ...estimate,
  id: 'i1',
  kind: 'invoice',
  status: 'paid',
  signed_name: null,
  accepted_at: null,
  due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  paid_at: new Date().toISOString(),
  source_estimate_id: 'e1',
};

// Pagination stress test: enough long-description rows to spill onto a second
// (and third) page. Regression guard for rows/totals clipping across a page
// break — every row and the totals box must land whole on one page.
const LONG_DESC =
  'Furnish and install per manufacturer specification, including removal and disposal of existing equipment, protection of finished surfaces, and cleanup of the work area on completion';
const stress: EstimateWithItems = {
  ...estimate,
  id: 'e2',
  line_items: Array.from({ length: 26 }, (_, i) => ({
    id: `s${i}`,
    estimate_id: 'e2',
    category: (i < 9 ? 'labor' : i < 20 ? 'materials' : 'other') as 'labor',
    description: `${i + 1}. ${LONG_DESC}`,
    quantity: 1 + (i % 3),
    unit: i < 9 ? 'hr' : 'ea',
    unit_price: 85 + i * 7,
    line_total: (1 + (i % 3)) * (85 + i * 7),
    sort_order: i,
  })),
};

async function main() {
  const outDir = path.join(process.cwd(), 'scratch');
  mkdirSync(outDir, { recursive: true });

  // English estimate + invoice, plus a Romanian estimate to eyeball localized
  // labels and diacritic glyphs (ș ț ă â î) — labels only, no AI needed. Haitian
  // Creole covers the newest language batch (è, ò); Somali/Tok Pisin/Tetum
  // share the same plain-Latin alphabet so one extra render is enough to catch
  // a missing-glyph regression across all four.
  const jobs: Array<[string, EstimateWithItems, string]> = [
    ['estimate-smoke.pdf', estimate, 'en'],
    ['invoice-smoke.pdf', invoice, 'en'],
    ['estimate-ro-smoke.pdf', estimate, 'ro'],
    ['estimate-ht-smoke.pdf', estimate, 'ht'],
    ['estimate-stress-smoke.pdf', stress, 'en'],
  ];

  for (const [name, doc, lang] of jobs) {
    const pdf = await renderEstimatePdfSync(business, doc, PDF_STRINGS[lang], localeFor(lang));
    if (!pdf || pdf.length < 1000) {
      throw new Error(`PDF looks empty (${pdf?.length ?? 0} bytes)`);
    }
    const outPath = path.join(outDir, name);
    writeFileSync(outPath, pdf);
    console.log(`✓ PDF rendered (${lang}): ${pdf.length} bytes → ${outPath}`);
  }
}

main().catch((err) => {
  console.error('✗ PDF smoke failed:', err);
  process.exit(1);
});
