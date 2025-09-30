import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "9j9yzo",
  e2e: {
    baseUrl: process.env.CYPRESS_BASE_URL,
    supportFile: "cypress/support/e2e.ts",
    chromeWebSecurity: false,

    setupNodeEvents(on, config) {},
  },
});
