"use client"

import { useState, useEffect, useRef } from "react"
import axios from "axios"
import { toast } from "react-hot-toast"
import { FaMapMarkerAlt, FaTimes, FaLocationArrow, FaSearch } from "react-icons/fa"
import "./LocationSearch.css"

const LocationSearch = ({ onLocationSelect, initialLocation }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [locations, setLocations] = useState([])
  const [popularLocations, setPopularLocations] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(initialLocation)
  const [userLocation, setUserLocation] = useState(null)
  const [detectingLocation, setDetectingLocation] = useState(false)
  const dropdownRef = useRef(null)

  // Fetch popular locations on component mount
  useEffect(() => {
    fetchPopularLocations()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Fetch locations based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setLocations([])
      return
    }

    const fetchLocations = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`http://localhost:5000/api/location/search?query=${searchTerm}`)
        setLocations(response.data || [])
      } catch (error) {
        console.error("Error fetching locations:", error)
        // Fallback to sample data if API fails
        setLocations(getSampleLocations(searchTerm))
      } finally {
        setLoading(false)
      }
    }

    // Debounce the search
    const timer = setTimeout(() => {
      fetchLocations()
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  const fetchPopularLocations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/location/popular")
      setPopularLocations(response.data || [])
    } catch (error) {
      console.error("Error fetching popular locations:", error)
      // Fallback to sample data
      setPopularLocations([
        { id: 1, name: "Delhi", pinCode: "110001", state: "Delhi" },
        { id: 2, name: "Mumbai", pinCode: "400001", state: "Maharashtra" },
        { id: 3, name: "Bangalore", pinCode: "560001", state: "Karnataka" },
        { id: 4, name: "Pune", pinCode: "411001", state: "Maharashtra" },
        { id: 5, name: "Hyderabad", pinCode: "500001", state: "Telangana" },
      ])
    }
  }

  // Sample locations for fallback
  const getSampleLocations = (query) => {
    const allLocations = [
      { id: 1, name: "Delhi", pinCode: "110001", state: "Delhi" },
      { id: 2, name: "Mumbai", pinCode: "400001", state: "Maharashtra" },
      { id: 3, name: "Bangalore", pinCode: "560001", state: "Karnataka" },
      { id: 4, name: "Chennai", pinCode: "600001", state: "Tamil Nadu" },
      { id: 5, name: "Kolkata", pinCode: "700001", state: "West Bengal" },
      { id: 6, name: "Hyderabad", pinCode: "500001", state: "Telangana" },
      { id: 7, name: "Pune", pinCode: "411001", state: "Maharashtra" },
      { id: 8, name: "Ahmedabad", pinCode: "380001", state: "Gujarat" },
      { id: 9, name: "Jaipur", pinCode: "302001", state: "Rajasthan" },
      { id: 10, name: "Lucknow", pinCode: "226001", state: "Uttar Pradesh" },
    ]

    return allLocations.filter(
      (location) =>
        location.name.toLowerCase().includes(query.toLowerCase()) ||
        location.pinCode.includes(query) ||
        location.state.toLowerCase().includes(query.toLowerCase()),
    )
  }

  const handleLocationClick = (location) => {
    setSelectedLocation(location)
    setIsOpen(false)
    setSearchTerm("")

    // Save to localStorage
    localStorage.setItem("selectedLocation", JSON.stringify(location))

    // Notify parent component
    if (onLocationSelect) {
      onLocationSelect(location)
    }
  }

  const clearLocation = (e) => {
    e.stopPropagation()
    setSelectedLocation(null)

    // Remove from localStorage
    localStorage.removeItem("selectedLocation")

    // Notify parent component
    if (onLocationSelect) {
      onLocationSelect(null)
    }

    toast.success("Location cleared")
  }

  const detectCurrentLocation = () => {
    setDetectingLocation(true)

    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your browser")
      setDetectingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords

          // Call reverse geocoding API
          const response = await axios.get(
            `http://localhost:5000/api/location/reverse-geocode?lat=${latitude}&lng=${longitude}`,
          )

          if (response.data) {
            const location = response.data
            setSelectedLocation(location)
            localStorage.setItem("selectedLocation", JSON.stringify(location))

            // Notify parent component
            if (onLocationSelect) {
              onLocationSelect(location)
            }

            toast.success(`Location set to ${location.name}`)
          } else {
            toast.error("Could not determine your location")
          }
        } catch (error) {
          console.error("Error detecting location:", error)
          toast.error("Failed to detect your location")

          // Fallback to a sample location for demo purposes
          const fallbackLocation = {
            id: 999,
            name: "Detected Location",
            pinCode: "110001",
            state: "Delhi",
          }

          setSelectedLocation(fallbackLocation)
          localStorage.setItem("selectedLocation", JSON.stringify(fallbackLocation))

          if (onLocationSelect) {
            onLocationSelect(fallbackLocation)
          }

          toast.success(`Location set to ${fallbackLocation.name} (Demo)`)
        } finally {
          setDetectingLocation(false)
          setIsOpen(false)
        }
      },
      (error) => {
        console.error("Geolocation error:", error)
        toast.error("Failed to detect your location. Please allow location access.")
        setDetectingLocation(false)
      },
    )
  }

  return (
    <div className="location-search-container" ref={dropdownRef}>
      <div className={`location-selector ${selectedLocation ? "has-location" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <FaMapMarkerAlt className="location-icon" />
        {selectedLocation ? (
          <div className="selected-location">
            <span>{selectedLocation.name}</span>
            <FaTimes className="clear-location" onClick={clearLocation} />
          </div>
        ) : (
          <span>Select Location</span>
        )}
      </div>

      {isOpen && (
        <div className="location-dropdown">
          <div className="location-search-header">
            <h5>Select your location</h5>
            <button className="detect-location-btn" onClick={detectCurrentLocation} disabled={detectingLocation}>
              <FaLocationArrow className="location-arrow-icon" />
              {detectingLocation ? "Detecting..." : "Detect my location"}
            </button>
          </div>

          <div className="location-search-input">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search city or pincode"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          {searchTerm.trim() === "" ? (
            <div className="popular-locations">
              <h6>Popular Locations</h6>
              <div className="popular-locations-grid">
                {popularLocations.map((location) => (
                  <div
                    key={location.id}
                    className="popular-location-item"
                    onClick={() => handleLocationClick(location)}
                  >
                    <FaMapMarkerAlt className="location-marker" />
                    <span>{location.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="location-list">
              {loading ? (
                <div className="location-loading">
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <span>Searching locations...</span>
                </div>
              ) : locations.length > 0 ? (
                locations.map((location) => (
                  <div key={location.id} className="location-item" onClick={() => handleLocationClick(location)}>
                    <FaMapMarkerAlt className="location-item-icon" />
                    <div className="location-details">
                      <div className="location-name">{location.name}</div>
                      <div className="location-pincode">
                        {location.pinCode}, {location.state}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-locations">
                  <p>No locations found</p>
                  <small>Try searching for a different city or pincode</small>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LocationSearch

