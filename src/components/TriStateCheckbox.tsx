import React from "react";
import { Pressable, StyleSheet, Text } from "react-native";

export type CheckState = "unchecked" | "checked" | "indeterminate";

interface TriStateCheckboxProps {
  state: CheckState;
  onPress: () => void;
}

const SYMBOL: Record<CheckState, string> = {
  unchecked: "\u2610", // empty box
  checked: "\u2611", // box with checkmark
  indeterminate: "\u229F", // box with hyphen (squared minus)
};

/**
 * A simple tri-state checkbox rendered as a Unicode symbol.
 */
export function TriStateCheckbox({ state, onPress }: TriStateCheckboxProps) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.symbol}>{SYMBOL[state]}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 4,
  },
  symbol: {
    fontSize: 20,
  },
});
