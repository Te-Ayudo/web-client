// components/cart/CartSidebar.jsx
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import { HiOutlineShoppingCart } from "react-icons/hi2";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import Button from "../atoms/Button";
import ButtonCustom from "./Button";
import { AiOutlinePlus } from "react-icons/ai";
import CartItem from "./CartItem";
import useTour from "../../hooks/useTour";
export default function CartSidebar({ visible, onClose }) {
  const { providerid } = useParams();
  const navigate = useNavigate();
  const { selected } = useSelector((s) => s.booking);
  const { startCartTour, isActive } = useTour();
  const tourState = useSelector((state) => state.tour);

  const tourStartedRef = useRef(false); // Flag para evitar múltiples inicios

  const items = selected?.serviceCart ?? [];
  const isInBranch = selected?.isInBranch;
  const carrito = useSelector((state) => state.booking.selected.serviceCart);

  const desabilitar = carrito.length === 0;

  // Detectar cuando se abre el carrito y si hay un tour activo (patrón optimizado)
  useEffect(() => {
    if (visible && isActive && tourState.currentPage === "carrito" && items.length > 0 && !tourStartedRef.current) {
      tourStartedRef.current = true;

      // Timeout optimizado similar a otros componentes exitosos
      const timer = setTimeout(() => {
        startCartTour();
      }, 200);

      return () => clearTimeout(timer);
    }

    // Reset flag cuando se cierra el carrito
    if (!visible) {
      tourStartedRef.current = false;
    }
  }, [visible, isActive, tourState.currentPage, items.length, startCartTour]);

  const handleAddMore = () => {
    if (isInBranch) {
      // Para servicio local, necesitamos el ID de la sucursal
      const branchId = selected.branch?._id;
      if (branchId) {
        navigate(`/${providerid}/empresa/${branchId}`);
      } else {
        // Si no hay sucursal seleccionada, ir a la lista de sucursales
        navigate(`/${providerid}/sucursales`);
      }
    } else {
      navigate(`/${providerid}/servicios`);
    }
    onClose(false);
  };

  /* ---------- UI ---------- */
  return (
    <Sheet open={visible} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="
                    flex h-full flex-col bg-white pb-6 pt-0 shadow-lg
                    w-[92vw] max-w-[1000px] sm:w-[90vw] sm:max-w-[500px] lg:w-[500px]
                    rounded-tl-2xl rounded-bl-2xl overflow-hidden border-l-0
                "
      >
        <SheetHeader
          className="
                    sticky top-0 z-20 flex-none
                    bg-white
                    border-b border-gray-200
                    px-6 py-5
                    shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1)]   // sombra inferior más fuerte
                    relative
                "
        >
          <div className="flex items-center gap-4 justify-between">
            <SheetTitle className="text-xl font-semibold text-primary tracking-wide">Carrito de servicios</SheetTitle>

            <ButtonCustom
              onClick={handleAddMore}
              disabled={desabilitar}
              className="font-semibold px-2 sm:pr-0 hover:bg-orange-400 bg-orange-500"
              decoration={<AiOutlinePlus size="1.5rem" className="text-white" />}
              data-tour="btn-agregar"
            >
              <span className="text-white pr-2">Agregar</span>
            </ButtonCustom>
          </div>

          {/* Botón cerrar (posición absoluta en esquina superior derecha) */}
          <ButtonCustom
            onClick={() => onClose(false)}
            className="
                    absolute -top-1 -right-1
                    text-gray-500 hover:text-gray-700
                    rounded-full p-2
                    "
          >
            ✕
          </ButtonCustom>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length > 0 ? (
            <div className="space-y-6" data-tour="lista-servicios" data-cy="cart-items">
              {items.map((orden) => (
                <CartItem key={orden.service._id} orden={orden} />
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center gap-6 text-center">
              <HiOutlineShoppingCart size={96} className="text-gray-400" />
              <p className="text-lg font-medium text-secondary">Tu carrito está vacío.</p>

              {/* <Button
                    onClick={handleAddMore}
                    className="w-full max-w-xs bg-primary/90 text-white hover:bg-primary"
                >
                    Empieza a comprar
                </Button> */}
            </div>
          )}
        </div>

        {/* ───────────────────── Footer fijo ───────────────────── */}
        {items.length > 0 && (
          <SheetFooter
            className="
                        sticky bottom-0 z-20 flex-none
                        bg-white
                        border-t-2 border-gray-300
                        pt-4
                        shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]   // sombra hacia arriba
                    "
          >
            <Button
              onClick={() => {
                // Si hay tour activo, preparar la transición al formulario
                if (isActive) {
                  // La transición se manejará automáticamente cuando llegue a ServiceAppointment
                  console.log("🚀 Navegando a formulario con tour activo");

                  // Limpiar el estado del carrito y preparar transición
                  document.body.classList.remove("cart-tour-active");
                }
                navigate(`/${providerid}/programar`);
              }}
              className="
                            w-full sm:w-auto min-w-[200px] text-lg
                            bg-primary/90 text-white hover:bg-primary
                            rounded-lg py-3 px-6 shadow-md
                            whitespace-nowrap
                        "
              data-tour="btn-solicitar"
              data-cy="btn-solicitar-servicio"
            >
              Seleccionar mi horario
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
