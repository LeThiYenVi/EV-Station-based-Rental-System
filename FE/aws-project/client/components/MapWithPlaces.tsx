import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// Vite environment variables (use VITE_ prefix, not REACT_APP_)
const region = import.meta.env.VITE_AWS_LOCATION_REGION || "ap-southeast-1";
const mapName = import.meta.env.VITE_AWS_LOCATION_MAP_NAME_HERE || "voltgo-location-map";
const placeIndex = import.meta.env.VITE_AWS_LOCATION_PLACE_INDEX_HERE || "voltgo-place-index";
const apiKey = import.meta.env.VITE_AWS_LOCATION_API_KEY_HERE || "";

interface MapWithPlacesProps {
  onLocationSelect?: (lat: number, lng: number, address?: string) => void;
  initialCenter?: [number, number];
  initialZoom?: number;
}

const MapWithPlaces = ({
  onLocationSelect,
  initialCenter = [106.7, 10.77], // Default to Ho Chi Minh City
  initialZoom = 12,
}: MapWithPlacesProps) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Array<{ label: string; position: [number, number] }>>([]);
  const [selectedCoord, setSelectedCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${mapName}/style-descriptor?key=${apiKey}`,
      center: initialCenter,
      zoom: initialZoom,
    });

    mapRef.current = map;

    // Add navigation controls
    map.addControl(new maplibregl.NavigationControl(), "top-right");

    // Click on map to select coordinates
    map.on("click", (e) => {
      const { lng, lat } = e.lngLat;
      setSelectedCoord({ lat, lng });
      addOrMoveMarker(lng, lat);
      
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
  }, []); // Empty dependency array - only initialize once

  const addOrMoveMarker = (lng: number, lat: number) => {
    if (!mapRef.current) return;
    if (markerRef.current) {
      markerRef.current.setLngLat([lng, lat]);
    } else {
      markerRef.current = new maplibregl.Marker({ color: "#FF4D4F" })
        .setLngLat([lng, lat])
        .addTo(mapRef.current);
    }
  };

  // Search places using AWS Location Service Places API
  const searchPlaces = async () => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    try {
      const center = mapRef.current
        ? mapRef.current.getCenter()
        : { lng: initialCenter[0], lat: initialCenter[1] };

      const res = await fetch(
        `https://places.geo.${region}.amazonaws.com/places/v0/indexes/${placeIndex}/search/text?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            Text: query,
            MaxResults: 5,
            BiasPosition: [center.lng, center.lat], // [lon, lat]
          }),
        }
      );

      const data = await res.json();
      const results = (data.Results || []).map((r: any) => ({
        label: r.Place.Label,
        position: r.Place.Geometry.Point as [number, number], // [lon, lat]
      }));
      setSuggestions(results);
    } catch (e) {
      console.error("Search places error", e);
    }
  };

  const handleSelectSuggestion = (sugg: { label: string; position: [number, number] }) => {
    const [lng, lat] = sugg.position;
    setSelectedCoord({ lat, lng });
    setSelectedAddress(sugg.label);
    addOrMoveMarker(lng, lat);

    if (mapRef.current) {
      mapRef.current.flyTo({ center: [lng, lat], zoom: 15 });
    }
    setSuggestions([]);
    setQuery(sugg.label);

    // Callback to parent component
    if (onLocationSelect) {
      onLocationSelect(lat, lng, sugg.label);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Search box using AWS Places */}
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onPressEnter={searchPlaces}
          placeholder="Nhập địa chỉ hoặc địa điểm..."
          suffix={
            <Button
              type="text"
              icon={<SearchOutlined />}
              onClick={searchPlaces}
            />
          }
        />
        {suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((s, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectSuggestion(s)}
                className="px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
              >
                {s.label}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Map */}
      <div
        ref={mapContainerRef}
        className="w-full rounded-lg border border-gray-300"
        style={{ height: "400px" }}
      />

      {/* Display selected coordinates */}
      {selectedCoord && (
        <div className="text-sm text-gray-600">
          {selectedAddress && (
            <div className="mt-1 text-gray-500">
              📌 Địa chỉ: {selectedAddress}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapWithPlaces;
