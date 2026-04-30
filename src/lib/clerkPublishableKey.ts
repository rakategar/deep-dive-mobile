// Publishable key is safe to expose to the browser (it's the publishable Clerk key, by design).
// Vite only injects env vars prefixed with VITE_. Add this to your .env file:
//   VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxx
export const CLERK_PUBLISHABLE_KEY =
  (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined) ?? "";
