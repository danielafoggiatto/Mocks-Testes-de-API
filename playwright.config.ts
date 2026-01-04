import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  workers: 4,
  use: {
    baseURL: 'https://reqres.in/api',
  },
});
