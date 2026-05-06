import type { Database } from "./database"

export type Snippet = Database["public"]["Tables"]["snippets"]["Row"]
export type SnippetInsert = Database["public"]["Tables"]["snippets"]["Insert"]
export type SnippetUpdate = Database["public"]["Tables"]["snippets"]["Update"]

export type ReviewLog = Database["public"]["Tables"]["review_logs"]["Row"]
export type ReviewLogInsert = Database["public"]["Tables"]["review_logs"]["Insert"]

export type User = Database["public"]["Tables"]["users"]["Row"]
export type UserInsert = Database["public"]["Tables"]["users"]["Insert"]

export type ActivityLog = Database["public"]["Tables"]["activity_logs"]["Row"]
export type ActivityLogInsert = Database["public"]["Tables"]["activity_logs"]["Insert"]

export type ActivityAction =
  | "snippet_created"
  | "snippet_edited"
  | "snippet_deleted"
  | "review_rated"
  | "review_session_completed"
