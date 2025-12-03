import React, { useEffect, useState } from "react";
import { API_BASE_URL } from "../../utils/constants";

// This functional component, GetCurrentAddress, is responsible for retrieving and displaying the user's current address based on their geolocation coordinates.

function GetCurrentAddress() {
  // Initialize state to store the address object with a default country
  // Default to empty string for country - will be used as fallback
  const [address, setAddress] = useState({ country: "" });

  // The 'useEffect' hook is used to execute side effects in function components. In this case, it's used to fetch the user's address based on geolocation when the component mounts (empty dependency array).
  useEffect(() => {
    // Check if geolocation should be disabled via environment variable or localStorage
    // Note: In Vite, use import.meta.env instead of process.env
    const geolocationDisabled =
      import.meta.env.VITE_DISABLE_GEOLOCATION === "true" ||
      localStorage.getItem("disableGeolocation") === "true";

    if (geolocationDisabled) {
      setAddress({ country: "" });
      return;
    }

    // Check if geolocation is available in the browser
    if (!navigator.geolocation) {
      // Geolocation not supported - set default country
      setAddress({ country: "" });
      return;
    }

    // Check permissions first to avoid CoreLocation errors
    // This helps prevent the system-level error by checking permissions before making the call
    const checkPermissions = async () => {
      try {
        // Check if Permissions API is available
        if (navigator.permissions && navigator.permissions.query) {
          const permission = await navigator.permissions.query({
            name: "geolocation",
          });

          // If permission is denied, don't make the geolocation call
          if (permission.state === "denied") {
            setAddress({ country: "" });
            return false;
          }
        }
        return true;
      } catch (error) {
        // Permissions API might not be supported or might throw an error
        // Continue with geolocation call anyway
        return true;
      }
    };

    // Check permissions and only proceed if allowed
    checkPermissions().then((shouldProceed) => {
      if (!shouldProceed) {
        return;
      }

      // Options for geolocation request
      const options = {
        enableHighAccuracy: false, // Use less accurate but faster method
        timeout: 10000, // 10 second timeout
        maximumAge: 300000, // Accept cached position up to 5 minutes old
      };

      // The 'navigator.geolocation.getCurrentPosition' function is used to retrieve the user's current geolocation coordinates.
      // Wrap in try-catch to handle any synchronous errors
      try {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            // Success callback: Extract the latitude and longitude from the position coordinates.
            const { latitude, longitude } = pos.coords;

            // Try to get country from coordinates
            // Note: Nominatim API has CORS restrictions, so we'll try backend proxy first, then fallback
            const getCountryFromCoordinates = async (lat, lon) => {
              try {
                // First, try using backend proxy if available (recommended approach)
                // This avoids CORS issues
                try {
                  const backendUrl =
                    API_BASE_URL || import.meta.env.VITE_API_URL || "";

                  if (backendUrl) {
                    // Create AbortController for timeout
                    const controller = new AbortController();
                    const timeoutId = setTimeout(
                      () => controller.abort(),
                      30000 // 30 seconds for geocoding
                    );

                    try {
                      const proxyResponse = await fetch(
                        `${backendUrl}geocode/reverse/?lat=${lat}&lon=${lon}`,
                        {
                          method: "GET",
                          headers: {
                            "Content-Type": "application/json",
                          },
                          signal: controller.signal,
                        }
                      );

                      clearTimeout(timeoutId);

                      if (proxyResponse.ok) {
                        const data = await proxyResponse.json();
                        if (data && data.address) {
                          const country =
                            data.address.country ||
                            data.address.country_code?.toUpperCase() ||
                            "";
                          return country;
                        }
                      }
                      // If not ok (404, 500, etc.), silently continue to fallback
                    } catch (fetchError) {
                      clearTimeout(timeoutId);
                      // Silently handle fetch errors (404, timeout, network) - continue to fallback
                      throw fetchError; // Re-throw to be caught by outer catch
                    }
                  }
                } catch (proxyError) {
                  // Backend proxy not available (404 or timeout) - silently continue to fallback
                  // Only log in development mode
                  if (import.meta.env.DEV) {
                    console.debug(
                      "Backend geocoding proxy not available:",
                      proxyError
                    );
                  }
                  // Don't throw - continue to direct API call fallback
                }

                // Skip direct Nominatim API call - it will always fail due to CORS
                // The backend proxy is the only way to get geocoding data
                // If backend proxy fails, just return empty string (non-critical feature)
                return "";
              } catch (error) {
                // Handle CORS and other errors gracefully
                if (import.meta.env.DEV) {
                  if (
                    error.message.includes("CORS") ||
                    error.message.includes("blocked")
                  ) {
                    console.debug(
                      "Geocoding API CORS error: Use backend proxy or enable CORS on geocoding service"
                    );
                  } else {
                    console.debug("Geocoding API error:", error);
                  }
                }
                return "";
              }
            };

            // Get country asynchronously
            getCountryFromCoordinates(latitude, longitude).then((country) => {
              if (country) {
                setAddress({
                  country: country,
                });
              } else {
                // Set empty country if geocoding fails
                setAddress({ country: "" });
              }
            });
          },
          (error) => {
            // Error callback: Handle geolocation errors gracefully
            // Note: The CoreLocation error from macOS is a system-level error that occurs
            // before our error handler runs. This is expected behavior when:
            // - Location services are disabled
            // - Permission was denied
            // - Device can't determine location
            // We handle it silently here - no need to log as it's expected behavior

            // Only log in development mode for debugging
            if (import.meta.env.DEV) {
              switch (error.code) {
                case error.PERMISSION_DENIED:
                  console.debug("Geolocation: Permission denied by user");
                  break;
                case error.POSITION_UNAVAILABLE:
                  console.debug(
                    "Geolocation: Position unavailable (this is normal if location services are disabled)"
                  );
                  break;
                case error.TIMEOUT:
                  console.debug("Geolocation: Request timed out");
                  break;
                default:
                  console.debug(
                    "Geolocation: Unknown error (code:",
                    error.code + ")"
                  );
                  break;
              }
            }
            // Set empty country when location is unavailable
            setAddress({ country: "" });
          },
          options
        );
      } catch (error) {
        // Catch any synchronous errors that might occur
        if (import.meta.env.DEV) {
          console.debug("Geolocation: Synchronous error:", error);
        }
        setAddress({ country: "" });
      }
    });
  }, []); // The empty dependency array ensures that this effect runs only once when the component mounts.

  // Return the address object with country property
  return address;
}

// Export the GetCurrentAddress component for use in other parts of the application.
export default GetCurrentAddress;
