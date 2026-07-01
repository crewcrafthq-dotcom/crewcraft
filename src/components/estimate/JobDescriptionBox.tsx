'use client';

import { Mic, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Field';

interface Props {
  value: string;
  onChange: (v: string) => void;
  onBuild: () => void;
  loading: boolean;
  error: string | null;
}

export function JobDescriptionBox({ value, onChange, onBuild, loading, error }: Props) {
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

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Button type="button" onClick={onBuild} disabled={loading || !value.trim()}>
          <Sparkles className={loading ? 'animate-pulse' : ''} />
          {loading ? 'Building…' : 'Build line items'}
        </Button>
        <span className="text-sm text-mist-mute">
          Prices come back as suggestions — review and edit them.
        </span>
      </div>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
