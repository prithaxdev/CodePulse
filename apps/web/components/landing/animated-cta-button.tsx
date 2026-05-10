"use client"

import { Button } from "@/components/ui/button"
import { ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface AnimatedCTAButtonProps {
  label: string
  onClick?: () => void
  className?: string
}

export function AnimatedCTAButton({ label, onClick, className }: AnimatedCTAButtonProps) {
  return (
    <Button
      onClick={onClick}
      className={cn(
        "group relative h-10 w-fit overflow-hidden rounded-full p-1 ps-4 pe-12 text-sm font-medium transition-[padding] duration-500 hover:ps-12 hover:pe-4 active:scale-[0.96]",
        className,
      )}
    >
      <span className="relative z-10">
        {label}
      </span>
      <span className="bg-background text-foreground absolute right-1 flex h-8 w-8 items-center justify-center rounded-full transition-[right,transform] duration-500 group-hover/button:right-[calc(100%-36px)] group-hover/button:rotate-45">
        <ArrowUpRight size={16} />
      </span>
    </Button>
  )
}
