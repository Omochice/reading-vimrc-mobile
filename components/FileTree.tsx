import React, { useMemo, useState } from "react";
import { ScrollView } from "react-native";
import type { TreeNode as TreeNodeType } from "../types";
import type { CheckState } from "./TriStateCheckbox";
import { TreeNode } from "./TreeNode";

interface FileTreeProps {
  tree: TreeNodeType[];
  selectedPaths: Set<string>;
  onSelectedPathsChange: (paths: Set<string>) => void;
}

function collectFilePaths(node: TreeNodeType): string[] {
  if (node.type === "file") return [node.path];
  return node.children.flatMap(collectFilePaths);
}

function collectDirPaths(nodes: TreeNodeType[]): string[] {
  const paths: string[] = [];
  for (const node of nodes) {
    if (node.type === "directory") {
      paths.push(node.path);
      paths.push(...collectDirPaths(node.children));
    }
  }
  return paths;
}

function getCheckState(
  node: TreeNodeType,
  selectedPaths: Set<string>,
): CheckState {
  if (node.type === "file") {
    return selectedPaths.has(node.path) ? "checked" : "unchecked";
  }
  const descendants = collectFilePaths(node);
  if (descendants.length === 0) return "unchecked";
  const selectedCount = descendants.filter((p) => selectedPaths.has(p)).length;
  if (selectedCount === 0) return "unchecked";
  if (selectedCount === descendants.length) return "checked";
  return "indeterminate";
}

/**
 * Top-level file tree component managing selection and collapse state.
 * All directories are collapsed by default.
 */
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

  function handleToggleSelect(node: TreeNodeType) {
    const next = new Set(selectedPaths);
    if (node.type === "file") {
      if (next.has(node.path)) {
        next.delete(node.path);
      } else {
        next.add(node.path);
      }
    } else {
      const descendants = collectFilePaths(node);
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
        checkState={getCheckState(node, selectedPaths)}
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
