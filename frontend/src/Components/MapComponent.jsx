import React, { useState, useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = ({ location }) => {
  const [mapCenter, setMapCenter] = useState({
    lat: 18.5204, // Default center point for Pune (you can adjust it based on your location)
    lng: 73.8567,
  });

  useEffect(() => {
    if (location) {
      setMapCenter({
        lat: location.lat,
        lng: location.lng,
      });
    }
  }, [location]);

  // Fix for missing Leaflet marker icon issue (image not appearing in some cases)
  const defaultIcon = new L.Icon({
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    tooltipAnchor: [16, -28],
  });

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ width: '100%', height: '100px' }}
      scrollWheelZoom={false}
    >
      {/* Tile Layer (Using OpenStreetMap tiles) */}
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {/* Marker */}
      <Marker position={mapCenter} icon={defaultIcon}>
        <Popup>
          <span>Location: {mapCenter.lat}, {mapCenter.lng}</span>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default MapComponent;
