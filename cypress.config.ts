import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "9j9yzo",
  e2e: {
    //baseUrl: "https://testreservas.teayudo.com.bo/proveedor1",
    baseUrl: process.env.CYPRESS_BASE_URL || "http://localhost:35429",
    supportFile: "cypress/support/e2e.ts",
    chromeWebSecurity: false,

    setupNodeEvents(on, config) { },
  },
});
