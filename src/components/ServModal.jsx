import { useEffect, useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { setNotActiveModal } from "../store/servicios";
import { BOOKING_ADD_TO_CART } from "../store";
import Button from "./atoms/Button";

Modal.setAppElement("#root");
const overlayCls =
  "fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60]";
const contentCls =
   "relative w-[92%] sm:w-[450px] max-h-[85vh] overflow-y-auto \
    bg-white rounded-3xl shadow-2xl animate-modal-pop py-6";

export const ServModal = ({
  openCart,
  _id,
  name,
  unitPrice,
  description = "",
  imageURL = "",
  unitEstimatedWorkMinutes,
  variablePrice,
  isOpen = false,
  availableAfterHours,
}) => {
  const { providerid } = useParams();
  const dispatch = useDispatch();

  const [cant, setCant] = useState(1);
  const [isReadMore, setIsReadMore] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsReadMore(false);
      setCant(1);
    }
  }, [isOpen]);

  const onCloseModal = () => dispatch(setNotActiveModal());

  const handleQty = (delta) =>
    setCant((prev) => Math.max(1, prev + delta));

  const onCarrito = () => {
    const price = cant * unitPrice;
    const quantity = cant;
    const estimatedWorkMinutes = cant * unitEstimatedWorkMinutes;
    const serv = {
      _id,
      name,
      unitPrice,
      description,
      imageURL,
      unitEstimatedWorkMinutes,
      variablePrice,
      availableAfterHours,
    };

    dispatch(
      BOOKING_ADD_TO_CART({ quantity, service: serv, price, estimatedWorkMinutes })
    );
    dispatch(setNotActiveModal());
    openCart();           // abre sidebar carrito
  };

  /* --------- UI --------- */
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onCloseModal}
      overlayClassName={overlayCls}
      className={contentCls}
      closeTimeoutMS={200}
    >
      {/* ─── Botón cerrar ─── */}
      <button
        onClick={onCloseModal}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-700"
        aria-label="Cerrar"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="black">
          <path d="M18 6 6 18M6 6l12 12" strokeWidth="2" strokeLinecap="round" stroke="gray" />
        </svg>
      </button>

      {/* ─── Contenido ─── */}
      <div className="p-6 flex flex-col gap-5">
        {/* Imagen + nombre + precio */}
        <div className="flex items-center text-center gap-5 sm:flex-row">
          {/* Imagen */}
          <img
            src={imageURL}
            alt={name}
            className="w-40 h-40 object-cover rounded-2xl shadow-md shrink-0"
          />

          {/* Nombre, precio, qty */}
          <div className="flex flex-col flex-1 gap-3">
            {/* Nombre */}
            <h2 className="text-xl font-semibold text-gray-900">{name}</h2>

            {/* Precio */}
            <p className="text-primary font-bold text-lg">
              {variablePrice && (
                <span className="text-xs text-gray-400 font-normal mr-1">Desde</span>
              )}
              Bs {unitPrice}
            </p>

            {/* Selector de cantidad */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleQty(-1)}
                className="qty-btn"
                aria-label="Restar"
              >
                −
              </button>
              <span className="text-lg font-semibold min-w-[32px] text-center">
                {cant}
              </span>
              <button
                onClick={() => handleQty(1)}
                className="qty-btn"
                aria-label="Sumar"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {description && (
          <div className="text-sm text-gray-600 leading-relaxed">
            <p
              className={`whitespace-pre-line ${
                isReadMore ? "" : "line-clamp-[8]"
              }`}
            >
              {description}
            </p>
            {description.split("\n").length > 8 && (
              <button
                onClick={() => setIsReadMore((v) => !v)}
                className="text-primary font-medium mt-1"
              >
                {isReadMore ? "Leer menos" : "Leer más"}
              </button>
            )}
          </div>
        )}
        <Button className="w-full" onClick={onCarrito}>
          Añadir al carrito
        </Button>
      </div>
    </Modal>
  );
};
