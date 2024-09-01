import { useDispatch, useSelector } from "react-redux";
import { BOOKING_SET_BRANCH } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import { DistanceDisplay } from "../../api/DistanceDisplay";
import { useEffect, useState } from "react";

export const SucursalesItem = (item) => {
  const {providerid} = useParams();
  const booking = useSelector((state) => state.booking.selected);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ubicacion, setUbicacion] = useState({});

  useEffect(() => {

     const position = {
      'latitude': JSON.parse(localStorage.getItem('latitude')),
      'longitude': JSON.parse(localStorage.getItem('longitude'))
     }
     setUbicacion(position)
  }, [])



  const { id,addressInfo,name } = item;

  const onSelect = (item) => {
    dispatch( BOOKING_SET_BRANCH(item) );
    navigate(`/${providerid}/empresa`);
  }

  return (
    <>
      <li key={id}>
        <div className="grid grid-cols-2 gap-4 mb-5">
          <article onClick={ () => onSelect(item) } className="flex items-start space-x-6 cursor-pointer">
            <div className="relative h-full flex flex-col justify-end">
              <h2 className="text-secondary">{name}</h2>
              <dl className="mt-2 flex text-sm leading-6 font-medium">
                <dt className="mr-3">
                  { addressInfo.street }
                </dt>
                <dd className="font-semibold text-secondary"></dd>
              </dl>
            </div>
          </article>
          <div className="flex flex-col justify-end align-end ">
            <div className="text-right">  </div>
            <div className="text-primary text-right">
               <DistanceDisplay
                   origin={ubicacion}
                   destination={addressInfo.coordinates}
               />
            </div>
          </div>
        </div>
      </li>
    </>
  );
}
