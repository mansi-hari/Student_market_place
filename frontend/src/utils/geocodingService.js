/**
 * Utility functions for geocoding addresses and handling location data
 */

// Function to convert address to coordinates using Google Maps Geocoding API
export const geocodeAddress = async (address) => {
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      const encodedAddress = encodeURIComponent(address)
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`,
      )
  
      const data = await response.json()
  
      if (data.status === "OK" && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location
        const formattedAddress = data.results[0].formatted_address
  
        return {
          coordinates: { latitude: lat, longitude: lng },
          formattedAddress,
          success: true,
        }
      } else {
        console.error("Geocoding error:", data.status)
        return {
          success: false,
          error: `Geocoding failed: ${data.status}`,
        }
      }
    } catch (error) {
      console.error("Error geocoding address:", error)
      return {
        success: false,
        error: "Failed to geocode address",
      }
    }
  }
  
  // Function to calculate distance between two coordinates in kilometers
  export const calculateDistance = (coords1, coords2) => {
    const R = 6371 // Earth's radius in km
    const dLat = toRad(coords2.latitude - coords1.latitude)
    const dLon = toRad(coords2.longitude - coords1.longitude)
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(coords1.latitude)) * Math.cos(toRad(coords2.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c
  
    return distance
  }
  
  // Helper function to convert degrees to radians
  const toRad = (value) => {
    return (value * Math.PI) / 180
  }
  
  // Function to get user's current location
  export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by your browser"))
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          },
          (error) => {
            reject(error)
          },
          { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 },
        )
      }
    })
  }
  
  // Function to reverse geocode (convert coordinates to address)
  export const reverseGeocode = async (latitude, longitude) => {
    try {
      const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`,
      )
  
      const data = await response.json()
  
      if (data.status === "OK" && data.results.length > 0) {
        return {
          formattedAddress: data.results[0].formatted_address,
          success: true,
        }
      } else {
        console.error("Reverse geocoding error:", data.status)
        return {
          success: false,
          error: `Reverse geocoding failed: ${data.status}`,
        }
      }
    } catch (error) {
      console.error("Error reverse geocoding:", error)
      return {
        success: false,
        error: "Failed to reverse geocode coordinates",
      }
    }
  }
  
  