import { TextInput, Text, View } from 'react-native';
export default function Input({ 
  label, 
  value, 
  onChangeText, 
  placeholder,
  error,
  editable = true,
  ...props 
}) {
  return (
    <View className="">
      {label && (
        <Text className="text-sm font-medium text-secondary">{label}</Text>
      )}
      <TextInput
        className={`
          border rounded-lg px-4 py-3 text-base
          ${error ? 'border-red-400' : 'border-gray-300'}
          ${!editable ? 'bg-gray-50' : 'bg-white'}
          focus:border-primary
        `}
        style={{ color: "#111" }}        // text + cursor visible
        //selectionColor="#ff0000"            // cursor color
        cursorColor="#111"               
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-xs mt-1 px-1">{error}</Text>
      )}
    </View>
  );
}