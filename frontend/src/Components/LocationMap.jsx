"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "lucide-react"

const LocationMap = ({ coordinates, height = "300px", zoom = 15, interactive = true }) => {
  const mapRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState(null)
  const [marker, setMarker] = useState(null)

  useEffect(() => {
    // Load Google Maps script if not already loaded
    if (!window.google || !window.google.maps) {
      const script = document.createElement("script")
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = () => {
        setMapLoaded(true)
      }
      document.head.appendChild(script)
    } else {
      setMapLoaded(true)
    }
  }, [])

  // Initialize map when the script is loaded and coordinates are available
  useEffect(() => {
    if (mapLoaded && coordinates && mapRef.current) {
      const mapOptions = {
        center: {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
        },
        zoom: zoom,
        disableDefaultUI: !interactive,
        zoomControl: interactive,
        scrollwheel: interactive,
        draggable: interactive,
      }

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions)
      setMap(newMap)

      const newMarker = new window.google.maps.Marker({
        position: {
          lat: coordinates.latitude,
          lng: coordinates.longitude,
        },
        map: newMap,
        animation: window.google.maps.Animation.DROP,
      })
      setMarker(newMarker)
    }
  }, [mapLoaded, coordinates, zoom, interactive])

  // Update marker position when coordinates change
  useEffect(() => {
    if (map && marker && coordinates) {
      const position = {
        lat: coordinates.latitude,
        lng: coordinates.longitude,
      }
      marker.setPosition(position)
      map.panTo(position)
    }
  }, [coordinates, map, marker])

  if (!coordinates) {
    return (
      <div style={{ height }} className="bg-gray-100 flex items-center justify-center rounded-md">
        <p className="text-gray-500">No location selected</p>
      </div>
    )
  }

  return (
    <div style={{ height }} className="relative rounded-md overflow-hidden">
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      )}
    </div>
  )
}

export default LocationMap

