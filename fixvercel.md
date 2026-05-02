# Fix: Vercel 404 — TanStack Start (Lovable.dev) Deployment

## Stack yang Terpengaruh

- Framework: **TanStack Start** (via `@lovable.dev/vite-tanstack-config`)
- Deploy target: **Vercel** (static hosting)
- Builder: **Vite** + `@tanstack/react-start`
- Package manager: **pnpm**

---

## Gejala

```
404: NOT_FOUND
Code: NOT_FOUND
```

Website tidak bisa diakses sama sekali setelah deploy ke Vercel, atau halaman tampil **blank hitam** (kosong).

---

## Root Cause (3 Masalah Berlapis)

### Masalah 1 — Cloudflare Plugin Aktif Saat Build

`@lovable.dev/vite-tanstack-config` secara default mengaktifkan `@cloudflare/vite-plugin` saat `build`. Plugin ini mengubah output format menjadi **Cloudflare Workers**, bukan static files. Vercel tidak bisa serve output Cloudflare Workers.

### Masalah 2 — `vercel.json` Salah

File `vercel.json` default dari Lovable:
```json
{
  "rewrites": [
    {
      "source": "/((?!_build/|assets/|favicon.ico|robots.txt).*)",
      "destination": "/_shell.html"
    }
  ]
}
```

**Dua kesalahan:**
- Tidak ada `outputDirectory` → Vercel tidak tahu folder mana yang di-serve
- Tidak ada `buildCommand` → Vercel tidak tahu cara build

### Masalah 3 — `_shell.html` Tidak Di-generate

TanStack Start membangun dua environment:
- `dist/client/` → static assets (JS, CSS, images)
- `dist/server/` → SSR server bundle

File `_shell.html` **tidak otomatis di-generate** karena `spa: { enabled: true }` di `app.config.ts` tidak terbaca oleh `vite.config.ts` yang menggunakan wrapper Lovable. Akibatnya rewrite ke `/_shell.html` gagal (file tidak ada = 404).

### Masalah 4 — Blank Hitam (jika `_shell.html` dibuat manual tanpa SSR)

Jika `_shell.html` dibuat sebagai template HTML statis biasa (dengan `<div id="root">`), halaman akan tampil **blank hitam**. Ini karena TanStack Start menggunakan `hydrateRoot(document, ...)` yang membutuhkan **SSR-rendered HTML dengan hydration markers** — bukan HTML kosong.

---

## Solusi Lengkap

### Step 1 — Disable Cloudflare Plugin di `vite.config.ts`

```ts
// vite.config.ts
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

// cloudflare: false → output jadi static files biasa, bukan Cloudflare Workers
export default defineConfig({ cloudflare: false });
```

### Step 2 — Fix `vercel.json`

```json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist/client",
  "rewrites": [
    {
      "source": "/((?!assets/|_build/|favicon.ico|robots.txt).*)",
      "destination": "/_shell.html"
    }
  ]
}
```

> **Kenapa `dist/client`?** TanStack Start selalu output static files ke `dist/client/`, bukan `dist/`.  
> **Kenapa `/_shell.html`?** TanStack Start SPA entry point adalah `_shell.html`, bukan `index.html`.

### Step 3 — Buat Postbuild Script untuk Generate `_shell.html`

Buat file `scripts/generate-shell.mjs`:

```js
import { writeFileSync } from "node:fs";
import { join } from "node:path";

const shellPath = join(process.cwd(), "dist/client/_shell.html");

async function generateFromServer() {
  // Import server bundle yang dihasilkan TanStack Start
  const mod = await import("../dist/server/server.js");
  const handler = mod.default ?? mod;

  const req = new Request("http://localhost:3000/");

  let res;
  if (typeof handler?.fetch === "function") {
    res = await handler.fetch(req, {});
  } else if (typeof handler === "function") {
    res = await handler(req, {});
  } else {
    throw new Error("Cannot find fetch handler in server bundle");
  }

  const html = await res.text();
  if (!html.includes("<html")) throw new Error("Response is not HTML");
  return html;
}

try {
  const html = await generateFromServer();
  writeFileSync(shellPath, html, "utf-8");
  console.log("✓ Generated _shell.html via server render");
} catch (err) {
  console.error("✗ Server render failed:", err.message);
  process.exit(1);
}
```

> **Kenapa harus server render?** Karena `hydrateRoot(document, ...)` butuh SSR HTML dengan hydration markers. HTML template kosong akan menyebabkan blank hitam.

### Step 4 — Tambah `postbuild` ke `package.json`

```json
{
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "postbuild": "node scripts/generate-shell.mjs",
    // ... script lainnya
  }
}
```

`postbuild` otomatis berjalan setelah `build` selesai — termasuk di Vercel.

---

## Checklist Verifikasi

Cek build log Vercel, pastikan ada baris ini:

```
✓ Generated _shell.html via server render
```

Dan output file ada di `dist/client/`:
```
dist/client/assets/*.css
dist/client/assets/*.js
dist/client/_shell.html   ← harus ada ini
```

---

## Ringkasan File yang Diubah

| File | Perubahan |
|------|-----------|
| `vite.config.ts` | Tambah `cloudflare: false` |
| `vercel.json` | Fix `outputDirectory`, `buildCommand`, dan `destination` |
| `scripts/generate-shell.mjs` | Buat baru — generate `_shell.html` via server render |
| `package.json` | Tambah script `postbuild` |

---

## Catatan Tambahan

- Masalah ini spesifik untuk project yang dibuat dari **Lovable.dev** dengan stack TanStack Start
- Jika project menggunakan **Cloudflare Pages** bukan Vercel, tidak perlu `cloudflare: false` dan tidak perlu postbuild script — cukup deploy langsung via Wrangler
- Vercel tidak secara native mendukung TanStack Start; deployment ini menggunakan mode "static SPA" sebagai workaround
