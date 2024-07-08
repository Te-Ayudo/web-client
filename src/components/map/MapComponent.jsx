import { GoogleMaps } from "./GoogleMaps"
import { Mapv2 } from "./Mapv2"

export const LOCATIONS =
  { lat:-17.78629, lng:-63.18117 }
;

export const MapComponent = () => {
  return (
    <Mapv2 >
      <GoogleMaps locations={LOCATIONS} />
    </Mapv2>
  )
}
