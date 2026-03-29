import { describe, expect, it } from "vitest";
import { buildCommand } from "./buildCommand";

describe("buildCommand", () => {
  it("returns command string with single file URL", () => {
    const result = buildCommand("user", "repo", "main", ["init.lua"]);
    expect(result).toBe(
      "!reading_vimrc next https://github.com/user/repo/blob/main/init.lua",
    );
  });

  it("returns command string with space-separated URLs for multiple files", () => {
    const result = buildCommand("user", "repo", "main", [
      "init.lua",
      "lua/plugins.lua",
    ]);
    expect(result).toBe(
      "!reading_vimrc next https://github.com/user/repo/blob/main/init.lua https://github.com/user/repo/blob/main/lua/plugins.lua",
    );
  });
});
