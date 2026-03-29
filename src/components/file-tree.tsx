import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import type { TreeNode as TreeNodeType } from "../types";
import type { CheckState } from "./tri-state-checkbox";
import { TreeNode } from "./tree-node";

interface FileTreeProps {
  tree: TreeNodeType[];
  selectedPaths: Set<string>;
  onSelectedPathsChange: (paths: Set<string>) => void;
}

function collectDirPaths(nodes: TreeNodeType[], result: string[] = []): string[] {
  for (const node of nodes) {
    if (node.type === "directory") {
      result.push(node.path);
      collectDirPaths(node.children, result);
    }
  }
  return result;
}

export function FileTree({
  tree,
  selectedPaths,
  onSelectedPathsChange,
}: FileTreeProps) {
  const initialCollapsed = useMemo(
    () => new Set(collectDirPaths(tree)),
    [tree],
  );
  const [collapsedPaths, setCollapsedPaths] =
    useState<Set<string>>(initialCollapsed);

  // Precompute descendant file paths per directory to avoid O(n²) per render
  const descendantMap = useMemo(() => {
    const map = new Map<string, string[]>();
    function walk(node: TreeNodeType): string[] {
      if (node.type === "file") return [node.path];
      const paths = node.children.flatMap(walk);
      map.set(node.path, paths);
      return paths;
    }
    for (const node of tree) walk(node);
    return map;
  }, [tree]);

  function getCheckState(node: TreeNodeType): CheckState {
    if (node.type === "file") {
      return selectedPaths.has(node.path) ? "checked" : "unchecked";
    }
    const descendants = descendantMap.get(node.path) ?? [];
    if (descendants.length === 0) return "unchecked";
    const selectedCount = descendants.filter((p) => selectedPaths.has(p)).length;
    if (selectedCount === 0) return "unchecked";
    if (selectedCount === descendants.length) return "checked";
    return "indeterminate";
  }

  function handleToggleSelect(node: TreeNodeType) {
    const next = new Set(selectedPaths);
    if (node.type === "file") {
      if (next.has(node.path)) {
        next.delete(node.path);
      } else {
        next.add(node.path);
      }
    } else {
      const descendants = descendantMap.get(node.path) ?? [];
      const allSelected = descendants.every((p) => next.has(p));
      if (allSelected) {
        for (const p of descendants) next.delete(p);
      } else {
        for (const p of descendants) next.add(p);
      }
    }
    onSelectedPathsChange(next);
  }

  function handleToggleCollapse(path: string) {
    setCollapsedPaths((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  }

  function renderNode(node: TreeNodeType, depth: number): React.ReactNode {
    return (
      <TreeNode
        key={node.path}
        node={node}
        depth={depth}
        isCollapsed={collapsedPaths.has(node.path)}
        checkState={getCheckState(node)}
        onToggleSelect={handleToggleSelect}
        onToggleCollapse={handleToggleCollapse}
        renderNode={renderNode}
      />
    );
  }

  return (
    <ScrollView>{tree.map((node) => renderNode(node, 0))}</ScrollView>
  );
}
