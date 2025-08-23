import { Wrapper } from "@googlemaps/react-wrapper";

export const Mapv2 = ({ children }) => {
  const apiKey = "AIzaSyBEdXyDKYlIu9xV8qcBidcDnfsAwIN0Luo";

  if (!apiKey) {
    return <div>Cannot display the map: google maps api key missing</div>;
  }

  return <Wrapper apiKey={apiKey}>{children}</Wrapper>;
};
