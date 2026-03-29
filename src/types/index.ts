export type NodeType = "file" | "directory";

export interface TreeNode {
  name: string;
  path: string;
  type: NodeType;
  children: TreeNode[];
}

/** Response from GET /repos/{owner}/{repo} */
export interface RepoResponse {
  default_branch: string;
}

/** Single item in the tree array from GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1 */
export interface GitTreeItem {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
}

/** Response from GET /repos/{owner}/{repo}/git/trees/{branch}?recursive=1 */
export interface GitTreeResponse {
  sha: string;
  url: string;
  tree: GitTreeItem[];
  truncated: boolean;
}
