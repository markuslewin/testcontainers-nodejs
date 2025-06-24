import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    testTimeout: 60_000,
    setupFiles: ["./tests/setup/db-setup.ts"],
    globalSetup: ["./tests/setup/global-setup.ts"],
  },
});
