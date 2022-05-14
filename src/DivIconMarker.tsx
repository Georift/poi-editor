import { Marker, MarkerProps } from "react-leaflet";
import { DivIcon } from "leaflet";

import L from "leaflet";
import { createPortal } from "react-dom";
import React, { useEffect } from "react";

type ReactProps = { key: string | number } & { children: JSX.Element };

// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/6e724310e0ed089cf4b8b261b8badf71206ad9e8/types/leaflet/index.d.ts#L75
type ContainerProps = {
  tagName: string;
  className?: string;
  container?: HTMLElement;
};

type DivIconMarkerProps = ReactProps & { marker: MarkerProps } & {
  container: ContainerProps;
  divIconProps: any;
};
export const DivIconMarker = ({
  key,
  children,
  marker,
  container,
  divIconProps,
}: DivIconMarkerProps) => {
  const { tagName, className } = container;
  const element = L.DomUtil.create(tagName, className);
  const divIcon = new DivIcon({ html: element, ...(divIconProps || {}) });
  const portal = createPortal(children, element);

  useEffect(() => {
    return () => {
      L.DomUtil.remove(element);
    };
  });

  const { position, eventHandlers } = marker;
  return (
    <>
      {portal}
      <Marker
        key={key}
        position={position}
        icon={divIcon}
        eventHandlers={eventHandlers}
      ></Marker>
    </>
  );
};
