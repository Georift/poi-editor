import { Fab } from "@mui/material";
import { LocationEvent } from "leaflet";
import { useEffect, useState } from "react";
import { CircleMarker, useMapEvents } from "react-leaflet";
import MyLocationIcon from "@mui/icons-material/MyLocation";

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
      <Fab
        color="primary"
        size="small"
        sx={{ position: "absolute", bottom: 25, left: 10 }}
        disabled={!locationEvent}
        onClick={() => locationEvent && map.flyTo(locationEvent?.latlng)}
      >
        <MyLocationIcon />
      </Fab>
    </>
  );
};
