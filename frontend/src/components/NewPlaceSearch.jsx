import { useRef, useEffect, useState } from "react";
import { environmentService } from "../services/environmentService";

/**
 * Modern Google Places Autocomplete using the PlaceAutocompleteElement web component.
 * Use this instead of the deprecated google.maps.places.Autocomplete (blocked for
 * new billing accounts after March 2025).
 *
 * Styling: PlaceAutocompleteElement uses Shadow DOM. To style it, target the
 * host or use CSS variables / ::part() if exposed by the component. Example:
 *   .place-autocomplete-wrapper::part(input) { ... }
 * or set variables on the wrapper and check Google's Places UI Kit docs for
 * supported custom properties.
 */
const NewPlaceSearch = ({ onPlaceSelected, placeholder, id, className = "" }) => {
  const containerRef = useRef(null);
  const [aqiData, setAqiData] = useState(null);
  const [aqiLoading, setAqiLoading] = useState(false);
  const [aqiError, setAqiError] = useState(null);

  useEffect(() => {
    const g = typeof window !== "undefined" ? window.google : null;
    if (!g?.maps || !containerRef.current) return;

    let element = null;
    let handleSelect = null;

    const init = async () => {
      try {
        // Prefer importLibrary so we get the new Places API (PlaceAutocompleteElement)
        const placesLib =
          typeof g.maps.importLibrary === "function"
            ? await g.maps.importLibrary("places")
            : g.maps.places;
        const PlaceAutocompleteElement =
          placesLib?.PlaceAutocompleteElement ?? g.maps.places?.PlaceAutocompleteElement;

        if (!PlaceAutocompleteElement) {
          console.error(
            "PlaceAutocompleteElement not available. Ensure the Maps JavaScript API is loaded with the new loader and Places (UI Kit) is enabled."
          );
          return;
        }

        element = new PlaceAutocompleteElement({});
        if (placeholder) element.setAttribute("placeholder", placeholder);
        if (id) element.setAttribute("id", id);

        handleSelect = async (event) => {
          const placePrediction =
            event.detail?.placePrediction ?? event.placePrediction;
          if (!placePrediction?.toPlace) return;

          const place = placePrediction.toPlace();
          await place.fetchFields({
            fields: ["displayName", "formattedAddress", "location"],
          });

          const displayName =
            place.displayName?.text ?? place.displayName ?? "";
          const address =
            place.formattedAddress ?? displayName ?? "";
          const loc = place.location;
          const lat =
            typeof loc?.lat === "function" ? loc.lat() : loc?.lat;
          const lng =
            typeof loc?.lng === "function" ? loc.lng() : loc?.lng;

          if (lat != null && lng != null) {
            setAqiLoading(true);
            setAqiError(null);
            environmentService.getAQI(lat, lng)
              .then(data => setAqiData(data.aqi))
              .catch(err => setAqiError("Failed to load AQI data"))
              .finally(() => setAqiLoading(false));
          } else {
            setAqiData(null);
          }

          onPlaceSelected?.({
            address,
            name: displayName,
            place:
              lat != null && lng != null ? { lat, lng } : null,
          });
        };

        element.addEventListener("gmp-select", handleSelect);
        containerRef.current.appendChild(element);
      } catch (err) {
        console.error("NewPlaceSearch init error:", err);
      }
    };

    init();

    return () => {
      if (handleSelect && element) {
        element.removeEventListener("gmp-select", handleSelect);
      }
      if (element?.parentNode) {
        element.parentNode.removeChild(element);
      }
    };
  }, [onPlaceSelected, placeholder, id]);

  const renderAqiBadge = () => {
    if (aqiLoading) return <div className="text-sm text-gray-400 mt-2">Loading AQI...</div>;
    if (aqiError) return <div className="text-sm text-red-500 mt-2">{aqiError}</div>;
    if (!aqiData) return null;

    let badgeColor = "";
    let badgeText = "";

    if (aqiData <= 2) {
      badgeColor = "bg-green-100 text-green-800 border-green-200 border";
      badgeText = "🟢 Good air quality";
    } else if (aqiData === 3) {
      badgeColor = "bg-yellow-100 text-yellow-800 border-yellow-200 border";
      badgeText = "🟡 Moderate — consider cycling";
    } else {
      badgeColor = "bg-red-100 text-red-800 border-red-200 border";
      badgeText = "🔴 Poor air quality — avoid driving";
    }

    return (
        <div className={`mt-2 inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium w-fit ${badgeColor}`}>
          {badgeText}
        </div>
    );
  };

  return (
    <div className={`relative w-full flex flex-col ${className}`}>
      <div
        ref={containerRef}
        aria-label={placeholder ?? "Search for a place"}
        className="w-full"
      />
      {renderAqiBadge()}
    </div>
  );
};

export default NewPlaceSearch;
