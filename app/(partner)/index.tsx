import { useState, useEffect } from 'react';
import { View, Alert, Text } from 'react-native';
import axios from 'axios'
import { BASE_URL } from '@/env.js'
import { usePartner } from '@/contexts/PartnerContext'
import { useTrip } from '@/contexts/TripContext'
import { useAuth } from "@/contexts/AuthContext"
import { getSocket } from '@/utils/socket'
import usePolyline from '@/hooks/usePolyline'
import useLiveLocation from '@/hooks/useLiveLocation'
import MapView from '@/components/MapView';
import GoOnlineToggle from '@/components/partner/GoOnlineToggle';
import TripNotification from '@/components/partner/TripNotification';

export default function Index() {
  const { partnerStep, setPartnerStep, partnerLocation, } = usePartner();
  const { setTrip, trip, userCreatedTrip, setUserCreatedTrip } = useTrip(); 
  const { user, token } = useAuth(); 
  
  //useLiveLocation(trip, trip?.status === "accepted");
  const { routeCoords } = usePolyline(partnerLocation, trip?.pickup); // pass props
  
  return (
    <View className="flex-1">
      <MapView  
       marker1={partnerLocation}
       marker2={trip?.pickup}
       polyline={routeCoords}
      />
      
      {partnerStep === 1 && !trip &&  <GoOnlineToggle/> }
      {trip && <TripNotification/>}
    </View>
  );
}

