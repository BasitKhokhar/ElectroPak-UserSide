import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import colors from "../../Themes/colors"; // import your theme
import Constants from 'expo-constants';
const API_BASE_URL = Constants.expoConfig.extra.API_BASE_URL;

const UserNameDisplay = () => {
  const [userName, setUserName] = useState("");
  const [userImage, setUserImage] = useState(null);

  useEffect(() => {
    const fetchUserName = async () => {
      const storedUserId = await AsyncStorage.getItem("userId");
      if (storedUserId) {
        try {
          const response = await fetch(`${API_BASE_URL}/users/${storedUserId}`);
          if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
          const data = await response.json();
          setUserName(data.name);

          const imageResponse = await fetch(`${API_BASE_URL}/user_images/${storedUserId}`);
          if (imageResponse.ok) {
            const imageData = await imageResponse.json();
            setUserImage(imageData.image_url);
          }
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      }
    };
    fetchUserName();
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.bodybackground}]}>
      <View style={styles.header}>
        <Text style={[styles.text, { color: colors.primary }]}>
          {userName ? `Welcome, ${userName}!` : "Loading..."}
        </Text>
        <View style={styles.imageContainer}>
          {userImage ? (
            <Image source={{ uri: userImage }} style={styles.profileImage} />
          ) : (
            <View style={[styles.defaultProfileCircle, { backgroundColor: colors.cardsbackground }]} />
          )}
        </View>
      </View>

      <Text style={[styles.text1, { color: colors.text, borderTopColor: colors.primary }]}>
        Explore a wide range of Electricity products and expert electrician services.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "flex-start",
    width: "100%",
    paddingTop: 20,
    paddingBottom: 20,
    borderBottomRightRadius: 70,
  },
  text: { fontSize: 24, fontWeight: "bold" },
  text1: {
    fontSize: 18,
    fontWeight: '500',
    marginLeft: 25,
    marginRight: 27,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
  },
  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingBottom: 10,
  },
  imageContainer: { width: 50, height: 50, borderRadius: 50, overflow: "hidden" },
  profileImage: { width: "100%", height: "100%", borderRadius: 50, borderWidth: 2, borderColor: colors.cardsbackground },
  defaultProfileCircle: { width: 50, height: 50, borderRadius: 50, borderWidth: 2, borderColor: colors.cardsbackground },
});

export default UserNameDisplay;
