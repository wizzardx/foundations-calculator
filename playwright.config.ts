import { PlaywrightTestConfig, devices } from "@playwright/test";
import os from "os";

const config: PlaywrightTestConfig = {
  testDir: "./e2e",
  timeout: 30000,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? 1 : Math.max(2, Math.floor(os.cpus().length / 2)),
  reporter: [["html"], ["list"]],
  use: {
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },
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
};

export default config;
