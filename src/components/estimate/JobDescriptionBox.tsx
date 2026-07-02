'use client';

import { useRef } from 'react';
import { Camera, Layers3, Mic, Sparkles, X } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Field';
import { cn } from '@/lib/cn';
import { AI_MAX_PHOTOS } from '@/lib/config';
import type { EditorPhoto } from './photos';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onBuild: () => void;
  loading: boolean;
  error: string | null;
  photos: EditorPhoto[];
  onAddPhotos: (files: FileList) => void;
  onRemovePhoto: (key: string) => void;
  tiersMode: boolean;
  onTiersMode: (v: boolean) => void;
}

export function JobDescriptionBox({
  value,
  onChange,
  onBuild,
  loading,
  error,
  photos,
  onAddPhotos,
  onRemovePhoto,
  tiersMode,
  onTiersMode,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const canBuild = Boolean(value.trim() || photos.length > 0);

  return (
    <div>
      <div className="relative">
        <Textarea
          aria-label="Job description"
          placeholder="Describe the job in plain words — e.g. “Replace a 40-gallon gas water heater in the garage, haul off the old one.”"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          className="pr-12"
        />
        {/*
          Voice input is the headline v2 feature (§2). This is the clean seam —
          a placeholder mic button, wired to nothing yet.
        */}
        <button
          type="button"
          data-voice-seam
          disabled
          title="Voice input — coming soon"
          aria-label="Voice input (coming soon)"
          className="absolute bottom-2.5 right-2.5 grid h-9 w-9 place-items-center rounded-lg text-mist-mute opacity-50"
        >
          <Mic className="h-[18px] w-[18px]" />
        </button>
      </div>

      {/* job-site photos */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) onAddPhotos(e.target.files);
          e.target.value = '';
        }}
      />
      {photos.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {photos.map((p) => (
            <span key={p.key} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={p.dataUrl}
                alt="Job-site photo"
                className="h-16 w-16 rounded-lg border border-hairline object-cover"
              />
              <button
                type="button"
                onClick={() => onRemovePhoto(p.key)}
                aria-label="Remove photo"
                className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-night-700 text-mist-soft shadow hover:text-red-400"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button type="button" onClick={onBuild} disabled={loading || !canBuild}>
          <Sparkles className={loading ? 'animate-pulse' : ''} />
          {loading ? 'Building…' : tiersMode ? 'Build 3 options' : 'Build line items'}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={() => fileRef.current?.click()}
          disabled={loading || photos.length >= AI_MAX_PHOTOS}
        >
          <Camera />
          {photos.length > 0 ? `Photos (${photos.length}/${AI_MAX_PHOTOS})` : 'Add photos'}
        </Button>
        <button
          type="button"
          onClick={() => onTiersMode(!tiersMode)}
          aria-pressed={tiersMode}
          className={cn(
            'inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition duration-150',
            tiersMode
              ? 'border-accent bg-accent/10 text-accent-bright'
              : 'border-hairline text-mist-soft hover:bg-night-800 hover:text-mist',
          )}
        >
          <Layers3 className="h-[1.1em] w-[1.1em]" />
          Good / Better / Best
        </button>
      </div>
      <p className="mt-2 text-sm text-mist-mute">
        {tiersMode
          ? 'You’ll get three priced options to choose from — great for upsells.'
          : 'Prices come back as suggestions — review and edit them. Snap photos of the equipment and the AI reads them too.'}
      </p>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
