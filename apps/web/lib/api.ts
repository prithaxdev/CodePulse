import type {
  ReviewScheduleRequest,
  ReviewScheduleResponse,
  SearchRequest,
  SearchResponse,
  ClusterRequest,
  ClusterResponse,
  DuplicateCheckRequest,
  DuplicateCheckResponse,
  SummarizeRequest,
  SummarizeResponse,
} from "@/types/api"

const BASE_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000").replace(/\/$/, "")

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  })
  if (!res.ok) {
    const text = await res.text().catch(() => "")
    throw new Error(`API ${res.status}: ${text || res.statusText}`)
  }
  return res.json() as Promise<T>
}

export const api = {
  health: () => request<{ status: string; version: string }>("/api/health"),

  review: {
    schedule: (body: ReviewScheduleRequest) =>
      request<ReviewScheduleResponse>("/api/review/schedule", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },

  search: {
    query: (body: SearchRequest) =>
      request<SearchResponse>("/api/search", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },

  clusters: {
    get: (body: ClusterRequest) =>
      request<ClusterResponse>("/api/clusters", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },

  duplicate: {
    check: (body: DuplicateCheckRequest) =>
      request<DuplicateCheckResponse>("/api/snippets/check-duplicate", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },

  summarize: {
    generate: (body: SummarizeRequest) =>
      request<SummarizeResponse>("/api/summarize", {
        method: "POST",
        body: JSON.stringify(body),
      }),
  },
}
