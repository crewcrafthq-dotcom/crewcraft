'use client';

import { useEffect, useRef, useState } from 'react';
import { Mic, Square } from 'lucide-react';

import { Button } from '@/components/ui/Button';
import { toast } from '@/components/ui/toast';

/* Minimal Web Speech API types — lib.dom doesn't ship the webkit variant. */
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((e: { resultIndex: number; results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> }) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: { error: string }) => void) | null;
}

function getRecognition(): SpeechRecognitionLike | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  const Ctor = w.SpeechRecognition ?? w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

/**
 * Toolbelt Voice: dictate the job instead of typing it. Uses the browser's
 * built-in speech recognition (free, on-device/Google — no extra service).
 * Renders nothing when the browser doesn't support it, so there's never a
 * dead mic button.
 */
export function VoiceButton({ onAppend, disabled }: { onAppend: (text: string) => void; disabled?: boolean }) {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recRef = useRef<SpeechRecognitionLike | null>(null);
  const appendRef = useRef(onAppend);
  appendRef.current = onAppend;

  useEffect(() => {
    setSupported(getRecognition() !== null);
  }, []);

  useEffect(() => () => recRef.current?.stop(), []);

  function stop() {
    recRef.current?.stop();
    recRef.current = null;
    setListening(false);
  }

  function start() {
    const rec = getRecognition();
    if (!rec) return;
    rec.continuous = true;
    rec.interimResults = false;
    rec.lang = 'en-US';
    rec.onresult = (e) => {
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal && r[0]?.transcript) appendRef.current(r[0].transcript.trim());
      }
    };
    rec.onend = () => {
      recRef.current = null;
      setListening(false);
    };
    rec.onerror = (e) => {
      if (e.error === 'not-allowed') toast('Microphone blocked — allow it in your browser settings.', 'error');
      recRef.current = null;
      setListening(false);
    };
    recRef.current = rec;
    rec.start();
    setListening(true);
  }

  if (!supported) return null;

  return (
    <Button
      type="button"
      variant="secondary"
      onClick={listening ? stop : start}
      disabled={disabled}
      aria-pressed={listening}
    >
      {listening ? (
        <>
          <Square className="text-bad" />
          <span className="inline-flex items-center gap-2">
            Stop
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
            </span>
          </span>
        </>
      ) : (
        <>
          <Mic />
          Dictate
        </>
      )}
    </Button>
  );
}
