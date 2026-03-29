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
    const segments = [match[1], match[2]];
    return { owner: segments[0], repo: segments[1] };
  } catch {
    return null;
  }
}
