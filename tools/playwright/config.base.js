const { devices } = require('@playwright/test');
const freePort = require('./free-port');

// A free port is picked once per `playwright test` run, then memoised into an env var: Playwright
// reloads this config in every worker process, and the port must stay identical across the runner
// (which starts the dev server) and the workers (which navigate to baseURL). Workers inherit the
// env the runner set before spawning them. Per package = per process = its own port, so concurrent
// `lerna run test` never collides, and no ports are hardcoded. The dev server the webServer command
// spawns is handed the same port via `--port`.
const port = process.env.PLAYWRIGHT_DEV_PORT || (process.env.PLAYWRIGHT_DEV_PORT = String(freePort()));

module.exports = {
  testDir: './__tests__/playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'line',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: `http://localhost:${port}`,
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      grep: /@desktop|@all|@reduced/,
    },
  
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
      grep: /@desktop|@all/,
    },
    {
      name: 'webkit',
      userAgent: 'Safari',
      use: { ...devices['Desktop Safari'] },
      grep: /@desktop|@all/,
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
      grep: /@mobile|@all/,
    },
    {
      name: 'Mobile Safari',
      userAgent: 'Safari',
      use: { ...devices['iPhone 13'] },
      grep: /@mobile|@all/,
    },
  ],
  webServer: {
    command: `rspack serve --config tools/rspack.config.js --port ${port}`,
    url: `http://localhost:${port}`,
    reuseExistingServer: !process.env.CI,
  },
};


