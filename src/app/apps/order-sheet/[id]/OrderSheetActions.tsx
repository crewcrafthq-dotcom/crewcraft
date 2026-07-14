'use client';

import { Copy, Printer } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/toast';

/** Copy-to-clipboard + print for the order sheet. Hidden when printing. */
export function OrderSheetActions({ text }: { text: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      toast('Order list copied — paste it in a text or email.');
    } catch {
      toast('Could not copy on this device.', 'error');
    }
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2 print:hidden">
      <Button onClick={copy} variant="secondary">
        <Copy />
        Copy list
      </Button>
      <Button onClick={() => window.print()}>
        <Printer />
        Print
      </Button>
    </div>
  );
}
