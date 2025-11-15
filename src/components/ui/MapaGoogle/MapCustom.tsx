import React, { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "./loadGoogleMapsHelper";
import clienteIcon from "../../../assets/cliente-icon.png";
import vendedorMarker from "../../../assets/vendedor-marker.png";
import marcadorMap from "../../../assets/marcador-map.png";

interface LatLng {
  lat: number;
  lng: number;
}

export interface InfoWindowData {
  title: string;
  content: {
    nombreCliente?: string;
    nombreSucursal?: string;
    direccion?: string;
    nombreZona?: string;
    latitud?: number;
    longitud?: number;

    nombreVendedor?: string;
    usuarioLog?: string;
    telefonoVendedor?: string;
  };
}

export interface MarkerData {
  position: LatLng;
  type: "client" | "vendor" | "route" | "default";
  title?: string;
  id?: string | number;
  info?: InfoWindowData;
  label?: string;
}

export interface PathData {
  path: LatLng[];
  strokeColor?: string;
  strokeOpacity?: number;
  strokeWeight?: number;
}

export interface CircleData {
  center: LatLng;
  radius?: number; 
  fillColor?: string;
  strokeColor?: string;
  strokeWeight?: number;
}

interface MapCustomProps {
  center?: LatLng;
  zoom?: number;
  markers?: MarkerData[];
  paths?: PathData[];
  circles?: CircleData[];
  onMapClick?: (latLng: LatLng) => void;
  onMarkerClick?: (marker: MarkerData) => void;
  style?: React.CSSProperties;
}

const MapCustom: React.FC<MapCustomProps> = ({
  center = { lat: -17.7833, lng: -63.1822 },
  zoom = 12,
  markers = [],
  paths = [],
  circles = [],
  onMapClick,
  onMarkerClick,
  style,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [infoWindow, setInfoWindow] = useState<google.maps.InfoWindow | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);
  const circlesRef = useRef<google.maps.Circle[]>([]);

  // Inicializa el mapa
  useEffect(() => {
    const initMap = async () => {
      if (map) return;
      await loadGoogleMaps();
      if (!mapRef.current) return;

      const googleMap = new google.maps.Map(mapRef.current, {
        center,
        zoom,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
      });

      googleMap.addListener("click", (e: google.maps.MapMouseEvent) => {
        if (onMapClick && e.latLng) {
          onMapClick({ lat: e.latLng.lat(), lng: e.latLng.lng() });
        }
        infoWindow?.close();
      });

      setMap(googleMap);
      setInfoWindow(new google.maps.InfoWindow());

      // Ajuste del centro
      setTimeout(() => {
        google.maps.event.trigger(googleMap, "resize");
        googleMap.setCenter(center);
      }, 100);
    };

    initMap();
  }, [center, zoom]);

  // Actualiza el centro si cambia
  useEffect(() => {
    if (!map) return;
    map.setCenter(center);
    map.setZoom(zoom);
  }, [map, center, zoom]);

  // Renderiza los marcadores
  useEffect(() => {
    if (!map || !infoWindow) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    markers.forEach((markerData) => {
      const iconUrl = getMarkerIcon(markerData.type);

      const marker = new google.maps.Marker({
        position: markerData.position,
        map,
        title: markerData.title,
        label: markerData.label
          ? {
              text: markerData.label,
              color: "#FFFFFF",
              fontSize: "16px",
              fontWeight: "900",
            }
          : undefined,
        icon: iconUrl
          ? { url: iconUrl, scaledSize: new google.maps.Size(42, 42) }
          : undefined,
      });

      // InfoWindow con mejor diseño
      marker.addListener("click", () => {
        if (markerData.info) {
          const info = markerData.info;
          const c = info.content;
          
          let content = "";

          // InfoWindow para clientes
          if (markerData.type === "client") {
            content = `
              <div style="
                font-family: 'Segoe UI', Roboto, sans-serif;
                font-size: 13px;
                color: #1e293b;
                background: #ffffff;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                padding: 12px 14px;
                max-width: 280px;
                line-height: 1.6;
              ">
                <div style="
                  border-bottom: 1px solid #e2e8f0;
                  margin-bottom: 8px;
                  padding-bottom: 4px;
                ">
                  <h3 style="
                    font-size: 15px;
                    margin: 0;
                    color: #0f172a;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                  ">
                    📍 ${info.title}
                  </h3>
                </div>
                <p style="margin: 4px 0;"><strong>🏢 Sucursal:</strong> ${c.nombreSucursal}</p>
                <p style="margin: 4px 0;"><strong>👤 Cliente:</strong> ${c.nombreCliente}</p>
                <p style="margin: 4px 0;"><strong>📫 Dirección:</strong> ${c.direccion}</p>
                <p style="margin: 4px 0;"><strong>🗺️ Zona:</strong> ${c.nombreZona}</p>
                <div style="
                  margin-top: 10px;
                  font-size: 12px;
                  color: #475569;
                  text-align: right;
                ">
                  🧭 <em>Lat: ${c.latitud?.toFixed(5)}, Lng: ${c.longitud?.toFixed(5)}</em>
                </div>
              </div>
            `;
          } 
          // InfoWindow para vendedores
          else if (markerData.type === "vendor") {
            content = `
              <div style="
                font-family: 'Segoe UI', Roboto, sans-serif;
                font-size: 13px;
                color: #1e293b;
                background: #ffffff;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                padding: 12px 14px;
                max-width: 280px;
                line-height: 1.6;
              ">
                <div style="
                  border-bottom: 1px solid #e2e8f0;
                  margin-bottom: 8px;
                  padding-bottom: 4px;
                ">
                  <h3 style="
                    font-size: 15px;
                    margin: 0;
                    color: #0f172a;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                  ">
                    📍 ${info.title}
                  </h3>
                </div>
                <p style="margin: 4px 0;"><strong>🏢 Nombre:</strong> ${c.nombreVendedor}</p>
                <p style="margin: 4px 0;"><strong>👤 Teléfono:</strong> ${c.telefonoVendedor ?? "Cargando..."}</p>
                <p style="margin: 4px 0;"><strong>📫 Usuario:</strong> ${c.usuarioLog ?? "Cargando..."}</p>
                <div style="
                  margin-top: 10px;
                  font-size: 12px;
                  color: #475569;
                  text-align: right;
                ">
                  🧭 <em>Lat: ${c.latitud?.toFixed(5)}, Lng: ${c.longitud?.toFixed(5)}</em>
                </div>
              </div>
            `;
          }
          // InfoWindow genérico para otros tipos
          else {
            content = `
              <div style="
                font-family: 'Segoe UI', Roboto, sans-serif;
                font-size: 13px;
                color: #1e293b;
                background: #ffffff;
                border-radius: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                padding: 12px 14px;
                max-width: 280px;
                line-height: 1.6;
              ">
                <div style="
                  border-bottom: 1px solid #e2e8f0;
                  margin-bottom: 8px;
                  padding-bottom: 4px;
                ">
                  <h3 style="
                    font-size: 15px;
                    margin: 0;
                    color: #0f172a;
                    font-weight: 600;
                  ">
                    ${info.title}
                  </h3>
                </div>
                <p style="margin: 4px 0;"><strong>📫 Dirección:</strong> ${c.direccion}</p>
                <p style="margin: 4px 0;"><strong>🗺️ Zona:</strong> ${c.nombreZona}</p>
                <div style="
                  margin-top: 10px;
                  font-size: 12px;
                  color: #475569;
                  text-align: right;
                ">
                  🧭 <em>Lat: ${c.latitud?.toFixed(5)}, Lng: ${c.longitud?.toFixed(5)}</em>
                </div>
              </div>
            `;
          }

          infoWindow.setContent(content);
          infoWindow.open(map, marker);
        }

        onMarkerClick?.(markerData);
      });

      markersRef.current.push(marker);
    });
  }, [map, markers, onMarkerClick, infoWindow]);

  // Renderiza las rutas (polylines)
  useEffect(() => {
    if (!map) return;

    polylinesRef.current.forEach((poly) => poly.setMap(null));
    polylinesRef.current = [];

    paths.forEach((pathData) => {
      const polyline = new google.maps.Polyline({
        path: pathData.path,
        geodesic: true,
        strokeColor: pathData.strokeColor ?? "#2563eb",
        strokeOpacity: pathData.strokeOpacity ?? 0.9,
        strokeWeight: pathData.strokeWeight ?? 3,
        map,
      });
      polylinesRef.current.push(polyline);
    });
  }, [map, paths]);

  // Renderiza los círculos
  useEffect(() => {
    if (!map) return;

    // Limpia círculos anteriores
    circlesRef.current.forEach((c) => c.setMap(null));
    circlesRef.current = [];

    // Dibuja los nuevos círculos
    circles.forEach((circleData) => {
      const circle = new google.maps.Circle({
        map,
        center: circleData.center,
        radius: circleData.radius ?? 100, // Radio de 100m por defecto
        fillColor: circleData.fillColor ?? "#4285F4",
        fillOpacity: 0.2,
        strokeColor: circleData.strokeColor ?? "#4285F4",
        strokeOpacity: 0.6,
        strokeWeight: circleData.strokeWeight ?? 1,
      });
      circlesRef.current.push(circle);
    });
  }, [map, circles]);

  // Retorna el ícono adecuado
  const getMarkerIcon = (type: MarkerData["type"]): string | null => {
    switch (type) {
      case "client":
        return clienteIcon;
      case "vendor":
        return vendedorMarker;
      case "route":
        return marcadorMap;
      default:
        return null;
    }
  };

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: "420px",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        ...style,
      }}
    />
  );
};

export default MapCustom;