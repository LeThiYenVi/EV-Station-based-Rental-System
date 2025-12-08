import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface StationMapProps {
  onLocationSelect?: (lat: number, lng: number) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
}

const StationMap = ({
  onLocationSelect,
  initialCenter = [106.7, 10.77], // Default to Ho Chi Minh City
  initialZoom = 12,
}: StationMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const [selectedCoord, setSelectedCoord] = useState<{
    lng: number;
    lat: number;
  } | null>(null);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return;

    // TODO: Replace with your AWS Location Service configuration
    // You need to configure AWS credentials and map name
    const region = "ap-southeast-1";
    const mapName = "MyMap";

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor`,
      center: initialCenter,
      zoom: initialZoom,
    });

    mapRef.current = map;

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      setSelectedCoord({ lng, lat });

      // Remove previous marker if exists
      if (markerRef.current) {
        markerRef.current.remove();
      }

      // Add new marker
      markerRef.current = new maplibregl.Marker({ color: "#FF4D4F" })
        .setLngLat([lng, lat])
        .addTo(map);

      // Callback to parent component
      if (onLocationSelect) {
        onLocationSelect(lat, lng);
      }
    });

    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
      }
      map.remove();
    };
  }, [initialCenter, initialZoom, onLocationSelect]);

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        style={{ width: "100%", height: "400px" }}
        className="rounded-lg border border-gray-300"
      />
      {selectedCoord && (
        <div className="mt-2 text-sm text-gray-600">
          📍 Vị trí đã chọn: {selectedCoord.lat.toFixed(6)},{" "}
          {selectedCoord.lng.toFixed(6)}
        </div>
      )}
    </div>
  );
};

export default StationMap;
