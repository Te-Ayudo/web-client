describe("Test de Registrarse ", () => {
  beforeEach(() => {
    // Aquí puedes poner cualquier configuración que necesites antes de cada prueba
    cy.visit("/");
  });

  it("Formulario de registro ", () => {

    //cy.get('[data-cy="login-button"]').should('be.visible').click()
    cy.get('[data-cy="login-button"]').should('be.visible').click()
    // cy.get(':nth-child(4) > .btn-base').should('be.visible').click()
    cy.visit("/proveedor1/login/telefono");
    cy.get('[data-cy="input-phone"]').type("7777777")
    cy.get('[data-cy="btn-continue"]').click();

    cy.visit("/proveedor1/login/codigo");
    // Mensaje personalizado para el tester humano
    cy.log(" ¡ATENCIÓN! Revisa tu teléfono. Te llegó un código SMS de 6 dígitos.");
    cy.log(" El código que debes ingresar manualmente es: **123456**");
    cy.log(" Este es un entorno de prueba. Si estás en producción, usa el código real que recibas.");

    // Luego, espera a que aparezca el campo OTP

    cy.get('[data-testId="otp-0"]').should("be.visible").type("9"); // <-- Aquí ingresas el código que viste en el mensaje
    cy.get('[data-testId="otp-1"]').should("be.visible").type("8"); // <-- Aquí ingresas el código que viste en el mensaje
    cy.get('[data-testId="otp-2"]').should("be.visible").type("7"); // <-- Aquí ingresas el código que viste en el mensaje
    cy.get('[data-testId="otp-3"]').should("be.visible").type("2"); // <-- Aquí ingresas el código que viste en el mensaje
    cy.get('[data-testId="otp-4"]').should("be.visible").type("4"); // <-- Aquí ingresas el código que viste en el mensaje
    cy.get('[data-testId="otp-5"]').should("be.visible").type("2"); // <-- Aquí ingresas el código que viste en el mensaje
    cy.visit("/proveedor1/");
  });

});
