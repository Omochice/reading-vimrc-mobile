import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import type { TreeNode as TreeNodeType } from "../types";
import { CheckState, TriStateCheckbox } from "./TriStateCheckbox";

const INDENT_PX = 20;

interface TreeNodeProps {
  node: TreeNodeType;
  depth: number;
  isCollapsed: boolean;
  checkState: CheckState;
  onToggleSelect: (node: TreeNodeType) => void;
  onToggleCollapse: (path: string) => void;
  renderNode: (node: TreeNodeType, depth: number) => React.ReactNode;
}

export function TreeNode({
  node,
  depth,
  isCollapsed,
  checkState,
  onToggleSelect,
  onToggleCollapse,
  renderNode,
}: TreeNodeProps) {
  const indent = { paddingLeft: depth * INDENT_PX };

  return (
    <View>
      <View style={[styles.row, indent]}>
        {node.type === "directory" ? (
          <Pressable
            style={styles.dirHeader}
            onPress={() => onToggleCollapse(node.path)}
          >
            <Text style={styles.collapseIcon}>
              {isCollapsed ? "\u25B6" : "\u25BC"}
            </Text>
            <Text style={styles.name}>{node.name}</Text>
          </Pressable>
        ) : (
          <Text style={styles.name}>{node.name}</Text>
        )}
        <TriStateCheckbox
          state={checkState}
          onPress={() => onToggleSelect(node)}
        />
      </View>
      {node.type === "directory" &&
        !isCollapsed &&
        node.children.map((child) => renderNode(child, depth + 1))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },
  dirHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  collapseIcon: {
    width: 20,
    textAlign: "center",
    fontSize: 12,
  },
  name: {
    flex: 1,
    fontSize: 14,
  },
});
