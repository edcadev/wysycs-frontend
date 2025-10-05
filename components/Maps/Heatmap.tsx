"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.heat";
import { firesApi } from "@/lib/api";
import { Map as MapIcon, Satellite } from "lucide-react";

interface MapProps {
  center?: [number, number];
  fires: Fire[];
  zoom?: number;
  radius?: number;
}

interface Fire {
  latitude: number;
  longitude: number;
  brightness: number;
  confidence: string;
  acquired_date: string;
  acquired_time: string;
}

const fireIcon = (color: string) => `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" style="color: ${color}">
    <path fill="currentColor" d="M216 24c0 52.9-31.1 80.4-59.6 108.2C127.9 160.6 96 192 96 256c0 70.7 57.3 128 128 128s128-57.3 128-128c0-43.6-24.8-82.4-61.8-109.2c-8.2-6.1-19.6-5.6-27.2 1.2c-7.7 6.9-9.8 18.1-5.3 27.4c5.6 11.8 8.3 24.5 8.3 38.6c0 35.3-28.7 64-64 64s-64-28.7-64-64c0-64 64-96 96-128c0-24-8-48-8-70.4c0-8.8 7.2-15.6 16-15.6s16 6.8 16 15.6z"/>
  </svg>
`;

export default function HeatMap2({
  center = [-9.19, -75.0152],
  zoom = 4,
  fires,
  radius = 30,
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const heatLayerRef = useRef<L.HeatLayer | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const [viewMode, setViewMode] = useState<"satellite" | "street">("satellite");

  /** 🔹 Inicializar mapa una sola vez */
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
    }).addTo(map);
  }, [viewMode]);

  /** 🔹 Actualizar marcadores y heatmap cuando cambien los fires */
  useEffect(() => {
    const map = leafletMapRef.current;
    if (!map || !fires || fires.length === 0) return;

    // Limpia marcadores y heatmap previos
    markersLayerRef.current?.clearLayers();
    if (heatLayerRef.current) {
      map.removeLayer(heatLayerRef.current);
    }

    // Crear heatmap
    const heatData = fires.map((fire) => [
      fire.latitude,
      fire.longitude,
      Math.min(fire.brightness / 400, 1),
    ]) as [number, number, number][];

    heatLayerRef.current = (L as any)
      .heatLayer(heatData, {
        radius,
        blur: 20,
        maxZoom: 8,
        gradient: {
          0.0: "transparent",
          0.2: "#fef3c7",
          0.4: "#fbbf24",
          0.6: "#f59e0b",
          0.8: "#f97316",
          1.0: "#ef4444",
        },
      })
      .addTo(map);

    // Crear marcadores
    fires.forEach((fire, index) => {
      const popupId = `popup-${index}`;
      const popupHtml = `
        <div id="${popupId}" style="text-align:center; width: 220px;">
          <p>Loading prediction 🔄...</p>
        </div>
      `;

      const marker = L.marker([fire.latitude, fire.longitude], {
        icon: L.divIcon({
          className: "custom-leaflet-icon",
          html: fireIcon("orange"),
          iconSize: [25, 41],
          iconAnchor: [12.5, 41],
          popupAnchor: [0, -41],
        }),
      })
        .bindPopup(popupHtml)
        .addTo(markersLayerRef.current!);

      marker.on("popupopen", async () => {
        const popup = document.getElementById(popupId);
        if (!popup) return;

        try {
          const data = await firesApi.firePrediction({
            lat: fire.latitude,
            lng: fire.longitude,
          });

          const buttonsHTML = data.predictions
            .map(
              (p, i) => `
              <button 
                class="day-btn" 
                data-index="${i}" 
                style="margin-right: 2px; padding: 4px 8px; border-radius: 6px; border: 1px solid #ccc; background-color: white; cursor: pointer; font-size: 12px;">
                Day ${p.day}
              </button>`
            )
            .join("");

          popup.innerHTML = `
            <h4>🔥 Fire prediction</h4>
            <div class="days-container" style="justify-content: center; display:flex; gap:5px; margin-bottom:8px; margin-top: 5px;">
              ${buttonsHTML}
            </div>
            <div id="${popupId}-details" style="font-size:13px; line-height:1.4; overflow-y:auto; max-height:130px;">
              <p>Select a day to view details 🔍</p>
            </div>
          `;

          const buttons = popup.querySelectorAll<HTMLButtonElement>(".day-btn");
          const detailsContainer = document.getElementById(
            `${popupId}-details`
          );

          buttons.forEach((btn) => {
            btn.addEventListener("click", () => {
              buttons.forEach((b) => (b.style.backgroundColor = "white"));
              btn.style.backgroundColor = "#ef4444";

              const index = parseInt(btn.dataset.index!);
              const prediction = data.predictions[index];
              const {
                date,
                spread_radius_km,
                affected_area_ha,
                environmental_impact,
                population_impact,
              } = prediction;

              if (detailsContainer) {
                detailsContainer.innerHTML = `
                  <p><b>Date:</b> ${new Date(date).toLocaleDateString()}</p>
                  <p><b>Spread radius:</b> ${spread_radius_km.toFixed(2)} km</p>
                  <p><b>Affected area:</b> ${affected_area_ha.toLocaleString()} ha</p>
                  <hr style="margin: 4px 0;">
                  <p><b>🌳 CO₂:</b> ${environmental_impact.co2_tonnes.toLocaleString()} t</p>
                  <p><b>🚗 Car equivalent:</b> ${environmental_impact.cars_equivalent.toLocaleString()}</p>
                  <p><b>🐾 Species at risk:</b> ${
                    environmental_impact.species_at_risk
                  }</p>
                  <p><b>💧 Water sources at risk:</b> ${
                    environmental_impact.water_sources_at_risk
                  }</p>
                  <hr style="margin: 4px 0;">
                  <p><b>👥 People at risk:</b> ${
                    population_impact.people_at_risk
                  }</p>
                  <p><b>👨‍👩‍👧 Affected families:</b> ${
                    population_impact.families_affected
                  }</p>
                  <p><b>📊 Severity:</b> <span style="font-weight:bold;">${
                    population_impact.severity
                  }</span></p>
                `;
              }
            });
          });
        } catch (error) {
          console.error("Error fetching fire prediction:", error);
          popup.innerHTML = `<p style="color:red;">Error loading prediction ⚠️</p>`;
        }
      });
    });
  }, [fires, radius]);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />

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
