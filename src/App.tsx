import "./App.css";

import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet";

import DownloadIcon from "@mui/icons-material/Download";

import { MapContainer, TileLayer } from "react-leaflet";

import * as R from "ramda";

import * as turf from "@turf/turf";
import { useState } from "react";
import { CurrentLocationMarker } from "./CurrentLocationMarker";
import { CircularProgress, Fab, MenuItem, Select } from "@mui/material";
import osmtogeojson from "osmtogeojson";
import { useQuery } from "react-query";

import { DivIconMarker } from "./DivIconMarker";
import { IDMapMarker } from "./IDMapMarker";
import { AusPostData } from "./AusPostData";

function App() {
  const [display, setDisplay] = useState<"post_office" | "post_box">(
    "post_office"
  );

  const { data: osmQueryData, isLoading: isLoadingOsmApi } = useQuery(
    ["osmDataAgain"],
    () => {
      return fetch(
        "https://api.openstreetmap.org/api/0.6/map?bbox=115.80551147460938,-32.053326175386076,115.80830097198486,-32.05200764122336",
        {
          headers: { Accept: "application/json" },
        }
      )
        .then((res) => res.json())
        .then((osmJson) => osmtogeojson(osmJson))
        .then((osmGeoJson) => {
          return turf.featureCollection(
            osmGeoJson.features.filter(({ id }) =>
              (typeof id === "string" ? id : "").startsWith("node/")
            ) as any
          );
        });
    },
    {
      // the user should manually trigger this
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  const { data: presetDefaults } = useQuery(
    ["presetDefaults"],
    () => {
      return fetch(
        "https://cdn.jsdelivr.net/npm/@openstreetmap/id-tagging-schema@3/dist/presets.min.json"
      ).then((res) => res.json());
    },
    {
      // the user should manually trigger this
      staleTime: Infinity,
      cacheTime: Infinity,
    }
  );

  console.log(osmQueryData);
  console.log(presetDefaults);

  return (
    <div>
      <Select
        sx={{ position: "absolute", top: 10, right: 10, zIndex: 1000 }}
        value={display}
        onChange={(e) => setDisplay((e as any).target.value)}
      >
        <MenuItem value="post_office">Post Office</MenuItem>
        <MenuItem value="post_box">Post Box</MenuItem>
      </Select>

      <Fab
        color="primary"
        size="small"
        sx={{ position: "absolute", left: 10, bottom: 75 }}
      >
        {!isLoadingOsmApi ? (
          <DownloadIcon />
        ) : (
          <CircularProgress size="small" />
        )}
      </Fab>

      <MapContainer
        center={[-32.0499, 115.8086]}
        zoom={15}
        maxZoom={25}
        style={{ height: "100vh", width: "100wv" }}
        zoomControl={false}
      >
        <>
          <TileLayer
            attribution={
              '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            }
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
            maxNativeZoom={18}
            maxZoom={25}
          />

          {osmQueryData &&
            osmQueryData.features
              .filter((f) => f?.properties?.highway !== "crossing")
              .map((f, i) => {
                const foundIcon = R.toPairs(f.properties || {})
                  .map(([key, value]) => `${key}/${value}`)
                  .map((k) => presetDefaults[k])
                  .filter(
                    (o) =>
                      typeof o === "object" &&
                      o !== null &&
                      typeof o.icon === "string" &&
                      (o.icon.startsWith("maki-") ||
                        o.icon.startsWith("temaki-") ||
                        o.icon.startsWith("fas-"))
                  )
                  .map((s) => s.icon)
                  .map((s) => (s.startsWith("maki-") ? s + "-15" : s));

                return (
                  <DivIconMarker
                    key={i}
                    marker={{
                      position: [...f.geometry.coordinates].reverse() as any,
                      eventHandlers: {
                        click: () => console.log(f),
                      },
                    }}
                    container={{ tagName: "svg" }}
                    divIconProps={{
                      className: "leaflet-id-icon",
                      iconSize: [18, 24],
                      iconAnchor: [9, 25],
                    }}
                  >
                    <IDMapMarker iconId={foundIcon[0]} />
                  </DivIconMarker>
                );
              })}

          <CurrentLocationMarker />

          {false && <AusPostData display={display} />}
        </>
      </MapContainer>
    </div>
  );
}

export default App;
