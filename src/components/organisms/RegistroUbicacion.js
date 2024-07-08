import { useEffect, useState } from "react";
import Input from "../atoms/Input";
import Button from "../atoms/Button";

import { useNavigate } from 'react-router-dom';
import Maps from "../map/Map";
import AutoComplete from "../map/Buscardor";
import { NewMap } from "../map/NewMap";
import { MapComponent } from "../map/MapComponent";


export const RegistroUbicacion = () => {

 var options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  function success(pos) {
    var crd = pos.coords;
    console.log("Your current position is:");
    console.log(`Latitude : ${crd.latitude}`);
    console.log(`Longitude: ${crd.longitude}`);
    console.log(`More or less ${crd.accuracy} meters.`);

    const cordenada={
      'latitude':crd.latitude,
      'longitude':crd.longitude
    }

      setUbication({
       'coordinates':cordenada
      });

  }

  function errors(err) {
    console.warn(`ERROR(${err.code}): ${err.message}`);
  }

  const [ubication, setUbication] = useState({'coordinates':{'latitude':-17.8648362,'longitude':-63.1583475}})
  useEffect(() => {
    // getUserLocation();
    console.log(ubication);
  }, [])

  const getUserLocation = (event) => {
    event.preventDefault();

    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          console.log(result);
          if (result.state === "granted") {
            //If granted then you can directly call your function here
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "prompt") {
            //If prompt then the user will be asked to give permission
            navigator.geolocation.getCurrentPosition(success, errors, options);
          } else if (result.state === "denied") {
            //If denied then you have to show instructions to enable location
          }
        });
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

  }

  const navigate = useNavigate();
  const onSubmit = ( event ) => {
    event.preventDefault();
    console.log(ubication);
    //navigate('/servicios');
  }

  return (
  <>
    <form className="text-center" method="POST" onSubmit={ onSubmit } >

    <h3 className="mb-3 h3 text-left">Ingresa tu direccion</h3>
    <p className="mb-5 text-left text-gray-600" > loreDuis exercitation proident occaecat minim id magna tempor aliqua laborum veniam. </p>

    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        {/* <AutoComplete setUbication={setUbication} /> */}
      </div>
    </div>

    {/* <h3 className="font-normal hover:font-bold  text-primary mb-5">
      <button onClick={ getUserLocation }>
        Usar mi ubicacion actual
      </button>
    </h3>
 */}
    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        {
          <>
          <MapComponent />

          {/* <NewMap /> */}
          </>
        }
        {/* <p className="bg-info">London, United Kingdom</p> */}
        {/* <div className="map">
          {
            (!!ubication.coordinates)?
            <Maps address={ubication.direction}
                lat={ ubication.coordinates.latitude }
                lng={ ubication.coordinates.longitude }
                altura={true}
            />
            : ''

          }
        </div> */}


      </div>
    </div>



    <div className="col-span-full">
      <div className="mb-3 sm:mb-6">
        <Button type='submit'
          className="sm:h-[48px] !text-[14px]">
          Registrarse
        </Button>
      </div>
    </div>
  </form>

  </>

  )

}

export default RegistroUbicacion
