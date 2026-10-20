const fs = require('fs');
const os = require('os');
const path = require('path');
const { devices } = require('@playwright/test');
const freePort = require('./free-port');

// A free port is picked once per `playwright test` run, then memoised into an env var: Playwright
// reloads this config in every worker process, and the port must stay identical across the runner
// (which starts the dev server) and the workers (which navigate to baseURL). Workers inherit the
// env the runner set before spawning them. Per package = per process = its own port, so concurrent
// `lerna run test` never collides, and no ports are hardcoded. The dev server the webServer command
// spawns is handed the same port via `--port`.
const port = process.env.PLAYWRIGHT_DEV_PORT || (process.env.PLAYWRIGHT_DEV_PORT = String(freePort()));

// macOS 27 TCC-protects ~/Library/Application Support/Firefox, which Playwright's bundled Firefox also
// resolves as its app-data dir, so on any Mac where real Firefox has ever run, every launch hangs until
// it times out (microsoft/playwright#42768). CFFIXED_USER_HOME points CoreFoundation's home at a folder
// of our own instead. One fixed folder is shared by every run, package and worker rather than made per
// run: concurrent launches share it safely, and the folders Firefox creates inside it get macOS's
// home-folder "everyone deny delete" ACL, so per-run temp folders would pile up beyond a plain rm -rf.
// It must already exist, as CoreFoundation silently ignores a CFFIXED_USER_HOME that doesn't. `env`
// replaces the browser's environment rather than merging into it, hence the spread.
const firefoxLaunchOptions = () => {
  if (process.platform !== 'darwin') return {};
  const home = path.join(os.tmpdir(), 'playwright-firefox-home');
  fs.mkdirSync(home, { recursive: true });
  return { env: { ...process.env, CFFIXED_USER_HOME: home } };
};

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
      use: { ...devices['Desktop Firefox'], launchOptions: firefoxLaunchOptions() },
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


