export interface ParsedRepo {
  owner: string;
  repo: string;
}

/**
 * Parse a GitHub repository URL and extract the owner and repo name.
 * Returns null if the URL is not a valid GitHub repository URL.
 */
export function parseRepoUrl(url: string): ParsedRepo | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname !== "github.com") {
      return null;
    }
    const match = parsed.pathname.match(/^\/([^/]+)\/([^/]+)$/);
    if (!match) {
      return null;
    }
    return { owner: match[1], repo: match[2] };
  } catch {
    return null;
  }
}
