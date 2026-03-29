/**
 * Build the `!reading_vimrc next` command string from selected file paths.
 */
export function buildCommand(
  owner: string,
  repo: string,
  branch: string,
  selectedPaths: string[],
): string {
  const urls = selectedPaths.map(
    (p) => `https://github.com/${owner}/${repo}/blob/${branch}/${p}`,
  );
  return `!reading_vimrc next ${urls.join(" ")}`;
}
