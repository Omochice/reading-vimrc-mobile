import { describe, expect, it } from "vitest";
import { parseRepoUrl } from "./parse-repo-url";

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

  it("extracts owner and repo from owner/repo shorthand", () => {
    expect(parseRepoUrl("vim-jp/reading-vimrc")).toEqual({
      owner: "vim-jp",
      repo: "reading-vimrc",
    });
  });

  it("returns null for shorthand with extra segments", () => {
    expect(parseRepoUrl("owner/repo/extra")).toBeNull();
  });

  it("returns null for a single word without slash", () => {
    expect(parseRepoUrl("owner")).toBeNull();
  });
});
