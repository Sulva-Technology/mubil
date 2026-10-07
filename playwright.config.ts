import { defineConfig, devices } from "@playwright/test";

/**
 * End-to-end tests. Start the app first (`npm run dev` or `npm run build && npm start`),
 * then: `npm run test:e2e`. Set E2E_BASE_URL to test another URL.
 */
export default defineConfig({
  testDir: "tests/e2e",
  timeout: 90_000,
  fullyParallel: false,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 900 } } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
});
