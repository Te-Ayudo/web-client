import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:35429',
    specPattern: 'cypress/e2e/**/*.ts',           // Busca archivos .ts
    supportFile: 'cypress/support/e2e.ts',
    browser: 'chrome',
    chromeWebSecurity: false, // Si usas CORS o tokens externos
    supportFile: 'cypress/support/e2e.ts',

    setupNodeEvents(on, config) {

    },
  },
  //projectId: "9j9yzo",
});
