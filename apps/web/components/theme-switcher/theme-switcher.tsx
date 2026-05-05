"use client"

import { useId, useSyncExternalStore } from "react"
import { motion } from "motion/react"
import { useTheme } from "next-themes"
import { HugeiconsIcon } from "@hugeicons/react"
import type { IconSvgElement } from "@hugeicons/react"
import { Sun01Icon, Moon02Icon, LaptopIcon } from "@hugeicons/core-free-icons"

import { cn } from "@/lib/utils"

const THEME_OPTIONS: { icon: IconSvgElement; value: string; label: string }[] =
  [
    { icon: LaptopIcon, value: "system", label: "System theme" },
    { icon: Sun01Icon, value: "light", label: "Light theme" },
    { icon: Moon02Icon, value: "dark", label: "Dark theme" },
  ]

function ThemeOption({
  icon,
  value,
  label,
  isActive,
  layoutId,
  onClick,
}: {
  icon: IconSvgElement
  value: string
  label: string
  isActive: boolean
  layoutId: string
  onClick: (value: string) => void
}) {
  return (
    <button
      className={cn(
        "relative flex size-8 cursor-pointer items-center justify-center rounded-full transition-[color]",
        isActive
          ? "text-zinc-950 dark:text-zinc-50"
          : "text-zinc-400 hover:text-zinc-950 dark:text-zinc-500 dark:hover:text-zinc-50"
      )}
      role="radio"
      aria-checked={isActive}
      aria-label={label}
      onClick={() => onClick(value)}
    >
      <HugeiconsIcon
        icon={icon}
        size={14}
        strokeWidth={isActive ? 1.75 : 1.5}
      />

      {isActive && (
        <motion.div
          layoutId={layoutId}
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          className="absolute inset-0 rounded-full border border-zinc-200 dark:border-zinc-700"
        />
      )}
    </button>
  )
}

function ThemeSwitcher() {
  const id = useId()
  const { theme, setTheme } = useTheme()

  const isMounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )

  if (!isMounted) {
    return <div className="h-8 w-24" />
  }

  return (
    <motion.div
      key={String(isMounted)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="inline-flex items-center overflow-hidden rounded-full bg-white ring-1 ring-zinc-200 ring-inset dark:bg-zinc-950 dark:ring-zinc-700"
      role="radiogroup"
      aria-label="Theme"
    >
      {THEME_OPTIONS.map((option) => (
        <ThemeOption
          key={option.value}
          icon={option.icon}
          value={option.value}
          label={option.label}
          isActive={theme === option.value}
          layoutId={`theme-option-${id}`}
          onClick={setTheme}
        />
      ))}
    </motion.div>
  )
}

export { ThemeSwitcher }
