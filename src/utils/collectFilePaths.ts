import type { TreeNode } from "../types";

/**
 * Collect all file paths from a tree in DFS order.
 * Accepts a single node or an array of root nodes.
 */
export function collectFilePaths(
  nodes: TreeNode | TreeNode[],
  result: string[] = [],
): string[] {
  const items = Array.isArray(nodes) ? nodes : [nodes];
  for (const node of items) {
    if (node.type === "file") {
      result.push(node.path);
    } else {
      collectFilePaths(node.children, result);
    }
  }
  return result;
}
