import { useRef, useState, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import {
  useJsApiLoader,
  GoogleMap,
  DirectionsRenderer,
  Marker,
} from "@react-google-maps/api";
import { MapPin, Navigation, Loader2, Leaf, Calendar } from "lucide-react";
import NewPlaceSearch from "../../components/NewPlaceSearch";
// import TransportComparison from "../../components/TransportComparison";

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
  const navigate = useNavigate();
  const [origin, setOrigin] = useState({ address: "", name: "", place: null });
  const [destination, setDestination] = useState({ address: "", name: "", place: null });
  const [travelDate, setTravelDate] = useState(new Date().toISOString().slice(0, 10)); // Default to today
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

  const onOriginPlaceSelected = useCallback(({ address, name, place }) => {
    setOrigin({ address: address ?? "", name: name ?? "", place });
    setDirections(null);
  }, []);

  const onDestinationPlaceSelected = useCallback(({ address, name, place }) => {
    setDestination({ address: address ?? "", name: name ?? "", place });
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
    setOrigin({ address: "", name: "", place: null });
    setDestination({ address: "", name: "", place: null });
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
    <div className="p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8 max-w-7xl mx-auto bg-slate-50 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <MapPin className="w-8 h-8 text-emerald-600" />
          Trips
        </h1>
        <p className="text-gray-600 mt-1">
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
            className="w-full px-4 py-1.5 rounded-xl border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 bg-white transition-all text-slate-700"
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
            className="w-full px-4 py-1.5 rounded-xl border border-slate-200 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 bg-white transition-all text-slate-700"
          />
          {destination.address && (
            <p className="mt-1 text-xs text-slate-500 truncate" title={destination.address}>
              {destination.address}
            </p>
          )}
        </div>
      </div>

      {/* Date Input */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Date of Travel</label>
        <div className="relative max-w-sm custom-datepicker-wrapper">
          <DatePicker
            selected={travelDate ? new Date(travelDate) : new Date()}
            onChange={(date) => {
              if (date) {
                // Adjust for timezone offset to keep strict date
                const offset = date.getTimezoneOffset();
                const localDate = new Date(date.getTime() - (offset * 60 * 1000));
                setTravelDate(localDate.toISOString().split('T')[0]);
              } else {
                setTravelDate("");
              }
            }}
            dateFormat="dd MMM yyyy"
            className="w-full px-4 py-1.5 pl-4 pr-10 rounded-xl border border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all text-slate-700 bg-white cursor-pointer"
            wrapperClassName="w-full"
            placeholderText="Select a date"
            onKeyDown={(e) => e.preventDefault()} // Prevent typing
          />
          <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-slate-400 pointer-events-none" />
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
        {directions && (
          <button
            type="button"
            onClick={() => {
              const leg = directions.routes[0].legs[0];
              navigate('/transport-comparison', {
                state: {
                  distanceMeters: leg.distance.value,
                  durationSeconds: leg.duration.value,
                  durationSeconds: leg.duration.value,
                  origin: leg.start_address,
                  originName: origin.name || leg.start_address,
                  destination: leg.end_address,
                  destinationName: destination.name || leg.end_address,
                  date: travelDate
                }
              });
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-medium hover:from-emerald-600 hover:to-teal-700 shadow-md transform transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Leaf className="w-4 h-4" />
            Analyze Eco-Impact
          </button>
        )}
      </div>

      {
        mapError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
            {mapError}
          </div>
        )
      }

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
