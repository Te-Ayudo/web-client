import { useDispatch } from 'react-redux';
import { setActiveModal, setActiveService } from '../../store/servicios';

export const Lista = ({ servicio }) => {
  const { _id, imageURL, unitPrice, name, description = "", variablePrice } = servicio;
  const dispatch = useDispatch();

  const onAddCart = () => {
    dispatch(setActiveService(servicio));
    dispatch(setActiveModal());
  };

  return (
    <div
      key={_id}
      onClick={onAddCart}
      className="group relative bg-white/90 backdrop-blur-md shadow-lg rounded-3xl overflow-hidden
                 ring-1 ring-gray-100 hover:shadow-2xl transition-shadow duration-300
                 cursor-pointer"
    >
      {/* Imagen (ya no está en un botón) */}
      <img
        src={imageURL}
        alt={name}
        className="w-full h-50 sm:h-64 object-cover transition-transform duration-300
                   group-hover:scale-105"
      />

      {/* Contenido */}
      <div className="p-4 flex flex-col gap-2">
        <h3 className="text-gray-900 font-semibold leading-tight line-clamp-1">{name}</h3>

        {description && (
          <p className="text-xs text-gray-500 leading-snug line-clamp-2">
            {description.length > 60 ? description.slice(0, 60) + "…" : description}
          </p>
        )}

        <div className="mt-1 flex items-center justify-between">
          <span className="text-sm font-bold text-primary">
            {variablePrice && <span className="text-xs text-gray-400 font-normal mr-1">Desde</span>}
            Bs {unitPrice}
          </span>

          <div
            className="btn-icon shrink-0 rounded-full bg-primary/10 text-primary
                       group-hover:bg-primary group-hover:text-white transition-colors duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="1.05em" height="1.05em" viewBox="0 0 24 24">
              <path fill="currentColor" d="M21 13h-8v8h-2v-8H3v-2h8V3h2v8h8z" />
            </svg>
          </div>
        </div>
      </div>

      {servicio.isTrending && (
        <span className="absolute top-3 left-3 rounded-full bg-green-500 px-2 py-0.5
                         text-[10px] font-semibold tracking-wide text-white shadow">
          DESTACADOS
        </span>
      )}
    </div>
  );
};