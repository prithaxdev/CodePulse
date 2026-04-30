"use client"

import { HugeiconsIcon } from "@hugeicons/react"
import { ColorsIcon, TextFontIcon } from "@hugeicons/core-free-icons"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EDITOR_THEMES, EDITOR_FONTS, type EditorTheme, type EditorFont } from "@/lib/editor-prefs"

interface EditorToolbarProps {
  theme: EditorTheme
  font: EditorFont
  onThemeChange: (theme: EditorTheme) => void
  onFontChange: (font: EditorFont) => void
}

export function EditorToolbar({ theme, font, onThemeChange, onFontChange }: EditorToolbarProps) {
  return (
    <div className="flex items-center gap-0.5 border-b border-border/50 bg-muted/20 px-2.5 py-1.5">
      {/* Theme picker */}
      <div className="flex items-center gap-1">
        <HugeiconsIcon
          icon={ColorsIcon}
          size={12}
          strokeWidth={2}
          className="shrink-0 text-muted-foreground/50"
        />
        <Select value={theme} onValueChange={(v) => onThemeChange(v as EditorTheme)}>
          <SelectTrigger className="h-6 gap-1 rounded-lg border-0 bg-transparent px-1.5 text-[11px] font-medium text-muted-foreground shadow-none ring-0 hover:bg-muted/60 hover:text-foreground data-[size=sm]:h-6">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {EDITOR_THEMES.map((t) => (
                <SelectItem key={t.value} value={t.value} className="text-xs">
                  {t.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {/* Divider */}
      <div className="mx-1 h-3 w-px shrink-0 bg-border" />

      {/* Font picker */}
      <div className="flex items-center gap-1">
        <HugeiconsIcon
          icon={TextFontIcon}
          size={12}
          strokeWidth={2}
          className="shrink-0 text-muted-foreground/50"
        />
        <Select value={font} onValueChange={(v) => onFontChange(v as EditorFont)}>
          <SelectTrigger className="h-6 gap-1 rounded-lg border-0 bg-transparent px-1.5 text-[11px] font-medium text-muted-foreground shadow-none ring-0 hover:bg-muted/60 hover:text-foreground data-[size=sm]:h-6">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {EDITOR_FONTS.map((f) => (
                <SelectItem key={f.value} value={f.value} className="text-xs">
                  {f.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
