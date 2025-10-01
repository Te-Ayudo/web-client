/// <reference types="cypress" />

describe('Flujo: Agregar servicio a la canasta', () => {
    const SERVICE_ID = '65e76e85b51f383b1dbb47ae';
    const SERVICE_NAME = 'Corte Barba';
    const BRANCH_ID = '647b4b14c60ba06fe4f6abad';
    const PROVIDER_ID = '5e6b31a018048974ea17f435';

    beforeEach(() => {
        cy.clearLocalStorage();
        cy.clearCookies();
        cy.loginByToken();

        // Simular sesión iniciada con token y datos de sucursal
        cy.window().then((win) => {
            win.localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
            win.localStorage.setItem('persist:proveedor', JSON.stringify({
                selected: {
                    _id: PROVIDER_ID,
                    business_name: 'Proveedor1',
                    branch: BRANCH_ID,
                    branches: [BRANCH_ID]
                }
            }));
            win.localStorage.setItem('persist:branch', JSON.stringify({
                selected: [BRANCH_ID],
                _persist: '{"version":-1,"rehydrated":true}'
            }));
            win.localStorage.setItem('otpPhone', '76248056');
            win.localStorage.setItem('codePhone', '591');
        });

        // Mockear /api/health
        cy.intercept('GET', '/api/health', {
            statusCode: 200,
            body: { status: 'ok' }
        });

        // Visitar la página
        cy.visit(`/proveedor1/empresa/${BRANCH_ID}`);
        cy.closeSwal();

        // Seleccionar servicio (como paso previo)
        cy.get('[data-cy="btn-servicio"]')
            .first()
            .should('be.visible')
            .click();
    });

    it('Debe abrir el modal de carrito y hacer clic en "Solicitar servicio"', () => {
        cy.log('Cypress cargó correctamente el Modal de Carrito');
        cy.get('[data-cy="btn-add-cart"]').click();
        cy.log('Servicios agregados al carrito correctamente');
        cy.get('[data-cy="cart-items"]').should('be.visible');


        cy.get('[data-cy="btn-solicitar-servicio"]')

            .should('be.visible')
            .and('have.text', 'Solicitar servicio')
        //.click();
    });
});
