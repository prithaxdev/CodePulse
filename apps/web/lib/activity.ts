import type { ActivityAction } from "@/types/snippet"

export function logActivity(
  action: ActivityAction,
  entityId?: string | null,
  metadata?: Record<string, unknown>,
): void {
  fetch("/api/activity", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, entity_id: entityId ?? null, metadata: metadata ?? null }),
  }).catch(() => {})
}
