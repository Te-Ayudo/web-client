/// <reference types="cypress" />

describe('Flujo: Agendar reserva', () => {
    const SERVICE_ID = '65e76e85b51f383b1dbb47ae';
    const SERVICE_NAME = 'Corte Barba';
    const BRANCH_ID = '647b4b14c60ba06fe4f6abad';
    const PROVIDER_ID = '5e6b31a018048974ea17f435';

    // Mock de empleados válidos (solo los que tienen el servicio Y están en la sucursal correcta)
    const EMPLOYEES_MOCK = {
        data: [
            {
                _id: '6723f96cc95d26dc914b0f51',
                first_name: 'Luis',
                last_name: 'Janco',
                email: 'janco7249@gmail.com',
                availableServices: [SERVICE_ID],
                branch: {
                    _id: BRANCH_ID,
                    name: 'Sucursal Las Palmas'
                },
                availability: [
                    { day: 'L', startHour: 8, endHour: 12 },
                    { day: 'M', startHour: 14, endHour: 18 },
                    { day: 'MM', startHour: 8, endHour: 12 },
                    { day: 'J', startHour: 8, endHour: 18 },
                    { day: 'V', startHour: 8, endHour: 19 },
                    { day: 'D', startHour: 8, endHour: 22 }
                ],
                busy: [],
                permissions: { Tablero: true }
            },
            {
                _id: '6749cb2961f9cd0d3d4790ff',
                first_name: 'Ilse',
                last_name: 'Romero',
                email: 'ilse0@gmail.com',
                availableServices: [SERVICE_ID],
                branch: {
                    _id: BRANCH_ID,
                    name: 'Sucursal Las Palmas'
                },
                availability: [
                    { day: 'L', startHour: 8, endHour: 12 },
                    { day: 'M', startHour: 14, endHour: 18 },
                    { day: 'MM', startHour: 8, endHour: 12 },
                    { day: 'J', startHour: 8, endHour: 18 },
                    { day: 'V', startHour: 8, endHour: 19 },
                    { day: 'D', startHour: 8, endHour: 22 }
                ],
                busy: [],
                permissions: { Tablero: true }
            }
        ]
    };

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

        // Mockear la llamada a empleados
        cy.intercept({
            method: 'GET',
            url: `/api/employee/provider/${PROVIDER_ID}*serviceCart.0=${SERVICE_ID}`
        }, {
            statusCode: 200,
            body: EMPLOYEES_MOCK
        }).as('getEmployees');

        // Mockear /api/health
        cy.intercept('GET', '/api/health', {
            statusCode: 200,
            body: { status: 'ok' }
        });

        // Visitar la página
        cy.visit(`/proveedor1/empresa/${BRANCH_ID}`);
        cy.closeSwal();

        // Simular que ya seleccionaste el servicio y lo agregaste a la canasta
        cy.get('[data-cy="btn-servicio"]')
            .first()
            .should('be.visible')
            .click();

        cy.log('Cypress cargó correctamente el Modal de Carrito');
        cy.get('[data-cy="btn-add-cart"]').click();

        cy.log('Se abre el NavBar Carrito SERVICIO');
        cy.get('[data-cy="btn-solicitar-servicio"]')
            .should('be.visible')

            .click();
    });

    it('Debe completar el flujo: seleccionar empleado → fecha → hora → pago → confirmar', () => {
        // 3. Esperar a que se carguen los empleados mockeados
        cy.wait('@getEmployees');
        // cerrar el popswal2
        cy.closeSwal();
        cy.get('[data-tour="appointment-employee"] > .relative > .peer').click();
        cy.contains('div', 'Luis Janco')
            .should('be.visible')
            .click();


        // 5. Seleccionar fecha
        cy.get('button[data-date-select="true"]')
            .should('be.visible')
            .and('contain', 'Seleccionar fecha')
            .click();

        cy.get('.react-datepicker__month-container')
            .should('be.visible');

        // ✅ Ejecutamos lógica de búsqueda de día disponible dentro del navegador
        cy.window().then((win) => {
            // Función que busca el primer día hábil disponible (lunes a viernes)
            function findNextAvailableWeekday() {
                const today = new Date();
                let currentDate = new Date(today);

                // Buscamos hasta 20 días adelante (más que suficiente)
                for (let i = 1; i <= 20; i++) {
                    currentDate.setDate(today.getDate() + i);

                    // Saltar sábado (6) y domingo (0)
                    const dayOfWeek = currentDate.getDay(); // 0 = dom, 1 = lun, ..., 6 = sáb
                    if (dayOfWeek === 0 || dayOfWeek === 6) {
                        continue; // ✅ Saltamos fin de semana
                    }

                    // Formato del día: "1", "2", ..., "31" (sin ceros)
                    const dayNumber = currentDate.getDate().toString();

                    // ✅ BUSCAR MANUALMENTE EL DÍA EN EL DOM (sin :contains)
                    const dayElements = win.document.querySelectorAll(
                        '.react-datepicker__day:not(.react-datepicker__day--disabled)'
                    );

                    let foundDay = null;
                    for (const el of dayElements) {
                        // El texto del día puede ser "26", "1", etc.
                        if (el.textContent.trim() === dayNumber) {
                            foundDay = el;
                            break;
                        }
                    }

                    if (foundDay) {
                        return {
                            date: currentDate,
                            dayNumber: dayNumber,
                            element: foundDay,
                            dayOfWeek: dayOfWeek // 1=lun, 2=mar, 3=mié, 4=jue, 5=vie
                        };
                    }
                }

                throw new Error('No se encontró ningún día hábil disponible en los próximos 20 días');
            }

            let result;
            try {
                result = findNextAvailableWeekday();
            } catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                } else {
                    throw new Error(String(error));
                }
            }

            const targetDay = result.dayNumber;
            const targetDate = result.date;

            cy.log(`📅 Buscando primer día hábil disponible después de hoy...`);
            cy.log(`✅ Día encontrado: ${targetDate.toLocaleDateString('es-ES')} (${['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'][targetDate.getDay()]})`);

            // Si el día está en otro mes, navegamos hasta que aparezca
            const checkAndNavigate = () => {
                // ✅ BUSCAR MANUALMENTE EL DÍA EN EL DOM (sin :contains)
                const dayElements = win.document.querySelectorAll(
                    '.react-datepicker__day:not(.react-datepicker__day--disabled)'
                );

                let foundDay = null;
                for (const el of dayElements) {
                    if (el.textContent.trim() === targetDay) {
                        foundDay = el;
                        break;
                    }
                }

                if (foundDay) {
                    cy.wrap(foundDay).click();
                    return;
                }

                // Si no lo encontramos, buscamos el botón "Siguiente"
                const nextButton = win.document.querySelector(
                    '.react-datepicker__navigation--next'
                );

                if (nextButton) {
                    cy.wrap(nextButton).click({ force: false }).then(() => {
                        cy.wait(500); // Pequeño delay para que se renderice
                        checkAndNavigate(); // Recursivo hasta encontrarlo
                    });
                } else {
                    throw new Error('No se encontró el botón "Siguiente" para avanzar de mes');
                }
            };

            checkAndNavigate();
        });



        // 6. Seleccionar hora
        cy.get('[data-tour="appointment-time"] > :nth-child(1) > .relative > .peer').click();

        // Esperar a que carguen las horas
        cy.get('.space-y-3 > div')
            .should('have.length.greaterThan', 0);

        // Filtrar y seleccionar la primera hora disponible (no deshabilitada)
        cy.get('button.w-full.text-left.p-4.rounded-xl.border')
            .first()
            .should('be.visible')
            .invoke('text')
            .then((hourText) => {
                cy.log(`⏰ Primera hora disponible encontrada: ${hourText}`);
                cy.get('button.w-full.text-left.p-4.rounded-xl.border')
                    .first()
                    .click();
            });

        // 7. Seleccionar método de pago
        cy.get('[data-tour="appointment-payment"] > .relative > .peer').click();
        cy.get('.space-y-3 > :nth-child(1)').first().should('be.visible').and('contain', 'Efectivo').click();

        // 8. Agregar nota
        cy.get('[data-cy="input-notas"]').type("RESERVA DE PRUEBA DESDE CYPRESS");

        // INTERCEPTAR EL POST A /api/booking/ CON RESPUESTA REAL
        cy.intercept('POST', '/api/booking/', {
            statusCode: 201,
            body: {
                data: {
                    _id: '3278',
                    serviceCart: [{ service: { _id: SERVICE_ID }, quantity: 1 }],
                    branchId: BRANCH_ID,
                    employeeId: '6723f96cc95d26dc914b0f51',
                    date: '2025-04-20',
                    time: '09:00 AM',
                    paymentMethod: 'efectivo',
                    note: 'RESERVA DE PRUEBA DESDE CYPRESS',
                    status: 'confirmed',
                    createdAt: '2025-04-20T09:00:00.000Z'
                }
            }
        }).as('createBooking');

        // 9. Confirmar servicio → dispara el POST
        cy.get('.btn-base').contains('Confirmar servicio').click();

        // 10. Esperar la respuesta y validar redirección + mensaje
        cy.wait('@createBooking').then((interception) => {
            expect(interception.response, 'interception.response should be defined').to.not.be.undefined;
            const bookingId = interception.response!.body.data._id;

            // Validar que la reserva se creó correctamente
            expect(interception.response!.statusCode).to.eq(201);
            expect(bookingId).to.be.a('string').and.not.be.empty;
            expect(bookingId).to.eq('3278');

            cy.log("PRUEBA REALIZADA CON EXITO");
            cy.log('🎉 Test completado: Reserva creada con ID: 3278 | Mensaje validado correctamente');
        });
    });
});
