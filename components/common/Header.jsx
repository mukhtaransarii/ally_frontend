import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from "@expo/vector-icons";

export default function Header({title, icon, handleIcon}) {
  
  return (
    <View className="h-16 bg-red-100 flex-row justify-between items-center px-4">
     {title && <Text className="font-semibold">{title}</Text>}
  
     {icon && ( 
      <TouchableOpacity onPress={handleIcon}>
       <Ionicons name={icon} size={22} color="black" /> 
      </TouchableOpacity>
     )}
    </View>
  );
}