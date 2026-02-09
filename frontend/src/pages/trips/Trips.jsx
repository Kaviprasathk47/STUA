import { useRef, useState, useCallback } from "react";
import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import NewPlaceSearch from "../../components/NewPlaceSearch";

const DEFAULT_CENTER = { lat: 51.5074, lng: -0.1278 };
const MAP_CONTAINER_STYLE = { width: "100%", height: "100%", minHeight: "400px" };
const MAP_OPTIONS = {
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: true,
  fullscreenControl: true,
};

/** Static array so LoadScript does not reload on every render */
const GOOGLE_MAPS_LIBRARIES = ["places"];

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY?.trim() || "";

const Trips = () => {
  const [origin, setOrigin] = useState({ address: "", place: null });
  const [destination, setDestination] = useState({ address: "", place: null });
  const [directions, setDirections] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [mapError, setMapError] = useState(null);

  const mapRef = useRef(null);
  const directionsServiceRef = useRef(null);

  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-trips",
    googleMapsApiKey: apiKey,
    version: "weekly",
    libraries: GOOGLE_MAPS_LIBRARIES,
    preventGoogleFontsLoading: true,
  });

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    if (typeof window !== "undefined" && window.google) {
      directionsServiceRef.current = new window.google.maps.DirectionsService();
    }
  }, []);

  const onOriginPlaceSelected = useCallback(({ address, place }) => {
    setOrigin({ address: address ?? "", place });
    setDirections(null);
  }, []);

  const onDestinationPlaceSelected = useCallback(({ address, place }) => {
    setDestination({ address: address ?? "", place });
    setDirections(null);
  }, []);

  const fetchDirections = useCallback(() => {
    if (!origin.place || !destination.place || !directionsServiceRef.current) return;
    setRouteLoading(true);
    setDirections(null);

    const originLatLng = new window.google.maps.LatLng(origin.place.lat, origin.place.lng);
    const destLatLng = new window.google.maps.LatLng(destination.place.lat, destination.place.lng);

    directionsServiceRef.current.route(
      {
        origin: originLatLng,
        destination: destLatLng,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        setRouteLoading(false);
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
          const bounds = new window.google.maps.LatLngBounds();
          result.routes[0].legs[0].steps.forEach((step) => {
            bounds.extend(step.start_location);
            bounds.extend(step.end_location);
          });
          mapRef.current?.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
        } else {
          setMapError("Could not find a route between these places.");
        }
      }
    );
  }, [origin.place, destination.place]);

  const clearRoute = useCallback(() => {
    setDirections(null);
    setOrigin({ address: "", place: null });
    setDestination({ address: "", place: null });
    setMapError(null);
  }, []);

  if (loadError) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-amber-50 border border-amber-200 p-6 text-amber-900 max-w-2xl">
          <p className="font-semibold mb-3">This page can&apos;t load Google Maps correctly</p>
          <p className="text-sm mb-4">
            The map failed to load. Fix the items below in{" "}
            <a
              href="https://console.cloud.google.com/google/maps-apis"
              target="_blank"
              rel="noopener noreferrer"
              className="underline font-medium"
            >
              Google Cloud Console
            </a>
            :
          </p>
          <ul className="text-sm space-y-2 list-disc list-inside">
            <li>
              <strong>BillingNotEnabledMapError</strong> – Enable billing in Google Cloud (Billing → Link a project). Google gives $200/month free credit.
            </li>
            <li>
              <strong>RefererNotAllowedMapError</strong> – In API key &quot;Application restrictions&quot; (HTTP referrers), add exactly:
              <code className="block mt-1 bg-amber-100/80 px-2 py-1 rounded text-xs font-mono">
                http://localhost:5173
              </code>
              or <code className="font-mono bg-amber-100/80 px-1 rounded text-xs">http://localhost:5173/*</code>. No trailing slash.
            </li>
            <li>
              <strong>APIs</strong> – Enable <strong>Maps JavaScript API</strong> and <strong>Places API</strong>.
            </li>
            <li>
              <strong>.env</strong> – Restart the dev server after changing <code className="bg-amber-100/80 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code>.
            </li>
          </ul>
          <p className="text-xs mt-4 text-amber-700">
            Check the browser Console (F12 → Console) for the exact error from Google.
          </p>
        </div>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="p-6">
        <div className="rounded-xl bg-slate-100 border border-slate-200 p-6 text-slate-700">
          <p className="font-medium mb-1">Google Maps API key required</p>
          <p className="text-sm">
            Set <code className="bg-slate-200 px-1 rounded">VITE_GOOGLE_MAPS_API_KEY</code> in your{" "}
            <code className="bg-slate-200 px-1 rounded">.env</code> and enable Maps JavaScript API and
            Places API in Google Cloud Console.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <MapPin className="w-7 h-7 text-emerald-600" />
          Trips
        </h1>
        <p className="text-slate-600 mt-1">
          Enter start and destination to see your route on the map.
        </p>
      </div>

      {/* Origin & Destination inputs (modern PlaceAutocompleteElement) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Start</label>
          <NewPlaceSearch
            placeholder="Search start location..."
            onPlaceSelected={onOriginPlaceSelected}
            className="place-autocomplete-wrapper w-full"
          />
          {origin.address && (
            <p className="mt-1 text-xs text-slate-500 truncate" title={origin.address}>
              {origin.address}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Destination</label>
          <NewPlaceSearch
            placeholder="Search destination..."
            onPlaceSelected={onDestinationPlaceSelected}
            className="place-autocomplete-wrapper w-full"
          />
          {destination.address && (
            <p className="mt-1 text-xs text-slate-500 truncate" title={destination.address}>
              {destination.address}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={fetchDirections}
          disabled={!origin.place || !destination.place || routeLoading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {routeLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Navigation className="w-4 h-4" />
          )}
          Show route
        </button>
        <button
          type="button"
          onClick={clearRoute}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-300 transition-colors"
        >
          Clear
        </button>
      </div>

      {mapError && (
        <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {mapError}
        </div>
      )}

      {/* Map */}
      <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm">
        <div style={MAP_CONTAINER_STYLE}>
          <GoogleMap
            mapContainerStyle={MAP_CONTAINER_STYLE}
            center={origin.place || destination.place || DEFAULT_CENTER}
            zoom={origin.place && destination.place && !directions ? 10 : 12}
            onLoad={onMapLoad}
            options={MAP_OPTIONS}
          >
            {origin.place && !directions && (
              <Marker position={origin.place} label="A" title="Start" />
            )}
            {destination.place && !directions && (
              <Marker position={destination.place} label="B" title="Destination" />
            )}
            {directions && (
              <DirectionsRenderer
                directions={directions}
                options={{
                  suppressMarkers: false,
                  markerOptions: { label: { text: " ", color: "white" } },
                }}
              />
            )}
            {/* DirectionsService is not a component; we use the API via ref. We need to create the service when map is loaded. */}
          </GoogleMap>
        </div>
      </div>
    </div>
  );
};

export default Trips;
