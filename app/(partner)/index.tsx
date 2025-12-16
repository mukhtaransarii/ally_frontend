import { useState } from 'react';
import { View } from 'react-native';
import GoOnlineToggle from '@/components/GoOnlineToggle';
import UserMapView from '@/components/UserMapView';
import { usePartner } from '@/contexts/PartnerContext'

export default function Index() {
  const { step, parCurLoc, } = usePartner();
  console.log("parCurLoc from imdex:", parCurLoc)
  
  return (
    <View className="flex-1">
      <UserMapView  
       marker1={parCurLoc}
      />
      {step === 1 &&  <GoOnlineToggle/> }
    </View>
  );
}

