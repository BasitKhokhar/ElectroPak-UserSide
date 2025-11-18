import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ActivityIndicator, ScrollView
} from 'react-native';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import Constants from 'expo-constants';
import colors from '../../Themes/colors';

const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const UserDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user_id, subtotal, shipping_charges, total_amount, cart_items } = route.params || {};

  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', receipt_url: null });
  const [selectedImage, setSelectedImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleImagePick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'You need to grant permission to access media library.');
      return;
    }

    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
      });

      if (!result.canceled) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Image selection failed');
    }
  };

  const uploadImageAndSubmit = async () => {
    if (!form.name || !form.phone || !form.city || !form.address || !selectedImage) {
      Alert.alert('Error', 'Please fill in all fields before submitting.');
      return;
    }

    setUploading(true);
    let receiptUrl = null;

    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const storageRef = ref(storage, `receipts/${Date.now()}`);
      await uploadBytes(storageRef, blob);
      receiptUrl = await getDownloadURL(storageRef);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Image upload failed.');
      setUploading(false);
      return;
    }

    try {
      const requestData = {
        ...form, receipt_url: receiptUrl, user_id, subtotal, shipping_charges, total_amount, cart_items
      };

      setLoading(true);
      const responseApi = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const responseData = await responseApi.json();
      if (!responseApi.ok) throw new Error(responseData.message || 'Failed to submit order');

      Alert.alert('Success', 'Your Order is in Progress. You will soon get Order Confirmation message!');
      navigation.navigate('Checkout');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', `Submission failed: ${error.message}`);
    } finally {
      setUploading(false);
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground }]}>
      <ScrollView  showsVerticalScrollIndicator={false}>
        <Text style={styles.header}>Enter Your Details</Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            placeholderTextColor={colors.mutedText}
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor={colors.mutedText}
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(text) => setForm({ ...form, phone: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            placeholder="City"
            placeholderTextColor={colors.mutedText}
            value={form.city}
            onChangeText={(text) => setForm({ ...form, city: text })}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={[styles.input, { height: 100 }]}
            placeholder="Address"
            placeholderTextColor={colors.mutedText}
            multiline
            value={form.address}
            onChangeText={(text) => setForm({ ...form, address: text })}
          />
        </View>

        <Text style={styles.infoText}>
          Upload the receipt of 20% advance that you have paid from your JazzCash or EasyPaisa App.
        </Text>

        <TouchableOpacity style={[styles.uploadButton, { backgroundColor: colors.primary }]} onPress={handleImagePick}>
          <Text style={styles.uploadText}>Select Receipt</Text>
        </TouchableOpacity>

        {selectedImage && <Image source={{ uri: selectedImage }} style={styles.imagePreview} />}
        {uploading && <ActivityIndicator size="large" color={colors.primary} />}

        <TouchableOpacity
          style={[styles.submitButton, { backgroundColor: colors.accent }]}
          onPress={uploadImageAndSubmit}
          disabled={loading || uploading}
        >
          <Text style={styles.submitText}>{loading ? 'Submitting...' : 'Confirm Order'}</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>

  );
};

const styles = StyleSheet.create({

  container: { flex: 1, padding: 16, paddingBottom: 40 },
  header: { fontSize: 24, fontWeight: 'bold', color: colors.text, textAlign: 'center', marginBottom: 20 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 14, color: colors.mutedText, marginBottom: 6 },
  input: {
    backgroundColor: colors.cardsbackground,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    padding: 12,
  },
  infoText: { fontSize: 14, color: colors.mutedText, marginBottom: 10 },
  uploadButton: { padding: 14, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  uploadText: { color: colors.cardsbackground, fontWeight: 'bold' },
  imagePreview: { width: '100%', height: 200, borderRadius: 8, marginBottom: 12 },
  submitButton: { padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  submitText: { color: colors.cardsbackground, fontSize: 16, fontWeight: 'bold' },
});

export default UserDetailsScreen;
