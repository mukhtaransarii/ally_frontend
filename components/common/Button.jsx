import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

export default function Button({ 
  title, 
  onPress, 
  loading = false,
  disabled = false,
  variant = 'primary',
  className,
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={` ${className}
        p-4 rounded-lg 
        ${variant === 'primary' ? 'bg-[#000000]' : 'bg-gray-300'}
        ${disabled ? 'bg-gray-300' : ''}
        ${(disabled || loading) ? 'opacity-60' : 'active:opacity-80'}
      `}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#333333' : '#666666'} />
      ) : (
        <Text className={`
          text-center font-semibold text-base
          ${variant === 'primary' ? 'text-white' : 'text-gray-800'}
        `}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}