/**
 * Wiring checker. Reads .env.local and reports which services are connected,
 * then live-checks Supabase (reachable? migrations run?). No charges, no emails.
 * Run: npm run doctor
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const DIM = '\x1b[2m';
const RESET = '\x1b[0m';
const ok = (s: string) => `${GREEN}✓${RESET} ${s}`;
const no = (s: string) => `${RED}✗${RESET} ${s}`;
const dim = (s: string) => `${DIM}${s}${RESET}`;

function loadEnv(): Record<string, string> {
  const out: Record<string, string> = {};
  try {
    const raw = readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const t = line.trim();
      if (!t || t.startsWith('#')) continue;
      const eq = t.indexOf('=');
      if (eq === -1) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      out[key] = val;
    }
  } catch {
    console.log(no('.env.local not found — copy .env.example to .env.local first.'));
  }
  return out;
}

const env = loadEnv();
const has = (k: string) => Boolean(env[k] && env[k].length > 0);
const line = (k: string, note?: string) =>
  console.log('  ' + (has(k) ? ok(k) : no(k)) + (note ? '  ' + dim(note) : ''));

console.log('\nCrewcraft wiring check\n──────────────────────');

console.log('\nSupabase  (required to boot)');
line('NEXT_PUBLIC_SUPABASE_URL');
line('NEXT_PUBLIC_SUPABASE_ANON_KEY');
line('SUPABASE_SERVICE_ROLE_KEY');

console.log('\nAnthropic  (required for "Build line items")');
line('ANTHROPIC_API_KEY', '→ confirmed when "Build line items" returns items');

console.log('\nResend  (only for emailing the estimate)');
line('RESEND_API_KEY');
line('RESEND_FROM_EMAIL');

console.log('\nStripe  (only for the paywall / Pro)');
line('STRIPE_SECRET_KEY');
line('STRIPE_WEBHOOK_SECRET');
line('STRIPE_PRICE_PRO_MONTHLY');
line('STRIPE_PRICE_PRO_ANNUAL');
line('STRIPE_PRICE_FOUNDING');

console.log('\nApp');
line('NEXT_PUBLIC_APP_URL');

async function checkSupabase() {
  console.log('\nLive Supabase check');
  if (!has('NEXT_PUBLIC_SUPABASE_URL') || !has('SUPABASE_SERVICE_ROLE_KEY')) {
    console.log('  ' + dim('skipped — add the Supabase URL + service-role key first.'));
    return;
  }
  const supabase = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } },
  );
  const { error } = await supabase.from('businesses').select('id', { head: true, count: 'exact' });
  if (!error) {
    console.log('  ' + ok('connected, and the tables exist — migrations ran. You’re good.'));
  } else if (/relation .* does not exist|Could not find the table/i.test(error.message)) {
    console.log('  ' + no('connected, but tables are missing — run the 3 files in supabase/migrations.'));
  } else {
    console.log('  ' + no(`couldn’t reach the database: ${error.message}`));
  }
}

checkSupabase()
  .catch((e) => console.log('  ' + no(`check failed: ${e?.message ?? e}`)))
  .finally(() => console.log(''));
