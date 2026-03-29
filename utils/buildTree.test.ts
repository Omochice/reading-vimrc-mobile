import { describe, it, expect } from "vitest";
import { buildTree } from "./buildTree";
import type { GitTreeItem, TreeNode } from "../types";

describe("buildTree", () => {
  it("returns a single file node for a single blob at root", () => {
    const items: Pick<GitTreeItem, "path" | "type">[] = [
      { path: "README.md", type: "blob" },
    ];

    const result: TreeNode[] = buildTree(items);

    expect(result).toEqual([
      { name: "README.md", path: "README.md", type: "file", children: [] },
    ]);
  });

  it("returns a directory with a nested file", () => {
    const items: Pick<GitTreeItem, "path" | "type">[] = [
      { path: "src", type: "tree" },
      { path: "src/main.ts", type: "blob" },
    ];

    const result = buildTree(items);

    expect(result).toEqual([
      {
        name: "src",
        path: "src",
        type: "directory",
        children: [
          { name: "main.ts", path: "src/main.ts", type: "file", children: [] },
        ],
      },
    ]);
  });

  it("sorts children alphabetically at each level", () => {
    const items: Pick<GitTreeItem, "path" | "type">[] = [
      { path: "src", type: "tree" },
      { path: "src/zebra.ts", type: "blob" },
      { path: "src/alpha.ts", type: "blob" },
      { path: "README.md", type: "blob" },
      { path: "CONTRIBUTING.md", type: "blob" },
    ];

    const result = buildTree(items);
    const rootNames = result.map((n) => n.name);
    const srcChildNames = result
      .find((n) => n.name === "src")!
      .children.map((n) => n.name);

    expect(rootNames).toEqual(["CONTRIBUTING.md", "README.md", "src"]);
    expect(srcChildNames).toEqual(["alpha.ts", "zebra.ts"]);
  });

  it("returns an empty array for empty input", () => {
    const result = buildTree([]);

    expect(result).toEqual([]);
  });
});
