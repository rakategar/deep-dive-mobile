import { useEffect, useRef, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth, useUser } from "@clerk/clerk-react";
import { Volume2, Lightbulb, Trash2, Database, Check, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { saveUraian, getUraian } from "@/lib/uraian";

/* ----- Shared helpers for spreadsheet fetch ----- */
interface IntensityRow {
  no: number;
  rowNumber: number;
  P: number;
  r: number;
  I: number;
  TI: string;
}

async function fetchUserIntensityRows(token: string | null): Promise<IntensityRow[]> {
  if (!token) return [];
  const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
  const res = await fetch(
    `https://${projectId}.supabase.co/functions/v1/list-intensity-data`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  const data = await res.json();
  if (!res.ok || !data.success) throw new Error(data?.error ?? "Gagal memuat data");
  return (data.rows ?? []) as IntensityRow[];
}

type UraianStatus = "idle" | "saving" | "saved" | "error";

const SaveStatus = ({ status }: { status: UraianStatus }) => {
  if (status === "idle") return null;
  if (status === "saving") return <p className="text-[10px] text-muted-foreground mt-0.5">Menyimpan...</p>;
  if (status === "saved") return <p className="text-[10px] text-emerald-600 mt-0.5">Tersimpan ✓</p>;
  return <p className="text-[10px] text-rose-600 mt-0.5">Gagal menyimpan</p>;
};

function useUraianAutosave(sheetName: string, delay = 700) {
  const { isSignedIn, getToken } = useAuth();
  const [status, setStatus] = useState<UraianStatus>("idle");
  const timerRef = useRef<number | undefined>(undefined);
  const latestFieldsRef = useRef<Record<string, string>>({});

  const load = useCallback(async (): Promise<Record<string, string>> => {
    if (!isSignedIn) return {};
    try {
      const token = await getToken();
      return await getUraian(token, sheetName);
    } catch {
      return {};
    }
  }, [isSignedIn, getToken, sheetName]);

  const save = useCallback((fields: Record<string, string>) => {
    latestFieldsRef.current = fields;
    setStatus("idle");
    clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(async () => {
      if (!isSignedIn) return;
      setStatus("saving");
      try {
        const token = await getToken();
        await saveUraian(token, sheetName, latestFieldsRef.current);
        setStatus("saved");
      } catch (err) {
        console.error(`Gagal menyimpan uraian ke sheet "${sheetName}"`, err);
        setStatus("error");
      }
    }, delay);
  }, [isSignedIn, getToken, sheetName, delay]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return { load, save, status };
}


/* ============================ Tahap 1: Observasi ============================ */
export const IntensitasObservationLKPD = () => {
  const [observasi, setObservasi] = useState("");
  const { load, save, status } = useUraianAutosave("Orientasi - Intensitas");

  useEffect(() => {
    load().then((f) => { if (f.observasi) setObservasi(f.observasi); });
  }, [load]);

  const handleChange = (val: string) => {
    setObservasi(val);
    save({ observasi: val });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">Fenomena intensitas bunyi yang diamati:</p>
      <div className="rounded-xl border border-border bg-card p-4 flex flex-col items-center gap-1">
        <Volume2 className="h-6 w-6 text-foreground/70" />
        <span className="text-sm font-medium italic">Sound Horeg</span>
        <span className="text-xs text-muted-foreground">~120 - 135 dB</span>
      </div>
      <p className="text-sm font-medium text-foreground mt-3">Catat hasil observasimu tentang intensitas bunyi:</p>
      <div className="rounded-xl border border-border bg-card p-3">
        <p className="text-sm text-foreground/85">
          Mengapa bunyi <i>sound horeg</i> dapat memecahkan kaca yang berada didekat <i>sound horeg</i>?
        </p>
        <textarea
          value={observasi}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Tuliskan pendapatmu...."
          className="w-full mt-2 rounded-lg border border-border bg-card p-3 text-xs text-foreground/75 min-h-24 outline-none focus:ring-2 focus:ring-lkpd/30"
        />
        <SaveStatus status={status} />
      </div>
    </div>
  );
};

/* ====================== Tahap 2: Rumuskan Pertanyaan ====================== */
export const IntensitasFormulateQuestionLKPD = () => {
  const [pertanyaan, setPertanyaan] = useState("");
  const [varBebas, setVarBebas] = useState("");
  const [varTerikat, setVarTerikat] = useState("");
  const [varKontrol, setVarKontrol] = useState("");
  const { load, save, status } = useUraianAutosave("Perumusan Masalah - Intensitas");

  useEffect(() => {
    load().then((f) => {
      if (f.pertanyaan_penelitian) setPertanyaan(f.pertanyaan_penelitian);
      if (f.variabel_bebas) setVarBebas(f.variabel_bebas);
      if (f.variabel_terikat) setVarTerikat(f.variabel_terikat);
      if (f.variabel_kontrol) setVarKontrol(f.variabel_kontrol);
    });
  }, [load]);

  const triggerSave = (overrides: Partial<Record<string, string>> = {}) => {
    save({
      pertanyaan_penelitian: pertanyaan,
      variabel_bebas: varBebas,
      variabel_terikat: varTerikat,
      variabel_kontrol: varKontrol,
      ...overrides,
    });
  };

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-foreground">
        Tuliskan rumusan pertanyaan penelitianmu tentang intensitas bunyi:
      </p>
      <textarea
        value={pertanyaan}
        onChange={(e) => { setPertanyaan(e.target.value); triggerSave({ pertanyaan_penelitian: e.target.value }); }}
        placeholder="contoh: Bagaimana pengaruh jarak (r) terhadap taraf intensitas (TI) bunyi yang diterima pengamat dari sumber dengan daya tetap P?"
        className="w-full rounded-xl border border-border bg-card p-3 text-sm min-h-20 outline-none focus:ring-2 focus:ring-lkpd/30"
      />
      <div className="rounded-xl bg-surface-soft-blue p-3 space-y-2">
        <p className="text-sm font-semibold flex items-center gap-2 text-info">
          <Lightbulb className="h-4 w-4" /> Identifikasi Variabelmu
        </p>
        <div>
          <p className="text-xs font-semibold text-info">Variabel Bebas (Yang kamu ubah):</p>
          <input
            value={varBebas}
            onChange={(e) => { setVarBebas(e.target.value); triggerSave({ variabel_bebas: e.target.value }); }}
            placeholder="contoh: jarak r, daya sumber P..."
            className="w-full mt-1 rounded-lg border border-info/30 bg-card px-2.5 py-1.5 text-xs outline-none"
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-info">Variabel Terikat (Yang kamu ukur):</p>
          <input
            value={varTerikat}
            onChange={(e) => { setVarTerikat(e.target.value); triggerSave({ variabel_terikat: e.target.value }); }}
            placeholder="contoh: intensitas I, taraf intensitas TI..."
            className="w-full mt-1 rounded-lg border border-info/30 bg-card px-2.5 py-1.5 text-xs outline-none"
          />
        </div>
        <div>
          <p className="text-xs font-semibold text-info">Variabel Kontrol (Yang kamu jaga tetap):</p>
          <input
            value={varKontrol}
            onChange={(e) => { setVarKontrol(e.target.value); triggerSave({ variabel_kontrol: e.target.value }); }}
            placeholder="contoh: medium udara, intensitas referensi I₀..."
            className="w-full mt-1 rounded-lg border border-info/30 bg-card px-2.5 py-1.5 text-xs outline-none"
          />
        </div>
      </div>
      <SaveStatus status={status} />
    </div>
  );
};

/* ========================= Tahap 3: Hipotesis ========================= */
export const IntensitasHypothesisLKPD = () => {
  const [hipotesis, setHipotesis] = useState("");
  const { load, save, status } = useUraianAutosave("Perumusan Hipotesis - Intensitas");

  useEffect(() => {
    load().then((f) => { if (f.hipotesis) setHipotesis(f.hipotesis); });
  }, [load]);

  const handleChange = (val: string) => {
    setHipotesis(val);
    save({ hipotesis: val });
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-card border border-border p-3">
        <p className="text-sm font-semibold">📝 Template Hipotesis Intensitas Bunyi:</p>
        <p className="text-xs text-foreground/80 mt-2">
          <b>Jika</b> jarak r dari sumber bunyi diperbesar dengan daya sumber tetap...
        </p>
        <p className="text-xs text-foreground/80 mt-1">
          <b>Maka</b> intensitas bunyi I yang diterima pengamat akan menurun secara kuadrat terbalik (∝ 1/r²)...
        </p>
        <p className="text-xs text-foreground/80 mt-1"><b>Karena</b> ...</p>
      </div>
      <textarea
        value={hipotesis}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="contoh: Jika jarak r diperbesar 2× dengan P tetap, maka I akan turun menjadi ¼-nya..."
        className="w-full rounded-xl border border-border bg-card p-3 text-sm min-h-20 outline-none focus:ring-2 focus:ring-lkpd/30"
      />
      <SaveStatus status={status} />
    </div>
  );
};

/* ============================ Tahap 4: Simulator ============================ */
interface IntensitasEntry {
  no: number;
  P: number;
  r: number;
  I: number;
  TI: string;
  rowNumber?: number;
  saveStatus?: "idle" | "saving" | "saved" | "error";
}

const I0 = 1e-12;

const formatI = (I: number) =>
  I >= 1e-4 ? I.toFixed(4) : I.toExponential(2);

/* ---- Visualisasi Penyebaran Energi (Canvas — gelombang merambat) ---- */
const EnergyVisualization = ({ P, r }: { P: number; r: number }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const stateRef = useRef({ P, r });
  stateRef.current = { P, r };

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId = 0;
    let dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    type Wave = { born: number };
    const waves: Wave[] = [];
    let lastSpawn = 0;

    const draw = (now: number) => {
      const w = canvas.width;
      const h = canvas.height;
      const { P: Pv, r: rv } = stateRef.current;
      const power = Math.min(1, Pv / 1000);

      const spawnInterval = 700 - power * 250;
      if (now - lastSpawn > spawnInterval) {
        waves.push({ born: now });
        lastSpawn = now;
      }

      const sourceX = w * 0.12;
      const sourceY = h * 0.5;
      const maxR = Math.hypot(Math.max(w - sourceX, sourceX), h);
      const observerX = sourceX + (Math.min(rv, 100) / 100) * (w - sourceX - 24 * dpr);

      ctx.clearRect(0, 0, w, h);

      const speed = (0.06 + power * 0.05) * dpr;
      for (let i = waves.length - 1; i >= 0; i--) {
        const age = now - waves[i].born;
        const radius = age * speed;
        if (radius > maxR) { waves.splice(i, 1); continue; }
        const lifeT = radius / maxR;
        const opacity = (1 - lifeT) * (0.35 + power * 0.55);
        let stroke: string;
        if (lifeT < 0.33) stroke = `hsla(0, 85%, 58%, ${opacity})`;
        else if (lifeT < 0.66) stroke = `hsla(28, 92%, 58%, ${opacity})`;
        else stroke = `hsla(220, 80%, 60%, ${opacity})`;
        ctx.beginPath();
        ctx.lineWidth = 1.6 * dpr;
        ctx.strokeStyle = stroke;
        ctx.arc(sourceX, sourceY, radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.setLineDash([5 * dpr, 5 * dpr]);
      ctx.lineWidth = 1.2 * dpr;
      ctx.strokeStyle = "hsla(270, 60%, 55%, 0.7)";
      ctx.beginPath();
      ctx.moveTo(sourceX, sourceY);
      ctx.lineTo(observerX, sourceY);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = "hsla(270, 60%, 55%, 0.45)";
      ctx.moveTo(observerX, h * 0.12);
      ctx.lineTo(observerX, h * 0.88);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = "hsl(270, 60%, 38%)";
      ctx.font = `${11 * dpr}px Inter, system-ui, sans-serif`;
      ctx.textAlign = "center";
      ctx.fillText(`P (${rv}m)`, observerX, h * 0.1);

      ctx.beginPath();
      ctx.fillStyle = "hsl(35, 95%, 55%)";
      ctx.arc(sourceX, sourceY, 9 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "white";
      ctx.arc(sourceX, sourceY, 4 * dpr, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "hsla(222, 20%, 14%, 0.6)";
      ctx.font = `${10 * dpr}px Inter, system-ui, sans-serif`;
      ctx.fillText("Sumber", sourceX, h - 6 * dpr);

      ctx.beginPath();
      ctx.fillStyle = "hsl(15, 70%, 35%)";
      ctx.arc(observerX, sourceY, 7 * dpr, 0, Math.PI * 2);
      ctx.fill();

      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => { cancelAnimationFrame(rafId); ro.disconnect(); };
  }, []);

  return (
    <div className="relative rounded-2xl border border-primary/20 overflow-hidden bg-gradient-to-r from-orange-100 via-rose-50 to-indigo-100">
      <div className="relative z-10 flex items-center justify-between px-3 pt-3 text-xs">
        <span className="font-semibold text-foreground">Visualisasi Penyebaran Energi</span>
        <div className="flex items-center gap-2 text-[11px]">
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-rose-500" /> Tinggi</span>
          <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-info" /> Rendah</span>
        </div>
      </div>
      <div ref={containerRef} className="relative h-44 w-full">
        <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      </div>
    </div>
  );
};

export const IntensitasSimulatorLKPD = () => {
  const [P, setP] = useState(448);
  const [r, setR] = useState(90);
  const [entries, setEntries] = useState<IntensitasEntry[]>([]);
  const [recording, setRecording] = useState(false);
  const [clearing, setClearing] = useState(false);
  const debounceTimers = useRef<Record<number, number>>({});
  const navigate = useNavigate();
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  // Essay field
  const [pertanyaanAnalisis, setPertanyaanAnalisis] = useState("");
  const { load: loadUraian, save: saveUraian_, status: uraianStatus } = useUraianAutosave("Pengumpulan Data - Intensitas");

  const safeR = Math.max(r, 1);
  const I = P / (4 * Math.PI * safeR * safeR);

  useEffect(() => {
    if (!isSignedIn) return;
    (async () => {
      try {
        const token = await getToken();
        const rows = await fetchUserIntensityRows(token);
        setEntries(rows.map((r) => ({ no: r.no, P: r.P, r: r.r, I: r.I, TI: r.TI, rowNumber: r.rowNumber, saveStatus: "idle" })));
      } catch (err) {
        console.error("load intensity rows error", err);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSignedIn]);

  useEffect(() => {
    loadUraian().then((f) => { if (f.pertanyaan_analisis) setPertanyaanAnalisis(f.pertanyaan_analisis); });
  }, [loadUraian]);

  const handleClear = async () => {
    if (!isSignedIn) { setEntries([]); return; }
    if (!window.confirm("Hapus semua data Intensitas Bunyi kamu dari spreadsheet? Tindakan ini tidak bisa dibatalkan.")) return;
    setClearing(true);
    try {
      const token = await getToken();
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const rowNumbers = entries.map((e) => e.rowNumber).filter((n): n is number => typeof n === "number");
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/delete-intensity-rows`,
        { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ rowNumbers }) },
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data?.error ?? "Gagal menghapus data");
      setEntries([]);
      toast({ title: "Data dihapus", description: `${data.cleared ?? 0} baris dihapus dari spreadsheet.` });
    } catch (err: any) {
      console.error("delete intensity rows error", err);
      toast({ title: "Gagal menghapus", description: err?.message ?? "Coba lagi sebentar.", variant: "destructive" });
    } finally {
      setClearing(false);
    }
  };

  const handleRecord = async () => {
    if (!isSignedIn || !user) {
      toast({ title: "Login dulu", description: "Kamu perlu login untuk mencatat data ke spreadsheet.", variant: "destructive" });
      navigate("/login");
      return;
    }
    setRecording(true);
    try {
      const token = await getToken();
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/append-intensity-data`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify({ power: P, distance: safeR, intensity: Number(I.toExponential(4)) }),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data?.error ?? "Gagal mencatat data");
      setEntries((prev) => [...prev, { no: data.no ?? prev.length + 1, P, r: safeR, I, TI: "", rowNumber: data.rowNumber, saveStatus: "idle" }]);
      toast({ title: "Data berhasil dicatat", description: `P=${P}W, r=${safeR}m, I=${formatI(I)} W/m²` });
    } catch (err: any) {
      console.error("intensity record error", err);
      toast({ title: "Gagal mencatat data. Coba lagi.", description: err?.message ?? "", variant: "destructive" });
    } finally {
      setRecording(false);
    }
  };

  const updateTiOnServer = async (index: number, value: string) => {
    const entry = entries[index];
    if (!entry?.rowNumber) return;
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, saveStatus: "saving" } : e)));
    try {
      const token = await getToken();
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/update-intensity-ti`,
        { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ rowNumber: entry.rowNumber, tiHitung: value }) },
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data?.error ?? "Gagal menyimpan");
      setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, saveStatus: "saved" } : e)));
    } catch (err) {
      console.error("intensity TI update error", err);
      setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, saveStatus: "error" } : e)));
    }
  };

  const handleTiChange = (index: number, value: string) => {
    setEntries((prev) => prev.map((e, i) => (i === index ? { ...e, TI: value, saveStatus: "idle" } : e)));
    const timers = debounceTimers.current;
    if (timers[index]) window.clearTimeout(timers[index]);
    timers[index] = window.setTimeout(() => updateTiOnServer(index, value), 700);
  };

  useEffect(() => () => { Object.values(debounceTimers.current).forEach((t) => window.clearTimeout(t)); }, []);

  return (
    <div className="space-y-3">
      <EnergyVisualization P={P} r={safeR} />

      <div className="rounded-2xl bg-card border border-primary/15 p-4 space-y-3 shadow-card">
        <div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Daya Sumber (P)</span>
            <span className="font-bold text-amber-600">{P} W</span>
          </div>
          <input type="range" min={1} max={1000} step={1} value={P} onChange={(e) => setP(Number(e.target.value))} className="w-full mt-1 accent-amber-500" />
          <div className="flex justify-between text-[11px] text-muted-foreground"><span>1 W</span><span>1000 W</span></div>
        </div>
        <div>
          <div className="flex justify-between text-sm">
            <span className="font-semibold">Jarak Pengamat (r)</span>
            <span className="font-bold text-violet-600">{safeR} m</span>
          </div>
          <input type="range" min={1} max={100} step={1} value={r} onChange={(e) => setR(Number(e.target.value))} className="w-full mt-1 accent-violet-600" />
          <div className="flex justify-between text-[11px] text-muted-foreground"><span>1 m</span><span>100 m</span></div>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/15 bg-violet-50/60 p-4 space-y-3">
        <p className="text-sm font-semibold flex items-center gap-1">📊 Hasil Pengukuran:</p>
        <div className="rounded-xl bg-card border border-violet-200 p-3 text-center">
          <p className="text-xs text-info">Intensitas (I)</p>
          <p className="font-bold text-foreground text-lg leading-tight">{formatI(I)}</p>
          <p className="text-[10px] text-muted-foreground">W/m²</p>
        </div>
        <div className="rounded-xl bg-amber-50 border border-amber-300 p-3 text-[11px] text-amber-900 leading-relaxed">
          ⚠️ <b>Taraf Intensitas (TI)</b> tidak ditampilkan — hitung sendiri menggunakan rumus{" "}
          <span className="font-mono">TI = 10 log(I / I₀)</span> dan isi di kolom tabel!
        </div>
        <div className="rounded-lg bg-card border border-border p-2 text-center font-mono text-[11px] text-foreground/80">
          I = {P}/(4π×{safeR}²) = {formatI(I)} W/m²
        </div>
      </div>

      <button
        onClick={handleRecord}
        disabled={recording}
        className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white py-3.5 font-semibold flex items-center justify-center gap-2 active:scale-[0.98] transition-transform disabled:opacity-60 shadow-elevated"
      >
        <Database className="h-4 w-4" />
        {recording ? "Mencatat..." : `Catat Data (P=${P}W, r=${safeR}m)`}
      </button>

      <div className="rounded-2xl bg-card border border-primary/15 p-3 text-sm">
        <div className="flex items-center justify-between">
          <p className="font-semibold">Data Terkumpul</p>
          {entries.length > 0 && (
            <button onClick={handleClear} disabled={clearing} className="text-xs text-rose-600 flex items-center gap-1 hover:underline disabled:opacity-50" title="Menghapus semua baris kamu di spreadsheet.">
              <Trash2 className="h-3 w-3" /> {clearing ? "Menghapus..." : "Hapus"}
            </button>
          )}
        </div>
        {entries.length === 0 ? (
          <p className="text-xs text-muted-foreground text-center mt-3">Belum ada data. Atur P & r lalu tekan "Catat Data".</p>
        ) : (
          <div className="mt-2 overflow-x-auto rounded-lg border border-border">
            <table className="w-full text-xs">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="p-2 font-semibold">#</th>
                  <th className="p-2 font-semibold">P (W)</th>
                  <th className="p-2 font-semibold">r (m)</th>
                  <th className="p-2 font-semibold">I (W/m²)</th>
                  <th className="p-2 font-semibold bg-amber-50">TI hitung (dB) ✏️</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => (
                  <tr key={`${e.no}-${i}`} className="border-t border-border">
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2">{e.P}</td>
                    <td className="p-2">{e.r}</td>
                    <td className="p-2 font-semibold">{formatI(e.I)}</td>
                    <td className="p-2 bg-amber-50/40">
                      <input
                        value={e.TI}
                        onChange={(ev) => handleTiChange(i, ev.target.value)}
                        placeholder="hitung..."
                        className="w-24 rounded-md border border-amber-300 bg-card px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-amber-300"
                      />
                      {e.saveStatus === "saving" && <p className="text-[10px] text-muted-foreground mt-0.5">Menyimpan...</p>}
                      {e.saveStatus === "saved" && <p className="text-[10px] text-emerald-600 mt-0.5">Tersimpan</p>}
                      {e.saveStatus === "error" && <p className="text-[10px] text-rose-600 mt-0.5">Gagal menyimpan</p>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-[11px] text-foreground/70 mt-2 leading-snug">
          💡 Isi kolom <b>TI hitung</b> dengan: TI = 10 × log₁₀(I / 10⁻¹²) — data ini akan muncul di halaman Pengujian Hipotesis.
        </p>
      </div>

      <div className="rounded-2xl bg-violet-50/70 border border-primary/15 p-3">
        <p className="text-sm font-semibold text-lkpd flex items-center gap-1">📊 Pertanyaan Analisis:</p>
        <p className="text-xs text-foreground/80 mt-1">
          Bagaimana nilai intensitas bunyi (I) ketika jarak pengamat (r) diubah-ubah?
        </p>
        <textarea
          value={pertanyaanAnalisis}
          onChange={(e) => { setPertanyaanAnalisis(e.target.value); saveUraian_({ pertanyaan_analisis: e.target.value }); }}
          placeholder="Berdasarkan data yang saya kumpulkan, ketika jarak..."
          className="w-full mt-2 rounded-lg border border-primary/20 bg-card p-2 text-xs min-h-20 outline-none focus:ring-2 focus:ring-lkpd/30"
        />
        <SaveStatus status={uraianStatus} />
      </div>
    </div>
  );
};

/* ============================ Video YouTube + Simulator wrapper ============================ */
export const IntensitasObservationVideoLKPD = () => null;


type IntensityCheckEntry = IntensityRow & { checkStatus?: "correct" | "wrong" | null };

const I0_REF = 1e-12;
const expectedTI = (I: number) => 10 * Math.log10(I / I0_REF);

export const IntensitasDataAnalysisLKPD = () => {
  const { isSignedIn, getToken } = useAuth();
  const [entries, setEntries] = useState<IntensityCheckEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const [deskripsi, setDeskripsi] = useState("");
  const [evaluasi, setEvaluasi] = useState("");
  const { load: loadUraian, save: saveUraian_, status: uraianStatus } = useUraianAutosave("Pengujian Hipotesis - Intensitas");

  const refresh = useCallback(async () => {
    if (!isSignedIn) return;
    setLoading(true);
    try {
      const token = await getToken();
      const rows = await fetchUserIntensityRows(token);
      setEntries(rows.map((r) => ({ ...r, checkStatus: null })));
      setChecked(false);
    } catch (err) {
      console.error("load intensity rows error", err);
    } finally {
      setLoading(false);
    }
  }, [isSignedIn, getToken]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    loadUraian().then((f) => {
      if (f.deskripsi_data) setDeskripsi(f.deskripsi_data);
      if (f.evaluasi_hipotesis) setEvaluasi(f.evaluasi_hipotesis);
    });
  }, [loadUraian]);

  const triggerSave = (overrides: Record<string, string> = {}) => {
    saveUraian_({ deskripsi_data: deskripsi, evaluasi_hipotesis: evaluasi, ...overrides });
  };

  const total = entries.length;
  const filled = entries.filter((e) => String(e.TI).trim() !== "");
  const filledCount = filled.length;

  const handleCheck = () => {
    setEntries((prev) =>
      prev.map((e) => {
        const userVal = parseFloat(String(e.TI).replace(",", "."));
        if (!isFinite(userVal)) return { ...e, checkStatus: null };
        const expected = expectedTI(e.I);
        const ok = Math.abs(userVal - expected) <= 1.5;
        return { ...e, checkStatus: ok ? "correct" : "wrong" };
      }),
    );
    setChecked(true);
  };

  const correctCount = entries.filter((e) => e.checkStatus === "correct").length;

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-emerald-300 bg-emerald-50/60 p-3">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-emerald-800 flex items-center gap-2">
            <Database className="h-4 w-4" /> Data dari Pengumpulan Data
            {total > 0 && (
              <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">{total} baris</span>
            )}
          </p>
          <button onClick={refresh} disabled={loading} className="text-[11px] text-emerald-700 hover:underline disabled:opacity-50">
            {loading ? "Memuat..." : "Muat ulang"}
          </button>
        </div>
        <p className="text-xs text-emerald-900 mt-1">
          Cek kolom <b>TI hitung</b> — apakah nilaimu sesuai rumus TI = 10 log(I/I₀)?
        </p>

        {loading && entries.length === 0 ? (
          <div className="mt-3 rounded-lg bg-card border border-emerald-200 py-8 text-center">
            <p className="text-xs text-muted-foreground">Memuat data dari spreadsheet...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="mt-3 rounded-lg bg-card border border-emerald-200 py-8 flex flex-col items-center gap-2 text-center">
            <Database className="h-8 w-8 text-muted-foreground/60" />
            <p className="text-xs text-muted-foreground">Belum ada data.</p>
            <p className="text-xs text-muted-foreground">
              Kembali ke <b>Pengumpulan Data</b>, catat beberapa baris dan isi kolom TI hitung terlebih dahulu.
            </p>
          </div>
        ) : (
          <div className="mt-3 overflow-x-auto rounded-lg border border-emerald-200 bg-card">
            <table className="w-full text-xs">
              <thead className="bg-muted">
                <tr className="text-left">
                  <th className="p-2 font-semibold">#</th>
                  <th className="p-2 font-semibold">P (W)</th>
                  <th className="p-2 font-semibold">r (m)</th>
                  <th className="p-2 font-semibold">I (W/m²)</th>
                  <th className="p-2 font-semibold">TI hitung (dB)</th>
                  <th className="p-2 font-semibold w-8 text-center">✓</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((e, i) => {
                  const expected = expectedTI(e.I);
                  const userVal = parseFloat(String(e.TI).replace(",", "."));
                  const isCorrect = e.checkStatus === "correct";
                  const isWrong = e.checkStatus === "wrong";
                  return (
                    <tr key={`${e.no}-${i}`} className={`border-t border-border ${checked ? isCorrect ? "bg-emerald-50/70" : isWrong ? "bg-rose-50/70" : "" : ""}`}>
                      <td className="p-2">{i + 1}</td>
                      <td className="p-2">{e.P}</td>
                      <td className="p-2">{e.r}</td>
                      <td className="p-2 font-mono">{e.I >= 1e-4 ? e.I.toFixed(4) : e.I.toExponential(2)}</td>
                      <td className="p-2">
                        {checked && isWrong && isFinite(userVal) ? (
                          <div className="space-y-0.5">
                            <p className="text-rose-700 line-through">{e.TI} dB</p>
                            <p className="text-emerald-700 font-semibold">✓ {expected.toFixed(1)} dB</p>
                          </div>
                        ) : checked && isCorrect ? (
                          <p className="text-emerald-700 font-semibold">{e.TI} dB</p>
                        ) : (
                          <p>{e.TI || <span className="text-muted-foreground">—</span>}</p>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {checked && isCorrect && <Check className="h-4 w-4 text-emerald-600 inline" />}
                        {checked && isWrong && <X className="h-4 w-4 text-rose-600 inline" />}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <button
          onClick={handleCheck}
          disabled={filledCount === 0}
          className={`w-full mt-3 rounded-lg py-2.5 text-sm font-semibold transition ${filledCount === 0 ? "bg-muted text-muted-foreground cursor-not-allowed" : "bg-lkpd text-white hover:opacity-90"}`}
        >
          Cek Jawaban ({filledCount}/{total} TI terisi)
        </button>

        {checked && (
          <div className={`mt-3 rounded-lg p-3 text-xs text-center font-medium ${correctCount === total && total > 0 ? "bg-emerald-100 text-emerald-800" : correctCount === 0 ? "bg-rose-100 text-rose-800" : "bg-amber-100 text-amber-800"}`}>
            {correctCount === total && total > 0 ? "✅" : correctCount === 0 ? "❌" : "⚠️"}{" "}
            <b>{correctCount} / {total}</b> jawaban benar.
            {correctCount < total && (
              <p className="mt-1 font-normal">Nilai hijau di bawah TI kamu adalah jawaban yang benar. Periksa rumus TI = 10 log(I/I₀).</p>
            )}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border bg-card p-3">
        <p className="text-sm font-medium">Deskripsikan pola yang kamu temukan dari data:</p>
        <textarea
          value={deskripsi}
          onChange={(e) => { setDeskripsi(e.target.value); triggerSave({ deskripsi_data: e.target.value }); }}
          placeholder="contoh: Saat r dilipat dua, I turun menjadi seperempatnya. Pola ini sesuai hukum kuadrat terbalik..."
          className="w-full mt-2 rounded-lg border border-border bg-card p-2.5 text-xs min-h-24 outline-none focus:ring-2 focus:ring-lkpd/30"
        />
      </div>

      <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3">
        <p className="text-sm font-semibold text-emerald-800">Evaluasi hipotesismu:</p>
        <p className="text-xs text-emerald-900 mt-1">
          Apakah data mendukung atau menyangkal hipotesismu? Jelaskan dengan bukti spesifik.
        </p>
        <textarea
          value={evaluasi}
          onChange={(e) => { setEvaluasi(e.target.value); triggerSave({ evaluasi_hipotesis: e.target.value }); }}
          placeholder="contoh: Hipotesis saya didukung — data menunjukkan bahwa I ∝ 1/r²..."
          className="w-full mt-2 rounded-lg border border-emerald-200 bg-card p-2.5 text-xs min-h-20 outline-none focus:ring-2 focus:ring-emerald-300"
        />
      </div>
      <SaveStatus status={uraianStatus} />
    </div>
  );
};

/* ============================ Tahap 6: Kesimpulan ============================ */
export const IntensitasConclusionLKPD = () => {
  const [kesimpulan, setKesimpulan] = useState("");
  const [koneksi, setKoneksi] = useState("");
  const { load, save, status } = useUraianAutosave("Penarikan Kesimpulan - Intensitas");

  useEffect(() => {
    load().then((f) => {
      if (f.kesimpulan_ilmiah) setKesimpulan(f.kesimpulan_ilmiah);
      if (f.koneksi_aplikasi_nyata) setKoneksi(f.koneksi_aplikasi_nyata);
    });
  }, [load]);

  const triggerSave = (overrides: Record<string, string> = {}) => {
    save({ kesimpulan_ilmiah: kesimpulan, koneksi_aplikasi_nyata: koneksi, ...overrides });
  };

  return (
    <div className="space-y-3">
      <div className="rounded-xl bg-card border border-border p-3">
        <p className="text-sm font-semibold flex items-center gap-2">✓ Kesimpulan Ilmiah</p>
        <p className="text-xs text-foreground/75 mt-1">
          Rangkum temuanmu dalam satu pernyataan ilmiah tentang intensitas bunyi.
        </p>
        <textarea
          value={kesimpulan}
          onChange={(e) => { setKesimpulan(e.target.value); triggerSave({ kesimpulan_ilmiah: e.target.value }); }}
          placeholder="contoh: Intensitas bunyi I berbanding lurus dengan daya sumber P dan berbanding terbalik dengan kuadrat jarak r dari sumber, sesuai persamaan I = P/4πr². Taraf intensitas TI mengikuti skala logaritmik..."
          className="w-full mt-2 rounded-lg border border-border bg-card p-2 text-xs min-h-24 outline-none focus:ring-2 focus:ring-lkpd/30"
        />
      </div>
      <div className="rounded-xl bg-surface-soft-purple p-3">
        <p className="text-sm font-semibold flex items-center gap-2 text-lkpd">💡 Koneksi Aplikasi Nyata</p>
        <p className="text-xs text-foreground/75 mt-1">
          Pilih satu situasi/fenomena intensitas bunyi di kehidupan nyata dan jelaskan bagaimana ia menerapkan konsep intensitas bunyi yang kamu pelajari.
        </p>
        <textarea
          value={koneksi}
          onChange={(e) => { setKoneksi(e.target.value); triggerSave({ koneksi_aplikasi_nyata: e.target.value }); }}
          placeholder="contoh: Pemakaian APD pada konser adalah penerapan langsung dari batas TI 85 dB..."
          className="w-full mt-2 rounded-lg border border-border bg-card p-2 text-xs min-h-20 outline-none focus:ring-2 focus:ring-lkpd/30"
        />
      </div>
      <SaveStatus status={status} />
    </div>
  );
};

/* Map LKPD keys to components */
export const lkpdContentIntensitas: Record<string, () => JSX.Element> = {
  "intensitas-observation": IntensitasObservationLKPD,
  "intensitas-formulate-question": IntensitasFormulateQuestionLKPD,
  "intensitas-hypothesis": IntensitasHypothesisLKPD,
  "intensitas-simulator": IntensitasSimulatorLKPD,
  "intensitas-data-analysis": IntensitasDataAnalysisLKPD,
  "intensitas-conclusion": IntensitasConclusionLKPD,
};
