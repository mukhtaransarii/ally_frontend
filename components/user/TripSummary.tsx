import React, { useEffect, useState, useRef } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTrip } from "@/contexts/TripContext";
import { useUser } from "@/contexts/UserContext";
import { reverseGeocode } from "@/utils/SearchAddress";
import { getRoute } from "@/utils/getRoute";
import axios from 'axios'
import { BASE_URL } from '@/env.js'
import { useAuth } from '@/contexts/AuthContext'
import { getSocket } from '@/utils/socket'
import Toast from "react-native-toast-message";

export default function TripSummary() {
  const { token } = useAuth();
  const { pickup, setPickup, setStep, step } = useUser();
  const { companions, setCompanions, setTrip } = useTrip();
  
  const [selectedCompanion, setSelectedCompanion] = useState(null)
  
  const { height } = Dimensions.get("window");

  // Cal Address, Distance & Duration
  useEffect(() => {
    if (!pickup || !companions.length) return;
  
    const hasEnriched = companions[0]?.distance && companions[0]?.duration;
    if (hasEnriched) return;
  
    const loadData = async () => {
      const result = await Promise.all(
        companions.map(async (c) => {
          const addr = await reverseGeocode(c.lat, c.lng);
          const data = await getRoute(pickup.lng, pickup.lat, c.lng, c.lat);
          const r = data.routes[0];
  
          return {
            ...c,
            address: addr,
            distance: r.distance >= 1000 ? `${(r.distance / 1000).toFixed(1)}km` : `${Math.round(r.distance)}m`,
            duration: r.duration >= 3600 ? `${Math.floor(r.duration / 3600)}h ${Math.floor((r.duration % 3600) / 60)}m` : `${Math.floor(r.duration / 60)}m`,
          };
        })
      );
      setCompanions(result);
    };
   
    loadData();
  }, [pickup]);

  
  // Handle Back
  const handleBack = async () => {
    setPickup(null);
    setCompanions([]);
    setStep(1);
  };
  
  const HandleConfirm = () => {
    Alert.alert(
     "Confirm Trip",
     "would you like to.continue trip?",
     [
       {
         text: 'Cancel',
         style: 'cancel'
       },
       {
         text: 'Continue',
         style: 'default',
         onPress: () => handleContinueTrip()
       }
     ]
    )
  }
  
  // Handle Continue
  const handleContinueTrip = async () => {
    if (!selectedCompanion) return;
    
    try {
      const { data } = await axios.post(`${BASE_URL}/api/trip/confirm`,
        {
          companionId: selectedCompanion._id,
          pickup,
          distance: selectedCompanion.distance,
          duration: selectedCompanion.duration
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      Toast.show({ type: data.success ? "success" : "error", text1: data.message,});
     
      if(!data.success) return
      
      setTrip(data.trip)
      
      //reset persist after create trip
      setCompanions([])
      setStep(3);
    } catch (e) {
      Toast.show({type: "error", text1: "Error Something went wrong"});
    }
  };

  
  return (
    <View className="absolute bottom-0 w-full bg-white rounded-t-3xl shadow-2xl">
    
      <View className="px-6 py-4">
        <Text className="text-xl font-bold text-gray-900">Trip Summary</Text>
        <Text className="text-sm text-gray-500">select companion from list ({companions.length})</Text>
      </View>

      <ScrollView style={{ maxHeight: height * 0.35 }} showsVerticalScrollIndicator={false}>
        <View className="px-6 gap-4">
          {companions.map((c) => (
              <TouchableOpacity
                key={c._id}
                onPress={() => setSelectedCompanion(c)}
                className={`rounded-xl p-3 border ${ selectedCompanion?._id == c._id ? "border-black bg-gray-50" : "border-gray-200" }`}
              >
               {/* 1. Horizental pfp + Name Distance + check mark */}
               <View className="flex-row items-center gap-2">
                  <Image source={{ uri: c.avatar }} className="w-11 h-11 rounded-full"/>
                  
                  {/* Name */}
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2">
                      <Text className="font-semibold text-gray-900">{c.name}</Text>
                      {/* Gender icon */}
                      {c.gender === "male" ? (
                          <Ionicons name="male" size={12} color="#45B6FE" />
                        ) : c.gender === "female" ? (
                          <Ionicons name="female" size={12} color="#FF69B4" />
                        ) : c.gender === "other" ? (
                          <Ionicons name="transgender" size={12} color="#A0A0A0" />
                      ) : null }
                    </View>
                    
                     {/* distance duration */}
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="location-outline" size={12} color="#000" />
                      <Text className="text-[11px] text-gray-700">{c?.distance || "--km"} • {c?.duration || "--m"}</Text>
                    </View>
                  </View>
                  
                   { selectedCompanion?._id == c._id && (
                    <View className="px-2 flex justify-center">
                      <Ionicons name="checkmark-circle" size={16} color="#000" />
                    </View>
                   )}
                </View>
                
                {/* 2. Skills + Bio + Address */}
                <View className="mt-2">
                  <View className="flex-row flex-wrap gap-2 mb-2">
                    {c?.skills.map((s) => (
                     <Text key={s} className="bg-black rounded-lg px-2 text-white  self-start text-xs">{s}</Text>
                    ))}
                  </View>
                  <View className="bg-gray-100 rounded-lg p-2 mb-2">
                   <Text className="text-xs mb-1 text-gray-500">Bio</Text>
                   <Text className="text-sm">
                      {c?.bio.trim('').match(/(#[^\s#]+|\S+|\s+)/g)?.map((segment, index) => {
                        if (segment.startsWith('#')) {
                          return (
                            <Text key={index} style={{ color: '#1DA1F2' }}>
                              {segment}
                            </Text>
                          );
                        }
                        return segment;
                      })}
                    </Text>
                 </View>  
                 <Text numberOfLines={2} className="text-sm text-gray-600 leading-none">{c.address?.display_name ||"Fetching address..."}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </View>
      </ScrollView>
      
      {/* Action Button */}
      <View className="flex-row gap-3 px-6 py-4">
        <TouchableOpacity
          onPress={handleBack}
          className="flex-1 py-3 rounded-xl border border-gray-300"
        >
          <Text className="text-center font-semibold text-gray-900">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={HandleConfirm}
          disabled={!selectedCompanion}
          className={`flex-1 py-3 rounded-xl ${selectedCompanion ? "bg-black" : "bg-gray-300"}`}
        >
          <Text className="text-center font-semibold text-white">Continue Trip</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
