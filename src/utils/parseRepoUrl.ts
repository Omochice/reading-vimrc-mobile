export interface ParsedRepo {
  owner: string;
  repo: string;
}

/**
 * Parse a GitHub repository identifier and extract the owner and repo name.
 * Accepts either a full URL (https://github.com/owner/repo) or shorthand (owner/repo).
 * Returns null if the input does not match either format.
 */
export function parseRepoUrl(input: string): ParsedRepo | null {
  const shorthand = input.match(/^([^/]+)\/([^/]+)$/);
  if (shorthand) {
    return { owner: shorthand[1], repo: shorthand[2] };
  }

  try {
    const parsed = new URL(input);
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
