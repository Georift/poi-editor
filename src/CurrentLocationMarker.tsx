import { LocationEvent } from "leaflet";
import { useEffect, useState } from "react";
import { CircleMarker, useMapEvents } from "react-leaflet";

export const CurrentLocationMarker = () => {
  const [locationEvent, setLocationEvent] = useState<LocationEvent>();

  const map = useMapEvents({
    locationfound: (event) => setLocationEvent(event),
  });

  useEffect(() => {
    console.log("Starting location watching");
    map.locate({ watch: true });

    return () => {
      map.stopLocate();
    };
  }, [map]);

  // TODO: change the current pos marker to something people expect
  // TODO: add the location bounds to this marker
  // TODO: add the compass bearing to this marker
  return (
    <>
      {locationEvent && (
        <CircleMarker center={locationEvent.latlng} radius={2} />
      )}
    </>
  );
};
