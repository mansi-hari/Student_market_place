import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import "./LocationSearch.css";

const LocationSearch = ({ onLocationSelect, initialLocation }) => {
  const [query, setQuery] = useState(initialLocation?.name || "");
  const [suggestions, setSuggestions] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  

  // Fetch location suggestions from Nominatim API, restricted to India
  const fetchSuggestions = async (searchQuery) => {
    if (!searchQuery) {
      setSuggestions([]);
      setIsDropdownOpen(false);
      return;
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          searchQuery
        )}&format=json&addressdetails=1&limit=5&countrycodes=IN`
      );
      const data = await response.json();
      setSuggestions(
        data.map((place) => ({
          name: place.display_name,
          latitude: place.lat,
          longitude: place.lon,
          pinCode: place.address?.postcode || null,
        }))
      );
      setIsDropdownOpen(true);
    } catch (error) {
      console.error("Error fetching location suggestions:", error);
      setSuggestions([]);
      setIsDropdownOpen(false);
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchSuggestions(query);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle input change
  const handleInputChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value) {
      setIsDropdownOpen(true);
    }
  };

  // Handle location selection
  const handleSelect = (location) => {
    setQuery(location.name);
    setIsDropdownOpen(false);
    onLocationSelect(location);
  };

  // Handle blur to close dropdown
  const handleBlur = () => {
    setTimeout(() => setIsDropdownOpen(false), 200);
  };

  const detectLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1&countrycodes=IN`
            );
            const data = await response.json();
            if (data && data.display_name) {
              const location = {
                name: data.display_name,
                latitude: data.lat,
                longitude: data.lon,
                pinCode: data.address?.postcode || null,
              };
              setQuery(location.name);
              onLocationSelect(location);
              toast.success("Location detected successfully!");
            }
          } catch (error) {
            console.error("Error detecting location:", error);
            toast.error("Failed to detect location.");
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          toast.error("Unable to detect location. Please enter manually.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };
  return (
    
    <div className="location-search-container">
      <input
        type="text"
        placeholder="Enter your location"
        value={query}
        onChange={handleInputChange}
        onFocus={() => setIsDropdownOpen(true)}
        onBlur={handleBlur}
        className="location-input"
      />
      {isDropdownOpen && suggestions.length > 0 && (
        <ul className="location-dropdown">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onMouseDown={() => handleSelect(suggestion)}
              className="location-suggestion"
            >
              {suggestion.name}
            </li>
          ))}
        </ul>
      )}
    </div>
    
  );
  
};

export default LocationSearch;