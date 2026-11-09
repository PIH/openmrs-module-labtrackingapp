import { defineConfig } from 'vitest/config';

// Run in a timezone with a UTC offset and daylight saving time, so tests that only pass in UTC fail here.
process.env.TZ = 'America/New_York';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/test/js/**/*.test.js'],
    setupFiles: ['src/test/js/setup.js'],
  },
});
