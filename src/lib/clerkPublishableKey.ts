// Clerk publishable key — aman dibundel ke browser (by design Clerk).
// .env di Lovable auto-generated dan tidak bisa diedit manual, jadi key
// di-set langsung di sini sebagai fallback. Untuk ganti instance Clerk,
// update nilai DEFAULT_CLERK_PUBLISHABLE_KEY di bawah.
const DEFAULT_CLERK_PUBLISHABLE_KEY =
  "pk_test_cmVsYXhpbmctcGlwZWZpc2gtMjQuY2xlcmsuYWNjb3VudHMuZGV2JA";

export const CLERK_PUBLISHABLE_KEY =
  (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined) ??
  DEFAULT_CLERK_PUBLISHABLE_KEY;
