import { useEffect } from 'react';
import { View, Text } from 'react-native';
import UserMapView from '@/components/UserMapView'
import LocationPicker from '@/components/LocationPicker'
import TripSummary from '@/components/TripSummary'
import { useUser } from '@/contexts/UserContext'
import { useTrip } from '@/contexts/TripContext'
import usePolyline from '@/hooks/usePolyline'
import useUserLocation from '@/hooks/useUserLocation';       // ✅ user tracking
import useCompanionLocation from '@/hooks/useCompanionLocation'; // ✅ companion movement

export default function UserMainPage() {
  const { step, pickup } = useUser();
  const { companions, selectedCompanion } = useTrip();
  
  useUserLocation();       
  useCompanionLocation(); 
  const { routeCoords } = usePolyline(pickup, selectedCompanion); // pass props

  return (
    <View className="flex-1">
      <UserMapView
        marker1={pickup}
        marker2={selectedCompanion}
        polyline={routeCoords}
      /> 
      
      {(!pickup || companions.length === 0) && <LocationPicker />} 
      {step === 2 && pickup && companions.length > 0 && <TripSummary/> }
    </View>
  );
}