"use client"

import { useState, useEffect, useRef } from "react"
import { FaMapMarkerAlt, FaSearch, FaTimes } from "react-icons/fa"
import { getPopularCities, searchLocations, saveSelectedLocation } from "../utils/locationService"
import "./LocationSearch.css"

const LocationSearch = ({ onLocationSelect, initialLocation }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [locations, setLocations] = useState([])
  const [popularCities, setPopularCities] = useState([])
  const [selectedLocation, setSelectedLocation] = useState(initialLocation || null)
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  // Fetch popular cities on component mount
  useEffect(() => {
    const fetchPopularCities = async () => {
      const cities = await getPopularCities()
      setPopularCities(cities)
    }

    fetchPopularCities()
  }, [])

  // Handle click outside to close dropdown
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

  // Search for locations when query changes
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchQuery.trim()) {
        setLoading(true)
        const results = await searchLocations(searchQuery)
        setLocations(results)
        setLoading(false)
      } else {
        setLocations([])
      }
    }, 300)

    return () => clearTimeout(searchTimer)
  }, [searchQuery])

  const handleLocationSelect = (location) => {
    setSelectedLocation(location)
    saveSelectedLocation(location)
    setIsOpen(false)
    setSearchQuery("")

    if (onLocationSelect) {
      onLocationSelect(location)
    }
  }

  // Allow users to add a custom location
  const handleAddCustomLocation = () => {
    if (!searchQuery.trim()) return

    const customLocation = {
      name: searchQuery,
      state: "",
      pinCode: searchQuery.replace(/\D/g, "").substring(0, 6) || "000000", // Extract numbers or use default
      coordinates: { lat: 0, lng: 0 },
    }

    handleLocationSelect(customLocation)
  }

  const handleToggleDropdown = () => {
    setIsOpen(!isOpen)
    if (!isOpen && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus()
      }, 100)
    }
  }

  const handleClearLocation = (e) => {
    e.stopPropagation()
    setSelectedLocation(null)
    saveSelectedLocation(null)

    if (onLocationSelect) {
      onLocationSelect(null)
    }
  }

  return (
    <div className="location-search-container" ref={dropdownRef}>
      <div className={`location-selector ${isOpen ? "active" : ""}`} onClick={handleToggleDropdown}>
        <FaMapMarkerAlt className="location-icon" />
        <span className="location-text">{selectedLocation ? selectedLocation.name : "Select Location"}</span>
        {selectedLocation && (
          <button className="clear-location-btn" onClick={handleClearLocation} aria-label="Clear location">
            <FaTimes />
          </button>
        )}
        <span className="dropdown-arrow">▼</span>
      </div>

      {isOpen && (
        <div className="location-dropdown">
          <div className="search-input-container">
            <FaSearch className="search-icon" />
            <input
              ref={searchInputRef}
              type="text"
              className="location-search-input"
              placeholder="Search for your city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="location-results">
            {loading ? (
              <div className="loading-indicator">
                <div className="spinner"></div>
                <span>Searching...</span>
              </div>
            ) : (
              <>
                {locations.length > 0 ? (
                  <div className="location-list">
                    <h4>Search Results</h4>
                    <ul>
                      {locations.map((location, index) => (
                        <li key={`search-${index}`} onClick={() => handleLocationSelect(location)}>
                          <FaMapMarkerAlt className="list-icon" />
                          <div>
                            <span className="location-name">{location.name}</span>
                            {location.state && <span className="location-state">{location.state}</span>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <>
                    {searchQuery && (
                      <div className="custom-location-option">
                        <p>Can't find your location?</p>
                        <button className="custom-location-btn" onClick={handleAddCustomLocation}>
                          Use "{searchQuery}" as my location
                        </button>
                      </div>
                    )}

                    <div className="popular-cities">
                      <h4>Popular Cities</h4>
                      <ul>
                        {popularCities.map((city, index) => (
                          <li key={`popular-${index}`} onClick={() => handleLocationSelect(city)}>
                            <FaMapMarkerAlt className="list-icon" />
                            <span className="location-name">{city.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default LocationSearch

