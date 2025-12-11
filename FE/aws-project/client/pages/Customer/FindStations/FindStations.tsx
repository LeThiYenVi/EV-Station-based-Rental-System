import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapPin,
  Search,
  Navigation,
  Loader2,
  Star,
  Phone,
  Clock,
  Car,
  Zap,
  X,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  TruckElectric,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useStation } from "@/hooks/useStation";
import { useFeedback } from "@/hooks/useFeedback";
import apiClient from "@/service/api/apiClient";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

interface Station {
  id: string;
  name: string;
  address: string;
  latitude?: number;
  longitude?: number;
  rating?: number;
  hotline?: string;
  status: string;
  photo?: string;
  startTime?: string;
  endTime?: string;
  totalVehicles?: number;
  availableVehicles?: number;
}

// AWS Location Service configuration - Same as MapWithPlaces.tsx
const region = import.meta.env.VITE_AWS_LOCATION_REGION || "ap-southeast-1";
const mapName =
  import.meta.env.VITE_AWS_LOCATION_MAP_NAME || "voltgo-location-map";
const apiKey = import.meta.env.VITE_AWS_LOCATION_API_KEY || "";

// HERE Map configuration
const hereMapName =
  import.meta.env.VITE_AWS_LOCATION_MAP_NAME_HERE || "voltgo-location-map-here";
const hereApiKey = import.meta.env.VITE_AWS_LOCATION_API_KEY_HERE || "";

export default function FindStations() {
  const navigate = useNavigate();
  const { getAllStations, loading } = useStation();
  const { getFeedbacksByStation } = useFeedback();
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(true);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mapLayer, setMapLayer] = useState<"terrain" | "map">("terrain");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState<Station[]>([]);
  const [stationFeedbacks, setStationFeedbacks] = useState<any[]>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markersRef = useRef<maplibregl.Marker[]>([]);
  const userMarkerRef = useRef<maplibregl.Marker | null>(null);

  // Initialize AWS Location Service Map - Same as MapWithPlaces.tsx
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const initializeMap = async () => {
      try {
        const defaultCenter = userLocation || { lng: 106.7, lat: 10.77 }; // Ho Chi Minh City

        // Choose map style based on layer selection
        const currentMapName = mapLayer === "terrain" ? mapName : hereMapName;
        const currentApiKey = mapLayer === "terrain" ? apiKey : hereApiKey;

        // Initialize MapLibre GL map with AWS Location Service - Same config as MapWithPlaces.tsx
        const map = new maplibregl.Map({
          container: mapContainerRef.current!,
          style: `https://maps.geo.${region}.amazonaws.com/maps/v0/maps/${currentMapName}/style-descriptor?key=${currentApiKey}`,
          center: [defaultCenter.lng, defaultCenter.lat],
          zoom: userLocation ? 13 : 12,
        });

        // Add navigation controls
        map.addControl(new maplibregl.NavigationControl(), "top-right");

        map.on("load", () => {
          mapRef.current = map;
          if (userLocation) {
            addUserMarker(userLocation);
          }
        });
      } catch (error) {
        console.error("Error initializing map:", error);
      }
    };

    initializeMap();

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
      }
    };
  }, [mapLayer]);

  // Get user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      const timeoutId = setTimeout(() => {
        setLocationError("Không thể lấy vị trí trong thời gian cho phép");
        setLoadingLocation(false);
      }, 10000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setLoadingLocation(false);
          setLocationError(null);
        },
        (error) => {
          clearTimeout(timeoutId);
          console.error("Error getting location:", error);
          setLocationError("Không thể lấy vị trí của bạn");
          setLoadingLocation(false);
          // Set default location (Vietnam center)
          setUserLocation({ lat: 16.0544, lng: 108.2022 });
        },
        {
          enableHighAccuracy: false,
          timeout: 8000,
          maximumAge: 60000,
        },
      );
    } else {
      setLocationError("Trình duyệt không hỗ trợ định vị");
      setLoadingLocation(false);
      setUserLocation({ lat: 16.0544, lng: 108.2022 });
    }
  }, []);

  // Load all stations from API
  useEffect(() => {
    const loadStations = async () => {
      try {
        const result = await getAllStations({
          page: 0,
          size: 100,
          sortBy: "createdAt",
          sortDirection: "DESC",
        });

        if (result.success && result.data && result.data.content) {
          // Filter stations that have valid latitude and longitude
          const validStations = result.data.content.filter(
            (station: any) =>
              station.latitude &&
              station.longitude &&
              !isNaN(station.latitude) &&
              !isNaN(station.longitude),
          );

          console.log("Loaded stations with coordinates:", validStations);
          setStations(validStations);
          setFilteredStations(validStations);
        }
      } catch (error) {
        console.error("Error loading stations:", error);
      }
    };

    loadStations();
  }, [getAllStations]);

  // Add user location marker
  const addUserMarker = (location: { lat: number; lng: number }) => {
    if (!mapRef.current) return;

    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    // Create custom user location marker element
    const userMarkerEl = document.createElement("div");
    userMarkerEl.style.width = "20px";
    userMarkerEl.style.height = "20px";
    userMarkerEl.style.backgroundColor = "#4285F4";
    userMarkerEl.style.border = "3px solid white";
    userMarkerEl.style.borderRadius = "50%";
    userMarkerEl.style.boxShadow = "0 2px 4px rgba(0,0,0,0.3)";

    userMarkerRef.current = new maplibregl.Marker({
      element: userMarkerEl,
    })
      .setLngLat([location.lng, location.lat])
      .addTo(mapRef.current);
  };

  // Update map markers when stations change
  useEffect(() => {
    if (!mapRef.current || !filteredStations.length) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    // Add markers for each station with valid coordinates
    filteredStations.forEach((station) => {
      // Validate coordinates before adding marker
      if (
        station.latitude &&
        station.longitude &&
        !isNaN(station.latitude) &&
        !isNaN(station.longitude) &&
        station.latitude >= -90 &&
        station.latitude <= 90 &&
        station.longitude >= -180 &&
        station.longitude <= 180
      ) {
        // Create custom station marker element using TruckElectric icon
        const markerEl = document.createElement("div");
        markerEl.innerHTML = `
          <div style="width: 40px; height: 40px; background: #10b981; border: 3px solid white; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
              <path d="M15 18H9"/>
              <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
              <circle cx="17" cy="18" r="2"/>
              <circle cx="7" cy="18" r="2"/>
              <path d="m13 11 1-3h2l-3 6h-3l1-3z"/>
            </svg>
          </div>
        `;
        markerEl.style.cursor = "pointer";
        markerEl.title = station.name;

        const marker = new maplibregl.Marker({
          element: markerEl,
        })
          .setLngLat([station.longitude, station.latitude])
          .addTo(mapRef.current!);

        // Add click event
        markerEl.addEventListener("click", () => {
          setSelectedStation(station);
          mapRef.current?.flyTo({
            center: [station.longitude, station.latitude],
            zoom: 15,
            duration: 1000,
          });
        });

        markersRef.current.push(marker);

        console.log(
          `Added marker for ${station.name} at [${station.longitude}, ${station.latitude}]`,
        );
      } else {
        console.warn(`Invalid coordinates for station ${station.name}:`, {
          latitude: station.latitude,
          longitude: station.longitude,
        });
      }
    });

    // Fit bounds to show all markers
    if (
      filteredStations.length > 0 &&
      mapRef.current &&
      markersRef.current.length > 0
    ) {
      const bounds = new maplibregl.LngLatBounds();

      filteredStations.forEach((station) => {
        if (
          station.latitude &&
          station.longitude &&
          !isNaN(station.latitude) &&
          !isNaN(station.longitude)
        ) {
          bounds.extend([station.longitude, station.latitude]);
        }
      });

      if (userLocation) {
        bounds.extend([userLocation.lng, userLocation.lat]);
      }

      try {
        mapRef.current.fitBounds(bounds, {
          padding: 80,
          maxZoom: 15,
          duration: 1000,
        });
      } catch (error) {
        console.error("Error fitting bounds:", error);
      }
    }
  }, [filteredStations, userLocation]);

  // Search stations
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setFilteredStations(stations);
      return;
    }

    const filtered = stations.filter(
      (station) =>
        station.name.toLowerCase().includes(query.toLowerCase()) ||
        station.address.toLowerCase().includes(query.toLowerCase()),
    );
    setFilteredStations(filtered);
  };

  // Calculate distance between two points
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
  ): number => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Get nearby stations
  const handleFindNearby = () => {
    if (!userLocation) {
      setLocationError("Vui lòng cho phép truy cập vị trí");
      return;
    }

    const stationsWithDistance = stations
      .map((station) => ({
        ...station,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          station.latitude,
          station.longitude,
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10); // Get 10 nearest stations

    setFilteredStations(stationsWithDistance);
    setIsSearchOpen(true);
  };

  const handleStationClick = async (station: Station) => {
    setSelectedStation(station);
    setIsSidebarOpen(true);
    setIsSearchOpen(false);

    // Add to recent searches (max 5)
    setRecentSearches((prev) => {
      const filtered = prev.filter((s) => s.id !== station.id);
      return [station, ...filtered].slice(0, 5);
    });

    if (mapRef.current && station.latitude && station.longitude) {
      mapRef.current.flyTo({
        center: [station.longitude, station.latitude],
        zoom: 15,
        duration: 1000,
      });
    }

    // Load station feedbacks
    setLoadingFeedbacks(true);
    try {
      const result = await getFeedbacksByStation(station.id, 0, 10);
      if (result && result.content) {
        setStationFeedbacks(result.content);
      }
    } catch (error) {
      console.error("Error loading feedbacks:", error);
      setStationFeedbacks([]);
    } finally {
      setLoadingFeedbacks(false);
    }
  };

  const handleViewDetails = (stationId: string) => {
    navigate(`/place/${stationId}`);
  };

  return (
    <div className="relative h-screen w-full">
      {/* AWS Location Service Map */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Collapsible Sidebar Panel */}
      <div
        className={`absolute top-0 left-0 h-full bg-white shadow-2xl transition-all duration-300 z-10 ${
          isSidebarOpen ? "w-96" : "w-0"
        } overflow-hidden`}
      >
        {selectedStation && (
          <div className="h-full flex flex-col overflow-hidden">
            {/* Station Image with Search Bar Overlay */}
            <div className="relative h-48 flex-shrink-0">
              {selectedStation.photo ? (
                <img
                  src={selectedStation.photo}
                  alt={selectedStation.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.jpg";
                  }}
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  <MapPin className="w-12 h-12 text-gray-400" />
                </div>
              )}

              {/* Search Bar Overlay */}
              <div className="absolute top-4 left-4 right-4">
                <div className="bg-white rounded-lg shadow-xl">
                  <div className="flex items-center px-4 py-3 border-b">
                    <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
                    <Input
                      type="text"
                      placeholder="Tìm kiếm trạm sạc..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      onFocus={() => setIsSearchOpen(true)}
                      className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setFilteredStations(stations);
                        }}
                        className="ml-2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    )}
                  </div>

                  {/* Search Results Dropdown */}
                  {isSearchOpen && (
                    <div className="max-h-64 overflow-y-auto">
                      {searchQuery ? (
                        filteredStations.length > 0 ? (
                          <div className="p-2">
                            {filteredStations.map((station) => (
                              <div
                                key={station.id}
                                onClick={() => handleStationClick(station)}
                                className="p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <MapPin className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">
                                      {station.name}
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                      {station.address}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            <p className="text-sm">Không tìm thấy trạm nào</p>
                          </div>
                        )
                      ) : (
                        recentSearches.length > 0 && (
                          <div className="p-2">
                            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                              Tìm kiếm gần đây
                            </div>
                            {recentSearches.map((station) => (
                              <div
                                key={station.id}
                                onClick={() => handleStationClick(station)}
                                className="p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                              >
                                <div className="flex items-start gap-3">
                                  <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-sm truncate">
                                      {station.name}
                                    </h4>
                                    <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                      {station.address}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              <Badge
                className={`absolute bottom-3 left-4 ${
                  selectedStation.status === "ACTIVE"
                    ? "bg-green-500"
                    : "bg-red-500"
                }`}
              >
                {selectedStation.status === "ACTIVE" ? "Hoạt động" : "Đóng cửa"}
              </Badge>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Station Info */}
              <div className="p-4 border-b">
                <h3 className="text-xl font-bold">{selectedStation.name}</h3>
                {selectedStation.rating && (
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-semibold">
                      {selectedStation.rating}
                    </span>
                  </div>
                )}

                <div className="space-y-2 mt-3">
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{selectedStation.address}</span>
                  </div>
                  {selectedStation.hotline && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{selectedStation.hotline}</span>
                    </div>
                  )}
                  {selectedStation.startTime && selectedStation.endTime && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        {selectedStation.startTime} - {selectedStation.endTime}
                      </span>
                    </div>
                  )}
                  {selectedStation.availableVehicles !== undefined && (
                    <div className="flex items-center gap-2 text-sm">
                      <Car className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {selectedStation.availableVehicles}/
                        {selectedStation.totalVehicles} xe khả dụng
                      </span>
                    </div>
                  )}
                </div>

                <Button
                  onClick={() => handleViewDetails(selectedStation.id)}
                  className="w-full mt-4 bg-green-500 hover:bg-green-600"
                >
                  Xem chi tiết trạm
                </Button>
              </div>

              {/* Feedbacks Section */}
              <div className="p-4">
                <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  Đánh giá từ khách hàng
                </h4>

                {loadingFeedbacks ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-green-600" />
                    <span className="ml-2 text-sm text-gray-600">
                      Đang tải đánh giá...
                    </span>
                  </div>
                ) : stationFeedbacks.length > 0 ? (
                  <div className="space-y-4">
                    {stationFeedbacks.map((feedback) => (
                      <div
                        key={feedback.id}
                        className="border-b pb-4 last:border-b-0"
                      >
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-semibold text-sm">
                                {feedback.renterName || "Khách hàng"}
                              </span>
                              {feedback.createdAt && (
                                <span className="text-xs text-gray-500">
                                  {new Date(
                                    feedback.createdAt,
                                  ).toLocaleDateString("vi-VN")}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-semibold">
                                  {feedback.vehicleRating || feedback.rating}
                                </span>
                              </div>
                            </div>
                            {feedback.comment && (
                              <p className="text-sm text-gray-700 mt-2">
                                {feedback.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p className="text-sm">Chưa có đánh giá nào</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Toggle Sidebar Button */}
      {selectedStation && (
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className={`absolute top-1/2 -translate-y-1/2 bg-white shadow-xl rounded-r-lg p-2 z-20 transition-all duration-300 hover:bg-gray-50 ${
            isSidebarOpen ? "left-96" : "left-0"
          }`}
        >
          {isSidebarOpen ? (
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          ) : (
            <ChevronRight className="w-6 h-6 text-gray-600" />
          )}
        </button>
      )}

      {/* Search Bar - Always visible (hidden when sidebar is open) */}
      {!isSidebarOpen && (
        <div className="absolute top-4 left-4 w-96 z-10">
          <div className="bg-white rounded-lg shadow-xl">
            <div className="flex items-center px-4 py-3 border-b">
              <Search className="w-5 h-5 text-gray-400 mr-3 flex-shrink-0" />
              <Input
                type="text"
                placeholder="Tìm kiếm trạm sạc..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => setIsSearchOpen(true)}
                className="flex-1 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilteredStations(stations);
                  }}
                  className="ml-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown */}
            {isSearchOpen && (
              <div className="max-h-64 overflow-y-auto">
                {searchQuery ? (
                  filteredStations.length > 0 ? (
                    <div className="p-2">
                      {filteredStations.map((station) => (
                        <div
                          key={station.id}
                          onClick={() => handleStationClick(station)}
                          className="p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <MapPin className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">
                                {station.name}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                {station.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-center text-gray-500">
                      <p className="text-sm">Không tìm thấy trạm nào</p>
                    </div>
                  )
                ) : (
                  recentSearches.length > 0 && (
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">
                        Tìm kiếm gần đây
                      </div>
                      {recentSearches.map((station) => (
                        <div
                          key={station.id}
                          onClick={() => handleStationClick(station)}
                          className="p-3 mb-2 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-start gap-3">
                            <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">
                                {station.name}
                              </h4>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                                {station.address}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Control Buttons - Top Right */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 mr-[50px]">
        {/* Back to Home Button */}
        <Button
          onClick={() => navigate("/")}
          className="bg-white hover:bg-gray-50 text-gray-800 shadow-xl rounded-full h-12 px-5"
        >
          <ArrowLeft className="w-5 h-5 mr-2 text-gray-600" />
          Trang chủ
        </Button>

        {/* Find Nearby Button */}
        <Button
          onClick={handleFindNearby}
          disabled={loadingLocation || !userLocation}
          className="bg-white hover:bg-gray-50 text-gray-800 shadow-xl rounded-full h-14 px-6"
        >
          {loadingLocation ? (
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
          ) : (
            <Navigation className="w-5 h-5 mr-2 text-green-600" />
          )}
          Các trạm thuê xe
        </Button>

        {/* Map Layer Toggle */}
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <button
            onClick={() => setMapLayer("terrain")}
            className={`w-full px-4 py-2 text-sm font-medium transition-colors ${
              mapLayer === "terrain"
                ? "bg-green-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Địa hình
          </button>
          <button
            onClick={() => setMapLayer("map")}
            className={`w-full px-4 py-2 text-sm font-medium transition-colors border-t ${
              mapLayer === "map"
                ? "bg-green-500 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Bản đồ
          </button>
        </div>
      </div>

      {/* Loading Overlay */}
      {loading && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center z-20">
          <div className="bg-white rounded-lg p-6 shadow-xl">
            <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-3" />
            <p className="text-gray-600">Đang tải dữ liệu trạm...</p>
          </div>
        </div>
      )}

      {/* Location Error */}
      {locationError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg max-w-md z-10">
          <p className="text-sm text-yellow-800 text-center">{locationError}</p>
        </div>
      )}
    </div>
  );
}
