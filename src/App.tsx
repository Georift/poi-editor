import "./App.css";

import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet";

import LinearProgress from "@mui/material/LinearProgress";

import {
  CircleMarker,
  MapContainer,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import { useAuspostLocations, useJoinedData, useOSMLocations } from "./hooks";

import * as R from "ramda";

import * as turf from "@turf/turf";
import { useMemo, useState } from "react";
import { CurrentLocationMarker } from "./CurrentLocationMarker";
import { MenuItem, Select } from "@mui/material";

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
      <MapContainer
        center={[-32.0499, 115.8086]}
        zoom={15}
        style={{ height: "100vh", width: "100wv" }}
        zoomControl={false}
      >
        <TileLayer
          attribution={
            '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          }
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}@2x.png"
        />

        <CurrentLocationMarker />

        {osmData &&
          osmData.features.filter(showFn).map((feature, i) => {
            const latLong = turf
              .centroid(feature as any)
              .geometry.coordinates.reverse();

            const color = osmToAuspost.has(feature.id) ? "#36b436" : "#75cff0";

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
          auspostData.features.filter(showFn).map((feature: any, i: number) => {
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
      </MapContainer>
    </div>
  );
}

export default App;
