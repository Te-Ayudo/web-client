import React from "react";
import { useRef, useEffect } from "react";
import "./styles.css";

const AutoComplete = ({ setUbication }) => {
  const autoCompleteRef = useRef();
  const inputRef = useRef();
  const options = {};

  useEffect(() => {
    autoCompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, options);

    autoCompleteRef.current.addListener("place_changed", async function () {
      const { geometry, name, formatted_address, vicinity } = await autoCompleteRef.current.getPlace();

      const location = geometry.location;
      const lat = location.lat();
      const lng = location.lng();

      const direcion = {
        coordinates: {
          latitude: lat,
          longitude: lng,
        },
        name: name,
        direction: formatted_address,
        referencia: vicinity,
      };

      // setAutocomplete(direcion);
      setUbication(direcion);
    });
  }, []);
  return (
    <div>
      {/* <label>enter address :</label> */}

      <div className="flex justify-end flex-row-reverse  rounded-2xl border-solid border-2 border-primary mb-3 sm:mb-0  p-2.5">
        <input className="w-full rounded-2xl text-secondary" ref={inputRef} />
      </div>

      {/* <Input
          ref={inputRef}
          name="nombre"
          type="text"
          label="Escribe tu direccion"
        /> */}
    </div>
  );
};
export default AutoComplete;
