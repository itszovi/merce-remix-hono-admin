import { defineConfig } from "vitest/config"
import tsconfigPaths from "vite-tsconfig-paths"
import { vitePlugin as remix } from "@remix-run/dev"
import devServer, { defaultOptions } from "@hono/vite-dev-server"

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true
  }
}

export default defineConfig({
  server: {
    port: 3006,
    hmr: {
      port: 3555,
    },
  },
  test: {
    reporters: ["verbose", "default"],
    coverage: {
      exclude: ["build"],
      provider: "istanbul",
      reporter: ["text", "html", "json-summary", "json", "cobertura"],
    },
  },
  plugins: [
    remix({
      serverBuildFile: "remix.js",
      future: {
        v3_singleFetch: true,
      },
    }),
    tsconfigPaths(),
    devServer({
      injectClientScript: false,
      entry: "./api/index.ts", // The file path of your server.
      exclude: [/^\/(app)\/.+/, ...defaultOptions.exclude],
    }),
  ],
})
