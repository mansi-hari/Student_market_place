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
  const savedLocation = localStorage.getItem("selectedLocation")
  return savedLocation ? JSON.parse(savedLocation) : null
}

// Format location for display
export const formatLocation = (location) => {
  if (!location) return ""
  return `${location.name}, ${location.address}`
}

// Get location query parameter for API calls
export const getLocationQueryParam = (location) => {
  if (!location) return ""
  return `&location=${location.pinCode || location.name}`
}

