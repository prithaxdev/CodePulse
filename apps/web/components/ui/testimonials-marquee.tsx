import * as React from "react"
import { cn } from "@/lib/utils"

interface TestimonialsMarqueeProps {
  className?: string
  pauseOnHover?: boolean
  reverse?: boolean
  speed?: number
  children: React.ReactNode
}

export function TestimonialsMarquee({
  className,
  pauseOnHover = true,
  reverse = false,
  speed = 40,
  children,
}: TestimonialsMarqueeProps) {
  return (
    <div
      className={cn("group flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]", className)}
      style={{ "--duration": `${speed}s` } as React.CSSProperties}
    >
      {[1, 2].map((i) => (
        <div
          key={i}
          className={cn(
            "flex min-w-full shrink-0 gap-4",
            reverse ? "animate-marquee-reverse" : "animate-marquee",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
        >
          {children}
        </div>
      ))}
    </div>
  )
}
