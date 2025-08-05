import React, { useState, useRef, useCallback } from "react";
import ReactDOM from "react-dom";
import {
  useLoadScript,
  MarkerF,
  StandaloneSearchBox,
  StreetViewService,
  GoogleMap,
  AdvancedMarker
} from "@react-google-maps/api";

const loaderId = "ownersTownGoogleMapApiId";
const config = {
  googleMapsApiKey: "AIzaSyBEdXyDKYlIu9xV8qcBidcDnfsAwIN0Luo",
  // language: "en",
  // region: "IN",
  // version: "weekly",
  // libraries: ["places"],
  // preventGoogleFontsLoading: true,
  // id: loaderId
};


export const NewMap = ( { searchEnabled, onCenter }) => {
    const { isLoaded, loadError } = useLoadScript(config);
  const Loading = <div>Loader</div>;
  // const center = { lat: 12.972442, lng: 77.580643 };
// const center = {
//   lat: 43.6532,
//   lng: -79.3832
// };
  const center ={ lat:-17.7917873, lng:-63.1355414 };
  const [location, setLocation] = useState(center);
  const markerRef = useRef(null);
  const mapRef = useRef(null);

  function onClick(...args) {
  }

  function setNewLocation() {
  }

  function onPlacesChanged(...args) {
    //setNewLocation();
  }

  function onDragEnd(...args) {
    setLocation({
      lat: markerRef.current.position.lat(),
      lng: markerRef.current.position.lng()
    });
     //setNewLocation();
  }

  const onLoad = useCallback(
    map => {
      mapRef.current = map;
    },
    [onPlacesChanged]
  );

  const onMarkerLoad = useCallback(
    marker => {
      markerRef.current = marker;
    },
    [onDragEnd]
  );

  const onCentrar = () =>{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
    else {
      console.error('Geolocation is not supported by this browser.');
    }
  }



    const renderMap = (
<>

    <h3 className="font-normal hover:font-bold  text-primary mb-5">
      <button onClick={ onCentrar }>
        Usar mi ubicacion actuala
      </button>
    </h3>



    <GoogleMap
      id="searchbox-example"
      mapContainerStyle={{
        height: "300px",
        width: "100%"
      }}
      zoom={15}
      center={center}
      onClick={onClick}
    >
      {/* {searchEnabled ? (
        <StandaloneSearchBox onLoad={onLoad} onPlacesChanged={onPlacesChanged}>
          <input
            type="text"
            placeholder="Find your place"
            style={{
              boxSizing: "border-box",
              border: "1px solid transparent",
              width: "240px",
              backgroundColor: "#fff",
              height: "32px",
              padding: "0 12px",
              borderRadius: "3px",
              boxShadow: "0 2px 6px rgba(0, 0, 0, 0.3)",
              fontSize: "14px",
              outline: "none",
              textOverflow: "ellipses",
              position: "absolute",
              left: 0,
              right: 0,
              margin: "0 auto"
            }}
          />
        </StandaloneSearchBox>
      ) : (
        <StreetViewService />
      )} */}
       <MarkerF
        position={location}
        draggable={true}
         onDragEnd={onDragEnd}
         onLoad={onMarkerLoad}
      />

    {/* <AdvancedMarker position={location} /> */}

     {/*  <Marker
        position={location}
        draggable
        onDragEnd={onDragEnd}
        onLoad={onMarkerLoad}
      />  */}
    </GoogleMap>

</>
   );
   if (loadError) {
     return <div>Map cannot be loaded right now, sorry.</div>;
   }

   return isLoaded ? renderMap : Loading;
}
