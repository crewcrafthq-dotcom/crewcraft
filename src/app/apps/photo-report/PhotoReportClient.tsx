'use client';

import { useState } from 'react';
import { FileDown, ImagePlus, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Input, Label } from '@/components/ui/Field';
import { toast } from '@/components/ui/toast';

interface ReportPhoto {
  key: string;
  dataUrl: string;
  caption: string;
}

const MAX_PHOTOS = 20;
const MAX_EDGE = 1400; // downscale before embedding so PDFs stay a sane size

async function fileToDataUrl(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();
  return canvas.toDataURL('image/jpeg', 0.82);
}

export function PhotoReportClient({
  businessName,
  license,
  accentHex,
}: {
  businessName: string;
  license: string | null;
  accentHex: string;
}) {
  const [title, setTitle] = useState('Job-site photo report');
  const [customer, setCustomer] = useState('');
  const [photos, setPhotos] = useState<ReportPhoto[]>([]);
  const [building, setBuilding] = useState(false);

  async function addFiles(files: FileList) {
    const room = MAX_PHOTOS - photos.length;
    const list = Array.from(files).slice(0, room);
    try {
      const added = await Promise.all(
        list.map(async (f) => ({
          key: `${f.name}-${f.lastModified}-${Math.random().toString(36).slice(2)}`,
          dataUrl: await fileToDataUrl(f),
          caption: '',
        })),
      );
      setPhotos((p) => [...p, ...added]);
    } catch {
      toast('Could not read one of those photos.', 'error');
    }
  }

  function setCaption(key: string, caption: string) {
    setPhotos((p) => p.map((ph) => (ph.key === key ? { ...ph, caption } : ph)));
  }
  function remove(key: string) {
    setPhotos((p) => p.filter((ph) => ph.key !== key));
  }

  async function downloadPdf() {
    setBuilding(true);
    try {
      // Loaded on demand — the PDF engine never weighs down normal page loads.
      const { Document, Page, View, Text, Image, StyleSheet, pdf } = await import(
        '@react-pdf/renderer'
      );

      const s = StyleSheet.create({
        page: { padding: 36, fontSize: 10, color: '#16263A' },
        bar: { height: 6, backgroundColor: accentHex, marginBottom: 14 },
        biz: { fontSize: 14, fontWeight: 700 },
        meta: { fontSize: 9, color: '#6B7482', marginTop: 2 },
        title: { fontSize: 12, fontWeight: 700, marginTop: 12, marginBottom: 10 },
        block: { marginBottom: 16 },
        img: { maxHeight: 300, objectFit: 'contain', borderRadius: 4 },
        cap: { marginTop: 5, fontSize: 10 },
        capNum: { color: '#6B7482' },
        footer: {
          position: 'absolute',
          bottom: 18,
          left: 36,
          right: 36,
          fontSize: 8,
          color: '#6B7482',
          textAlign: 'center',
        },
      });

      const doc = (
        <Document title={title} author={businessName}>
          <Page size="LETTER" style={s.page}>
            <View style={s.bar} fixed />
            <Text style={s.biz}>{businessName}</Text>
            <Text style={s.meta}>
              {[license ? `License ${license}` : '', new Date().toLocaleDateString('en-US')]
                .filter(Boolean)
                .join(' · ')}
            </Text>
            <Text style={s.title}>
              {title}
              {customer ? ` — ${customer}` : ''}
            </Text>
            {photos.map((p, i) => (
              <View key={p.key} style={s.block} wrap={false}>
                {/* eslint-disable-next-line jsx-a11y/alt-text */}
                <Image src={p.dataUrl} style={s.img} />
                <Text style={s.cap}>
                  <Text style={s.capNum}>Photo {i + 1}. </Text>
                  {p.caption || ' '}
                </Text>
              </View>
            ))}
            <Text style={s.footer} fixed>
              {businessName} — photo report
            </Text>
          </Page>
        </Document>
      );

      const blob = await pdf(doc).toBlob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      console.error(err);
      toast('Could not build the PDF on this device.', 'error');
    } finally {
      setBuilding(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card sm:grid-cols-2 sm:p-6">
        <div>
          <Label htmlFor="rtitle">Report title</Label>
          <Input id="rtitle" value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="rcustomer">Customer / job (optional)</Label>
          <Input id="rcustomer" placeholder="e.g. Dana R. — 41 Cedar Ln" value={customer} onChange={(e) => setCustomer(e.target.value)} />
        </div>
      </div>

      <div className="rounded-2xl border border-hairline bg-paper-800 p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-semibold text-ink">
            Photos{' '}
            <span className="text-sm font-normal text-ink-mute">
              ({photos.length}/{MAX_PHOTOS})
            </span>
          </p>
          <label className="inline-flex h-11 cursor-pointer items-center gap-2 rounded-lg border border-hairline-strong bg-paper-800 px-5 text-sm font-semibold text-ink transition hover:bg-paper-750">
            <ImagePlus className="h-4 w-4" />
            Add photos
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.length) void addFiles(e.target.files);
                e.target.value = '';
              }}
            />
          </label>
        </div>

        {photos.length === 0 ? (
          <p className="mt-5 rounded-xl border border-dashed border-hairline p-6 text-center text-sm text-ink-mute">
            Add job-site photos — each gets a caption line in the report.
          </p>
        ) : (
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {photos.map((p, i) => (
              <li key={p.key} className="rounded-xl border border-hairline bg-paper-750 p-3">
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={p.dataUrl} alt={`Photo ${i + 1}`} className="h-40 w-full rounded-lg object-cover" />
                  <button
                    type="button"
                    onClick={() => remove(p.key)}
                    aria-label={`Remove photo ${i + 1}`}
                    className="absolute -right-1.5 -top-1.5 grid h-6 w-6 place-items-center rounded-full bg-paper-700 text-ink-soft shadow hover:text-bad"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
                <Input
                  aria-label={`Caption for photo ${i + 1}`}
                  placeholder={`Photo ${i + 1} caption — e.g. “Hail bruising, south slope”`}
                  value={p.caption}
                  onChange={(e) => setCaption(p.key, e.target.value)}
                  className="mt-2 h-10 text-sm"
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={downloadPdf} disabled={building || photos.length === 0} size="lg">
          <FileDown />
          {building ? 'Building PDF…' : 'Download branded PDF'}
        </Button>
        <p className="text-sm text-ink-mute">Built on your device — photos never leave it.</p>
      </div>
    </div>
  );
}
