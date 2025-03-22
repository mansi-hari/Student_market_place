"use client"

import { useState, useEffect } from "react"
import { MapPin, Search, ChevronDown, Check } from "lucide-react"
import { toast } from "react-hot-toast"

const LocationSelector = () => {
  const [selectedCity, setSelectedCity] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [recentLocations, setRecentLocations] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showMap, setShowMap] = useState(false)
  const [userLocation, setUserLocation] = useState(null)

  // Sample cities data
  const popularCities = [
    { id: 1, name: "Delhi", count: "25,000+ listings" },
    { id: 2, name: "Mumbai", count: "20,000+ listings" },
    { id: 3, name: "Bangalore", count: "18,000+ listings" },
    { id: 4, name: "Hyderabad", count: "15,000+ listings" },
    { id: 5, name: "Chennai", count: "12,000+ listings" },
    { id: 6, name: "Kolkata", count: "10,000+ listings" },
    { id: 7, name: "Pune", count: "8,000+ listings" },
    { id: 8, name: "Ahmedabad", count: "7,000+ listings" },
    { id: 9, name: "Jaipur", count: "5,000+ listings" },
    { id: 10, name: "Chandigarh", count: "4,000+ listings" },
  ]

  // Sample nearby locations
  const nearbyLocations = [
    { id: 11, name: "Gurgaon", distance: "15 km" },
    { id: 12, name: "Noida", distance: "20 km" },
    { id: 13, name: "Faridabad", distance: "25 km" },
    { id: 14, name: "Ghaziabad", distance: "30 km" },
  ]

  useEffect(() => {
    // Load saved location from localStorage
    const savedLocation = localStorage.getItem("selectedCity")
    if (savedLocation) {
      setSelectedCity(savedLocation)
    }

    // Load recent locations from localStorage
    const savedRecentLocations = localStorage.getItem("recentLocations")
    if (savedRecentLocations) {
      try {
        setRecentLocations(JSON.parse(savedRecentLocations))
      } catch (error) {
        console.error("Error parsing recent locations:", error)
        setRecentLocations([])
      }
    }

    // Simulate loading
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    // Get user's current location if available
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
        },
      )
    }
  }, [])

  const handleCitySelect = (city) => {
    setSelectedCity(city.name)
    localStorage.setItem("selectedCity", city.name)

    // Add to recent locations if not already there
    if (!recentLocations.some((loc) => loc.name === city.name)) {
      const updatedRecentLocations = [city, ...recentLocations].slice(0, 5)
      setRecentLocations(updatedRecentLocations)
      localStorage.setItem("recentLocations", JSON.stringify(updatedRecentLocations))
    }

    setIsDropdownOpen(false)
    toast.success(`Location set to ${city.name}`)
  }

  const handleUseCurrentLocation = () => {
    if (userLocation) {
      // In a real app, you would use a geocoding service to get the city name
      // For demo purposes, we'll just set it to "Current Location"
      const currentLocationCity = { id: 0, name: "Current Location", count: "Nearby listings" }
      handleCitySelect(currentLocationCity)
      toast.success("Using your current location")
    } else {
      toast.error("Unable to get your current location")
    }
  }

  const filteredCities = popularCities.filter((city) => city.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Select Location</h1>

      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-3xl mx-auto">
        <div className="p-6">
          <div className="relative mb-6">
            <div
              className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:border-blue-500"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="flex items-center">
                <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                <span>{selectedCity || "Select your location"}</span>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-500 transition-transform ${isDropdownOpen ? "transform rotate-180" : ""}`}
              />
            </div>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-10 border">
                <div className="p-4 border-b">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                      type="text"
                      placeholder="Search for your city..."
                      className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>

                {userLocation && (
                  <div className="p-4 border-b">
                    <button
                      className="flex items-center text-blue-600 hover:text-blue-800"
                      onClick={handleUseCurrentLocation}
                    >
                      <MapPin className="h-5 w-5 mr-2" />
                      Use my current location
                    </button>
                  </div>
                )}

                {recentLocations.length > 0 && (
                  <div className="p-4 border-b">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Locations</h3>
                    <div className="space-y-2">
                      {recentLocations.map((city) => (
                        <div
                          key={city.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                          onClick={() => handleCitySelect(city)}
                        >
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{city.name}</span>
                          </div>
                          {selectedCity === city.name && <Check className="h-4 w-4 text-green-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-4 max-h-60 overflow-y-auto">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Popular Cities</h3>
                  <div className="space-y-2">
                    {filteredCities.length === 0 ? (
                      <p className="text-sm text-gray-500 py-2">No cities found</p>
                    ) : (
                      filteredCities.map((city) => (
                        <div
                          key={city.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                          onClick={() => handleCitySelect(city)}
                        >
                          <div>
                            <div className="flex items-center">
                              <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                              <span>{city.name}</span>
                            </div>
                            <p className="text-xs text-gray-500 ml-6">{city.count}</p>
                          </div>
                          {selectedCity === city.name && <Check className="h-4 w-4 text-green-500" />}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {nearbyLocations.length > 0 && searchQuery === "" && (
                  <div className="p-4 border-t">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Nearby Locations</h3>
                    <div className="space-y-2">
                      {nearbyLocations.map((city) => (
                        <div
                          key={city.id}
                          className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md cursor-pointer"
                          onClick={() => handleCitySelect(city)}
                        >
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                            <span>{city.name}</span>
                            <span className="text-xs text-gray-500 ml-2">({city.distance})</span>
                          </div>
                          {selectedCity === city.name && <Check className="h-4 w-4 text-green-500" />}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {selectedCity && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2">Currently Browsing</h2>
              <div className="flex items-center bg-blue-50 p-4 rounded-lg">
                <MapPin className="h-5 w-5 text-blue-500 mr-2" />
                <span className="font-medium">{selectedCity}</span>
                <button className="ml-auto text-blue-600 hover:text-blue-800" onClick={() => setShowMap(!showMap)}>
                  {showMap ? "Hide Map" : "Show Map"}
                </button>
              </div>
            </div>
          )}

          {showMap && selectedCity && (
            <div className="mb-6 border rounded-lg overflow-hidden">
              <div className="bg-gray-200 h-64 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-600">Map view for {selectedCity}</p>
                  <p className="text-sm text-gray-500">In a real app, this would show an interactive map</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex flex-col space-y-4">
            <button
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              onClick={() => {
                if (selectedCity) {
                  toast.success(`Location confirmed: ${selectedCity}`)
                  // In a real app, you would redirect to the home page or refresh listings
                  window.location.href = "/"
                } else {
                  toast.error("Please select a location")
                  setIsDropdownOpen(true)
                }
              }}
            >
              Confirm Location
            </button>

            <button
              className="w-full py-2 px-4 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              onClick={() => {
                setSelectedCity("")
                localStorage.removeItem("selectedCity")
                toast.success("Location cleared")
              }}
            >
              Clear Location
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationSelector

