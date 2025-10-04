"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Forest } from "@/interfaces/Forest";

interface MapProps {
  center?: [number, number];
  forests: Forest[];
  zoom?: number;
}

const treeIcon = (color: string) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="color: ${color}"><path fill="currentColor" d="M210.6 5.9L62 169.4c-3.9 4.2-6 9.8-6 15.5C56 197.7 66.3 208 79.1 208l24.9 0L30.6 281.4c-4.2 4.2-6.6 10-6.6 16C24 309.9 34.1 320 46.6 320L80 320 5.4 409.5C1.9 413.7 0 419 0 424.5c0 13 10.5 23.5 23.5 23.5L192 448l0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32 168.5 0c13 0 23.5-10.5 23.5-23.5c0-5.5-1.9-10.8-5.4-15L368 320l33.4 0c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16L344 208l24.9 0c12.7 0 23.1-10.3 23.1-23.1c0-5.7-2.1-11.3-6-15.5L237.4 5.9C234 2.1 229.1 0 224 0s-10 2.1-13.4 5.9z"/></svg>`


export default function Map({ center = [-9.19, -75.0152], zoom = 4, forests }: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!leafletMapRef.current) {
      leafletMapRef.current = L.map(mapRef.current).setView(
        center,
        zoom
      );

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        // "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }
      ).addTo(leafletMapRef.current);

      markersLayerRef.current = L.layerGroup().addTo(leafletMapRef.current);

      forests.forEach((forest) => {
        const [lat, lng] = [forest.latitude, forest.longitude];

        L.marker([lat, lng], {
          icon: customIcon("green"),
        })
          .bindPopup(forest.name)
          .addTo(markersLayerRef.current!);
      });
    }
  }, []);

  const customIcon = (color: string) =>
    L.divIcon({
      className: "custom-leaflet-icon",
      html: treeIcon(color),
      iconSize: [25, 41],
      iconAnchor: [12.5, 41],
      popupAnchor: [0, -41],
    });


  return (
    <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
  );
}
