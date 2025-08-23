import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { startListSucursales } from "../../store/branch";

import Main from "../templates/Main";
import Header from "../organisms/HeaderInit";
import Maps from "../map/Map";
import Button from "../atoms/Button";
import { BiArrowBack } from "react-icons/bi";

export const Ubication = () => {
  const { sucursalid } = useParams();
  const dispatch = useDispatch();
  const branches = useSelector((state) => state.branch.item);
  const navigate = useNavigate();

  const branch = branches.find((sucursal) => sucursal._id === sucursalid);

  useEffect(() => {
    dispatch(startListSucursales());
  }, []);

  const createRoute = (lat, lng) => {
    const urlAndroid = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    const newWindow = window.open(urlAndroid, "_blank", "noopener,noreferrer");
    if (newWindow) newWindow.opener = null;
  };

  if (!branch) {
    return (
      <Main header={<Header />}>
        <div className="text-center mt-10 text-secondary font-semibold">Cargando ubicación...</div>
      </Main>
    );
  }

  const { addressInfo, name } = branch;

  return (
    <Main header={<Header />}>
      <div className="container mx-auto px-4 py-6 flex flex-col gap-6">
        <div>
          <div className="relative flex items-start justify-center">
            {/* Botón de volver */}
            <button
              onClick={() => navigate(-1)}
              className="
                      absolute -left-5 sm:left-0 -top-3 sm:top-1
                      bg-[#FF770F] hover:bg-orange-600
                      text-white text-xl sm:text-2xl
                      rounded-[12px] sm:rounded-[14px]
                      w-9 h-9 sm:w-10 sm:h-10
                      flex items-center justify-center
                      shadow-[0_4px_12px_rgba(0,0,0,0.15)]
                      transition duration-300
                    "
            >
              ❮
            </button>

            {/* Título y subtítulo centrados */}
            <div className="text-center w-full">
              <h2 className="text-xl font-semibold text-primary">{name}</h2>
              <p className="text-secondary">{addressInfo.street}</p>
            </div>
          </div>
        </div>

        <Maps
          lat={addressInfo.coordinates.latitude}
          lng={addressInfo.coordinates.longitude}
          altura={false}
          drag={false}
        />

        <div className="flex justify-center">
          <Button
            onClick={() => createRoute(addressInfo.coordinates.latitude, addressInfo.coordinates.longitude)}
            className="sm:h-[48px] !text-[14px] px-6"
          >
            Cómo llegar
          </Button>
        </div>
      </div>
    </Main>
  );
};
