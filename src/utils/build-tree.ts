import type { GitTreeItem, NodeType, TreeNode } from "../types";

export function buildTree(
  items: Pick<GitTreeItem, "path" | "type">[],
): TreeNode[] {
  const root: TreeNode[] = [];
  const dirs = new Map<string, TreeNode>();

  for (const item of items) {
    const nodeType: NodeType = item.type === "tree" ? "directory" : "file";
    const segments = item.path.split("/");
    const name = segments.at(-1) ?? item.path;

    const node: TreeNode = {
      name,
      path: item.path,
      type: nodeType,
      children: [],
    };

    if (nodeType === "directory") {
      dirs.set(item.path, node);
    }

    const parentPath = segments.slice(0, -1).join("/");
    const parent = dirs.get(parentPath);
    if (parent) {
      parent.children.push(node);
    } else {
      root.push(node);
    }
  }

  const sortNodes = (nodes: TreeNode[]): void => {
    nodes.sort((a, b) => a.name.localeCompare(b.name));
    for (const node of nodes) {
      sortNodes(node.children);
    }
  };
  sortNodes(root);

  return root;
}
