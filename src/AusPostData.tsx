import * as turf from "@turf/turf";
import * as R from "ramda";
import { useMemo, useState } from "react";
import { CircleMarker, Polyline, Popup } from "react-leaflet";
import { useAuspostLocations, useJoinedData, useOSMLocations } from "./hooks";

export const AusPostData = ({
  display,
}: {
  display: "post_office" | "post_box";
}) => {
  const { data: auspostData } = useAuspostLocations();
  const { data: osmData } = useOSMLocations();

  const [shownObject, setShownObject] = useState<any>();

  const osmFeatureIndex = useMemo(
    () => R.indexBy(({ id }) => id, osmData ? osmData.features : ([] as any)),
    [osmData]
  );

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
    <>
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
    </>
  );
};

const isPostOffice = (obj: any) =>
  obj.properties.type === "PO" || obj.properties.amenity === "post_office";

const isPostBox = (obj: any) =>
  obj.properties.type === "R_SPB" ||
  obj.properties.type === "C_SPB" ||
  obj.properties.amenity === "post_box";
