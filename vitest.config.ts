import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      DATABASE_URL: "postgres://postgres:devpass@localhost:5432/tracklib_test",
    },
    fileParallelism: false,
  },
});