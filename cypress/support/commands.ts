/// <reference types="cypress" />
declare namespace Cypress {
    interface Chainable {
        loginByToken(): Chainable<void>;
        loginIfNeeded(): Chainable<void>;
        closeSwal(title?: string | null): Chainable<void>;
    }
}
Cypress.Commands.add('loginByToken', () => {
    // ⚠️ Usa el token que copiaste manualmente
    const fakeToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2OGJmMGY5ZjBhMzM4NjA4ZWQ1NGIzYjIiLCJleHAiOjE3ODk3MDE0MzUsInJvbGUiOiJjbGllbnRlIiwiZnVsbE5hbWUiOiJNQVJWSU4gUklWQVMiLCJwaG9uZSI6Ijc2MjQ4MDU2IiwiY29kZVBob25lIjoiNTkxIiwiaWF0IjoxNzU4MTY1NDM0fQ.DwNefRKQXKW2s3djn5rXtKM8sY9j1H6POO7blV3phrk";

    // Guarda el token en localStorage (como lo haría tu app)
    window.localStorage.setItem('authToken', fakeToken);

    // Opcional: guarda también el usuario si lo necesitas
    const fakeUser = {
        first_name: "MARVIN",
        last_name: "RIVAS",
        phone: "76248056",
        codePhone: "591",
        role: "proveedor", // Aunque sea cliente, tu app te permite entrar
        // _id: "68bf0f9f0a338608ed54b3b2"
        _id: "647b4b14c60ba06fe4f6abad"
    };

    window.localStorage.setItem('user', JSON.stringify(fakeUser));
});

///
// cypress/support/commands.js

const SERVICE_ID = '65e76e85b51f383b1dbb47ae';
const BRANCH_ID = '647b4b14c60ba06fe4f6abad';
const PROVIDER_ID = '5e6b31a018048974ea17f435';

const EMPLOYEES_MOCK = {
    data: [
        {
            _id: '6723f96cc95d26dc914b0f51',
            first_name: 'Luis',
            last_name: 'Janco',
            email: 'janco7249@gmail.com',
            availableServices: [SERVICE_ID],
            branch: { _id: BRANCH_ID, name: 'Sucursal Las Palmas' },
            availability: [
                { day: 'L', startHour: 8, endHour: 12 },
                { day: 'M', startHour: 14, endHour: 18 },
                { day: 'MM', startHour: 8, endHour: 12 },
                { day: 'J', startHour: 8, endHour: 18 },
                { day: 'V', startHour: 8, endHour: 19 },
                { day: 'D', startHour: 8, endHour: 22 }
            ],
            busy: []
        },
        {
            _id: '6749cb2961f9cd0d3d4790ff',
            first_name: 'Ilse',
            last_name: 'Romero',
            email: 'ilse0@gmail.com',
            availableServices: [SERVICE_ID],
            branch: { _id: BRANCH_ID, name: 'Sucursal Las Palmas' },
            availability: [
                { day: 'L', startHour: 8, endHour: 12 },
                { day: 'M', startHour: 14, endHour: 18 },
                { day: 'MM', startHour: 8, endHour: 12 },
                { day: 'J', startHour: 8, endHour: 18 },
                { day: 'V', startHour: 8, endHour: 19 },
                { day: 'D', startHour: 8, endHour: 22 }
            ],
            busy: []
        }
    ]
};

Cypress.Commands.add('loginIfNeeded', () => {
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.window().then((win) => {
        // Si ya hay token, saltar login
        if (win.localStorage.getItem('authToken')) {
            cy.log('✅ Token encontrado. Saltando login...');
            cy.visit('/proveedor1/');
            return;
        }

        // Simular datos de sesión
        win.localStorage.setItem('authToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
        win.localStorage.setItem('persist:proveedor', JSON.stringify({
            selected: {
                _id: PROVIDER_ID,
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

        // Bloquear SweetAlert2
        if (win.Swal && typeof win.Swal.fire === 'function') {
            cy.stub(win.Swal, 'fire').as('swalFire');
        }
        cy.stub(win, 'isOnline').returns(true);
    });

    // Mockear empleados
    cy.intercept(
        'GET',
        `/api/employee/provider/${PROVIDER_ID}?method=En+sucursal&page=1&perPage=25&sort=-id&state=true&serviceCart.0=${SERVICE_ID}`,
        {
            statusCode: 200,
            body: EMPLOYEES_MOCK
        }
    );

    // Mockear /api/health
    cy.intercept('GET', '/api/health', { statusCode: 200, body: { status: 'ok' } });

    // Ir a la página de empresa
    cy.visit('/proveedor1/empresa/' + BRANCH_ID);
});

// swal2 alert quitar
Cypress.Commands.add('closeSwal', (title = null) => {
    cy.get('.swal2-popup').should('be.visible').then($popup => {
        if (title) {
            cy.wrap($popup).contains(title);
        }
        cy.wrap($popup).find('.swal2-confirm').click();
    });
});
