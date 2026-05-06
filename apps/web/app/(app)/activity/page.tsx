"use client"

import { ActivityFeed } from "@/components/activity-feed"

export default function ActivityPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6 lg:p-8">
      <div>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Activity</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Every snippet and review action, in order.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card px-5 py-4">
        <ActivityFeed limit={50} />
      </div>
    </div>
  )
}
