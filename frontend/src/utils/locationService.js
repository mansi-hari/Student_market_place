import axios from "axios"

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000"

// Default popular cities in case API fails
const defaultPopularCities = [
  { name: "Mumbai", state: "Maharashtra", pinCode: "400001", coordinates: { lat: 19.076, lng: 72.8777 } },
  { name: "Delhi", state: "Delhi", pinCode: "110001", coordinates: { lat: 28.7041, lng: 77.1025 } },
  { name: "Bangalore", state: "Karnataka", pinCode: "560001", coordinates: { lat: 12.9716, lng: 77.5946 } },
  { name: "Hyderabad", state: "Telangana", pinCode: "500001", coordinates: { lat: 17.385, lng: 78.4867 } },
  { name: "Chennai", state: "Tamil Nadu", pinCode: "600001", coordinates: { lat: 13.0827, lng: 80.2707 } },
  { name: "Kolkata", state: "West Bengal", pinCode: "700001", coordinates: { lat: 22.5726, lng: 88.3639 } },
  { name: "Pune", state: "Maharashtra", pinCode: "411001", coordinates: { lat: 18.5204, lng: 73.8567 } },
  { name: "Ahmedabad", state: "Gujarat", pinCode: "380001", coordinates: { lat: 23.0225, lng: 72.5714 } },
]

// Get popular cities
export const getPopularCities = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/location/popular-cities`)
    return response.data
  } catch (error) {
    console.error("Error fetching popular cities:", error)
    // Return default cities if API fails
    return defaultPopularCities
  }
}

// Search for locations based on query
export const searchLocations = async (query) => {
  try {
    if (!query.trim()) return []

    const response = await axios.get(`${API_URL}/api/location/search?q=${encodeURIComponent(query)}`)
    return response.data
  } catch (error) {
    console.error("Error searching locations:", error)

    // If API fails, try to match with default cities
    if (query.trim()) {
      const matchedCities = defaultPopularCities.filter(
        (city) =>
          city.name.toLowerCase().includes(query.toLowerCase()) ||
          city.state.toLowerCase().includes(query.toLowerCase()) ||
          city.pinCode.includes(query),
      )

      return matchedCities
    }

    return []
  }
}

// Get location details by pincode
export const getLocationByPincode = async (pincode) => {
  try {
    const response = await axios.get(`${API_URL}/api/location/pincode/${pincode}`)
    return response.data
  } catch (error) {
    console.error("Error fetching location by pincode:", error)

    // Try to find in default cities
    const matchedCity = defaultPopularCities.find((city) => city.pinCode === pincode)
    if (matchedCity) return matchedCity

    // Return a generic location if not found
    return {
      name: `Area ${pincode}`,
      state: "",
      pinCode: pincode,
      coordinates: { lat: 0, lng: 0 },
    }
  }
}

// Save selected location to localStorage
export const saveSelectedLocation = (location) => {
  if (location) {
    localStorage.setItem("selectedLocation", JSON.stringify(location))
  } else {
    localStorage.removeItem("selectedLocation")
  }
}

// Get selected location from localStorage
export const getSelectedLocation = () => {
  try {
    const location = localStorage.getItem("selectedLocation")
    return location ? JSON.parse(location) : null
  } catch (error) {
    console.error("Error parsing saved location:", error)
    localStorage.removeItem("selectedLocation")
    return null
  }
}

// Clear selected location
export const clearSelectedLocation = () => {
  localStorage.removeItem("selectedLocation")
}

