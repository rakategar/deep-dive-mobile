import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";

export interface DopplerWaveCanvasHandle {
  reset: () => void;
}

interface Props {
  frequency: number; // Hz (source freq)
  sourceSpeed: number; // m/s
  mode: "approach" | "leave";
  isPlaying: boolean;
}

interface Ring {
  // emission position in meters (world)
  emitX: number;
  emitY: number;
  emitTime: number; // seconds
}

const SOUND_SPEED = 343; // m/s
// World is in meters. We'll show ~700m horizontally inside canvas.
const WORLD_WIDTH_M = 700;
const OBSERVER_X_M = 600; // observer position (meters)

export const DopplerWaveCanvas = forwardRef<DopplerWaveCanvasHandle, Props>(
  ({ frequency, sourceSpeed, mode, isPlaying }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const ringsRef = useRef<Ring[]>([]);
    const sourceXRef = useRef<number>(100); // meters
    const simTimeRef = useRef<number>(0); // seconds
    const lastEmitRef = useRef<number>(0);
    const lastFrameRef = useRef<number>(0);
    const rafRef = useRef<number | null>(null);

    const propsRef = useRef({ frequency, sourceSpeed, mode, isPlaying });
    propsRef.current = { frequency, sourceSpeed, mode, isPlaying };

    const reset = () => {
      ringsRef.current = [];
      simTimeRef.current = 0;
      lastEmitRef.current = 0;
      sourceXRef.current = propsRef.current.mode === "approach" ? 100 : OBSERVER_X_M - 100;
    };

    useImperativeHandle(ref, () => ({ reset }));

    // Reset source position when mode changes
    useEffect(() => {
      sourceXRef.current = mode === "approach" ? 100 : OBSERVER_X_M - 100;
      ringsRef.current = [];
      lastEmitRef.current = simTimeRef.current;
    }, [mode]);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const setSize = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      };
      setSize();
      const ro = new ResizeObserver(setSize);
      ro.observe(canvas);

      // Slowdown factor: real-world seconds run faster visually so sound is visible.
      // At 343 m/s, crossing 700m takes ~2s real. We'll keep that but speed factor lets us tweak.
      const TIME_SCALE = 0.5; // sim seconds per real second (slower than real-time so user sees rings)

      const tick = (now: number) => {
        if (!lastFrameRef.current) lastFrameRef.current = now;
        const dtReal = (now - lastFrameRef.current) / 1000;
        lastFrameRef.current = now;

        const { frequency: f, sourceSpeed: vs, mode: m, isPlaying: playing } = propsRef.current;

        if (playing) {
          const dt = dtReal * TIME_SCALE;
          simTimeRef.current += dt;

          // Move source
          const dir = m === "approach" ? 1 : -1;
          sourceXRef.current += dir * vs * dt;

          // Wrap source position so animation continues
          if (m === "approach" && sourceXRef.current > OBSERVER_X_M - 30) {
            sourceXRef.current = 100;
            // keep rings, they will fade out
          }
          if (m === "leave" && sourceXRef.current > WORLD_WIDTH_M - 50) {
            sourceXRef.current = OBSERVER_X_M - 100;
          }
          if (sourceXRef.current < 20) sourceXRef.current = 20;

          // Emit rings according to frequency
          // Period = 1/f seconds (sim time)
          const emitRate = f / 80;
          const emitPeriod = 1 / emitRate;

          while (simTimeRef.current - lastEmitRef.current >= emitPeriod) {
            lastEmitRef.current += emitPeriod;
            ringsRef.current.push({
              emitX: sourceXRef.current,
              emitY: WORLD_WIDTH_M / 2, // not used, we use canvas center
              emitTime: lastEmitRef.current,
            });
          }

          // Drop old rings (radius too big)
          ringsRef.current = ringsRef.current.filter(
            (r) => (simTimeRef.current - r.emitTime) * SOUND_SPEED < WORLD_WIDTH_M * 1.2
          );
          // Cap count
          if (ringsRef.current.length > 60) {
            ringsRef.current = ringsRef.current.slice(-60);
          }
        }

        // Draw
        const rect = canvas.getBoundingClientRect();
        const W = rect.width;
        const H = rect.height;
        const scale = W / WORLD_WIDTH_M;
        const cy = H / 2;

        // Background gradient
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, "hsl(280 60% 96%)");
        grad.addColorStop(1, "hsl(340 70% 95%)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, W, H);

        // Draw rings
        for (const r of ringsRef.current) {
          const age = simTimeRef.current - r.emitTime;
          const radiusM = age * SOUND_SPEED;
          const radiusPx = radiusM * scale;
          if (radiusPx < 1 || radiusPx > Math.max(W, H)) continue;
          const alpha = Math.max(0, 1 - radiusPx / (W * 0.9));
          ctx.beginPath();
          ctx.strokeStyle = `hsla(265, 70%, 55%, ${alpha * 0.7})`;
          ctx.lineWidth = 1.4;
          ctx.arc(r.emitX * scale, cy, radiusPx, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Observer
        const obsX = OBSERVER_X_M * scale;
        ctx.fillStyle = "hsl(160 60% 45%)";
        ctx.beginPath();
        ctx.arc(obsX, cy, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("P", obsX, cy);
        ctx.fillStyle = "hsl(220 20% 25%)";
        ctx.font = "10px Inter, sans-serif";
        ctx.fillText("Pengamat", obsX, cy + 22);

        // Source
        const srcX = sourceXRef.current * scale;
        ctx.fillStyle = "hsl(340 70% 50%)";
        ctx.beginPath();
        ctx.arc(srcX, cy, 11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "white";
        ctx.font = "bold 11px Inter, sans-serif";
        ctx.fillText("S", srcX, cy);
        ctx.fillStyle = "hsl(220 20% 25%)";
        ctx.font = "10px Inter, sans-serif";
        ctx.fillText("Sumber", srcX, cy + 22);

        // Direction label
        ctx.fillStyle = "hsl(160 50% 35%)";
        ctx.font = "10px Inter, sans-serif";
        ctx.textAlign = "center";
        const arrow = propsRef.current.mode === "approach" ? "→ Mendekati Pengamat" : "← Menjauh dari Pengamat";
        ctx.fillText(arrow, W / 2, 16);

        rafRef.current = requestAnimationFrame(tick);
      };

      rafRef.current = requestAnimationFrame(tick);

      return () => {
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        ro.disconnect();
        lastFrameRef.current = 0;
      };
    }, []);

    return (
      <canvas
        ref={canvasRef}
        className="w-full rounded-lg mt-2"
        style={{ height: 180, display: "block" }}
      />
    );
  }
);

DopplerWaveCanvas.displayName = "DopplerWaveCanvas";
