import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { colors } from "../../Themes/colors";  // ✅ THEME IMPORT

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const AccountDetailScreen = ({ route }) => {
  const { userData } = route.params;

  const [name, setName] = useState(userData.name || "");
  const [email, setEmail] = useState(userData.email || "");
  const [phone, setPhone] = useState(userData.phone || "");
  const [city, setCity] = useState(userData.city || "");

  const [uploading, setUploading] = useState(false);
  const [updating, setUpdating] = useState(false);

  // Pick Profile Image
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      uploadImageToFirebase(result.assets[0].uri);
    }
  };

  const uploadImageToFirebase = async (uri) => {
    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const userId = await AsyncStorage.getItem("userId");
      const fileRef = ref(storage, `profileImages/${userId}.jpg`);

      await uploadBytes(fileRef, blob);
      const imageUrl = await getDownloadURL(fileRef);
      saveImageUrlToDatabase(userId, imageUrl);
    } catch (error) {
      console.error("Image upload error:", error);
    }
    setUploading(false);
  };

  const saveImageUrlToDatabase = async (userId, imageUrl) => {
    try {
      const response = await fetch(`${API_BASE_URL}/upload-profile-image`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId, image_url: imageUrl }),
      });

      const data = await response.json();
      console.log("Image upload response:", data);
    } catch (error) {
      console.error("Error saving image URL:", error);
    }
  };

  const updateUserDetails = async () => {
    setUpdating(true);
    try {
      const userId = await AsyncStorage.getItem("userId");

      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          city,
        }),
      });

      const result = await response.json();
      console.log("Update Response:", result);

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("Error updating details:", error);
      Alert.alert("Error", "Failed to update profile.");
    }
    setUpdating(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      {/* <Text style={[styles.title, { color: colors.text }]}>Account Details</Text> */}
      <Text style={[styles.subtitle, { color: colors.mutedText }]}>
        You can view and update your personal details
      </Text>

      <View style={styles.formContainer}>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Full Name"
          placeholderTextColor={colors.mutedText}
          style={[
            styles.input,
            { backgroundColor: colors.cardsbackground, borderColor: colors.border, color: colors.text },
          ]}
        />

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email Address"
          placeholderTextColor={colors.mutedText}
          keyboardType="email-address"
          style={[
            styles.input,
            { backgroundColor: colors.cardsbackground, borderColor: colors.border, color: colors.text },
          ]}
        />

        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone Number"
          placeholderTextColor={colors.mutedText}
          keyboardType="phone-pad"
          style={[
            styles.input,
            { backgroundColor: colors.cardsbackground, borderColor: colors.border, color: colors.text },
          ]}
        />

        <TextInput
          value={city}
          onChangeText={setCity}
          placeholder="City"
          placeholderTextColor={colors.mutedText}
          style={[
            styles.input,
            { backgroundColor: colors.cardsbackground, borderColor: colors.border, color: colors.text },
          ]}
        />

        <TouchableOpacity
          onPress={updateUserDetails}
          style={[styles.button, { backgroundColor: colors.primary }]}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Update Details</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={pickImage}
          style={[styles.buttonSecondary, { backgroundColor: colors.accent }]}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Upload Profile Image</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 5,
  },

  subtitle: {
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
  },

  formContainer: {
    marginTop: 10,
    gap: 15,
  },

  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
  },

  button: {
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonSecondary: {
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 10,
  },

  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default AccountDetailScreen;
