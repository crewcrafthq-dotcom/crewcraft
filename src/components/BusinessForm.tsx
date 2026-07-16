'use client';

import { useState } from 'react';
// React 18 + Next 14: form action hooks live in react-dom.
import { useFormState, useFormStatus } from 'react-dom';

import { Button } from '@/components/ui/Button';
import { Input, Label, Textarea } from '@/components/ui/Field';
import { cn } from '@/lib/cn';
import { getTheme, themeVars } from '@/lib/trades';
import { TRADES, type Business, type Trade } from '@/lib/types';

export type BusinessFormState = { error?: string; ok?: boolean };
type Action = (state: BusinessFormState, formData: FormData) => Promise<BusinessFormState>;

interface Props {
  action: Action;
  initial?: Partial<Business>;
  submitLabel: string;
  /** Settings-only extras: get-paid + review link. Onboarding stays lean. */
  extended?: boolean;
}

export function BusinessForm({ action, initial, submitLabel, extended }: Props) {
  const [state, formAction] = useFormState(action, {});
  const [trade, setTrade] = useState<Trade>((initial?.trade as Trade) ?? 'hvac');
  const [logoPreview, setLogoPreview] = useState<string | null>(initial?.logo_url ?? null);

  return (
    <div data-trade={trade} style={themeVars(trade)}>
      <form action={formAction} className="space-y-7">
        {/* trade picker — sets the whole app's accent */}
        <fieldset>
          <legend className="field-label">Trade</legend>
          <input type="hidden" name="trade" value={trade} />
          <div className="grid grid-cols-2 gap-3">
            {TRADES.map((t) => {
              const theme = getTheme(t);
              const selected = t === trade;
              return (
                <button
                  type="button"
                  key={t}
                  onClick={() => setTrade(t)}
                  className={cn(
                    'flex items-center gap-3 rounded-xl border bg-paper-800 p-3 text-left transition',
                    selected
                      ? 'border-accent ring-2 ring-accent/30'
                      : 'border-hairline hover:bg-paper-700',
                  )}
                >
                  <span
                    className="h-8 w-8 flex-none rounded-lg"
                    style={{ backgroundColor: theme.accent }}
                  />
                  <span>
                    <span className="block text-sm font-semibold">{theme.label}</span>
                    <span className="block text-xs text-ink-mute">{theme.blurb}</span>
                  </span>
                </button>
              );
            })}
          </div>
        </fieldset>

        <Text name="name" label="Company name" required defaultValue={initial?.name} placeholder="Acme Heating & Air" />

        {/* logo */}
        <div>
          <Label htmlFor="logo">Logo (optional)</Label>
          <div className="flex items-center gap-4">
            {logoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoPreview}
                alt="Logo preview"
                className="h-14 w-14 rounded-lg border border-hairline bg-white object-contain"
              />
            ) : (
              <div className="flex h-14 w-14 flex-none items-center justify-center rounded-lg border border-dashed border-hairline text-xs text-ink-mute">
                Logo
              </div>
            )}
            <input
              id="logo"
              name="logo"
              type="file"
              accept="image/png,image/jpeg,image/svg+xml,image/webp"
              onChange={(e) => {
                const file = e.target.files?.[0];
                setLogoPreview(file ? URL.createObjectURL(file) : initial?.logo_url ?? null);
              }}
              className="block w-full text-sm text-ink-soft file:mr-3 file:rounded-lg file:border-0 file:bg-paper-700 file:px-3 file:py-2 file:text-sm file:font-medium file:text-ink"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Text name="license" label="License #" defaultValue={initial?.license ?? ''} placeholder="e.g. C-20 123456" />
          <Text name="phone" label="Phone" type="tel" defaultValue={initial?.phone ?? ''} placeholder="(555) 123-4567" />
          <Text name="email" label="Business email" type="email" defaultValue={initial?.email ?? ''} placeholder="office@acme.com" />
          <Text name="address" label="Business address" defaultValue={initial?.address ?? ''} placeholder="123 Main St, City, ST" />
          <Text
            name="default_tax_rate"
            label="Default tax rate (%)"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initial?.default_tax_rate ?? ''}
            placeholder="8.25"
          />
          <Text
            name="default_labor_rate"
            label="Default labor rate ($/hr)"
            type="number"
            step="1"
            min="0"
            defaultValue={initial?.default_labor_rate ?? ''}
            placeholder="95"
          />
        </div>

        {extended ? (
          <fieldset className="space-y-5 border-t border-hairline pt-6">
            <legend className="sr-only">Getting paid & reviews</legend>
            <div>
              <h3 className="font-semibold text-ink">Getting paid & reviews</h3>
              <p className="mt-1 text-sm text-ink-mute">
                These power the “Pay online” button customers see on accepted estimates and
                invoices, and the one-tap review request.
              </p>
            </div>
            <Text
              name="payment_link"
              label="Payment link (optional — fallback when Stripe isn't connected)"
              type="url"
              defaultValue={initial?.payment_link ?? ''}
              placeholder="https://buy.stripe.com/… or your payment page"
            />
            <div>
              <Label htmlFor="payment_instructions">Payment instructions (optional)</Label>
              <Textarea
                id="payment_instructions"
                name="payment_instructions"
                rows={2}
                defaultValue={initial?.payment_instructions ?? ''}
                placeholder={'e.g. "Zelle or check to Acme Heating — (555) 123-4567"'}
              />
            </div>
            <Text
              name="review_link"
              label="Review link (optional)"
              type="url"
              defaultValue={initial?.review_link ?? ''}
              placeholder="https://g.page/r/…/review — your Google review link"
            />
            <input type="hidden" name="auto_invoice_present" value="1" />
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-hairline bg-paper-850 p-4">
              <input
                type="checkbox"
                name="auto_invoice"
                defaultChecked={Boolean(initial?.auto_invoice)}
                className="mt-0.5 h-5 w-5 accent-[rgb(var(--accent))]"
              />
              <span>
                <span className="block text-sm font-semibold text-ink">
                  Auto-invoice when a customer accepts
                </span>
                <span className="mt-0.5 block text-sm text-ink-mute">
                  The moment an estimate is e-signed, the invoice is created and emailed to the
                  customer with a 14-day due date — no tap needed from you.
                </span>
              </span>
            </label>
            <input type="hidden" name="auto_review_request_present" value="1" />
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-hairline bg-paper-850 p-4">
              <input
                type="checkbox"
                name="auto_review_request"
                defaultChecked={Boolean(initial?.auto_review_request)}
                className="mt-0.5 h-5 w-5 accent-[rgb(var(--accent))]"
              />
              <span>
                <span className="block text-sm font-semibold text-ink">
                  Auto-ask for a review when an invoice is paid
                </span>
                <span className="mt-0.5 block text-sm text-ink-mute">
                  Within a day of an invoice being marked paid, the customer gets your review link
                  by email — once per job, only if they have an email on file. Needs the review
                  link above.
                </span>
              </span>
            </label>
          </fieldset>
        ) : null}

        {state.error ? <p className="text-sm text-red-700">{state.error}</p> : null}
        {state.ok ? <p className="text-sm text-accent-bright">Saved.</p> : null}

        <SubmitButton label={submitLabel} />
      </form>
    </div>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="lg" className="w-full" disabled={pending}>
      {pending ? 'Saving…' : label}
    </Button>
  );
}

// Small labeled text input to keep the form readable.
function Text({
  name,
  label,
  ...props
}: { name: string; label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} {...props} />
    </div>
  );
}
