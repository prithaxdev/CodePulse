import { redirect } from "next/navigation"

// proxy.ts (middleware) handles redirecting authenticated users to /dashboard.
// Unauthenticated users land here → send to sign-in.
export default function RootPage() {
  redirect("/sign-in")
}
