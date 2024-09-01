import { useEffect, useState } from "react";

const calculateDistance = async (origin, destination) => {
  try {
    const api_key = "AIzaSyBEdXyDKYlIu9xV8qcBidcDnfsAwIN0Luo";
    const proxyurl = "https://cors-anywhere.herokuapp.com/";
    const apiUrl = `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin.latitude},${origin.longitude}&destinations=${destination.latitude},${destination.longitude}&key=${api_key}`;

    const response = await fetch(apiUrl
    //   ,{
    //   method: "GET",
    //   mode: "cors",
    //   headers: {
    //       Accept: "application/json",
    //       "Content-Type": "application/json",
    //   }
    // }
  );
    const responseJSON = await response.json();

    if (responseJSON && responseJSON.rows[0].elements[0].status === "OK") {
      const distanceValue = responseJSON.rows[0].elements[0].distance.value;
      return distanceValue;
    } else {
      console.log("Error al calcular la distancia");
      return null;
    }
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

export const DistanceDisplay = ({ origin, destination }) => {
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    if (origin && destination) {
      calculateDistance(origin, destination).then((result) => {
        if (result !== null) {
          setDistance(result / 1000);
        }
      });
    }
  }, [origin, destination]);

  return (
    <>
            Distancia:{" "}
        {distance !== null ? `${distance.toFixed(2)} km` : "No Disponible"}
    </>
  );
};
