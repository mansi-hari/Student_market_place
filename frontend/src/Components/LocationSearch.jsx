"use client"

import { useState } from "react"
import { MapPin, Search, Sliders } from "lucide-react"
import { getCurrentLocation, reverseGeocode } from "../utils/geocodingService"
import LocationInput from "./LocationInput"

const LocationSearch = ({ onSearch }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [searchRadius, setSearchRadius] = useState(10) // in kilometers
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [isUsingCurrentLocation, setIsUsingCurrentLocation] = useState(false)

  // Handle location selection
  const handleLocationSelect = (locationData) => {
    setSelectedLocation(locationData)
  }

  // Handle search radius change
  const handleRadiusChange = (e) => {
    setSearchRadius(Number.parseInt(e.target.value, 10))
  }

  // Handle search submission
  const handleSearch = () => {
    if (selectedLocation && selectedLocation.coordinates) {
      onSearch({
        coordinates: selectedLocation.coordinates,
        radius: searchRadius,
        address: selectedLocation.formattedAddress,
      })
    }
  }

  // Use current location
  const handleUseCurrentLocation = async () => {
    setIsUsingCurrentLocation(true)
    try {
      const coords = await getCurrentLocation()
      const result = await reverseGeocode(coords.latitude, coords.longitude)

      if (result.success) {
        const locationData = {
          formattedAddress: result.formattedAddress,
          coordinates: coords,
        }
        setSelectedLocation(locationData)
        onSearch({
          coordinates: coords,
          radius: searchRadius,
          address: result.formattedAddress,
        })
      }
    } catch (error) {
      console.error("Error getting current location:", error)
    } finally {
      setIsUsingCurrentLocation(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Find Products Near You</h3>
          <button
            type="button"
            className="text-blue-600 hover:text-blue-800 flex items-center"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Sliders className="h-4 w-4 mr-1" />
            Filters
          </button>
        </div>

        <div className="mb-4">
          <LocationInput onLocationSelect={handleLocationSelect} />
        </div>

        {isFilterOpen && (
          <div className="mb-4 p-4 bg-gray-50 rounded-md">
            <label className="block text-sm font-medium text-gray-700 mb-2">Search Radius: {searchRadius} km</label>
            <input
              type="range"
              min="1"
              max="50"
              value={searchRadius}
              onChange={handleRadiusChange}
              className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>1 km</span>
              <span>25 km</span>
              <span>50 km</span>
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <button
            type="button"
            className="flex-1 py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
            onClick={handleSearch}
            disabled={!selectedLocation}
          >
            <Search className="h-4 w-4 mr-2" />
            Search
          </button>
          <button
            type="button"
            className="py-2 px-4 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center justify-center"
            onClick={handleUseCurrentLocation}
            disabled={isUsingCurrentLocation}
          >
            {isUsingCurrentLocation ? (
              <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-500 mr-2"></div>
            ) : (
              <MapPin className="h-4 w-4 mr-2" />
            )}
            Near Me
          </button>
        </div>
      </div>
    </div>
  )
}

export default LocationSearch

