export type ParsedRepo = {
  owner: string;
  repo: string;
};

/**
 * Parse a GitHub repository identifier and extract the owner and repo name.
 * Accepts either a full URL (https://github.com/owner/repo) or shorthand (owner/repo).
 * Returns null if the input does not match either format.
 */
export function parseRepoUrl(input: string): ParsedRepo | null {
  const shorthand = input.match(/^(?<owner>[^/]+)\/(?<repo>[^/]+)$/);
  if (
    shorthand?.groups?.owner !== undefined &&
    shorthand.groups.repo !== undefined
  ) {
    return { owner: shorthand.groups.owner, repo: shorthand.groups.repo };
  }

  try {
    const parsed = new URL(input);
    if (parsed.hostname !== "github.com") {
      return null;
    }
    const match = parsed.pathname.match(/^\/(?<owner>[^/]+)\/(?<repo>[^/]+)$/);
    if (match?.groups?.owner === undefined || match.groups.repo === undefined) {
      return null;
    }
    return { owner: match.groups.owner, repo: match.groups.repo };
  } catch {
    return null;
  }
}
