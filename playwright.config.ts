import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4399',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'Mobile-Small-320',
      use: { viewport: { width: 320, height: 568 } }
    },
    {
      name: 'Mobile-390',
      use: { viewport: { width: 390, height: 844 } }
    },
    {
      name: 'Tablet-768',
      use: { viewport: { width: 768, height: 1024 } }
    },
    {
      name: 'Desktop-1280',
      use: { viewport: { width: 1280, height: 800 } }
    },
    {
      name: 'Desktop-Large-1440',
      use: { viewport: { width: 1440, height: 900 } }
    }
  ],
  webServer: {
    command: 'npm run preview',
    url: 'http://127.0.0.1:4399',
    reuseExistingServer: !process.env.CI,
    timeout: 120000
  }
});
