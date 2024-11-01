// vite.config.ts
import { defineConfig } from "file:///Users/revnandi/Documents/Repos/drizzle-remix/node_modules/.pnpm/vitest@2.1.3_@types+node@20.11.19_@vitest+ui@2.1.3/node_modules/vitest/dist/config.js";
import tsconfigPaths from "file:///Users/revnandi/Documents/Repos/drizzle-remix/node_modules/.pnpm/vite-tsconfig-paths@5.0.1_typescript@5.6.3_vite@5.4.9_@types+node@20.11.19_/node_modules/vite-tsconfig-paths/dist/index.js";
import { vitePlugin as remix } from "file:///Users/revnandi/Documents/Repos/drizzle-remix/node_modules/.pnpm/@remix-run+dev@2.13.1_@remix-run+react@2.13.1_react-dom@18.3.1_react@18.3.1__react@18.3.1_typ_kwjrn2l6qppg44acy674twwy6e/node_modules/@remix-run/dev/dist/index.js";
import devServer, { defaultOptions } from "file:///Users/revnandi/Documents/Repos/drizzle-remix/node_modules/.pnpm/@hono+vite-dev-server@0.16.0_hono@4.6.5_miniflare@3.20240129.3/node_modules/@hono/vite-dev-server/dist/index.js";
var vite_config_default = defineConfig({
  server: {
    hmr: {
      port: 3555
    }
  },
  test: {
    reporters: ["verbose", "default"],
    coverage: {
      exclude: ["build"],
      provider: "istanbul",
      reporter: ["text", "html", "json-summary", "json", "cobertura"]
    }
  },
  plugins: [
    remix({ serverBuildFile: "remix.js" }),
    tsconfigPaths(),
    devServer({
      injectClientScript: false,
      entry: "./api/index.ts",
      // The file path of your server.
      exclude: [/^\/(app)\/.+/, ...defaultOptions.exclude]
    })
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcmV2bmFuZGkvRG9jdW1lbnRzL1JlcG9zL2RyaXp6bGUtcmVtaXhcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9yZXZuYW5kaS9Eb2N1bWVudHMvUmVwb3MvZHJpenpsZS1yZW1peC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvcmV2bmFuZGkvRG9jdW1lbnRzL1JlcG9zL2RyaXp6bGUtcmVtaXgvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZXN0L2NvbmZpZ1wiXG5pbXBvcnQgdHNjb25maWdQYXRocyBmcm9tIFwidml0ZS10c2NvbmZpZy1wYXRoc1wiXG5pbXBvcnQgeyB2aXRlUGx1Z2luIGFzIHJlbWl4IH0gZnJvbSBcIkByZW1peC1ydW4vZGV2XCJcbmltcG9ydCBkZXZTZXJ2ZXIsIHsgZGVmYXVsdE9wdGlvbnMgfSBmcm9tIFwiQGhvbm8vdml0ZS1kZXYtc2VydmVyXCJcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgc2VydmVyOiB7XG4gICAgaG1yOiB7XG4gICAgICBwb3J0OiAzNTU1LFxuICAgIH0sXG4gIH0sXG4gIHRlc3Q6IHtcbiAgICByZXBvcnRlcnM6IFtcInZlcmJvc2VcIiwgXCJkZWZhdWx0XCJdLFxuICAgIGNvdmVyYWdlOiB7XG4gICAgICBleGNsdWRlOiBbXCJidWlsZFwiXSxcbiAgICAgIHByb3ZpZGVyOiBcImlzdGFuYnVsXCIsXG4gICAgICByZXBvcnRlcjogW1widGV4dFwiLCBcImh0bWxcIiwgXCJqc29uLXN1bW1hcnlcIiwgXCJqc29uXCIsIFwiY29iZXJ0dXJhXCJdLFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICByZW1peCh7IHNlcnZlckJ1aWxkRmlsZTogXCJyZW1peC5qc1wiIH0pLFxuICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgICBkZXZTZXJ2ZXIoe1xuICAgICAgaW5qZWN0Q2xpZW50U2NyaXB0OiBmYWxzZSxcbiAgICAgIGVudHJ5OiBcIi4vYXBpL2luZGV4LnRzXCIsIC8vIFRoZSBmaWxlIHBhdGggb2YgeW91ciBzZXJ2ZXIuXG4gICAgICBleGNsdWRlOiBbL15cXC8oYXBwKVxcLy4rLywgLi4uZGVmYXVsdE9wdGlvbnMuZXhjbHVkZV0sXG4gICAgfSksXG4gIF0sXG59KVxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUF5VCxTQUFTLG9CQUFvQjtBQUN0VixPQUFPLG1CQUFtQjtBQUMxQixTQUFTLGNBQWMsYUFBYTtBQUNwQyxPQUFPLGFBQWEsc0JBQXNCO0FBRTFDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFFBQVE7QUFBQSxJQUNOLEtBQUs7QUFBQSxNQUNILE1BQU07QUFBQSxJQUNSO0FBQUEsRUFDRjtBQUFBLEVBQ0EsTUFBTTtBQUFBLElBQ0osV0FBVyxDQUFDLFdBQVcsU0FBUztBQUFBLElBQ2hDLFVBQVU7QUFBQSxNQUNSLFNBQVMsQ0FBQyxPQUFPO0FBQUEsTUFDakIsVUFBVTtBQUFBLE1BQ1YsVUFBVSxDQUFDLFFBQVEsUUFBUSxnQkFBZ0IsUUFBUSxXQUFXO0FBQUEsSUFDaEU7QUFBQSxFQUNGO0FBQUEsRUFDQSxTQUFTO0FBQUEsSUFDUCxNQUFNLEVBQUUsaUJBQWlCLFdBQVcsQ0FBQztBQUFBLElBQ3JDLGNBQWM7QUFBQSxJQUNkLFVBQVU7QUFBQSxNQUNSLG9CQUFvQjtBQUFBLE1BQ3BCLE9BQU87QUFBQTtBQUFBLE1BQ1AsU0FBUyxDQUFDLGdCQUFnQixHQUFHLGVBQWUsT0FBTztBQUFBLElBQ3JELENBQUM7QUFBQSxFQUNIO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
