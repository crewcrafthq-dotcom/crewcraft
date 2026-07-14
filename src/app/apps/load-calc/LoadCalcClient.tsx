'use client';

import { useMemo, useState } from 'react';
import { Copy, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Field';
import { toast } from '@/components/ui/toast';
import {
  computeServiceLoad,
  loadCalcSummary,
  type ApplianceEntry,
} from '@/lib/load-calc';

// Common fixed appliances with typical nameplate VA — tap to add, then edit.
const COMMON: ApplianceEntry[] = [
  { name: 'Range', va: 12000 },
  { name: 'Wall oven', va: 8000 },
  { name: 'Cooktop', va: 7200 },
  { name: 'Dryer', va: 5000 },
  { name: 'Water heater', va: 4500 },
  { name: 'Tankless water heater', va: 18000 },
  { name: 'Dishwasher', va: 1200 },
  { name: 'Disposal', va: 900 },
  { name: 'Microwave', va: 1500 },
  { name: 'EV charger (40A)', va: 9600 },
  { name: 'EV charger (48A)', va: 11500 },
  { name: 'Hot tub', va: 11500 },
  { name: 'Pool pump', va: 2000 },
];

export function LoadCalcClient() {
  const [sqft, setSqft] = useState(2000);
  const [saCircuits, setSaCircuits] = useState(2);
  const [laundry, setLaundry] = useState(1);
  const [heatingVa, setHeatingVa] = useState(10000);
  const [coolingVa, setCoolingVa] = useState(5000);
  const [appliances, setAppliances] = useState<ApplianceEntry[]>([
    { name: 'Range', va: 12000 },
    { name: 'Dryer', va: 5000 },
    { name: 'Water heater', va: 4500 },
  ]);

  const input = useMemo(
    () => ({
      sqft,
      smallApplianceCircuits: saCircuits,
      laundryCircuits: laundry,
      appliances,
      heatingVa,
      coolingVa,
    }),
    [sqft, saCircuits, laundry, appliances, heatingVa, coolingVa],
  );
  const result = useMemo(() => computeServiceLoad(input), [input]);

  function addAppliance(a: ApplianceEntry) {
    setAppliances((list) => [...list, { ...a }]);
  }
  function removeAppliance(index: number) {
    setAppliances((list) => list.filter((_, i) => i !== index));
  }
  function updateVa(index: number, va: number) {
    setAppliances((list) => list.map((a, i) => (i === index ? { ...a, va } : a)));
  }

  async function copySummary() {
    try {
      await navigator.clipboard.writeText(loadCalcSummary(input, result));
      toast('Summary copied — paste it into your estimate notes.');
    } catch {
      toast('Could not copy. Select and copy the summary manually.', 'error');
    }
  }

  const num = (v: string) => Math.max(0, Number(v) || 0);

  return (
    <div className="grid items-start gap-5 lg:grid-cols-[1fr_360px]">
      {/* inputs */}
      <div className="space-y-5 rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card sm:p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <Label htmlFor="sqft">Living area (sq ft)</Label>
            <Input id="sqft" type="number" inputMode="numeric" min={0} value={sqft || ''} onChange={(e) => setSqft(num(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="sa">Small-appliance circuits</Label>
            <Input id="sa" type="number" inputMode="numeric" min={0} value={saCircuits || ''} onChange={(e) => setSaCircuits(num(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="laundry">Laundry circuits</Label>
            <Input id="laundry" type="number" inputMode="numeric" min={0} value={laundry || ''} onChange={(e) => setLaundry(num(e.target.value))} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="heat">Heating (VA)</Label>
            <Input id="heat" type="number" inputMode="numeric" min={0} value={heatingVa || ''} onChange={(e) => setHeatingVa(num(e.target.value))} />
          </div>
          <div>
            <Label htmlFor="cool">Cooling (VA)</Label>
            <Input id="cool" type="number" inputMode="numeric" min={0} value={coolingVa || ''} onChange={(e) => setCoolingVa(num(e.target.value))} />
          </div>
        </div>

        <div>
          <p className="field-label">Fixed appliances (nameplate VA — edit any value)</p>
          <ul className="space-y-2">
            {appliances.map((a, i) => (
              <li key={`${a.name}-${i}`} className="flex items-center gap-2">
                <span className="min-w-0 flex-1 truncate text-sm text-ink">{a.name}</span>
                <Input
                  aria-label={`${a.name} VA`}
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={a.va || ''}
                  onChange={(e) => updateVa(i, num(e.target.value))}
                  className="w-28"
                />
                <button
                  type="button"
                  onClick={() => removeAppliance(i)}
                  aria-label={`Remove ${a.name}`}
                  className="grid h-9 w-9 flex-none cursor-pointer place-items-center rounded-lg text-ink-mute transition hover:bg-paper-750 hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
            {appliances.length === 0 ? (
              <li className="text-sm text-ink-mute">No fixed appliances added yet.</li>
            ) : null}
          </ul>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {COMMON.map((a) => (
              <button
                key={a.name}
                type="button"
                onClick={() => addAppliance(a)}
                className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-hairline bg-paper-750 px-2.5 py-1 text-xs font-medium text-ink-soft transition hover:border-accent/40 hover:text-ink"
              >
                <Plus className="h-3 w-3" />
                {a.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* result */}
      <div className="rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card sm:p-6 lg:sticky lg:top-6">
        <p className="text-xs font-semibold uppercase tracking-wide text-ink-mute">Calculated load</p>
        <p className="mt-2">
          <span className="text-4xl font-extrabold tracking-tight text-ink">{result.amps}</span>
          <span className="text-lg font-semibold text-ink-soft"> A</span>
          <span className="text-sm text-ink-mute"> @ 240 V</span>
        </p>
        <p className="mt-1 text-sm font-semibold text-accent-bright">
          {result.recommendedService
            ? `Suggested service: ${result.recommendedService} A`
            : 'Over 400 A — engineered service required'}
        </p>

        <dl className="mt-5 space-y-2 border-t border-hairline pt-4 text-sm">
          <Row label="General (3 VA/sqft + circuits)" value={result.generalVa} />
          <Row label="Fixed appliances" value={result.applianceVa} />
          <Row label="After demand factor" value={result.demandVa} />
          <Row label="HVAC (larger of heat/cool)" value={result.hvacVa} />
          <div className="flex items-center justify-between border-t border-hairline pt-2 font-semibold text-ink">
            <dt>Total</dt>
            <dd>{result.totalVa.toLocaleString()} VA</dd>
          </div>
        </dl>

        <Button onClick={copySummary} className="mt-5 w-full">
          <Copy />
          Copy summary for the estimate
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-ink-soft">{label}</dt>
      <dd className="font-medium text-ink">{value.toLocaleString()} VA</dd>
    </div>
  );
}
