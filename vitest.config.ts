import { doctest } from "vite-plugin-doctest";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["src/**/*.test.ts", "src/**/*.test.ts"],
    includeSource: [
      "./src/**/*.[jt]s?(x)",
      "./**/*.md", // You can disable markdown test by removing this line
    ],
    exclude: ["e2e/**", "node_modules/**"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html", "lcov"],
      include: ["src/functions.ts"],
      exclude: ["src/utils/assertUnreachable.ts"],
      all: true,
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
      reportsDirectory: "./coverage",
    },
  },
  plugins: [doctest()],
});
