import { useState } from 'react';
import { View } from 'react-native';
import GoOnlineToggle from '@/components/GoOnlineToggle';
import UserMapView from '@/components/UserMapView';
import { usePartner } from '@/contexts/PartnerContext'

export default function Index() {
  const { step, partnerLocation, } = usePartner();
  console.log('partnerLocation from.index :', partnerLocation)
  
  return (
    <View className="flex-1">
      <UserMapView  
       marker1={partnerLocation}
      />
      {step === 1 &&  <GoOnlineToggle/> }
    </View>
  );
}

