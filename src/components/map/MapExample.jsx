import React, { useState } from "react";
import GoogleMapReact from "google-map-react";

export const MapExample = () => {
  const [state, setState] = useState({
    center: {
      lat: 29.293127,
      lng: -94.878984,
    },
    zoom: 12,
  });

  return (
    <div style={{ width: 500, height: 400, margin: "auto", marginTop: 40 }}>
      <GoogleMapReact
        className="react-map"
        bootstrapURLKeys={{ key: "AIzaSyBEdXyDKYlIu9xV8qcBidcDnfsAwIN0Luo" }}
        defaultCenter={{
          lat: 29.293127,
          lng: -94.878984,
        }}
        defaultZoom={state.zoom}
        center={state.center}
        onChange={({ center, zoom }) => {
          setState({ center: center, zoom: zoom });
        }}
      ></GoogleMapReact>
    </div>
  );
};
