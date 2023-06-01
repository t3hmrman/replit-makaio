/** @type {import('@playwright/test').PlaywrightTestConfig} */
const config = {
  testDir: "test",
  testMatch: /(.+\.)?(e2e)\.[jt]s/,
};

export default config;
