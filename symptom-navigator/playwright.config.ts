import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  workers: 1,
  use: {
    baseURL: 'http://localhost:3000',
    video: {
      mode: 'on',
      size: { width: 1920, height: 1080 },
    },
  }
});