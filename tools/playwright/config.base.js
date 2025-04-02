const { devices } = require('@playwright/test');

module.exports = {
  testDir: './__tests__/playwright',
  fullyParallel: true,
  //forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'line',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL: 'http://localhost:8081',
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
    command: 'webpack-dev-server --config tools/playwright.webpack.config.js --hot --no-open',
    url: 'http://localhost:8081',
    reuseExistingServer: !process.env.CI,
  },
};


