import React, { useEffect, useRef, useState } from "react";
import "./map.css";

import GoogleMap from 'google-maps-react-markers'
import { APIProvider,Map,Marker } from "@vis.gl/react-google-maps";

//import Autocomplete from "react-google-autocomplete";

const Maps = ({ address="santa cruz, Bolivia, Av. cumavi", lat="-17.7917873", lng="-63.1355414", drag=true, altura =false }) => {

  const [location, setLocation] = useState({address,lat,lng})

  useEffect(() => {
    setLocation({address,lat,lng})
  }, [lat,lng])

  useEffect(() => {
    console.log(address,lat,lng);
  }, [])


  const divStyle = {
    height: altura ? '20vh' : '60vh',
  };

  return (
    <APIProvider apiKey="AIzaSyDTLtxGuSpbM9VRudSVAUAjuilzLKnHQCk" >

   <div className="map">

      <div className="google-map"
        style={ divStyle }
      >
      <Map center={location} zoom={16}
        gestureHandling={'greedy'}
        disableDefaultUI={true}
      >

        <Marker
          position={location}
          title={'clickable google.maps.Marker'}
          draggable={drag}
          onDrag={e =>
             setLocation({address:"hello",lat: e.latLng?.lat() ?? 0, lng: e.latLng?.lng() ?? 0})
          }
        />

      </Map>

      </div>
    </div>
    </APIProvider>
  );
};

export default Maps;
