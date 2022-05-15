import { Fab, Tooltip } from "@mui/material";
import { helpers } from "@turf/turf";
import { useEffect, useState } from "react";

import TickIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";

import { compare, Operation } from "fast-json-patch";

export const EditModal = ({
  edit,
  onSave,
  onClose,
}: {
  edit: helpers.Feature;
  onSave: (patch: Operation[]) => void;
  onClose: () => void;
}) => {
  const [editText, setEditText] = useState<string>();

  useEffect(() => {
    setEditText(JSON.stringify(edit.properties, null, 2));
  }, [edit]);

  const handleSave = () => {
    if (!editText) {
      // nothing to do when saving a empty string
      onSave([]);
      return;
    }

    const patch = compare(
      edit as any,
      {
        ...edit,
        properties: {
          ...edit.properties,
          ...JSON.parse(editText),
        },
      },
      true
    );
    onSave(patch);
  };

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        backgroundColor: "white",
        padding: 25,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Tooltip title="Discard changes" placement="left">
        <Fab
          color="error"
          size="small"
          sx={{ position: "absolute", right: 10, bottom: 75 }}
          onClick={() => onClose()}
        >
          <CloseIcon />
        </Fab>
      </Tooltip>
      <Tooltip title="Save changes" placement="left">
        <Fab
          color="primary"
          size="small"
          sx={{ position: "absolute", right: 10, bottom: 25 }}
          onClick={() => handleSave()}
        >
          <TickIcon />
        </Fab>
      </Tooltip>

      <textarea
        value={editText}
        onChange={(event) => setEditText(event.target.value)}
        style={{ width: "100%", flex: 1 }}
      />
    </div>
  );
};
