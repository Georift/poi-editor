import { LatLng } from "leaflet";
import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import { IDMapMarker } from "./IDMapMarker";

import TickIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { Fab, Tooltip } from "@mui/material";

export const AddNewMarker = ({
  onSave,
  onClose,
}: {
  onSave: (o?: LatLng) => void;
  onClose: () => void;
}) => {
  const [mapCenter, setMapCenter] = useState<LatLng>();

  useMapEvents({
    move: (event) => setMapCenter(event.target.getCenter()),
  });

  return (
    <>
      <div
        style={{
          position: "absolute",
          top: "calc(50% - 10px)",
          left: "50%",
          transform: "translateX(-50%) translateY(-50%)",
          zIndex: 1000,
        }}
        onClick={() => onSave(mapCenter)}
      >
        <IDMapMarker />
      </div>

      <Tooltip title="Stop adding a new place" placement="left">
        <Fab
          color="error"
          size="small"
          sx={{ position: "absolute", right: 10, bottom: 75 }}
          onClick={() => onClose()}
        >
          <CloseIcon />
        </Fab>
      </Tooltip>
      <Tooltip title="Add a place at this position" placement="left">
        <Fab
          color="primary"
          size="small"
          sx={{ position: "absolute", right: 10, bottom: 25 }}
          onClick={() => onSave(mapCenter)}
        >
          <TickIcon />
        </Fab>
      </Tooltip>
    </>
  );
};

AddNewMarker.defaultProps = {
  onClose: () => {},
};
