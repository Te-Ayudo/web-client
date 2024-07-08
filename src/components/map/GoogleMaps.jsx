import React, { useEffect, useRef, useState } from "react";
import { createCustomEqual } from "fast-equals";
import Input from "../atoms/Input";
import { useForm } from "../../hooks/useForm";
import { Alert, AlertS } from "../atoms/Alert";
import { useDispatch, useSelector } from "react-redux";
import { startCreateAddress } from "../../store";


const DEFAULT_CENTER ={ lat:-17.7917873, lng:-63.1355414 };
const DEFAULT_ZOOM = 15;

const formData = {
  nombre: ''
}

const formValidations = {
  nombre: [ (value) => value.length >= 4, 'El nombre debe tener mas de 4 letras.' ],
}

export const GoogleMaps = ({locations,className}) => {
  const ref = useRef(null);

  const dispatch = useDispatch();

  const [center, setCenter] = useState(locations);
  const [clicks, setClicks] = useState([]);
  const [current, setCurrent] = useState({});
  const [formSubmitedd, setFormSubmitedd] = useState(false);

  const [showhelper, setShowhelper] = useState(false);

  const {success,error} = useSelector( state => state.booking );

  const { formState,nombre,onInputChange,isFormValid,nombreValid } = useForm(formData,formValidations);

  useEffect(() => {

    if(clicks.length === 0 && Object.entries(current).length === 0 ){
     setShowhelper(true);
    }else{
      setShowhelper(false);
    }

  }, [clicks,current])


  const onClick = (e) => {
    console.log(e.latLng);
    setClicks([e.latLng]);
    setCurrent({});
  };

  const onSubmit = (event) => {
    setFormSubmitedd(true);
    if(clicks.length === 0 && Object.entries(current).length === 0 ){
      return ;
    }
    if( !isFormValid ) return ;
    let coor;
    if(clicks.length === 0 ){
      coor=current;
    }else{
      clicks.map((latLng,i)=>{
        console.log(latLng.toJSON());
        coor=latLng.toJSON();
      })
    }

    dispatch(startCreateAddress(nombre,coor));



  }

  const onIdle = (m) => {
    console.log("onIdle");
    // setZoom(m.getZoom()!);
    // setCenter(m.getCenter()!.toJSON());
  };

  const form = (
    <div
      style={{
        padding: "1rem",
        flexBasis: "250px",
        height: "100%",
        overflow: "auto"
      }}
    >

      {/* <h3>{ (clicks.length === 0 && Object.entries(current).length === 0) ? "Click en usar ubicacion actual o en el mapa " : ""}</h3> */}

      <span className= {`text-red-700 ${ showhelper ? "" : "hidden"  } `} > { "Click en usar ubicacion actual o en el mapa " } </span>

      <div className="mb-1" >
        <Input
          type="text"
          label="Alias de la Ubicacion"
          name="nombre"
          value={ nombre }
          onChange={ onInputChange }
          error={ !!nombreValid && formSubmitedd}
          helperText={ nombreValid }
        />

      </div>

      {/* {clicks.map((latLng, i) => (
        <pre key={i}>{JSON.stringify(latLng.toJSON(), null, 2)}</pre>
      ))} */}
    <div className={`col-span-full ${!!error?'':'hidden'} `}  >
      { <Alert mensaje={ error} /> }
    </div>
    <div className={`col-span-full ${!!success?'':'hidden'} `}  >
      { <AlertS mensaje={ success} /> }
    </div>

    {/* <div className={`col-span-full ${!!error?'':'hidden'} `}  >
      <Alert mensaje={error} />
    </div> */}

      <div className="flex items-center justify-center" >
        <button
          className="btn-base text-[12px] sm:text-[15px] lg:text-[20px] bg-primary text-white"
          onClick={() => onSubmit()}>Guardar Ubicación</button>
      </div>
    </div>
  );

  const getUserLocation = (event) => {
    event.preventDefault();

    if (navigator.geolocation) {

      navigator.geolocation.getCurrentPosition(
        (position) => {
          // save the geolocation coordinates in two variables
          const { latitude, longitude } = position.coords;
          const latlng = {
            'lat':latitude,
            'lng':longitude
          }
            setCurrent(latlng);
            setClicks([])
            setCenter({ ...center, lat: Number(latitude) , lng: Number(longitude) })

        },
        // if there was an error getting the users location
        (error) => {
          console.error('Error getting user location:', error);
        }
      );

    } else {
      console.log("Geolocation is not supported by this browser.");
    }

  }

  return (
    <>
      {/* <div
        ref={ref}
        style={{ width: "100%", height: "300px" }}
      /> */}
        <h3 className="font-normal hover:font-bold  text-primary mb-5">
          <button onClick={ getUserLocation }>
            Usar mi ubicacion actual
          </button>
        </h3>

        <Map
          center={center}
          onClick={onClick}
          onIdle={onIdle}
          zoom= {DEFAULT_ZOOM}
          style={{ flexGrow: "1", width: "100%", height:"300px" }}
        >
          {clicks.map((latLng, i) => (
            <Marker key={i} position={latLng} />
          ))}
          { Object.entries(current).length === 0 ? ( ''):(<Marker position={current} />)
          }

        </Map>

    {form}
    </>
  );
};



const Map = ({
  onClick,
  onIdle,
  children,
  style,
  ...options
}) => {
  const ref = useRef(null);
  const [map, setMap] = useState();

  useEffect(() => {
    if (ref.current && !map) {
      setMap(new window.google.maps.Map(ref.current, {}));
    }
  }, [ref, map]);

  // because React does not do deep comparisons, a custom hook is used
  // see discussion in https://github.com/googlemaps/js-samples/issues/946
  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  useEffect(() => {
    if (map) {
      ["click", "idle"].forEach((eventName) =>
        window.google.maps.event.clearListeners(map, eventName)
      );

      if (onClick) {
        map.addListener("click", onClick);
      }

      if (onIdle) {
        map.addListener("idle", () => onIdle(map));
      }
    }
  }, [map, onClick, onIdle]);
  console.log(React.Children);

  return (
    <>
      <div ref={ref} style={style} />
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          // set the map prop on the child component
          return React.cloneElement(child, { map });
        }
      })}
    </>
  );
};


const Marker = (options) => {
  const [marker, setMarker] = useState();

  React.useEffect(() => {
    if (!marker) {
      setMarker(new window.google.maps.Marker());
    }

    // remove marker from map on unmount
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);

  React.useEffect(() => {
    if (marker) {
      marker.setOptions(options);
    }
  }, [marker, options]);

  return null;
};

const deepCompareEqualsForMaps = createCustomEqual(
  (deepEqual) => (a, b) => {
    if (
      (a) ||
      a instanceof window.google.maps.LatLng ||
      (b) ||
      b instanceof window.google.maps.LatLng
    ) {
      return new window.google.maps.LatLng(a).equals(new window.google.maps.LatLng(b));
    }

    // TODO extend to other types
    // use fast-equals for other objects
    return deepEqual(a, b);
  }
);

function useDeepCompareMemoize(value) {
  const ref = React.useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

function useDeepCompareEffectForMaps(
  callback,
  dependencies
) {
  React.useEffect(callback, dependencies.map(useDeepCompareMemoize));
}
