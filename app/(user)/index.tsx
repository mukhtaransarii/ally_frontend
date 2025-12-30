import { useEffect } from 'react';
import { View, Text } from 'react-native';
import { useAuth } from "@/contexts/AuthContext"
import { useUser } from '@/contexts/UserContext'
import { useTrip } from '@/contexts/TripContext'
import usePolyline from '@/hooks/usePolyline'
import MapView from '@/components/MapView'
import LocationPicker from '@/components/user/LocationPicker'
import TripSummary from '@/components/user/TripSummary'
import TripPending from '@/components/user/TripPending'

export default function UserMainPage() {
  const { step, pickup } = useUser();
  const { companions, selectedCompanion, trip } = useTrip();
  const { user, token } = useAuth(); 
  
  const { routeCoords } = usePolyline(pickup, selectedCompanion); // pass props
  
  
  return (
    <View className="flex-1">
      <MapView
        marker1={pickup}
        marker2={selectedCompanion}
        polyline={routeCoords}
      /> 
      
      {step === 1 && (!pickup || companions?.length === 0) && <LocationPicker />} 
      {step === 2 && pickup && companions?.length > 0 && <TripSummary/> }
      {step === 3 && trip?.status === 'pending' && <TripPending/>}
    </View>
  );
}