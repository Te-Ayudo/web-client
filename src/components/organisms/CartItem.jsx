// components/atoms/CartItem.jsx
import { changeQuantity, removeItem } from "@/store"; // usa tus actions reales
import { useDispatch } from "react-redux";
import useServiceCartRf from "@/hooks/useServiceCartRf";
export default function CartItem({ orden }) {
  const dispatch = useDispatch();
  const { changeQuantity, removeItem } = useServiceCartRf();
  const { service, quantity } = orden;
  const { _id, imageURL, name, unitPrice } = service;

  const subTotal = unitPrice * quantity;

  return (
    <div className="grid grid-cols-[90px_1fr] gap-3 pb-4 border-b last:border-none">
      {/* Imagen */}
      <img
        src={imageURL}
        alt={name}
        className="w-full h-24 object-cover rounded-md"
      />

      {/* Contenido */}
      <div className="flex flex-col gap-2">
        {/* Nombre + precio */}
        <div>
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
            {name}
          </h3>
          <p className="mt-1 text-primary font-bold text-base">
            Bs {unitPrice}
          </p>
        </div>

        {/* Atributos extra si los tienes (color, talla, etc.) */}
        {/* Sustituye por tus props reales */}
        {/* Ejemplo separador */}
        {/* <div className="text-xs text-gray-600 border-t pt-1">Talla: 10Y</div> */}

        {/* Selector cantidad + icono borrar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center border rounded-md overflow-hidden">
            <button
              onClick={() => changeQuantity(orden, quantity - 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
            >
              −
            </button>
            <span className="px-4 select-none">{quantity}</span>
            <button
              onClick={() => changeQuantity(orden, quantity + 1)}
              className="w-8 h-8 flex items-center justify-center hover:bg-gray-100"
            >
              +
            </button>
          </div>

          {/* Eliminar */}
          {/* <button
            onClick={() => removeItem(_id)}
            className="text-gray-500 hover:text-red-600"
            aria-label="Eliminar"
          >
            🗑
          </button> */}
        </div>

        {/* Sub-total */}
        <div className="text-xs text-gray-500 pt-1 border-t">
          SUB-TOTAL&nbsp; <span className="float-right font-semibold">Bs{ subTotal.toFixed(2) }</span>
        </div>
      </div>
    </div>
  );
}
