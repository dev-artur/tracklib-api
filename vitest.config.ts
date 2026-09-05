import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: process.env.TEST_DATABASE_URL ?? "postgres://postgres:devpass@localhost:5432/tracklib_test",
    },
    fileParallelism: false,
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      exclude: ["src/**/*.test.ts", "src/server.ts"],
      thresholds: { lines: 80, functions: 80 },
    },
  },
});