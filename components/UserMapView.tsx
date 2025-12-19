import React, { useState, useRef, useEffect } from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import usePolyline from '@/hooks/usePolyline';
import { customStyle } from '../utils/mapCustomUI'

export default function UserMapView({marker1, marker2, polyline = []}) {
  const mapRef = useRef(null);
  const defaultLocation = { lat: 28.6139, lng: 77.2090 }; // Delhi

  // Animate map when pickup updates
  useEffect(() => {
    if (!mapRef.current || !marker1) return;
    mapRef.current.animateToRegion(
      {
        latitude: marker1.lat,
        longitude: marker1.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      },
      800
    );
  }, [marker1]);
  
  // Animate map when polyline updates
  useEffect(() => {
    if (!mapRef.current || polyline.length === 0) return;
  
    mapRef.current.fitToCoordinates(polyline, {
      edgePadding: { top: 40, right: 80, bottom: 280, left: 80 },
      animated: true,
    });
  }, [polyline]);

  return (
    <MapView
      ref={mapRef}
      style={{ flex: 1 }}
      provider={PROVIDER_GOOGLE}
      customMapStyle={customStyle}
      showsBuildings={false}
      showsTraffic={false}
      initialRegion={{
        latitude: defaultLocation.lat,
        longitude: defaultLocation.lng,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }}
      showsUserLocation={false}
      showsMyLocationButton={false}
      loadingEnabled={true}
    >
      {marker1 && (
        <Marker coordinate={{ latitude: marker1?.lat, longitude: marker1?.lng }}>
          <Ionicons name="location" size={28} color="#000000" />
        </Marker>
      )}

      {marker2 && (
        <Marker coordinate={{ latitude: marker2.lat, longitude: marker2.lng }}>
          <Ionicons name="location" size={28} color="000000" />
        </Marker>
      )}

      {polyline.length > 0 && <Polyline coordinates={polyline} strokeWidth={4} strokeColor="#000000" />}
    </MapView>
  );
}
