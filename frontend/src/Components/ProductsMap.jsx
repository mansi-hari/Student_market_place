"use client"

import { useEffect, useRef, useState } from "react"
import { Loader } from "lucide-react"
import { calculateDistance } from "../utils/geocodingService"

const ProductsMap = ({ products, userLocation, onProductSelect }) => {
  const mapRef = useRef(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState(null)
  const [markers, setMarkers] = useState([])
  const [infoWindow, setInfoWindow] = useState(null)

  // Load Google Maps script
  useEffect(() => {
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

  // Initialize map when the script is loaded and user location is available
  useEffect(() => {
    if (mapLoaded && userLocation && mapRef.current) {
      // Create map centered on user location
      const mapOptions = {
        center: {
          lat: userLocation.latitude,
          lng: userLocation.longitude,
        },
        zoom: 12,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      }

      const newMap = new window.google.maps.Map(mapRef.current, mapOptions)
      setMap(newMap)

      // Create info window
      const newInfoWindow = new window.google.maps.InfoWindow()
      setInfoWindow(newInfoWindow)

      // Add user location marker
      new window.google.maps.Marker({
        position: {
          lat: userLocation.latitude,
          lng: userLocation.longitude,
        },
        map: newMap,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#4285F4",
          fillOpacity: 0.8,
          strokeColor: "#ffffff",
          strokeWeight: 2,
        },
        title: "Your Location",
      })
    }
  }, [mapLoaded, userLocation])

  // Add product markers when products or map changes
  useEffect(() => {
    if (map && products && products.length > 0 && userLocation) {
      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null))

      // Create new markers
      const newMarkers = products
        .map((product) => {
          if (!product.location || !product.location.coordinates) return null

          const { latitude, longitude } = product.location.coordinates

          // Calculate distance from user
          const distance = calculateDistance(userLocation, product.location.coordinates)

          // Create marker
          const marker = new window.google.maps.Marker({
            position: { lat: latitude, lng: longitude },
            map: map,
            title: product.title,
            animation: window.google.maps.Animation.DROP,
          })

          // Add click listener to marker
          marker.addListener("click", () => {
            if (infoWindow) {
              // Create info window content
              const content = `
              <div class="p-2">
                <div class="font-bold text-lg mb-1">${product.title}</div>
                <div class="text-green-600 font-bold mb-1">₹${product.price.toLocaleString()}</div>
                <div class="text-sm text-gray-600 mb-1">${distance.toFixed(1)} km away</div>
                <button id="view-product-${product.id}" class="bg-blue-500 text-white px-2 py-1 rounded text-sm">
                  View Details
                </button>
              </div>
            `

              infoWindow.setContent(content)
              infoWindow.open(map, marker)

              // Add event listener to the button after the info window is opened
              setTimeout(() => {
                const button = document.getElementById(`view-product-${product.id}`)
                if (button) {
                  button.addEventListener("click", () => {
                    onProductSelect(product)
                  })
                }
              }, 10)
            }
          })

          return marker
        })
        .filter(Boolean)

      setMarkers(newMarkers)

      // Fit bounds to include all markers
      if (newMarkers.length > 0) {
        const bounds = new window.google.maps.LatLngBounds()
        bounds.extend({
          lat: userLocation.latitude,
          lng: userLocation.longitude,
        })

        newMarkers.forEach((marker) => {
          bounds.extend(marker.getPosition())
        })

        map.fitBounds(bounds)

        // Don't zoom in too far
        const listener = window.google.maps.event.addListener(map, "idle", () => {
          if (map.getZoom() > 15) {
            map.setZoom(15)
          }
          window.google.maps.event.removeListener(listener)
        })
      }
    }
  }, [map, products, userLocation, infoWindow, onProductSelect])

  return (
    <div className="h-[500px] rounded-lg overflow-hidden shadow-md relative">
      <div ref={mapRef} style={{ height: "100%", width: "100%" }} />
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader className="h-8 w-8 text-blue-500 animate-spin" />
        </div>
      )}
    </div>
  )
}

export default ProductsMap

