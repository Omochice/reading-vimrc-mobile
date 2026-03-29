import { useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { parseRepoUrl } from "../src/utils/parse-repo-url";

export default function Index() {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = () => {
    const result = parseRepoUrl(url);
    if (result === null) {
      setError("Invalid input. Expected: https://github.com/{owner}/{repo} or {owner}/{repo}");
      return;
    }
    setError("");
    router.push({
      pathname: "/tree",
      params: { owner: result.owner, repo: result.repo },
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>reading-vimrc-android</Text>

      <TextInput
        style={styles.input}
        placeholder="owner/repo"
        value={url}
        onChangeText={(text) => {
          setUrl(text);
          setError("");
        }}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="url"
      />

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Open Repository</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  error: {
    color: "red",
    fontSize: 14,
    marginBottom: 8,
    alignSelf: "flex-start",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
