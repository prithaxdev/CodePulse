// FastAPI algorithm engine request/response types

export type ReviewScheduleRequest = {
  snippet_id: string
  rating: number
  current_ease: number
  current_interval: number
  current_reps: number
}

export type ReviewScheduleResponse = {
  next_review: string
  interval_days: number
  ease_factor: number
  repetitions: number
}

export type SearchRequest = {
  query: string
  snippets: Array<{
    id: string
    title: string
    code: string | null
    description: string | null
    tags: string[]
  }>
}

export type SearchResult = {
  snippet_id: string
  similarity_score: number
}

export type SearchResponse = {
  results: SearchResult[]
}

export type ClusterRequest = {
  snippets: Array<{
    id: string
    title: string
    code: string | null
    description: string | null
    tags: string[]
  }>
}

export type Cluster = {
  label: string
  top_terms: string[]
  snippet_ids: string[]
}

export type ClusterResponse = {
  clusters: Cluster[]
}

export type DuplicateCheckRequest = {
  new_code: string
  existing_snippets: Array<{ id: string; code: string }>
}

export type DuplicateMatch = {
  id: string
  similarity: number
}

export type DuplicateCheckResponse = {
  is_duplicate: boolean
  matches: DuplicateMatch[]
}

export type SummarizeRequest = {
  snippets: Array<{
    id: string
    description: string | null
    notes?: string
  }>
}

export type ThreadPoint = {
  point: string
  source_snippet_id: string
}

export type SummarizeResponse = {
  thread_draft: ThreadPoint[]
}
