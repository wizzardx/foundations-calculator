/**
 * @file Playwright test configuration for end-to-end testing.
 * @description This file contains the configuration for running Playwright tests,
 * including settings for test directories, timeouts, retries, and browser projects.
 */

import os from "os";

import { devices, PlaywrightTestConfig } from "@playwright/test";

const config: PlaywrightTestConfig = {
  forbidOnly: process.env.CI === "true",
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
    },
  ],
  reporter: [["html"], ["list"]],
  retries: process.env.CI === "true" ? 2 : 1,
  testDir: "./e2e",
  timeout: 30000,
  use: {
    screenshot: "only-on-failure",
    trace: "on-first-retry",
    video: "on-first-retry",
  },
  workers:
    process.env.CI === "true"
      ? 1
      : Math.max(2, Math.floor(os.cpus().length / 2)),
};

export default config;
