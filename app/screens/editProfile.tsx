import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, Alert, TouchableOpacity, Image, KeyboardAvoidingView, Platform  } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import Button from "@/components/common/Button.jsx";
import Input from "@/components/common/Input.jsx";
import { useAuth } from "@/contexts/authStore";
import { BASE_URL } from "@/env.js";
import axios from "axios";
import { Camera } from "lucide-react-native";

export default function EditProfile() {
  const router = useRouter();
  const { user, updateUser, token } = useAuth();
  
  // Form Data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    gender: "",
    address: { street: "", city: "", state: "", pincode: "" },
    emergencyContact: { name: "", phone: "", relation: "" },
  });

  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        gender: user.gender || "",
        address: {
          street: user.address?.street || "",
          city: user.address?.city || "",
          state: user.address?.state || "",
          pincode: user.address?.pincode || "",
        },
        emergencyContact: {
          name: user.emergencyContact?.name || "",
          phone: user.emergencyContact?.phone || "",
          relation: user.emergencyContact?.relation || "",
        },
      });

      setAvatar(user.avatar || "");
    }
  }, [user]);



  // HANDLE INPUT
  const handleChange = (field, v) => {
    setFormData((p) => ({ ...p, [field]: v }));
  };

  const handleNested = (parent, field, v) => {
    setFormData((p) => ({
      ...p,
      [parent]: { ...p[parent], [field]: v },
    }));
  };

  // IMAGE PICKER
  const pickAvatar = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) return Alert.alert("Permission needed");

    const img = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,        
      aspect: [1, 1],   
      quality: 0.7,
      base64: true,
    });

    if (!img.canceled) {
      const base64 = `data:image/jpeg;base64,${img.assets[0].base64}`;
      setAvatar(base64); // show instantly
    }
  };

  // VALIDATION
  const validate = () => {
    let e = {};
    if (!formData.name.trim()) e.name = "Name required";
    if (formData.phone && !/^\d{10}$/.test(formData.phone))
      e.phone = "Invalid phone";
    if (formData.emergencyContact.phone && !/^\d{10}$/.test(formData.emergencyContact.phone))
      e.emergencyPhone = "Invalid emergency phone";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // SUBMIT
  const handleSubmit = async () => {
    if (!validate()) return Alert.alert("Fix the errors first");

    setLoading(true);
    try {
      const payload = { ...formData, avatar };

      const { data } = await axios.post(`${BASE_URL}/api/user/edit-profile`, payload,
        { 
          headers: { Authorization: `Bearer ${token}` } 
        }
      );

      if (data.success) {
       updateUser(data.user);
       router.back()
      }
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  // **INITIALS**
  const getInitials = () => {
    if (formData.name)
      return formData.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

    return user?.email?.slice(0, 2).toUpperCase() || "TC";
  };

  // **UI (UNCHANGED, ORIGINAL)**
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} keyboardVerticalOffset={Platform.OS === "android" ? 25 : 0}>
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        
          {/* AVATAR */}
          <View className="relative items-center">
              <View className="w-32 h-32 rounded-full bg-[#CCF630] items-center justify-center">
                {avatar ? (
                  <Image className="w-full h-full rounded-full"
                    source={{ uri: avatar }}
                  />
                ) : (
                  <Text className="text-3xl font-bold text-gray-900"> {getInitials()}</Text>
                )}
              </View>
    
              {/* CHANGE BUTTON */}
              <TouchableOpacity
                className="absolute bottom-2 ml-16 bg-[#CCF630] w-10 h-10 rounded-full items-center justify-center border-2 border-white"
                onPress={pickAvatar}
              >
                <Camera size={18} color="#333" />
              </TouchableOpacity>
          </View>
         
    
          {/* FORM */}
          <View className="p-6 flex gap-6">
    
            {/* BASIC INFO */}
            <View className="">
              <View className="flex-row items-center">
                <Text className="text-lg font-semibold text-gray-800">Basic Information</Text>
                 {/*ICON HERE*/}
              </View>
    
              <View className="flex gap-2">
                <Input
                  label="Full Name *"
                  value={formData.name}
                  placeholder="Enter your full name"
                  onChangeText={(v) => handleChange("name", v)}
                  error={errors.name}
                />
    
                <Input
                  label="Email"
                  value={formData.email}
                  placeholder="Enter your email"
                  onChangeText={(v) => handleChange("email", v)}
                  error={errors.email}
                />
    
                <Input
                  label="Phone Number"
                  placeholder="Ex 99XXXXXXXX"
                  value={formData.phone}
                  onChangeText={(v) => handleChange("phone", v)}
                  error={errors.phone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
    
                {/* GENDER */}
                <View>
                  <Text className="text-sm font-medium text-[#333]">
                    Gender
                  </Text>
                  <View className="flex-row space-x-4">
                    {["male", "female", "other"].map((g) => (
                      <TouchableOpacity
                        key={g}
                        onPress={() => handleChange("gender", g)}
                        className={`flex-1 py-3 rounded-lg border ${
                          formData.gender === g
                            ? "border-[#CCF630] bg-[#CCF630]/10"
                            : "border-gray-300"
                        }`}
                      >
                        <Text
                          className={`text-center capitalize text-sm ${
                            formData.gender === g
                              ? "text-[#333] font-medium"
                              : "text-gray-600"
                          }`}
                        >
                          {g}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
    
                <Input
                  label="Bio"
                  placeholder="Tell us about yourself..."
                  value={formData.bio}
                  onChangeText={(v) => handleChange("bio", v)}
                  multiline
                  numberOfLines={3}
                />
              </View>
            </View>
    
            {/* ADDRESS */}
            <View className="">
              <View className="flex-row items-center">
                <Text className="text-lg font-semibold text-gray-800">Address Information</Text>
                 {/*ICON HERE*/}
              </View>
    
              <View className="flex gap-2">
                <Input
                  label="Street"
                  placeholder="Street address"
                  value={formData.address.street}
                  onChangeText={(v) => handleNested("address", "street", v)}
                />
                
                  <Input
                    label="City"
                    placeholder="Enter City"
                    value={formData.address.city}
                    onChangeText={(v) => handleNested("address", "city", v)}
                  />
    
                  <Input
                    label="State"
                    placeholder="Enter State"
                    value={formData.address.state}
                    onChangeText={(v) => handleNested("address", "state", v)}
                  />
    
                <Input
                  label="Pincode"
                  placeholder="Enter Pincode"
                  value={formData.address.pincode}
                  onChangeText={(v) => handleNested("address", "pincode", v)}
                  keyboardType="number-pad"
                  maxLength={6}
                />
              </View>
            </View>
    
            {/* EMERGENCY CONTACT */}
            <View className="">
              <View className="flex-row items-center">
                <Text className="text-lg font-semibold text-gray-800">Emergency Contact</Text>
                 {/*ICON HERE*/}
              </View>
    
              <View className="flex gap-2">
                <Input
                  label="Contact Name"
                  placeholder="Enter name of relative"
                  value={formData.emergencyContact.name}
                  onChangeText={(v) =>
                    handleNested("emergencyContact", "name", v)
                  }
                />
    
                <Input
                  label="Contact Phone *"
                  placeholder="Enter contact of relative"
                  value={formData.emergencyContact.phone}
                  onChangeText={(v) =>
                    handleNested("emergencyContact", "phone", v)
                  }
                  error={errors.emergencyPhone}
                  keyboardType="phone-pad"
                  maxLength={10}
                />
    
                <Input
                  label="Relationship"
                  placeholder="Enter relation"
                  value={formData.emergencyContact.relation}
                  onChangeText={(v) =>
                    handleNested("emergencyContact", "relation", v)
                  }
                />
              </View>
            </View>
    
            {/* SAVE BUTTON */}
            <View className="space-y-4 pt-6">
              <Button
                title={loading ? "Saving..." : "Save Changes"}
                onPress={handleSubmit}
                loading={loading}
                disabled={loading}
                variant="primary"
              />
    
              <TouchableOpacity onPress={() => router.back()} className="py-4">
                <Text className="text-center text-gray-500 font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
         </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
