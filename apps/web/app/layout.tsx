import type { Metadata } from "next"
import { Geist_Mono, Inter, JetBrains_Mono, Fira_Code, IBM_Plex_Mono } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"

import "./globals.css"
import { Providers } from "@/components/providers"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "CodePulse",
  description: "Developer learning retention with spaced repetition",
}

const geistMonoHeading = Geist_Mono({ subsets: ["latin"], variable: "--font-heading" })
const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const fontMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" })
const jetbrainsMono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", weight: ["400", "500"] })
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-fira", weight: ["400", "500"] })
const ibmPlexMono = IBM_Plex_Mono({ subsets: ["latin"], variable: "--font-ibm-plex", weight: ["400", "500"] })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={cn(
          "antialiased font-sans",
          fontMono.variable,
          inter.variable,
          geistMonoHeading.variable,
          jetbrainsMono.variable,
          firaCode.variable,
          ibmPlexMono.variable,
        )}
      >
        <body>
          <Providers>
            <ThemeProvider>{children}</ThemeProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  )
}
