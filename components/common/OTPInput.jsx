import { View, TextInput } from 'react-native';
import { useState, useRef } from 'react';

export default function OTPInput({ onComplete }) {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputs = useRef([]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) inputs.current[index + 1]?.focus();
    if (newOtp.every(d => d)) onComplete(newOtp.join(''));
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-row justify-between">
      {otp.map((_, index) => (
        <TextInput
          key={index}
          ref={ref => inputs.current[index] = ref}
          className={`
            w-14 h-14 border-2 rounded-lg 
            text-center text-2xl font-bold
            ${otp[index] ? 'border-primary bg-primary/10' : 'border-gray-300 bg-gray-50'}
          `}
          keyboardType="numeric"
          maxLength={1}
          value={otp[index]}
          onChangeText={(text) => handleChange(text, index)}
          onKeyPress={(e) => handleKeyPress(e, index)}
          selectTextOnFocus
        />
      ))}
    </View>
  );
}