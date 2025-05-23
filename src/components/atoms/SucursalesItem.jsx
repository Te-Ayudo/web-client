import { useDispatch, useSelector } from "react-redux";
import { BOOKING_SET_BRANCH } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import { DistanceDisplay } from "../../api/DistanceDisplay";
import { useEffect, useState } from "react";

export const SucursalesItem = (item) => {
  const { providerid } = useParams();
  const booking = useSelector((state) => state.booking.selected);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ubicacion, setUbicacion] = useState({});

  useEffect(() => {
    const position = {
      latitude: JSON.parse(localStorage.getItem("latitude")),
      longitude: JSON.parse(localStorage.getItem("longitude")),
    };
    setUbicacion(position);
  }, []);

  const { id, addressInfo, name } = item;

  const onSelect = () => {
    dispatch(BOOKING_SET_BRANCH(item));
    navigate(`/${providerid}/empresa`);
  };

  const onUbicacion = () => {
    window.open(`https://www.google.com/maps?q=${addressInfo.coordinates[1]},${addressInfo.coordinates[0]}`, "_blank");
  };

  return (
    <li key={id}>
      <div className="bg-white rounded-2xl shadow-md p-4 mb-4">
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
          >
            Seleccionar sucursal
          </button>

          <button
            onClick={() => navigate(`${window.location.pathname}/${id}`)}
            className="border border-[#FF770F] text-[#FF770F] px-4 py-2 rounded-full w-full sm:w-auto text-sm font-semibold hover:bg-orange-100 transition"
          >
            Ubicación
          </button>
        </div>
      </div>
    </li>
  );
};
