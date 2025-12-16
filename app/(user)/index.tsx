import { useEffect } from 'react';
import { View, Text } from 'react-native';
import UserMapView from '@/components/UserMapView'
import LocationPicker from '@/components/LocationPicker'
import TripSummary from '@/components/TripSummary'
import { useUser } from '@/contexts/UserContext'
import { usePartner } from '@/contexts/PartnerContext'
import usePolyline from '@/hooks/usePolyline'
import useUserLocation from '@/hooks/useUserLocation';       // ✅ user tracking
import useCompanionLocation from '@/hooks/useCompanionLocation'; // ✅ companion movement

export default function UserMainPage() {
  const { step, pickup, setDistance, setEta } = useUser();
  const { companion } = usePartner();
  
  useUserLocation();       // updates pickup in real-time
  useCompanionLocation();  // updates companion location locally in frontend

  const { routeCoords } = usePolyline(pickup, companion, setDistance, setEta); // pass props
  
  return (
    <View className="flex-1">
      <UserMapView
        marker1={pickup}
        marker2={companion}
        polyline={routeCoords}
      /> 
      {step === 1 && <LocationPicker/> }
      {step === 2 && <TripSummary/> }
    </View>
  );
}