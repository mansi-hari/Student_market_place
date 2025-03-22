"use client"

import { useState, useEffect, useRef } from "react"
import { MapPin, Loader, X, Navigation } from "lucide-react"
import { toast } from "react-hot-toast"
import { geocodeAddress, getCurrentLocation, reverseGeocode } from "../utils/geocodingService"

const LocationInput = ({ onLocationSelect, initialLocation = null }) => {
  const [address, setAddress] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false)
  const autocompleteService = useRef(null)
  const inputRef = useRef(null)

  // Initialize Google Maps Autocomplete service
  useEffect(() => {
    if (window.google && window.google.maps && window.google.maps.places) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService()
    } else {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        autocompleteService.current = new window.google.maps.places.AutocompleteService()
      }
      document.head.appendChild(script)
    }

    // Set initial address if provided
    if (initialLocation && initialLocation.formattedAddress) {
      setAddress(initialLocation.formattedAddress)
      setSelectedLocation(initialLocation)
    }

    return () => {
      // Clean up if needed
    }
  }, [initialLocation])

  // Handle address input change
  const handleAddressChange = (e) => {
    const value = e.target.value
    setAddress(value)
    setSelectedLocation(null)

    if (value.length > 2 && autocompleteService.current) {
      autocompleteService.current.getPlacePredictions({ input: value }, (predictions, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions)
          setShowSuggestions(true)
        } else {
          setSuggestions([])
          setShowSuggestions(false)
        }
      })
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Handle suggestion selection
  const handleSelectSuggestion = async (suggestion) => {
    setAddress(suggestion.description)
    setShowSuggestions(false)
    setIsLoading(true)

    try {
      const result = await geocodeAddress(suggestion.description)
      if (result.success) {
        const locationData = {
          formattedAddress: result.formattedAddress,
          coordinates: result.coordinates,
          placeId: suggestion.place_id,
        }
        setSelectedLocation(locationData)
        onLocationSelect(locationData)
        toast.success("Location selected successfully")
      } else {
        toast.error(result.error || "Failed to get coordinates for this address")
      }
    } catch (error) {
      console.error("Error selecting location:", error)
      toast.error("Failed to process location")
    } finally {
      setIsLoading(false)
    }
  }

  // Handle using current location
  const handleUseCurrentLocation = async () => {
    setIsUsingCurrentLocation(true)
    try {
      const coords = await getCurrentLocation()
      const result = await reverseGeocode(coords.latitude, coords.longitude)

      if (result.success) {
        setAddress(result.formattedAddress)
        const locationData = {
          formattedAddress: result.formattedAddress,
          coordinates: coords,
        }
        setSelectedLocation(locationData)
        onLocationSelect(locationData)
        toast.success("Using your current location")
      } else {
        toast.error(result.error || "Failed to get address for your location")
      }
    } catch (error) {
      console.error("Error getting current location:", error)
      toast.error("Failed to get your current location")
    } finally {
      setIsUsingCurrentLocation(false)
    }
  }

  // Clear the selected location
  const handleClearLocation = () => {
    setAddress("")
    setSelectedLocation(null)
    onLocationSelect(null)
    inputRef.current?.focus()
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
      <div className="relative">
        <div className="flex">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="h-5 w-5 text-gray-400" />
            </div>
            <input
              ref={inputRef}
              type="text"
              placeholder="Enter address or location"
              className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={address}
              onChange={handleAddressChange}
              onFocus={() => address.length > 2 && setSuggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            {address && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={handleClearLocation}
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
              </button>
            )}
          </div>
          <button
            type="button"
            className="ml-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleUseCurrentLocation}
            disabled={isUsingCurrentLocation}
          >
            {isUsingCurrentLocation ? (
              <Loader className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Navigation className="h-4 w-4 mr-2" />
            )}
            Current Location
          </button>
        </div>

        {/* Location suggestions dropdown */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
            <ul className="py-1">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-start"
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  <MapPin className="h-5 w-5 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{suggestion.description}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Selected location display */}
      {selectedLocation && (
        <div className="mt-2 p-3 bg-blue-50 rounded-md">
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-700">Selected Location</p>
              <p className="text-sm text-blue-600">{selectedLocation.formattedAddress}</p>
              {selectedLocation.coordinates && (
                <p className="text-xs text-blue-500 mt-1">
                  Lat: {selectedLocation.coordinates.latitude.toFixed(6)}, Lng:{" "}
                  {selectedLocation.coordinates.longitude.toFixed(6)}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="mt-2 flex items-center text-sm text-gray-500">
          <Loader className="h-4 w-4 mr-2 animate-spin" />
          Processing location...
        </div>
      )}
    </div>
  )
}

export default LocationInput

