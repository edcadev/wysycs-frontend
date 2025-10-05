"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Forest } from "@/interfaces/Forest";
import { Map as MapIcon, Satellite } from "lucide-react";
import { MapSkeleton } from "./MapSkeleton";

interface MapProps {
  center?: [number, number];
  forests: Forest[];
  zoom?: number;
  isLoading?: boolean;
}

const treeIcon = (color: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="color: ${color}">
    <path fill="currentColor" d="M210.6 5.9L62 169.4c-3.9 4.2-6 9.8-6 15.5C56 197.7 66.3 208 79.1 208l24.9 0L30.6 281.4c-4.2 4.2-6.6 10-6.6 16C24 309.9 34.1 320 46.6 320L80 320 5.4 409.5C1.9 413.7 0 419 0 424.5c0 13 10.5 23.5 23.5 23.5L192 448l0 32c0 17.7 14.3 32 32 32s32-14.3 32-32l0-32 168.5 0c13 0 23.5-10.5 23.5-23.5c0-5.5-1.9-10.8-5.4-15L368 320l33.4 0c12.5 0 22.6-10.1 22.6-22.6c0-6-2.4-11.8-6.6-16L344 208l24.9 0c12.7 0 23.1-10.3 23.1-23.1c0-5.7-2.1-11.3-6-15.5L237.4 5.9C234 2.1 229.1 0 224 0s-10 2.1-13.4 5.9z"/>
  </svg>
`;

export default function Map({
  center = [-9.19, -75.0152],
  zoom = 4,
  forests,
  isLoading = false,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [viewMode, setViewMode] = useState<"satellite" | "street">("satellite");

  /** 🔹 Inicializar el mapa solo una vez */
  useEffect(() => {
    if (!mapRef.current || leafletMapRef.current) return;

    const map = L.map(mapRef.current, {
      center,
      zoom,
      scrollWheelZoom: false,
    });

    leafletMapRef.current = map;

    tileLayerRef.current = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
        subdomains: "abcd",
        minZoom: 5,
        maxZoom: 20,
      }
    ).addTo(map);

    markersLayerRef.current = L.layerGroup().addTo(map);
  }, [center, zoom]);

  /** 🔹 Cambiar entre vista satelital y calles */
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !tileLayerRef.current) return;

    map.removeLayer(tileLayerRef.current);

    const tileUrl =
      viewMode === "satellite"
        ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";

    tileLayerRef.current = L.tileLayer(tileUrl, {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: "abcd",
      minZoom: 5,
      maxZoom: 20,
    }).addTo(map);
  }, [viewMode]);

  /** 🔹 Actualizar marcadores cuando cambien los bosques */
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !forests || forests.length === 0) return;

    // Limpiar marcadores anteriores
    markersLayerRef.current?.clearLayers();

    // Agregar nuevos marcadores
    forests.forEach((forest) => {
      const [lat, lng] = [forest.latitude, forest.longitude];

      L.marker([lat, lng], {
        icon: L.divIcon({
          className: "custom-leaflet-icon",
          html: treeIcon("green"),
          iconSize: [25, 41],
          iconAnchor: [12.5, 41],
          popupAnchor: [0, -41],
        }),
      })
        .bindPopup(`<strong>${forest.name}</strong>`)
        .addTo(markersLayerRef.current!);
    });
  }, [forests]);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      {isLoading && (
        <div className="absolute inset-0 z-[999]">
          <MapSkeleton
            message="Cargando bosques..."
            showStats={false}
          />
        </div>
      )}
      <div
        ref={mapRef}
        style={{
          height: "100%",
          width: "100%",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-in-out"
        }}
      />

      {/* Selector de vista */}
      <div
        className="absolute top-2 right-2 z-[1000] flex gap-1 bg-card/95 backdrop-blur border border-border rounded-lg p-1 shadow-lg"
      >
        <button
          onClick={() => setViewMode("satellite")}
          className={`px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
            viewMode === "satellite"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <Satellite size={16} />
          Satellite
        </button>
        <button
          onClick={() => setViewMode("street")}
          className={`px-3 py-2 rounded-md flex items-center gap-2 text-sm font-medium transition-all ${
            viewMode === "street"
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          }`}
        >
          <MapIcon size={16} />
          Street
        </button>
      </div>
    </div>
  );
}
