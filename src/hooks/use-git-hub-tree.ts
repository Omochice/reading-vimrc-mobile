import { useEffect, useState } from "react";
import type { GitTreeResponse, RepoResponse, TreeNode } from "../types";
import { buildTree } from "../utils/build-tree";

type UseGitHubTreeResult = {
  tree: TreeNode[];
  branch: string;
  isLoading: boolean;
  error: string | null;
};

/**
 * Fetch the default branch and recursive file tree for a GitHub repository,
 * then convert the flat response into a nested `TreeNode[]`.
 */
export function useGitHubTree(
  owner: string,
  repo: string,
): UseGitHubTreeResult {
  const [tree, setTree] = useState<TreeNode[]>([]);
  const [branch, setBranch] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchTree(): Promise<void> {
      setIsLoading(true);
      setError(null);

      try {
        const repoRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
        );
        if (!repoRes.ok) {
          if (repoRes.status === 404) {
            throw new Error("Repository not found");
          }
          throw new Error(`Failed to fetch repository (${repoRes.status})`);
        }
        const repoData: RepoResponse = await repoRes.json();
        const defaultBranch = repoData.default_branch;

        const treeRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/git/trees/${defaultBranch}?recursive=1`,
        );
        if (!treeRes.ok) {
          throw new Error(`Failed to fetch file tree (${treeRes.status})`);
        }
        const treeData: GitTreeResponse = await treeRes.json();

        if (cancelled) {
          return;
        }

        setBranch(defaultBranch);
        setTree(buildTree(treeData.tree));
      } catch (err) {
        if (cancelled) {
          return;
        }
        setError(
          err instanceof Error ? err.message : "An unknown error occurred",
        );
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    fetchTree();

    return () => {
      cancelled = true;
    };
  }, [owner, repo]);

  return { tree, branch, isLoading, error };
}
