import { describe, it, expect } from "vitest";
import { parseRepoUrl } from "./parseRepoUrl";

describe("parseRepoUrl", () => {
  it("extracts owner and repo from a valid GitHub URL", () => {
    const result = parseRepoUrl("https://github.com/owner/repo");
    expect(result).toEqual({ owner: "owner", repo: "repo" });
  });

  it("returns null for a non-GitHub URL", () => {
    expect(parseRepoUrl("https://gitlab.com/owner/repo")).toBeNull();
  });

  it("returns null when repo is missing", () => {
    expect(parseRepoUrl("https://github.com/owner")).toBeNull();
  });

  it("returns null for a trailing slash only path", () => {
    expect(parseRepoUrl("https://github.com/owner/repo/")).toBeNull();
  });

  it("returns null for extra path segments", () => {
    expect(parseRepoUrl("https://github.com/owner/repo/tree/main")).toBeNull();
  });
});
