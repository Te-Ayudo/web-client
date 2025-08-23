import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useSelector, useDispatch } from "react-redux";
import { startTour, endTour, setCurrentPage, setContinueTour } from "../store/tour";
import { useRef } from "react";

const useTour = () => {
  const dispatch = useDispatch();

  // Estados de Redux
  const proveedor = useSelector((state) => state.proveedor.selected);
  const tourState = useSelector((state) => state.tour);
  const nombreProveedor = proveedor?.first_name || "el proveedor";
  const driverRef = useRef(null);
  const tourExecutingRef = useRef(false);

  // Función para limpiar la instancia actual sin cerrar el tour (para navegación entre páginas)
  const cleanupCurrentInstance = () => {
    // Liberar flag de ejecución
    tourExecutingRef.current = false;

    if (driverRef.current) {
      try {
        driverRef.current._isCleanup = "PROGRAMMATIC";
        driverRef.current.destroy?.();
      } catch (error) {
        console.log("Error durante cleanup:", error);
      }
      driverRef.current = null;
    }

    // Limpiar clases del body
    document.body.classList.remove("modal-tour-active", "cart-tour-active", "appointment-tour-active");

    // Limpiar cualquier estilo inline que pueda estar bloqueando
    document.body.style.removeProperty("pointer-events");
    document.body.style.removeProperty("overflow");

    try {
      // Buscar y remover todos los elementos del driver
      const driverUINodes = document.querySelectorAll(
        ".driver-popover, .driver-overlay, .driver-backdrop, .driver-stage, [data-driver-popover], [data-driver-overlay]"
      );
      driverUINodes.forEach((n) => {
        try {
          if (n.parentNode) {
            n.parentNode.removeChild(n);
          }
        } catch (removeError) {
          try {
            n.remove();
          } catch (finalError) {
            console.log("Error removiendo elemento driver:", finalError);
          }
        }
      });

      // Limpiar todas las clases de driver de los elementos
      document
        .querySelectorAll(
          ".driver-highlighted, .driver-active-element, .driver-position-relative, .driver-no-interaction, .driver-fade-element"
        )
        .forEach((n) => {
          n.classList.remove(
            "driver-highlighted",
            "driver-active-element",
            "driver-position-relative",
            "driver-no-interaction",
            "driver-fade-element"
          );
          // Limpiar cualquier estilo inline
          n.style.removeProperty("pointer-events");
          n.style.removeProperty("z-index");
        });
    } catch (error) {
      console.log("Error limpiando elementos del DOM:", error);
    }
  };

  // Función centralizada para terminar el tour completamente
  const terminateTourCompletely = () => {
    if (driverRef.current) {
      try {
        // Marcar como terminación para evitar callbacks
        driverRef.current._isCleanup = "TERMINATE";
        driverRef.current.destroy?.();
      } catch (destroyError) {
        console.log("Error al destruir driver:", destroyError);
      }
      driverRef.current = null;
    }

    // Limpiar estado de Redux
    dispatch(endTour());
    dispatch(setContinueTour(false));

    // Limpiar DOM
    cleanupCurrentInstance();
  };

  const ensureDriver = (config = {}) => {
    cleanupCurrentInstance();

    driverRef.current = driver({
      showProgress: false,
      nextBtnText: "Siguiente",
      prevBtnText: "Anterior",
      doneBtnText: "¡Entendido!",
      progressText: "Paso {{current}} de {{total}}",
      showButtons: ["next", "previous", "close"],
      disableActiveInteraction: false,

      allowClose: true,
      overlayClickBehavior: "close",
      smoothScroll: true,
      animate: true,
      overlayOpacity: 0.7,
      stagePadding: 4,
      stageRadius: 5,

      onCloseClick: () => {
        terminateTourCompletely();
      },

      onDoneClick: () => {
        if (!driverRef.current?._isCleanup) {
          driverRef.current._isCleanup = "CONTINUE"; // Marcar para continuar en siguiente página
          dispatch(setContinueTour(true));
          cleanupCurrentInstance();
        }
        driverRef.current = null;
      },

      onCompleted: () => {
        // Cuando se completa el tour (llegó al último paso y hizo "Siguiente")
        if (!driverRef.current?._isCleanup) {
          // Activar continueTour para la siguiente página
          driverRef.current._isCleanup = "CONTINUE";
          dispatch(setContinueTour(true));
          cleanupCurrentInstance();
        }
        driverRef.current = null;
      },

      onClose: (params) => {
        terminateTourCompletely();
      },
      onDestroyed: () => {
        // terminateTourCompletely();
      },
      onHighlightStarted: (element) => {
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      },

      ...config,
    });

    return driverRef.current;
  };

  const stopTour = () => {
    terminateTourCompletely();
  };

  // Nueva función para cerrar solo la página actual del tour (mantiene continueTour activo)
  const stopCurrentPageTour = () => {
    if (driverRef.current) {
      try {
        driverRef.current._isCleanup = "CONTINUE"; // Marcar para continuar en siguiente página
        driverRef.current.destroy?.();
      } finally {
        driverRef.current = null;
        // No llamar endTour(), solo activar continueTour
        dispatch(setContinueTour(true));
        cleanupCurrentInstance();
      }
    }
  };

  const createTourInstance = (steps) => ensureDriver({ steps });
  const launchingRef = useRef(false);

  const withSingleLaunch = async (fn) => {
    if (launchingRef.current || driverRef.current) return;
    launchingRef.current = true;
    try {
      await fn();
    } finally {
      launchingRef.current = false;
    }
  };
  const startHomeTour = async () => {
    await withSingleLaunch(async () => {
      dispatch(startTour("home"));

      try {
        await new Promise((resolve) => setTimeout(resolve, 200));

        const domicilioElement = document.querySelector('[data-tour="servicio-domicilio"]');
        const localElement = document.querySelector('[data-tour="servicio-local"]');
        if (!domicilioElement && !localElement) {
          console.warn("Botones de servicio no encontrados para el tour");
          return;
        }

        const steps = [
          {
            element: '[data-tour="bienvenida"]',
            popover: {
              title: "¡Bienvenido! 👋",
              description: "Te guiaremos paso a paso para que puedas solicitar un servicio de manera fácil y rápida.",
              position: "bottom",
            },
          },
        ];

        // Verificar si el botón de domicilio existe Y no está deshabilitado
        if (domicilioElement && !domicilioElement.disabled) {
          steps.push({
            element: '[data-tour="servicio-domicilio"]',
            popover: {
              title: "Servicio a domicilio 🏠",
              description: `Haz clic aquí para recibir el servicio en tu casa u oficina.`,
              position: "top",
            },
          });
        }

        // Verificar si el botón de local existe Y no está deshabilitado
        if (localElement && !localElement.disabled) {
          steps.push({
            element: '[data-tour="servicio-local"]',
            popover: {
              title: "Servicio en el local 🏢",
              description: `Elige esta opción para acudir a un local de ${nombreProveedor}.`,
              position: "top",
            },
          });
        }

        const driverObj = createTourInstance(steps);
        driverObj.drive();
      } catch (error) {
        console.error("Error al iniciar el tour:", error);
        // Como fallback, intentar un tour básico si al menos existe el elemento de bienvenida
        const bienvenidaElement = document.querySelector('[data-tour="bienvenida"]');
        if (bienvenidaElement) {
          const basicDriverObj = createTourInstance([
            {
              element: '[data-tour="bienvenida"]',
              popover: {
                title: "¡Bienvenido! 👋",
                description: "Te mostraremos cómo solicitar un servicio fácilmente.",
                position: "bottom",
              },
            },
          ]);
          basicDriverObj.drive();
        }
      }
    });
  };

  const startSucursalesTour = async (sucursalesData = []) => {
    if (!tourState.isActive) {
      dispatch(startTour("sucursales"));
    } else {
      // Si ya está activo, solo cambiar la página
      dispatch(setCurrentPage("sucursales"));
    }

    try {
      // Esperar elementos de sucursales
      await new Promise((resolve) => setTimeout(resolve, 300));

      const sucursalButtons = document.querySelectorAll('[data-tour="seleccionar-sucursal"]');
      const ubicacionButtons = document.querySelectorAll('[data-tour="ver-ubicacion"]');

      const steps = [];

      // Solo mostrar la primera sucursal (como en servicios)
      if (sucursalButtons.length > 0) {
        const firstButton = sucursalButtons[0];

        // Obtener el nombre de la primera sucursal
        let sucursalName = "la primera sucursal";

        if (sucursalesData && sucursalesData[0]) {
          sucursalName = sucursalesData[0].name || "primera sucursal";
        } else {
          // Intentar extraer el nombre desde el atributo data-sucursal-name
          const nameFromAttr = firstButton.getAttribute("data-sucursal-name");
          if (nameFromAttr) {
            sucursalName = nameFromAttr;
          }
        }

        // Paso 1: Botón de seleccionar primera sucursal
        const selectorSeleccionar = `[data-tour="seleccionar-sucursal"][data-index="0"]`;
        steps.push({
          element: selectorSeleccionar,
          popover: {
            title: `${sucursalName} 🏢`,
            description: `Haz clic aquí para que tu servicio se realice en el local "${sucursalName}". Esta será la sucursal donde recibirás tu servicio.`,
            position: "top",
          },
        });

        // Paso 2: Botón de ubicación de la primera sucursal
        if (ubicacionButtons[0]) {
          const selectorUbicacion = `[data-tour="ver-ubicacion"][data-index="0"]`;
          steps.push({
            element: selectorUbicacion,
            popover: {
              title: `Ubicación de ${sucursalName}`,
              description: `Haz clic aquí si quieres ver la ubicación de "${sucursalName}" en el mapa. Podrás conocer la dirección exacta y cómo llegar.`,
              position: "top",
            },
          });
        }
      }

      if (steps.length > 0) {
        const driverObj = createTourInstance(steps);
        driverObj.drive();
      }
    } catch (error) {
      console.error("Error al iniciar el tour de sucursales:", error);
      // No terminar el tour, solo limpiar la instancia actual
      cleanupCurrentInstance();
    }
  };

  const startServiciosTour = async (serviciosData = []) => {
    // Prevenir ejecuciones concurrentes
    if (tourExecutingRef.current) {
      return;
    }

    tourExecutingRef.current = true;

    try {
      // Si no está activo el tour, activarlo (para botón flotante manual)
      if (!tourState.isActive) {
        dispatch(startTour("servicios"));
      } else {
        // Si ya está activo, solo cambiar la página
        dispatch(setCurrentPage("servicios"));
      }

      // Esperar elementos de servicios
      await new Promise((resolve) => setTimeout(resolve, 300));

      const searchInput = document.querySelector('[data-tour="buscador-servicio"]');
      const servicioItems = document.querySelectorAll('[data-tour="servicio-item"]');

      const steps = [];

      // Detectar si estamos en la página de Servicios (A domicilio) o en Empresa (Sucursal)
      const isServiciosPage = window.location.pathname.includes("/servicios");

      // Primer paso: Buscador
      if (searchInput) {
        steps.push({
          element: '[data-tour="buscador-servicio"]',
          popover: {
            title: "Buscar servicios 🔍",
            description: `Usa este buscador para encontrar rápidamente el servicio que necesitas de ${nombreProveedor}.`,
            position: "bottom",
          },
        });
      }

      // Agregar pasos para servicios
      if (servicioItems.length > 0) {
        if (isServiciosPage) {
          // En la página de Servicios, solo mostrar el primer servicio
          const firstItem = servicioItems[0];
          let serviceName = "este servicio";

          if (serviciosData && serviciosData[0]) {
            serviceName = serviciosData[0].name || "primer servicio";
          } else {
            // Intentar extraer el nombre del servicio desde el atributo data-service-name
            const nameFromAttr = firstItem.getAttribute("data-service-name");
            if (nameFromAttr) {
              serviceName = nameFromAttr;
            } else {
              // Como último recurso, buscar en el DOM
              const nameElement = firstItem.querySelector("strong");
              if (nameElement) {
                serviceName = nameElement.textContent.trim();
              }
            }
          }

          // Solo agregar el primer servicio
          steps.push({
            element: '[data-tour="servicio-item"][data-index="0"]',
            popover: {
              title: `${serviceName} 🛎️`,
              description: `Haz clic si quieres contratar el servicio de "${serviceName}". Podrás ver sus detalles y agregarlo a tu carrito de compras.`,
              position: "top",
            },
          });
        } else {
          // En la página de Empresa, también solo mostrar el primer servicio
          const firstItem = servicioItems[0];
          let serviceName = "este servicio";

          if (serviciosData && serviciosData[0]) {
            serviceName = serviciosData[0].name || "primer servicio";
          } else {
            // Intentar extraer el nombre del servicio desde el atributo data-service-name
            const nameFromAttr = firstItem.getAttribute("data-service-name");
            if (nameFromAttr) {
              serviceName = nameFromAttr;
            } else {
              // Como último recurso, buscar en el DOM
              const nameElement = firstItem.querySelector("strong");
              if (nameElement) {
                serviceName = nameElement.textContent.trim();
              }
            }
          }

          // Solo agregar el primer servicio
          steps.push({
            element: '[data-tour="servicio-item"][data-index="0"]',
            popover: {
              title: `${serviceName} 🛎️`,
              description: `Haz clic si quieres contratar el servicio de "${serviceName}". Podrás ver sus detalles y agregarlo a tu carrito de compras.`,
              position: "top",
            },
          });
        }
      }

      if (steps.length > 0) {
        const driverObj = createTourInstance(steps);

        // Override del destroy para liberar la flag
        const originalDestroy = driverObj.destroy.bind(driverObj);
        driverObj.destroy = function () {
          tourExecutingRef.current = false;
          originalDestroy();
        };

        driverObj.drive();
      } else {
        console.warn("No se encontraron elementos para el tour de servicios");
        // No terminar el tour, solo limpiar la instancia actual
        cleanupCurrentInstance();
      }
    } catch (error) {
      console.error("Error al iniciar el tour de servicios:", error);
      // No terminar el tour, solo limpiar la instancia actual
      cleanupCurrentInstance();
    } finally {
      tourExecutingRef.current = false; // Liberar la flag en caso de error
    }
  };

  // Función específica para cambiar contexto del tour (ej: de servicios a modal)
  const switchTourContext = async (newContext, extraData = null) => {
    // PASO 1: Limpiar agresivamente cualquier instancia activa
    cleanupCurrentInstance();

    // PASO 2: Delay más largo para asegurar limpieza completa
    await new Promise((resolve) => setTimeout(resolve, 300));

    // PASO 3: Verificar que no hay elementos de tour previo en el DOM
    const prevTourElements = document.querySelectorAll(".driver-highlighted, .driver-popover, .driver-overlay");
    if (prevTourElements.length > 0) {
      prevTourElements.forEach((el) => el.remove());
    }

    // PASO 4: Cambiar contexto en Redux
    dispatch(setCurrentPage(newContext));

    // PASO 5: Delay adicional antes de iniciar nuevo tour
    await new Promise((resolve) => setTimeout(resolve, 200));

    // PASO 6: Ejecutar tour del nuevo contexto
    switch (newContext) {
      case "modal-servicio":
        await startServiceModalTour(extraData);
        break;
      default:
        console.warn(`Contexto de tour no reconocido: ${newContext}`);
        break;
    }
  };

  const startServiceModalTour = async (serviceName = "este servicio") => {
    // IMPORTANTE: Asegurar que no hay instancias previas ejecutándose
    cleanupCurrentInstance();

    // Verificar que estamos en el contexto correcto
    if (tourState.currentPage !== "modal-servicio") {
      dispatch(setCurrentPage("modal-servicio"));
    }

    // Si no está activo el tour, activarlo (para cuando se abre el modal manualmente)
    if (!tourState.isActive) {
      dispatch(startTour("modal-servicio"));
    }

    try {
      // Esperar a que el modal esté completamente renderizado
      await new Promise((resolve) => setTimeout(resolve, 500));

      const btnRestar = document.querySelector('[data-tour="btn-restar"]');
      const btnSumar = document.querySelector('[data-tour="btn-sumar"]');
      const btnAñadirCarrito = document.querySelector('[data-tour="btn-añadir-carrito"]');

      // Si no encontramos los elementos del modal, no continuar
      if (!btnRestar || !btnSumar || !btnAñadirCarrito) {
        console.warn("No se encontraron todos los elementos necesarios para el tour del modal");
        return;
      }

      // Verificar una vez más que no hay tours conflictivos
      const conflictingElements = document.querySelectorAll(
        '[data-tour="servicio-item"], [data-tour="buscador-servicio"]'
      );
      if (conflictingElements.length > 0) {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      const steps = [];

      // Paso 1: Botón sumar cantidad (PRIMERO)
      if (btnSumar) {
        steps.push({
          element: '[data-tour="btn-sumar"]',
          popover: {
            title: "Aumentar cantidad",
            description: `Haz clic aquí para aumentar la cantidad de "${serviceName}" que quieres solicitar.`,
            position: "top",
          },
        });
      }

      // Paso 2: Botón restar cantidad (SEGUNDO)
      if (btnRestar) {
        steps.push({
          element: '[data-tour="btn-restar"]',
          popover: {
            title: "Reducir cantidad",
            description: `Haz clic aquí si quieres reducir la cantidad de "${serviceName}" que vas a solicitar.`,
            position: "top",
          },
        });
      }

      // Paso 3: Botón añadir al carrito
      if (btnAñadirCarrito) {
        steps.push({
          element: '[data-tour="btn-añadir-carrito"]',
          popover: {
            title: "Añadir al carrito 🛒",
            description: `¡Perfecto! Haz clic aquí para agregar "${serviceName}" a tu carrito de compras y continuar con tu pedido.`,
            position: "top",
          },
        });
      }

      if (steps.length > 0) {
        // Agregar clase al body para CSS específico
        document.body.classList.add("modal-tour-active");

        // Para el modal, usar configuración especial
        const modalTourConfig = {
          steps,
          overlayOpacity: 0.5, // Menos opaco para no conflictuar con el modal
          stagePadding: 8,
          popoverClass: "driver-popover-modal", // Clase personalizada para el tour del modal
        };

        const driverObj = ensureDriver(modalTourConfig);

        // Override del destroy para limpiar la clase del body
        const originalDestroy = driverObj.destroy.bind(driverObj);
        driverObj.destroy = function () {
          document.body.classList.remove("modal-tour-active");
          originalDestroy();
        };

        // Ejecutar el tour
        driverObj.drive();
      } else {
        console.warn("No se encontraron elementos del modal para el tour");
        // No terminar el tour, solo limpiar la instancia actual
        cleanupCurrentInstance();
      }
    } catch (error) {
      console.error("Error al iniciar el tour del modal de servicio:", error);
      // No terminar el tour, solo limpiar la instancia actual
      cleanupCurrentInstance();
    }
  };

  const checkAndStartTour = (pageName, extraData = null) => {
    // NUEVA LÓGICA: Si continueTour es true, activar tour automáticamente
    if (tourState.continueTour && !tourState.isActive) {
      dispatch(startTour(pageName));
    }

    // Si no está activo el tour y no hay continueTour, no hacer nada
    if (!tourState.isActive && !tourState.continueTour) {
      return;
    }

    // LÓGICA EXISTENTE: Prevenir bucles infinitos
    // Si estamos en contexto de carrito, solo permitir formulario como próximo paso
    if (tourState.currentPage === "carrito" && pageName !== "carrito" && pageName !== "formulario") {
      return;
    }

    // Si estamos en contexto de modal, solo permitir carrito
    if (tourState.currentPage === "modal-servicio" && pageName !== "modal-servicio" && pageName !== "carrito") {
      return;
    }

    // Si ya estamos en la página correcta, verificar si realmente necesitamos ejecutar el tour
    if (tourState.currentPage === pageName) {
      // Para el carrito, siempre intentar ejecutar el tour si no hay uno activo
      if (pageName === "carrito" && !driverRef.current) {
        setTimeout(() => {
          startCartTour();
        }, 500);
      }

      // Para el formulario, verificar si venimos del carrito
      if (pageName === "formulario" && !driverRef.current) {
        setTimeout(() => {
          startAppointmentTour();
        }, 500);
      }
      return;
    }

    // Prevenir que servicios interfiera cuando vamos hacia carrito
    if (pageName === "servicios" && tourState.currentPage === "carrito") {
      return;
    }

    // Si hay una instancia de driver ejecutándose, esperar a que termine
    if (driverRef.current) {
      setTimeout(() => {
        checkAndStartTour(pageName, extraData);
      }, 1000);
      return;
    }

    // Actualizar la página actual en el estado y limpiar continueTour
    dispatch(setCurrentPage(pageName));
    if (tourState.continueTour) {
      dispatch(setContinueTour(false));
    }

    setTimeout(() => {
      switch (pageName) {
        case "home":
          startHomeTour();
          break;
        case "sucursales":
          startSucursalesTour(extraData);
          break;
        case "servicios":
          // Solo iniciar tour de servicios si no venimos del carrito
          if (tourState.currentPage !== "carrito") {
            startServiciosTour(extraData);
          }
          break;
        case "modal-servicio":
          startServiceModalTour(extraData);
          break;
        case "carrito":
          startCartTour();
          break;
        case "formulario":
          startAppointmentTour();
          break;
        default:
          break;
      }
    }, 100);
  };

  // Función específica para detener el tour de servicios al abrir modal
  const stopServicesTour = () => {
    if (driverRef.current) {
      try {
        // Marcar como cleanup programático para evitar callbacks
        driverRef.current._isCleanup = true;
        driverRef.current.destroy();
      } catch (error) {
        console.error("Error al destruir tour de servicios:", error);
      }
      driverRef.current = null;
    }

    // Limpiar elementos específicos del tour de servicios
    document
      .querySelectorAll(".driver-popover, .driver-overlay, .driver-backdrop, .driver-stage")
      .forEach((n) => n.parentNode?.removeChild(n));
    document
      .querySelectorAll(".driver-highlighted, .driver-active-element, .driver-position-relative")
      .forEach((n) => n.classList.remove("driver-highlighted", "driver-active-element", "driver-position-relative"));
  };

  // Función específica para el tour del carrito
  const startCartTour = async () => {
    // Prevenir ejecuciones concurrentes
    if (tourExecutingRef.current) {
      return;
    }

    // Si no hay tour activo, activarlo primero
    if (!tourState.isActive) {
      dispatch(startTour("carrito"));
    }

    // Asegurarse de que el currentPage sea carrito
    if (tourState.currentPage !== "carrito") {
      dispatch(setCurrentPage("carrito"));
    }

    tourExecutingRef.current = true;

    try {
      cleanupCurrentInstance();

      await new Promise((resolve) => setTimeout(resolve, 800));

      const btnAgregar = document.querySelector('[data-tour="btn-agregar"]');
      const listaServicios = document.querySelector('[data-tour="lista-servicios"]');
      const btnSolicitar = document.querySelector('[data-tour="btn-solicitar"]');

      if (!btnAgregar && !listaServicios && !btnSolicitar) {
        console.warn("No se encontraron elementos para el tour del carrito");
        return;
      }

      const steps = [];

      // Omitir el botón agregar y empezar directamente con la lista de servicios
      // if (btnAgregar) {
      //   steps.push({
      //     element: '[data-tour="btn-agregar"]',
      //     popover: {
      //       title: "Agregar más servicios",
      //       description: "¿Necesitas más servicios? Haz clic aquí para regresar a la lista y agregar otros servicios a tu carrito.",
      //       position: "bottom"
      //     }
      //   });
      // }

      if (listaServicios) {
        steps.push({
          element: '[data-tour="lista-servicios"]',
          popover: {
            title: "Tus servicios seleccionados 📋",
            description:
              "Aquí puedes ver todos los servicios que has agregado a tu carrito. Puedes modificar las cantidades si es necesario.",
            position: "left",
          },
        });
      }

      if (btnSolicitar) {
        steps.push({
          element: '[data-tour="btn-solicitar"]',
          popover: {
            title: "¡Solicitar servicio! 🚀",
            description:
              "¡Perfecto! Cuando estés listo, haz clic aquí para proceder a programar tu cita y finalizar tu solicitud.",
            position: "top",
          },
        });
      }

      if (steps.length > 0) {
        document.body.classList.add("cart-tour-active");

        const cartTourConfig = {
          steps,
          overlayOpacity: 0.4,
          stagePadding: 8,
          popoverClass: "driver-popover-cart",
        };

        const driverObj = ensureDriver(cartTourConfig);

        const originalDestroy = driverObj.destroy.bind(driverObj);
        driverObj.destroy = function () {
          try {
            document.body.classList.remove("cart-tour-active");
            tourExecutingRef.current = false;
            originalDestroy();
          } catch (destroyError) {
            console.warn("Error durante destroy del tour de carrito:", destroyError);
            document.body.classList.remove("cart-tour-active");
            tourExecutingRef.current = false;
          }
        };

        driverObj.drive();
      } else {
        console.warn("No se encontraron elementos del carrito para el tour");
        cleanupCurrentInstance();
      }
    } catch (error) {
      console.error("Error al iniciar el tour del carrito:", error);
      cleanupCurrentInstance();
    } finally {
      tourExecutingRef.current = false;
    }
  };

  const startAppointmentTour = async () => {
    if (tourExecutingRef.current) {
      return;
    }

    if (!tourState.isActive) {
      dispatch(startTour("formulario"));
    }

    if (tourState.currentPage !== "formulario") {
      dispatch(setCurrentPage("formulario"));
    }

    tourExecutingRef.current = true;

    try {
      cleanupCurrentInstance();

      await new Promise((resolve) => setTimeout(resolve, 300));

      const nameField = document.querySelector('[data-tour="appointment-name"]');
      const employeeField = document.querySelector('[data-tour="appointment-employee"]');
      const dateField = document.querySelector('[data-tour="appointment-date"]');
      const timeField = document.querySelector('[data-tour="appointment-time"]');
      const paymentField = document.querySelector('[data-tour="appointment-payment"]');
      const addressField = document.querySelector('[data-tour="appointment-address"]');
      const submitButton = document.querySelector('[data-tour="appointment-submit"]');

      if (!nameField || !submitButton) {
        console.warn("No se encontraron elementos básicos para el tour del formulario");
        return;
      }

      const steps = [];

      if (nameField) {
        steps.push({
          element: '[data-tour="appointment-name"]',
          popover: {
            title: "Nombre y apellido 👤",
            description: "Ingresa tu nombre completo para la reserva del servicio.",
            position: "bottom",
          },
        });
      }

      if (employeeField) {
        steps.push({
          element: '[data-tour="appointment-employee"]',
          popover: {
            title: "Elegir empleado 👨‍💼",
            description: "Selecciona el empleado de tu preferencia o deja vacío para asignación automática.",
            position: "bottom",
          },
        });
      }

      if (dateField) {
        steps.push({
          element: '[data-tour="appointment-date"]',
          popover: {
            title: "Seleccionar fecha 📅",
            description: "Elige la fecha en que deseas recibir el servicio.",
            position: "bottom",
          },
        });
      }

      if (timeField) {
        steps.push({
          element: '[data-tour="appointment-time"]',
          popover: {
            title: "Seleccionar hora ⏰",
            description: "Escoge la hora más conveniente para ti.",
            position: "bottom",
          },
        });
      }

      if (paymentField) {
        steps.push({
          element: '[data-tour="appointment-payment"]',
          popover: {
            title: "Método de pago 💳",
            description: "Selecciona cómo prefieres pagar por el servicio.",
            position: "bottom",
          },
        });
      }

      if (addressField) {
        steps.push({
          element: '[data-tour="appointment-address"]',
          popover: {
            title: "Dirección de servicio 📍",
            description: "Indica dónde deseas recibir el servicio a domicilio.",
            position: "bottom",
          },
        });
      }

      if (submitButton) {
        steps.push({
          element: '[data-tour="appointment-submit"]',
          popover: {
            title: "¡Confirmar servicio! ✅",
            description: "Una vez completados todos los campos, haz clic para confirmar tu reserva.",
            position: "top",
          },
        });
      }

      if (steps.length > 0) {
        document.body.classList.add("appointment-tour-active");

        const appointmentTourConfig = {
          steps,
          overlayOpacity: 0.4,
          stagePadding: 8,
          disableActiveInteraction: false,
          allowClose: true,
          overlayClickBehavior: "close",
          popoverClass: "driver-popover-appointment",
          onHighlightStarted: (element, step, options) => {
            if (element) {
              element.style.pointerEvents = "auto";
            }
          },
        };

        const driverObj = ensureDriver(appointmentTourConfig);

        // Configurar avance automático por interacción
        setupAutoAdvanceListeners(driverObj, steps);

        const originalDestroy = driverObj.destroy.bind(driverObj);
        driverObj.destroy = function () {
          try {
            document.body.classList.remove("appointment-tour-active");
            // Limpiar listeners de auto-avance
            cleanupAutoAdvanceListeners();
            tourExecutingRef.current = false;
            originalDestroy();
          } catch (destroyError) {
            console.warn("Error durante destroy del tour de appointment:", destroyError);
            document.body.classList.remove("appointment-tour-active");
            cleanupAutoAdvanceListeners();
            tourExecutingRef.current = false;
          }
        };

        driverObj.drive();
      } else {
        console.warn("No se encontraron elementos del formulario para el tour");
        cleanupCurrentInstance();
      }
    } catch (error) {
      console.error("Error al iniciar el tour del formulario:", error);
      cleanupCurrentInstance();
    } finally {
      tourExecutingRef.current = false;
    }
  };

  // Referencia para almacenar los listeners de auto-avance
  const autoAdvanceListenersRef = useRef([]);

  // Función para configurar listeners de auto-avance
  const setupAutoAdvanceListeners = (driverObj, steps) => {
    // Limpiar listeners anteriores
    cleanupAutoAdvanceListeners();

    const listeners = [];

    // Función auxiliar para avanzar si estamos en el paso correcto
    const tryAdvanceStep = (stepIndex, delay = 400) => {
      setTimeout(() => {
        if (driverObj.getActiveIndex && driverObj.getActiveIndex() === stepIndex && driverRef.current) {
          try {
            driverObj.moveNext();
          } catch (error) {
            // Silenciar error para ESLint
          }
        }
      }, delay);
    };

    // Función principal para manejar eventos personalizados
    const handleCustomEvent = (event) => {
      const { field } = event.detail;

      // Mapear el campo al índice del step correspondiente
      const fieldToStepIndex = {};
      steps.forEach((step, index) => {
        if (step.element.includes("appointment-name")) fieldToStepIndex.name = index;
        if (step.element.includes("appointment-employee")) fieldToStepIndex.employee = index;
        if (step.element.includes("appointment-date")) fieldToStepIndex.date = index;
        if (step.element.includes("appointment-time")) fieldToStepIndex.time = index;
        if (step.element.includes("appointment-payment")) fieldToStepIndex.payment = index;
        if (step.element.includes("appointment-address")) fieldToStepIndex.address = index;
      });

      const stepIndex = fieldToStepIndex[field];
      if (stepIndex !== undefined) {
        // Delays sutiles y naturales para cada tipo de campo
        const delay = field === "name" ? 800 : 400; // Un poco más para nombre para que termine de escribir
        tryAdvanceStep(stepIndex, delay);
      }
    };

    // Escuchar eventos personalizados de completado de campo
    window.addEventListener("appointmentFieldCompleted", handleCustomEvent);
    listeners.push({
      element: window,
      event: "appointmentFieldCompleted",
      listener: handleCustomEvent,
    });

    // Guardar los listeners para limpiarlos después
    autoAdvanceListenersRef.current = listeners;
  };

  // Función para limpiar todos los listeners de auto-avance
  const cleanupAutoAdvanceListeners = () => {
    autoAdvanceListenersRef.current.forEach((item) => {
      try {
        if (item.observer) {
          // Es un MutationObserver
          item.observer.disconnect();
        } else if (item.element && item.event && item.listener) {
          // Es un event listener tradicional
          item.element.removeEventListener(item.event, item.listener);
        }
      } catch (error) {
        // No imprimir error para evitar warnings de ESLint
      }
    });
    autoAdvanceListenersRef.current = [];
  };

  return {
    startHomeTour,
    startSucursalesTour,
    startServiciosTour,
    startServiceModalTour,
    startCartTour,
    startAppointmentTour,
    switchTourContext,
    checkAndStartTour,
    stopServicesTour,
    stopCurrentPageTour,
    isActive: tourState.isActive,
    continueTour: tourState.continueTour,
    stopTour,
    cleanupCurrentInstance,
  };
};

export { useTour };
export default useTour;
