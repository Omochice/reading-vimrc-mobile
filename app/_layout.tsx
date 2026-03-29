import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "reading-vimrc" }} />
      <Stack.Screen name="tree" options={{ title: "File Tree" }} />
    </Stack>
  );
}
