import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Terms() {
  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-3xl font-bold mb-4 text-center">Terms & Conditions</Text>
      <View className="px-4 relative">
        <Text className="text-xs text-center text-gray-600">
          Me kya...!! khud pe.dhyan de
          Hamara kya hai hum to pehle se hi badnaam hai 💅🏻{"\n"}
          aur haan, mehek pari hi kehde.
        </Text>
        
        <Text className="absolute -bottom-10 right-4 text-xs">~Mukhtar Alam</Text>
      </View>
    </View>
  );
}
