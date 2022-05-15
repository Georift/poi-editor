import { useQuery } from "react-query";
import osmtogeojson from "osmtogeojson";

import {
  FeatureCollection,
  GeometryObject,
  MultiPoint,
  Point,
  pointsWithinPolygon,
  Properties,
} from "@turf/turf";
import { useMemo } from "react";

import * as turf from "@turf/turf";

import * as R from "ramda";

const ONE_HOUR = 1000 * 60 * 60;
const ONE_DAY = 1000 * 60 * 60 * 24;

export const useAuspostLocations = () => {
  return useQuery(
    ["auspost"],
    () => {
      return fetch(
        "https://cdn.jsdelivr.net/gh/Georift/auspost-locations/metro-perth-geojson.json"
      )
        .then((res) => res.json())
        .then((geojson) =>
          pointsWithinPolygon(geojson as any, boundingBox as any)
        );
    },
    {
      // this will rarely change, they aren't adding/removing stores that often
      staleTime: ONE_DAY * 7,
      cacheTime: Infinity,
    }
  );
};

export const useOSMLocations = () => {
  return useQuery(
    ["overpass"],
    () =>
      fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: `
[out:json];
(
  nwr["amenity"="post_office"](-32.14567625378891,115.69255828857422,-31.87522527511162,116.08222961425781);
  nwr["amenity"="post_box"](-32.14567625378891,115.69255828857422,-31.87522527511162,116.08222961425781);
  nwr["amenity"="vending_machine"]["vending"="parcel_pickup"](-32.14567625378891,115.69255828857422,-31.87522527511162,116.08222961425781);
);
(._;>>;);
out;`,
      })
        .then((res) => res.json())
        .then((osm) => osmtogeojson(osm)),
    {
      staleTime: ONE_HOUR,
      cacheTime: Infinity,
    }
  );
};

const boundingBox = {
  type: "Feature",
  properties: {},
  geometry: {
    type: "Polygon",
    coordinates: [
      [
        [115.69255828857422, -32.14567625378891],
        [116.08222961425781, -32.14567625378891],
        [116.08222961425781, -31.87522527511162],
        [115.69255828857422, -31.87522527511162],
        [115.69255828857422, -32.14567625378891],
      ],
    ],
  },
};

/**
 * "PO" = Post office
 * "UPL" = Parcel Locker
 * "R_SPB" = Red Post Box
 * "C_SPB" = Express Post Box
 * "PO C" = Parcel Collect
 */
export type AuspostFeatureType = "PO" | "UPL" | "R_SPB" | "C_SPB" | "PO C";

export const useJoinedData = (
  osmData: FeatureCollection<GeometryObject, any> | undefined,
  auspostData: FeatureCollection<Point | MultiPoint, Properties> | undefined,
  { mergingDistance }: { mergingDistance: number }
) => {
  return useMemo(() => {
    const auspostToOsm = new Map();
    const osmToAuspost = new Map();

    const osmByType = R.groupBy(
      ({ properties }) => (properties ? properties.amenity : "undefined"),
      osmData ? osmData.features : []
    );

    console.log(osmByType);

    const auspostTypeToOSMType = {
      PO: "post_office",
      UPL: "vending_machine",
      R_SPB: "post_box",
      C_SPB: "post_box",
    };

    (auspostData ? auspostData.features : [])
      .filter((feature) =>
        Object.keys(auspostTypeToOSMType).includes(
          (feature.properties as any).type
        )
      )
      .forEach((feature: any) => {
        const auspostType: AuspostFeatureType = feature.properties.type;

        // @ts-ignore
        const amenity = auspostTypeToOSMType[auspostType];
        if (amenity === undefined) {
          return;
        }

        const osmFeatures = (osmByType[amenity] || [])
          .filter((f) => !osmToAuspost.has(f.id))
          .map((f) => ({ ...turf.centroid(f as any), id: f.id }));

        if (osmFeatures.length === 0) {
          return;
        }

        const nearest = turf.nearest(
          feature,
          turf.featureCollection(osmFeatures)
        );

        if (!nearest) {
          return;
        }

        // less than half a kilometer
        if (turf.distance(nearest, feature) <= mergingDistance) {
          auspostToOsm.set(feature, nearest.id);
          osmToAuspost.set(nearest.id, feature);
        }
      });

    return { auspostToOsm, osmToAuspost };
  }, [osmData, auspostData, mergingDistance]);
};
