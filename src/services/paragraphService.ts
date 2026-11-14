/**
 * Production Paragraph Service for Cloudflare R2 Integration
 * - Fetches 100 verified original paragraphs from Cloudflare R2
 * - LocalStorage caching with version validation
 * - Offline and network failure fallbacks
 * - Avoids recent paragraph repetition in browser
 * - Supports duration-based, topic, and difficulty filtering
 */

export interface R2Paragraph {
  id: string;
  content: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  wordCount: number;
  characterCount: number;
  recommendedDuration: number;
}

export interface ParagraphLibraryPayload {
  version: number;
  totalParagraphs: number;
  generatedAt: string;
  paragraphs: R2Paragraph[];
}

const R2_PUBLIC_URL = import.meta.env.VITE_PARAGRAPHS_URL || 'https://pub-ce8f29e84ced4878b9b07ed207b0f3ef.r2.dev/typing-paragraphs-v1.json';
const CACHE_KEY = 'typing_paragraphs_cache_v1';
const RECENT_HISTORY_KEY = 'typing_recent_paragraph_ids';
const MAX_RECENT_HISTORY = 20;

// Bundled high-reliability fallback in case of initial offline startup
const BUNDLED_FALLBACKS: R2Paragraph[] = [
  {
    id: "fallback-001",
    topic: "technology",
    difficulty: "beginner",
    wordCount: 42,
    characterCount: 262,
    recommendedDuration: 60,
    content: "Modern computer keyboards use small electronic switches beneath each keycap. When you press a letter, the circuit closes and sends an electrical signal to the processor. Good posture and keeping your wrists straight helps you type faster without tiring your hands."
  },
  {
    id: "fallback-002",
    topic: "science",
    difficulty: "intermediate",
    wordCount: 52,
    characterCount: 345,
    recommendedDuration: 90,
    content: "The fundamental laws of thermodynamics govern energy transformations across all physical and chemical processes. The first law dictates that total energy in an isolated system remains constant, changing forms but never being created or destroyed. Energy naturally disperses toward disorder unless external work is applied."
  },
  {
    id: "fallback-003",
    topic: "history",
    difficulty: "intermediate",
    wordCount: 53,
    characterCount: 350,
    recommendedDuration: 90,
    content: "The historic Silk Road formed an intricate network of overland caravan routes linking Chinese imperial capitals to Mediterranean seaports. Merchants traversed harsh desert basins and mountain passes transporting silk, spices, and glassware, exchanging philosophical ideas and architectural techniques across ancient civilizations."
  }
];

class ParagraphService {
  private inMemoryLibrary: R2Paragraph[] | null = null;
  private isFetching = false;

  constructor() {
    this.initFromCache();
  }

  /**
   * Initializes library from localStorage cache if available
   */
  private initFromCache() {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed: ParagraphLibraryPayload = JSON.parse(cached);
        if (parsed.version === 1 && Array.isArray(parsed.paragraphs) && parsed.paragraphs.length > 0) {
          this.inMemoryLibrary = parsed.paragraphs;
        }
      }
    } catch {
      // Ignore cache retrieval errors
    }
  }

  /**
   * Fetches latest paragraph library from Cloudflare R2
   */
  public async loadLibrary(): Promise<R2Paragraph[]> {
    if (this.inMemoryLibrary && this.inMemoryLibrary.length >= 100) {
      return this.inMemoryLibrary;
    }

    if (this.isFetching) {
      // Return cached or fallback while already fetching
      return this.inMemoryLibrary || BUNDLED_FALLBACKS;
    }

    this.isFetching = true;
    try {
      const response = await fetch(R2_PUBLIC_URL, {
        headers: { 'Accept': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`R2 HTTP ${response.status}: ${response.statusText}`);
      }

      const payload: ParagraphLibraryPayload = await response.json();
      if (payload.version === 1 && Array.isArray(payload.paragraphs) && payload.paragraphs.length > 0) {
        this.inMemoryLibrary = payload.paragraphs;
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify(payload));
        } catch {}
        return this.inMemoryLibrary;
      }
    } catch (err) {
      console.warn('Could not fetch from Cloudflare R2, falling back to cache/bundled:', err);
      // Try local public copy fallback if bundled
      try {
        const localResp = await fetch('/typing-paragraphs-v1.json');
        if (localResp.ok) {
          const localPayload: ParagraphLibraryPayload = await localResp.json();
          if (localPayload.paragraphs?.length) {
            this.inMemoryLibrary = localPayload.paragraphs;
            return this.inMemoryLibrary;
          }
        }
      } catch {}
    } finally {
      this.isFetching = false;
    }

    return this.inMemoryLibrary || BUNDLED_FALLBACKS;
  }

  /**
   * Selects an appropriate paragraph based on duration and optional filters,
   * avoiding recently served paragraphs on this browser.
   */
  public selectParagraph(options?: {
    durationSeconds?: number;
    targetWords?: number;
    topic?: string;
    difficulty?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  }): { text: string; id: string; title: string; topic: string; wordCount: number } {
    const library = this.inMemoryLibrary && this.inMemoryLibrary.length > 0
      ? this.inMemoryLibrary
      : BUNDLED_FALLBACKS;

    let recentIds: string[] = [];
    try {
      const stored = localStorage.getItem(RECENT_HISTORY_KEY);
      if (stored) recentIds = JSON.parse(stored);
    } catch {}

    // Filter candidate pool
    let candidates = library;

    // Filter by topic if specified and not 'general'
    if (options?.topic && options.topic !== 'general') {
      const topicFiltered = candidates.filter(p => p.topic.toLowerCase() === options.topic?.toLowerCase());
      if (topicFiltered.length > 0) candidates = topicFiltered;
    }

    // Filter by difficulty if specified
    if (options?.difficulty) {
      const diffFiltered = candidates.filter(p => p.difficulty === options.difficulty);
      if (diffFiltered.length > 0) candidates = diffFiltered;
    }

    // Filter by duration / length suitability
    if (options?.durationSeconds) {
      const secs = options.durationSeconds;
      if (secs <= 30) {
        // Short: 40-70 words
        const shortCandidates = candidates.filter(p => p.wordCount <= 70);
        if (shortCandidates.length > 0) candidates = shortCandidates;
      } else if (secs <= 120) {
        // Medium: 60-110 words
        const medCandidates = candidates.filter(p => p.wordCount >= 60 && p.wordCount <= 120);
        if (medCandidates.length > 0) candidates = medCandidates;
      } else if (secs <= 180) {
        // Long: 100-160 words
        const longCandidates = candidates.filter(p => p.wordCount >= 90 && p.wordCount <= 160);
        if (longCandidates.length > 0) candidates = longCandidates;
      } else {
        // Extended: 140+ words
        const extCandidates = candidates.filter(p => p.wordCount >= 130);
        if (extCandidates.length > 0) candidates = extCandidates;
      }
    }

    // Filter out recently seen paragraphs
    const unreadCandidates = candidates.filter(p => !recentIds.includes(p.id));
    const finalPool = unreadCandidates.length > 0 ? unreadCandidates : candidates;

    // Pick random candidate
    const chosen = finalPool[Math.floor(Math.random() * finalPool.length)];

    // Record in recent history
    try {
      const nextRecent = [...recentIds.filter(id => id !== chosen.id), chosen.id];
      if (nextRecent.length > MAX_RECENT_HISTORY) nextRecent.shift();
      localStorage.setItem(RECENT_HISTORY_KEY, JSON.stringify(nextRecent));
    } catch {}

    const formattedTitle = chosen.topic.charAt(0).toUpperCase() + chosen.topic.slice(1);

    return {
      id: chosen.id,
      title: `${formattedTitle} Drill`,
      topic: chosen.topic,
      text: chosen.content,
      wordCount: chosen.wordCount,
    };
  }
}

export const paragraphService = new ParagraphService();
