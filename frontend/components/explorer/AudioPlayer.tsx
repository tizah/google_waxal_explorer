"use client";

import { useEffect, useRef, useState } from "react";
import { api } from "@/lib/api";

interface Props {
  sampleId: string;
  durationSec: number;
}

type WaveSurferInstance = {
  play: () => void;
  pause: () => void;
  destroy: () => void;
  isPlaying: () => boolean;
  on: (event: string, cb: (...args: unknown[]) => void) => void;
  loadBlob: (blob: Blob) => void;
  getDuration: () => number;
  getCurrentTime: () => number;
};

function fmt(sec: number) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function AudioPlayer({ sampleId, durationSec }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wsRef        = useRef<WaveSurferInstance | null>(null);
  const [state, setState]     = useState<"idle" | "loading" | "ready" | "playing" | "error">("idle");
  const [currentTime, setCurrentTime] = useState(0);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      wsRef.current?.destroy();
    };
  }, []);

  const initAndPlay = async () => {
    if (state === "playing") {
      wsRef.current?.pause();
      setState("ready");
      return;
    }
    if (state === "ready") {
      wsRef.current?.play();
      setState("playing");
      return;
    }
    if (state === "loading") return;

    // First play — lazy init
    setState("loading");
    try {
      // Dynamic import — WaveSurfer requires window
      const WaveSurfer = (await import("wavesurfer.js")).default;

      const url  = api.audioUrl(sampleId);
      const resp = await fetch(url);
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const blob = await resp.blob();

      if (!containerRef.current) return;

      const ws = WaveSurfer.create({
        container:     containerRef.current,
        waveColor:     "#8b949e",
        progressColor: "#e6a817",
        height:        48,
        barWidth:      2,
        barGap:        1,
        normalize:     true,
        interact:      true,
        backend:       "WebAudio",
      });

      ws.on("timeupdate", (t: unknown) => {
        const time = t as number;
        setCurrentTime(time);
      });

      ws.on("finish", () => setState("ready"));
      ws.on("error",  () => setState("error"));

      ws.loadBlob(blob);
      ws.play();
      wsRef.current = ws as unknown as WaveSurferInstance;
      setState("playing");
    } catch {
      setState("error");
    }
  };

  const duration = wsRef.current?.getDuration() ?? durationSec;

  return (
    <div className="flex items-center gap-2 w-full">
      {/* Play / Pause button */}
      <button
        onClick={initAndPlay}
        disabled={state === "error"}
        className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
        style={{
          background: state === "error" ? "var(--bg-elevated)" : "color-mix(in srgb, var(--accent-gold) 15%, transparent)",
          border:     "1px solid color-mix(in srgb, var(--accent-gold) 30%, transparent)",
          color:      state === "error" ? "var(--text-muted)" : "var(--accent-gold)",
        }}
        title={state === "playing" ? "Pause" : "Play"}
      >
        {state === "loading" ? (
          <span className="w-2.5 h-2.5 border border-gold border-t-transparent rounded-full animate-spin" />
        ) : state === "playing" ? (
          <PauseIcon />
        ) : state === "error" ? (
          <span className="text-[9px]">x</span>
        ) : (
          <PlayIcon />
        )}
      </button>

      {/* Waveform container */}
      <div className="flex-1 min-w-0">
        {state === "idle" && (
          <div
            className="h-12 rounded flex items-center px-2"
            style={{ background: "var(--bg-elevated)" }}
          >
            <span className="font-mono text-[9px] text-muted">
              {fmt(durationSec)}
            </span>
          </div>
        )}
        <div
          ref={containerRef}
          className={state === "idle" ? "hidden" : "block"}
          style={{ minHeight: 48 }}
        />
      </div>

      {/* Time label */}
      {state !== "idle" && state !== "loading" && (
        <span className="font-mono text-[9px] text-muted shrink-0 w-16 text-right">
          {fmt(currentTime)} / {fmt(duration)}
        </span>
      )}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor">
      <path d="M2 1.5l7 4-7 4V1.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg width="10" height="11" viewBox="0 0 10 11" fill="currentColor">
      <rect x="1.5" y="1.5" width="2.5" height="8" rx="1" />
      <rect x="6"   y="1.5" width="2.5" height="8" rx="1" />
    </svg>
  );
}
