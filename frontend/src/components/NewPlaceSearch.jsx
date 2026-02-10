import { useRef, useEffect } from "react";

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

  return (
    <div
      ref={containerRef}
      className={className}
      aria-label={placeholder ?? "Search for a place"}
    />
  );
};

export default NewPlaceSearch;
