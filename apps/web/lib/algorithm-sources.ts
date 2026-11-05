/**
 * Excerpts of the algorithm engine shown on the landing page's
 * "Built from scratch" section.
 *
 * Every non-blank line is copied verbatim from apps/api/app/algorithms
 * (docstrings and setup lines are left out; `# …` marks the cut).
 * `__tests__/algorithm-sources.test.ts` checks the excerpts, line counts,
 * test count and import claim against the Python source, so the page
 * can't drift from the code it claims to show.
 */

export interface AlgorithmSource {
  id: string
  file: string
  name: string
  purpose: string
  /** Line count of the full source file. */
  lines: number
  code: string
}

export const ALGORITHM_DIR = "apps/api/app/algorithms"

/** Test functions across apps/api/tests. */
export const API_TEST_COUNT = 230

/** Modules the algorithm files may import: the standard library plus each other. */
export const ALLOWED_IMPORTS = ["math", "random", "re", "typing", "collections"]

export const algorithmSources: AlgorithmSource[] = [
  {
    id: "sm2",
    file: "sm2.py",
    name: "SM-2 scheduling",
    purpose: "Picks the day each snippet comes back",
    lines: 60,
    code: `def sm2_schedule(
    quality: int,
    repetitions: int,
    ease_factor: float,
    interval: int,
) -> tuple[int, int, float]:
    # …
    if quality < 3:
        # Forgot — reset progress
        new_repetitions = 0
        new_interval = 1
    else:
        # Remembered — advance schedule
        new_repetitions = repetitions + 1

        if repetitions == 0:
            # Quality-adjusted first interval: Easy gets 4 days, Hard gets 2 days.
            # Standard SM-2 fixes this at 1, but that makes every first review
            # feel identical regardless of confidence — poor UX.
            new_interval = 4 if quality >= 4 else 2
        elif repetitions == 1:
            new_interval = 6
        else:
            new_interval = round(interval * ease_factor)

    # Adjust ease factor based on quality (applies regardless of pass/fail)
    new_ease_factor = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    new_ease_factor = max(1.3, round(new_ease_factor, 4))

    return new_interval, new_repetitions, new_ease_factor`,
  },
  {
    id: "tfidf",
    file: "tfidf.py",
    name: "TF-IDF",
    purpose: "Weighs the words that make a snippet distinct",
    lines: 133,
    code: `def tokenize(text: str) -> list[str]:
    tokens = re.split(r"[\\s\\W]+", text.lower())
    return [t for t in tokens if len(t) >= 3]


def compute_tf(tokens: list[str]) -> dict[str, float]:
    if not tokens:
        return {}
    counts = Counter(tokens)
    total = len(tokens)
    return {term: count / total for term, count in counts.items()}


def compute_idf(documents: list[list[str]]) -> dict[str, float]:
    total_docs = len(documents)
    if total_docs == 0:
        return {}

    doc_freq: dict[str, int] = {}
    for tokens in documents:
        for term in set(tokens):
            doc_freq[term] = doc_freq.get(term, 0) + 1

    return {
        term: math.log(total_docs / freq)
        for term, freq in doc_freq.items()
    }`,
  },
  {
    id: "similarity",
    file: "similarity.py",
    name: "Cosine similarity",
    purpose: "Ranks search results by meaning",
    lines: 59,
    code: `def cosine_similarity(vec_a: dict[str, float], vec_b: dict[str, float]) -> float:
    if not vec_a or not vec_b:
        return 0.0

    # Dot product — only iterate over the smaller vector's terms
    dot = sum(vec_a[term] * vec_b[term] for term in vec_a if term in vec_b)
    if dot == 0.0:
        return 0.0

    mag_a = math.sqrt(sum(w * w for w in vec_a.values()))
    mag_b = math.sqrt(sum(w * w for w in vec_b.values()))
    if mag_a == 0.0 or mag_b == 0.0:
        return 0.0

    return dot / (mag_a * mag_b)`,
  },
  {
    id: "clustering",
    file: "clustering.py",
    name: "k-means",
    purpose: "Groups snippets into topics",
    lines: 234,
    code: `def fit(self, vectors: list[dict[str, float]], k: int) -> list[int]:
    # …
    rng = random.Random(self._random_seed)
    seed_indices = rng.sample(range(n), k)
    self._centroids = [dict(vectors[i]) for i in seed_indices]

    for iteration in range(self._max_iterations):
        # Assignment step
        new_assignments = [
            _nearest_centroid(vec, self._centroids) for vec in vectors
        ]

        converged = new_assignments == self._assignments
        self._assignments = new_assignments
        self._iterations_run = iteration + 1

        if converged and iteration > 0:
            break

        # Update step — recalculate each centroid as mean of its members
        cluster_members: list[list[dict[str, float]]] = [[] for _ in range(k)]
        for vec, cluster_idx in zip(vectors, self._assignments):
            cluster_members[cluster_idx].append(vec)

        for cluster_idx in range(k):
            if cluster_members[cluster_idx]:
                self._centroids[cluster_idx] = _mean_vector(
                    cluster_members[cluster_idx]
                )

    return list(self._assignments)`,
  },
  {
    id: "duplicate",
    file: "duplicate.py",
    name: "Levenshtein distance",
    purpose: "Catches near-duplicates before you save",
    lines: 81,
    code: `def levenshtein_distance(str_a: str, str_b: str) -> int:
    m, n = len(str_a), len(str_b)

    # Build (m+1) × (n+1) matrix
    dp = list(range(n + 1))

    for i in range(1, m + 1):
        prev = dp[0]
        dp[0] = i
        for j in range(1, n + 1):
            temp = dp[j]
            if str_a[i - 1] == str_b[j - 1]:
                dp[j] = prev
            else:
                dp[j] = 1 + min(prev, dp[j], dp[j - 1])
            prev = temp

    return dp[n]


def similarity_ratio(str_a: str, str_b: str) -> float:
    max_len = max(len(str_a), len(str_b))
    if max_len == 0:
        return 1.0
    return 1.0 - levenshtein_distance(str_a, str_b) / max_len`,
  },
  {
    id: "summarizer",
    file: "summarizer.py",
    name: "MMR summarization",
    purpose: "Drafts a thread from a topic cluster",
    lines: 141,
    code: `def extractive_summarize(
    snippets: list[dict],
    max_points: int = 5,
    mmr_lambda: float = 0.6,
) -> list[dict]:
    # …
    for snippet in snippets:
        # …
        for sent in sentences:
            relevance = _sentence_tfidf_score(sent, idf)

            if not selected_vecs:
                # First selection — pick purely by relevance
                mmr_score = relevance
            else:
                sent_vec = _sentence_vector(sent, idf)
                max_sim = max(
                    cosine_similarity(sent_vec, sv) for sv in selected_vecs
                )
                mmr_score = mmr_lambda * relevance - (1 - mmr_lambda) * max_sim

            if mmr_score > best_mmr:
                best_mmr = mmr_score
                best_sentence = sent`,
  },
  {
    id: "graph",
    file: "graph.py",
    name: "Dependency graph",
    purpose: "Links each snippet to what it builds on",
    lines: 61,
    code: `def build_dependency_graph(
    snippets: list[dict],
    similarity_threshold: float = 0.08,
) -> list[dict]:
    # …
    sorted_snippets = sorted(snippets, key=lambda s: s.get("created_at", ""))

    documents = [_snippet_text(s) for s in sorted_snippets]

    engine = TFIDFEngine()
    engine.fit(documents)
    vectors = engine.vectorize_corpus()

    edges: list[dict] = []
    n = len(sorted_snippets)
    for i in range(n):
        for j in range(i + 1, n):
            sim = cosine_similarity(vectors[i], vectors[j])
            if sim >= similarity_threshold:
                edges.append({
                    "from_id": sorted_snippets[i]["id"],
                    "to_id": sorted_snippets[j]["id"],
                    "confidence": round(sim, 4),
                })

    return sorted(edges, key=lambda e: e["confidence"], reverse=True)`,
  },
  {
    id: "language",
    file: "language_detector.py",
    name: "Language detection",
    purpose: "Names the language as you paste",
    lines: 375,
    code: `def detect(code: str) -> dict[str, object]:
    # …
    for lang, sig in LANGUAGE_SIGNATURES.items():
        # …
        score = 0.0

        # Keyword scoring — unique hits normalised by total keywords.
        if keywords and keyword_weight > 0:
            hits = sum(1 for kw in keywords if kw in code)
            score += (hits / len(keywords)) * keyword_weight

        # Pattern scoring — unique pattern hits normalised by total patterns.
        if patterns and pattern_weight > 0:
            hits = sum(
                1 for pat in patterns if re.search(pat, code, flags)
            )
            score += (hits / len(patterns)) * pattern_weight

        scores[lang] = round(score, 4)
    # …
    best_lang = max(scores, key=lambda k: scores[k])
    best_score = scores[best_lang]

    # Normalise to [0, 1] using the theoretical max for that language.
    sig = LANGUAGE_SIGNATURES[best_lang]
    max_possible = sig["keyword_weight"] + sig["pattern_weight"]
    confidence = round(best_score / max_possible, 4) if max_possible > 0 else 0.0`,
  },
]

export const totalAlgorithmLines = algorithmSources.reduce(
  (sum, source) => sum + source.lines,
  0
)
