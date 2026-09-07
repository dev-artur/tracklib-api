import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: [
    {
      command: "npm run dev",
      cwd: "..",
      port: 3000,
      reuseExistingServer: false,
      env: { DATABASE_URL: "postgres://postgres:devpass@localhost:5432/tracklib_test" },
    },
    {
      command: "npm run dev",
      port: 5173,
      reuseExistingServer: !process.env.CI,
    },
  ],
  use: { baseURL: "http://localhost:5173" },
});
