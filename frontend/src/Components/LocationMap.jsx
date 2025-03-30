import React, { useState } from "react";
import { Autocomplete } from "@react-google-maps/api";

const LocationMap = ({ onLocationSelect }) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const [location, setLocation] = useState("");

  const handlePlaceSelect = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.formatted_address) {
        setLocation(place.formatted_address);
        onLocationSelect({
          name: place.formatted_address,
          lat: place.geometry?.location.lat(),
          lng: place.geometry?.location.lng(),
        });
      }
    }
  };

  return (
    <div className="location-input">
      <Autocomplete
        onLoad={(auto) => setAutocomplete(auto)}
        onPlaceChanged={handlePlaceSelect}
      >
        <input
          type="text"
          placeholder="Enter location"
          className="form-control"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </Autocomplete>
    </div>
  );
};

export default LocationMap;
