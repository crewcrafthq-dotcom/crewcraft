'use client';

import { Copy } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/toast';

export function CopyLinkButton({ url }: { url: string }) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      toast('Lead page link copied — paste it anywhere.');
    } catch {
      toast('Could not copy on this device.', 'error');
    }
  }
  return (
    <Button onClick={copy} variant="secondary" size="sm">
      <Copy />
      Copy link
    </Button>
  );
}
