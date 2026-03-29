import { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useGitHubTree } from "../src/hooks/useGitHubTree";
import { FileTree } from "../src/components/FileTree";
import { buildCommand } from "../src/utils/buildCommand";
import { collectFilePaths } from "../src/utils/collectFilePaths";

export default function TreeScreen() {
  const { owner, repo } = useLocalSearchParams<{
    owner: string;
    repo: string;
  }>();
  const { tree, branch, isLoading, error } = useGitHubTree(owner, repo);
  const [selectedPaths, setSelectedPaths] = useState<Set<string>>(new Set());

  const handleCopy = useCallback(async () => {
    const orderedPaths = collectFilePaths(tree).filter((p) => selectedPaths.has(p));
    const command = buildCommand(owner, repo, branch, orderedPaths);
    await Clipboard.setStringAsync(command);
  }, [tree, selectedPaths, owner, repo, branch]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.error}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FileTree
        tree={tree}
        selectedPaths={selectedPaths}
        onSelectedPathsChange={setSelectedPaths}
      />
      <Pressable
        style={[
          styles.copyButton,
          selectedPaths.size === 0 && styles.copyButtonDisabled,
        ]}
        onPress={handleCopy}
        disabled={selectedPaths.size === 0}
      >
        <Text
          style={[
            styles.copyButtonText,
            selectedPaths.size === 0 && styles.copyButtonTextDisabled,
          ]}
        >
          Copy
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  error: {
    color: "red",
    fontSize: 16,
    textAlign: "center",
  },
  copyButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    alignItems: "center",
    margin: 16,
    borderRadius: 8,
  },
  copyButtonDisabled: {
    backgroundColor: "#ccc",
  },
  copyButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  copyButtonTextDisabled: {
    color: "#999",
  },
});
