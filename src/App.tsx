import "./App.css";

import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet";

import LinearProgress from "@mui/material/LinearProgress";
import DownloadIcon from "@mui/icons-material/Download";

import * as L from "leaflet";

import {
  CircleMarker,
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { useAuspostLocations, useJoinedData, useOSMLocations } from "./hooks";

import * as R from "ramda";

import * as turf from "@turf/turf";
import { useMemo, useState } from "react";
import { CurrentLocationMarker } from "./CurrentLocationMarker";
import { CircularProgress, Fab, MenuItem, Select } from "@mui/material";
import osmtogeojson from "osmtogeojson";
import { useQuery } from "react-query";

import { DivIconMarker } from "./DivIconMarker";
import { IDMapMarker } from "./IDMapMarker";

const isPostOffice = (obj: any) =>
  obj.properties.type === "PO" || obj.properties.amenity === "post_office";

const isPostBox = (obj: any) =>
  obj.properties.type === "R_SPB" ||
  obj.properties.type === "C_SPB" ||
  obj.properties.amenity === "post_box";

function App() {
  const { data: auspostData, isLoading: isLoadingAuspost } =
    useAuspostLocations();
  const { data: osmData, isLoading: isLoadingOsm } = useOSMLocations();

  const isLoading = isLoadingAuspost || isLoadingOsm;

  const [display, setDisplay] = useState<"post_office" | "post_box">(
    "post_office"
  );

  const osmFeatureIndex = useMemo(
    () => R.indexBy(({ id }) => id, osmData ? osmData.features : ([] as any)),
    [osmData]
  );

  const [shownObject, setShownObject] = useState<any>();

  const { auspostToOsm, osmToAuspost } = useJoinedData(
    osmData as any,
    auspostData,
    { mergingDistance: display === "post_office" ? 0.5 : 0.1 }
  );

  const showFn = display === "post_office" ? isPostOffice : isPostBox;

  const osmConnection =
    typeof shownObject === "string" &&
    [osmToAuspost.get(shownObject), osmFeatureIndex[shownObject]]
      .filter((o) => !!o)
      .map((o) => turf.centroid(o).geometry.coordinates.reverse());

  const auspostConnection =
    typeof shownObject === "object" &&
    shownObject !== null &&
    [shownObject, osmFeatureIndex[auspostToOsm.get(shownObject)]]
      .filter((o) => !!o)
      .map((o) => turf.centroid(o).geometry.coordinates.reverse());

  const connection = osmConnection || auspostConnection;

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
      {isLoading && <LinearProgress />}

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
            osmQueryData.features.map((f, i) => {
              const foundIcon = R.toPairs(f.properties || {})
                .map(([key, value]) => `${key}/${value}`)
                .map((k) => presetDefaults[k])
                .filter(
                  (o) =>
                    typeof o === "object" &&
                    o !== null &&
                    typeof o.icon === "string" &&
                    o.icon.startsWith("maki-")
                );

              return (
                <DivIconMarker
                  key={i}
                  marker={{
                    position: [...f.geometry.coordinates].reverse() as any,
                  }}
                  container={{ tagName: "svg" }}
                  divIconProps={{
                    className: "leaflet-id-icon",
                    iconSize: [18, 24],
                    iconAnchor: [9, 25],
                  }}
                >
                  <IDMapMarker
                    iconId={
                      foundIcon.length > 0
                        ? `${foundIcon[0].icon}-15`
                        : undefined
                    }
                  />
                </DivIconMarker>
              );
            })}

          <CurrentLocationMarker />

          {osmData &&
            osmData.features.filter(showFn).map((feature, i) => {
              const latLong = turf
                .centroid(feature as any)
                .geometry.coordinates.reverse();

              const color = osmToAuspost.has(feature.id)
                ? "#36b436"
                : "#75cff0";

              return (
                <CircleMarker
                  key={`osm-${i}-${color}`}
                  center={latLong as any}
                  radius={10}
                  color={color}
                  weight={1}
                  opacity={1}
                  eventHandlers={{
                    click: () => setShownObject(feature.id),
                  }}
                >
                  <Popup>
                    <b>OSM Data</b>
                    <pre>{JSON.stringify(feature.properties, null, 2)}</pre>
                  </Popup>
                </CircleMarker>
              );
            })}

          {auspostData &&
            auspostData.features
              .filter(showFn)
              .map((feature: any, i: number) => {
                const latLong = turf
                  .centroid(feature as any)
                  .geometry.coordinates.reverse();

                const color = auspostToOsm.has(feature) ? "#36b436" : "#dc1928";

                return (
                  <CircleMarker
                    key={`aus-${i}-${color}`}
                    center={latLong as any}
                    radius={10}
                    color={color}
                    weight={1}
                    opacity={1}
                    eventHandlers={{
                      click: () => setShownObject(feature),
                    }}
                  >
                    <Popup>
                      <b>AusPost Data</b>
                      <pre>
                        {JSON.stringify(
                          R.omit(
                            ["geo_location", "hours", "service_codes"],
                            feature.properties
                          ),
                          null,
                          2
                        )}
                      </pre>
                    </Popup>
                  </CircleMarker>
                );
              })}

          {connection && connection.length === 2 && (
            <Polyline positions={connection as any} />
          )}
        </>
      </MapContainer>
    </div>
  );
}

export default App;
