import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks(.*)",
  "/api/cron/(.*)",
])

const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"])

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth()

  // Redirect logged-in users away from auth pages to dashboard
  if (userId && isAuthRoute(request)) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // Protect all non-public routes
  if (!isPublicRoute(request)) {
    await auth.protect()
  }
})

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
}
