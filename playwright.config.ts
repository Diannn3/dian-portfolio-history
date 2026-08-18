import { defineConfig } from "@playwright/test"

const viewports = [
  ["mobile-375", 375, 812],
  ["mobile-430", 430, 932],
  ["tablet-768", 768, 1024],
  ["desktop-1440", 1440, 900],
  ["desktop-1920", 1920, 1080],
] as const

export default defineConfig({
  testDir: "./tests",
  testIgnore: "**/visual.spec.ts",
  timeout: 30_000,
  expect: { timeout: 7_500 },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? [["html", { open: "never" }], ["line"]] : "list",
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: viewports.map(([name, width, height]) => ({
    name,
    use: { viewport: { width, height } },
  })),
  webServer: {
    command: "npm run dev -- --host 127.0.0.1",
    url: "http://127.0.0.1:4321",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
