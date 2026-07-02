import Link from 'next/link';
import { redirect } from 'next/navigation';
import { BookOpen, ChevronRight, Plus, Trash2 } from 'lucide-react';

import { AppShell } from '@/components/AppShell';
import { Card } from '@/components/ui/Card';
import { Input, Label, Select } from '@/components/ui/Field';
import { buttonClasses } from '@/components/ui/Button';
import { getSession } from '@/lib/auth';
import { CATEGORY_LABELS } from '@/lib/estimates';
import { money } from '@/lib/format';
import { createClient } from '@/lib/supabase/server';
import type { LineItemCategory, PriceBookItem } from '@/lib/types';
import { addPriceBookItem, deletePriceBookItem } from './actions';

export const dynamic = 'force-dynamic';

const CATEGORY_ORDER: LineItemCategory[] = ['labor', 'materials', 'other'];

export default async function PriceBookPage() {
  const { user, business } = await getSession();
  if (!user) redirect('/login');
  if (!business) redirect('/onboarding');

  const supabase = createClient();
  const { data } = await supabase
    .from('price_book_items')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  const items = (data ?? []) as PriceBookItem[];
  const groups = CATEGORY_ORDER.map((category) => ({
    category,
    items: items.filter((i) => i.category === category),
  })).filter((g) => g.items.length > 0);

  return (
    <AppShell trade={business.trade} businessName={business.name} width="narrow">
      <nav className="mb-4 flex items-center gap-1.5 text-sm text-mist-mute">
        <Link href="/dashboard" className="hover:text-mist">
          Apps
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="font-medium text-mist-soft">Price Book</span>
      </nav>

      <h1 className="text-display-sm font-bold text-mist">Price Book</h1>
      <p className="mt-1 mb-6 text-mist-soft">
        Your real rates and go-to materials. The AI prices new estimates with these instead of
        guessing.
      </p>

      {/* add form */}
      <Card className="mb-6 p-5">
        <h2 className="mb-4 flex items-center gap-2 font-semibold text-mist">
          <Plus className="h-[18px] w-[18px] text-mist-mute" />
          Add an item
        </h2>
        <form action={addPriceBookItem} className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="pb-description">Description</Label>
              <Input
                id="pb-description"
                name="description"
                required
                placeholder="e.g. Service call (first hour) or 40-gal gas water heater"
              />
            </div>
            <div className="grid grid-cols-3 gap-3 sm:col-span-2">
              <div>
                <Label htmlFor="pb-category">Category</Label>
                <Select id="pb-category" name="category" defaultValue="labor">
                  {CATEGORY_ORDER.map((c) => (
                    <option key={c} value={c}>
                      {CATEGORY_LABELS[c]}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <Label htmlFor="pb-unit">Unit</Label>
                <Input id="pb-unit" name="unit" placeholder="hr / ea / ft" />
              </div>
              <div>
                <Label htmlFor="pb-price">Price ($)</Label>
                <Input
                  id="pb-price"
                  name="unit_price"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  placeholder="0.00"
                />
              </div>
            </div>
          </div>
          <div className="self-end">
            <button type="submit" className={buttonClasses('primary', 'md', 'w-full sm:w-auto')}>
              <Plus />
              Add
            </button>
          </div>
        </form>
      </Card>

      {/* items */}
      {items.length === 0 ? (
        <Card className="flex flex-col items-center px-6 py-14 text-center">
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-accent/10 text-accent-bright">
            <BookOpen className="h-7 w-7" />
          </span>
          <h2 className="mt-4 text-lg font-semibold text-mist">Nothing saved yet</h2>
          <p className="mt-1 max-w-sm text-mist-soft">
            Add your service call rate, common parts, and per-unit prices. Every AI draft will use
            them from then on.
          </p>
        </Card>
      ) : (
        groups.map((group) => (
          <Card key={group.category} className="mb-4 overflow-hidden">
            <p className="border-b border-hairline px-4 py-2.5 text-sm font-bold text-accent-bright">
              {CATEGORY_LABELS[group.category]}
            </p>
            <div className="divide-y divide-hairline">
              {group.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-mist">{item.description}</p>
                  </div>
                  <span className="text-sm text-mist-soft">
                    {money(item.unit_price)}
                    {item.unit ? <span className="text-mist-mute"> / {item.unit}</span> : null}
                  </span>
                  <form action={deletePriceBookItem}>
                    <input type="hidden" name="id" value={item.id} />
                    <button
                      type="submit"
                      aria-label={`Delete ${item.description}`}
                      className="grid h-8 w-8 place-items-center rounded-lg text-mist-mute transition hover:bg-night-700 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </Card>
        ))
      )}
    </AppShell>
  );
}
