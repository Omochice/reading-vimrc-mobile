export type NodeType = "file" | "directory";

export type TreeNode = {
  name: string;
  path: string;
  type: NodeType;
  children: TreeNode[];
};

/** Response from GET /repos/{owner}/{repo} */
export type RepoResponse = {
  default_branch: string;
};

/** Single item in the tree array from GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1 */
export type GitTreeItem = {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
};

/** Response from GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1 */
export type GitTreeResponse = {
  sha: string;
  url: string;
  tree: GitTreeItem[];
  truncated: boolean;
};
