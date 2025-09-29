import { useDispatch } from "react-redux";
import { BOOKING_SET_BRANCH } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export const SucursalesItem = (item) => {
  const { providerid } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { index = 0 } = item;

  const [, setUbicacion] = useState({});

  useEffect(() => {
    const position = {
      latitude: JSON.parse(localStorage.getItem("latitude")),
      longitude: JSON.parse(localStorage.getItem("longitude")),
    };
    setUbicacion(position);
  }, []);

  const { _id, addressInfo, name } = item;

  const onSelect = () => {
    console.log("🏢 Seleccionando sucursal:", { name, _id });
    dispatch(BOOKING_SET_BRANCH(item));
    navigate(`/${providerid}/empresa/${item._id}`);
  };

  // const onUbicacion = () => {
  //   window.open(`https://www.google.com/maps?q=${addressInfo.coordinates[1]},${addressInfo.coordinates[0]}`, "_blank");
  // };

  return (
    <li key={_id}>
      <div className="bg-white rounded-2xl shadow-md p-4 h-full">
        <div className="mb-2">
          <h2 className="text-lg font-semibold text-[#1E1E1E]">{name}</h2>
          <p className="text-sm text-[#6B7280]">
            {addressInfo.street} <br />
            {addressInfo.city}, {addressInfo.country}
          </p>
        </div>

        <div className="flex justify-between items-center gap-2 flex-col sm:flex-row mt-4">
          <button
            onClick={onSelect}
            className="bg-[#FF770F] text-white px-4 py-2 rounded-full w-full sm:w-auto text-sm font-semibold hover:bg-orange-600 transition"
            data-tour="seleccionar-sucursal"
            data-sucursal-name={name}
            data-index={index}
            data-cy="btn-select-branch"
          >
            Seleccionar sucursal
          </button>

          <button
            onClick={() => navigate(`${window.location.pathname}/${_id}`)}
            className="border border-[#FF770F] text-[#FF770F] px-4 py-2 rounded-full w-full sm:w-auto text-sm font-semibold hover:bg-orange-100 transition"
            data-tour="ver-ubicacion"
            data-sucursal-name={name}
            data-index={index}
          >
            Ubicación
          </button>
        </div>
      </div>
    </li>
  );
};
